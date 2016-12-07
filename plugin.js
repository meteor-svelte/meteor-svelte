var htmlparser = Npm.require('htmlparser2');
var svelte = Npm.require('svelte-es5-meteor');

Plugin.registerCompiler({
  extensions: ['html'],
}, function () {
  return new SvelteCompiler();
});

function SvelteCompiler() {}
var SCp = SvelteCompiler.prototype;

SCp.processFilesForTarget = function (files) {
  files.forEach(function (file) {
    this.processOneFileForTarget(file);
  }, this);
};

SCp.processOneFileForTarget = function (file) {
  var raw = file.getContentsAsString();
  var path = file.getPathInPackage();

  var isSvelteComponent = true;

  // Search for top level head and body tags. If at least one of these tags
  // exists, the file is not processed using the Svelte compiler. Instead, the
  // inner HTML of the tags is added to the respective section in the HTML
  // output produced by Meteor.
  htmlparser.parseDOM(raw).forEach(function (el) {
    if (el.name === 'head' || el.name === 'body') {
      isSvelteComponent = false;

      file.addHtml({
        section: el.name,
        data: htmlparser.DomUtils.getInnerHTML(el)
      });
    }
  });

  if (isSvelteComponent) {
    var result = svelte.compile(raw, {
      filename: path
    });

    var transpiled = Babel.compile(result.code, Babel.getDefaultOptions());

    file.addJavaScript({
      data: transpiled.code
    });
  }
};
