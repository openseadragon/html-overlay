// OpenSeadragon HTML Overlay plugin 0.0.2
// https://github.com/openseadragon/html-overlay
//
// Licensed under the BSD 3-Clause "New" or "Revised" License:
//
// Copyright (C) 2020 html-overlay contributors
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// - Redistributions of source code must retain the above copyright notice,
//   this list of conditions and the following disclaimer.
//
// - Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
//
// - Neither the name of the copyright holder nor the names of its contributors
//   may be used to endorse or promote products derived from this software
//   without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

(function () {
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
        } else {
            this._htmlOverlayInfo._scale = 1;
        }
        return this._htmlOverlayInfo;
    };

    // ----------
    var Overlay = function (viewer) {
        var self = this;

        this._viewer = viewer;

        this._element = document.createElement('div');
        this._element.style.position = 'absolute';
        this._element.style.left = 0;
        this._element.style.top = 0;
        // We give it width and height of 0 so it doesn't steal events from the viewer.
        this._element.style.width = 0;
        this._element.style.height = 0;
        this._element.style.transformOrigin = '0 0';
        this._viewer.canvas.appendChild(this._element);

        // OpenSeadragon blocks the normal click event action, so we have to reestablish it for links here
        new OpenSeadragon.MouseTracker({
            element: this._element,
            clickHandler: function (event) {
                // The event.originalTarget is the new OSD way; we're keeping
                // the event.originalEvent.target fallback for old OSD.
                var clickTarget =
                    event.originalTarget || event.originalEvent.target;

                if (/a/i.test(clickTarget.nodeName)) {
                    if (clickTarget.target === '_blank') {
                        window.open(clickTarget.href);
                    } else {
                        location.href = clickTarget.href;
                    }
                }
            }
        });

        this._viewer.addHandler('animation', function () {
            self.resize();
        });

        this._viewer.addHandler('open', function () {
            self.resize();
        });

        this._viewer.addHandler('rotate', function (evt) {
            self.resize();
        });

        this._viewer.addHandler('resize', function () {
            self.resize();
        });

        this.resize();
    };

    // ----------
    Overlay.prototype = {
        // ----------
        element: function () {
            return this._element;
        },

        // ----------
        resize: function () {
            var p = this._viewer.viewport.pixelFromPoint(
                new $.Point(0, 0),
                true
            );
            var zoom = this._viewer.viewport.getZoom(true);
            var rotation = this._viewer.viewport.getRotation();

            // TODO: Expose an accessor for _containerInnerSize in the OSD API so we don't have to use the private variable.
            var scale =
                (this._viewer.viewport._containerInnerSize.x * zoom) /
                this._scale;

            this._element.style.transform =
                'translate(' +
                p.x +
                'px,' +
                p.y +
                'px) scale(' +
                scale +
                ') rotate(' +
                rotation +
                ')';
        },

        // ----------
        onClick: function (element, handler) {
            // TODO: Fast click for mobile browsers

            new $.MouseTracker({
                element: element,
                clickHandler: handler
            }).setTracking(true);
        }
    };
})();
