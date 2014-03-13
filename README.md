cfs-graphicsmagick
=========================

NOTE: This branch is under active development right now (2014-3-13). The API
may continue to change. Please help test it and fix bugs, but don't use in production yet.

A Meteor package that adds simple image manipulation using GraphicsMagick for
[CollectionFS](https://github.com/CollectionFS/Meteor-CollectionFS). The main
purpose of this is to quickly and easily check and manipulate images
in the `beforeSave` function for a FS.Collection master file or copy.

## Prerequisites

There are three layers:

* This package, which requires...
* [gm](http://aheckmann.github.io/gm/docs.html) Node package, which requires...
* [GraphicsMagick](http://www.graphicsmagick.org/) application and/or [ImageMagick](http://www.imagemagick.org/script/index.php) application

The `gm` dependency is managed for you, but there is still a dependency on the GraphicsMagick application, which does all of the actual processing. This is a normal operating system application, so you have to install it using the correct method for your OS. It's available from some package managers, like Homebrew for OSX, or you can [download](http://sourceforge.net/projects/graphicsmagick/files/) and make/install it from source.

The `gm` Node package also supports ImageMagick. You can use it either instead of or in addition to GraphicsMagick. Usually, GraphicsMagick will be all you'll need, but if you find a need for ImageMagick, you'll need to install the ImageMagick app on your OS, again using a package manager or make/install from source.

Remember that these applications will need to be installed on both your development machine and any hosting servers you use.

## Installation

NOTE: Until this is added to atmosphere, use this in smart.json for trying out this package:

```js
"cfs-graphicsmagick": {
  "git": "https://github.com/CollectionFS/Meteor-cfs-graphicsmagick.git",
  "branch": "master"
}
```

The following will eventually be the correct installation instructions:

Install using Meteorite. When in a Meteorite-managed app directory, enter:

```
$ mrt add cfs-graphicsmagick
```

## Usage

To use this package, first get an instance of `FS.File` that somehow has data attached. You can attach the data directly, use an instance that's mounted on an `FS.Collection` instance, or call this within a `beforeSave` function.

Once you have the necessary `FS.File` instance, simply call `gm()` on it to enter a `gm` context, and then call any of the supported methods as documented [in the gm package docs](http://aheckmann.github.io/gm/docs.html). After applying all transformations, call `save()` with a `stream` option (unless you loaded the data from a store and want to write back to the same store, in which case the `stream` option is not necessary).

If your server doesn't have GraphicsMagick or you need to use ImageMagick for
another reason, you can pass the `imageMagick` option to `gm`: `fileObj.gm({ imageMagick: true })`.

Note: The `meteor deploy` servers don't have GraphicsMagick or ImageMagick installed, so you cannot use this
package if you plan to deploy this way.

The following are some examples.

### In a beforeSave Function

```js
Images = new FS.Collection("images", {
    stores: [
      new FS.Store.FileSystem("images", {path: "~/app-images/master"}),
      new FS.Store.FileSystem("thumbs", {
        path: "~/app-images/thumbs",
        beforeSave: function(writeStream) {
          this.gm().resize(60).save({stream: writeStream}); //create a 60x60 thumbnail
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

### In a beforeSave Function and Converting to a Different Image Format

To convert every file to a specific image format, you can use the `setFormat`
method of the `gm` library and pass a `type` option to the `save` method, but you will also need to specify a new filename to
change the extension. You can do this by setting the `name` property of the
`FS.File`.

```js
beforeSave: function(writeStream) {
  var fsFile = this;
  if (typeof fsFile.name === "string") {
    fsFile.name = path.basename(fsFile.name, path.extname(fsFile.name)) + ".png";
  }
  fsFile.gm().resize(60).setFormat("PNG").save({type: "image/png", stream: writeStream}); //create a 60x60 .png thumbnail
}
```

The argument for `setFormat` is any
[GraphicsMagick format string](http://www.graphicsmagick.org/formats.html).

### Converting a File Already Stored

To do this, we stream out of the store and then back into it:

```js
Images.findOne(imageId).gm({store: 'thumbs'}).rotate(90).save();
```

By passing a `store` option to `gm` we tell it to stream file data from that store, and by not passing a write stream to `save`, we tell it to stream the results back to the source store. You could alternatively stream the results to a different store or to a new `FS.File` instance.
