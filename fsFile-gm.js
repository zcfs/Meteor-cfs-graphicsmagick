//wrap gm() object with an object that exposes the same methods, with the addition of a
//.save() method that overwrites the FS.File's .buffer with the result

var path = Npm.require('path');
var Future = Npm.require(path.join('fibers', 'future'));
var gm = Npm.require('gm');

if (typeof FS.File !== "undefined") {

  FS.File.prototype.gm = function() {
    var self = this;
    var subGM = gm.subClass({fsFile: self});
    return subGM(self.getBuffer(), self.name);
  };
  
  // Filename and type are optional
  gm.prototype.save = function(type) {
    var self = this;
    var fut = new Future();
    
    var callback = Meteor.bindEnvironment(function(err, buffer) {
      if (err)
        throw err;
      self._options.fsFile.setDataFromBuffer(buffer, type);
      fut.return(self);
    }, function (err) {
      throw err;
    });
    this.toBuffer(callback);
    
    return fut.wait();
  };
}