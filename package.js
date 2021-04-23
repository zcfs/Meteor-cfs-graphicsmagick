Package.describe({
  name: 'zcfs:graphicsmagick',
  version: '0.0.18',
  summary: "Adds `gm` to scope with the ability to perform GraphicsMagick or ImageMagick manipulation",
  git: "https://github.com/zcfs/Meteor-cfs-graphicsmagick.git"
});

Npm.depends({
  gm: "1.17.0"
});

//also requires that you install the ImageMagick
//or GraphicsMagick app on your server

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.addFiles('gm.js', 'server');

  api.export('gm');
});

Package.onTest(function(api) {
  api.use(['zcfs:graphicsmagick', 'test-helpers', 'tinytest'], 'server');
  api.addFiles('tests/server-tests.js', 'server');
});
