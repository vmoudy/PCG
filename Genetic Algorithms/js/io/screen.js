/**
 * @author Kate Compton
 */
define(["common"], function(common) {'use strict';
    // a set of corners
    // read from an image, then deform back to a rectangle

    var Screen = Class.extend({
        init : function() {
            this.corners = [];

            for (var i = 0; i < 4; i++) {
                var r = Math.random() * 40 + 150;
                var p = Vector.polar(r, (Math.PI / 2) * (i + .5));
                p.y *= 1.5;

                this.corners[i] = new Corner(p, i);
            }
        },
        draw : function(g) {

            for (var i = 0; i < this.corners.length; i++) {
                this.corners[i].draw(g);
            }

            g.fill(1, 0, 1, .4);
            g.beginShape();
            for (var i = 0; i < this.corners.length; i++) {
                g.vertex(this.corners[i].x, this.corners[i].y);
            }
            g.endShape();
        }
    });

    var Corner = Vector.extend({
        init : function(p, index) {
            var corner = this;
            this.id = index;
            this.setTo(p);
            this.div = $("<div/>", {
                class : "handle",
            });

            $("#handles").append(this.div);

            this.div.draggable({
                drag : function(event, ui) {
                    var p2 = ui.position;
                    corner.setTo(p2.left + radius/2, p2.top + radius/2);
                }
            });

            var radius = 25;
            var color = new common.KColor(this.id * .22 + .12, 1, 1);
            var style = this.toCenteredCSS(radius, radius);

            style.backgroundColor = color.toCSS(0, 0);
            var innerDark = "inset -2px -2px 5px " + color.toCSS(-.5, 0);
            var innerLight = " inset 2px 2px 5px " + color.toCSS(.5, 0);
            var shadow = " 1px 4px 5px " + color.toCSS(-.9, -.3);
            style.boxShadow = innerDark + ", " + innerLight + ", " + shadow;
            this.div.css(style);
        },

        draw : function(g) {

            var hue = this.id * .23 + .13;

            g.fill(hue, .8, .2, .5);
            g.ellipse(this.x, this.y + 8, 18, 15);
            g.fill(hue, 1, 1);
            this.drawCircle(g, 15, 15);
            g.fill(hue, .4, 1);
            this.drawCircle(g, 5, 5);

        }
    });
    return Screen;
});
