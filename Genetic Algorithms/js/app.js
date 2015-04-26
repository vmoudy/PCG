var app = {};

// A holder for lots of app-related functionality
define(["processing", "common", "./ltree/ltree"], function(_processing, common, ltree) {
    'use strict';

    // A little time object to keep track of the current time,
    //   how long its been since the last frame we drew,
    //   and how long the app has been running
    app.time = {
        date : Date.now(),
        start : Date.now(),
        total : 0,
        elapsed : .1,
        frames : 0,
        updateTime : function() {
            var last = this.date;
            this.date = Date.now();
            this.total = (this.date - this.start) / 1000;
            this.elapsed = (this.date - last) / 1000;

            this.frames++;
        }
    };

    // Lets add some functions to the app object!
    $.extend(app, {

        mouse : new Vector(),
        dimensions : new Vector(),

        init : function() {

            app.graphs = [];
            var count = 15;
            for (var i = 0; i < count; i++) {
                var x = 600 * ((i + .5) / count - .5);
                app.graphs.push(ltree.createLTree(new Vector(x, 200)));
            }

            // Get the canvas element
            // Note that this is the jquery selector, and not the DOM element (which we need)
            // myJQuerySelector.get(0) will return the canvas element to pass to processing
            var canvas = $("#processingCanvas");

            var processingInstance = new Processing(canvas.get(0), function(g) {

                // Set the size of processing so that it matches that size of the canvas element
                var w = canvas.width();
                var h = canvas.height();
                app.dimensions.setTo(w, h);

                g.size(w, h);

                g.colorMode(g.HSB, 1);

                // Tell processing to define ellipses as a center and a radius
                g.ellipseMode(g.CENTER_RADIUS);

                // Create the canvas

                g.background(.12, .04, .8);
                // Move to the center of the canvas

                g.draw = function() {
                    g.fill(.55, .1, 1, 1);
                    g.rect(0, 0, w, h);

                    // Update time
                    app.time.updateTime();
                    for (var i = 0; i < app.graphs.length; i++) {
                        app.graphs[i].update();
                    }

                    g.pushMatrix();
                    g.translate(w / 2, h / 2);
                    for (var i = 0; i < app.graphs.length; i++) {
                        app.graphs[i].draw(g);
                    }

                    g.popMatrix();
                };
            });
            this.initUI();
        },

        initUI : function() {

            $(document).keydown(function(e) {

                var key = String.fromCharCode(e.keyCode);

                switch(key) {
                case ' ':
                    app.paused = !app.paused;
                    break;

                }

            });

            $(document).keyup(function(e) {
                app.key = undefined;
            });

        }
    });

});
