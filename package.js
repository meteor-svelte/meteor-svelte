Package.describe({
  name: 'svelte:compiler',
  version: '1.0.0',
  summary: 'Use the magical disappearing UI framework in Meteor',
  git: 'https://github.com/meteor-svelte/meteor-svelte.git'
});

Package.registerBuildPlugin({
  name: 'svelte-compiler',
  use: ['caching-compiler@1.1.9', 'babel-compiler@6.13.0', 'ecmascript@0.6.1'],
  sources: [
    'plugin.js'
  ],
  npmDependencies: {
    htmlparser2: '3.9.2',
    'source-map': '0.5.6',
    'svelte-es5-meteor': '0.2.0'
  }
});

Package.onUse(function (api) {
  api.versionsFrom('1.4.2.3');

  api.use('isobuild:compiler-plugin@1.0.0');

  api.imply('modules');
  api.imply('ecmascript-runtime');
  api.imply('babel-runtime');
  api.imply('promise');
});
