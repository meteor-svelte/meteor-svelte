import htmlparser from 'htmlparser2';
import postcss from 'postcss';
import sourcemap from 'source-map';

SvelteCompiler = class SvelteCompiler extends CachingCompiler {
  constructor(options = {}) {
    super({
      compilerName: 'svelte',
      defaultCacheSize: 1024 * 1024 * 10
    });

    this.options = options;
    this.babelCompiler = new BabelCompiler;

    // Don't attempt to require `svelte/compiler` during `meteor publish`.
    if (!options.isPublishing) {
      try {
        this.svelte = require('svelte/compiler');
      } catch (error) {
        throw new Error(
          'Cannot find the `svelte` package in your application. ' +
          'Please install it with `meteor npm install `svelte`.'
        );
      }
    }

    if (options.postcss) {
      this.postcss = postcss(options.postcss.map(plugin => {
        if (typeof plugin == 'string') {
          return require(plugin)();
        } else {
          const [packageName, options] = plugin;
          return require(packageName)(options);
        }
      }));
    }
  }

  getCacheKey(file) {
    return [
      this.options,
      file.getPathInPackage(),
      file.getSourceHash(),
      file.getArch()
    ];
  }

  setDiskCacheDirectory(cacheDirectory) {
    this.cacheDirectory = cacheDirectory;
    this.babelCompiler.setDiskCacheDirectory(cacheDirectory);
  }

  // The compile result returned from `compileOneFile` can be an array or an
  // object. If the processed HTML file is not a Svelte component, the result is
  // an array of HTML sections (head and/or body). Otherwise, it's an object
  // with JavaScript from a compiled Svelte component.
  compileResultSize(result) {
    let size = 0;

    if (Array.isArray(result)) {
      result.forEach(section => size += section.data.length);
    } else {
      size = result.data.length + result.sourceMap.toString().length;
    }

    return size;
  }

  getHtmlSections(file) {
    const path = file.getPathInPackage();
    const extension = path.substring(path.lastIndexOf('.') + 1);

    if (extension !== 'html') {
      return;
    }

    const code = file.getContentsAsString();
    const sections = [];
    let isSvelteComponent = true;

    htmlparser.parseDOM(code).forEach(el => {
      if (el.name === 'head' || el.name === 'body') {
        isSvelteComponent = false;

        sections.push({
          section: el.name,
          data: htmlparser.DomUtils.getInnerHTML(el).trim()
        });
      }
    });

    if (!isSvelteComponent) {
      return sections;
    }
  }

  compileOneFileLater(file, getResult) {
    // Search for top-level head and body tags. If at least one of these tags
    // exists, the file is not processed with the Svelte compiler. Instead, the
    // inner HTML of the tags is added to the respective section in the HTML
    // output generated by Meteor.
    const sections = this.getHtmlSections(file);

    if (sections) {
      sections.forEach(section => file.addHtml(section));
    } else {
      file.addJavaScript({
        path: file.getPathInPackage()
      }, async () => {
        return await getResult();
      });
    }
  }

  async compileOneFile(file) {
    // Search for head and body tags if lazy compilation isn't supported.
    // Otherwise, the file has already been parsed in `compileOneFileLater`.
    if (!file.supportsLazyCompilation) {
      const sections = this.getHtmlSections(file);

      if (sections) {
        return sections;
      }
    }

    let code = file.getContentsAsString();
    const basename = file.getBasename();
    const path = file.getPathInPackage();
    const arch = file.getArch();

    const svelteOptions = {
      dev: process.env.NODE_ENV !== 'production',
      filename: path,
      name: basename
        .slice(0, basename.indexOf('.')) // Remove extension
        .replace(/[^a-z0-9_$]/ig, '_') // Ensure valid identifier
    };

    // If the component was imported by server code, compile it for SSR.
    if (arch.startsWith('os.')) {
      svelteOptions.generate = 'ssr';
    } else {
      const { hydratable, css } = this.options;

      if (hydratable === true) {
        svelteOptions.hydratable = true;
      }

      if (css === false) {
        svelteOptions.css = false;
      }
    }

    if (this.postcss) {
      code = (await this.svelte.preprocess(code, {
        style: async ({ content, attributes }) => {
          if (attributes.lang == 'postcss') {
            return {
              code: await this.postcss.process(content, { from: undefined })
            }
          }
        }
      })).code;
    }

    try {
      return this.transpileWithBabel(
        this.svelte.compile(code, svelteOptions).js,
        path,
        file
      );
    } catch (e) {
      // Throw unknown errors.
      if (!e.start) {
        throw e;
      }

      let message;

      if (e.frame) {
        // Prepend a vertical bar to each line to prevent Meteor from trimming
        // whitespace and moving the code frame indicator to the wrong position.
        const frame = e.frame.split('\n').map(line => {
          return `| ${line}`;
        }).join('\n');

        message = `${e.message}\n\n${frame}`;
      } else {
        message = e.message;
      }

      file.error({
        message,
        line: e.start.line,
        column: e.start.column
      });
    }
  }

  addCompileResult(file, result) {
    if (Array.isArray(result)) {
      result.forEach(section => file.addHtml(section));
    } else {
      file.addJavaScript(result);
    }
  }

  transpileWithBabel(source, path, file) {
    const {
      data,
      sourceMap
    } = this.babelCompiler.processOneFileForTarget(file, source.code);

    return {
      sourcePath: path,
      path,
      data,
      sourceMap: this.combineSourceMaps(sourceMap, source.map)
    };
  }

  // Generates a new source map that maps a file transpiled by Babel back to the
  // original HTML via a source map generated by the Svelte compiler.
  combineSourceMaps(babelMap, svelteMap) {
    const result = new sourcemap.SourceMapGenerator;

    const babelConsumer = new sourcemap.SourceMapConsumer(babelMap);
    const svelteConsumer = new sourcemap.SourceMapConsumer(svelteMap);

    babelConsumer.eachMapping(mapping => {
      // Ignore mappings that don't have a source.
      if (!mapping.source) {
        return;
      }

      const position = svelteConsumer.originalPositionFor({
        line: mapping.originalLine,
        column: mapping.originalColumn
      });

      // Ignore mappings that don't map to the original HTML.
      if (!position.source) {
        return;
      }

      result.addMapping({
        source: position.source,
        original: {
          line: position.line,
          column: position.column
        },
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      });
    });

    // Copy source content from the source map generated by the Svelte compiler.
    // We can just take the first entry because only one file is involved in the
    // Svelte compilation and Babel transpilation.
    result.setSourceContent(
      svelteMap.sources[0],
      svelteMap.sourcesContent[0]
    );

    return result.toJSON();
  }
};
