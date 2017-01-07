Package.describe({
  name: 'svelte:compiler-no-html',
  version: '1.0.0',
  summary: 'Svelte compiler (ignores HTML files)',
  git: 'https://github.com/meteor-svelte/meteor-svelte.git'
});

Package.registerBuildPlugin({
  name: 'svelte-compiler',
  use: ['svelte:core'],
  sources: [
    'plugin.js'
  ]
});

Package.onUse(function (api) {
  api.use('isobuild:compiler-plugin@1.0.0');

  api.versionsFrom('1.4.2.3');
  api.imply('static-html');
});
