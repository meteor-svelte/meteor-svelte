Package.describe({
  name: 'svelte:compiler-no-html',
  version: '1.2.1',
  summary: 'Svelte compiler (ignores HTML files)',
  git: 'https://github.com/meteor-svelte/meteor-svelte.git'
});

Package.registerBuildPlugin({
  name: 'svelte-compiler',
  use: ['svelte:core@1.2.1'],
  sources: [
    'plugin.js'
  ]
});

Package.onUse(function (api) {
  api.use('isobuild:compiler-plugin@1.0.0');
  api.imply('static-html@1.1.13');
});
