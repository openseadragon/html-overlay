# HTML Overlay for OpenSeadragon

An OpenSeadragon plugin that adds HTML overlay capability.

Compatible with OpenSeadragon 2.0.0 or greater.

## Documentation

To use, include the `openseadragon-html-overlay.js` file after `openseadragon.js` on your web page.

To add HTML overlay capability to your OpenSeadragon Viewer, call `htmlOverlay()` on it. This will return a new object with the following methods:

* `element()`: Returns the overlay's parent HTML element that you should add all of your HTML elements to. As the user zooms and pans, the parent element will transform to match. Add your elements according to the OpenSeadragon Viewport coordinate system.
* `onClick(element, handler)`: If you want to accept click events on a child element, use this method. It takes care of making sure the click isn't also handled by the Viewer. The handler you provide is called when the click occurs and given a single argument, an [OpenSeadragon.MouseTracker click event](http://openseadragon.github.io/docs/OpenSeadragon.MouseTracker.html#clickHandler).

See demo.html for an example of it in use. You can see it in action at http://openseadragon.github.io/html-overlay/demo.html.
