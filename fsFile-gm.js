//wrap gm() object with an object that exposes the same methods, with the addition of a
//.save() method that overwrites the FS.File's .buffer with the result

var gm = Npm.require('gm');
var exec = Npm.require('child_process').exec;


var graphicsmagic = false;
var imagemagic = false;

if (typeof FS.Transform !== "undefined") {

  exec('gm help', function(err, result) {
    if (err === null) {
      console.log('=> GraphicsMagic found');
      // Prefer graphicsmagic
      FS.Transform.scope.gm = gm;

    } else {
      // graphicsmagic failed test

      // Check for imagemagic
      exec('convert -version', function(err, result) {
        if (err === null) {
          console.log('=> ImageMagick found');

          // Use imageMagick - we subclass for the user
          var imageMagick = gm.subClass({ imageMagick: true });
          FS.Transform.scope.gm = imageMagick;

        } else {
          // Both failed
          console.warn('cfs-graphicsmagic could not find "graphicsMagic" or "imageMagic" on the system');
          // We kinda need one of these...
          throw new Error('cfs-graphicsmagic need binaries');

        }

      });

    }

  });

} else {
  // Did not get any scope
  throw new Error('cfs-graphicsmagic could not add gm to transform scope');
}
