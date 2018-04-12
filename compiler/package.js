Package.describe({
  name: 'svelte:compiler',
  version: '1.60.3-beta.0_1',
  summary: 'Svelte compiler',
  git: 'https://github.com/meteor-svelte/meteor-svelte.git',
  documentation: '../README.md'
});

Package.registerBuildPlugin({
  name: 'svelte-compiler',
  use: ['ecmascript@0.9.0', 'svelte:core@1.60.3-beta.0_1'],
  sources: [
    'plugin.js'
  ],
  npmDependencies: {
    'find-up': '2.1.0'
  }
});

Package.onUse(function (api) {
  api.use('isobuild:compiler-plugin@1.0.0');
});
