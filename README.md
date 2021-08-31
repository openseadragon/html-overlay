# HTML Overlay for OpenSeadragon

An OpenSeadragon plugin that adds scaling HTML overlay capability. This is different from OpenSeadragon's [built-in overlay functionality](http://openseadragon.github.io/examples/ui-overlays/); while those overlays update their location as the user zooms and pans, they don't scale their contents to match the zoom of the OSD viewer. Possible uses for this include overlaying video or animated GIF elements to have them properly scale while playing.

Compatible with OpenSeadragon 2.0.0 or greater.

## Documentation

To use, include the `openseadragon-html-overlay.js` file after `openseadragon.js` on your web page.

To add HTML overlay capability to your OpenSeadragon Viewer, call `htmlOverlay()` or `htmlOverlay(options)` on it. This will return a new object you can use to add overlays to.

### Options

Currently there's just a single option: `scale`. By default the scale is set to 1, meaning that the HTML coordinates match the viewport coordinates of the viewer. Since the default viewport coordinates range from 0 to 1, this means you'd need to set your overlay's `font-size` to something tiny like `0.025px`. Unfortunately browsers don't behave well with such sizes. One solution is to change your viewport coordinates to a bigger range, by setting your image size to something like 1000 when you load it into your viewer. Another solution is to use the `scale` option and set it similarly, like so: `htmlOverlay({ scale: 1000 })`.

### Methods

The object returned by `htmlOverlay` has these methods you can call:

* `element()`: Returns the overlay's parent HTML element that you should add all of your HTML elements to. As the user zooms and pans, the parent element will transform to match. Add your elements according to the OpenSeadragon Viewport coordinate system.
* `onClick(element, handler)`: If you want to accept click events on a child element, use this method. It takes care of making sure the click isn't also handled by the Viewer. The handler you provide is called when the click occurs and given a single argument, an [OpenSeadragon.MouseTracker click event](http://openseadragon.github.io/docs/OpenSeadragon.MouseTracker.html#clickHandler).

See demo.html for an example of it in use. You can see it in action at http://openseadragon.github.io/html-overlay/demo.html.
