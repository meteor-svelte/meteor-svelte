Package.describe({
  name: 'klaussner:svelte',
  version: '0.0.1',
  summary: 'Use the magical disappearing UI framework in Meteor',
  git: 'https://github.com/klaussner/svelte'
});

Package.registerBuildPlugin({
  name: 'svelte-compiler',
  use: ['templating-tools@1.0.5', 'babel-compiler'],
  sources: [
    'plugin.js'
  ],
  npmDependencies: {
    'svelte-es5-meteor': '0.0.2',
  }
});

Package.onUse(function (api) {
  api.use('isobuild:compiler-plugin@1.0.0');

  api.imply('modules@0.7.7');
  api.imply('ecmascript-runtime@0.3.15');
  api.imply('babel-runtime@1.0.1');
  api.imply('promise@0.8.8');
});
