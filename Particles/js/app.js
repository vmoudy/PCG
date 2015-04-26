var app = {};

// A holder for lots of app-related functionality
define(["processing", "./particles/particleSystem", "./particles/flower", "./particles/particle"], function(_processing, ParticleSystem, Flower, Particle) {'use strict';

    // A little time object to keep track of the current time,
    //   how long its been since the last frame we drew,
    //   and how long the app has been running
    var time = {
        date : Date.now(),
        start : Date.now(),
        frames : 0,
        updateTime : function() {
            var last = this.date;
            this.date = Date.now();
            this.total = (this.date - this.start) / 1000;
            this.elapsed = (this.date - last) / 1000;

            this.frames++;
        }
    };
	var xOff = 0.0;
	var xOff2 = 0.0;
    function randomDot(g, w, h) {
		var n = g.noise(xOff) * g.width;
        var x = Math.floor(Math.random() * g.width);
        var y = Math.floor(Math.random() * g.height);
        g.fill(Math.random(), 1, 1, .4);
        g.ellipse(x, y, n/16, n/16);
		g.ellipse(-x, -y, n/16, n/16);
		xOff -= 0.05;
		xOff2 += 0.10;
		g.rotate(xOff);
		g.triangle(0, 0, 60, 40, 50, 50);
		g.popMatrix();
        g.pushMatrix();
		g.translate(w / 2, h / 2);		
		g.rotate(xOff2);
		g.triangle(50, 50, 90, 30, 100, 100);
		g.popMatrix();
		var x2 = Math.floor(Math.random() * 200 + 100);
		var y2 = Math.floor(Math.random() * 700 + 400);
		g.fill(Math.random(), Math.random(), Math.random(), Math.random());
		g.rect(x2, y2, n/32, n/16, 0, 90, 0, 45);
    }

    function pixelStreak(g) {
        var offset = Math.floor(Math.random() * 100);
        g.loadPixels();
        var pixelArray = g.pixels.toArray();

        var x = Math.floor(Math.random() * g.width);
        var y = Math.floor(Math.random() * g.height);
        // Move a bunch of pixels to the right by 30 (wraparound)
       for (var i = 0; i < 200; i++) {
			for(var j = 0; j < 200; j++){
				var index = (x + i + j * j) + (y + j) * g.width;
				pixelArray[index] = pixelArray[index + offset];
			}
        }
		pixelArray.sort(function(a, b){b-a});
        g.pixels.set(pixelArray);
        g.updatePixels();
		
		for(var i = 0; i < 200; i++){
			for(var j = 0; j < 200; j++){
			
				var index = (x + i) + (y + j) * g.width;
			
				var color = pixelArray[index];
				var hue = g.hue(color);
				var saturation = g.saturation(color);
				var brightness = g.brightness(color);
				hue = (hue + .2) % 1;
				pixelArray[index] = g.color(hue, saturation, brightness);
			}
		}
		g.pixels.set(pixelArray);
        g.updatePixels();
    }

    // Lets add some functions to the app object!
    $.extend(app, {

        mouse : new Vector(),
        dimensions : new Vector(),

        init : function() {
            //console.log("Hello, World.");

            // Get the canvas element
            // Note that this is the jquery selector, and not the DOM element (which we need)
            // myJQuerySelector.get(0) will return the canvas element to pass to processing
            var canvas = $("#processingCanvas");
            var processingInstance = new Processing(canvas.get(0), function(g) {

                // This function is called once processing is initialized.

                // Set the size of processing so that it matches that size of the canvas element
                var w = canvas.width();
                var h = canvas.height();
                app.dimensions.setTo(w, h);

                g.size(w, h);

                // Tell processing that we'll be defining colors with
                //  the HSB color mode, with values [0, 1]
                g.colorMode(g.HSB, 1);

                // Tell processing to define ellipses as a center and a radius
                g.ellipseMode(g.CENTER_RADIUS);
				g.rectMode(g.CENTER);

                // Start with a black background
                // g.background(.5);

                // You can specify backgrounds with one value, for greyscale,
                //  g.background(.65);

                // or with 3 for HSB (or whatever color mode you are using)

                // You can even have a background that is *transparent*
                // g.background(0, 0, 0, 0);

                // Set processing's draw function

                g.background(0, 0, 0);

                // [TODO] Create a particle here

				var multPart = [];
				for(var i = 0; i < 30; i++){
					multPart[i] = new Particle();
				}
				var multPart2 = [];
				for(var i = 0; i < 30; i++){
					multPart2[i] = new Particle();
				}				

                g.draw = function() {

                    // Update time
                    time.updateTime();

                    // [TODO] Update a particle here					

                    // Move to the center of the canvas
                    g.pushMatrix();
                    g.translate(w / 2, h / 2);

                    // [TODO] Draw a particle here
					
					//myFlower.draw(g);
					//myParticle.draw(g);
					//pixelStreak(g);

                   

                    // HW Functions
                    
                     if (app.key === 1) {
						randomDot(g, w, h);
                     }
                     if (app.key === 2) {
						pixelStreak(g);
                     }
					 if (app.key === 3) {
						for(var i = 0; i < 15; i++){
							multPart[i].update(time, g);
						}
						for(var i = 0; i < 15; i++){
							multPart2[i].update(time, g);
						}
						for(var i = 0; i < 15; i++){
							multPart[i].draw(g);
						}
						g.popMatrix();
					 }
					 if(app.key === 4){
						g.fill(0, 0, 0, .05);
						g.rect(0, 0, w, h);
					 }
                };
            });
            this.initUI();
        },

        initUI : function() {

            $("#view").mousemove(function(ev) {
                var x = ev.offsetX - app.dimensions.x / 2;
                var y = ev.offsetY - app.dimensions.y / 2;
                //    console.log(x + " " + y);
                app.mouse.setTo(x, y);
            });

            // using the event helper
            $('#view').mousewheel(function(event) {

            });

            $("#view").draggable({
                helper : function() {
                    return $("<div id='dragPos'></div>");
                },

                drag : function(event, ui) {
                    var x = $('#dragPos').offset().left;
                    var y = $('#dragPos').offset().top;

                }
            });

            $(document).keydown(function(e) {

                var key = String.fromCharCode(e.keyCode);

                switch(key) {
                    case ' ':
                        app.paused = !app.paused;
                        break;
                    case '1':
						// Do something when the user
                        app.key = 1;
                        break;
                    case '2':
                        // Do something
                        app.key = 2;
                        break;
                    case '3':
                        app.key = 3;
                        // Do something
                        break;
                }

            });

            $(document).keyup(function(e) {
                app.key = undefined;
				var key = String.fromCharCode(e.keyCode);
				switch(key){
					case '3':
						app.key = 4;
						break;
				}
            });

        }
    });

});
