var svelte = Npm.require('svelte-es5-meteor');

Plugin.registerCompiler({
  extensions: ['html'],
}, function () {
  return new SvelteCompiler();
});

function SvelteCompiler() {}
var SCp = SvelteCompiler.prototype;

SCp.processFilesForTarget = function (files) {
  files.forEach(function (file) {
    this.processOneFileForTarget(file);
  }, this);
};

SCp.processOneFileForTarget = function (file) {
  var raw = file.getContentsAsString();
  var path = file.getPathInPackage();

  var result = svelte.compile(raw, {
    filename: path
  });

  var transpiled = Babel.compile(result.code, Babel.getDefaultOptions());

  file.addJavaScript({
    data: transpiled.code
  });
};
