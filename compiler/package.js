Package.describe({
  name: 'svelte:compiler',
  version: '1.3.0',
  summary: 'Svelte compiler',
  git: 'https://github.com/meteor-svelte/meteor-svelte.git'
});

Package.registerBuildPlugin({
  name: 'svelte-compiler',
  use: ['svelte:core@1.2.0'],
  sources: [
    'plugin.js'
  ]
});

Package.onUse(function (api) {
  api.use('isobuild:compiler-plugin@1.0.0');
});
