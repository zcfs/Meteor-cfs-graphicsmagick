cfs-graphicsmagick
=========================

NOTE: This branch is under active development right now (2013-11-18). It has
bugs and the API may continue to change. Please help test it and fix bugs,
but don't use in production yet.

A Meteor package that adds simple image manipulation using GraphicsMagick for
[CollectionFS](https://github.com/CollectionFS/Meteor-CollectionFS). The main
purpose of this is to quickly and easily check and manipulate images
in the `beforeSave` function for a CollectionFS master file or copy.

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
var fo = new FileObject(fileRecord);
fo.gm().anyGMFunction().save();
```

Calling `myFileObject.gm()` gets you a GraphicsMagick context and then calling
`save()` at the end of your chain saves all of the changes back into the
FileObject buffer.

[See all the fun things you can do!](http://aheckmann.github.io/gm/docs.html)

## Example

Here's how to resize an image prior to saving it using a CollectionFS
`beforeSave` function:

```js
Images = new CollectionFS("images", {
    useHTTP: true,
    store: new CollectionFS.FileSystemStore("images", "~/app-images/master"),
    copies: {
      thumbnail: {
        store: new CollectionFS.FileSystemStore("thumbs", "~/app-images/thumbs"),
        beforeSave: function() {
          this.gm().resize(60).save(); //create a 60x60 thumbnail
        }
      }
    },
    filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this CollectionFS
      }
    }
  });
```