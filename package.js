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
  api.use('isobuild:compiler-plugin@1.0.0');

  api.imply('modules@0.7.7');
  api.imply('ecmascript-runtime@0.3.15');
  api.imply('babel-runtime@1.0.1');
  api.imply('promise@0.8.8');
});
