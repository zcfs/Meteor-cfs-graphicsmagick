cfs-graphicsmagick
=========================

This package simply adds `gm` to scope.

But the package tests the environment and automatically uses graphicsmagick or imagemagick if available. This makes debugging much easier.

The `gm` scope is also set accordingly to either graphicsmagick or imagemagick - *so you dont have to change your code depending on the server installation of gm/im.*

If no binaries found on the system it will warn and throw an error if used, again with a fitting description.

-

> For use with the `CollectionFS` please refer to [the CollectionFS documentation](https://github.com/CollectionFS/Meteor-CollectionFS#image-manipulation) for instructions.
