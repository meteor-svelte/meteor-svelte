Package.describe({
  name: 'svelte:core',
  version: '1.0.0',
  summary: 'Svelte compiler core',
  git: 'https://github.com/meteor-svelte/meteor-svelte.git'
});

Npm.depends({
  htmlparser2: '3.9.2',
  'source-map': '0.5.6',
  'svelte-es5-meteor': '0.2.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.4.2.3');

  // Dependencies for `SvelteCompiler`
  api.use([
    'caching-compiler@1.1.9',
    'babel-compiler@6.13.0',
    'ecmascript@0.6.1'
  ]);

  // Dependencies for compiled Svelte components
  api.imply([
    'modules',
    'ecmascript-runtime',
    'babel-runtime',
    'promise'
  ]);

  // Make `SvelteCompiler` available to build plugins
  api.mainModule('svelte-compiler.js');
  api.export('SvelteCompiler', 'server');
});
