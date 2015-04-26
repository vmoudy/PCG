define(["inheritance", "common"], function(_inheritance, common) {'use strict';
    var Particle = Class.extend({
        init : function() {
			var x = Math.random() * 200 - 100;
			var y = Math.random() * 200 - 100;
			var u = Math.random() * 200 - 100;
			var v = Math.random() * 200 - 100;
			this.position = new Vector(x, y);
			this.position2 = new Vector(u, v);
			this.width = Math.random() * 40;
			this.height = Math.random() * 30;
			this.velocity = Vector.polar(100, Math.random() * 2 * Math.PI);
			this.acceleration = Vector.polar(100, Math.random() * 2 * Math.PI);
			this.acceleration = new Vector(0, 100);
			this.radius = Math.random() * 25;
        },

        // Figure out the forces on the particle, how to change the velocity, 
        // and then move it somewhere.  The Vector library has many functions that may be useful here
        update : function(time, g) {
			this.velocity.addMultiple(this.acceleration, time.elapsed);
			this.position.addMultiple(this.velocity, time.elapsed);
			this.position2.addMultiple(this.velocity, time.elapsed);
			this.acceleration = new Vector(this.position);
			this.acceleration.mult(-5);
			var r = Math.random() * 1;
			g.stroke(1-r, r * r , r, .5)
			this.position.drawArrow(g, this.position, 2);
			g.stroke(0, 0, 0);
        },



        // Draw the particle to the screen.  'g' is the processing drawing object
        //  You might use: 'g.ellipse(x, y, radiusW, radiusH)', or 'g.rect(x, y, radiusW, radiusH)'
        //  Remember to also set the fill and stroke, or remove them if you dont want them
        //  You could also use a 'for' loop to layer multiple ellipses for each particle
        //  Also, browse the Vector library for useful drawing functions that deal with vectors
		
        draw : function(g) {
				var r = this.radius;
				var x = 1.0;
				var y = 1.0;
				g.fill(x, y, .5);
				g.ellipse(this.position.x * 5, this.position.y * 2, r, r);
				g.fill(x - 1.0, y - 1.0, 0, 1);
				g.ellipse(this.position.x * 5, this.position.y * 2, r/2, r/2);
				g.fill(x, y, .5);
				g.ellipse(this.position.x * 5, this.position.y * 2, r/4, r/4);
				g.fill(x - 1.0, y - 1.0, 0, 1);
				g.ellipse(this.position.x * 5, this.position.y * 2, r/8, r/8);
				
			for(var j = 0; j < 5; j++){
				var pct = j/5;
				var w = this.width * (1 - pct);
				var h = this.height * (1 - pct);
				var r = Math.random();
				g.fill(.75 * r, 1 - r, .2 * r, 1);
				g.rect(this.position2.x * j, this.position2.y * j, w, h);
			}
        },
    });

    return Particle;
});
