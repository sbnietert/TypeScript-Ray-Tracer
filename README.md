# TypeScript Ray Tracer
Simple ray tracing using TypeScript, Web Workers, and HTML5 Canvas. See it in action [here](http://sloan.nietert.me/ray_tracer).

This is a ported and upgraded version of the C++ ray tracer I built as a final project for my first CS course in college.

##Usage
The included scene files demonstrate all of the ray tracer's current features. Meshes must be loaded using the `.OFF` file format.

The TypeScript needs to be compiled into two JavaScript files: one for the scene viewer and one for the background process. `compile.bat` will do this automatically.

##Thanks

The following libraries / open-source projects were used in the development of this project:
* [TypeScript](http://www.typescriptlang.org/)
* [dat.GUI](https://github.com/dataarts/dat.gui)
* [dat.GUI light theme](https://github.com/liabru/dat-gui-light-theme)
