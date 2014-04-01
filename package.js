Package.describe({
  summary: "Adds the ability to perform GraphicsMagick manipulation on transform streams in the CollectionFS package"
});

Npm.depends({
  gm: "1.14.2"
});

//also requires that you install the ImageMagick
//and GraphicsMagick apps on your server

Package.on_use(function(api) {

  api.use(['cfs-base-package', 'cfs-storage-adapter'], 'server');

  api.add_files([
    'fsFile-gm.js'
  ], 'server');

});

Package.on_test(function(api) {
  api.use(['cfs-graphicsmagick', 'test-helpers', 'tinytest'], 'server');
  api.add_files('tests/server-tests.js', 'server');
});
