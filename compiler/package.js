Package.describe({
  name: 'svelte:compiler',
  version: '1.27.0_2',
  summary: 'Svelte compiler',
  git: 'https://github.com/meteor-svelte/meteor-svelte.git',
  documentation: '../README.md'
});

Package.registerBuildPlugin({
  name: 'svelte-compiler',
  use: ['ecmascript@0.6.1', 'svelte:core@1.27.0_2'],
  sources: [
    'plugin.js'
  ]
});

Package.onUse(function (api) {
  api.use('isobuild:compiler-plugin@1.0.0');
});
