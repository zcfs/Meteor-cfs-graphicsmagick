cfs-graphicsmagick
=========================

NOTE: This branch is under active development right now (2013-11-18). It has
bugs and the API may continue to change. Please help test it and fix bugs,
but don't use in production yet.

A Meteor package that adds simple image manipulation using GraphicsMagick for
[CollectionFS](https://github.com/CollectionFS/Meteor-CollectionFS). The main
purpose of this is to quickly and easily check and manipulate images
in the `beforeSave` function for a FS.Collection master file or copy.

## Prerequisites

Install the latest release of `imagemagick` and `graphicsmagick` on your
development machine and on any servers on which your app will be hosted.

## Installation

NOTE: Until this is added to atmosphere, use this in smart.json:

```js
"cfs-graphicsmagick": {
  "git": "https://github.com/CollectionFS/Meteor-cfs-graphicsmagick.git",
  "branch": "master"
}
```

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

## Example

Here's how to resize an image prior to saving it using a FS.Collection
`beforeSave` function:

```js
Images = new FS.Collection("images", {
    useHTTP: true,
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