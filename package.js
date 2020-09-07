Package.describe({
  name: 'svelte:compiler',
  version: '3.21.0_1',
  summary: 'Svelte compiler',
  git: 'https://github.com/meteor-svelte/meteor-svelte.git',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'svelte-compiler',
  use: [
    'babel-compiler@7.3.4',
    'caching-compiler@1.2.1',
    'ecmascript@0.12.7'
  ],
  sources: [
    'SvelteCompiler.js',
    'plugin.js'
  ],
  npmDependencies: {
    '@babel/runtime': '7.4.3',
    'find-up': '3.0.0',
    htmlparser2: '3.10.1',
    'source-map': '0.5.6',
    svelte: '3.21.0',
    'svelte-preprocess': '4.2.1'
  }
});

Package.onUse(function (api) {
  api.versionsFrom('1.8');
  api.use('isobuild:compiler-plugin@1.0.0');

  // Dependencies for compiled Svelte components (taken from `ecmascript`).
  api.imply([
    'modules',
    'ecmascript-runtime',
    'babel-runtime',
    'promise'
  ]);
});
