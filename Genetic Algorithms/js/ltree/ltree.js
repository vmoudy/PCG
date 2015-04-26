/**
 * @author Kate
 */

define(["common", "graph/graph"], function(common, Graph) {
    var SPREAD = 0;
    var ID_ANGLE = 1;
    var ANGLE_SKEW = 2;
    var ANIM_ANGLE = 3;
    var SHRINKAGE = 4;
    var BUSHINESS = 5;
    var HUE_START = 6;
    var HUE_DIFF = 7;
    var FLOWER_HUE = 8;
    var FLOWER_COUNT = 9;
	var LEAF_LENGTH = 10;
	var LEAF_BUSHINESS = 11;
	var WILT_ANGLE = 12;
	var FLOWER_STYLE = 13;
	var SPREAD = 14;
	var SOMETHING = 15;
	var SOMETHING1 = 16;
	var SOMETHING2 = 17;
	var SOMEETHING3 = 18;
	var SOMETHING4 = 19;

    var LENGTH_VARIATION = 6;

    var graphCount = 0;
    // Make some custom fractals

    var TreeNode = Graph.Node.extend({
        init : function(parent, childPct) {
            this._super();
            this.parent = parent;
            this.depth = 0;

            // No children yet
            this.children = [];
            this.childPct = childPct;

            if (this.parent) {
                this.setParent();
            }

            // No offset to start
            this.angle = this.baseAngle;

            // Make a color for this node
            this.idColor = new common.KColor((3 + this.dna[HUE_START] + this.dna[HUE_DIFF] * this.depth) % 1, 1, .1 + .1 * this.depth);

        },

        setParent : function() {

            this.dna = this.parent.dna;

            this.depth = this.parent.depth + 1;

            // Add to the parent's list of children
            this.childIndex = this.parent.children.length;
            this.parent.children.push(this);

            // As a child, offset the child index
            var skew = Math.pow(this.dna[ANGLE_SKEW] - .5, 3);
            var spread = (1.5 * this.dna[BUSHINESS]);
            this.baseAngle = this.parent.angle + (this.dna[SPREAD] * 2.5) * (this.childPct - .5) + (Math.pow(this.dna[WILT_ANGLE] - .2, 3));

            // Set the position relative to the parent
            var mult = 15 - 12 * this.dna[BUSHINESS];
            this.branchLength = mult * this.parent.radius;

            // Add a variance in length
            this.branchLength *= (.8 + .3 * (Math.random() - .4));
            this.radius = this.parent.radius * (.6 + .3 * this.dna[SHRINKAGE]);

            this.setToPolarOffset(this.parent, this.branchLength, this.baseAngle);

        },

        createChild : function(pct, graph) {
            var child = new TreeNode(this, pct);

            graph.addNode(child);
            graph.connect(this, child);
        },

        update : function() {
            // Set the position relative to the parent
            if (this.parent) {
                this.angleOffset = .1 * (1.2 + this.depth) * Math.sin(2 * app.time.total + this.depth);

                // Offset self
                this.angleOffset += .2 * Math.sin(this.id);

                this.angle = this.baseAngle + this.angleOffset;

                this.setToPolarOffset(this.parent, this.branchLength, this.angle);
            }

            // Update self, then update children
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].update();
            }
        },

        draw : function(g) {
            g.noStroke();
            this.idColor.fill(g);
            this.drawCircle(g, this.radius);

            if (this.children.length === 0) {
                g.pushMatrix();
                this.translateTo(g);
                g.rotate(this.angle);

                var flowerCount = 5	 + Math.round(8 * this.dna[FLOWER_COUNT]);

                // Draw some flowers?  What kind?
                for (var i = 0; i < flowerCount; i++) {
                    g.fill(this.dna[FLOWER_HUE], 1, 1, .7);
                    g.rotate(Math.PI * 2 / flowerCount);
                    var petalSize = 3 * this.radius;
                    g.ellipse(petalSize * 1.2, 0, petalSize, petalSize * this.dna[LEAF_LENGTH]);
					g.fill(this.dna[FLOWER_HUE] * this.dna[HUE_DIFF], this.dna[FLOWER_STYLE], 1, Math.random() + .1);
					g.ellipse(petalSize * this.dna[LEAF_BUSHINESS], this.dna[LEAF_BUSHINESS], petalSize, petalSize * this.dna[LEAF_LENGTH]);
                }
                g.popMatrix();

            }
        },

        getColor : function() {
            return this.idColor;
        }
    });

    // A root node is a special case of a tree node
    var RootNode = TreeNode.extend({
        init : function(dna, pos, angle, radius) {
            this.dna = dna;
            this._super();

            this.setTo(pos);
            this.radius = radius;

            this.angle = angle;
            this.depth = 0;
        }
    });

    var Tree = Graph.extend({
        init : function(rootPos, dna) {
            this._super();
            this.iterations = 0;

            // Create a root node
            this.root = new RootNode(dna, rootPos, -Math.PI / 2, 5 + Math.random() * 4);

            this.addNode(this.root);

            this.cleanup();
            for (var i = 0; i < 4; i++) {
                this.iterate();
                this.cleanup();

            }

        },

        iterate : function() {
            this.cleanup();

            // Take all the current nodes
            for (var i = 0; i < this.nodes.length; i++) {
                // Any children?
                var n = this.nodes[i];

                if (n.children.length === 0 && n.radius > 2) {
                    // Create children
                    var branches = Math.floor(Math.random() * 5);
                    for (var j = 0; j < branches; j++) {
                        n.createChild((j + .5) / branches, this);

                    }

                }

            }

            this.cleanup();
            this.iterations++;
        },

        update : function() {
            this.root.update();
        },

        draw : function(g) {

            for (var i = 0; i < this.edges.length; i++) {
                var e = this.edges[i];
                var angle = e.getAngle();
                var m = e.getLength();
                var r0 = e.start.radius;
                var r1 = e.end.radius;
                g.pushMatrix();

                e.start.translateTo(g);
                g.rotate(angle);
                //  g.rect(0, 0, m, 4);

                e.start.getColor().fill(g, 0, 0);
                g.beginShape();
                g.vertex(0, -r0);
                g.vertex(0, r0);
                g.vertex(m, r1);
                g.vertex(m, -r1);
                g.endShape();
                g.popMatrix();
            }

            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].draw(g);
            }
        }
    });

    return {
        createLTree : function(root) {
            var dna = [];

            // Create random DNA
            for (var i = 0; i < 20; i++) {
                dna[i] = Math.sin(50 * Math.random()) * .5 + .5;
            }
            return new Tree(root, dna);
        }
    };

});
