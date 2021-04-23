zcfs:graphicsmagick
=========================

~~Looking for maintainers - please reach out!~~
This package is to be archived due to inability to find contributors, thanks to everyone who helped make it possible.

**If you're looking for an alternative, we highly recommend [Meteor-Files](https://github.com/VeliovGroup/Meteor-Files) by [VeliovGroup](https://github.com/VeliovGroup)**

---

This package simply adds `gm` to scope, but it also tests the environment and automatically uses graphicsmagick or imagemagick if available. This makes debugging much easier.

The `gm` scope is also set accordingly to either graphicsmagick or imagemagick *so you dont have to change your code depending on the server installation of gm/im.*

If no binaries are found on the system, it will warn and throw an error when used. If you don't know whether graphicsmagick or imagemagick will be installed at the time of running, you can check the `gm.isAvailable` boolean flag before calling `gm()`.

## Using with CollectionFS

**This package does not require `CollectionFS` and can be used alone.**

For use with `CollectionFS`, please refer to [the CollectionFS documentation](https://github.com/zcfs/Meteor-CollectionFS#image-manipulation) for instructions.
