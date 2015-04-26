var app = {};

function getRandom(array) {
    var which = Math.floor(Math.random() * array.length);
    return array[which];
}
function starDate(){
	var x = Math.floor(Math.random() * 10);
	var y = Math.floor(Math.random() * 10);
	var z = Math.floor(Math.random() * 10);
	var w = Math.floor(Math.random() * 31);
	return "41" + x + y + z + "." + w;
}

define(["./tracery/tracery", "plugins/plugins", "./grammars/grammars"], function(_tracery, plugins, grammars) {'use strict';

    $.extend(app, {

        init : function() {
            app.plugins = plugins;
			app.starDate = starDate();
			console.log(app.starDate);
            app.currentGrammar = tracery.createGrammar(grammars.custom);
            app.storyView = $("#storyHolder");
            app.reroll();

            app.initUI();
            app.vizEnabled = false;
            $("#visualization").hide();
        },

        reroll : function() {
            app.currentExpansions = [];
            app.storyView.html("");
            for (var i = 0; i < 10; i++) {
				app.starDate = starDate();
                var exp = app.currentGrammar.expand("#origin#");
				app.storyView.append('<p>' + "Captains log, Star date " + app.starDate  + '</p>');
				app.storyView.append('<p>' + exp.finalText + '</p>');
                 
				app.currentExpansions[i] = exp;
            }

        },

        initUI : function() {

            $(document).keydown(function(e) {

                var key = String.fromCharCode(e.keyCode);
                var vizWindow = $("#visualization");
                switch(key) {
                    case ' ':
                        app.vizEnabled = !app.vizEnabled;
                        if (app.vizEnabled) {

                            vizWindow.show();

                            app.plugins.expansionview.createTree(app.currentExpansions[0], vizWindow);

                        } else
                            vizWindow.hide();
                        return false;
                        break;
                    case '1':
                        break;
                    case '2':
                        break;
                    case '3':
                        break;
                }

            });

            $(document).keyup(function(e) {
                app.key = undefined;
            });
        },
    });
});
