//wrap gm() object with an object that exposes the same methods, with the addition of a
//.save() method that overwrites the FS.File's .buffer with the result

var gm = Npm.require('gm');
var path = Npm.require('path');
var fs = Npm.require('fs');


var graphicsmagic = false;
var imagemagic = false;

if (typeof FS.Transform !== "undefined") {

  // Split the path by : or ;
  // XXX: windows is not tested
  var binaryPaths = process.env['PATH'].split(/:|;/);

  // XXX: we could push extra paths if the `gm` library check stuff like:
  // $MAGIC_HOME The current version does not check there
  // $MAGICK_HOME (GraphicsMagick docs)

  // We check to see if we can find binaries
  FS.Utility.each(binaryPaths, function(binPath) {
    // If we have not found GraphicsMagic
    if (!graphicsmagic) {
      // Init
      var gmPath = path.join(binPath, 'gm');
      var gmExePath = path.join(binPath, 'gm.exe');

      // Check to see if binary found
      graphicsmagic = fs.existsSync(gmPath) || fs.existsSync(gmExePath);

      if (graphicsmagic) console.log('=> GraphicsMagic found');

      // If GraphicsMagic we dont have to check for ImageMagic
      // Since we prefer GrapicsMagic when selecting api
      if (!graphicsmagic && !imagemagic) {
        // Init paths to check
        var imPath = path.join(binPath, 'convert');
        var imExePath = path.join(binPath, 'convert.exe');

        // Check to see if binary found
        imagemagic = fs.existsSync(imPath) || fs.existsSync(imExePath);

        if (imagemagic) console.log('=> ImageMagic found');

      }
    }
  });


  if (!graphicsmagic && !imagemagic) {
          // Both failed
          console.warn(
'WARNING:\n' +
'cfs-graphicsmagic could not find "graphicsMagic" or "imageMagic" on the\n' +
'system.\n' +
'\n' +
'I just checked PATH to see if I could find the GraphicsMagic or ImageMagic\n' +
'unix/mac os/windows binaries on your system, I failed.\n' +
'\n' +
'Why:\n' +
'1. I may be blind or naive, help making me smarter\n' +
'2. You havent added the path to the binaries\n' +
'3. You havent actually installed GraphicsMagic or ImageMagick\n' +
'\n' +
'*** Make sure "$PATH" environment is configured "PATH:/path/to/binaries" ***\n' +
'\n' +
'Installation hints:\n' +
'* Mac OS X "brew install graphicsmagic" or "brew install imagemagick"\n' +
'* Linux download rpm or use packagemanager\n' +
'* Windows download the installer and run');

  } else {
    // Rig the gm scope

    if (graphicsmagic) {

      // Prefer graphicsmagic
      FS.Transform.scope.gm = gm;

    } else {

      // Use imageMagick - we subclass for the user
      var imageMagick = gm.subClass({ imageMagick: true });
      FS.Transform.scope.gm = imageMagick;

    }

  }

} else {
  // Did not get any scope
  throw new Error('cfs-graphicsmagic could not add gm to transform scope');
}
