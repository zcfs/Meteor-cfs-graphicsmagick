cfs-graphicsmagick
=========================

A Meteor package that adds simple image manipulation using GraphicsMagick or ImageMagick for
[CollectionFS](https://github.com/CollectionFS/Meteor-CollectionFS). The main
purpose of this is to quickly and easily check and manipulate images
in your store transformation functions.

## Prerequisites

There are three layers:

* This package, which requires...
* [gm](http://aheckmann.github.io/gm/docs.html) Node package, which requires...
* [GraphicsMagick](http://www.graphicsmagick.org/) application and/or [ImageMagick](http://www.imagemagick.org/script/index.php) application

The `gm` dependency is managed for you, but there is still a dependency on the GraphicsMagick application, which does all of the actual processing. This is a normal operating system application, so you have to install it using the correct method for your OS. It's available from some package managers, like Homebrew for OSX, or you can [download](http://sourceforge.net/projects/graphicsmagick/files/) and make/install it from source.

The `gm` Node package also supports ImageMagick. You can use it either instead of or in addition to GraphicsMagick. Usually, GraphicsMagick will be all you'll need, but if you find a need for ImageMagick, you'll need to install the ImageMagick app on your OS, again using a package manager or make/install from source.

Remember that these applications will need to be installed on both your development machine and any hosting servers you use.

Note: The `meteor deploy` servers don't have GraphicsMagick or ImageMagick installed, so you cannot use this
package if you plan to deploy this way.

## Installation

Install using Meteorite. When in a Meteorite-managed app directory, enter:

```
$ mrt add cfs-graphicsmagick
```

## Usage

The following are some examples.

### In a transformWrite Function

```js
Images = new FS.Collection("images", {
    stores: [
      new FS.Store.FileSystem("images"),
      new FS.Store.FileSystem("thumbs", {
        // We want to transform the writes to the store using streams:
        transformWrite: function(fileObj, readStream, writeStream) {
    
          // Transform the image into a 10x10px thumbnail
          this.gm(readStream, fileObj.name).resize('10', '10').stream().pipe(writeStream);
    
          // To pass it through:
          //readStream.pipe(writeStream);
        }
      )
    ],
    filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
});
```

Note that this example requires the `cfs-filesystem` package.

### In a transformWrite Function and Converting to a Different Image Format

To convert every file to a specific image format, you can use the `setFormat`
method of the `gm` library, but you will also need to alter the `FS.File` instance as necessary.

TODO need to test and make sure this works. What about setting the new size? Does that happen automatically?

```js
transformWrite: function(fileObj, readStream, writeStream) {
  // Convert
  this.gm(readStream, fileObj.name).setFormat("PNG").stream().pipe(writeStream);
  // Update the file object info
  if (typeof fileObj.name === "string") {
    fileObj.name = path.basename(fileObj.name, path.extname(fileObj.name)) + ".png";
    fileObj.type = "image/png";
  }
}
```

The argument for `setFormat` is any
[GraphicsMagick format string](http://www.graphicsmagick.org/formats.html).

### Converting a File Already Stored

TODO this doesn't work anymore. How should we do this now?

> To do this, we stream out of the store and then back into it:
> 
> ```js
> Images.findOne(imageId).gm({store: 'thumbs'}).rotate(90).save();
> ```
>
> By passing a `store` option to `gm` we tell it to stream file data from that store, and by not passing a write stream to `save`, we tell it to stream the results back to the source store. You could alternatively stream the results to a different store or to a new `FS.File` instance.
