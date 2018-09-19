Package.describe({
  name: 'svelte:compiler',
  version: '2.5.0_1',
  summary: 'Svelte compiler',
  git: 'https://github.com/meteor-svelte/meteor-svelte.git',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'svelte-compiler',
  use: [
    'babel-compiler@6.24.7||7.0.0',
    'caching-compiler@1.1.11',
    'ecmascript@0.9.0'
  ],
  sources: [
    'SvelteCompiler.js',
    'plugin.js'
  ],
  npmDependencies: {
    'find-up': '2.1.0',
    htmlparser2: '3.9.2',
    'source-map': '0.5.6',
    svelte: '2.5.0'
  }
});

Package.onUse(function (api) {
  api.versionsFrom('1.6');
  api.use('isobuild:compiler-plugin@1.0.0');

  // Dependencies for compiled Svelte components (taken from `ecmascript`).
  api.imply([
    'modules',
    'ecmascript-runtime',
    'babel-runtime',
    'promise'
  ]);
});
