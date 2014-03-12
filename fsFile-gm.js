//wrap gm() object with an object that exposes the same methods, with the addition of a
//.save() method that overwrites the FS.File's .buffer with the result

var gm = Npm.require('gm');

if (typeof FS.File !== "undefined") {

  /**
   * @param FS.File.prototype.gm
   * @public
   * @param {Object} options
   * @param {String} [options.type] Content type with which to save
   * @param {Stream} [options.stream] Write stream to pipe results to. If not set, will pipe to write stream for the 
   */
  FS.File.prototype.gm = function(options) {
    var self = this;
    options = options || {};
    var subGM = gm.subClass(_.extend({}, options, {fsFile: self}));
    return subGM(self.createReadStream(options.store), self.name);
  };
  
  /**
   * @param save
   * @public
   * @param {Object} options
   * @param {String} [options.type] Content type with which to save
   * @param {Stream} [options.stream] Write stream to pipe results to. If not set, will pipe to write stream for the same store we read from.
   */
  gm.prototype.save = function(options) {
    var self = this;
    options = options || {};
    var writeStream = self._options.fsFile.createWriteStream(options.store);
    self.stream(options.type).pipe(writeStream);
  };
}