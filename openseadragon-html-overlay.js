// OpenSeadragon HTML Overlay plugin 0.0.2

(function() {

    var $ = window.OpenSeadragon;

    if (!$) {
        $ = require('openseadragon');
        if (!$) {
            throw new Error('OpenSeadragon is missing.');
        }
    }

    // ----------
    $.Viewer.prototype.htmlOverlay = function (options) {
        options = options || {};

        if (this._htmlOverlayInfo) {
            return this._htmlOverlayInfo;
        }

        this._htmlOverlayInfo = new Overlay(this);
        if (options.scale) {
            this._htmlOverlayInfo._scale = options.scale; // arbitrary scale for created overlay element
        }
        else {
            this._htmlOverlayInfo._scale = 1;
        }
        return this._htmlOverlayInfo;
    };

    // ----------
    var Overlay = function(viewer) {
        var self = this;

        this._viewer = viewer;

        this._element = document.createElement('div');
        this._element.style.position = 'absolute';
        this._element.style.left = 0;
        this._element.style.top = 0;
        this._element.style.width = '100%';
        this._element.style.height = '100%';
        this._element.style.transformOrigin = '0 0';
        this._viewer.canvas.appendChild(this._element);

        // OpenSeadragon blocks the normal click event action, so we have to reestablish it for links here
        new OpenSeadragon.MouseTracker({
            element: this._element,
            clickHandler: function(event) {
                var clickTarget = event.originalEvent.target;
                if (/a/i.test(clickTarget.nodeName)) {
                    if (clickTarget.target === '_blank') {
                        window.open(clickTarget.href);
                    } else {
                        location.href = clickTarget.href;
                    }
                }
            }
        });

        this._viewer.addHandler('animation', function() {
            self.resize();
        });

        this._viewer.addHandler('open', function() {
            self.resize();
        });

        this._viewer.addHandler('rotate', function(evt) {
            self.resize();
        });

        this._viewer.addHandler('resize', function() {
            self.resize();
        });

        this.resize();
    };

    // ----------
    Overlay.prototype = {
        // ----------
        element: function() {
            return this._element;
        },

        // ----------
        resize: function() {
            var p = this._viewer.viewport.pixelFromPoint(new $.Point(0, 0), true);
            var zoom = this._viewer.viewport.getZoom(true);
            var rotation = this._viewer.viewport.getRotation();

            // TODO: Expose an accessor for _containerInnerSize in the OSD API so we don't have to use the private variable.
            var scale = this._viewer.viewport._containerInnerSize.x * zoom / this._scale;

            this._element.style.transform =
                'translate(' + p.x + 'px,' + p.y + 'px) scale(' + scale + ') rotate(' + rotation + ')';
        },

        // ----------
        onClick: function(element, handler) {
            // TODO: Fast click for mobile browsers

            new $.MouseTracker({
                element: element,
                clickHandler: handler
            }).setTracking(true);
        }
    };

})();
