cfs-graphicsmagick
=========================

NOTE: This branch is under active development right now (2014-1-1). The API
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

```js
var fo = new FS.File(fileRecord);
fo.gm().anyGMFunction().save();
```

Calling `myFSFile.gm()` gets you a GraphicsMagick context and then calling
`save()` at the end of your chain saves all of the changes back into the
FS.File buffer.

[See all the fun things you can do!](http://aheckmann.github.io/gm/docs.html)

If your server doesn't have GraphicsMagick or you need to use ImageMagick for
another reason, you can:

```js
var fo = new FS.File(fileRecord);
fo.gm({ imageMagick: true }).anyGMFunction().save();
```

Note: The `meteor deploy` servers don't have GraphicsMagick or ImageMagick installed, so you cannot use this
package if you plan to deploy this way.

## Example

Here's how to resize an image prior to saving it using a FS.Collection
`beforeSave` function:

```js
Images = new FS.Collection("images", {
    store: new FS.FileSystemStore("images", "~/app-images/master"),
    copies: {
      thumbnail: {
        store: new FS.FileSystemStore("thumbs", "~/app-images/thumbs"),
        beforeSave: function() {
          this.gm().resize(60).save(); //create a 60x60 thumbnail
        }
      }
    },
    filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
  });
```

Note that this example requires the `cfs-filesystem` package.

## Converting to a Different Image Format

To convert every file to a specific image format, you can use the `setFormat`
method of the `gm` library, but you will also need to specify a new filename to
change the extension. You can do this by setting the `name` property of the
`FS.File`.

```js
beforeSave: function() {
  var fsFile = this;
  fsFile.gm().resize(60).setFormat("PNG").save("image/png"); //create a 60x60 .png thumbnail
  fsFile.name = path.basename(fsFile.name, path.extname(fsFile.name)) + ".png";
}
```

The argument for `setFormat` is any
[GraphicsMagick format string](http://www.graphicsmagick.org/formats.html).
In the example, we pass the new content type string to the `save` method. If
you don't do this, the FS.File will attempt to determine the content type
from the new buffer data. It is more efficient and foolproof to pass the new
content type string yourself if you change the format.
