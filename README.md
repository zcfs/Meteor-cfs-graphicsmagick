cfs-graphicsmagick
=========================

Adds .gm() to FileObject and adds .save() to .gm().

```js
var fo = new FileObject(fileRecord); //or FileObject.fromFile(file);
fo.gm().anyGMFunction().save();
```

Calling FileObject.gm() gets you a graphicsmagick context and then calling
save() at the end of your chain saves all of the changes back into the
FileObject buffer.

The main purpose of this is to quickly and easily check and manipulate images
in the `beforeSave` function for a CollectionFS copy.

Prerequisites:

* Install imagemagick and graphicsmagick on dev machine/server
* Add `collectionFS` to your project.