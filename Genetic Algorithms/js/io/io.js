/**
 * @author Kate Compton
 */
define(["./screen"], function(Screen) {'use strict';
    // a set of corners
    // read from an image, then deform back to a rectangle
    app.kScreen = new Screen();
    var count = 0;

    var codexStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var codexInt = [];
    for (var i = 0; i < 256; i++) {
        var idx = codexStr.indexOf(String.fromCharCode(i));
        codexInt[i] = idx;
    }
    var Base64 = {
        // assuming that the input string encodes a number of bytes divisible by 3
        decode : function(input) {
            var output = new Array(input.length * 3 / 4);
            var inLength = input.length;
            var outIndex = 0;
            for (var i = 0; i < inLength; i += 4) {
                var enc1 = codexInt[input.charCodeAt(i)];
                var enc2 = codexInt[input.charCodeAt(i + 1)];
                var enc3 = codexInt[input.charCodeAt(i + 2)];
                var enc4 = codexInt[input.charCodeAt(i + 3)];

                var chr1 = (enc1 << 2) | (enc2 >> 4);
                var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                var chr3 = ((enc3 & 3) << 6) | enc4;

                output[outIndex] = chr1;
                output[outIndex + 1] = chr2;
                output[outIndex + 2] = chr3;
                outIndex += 3;
            }

            return output;
        }
    };

    function drawDM(plugin, canvas) {

        var dm = plugin.depthMap;
        if (dm.length == 0)
            return;
        var im = plugin.imageMap;
        if (im.length == 0)
            return;
        var ctx = canvas.getContext('2d');
        var pix = ctx.createImageData(160, 120);
        var data = pix.data;
        console.log(data);
        var srcData = Base64.decode(dm);

        for (var i = 0; i < 160 * 120; i++) {
            var d0 = srcData[i * 2];
            var d1 = srcData[i * 2 + 1];
            data[i * 4] = d0;
            data[i * 4 + 1] = d0;
            data[i * 4 + 2] = 255;
            data[i * 4 + 3] = 255;

        }
        ctx.putImageData(pix, 0, 0);
    }

    function loaded() {
        console.log("Loaded");
        // view-source:http://motionos.com/webgl/
        var codexStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var codexInt = [];

        for (var i = 0; i < 256; i++) {
            var idx = codexStr.indexOf(String.fromCharCode(i));
            codexInt[i] = idx;
        }
        var Base64 = {
            // assuming that the input string encodes a number of bytes divisible by 3
            decode : function(input) {
                var output = new Array(input.length * 3 / 4);
                var inLength = input.length;
                var outIndex = 0;
                for (var i = 0; i < inLength; i += 4) {
                    var enc1 = codexInt[input.charCodeAt(i)];
                    var enc2 = codexInt[input.charCodeAt(i + 1)];
                    var enc3 = codexInt[input.charCodeAt(i + 2)];
                    var enc4 = codexInt[input.charCodeAt(i + 3)];

                    var chr1 = (enc1 << 2) | (enc2 >> 4);
                    var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    var chr3 = ((enc3 & 3) << 6) | enc4;

                    output[outIndex] = chr1;
                    output[outIndex + 1] = chr2;
                    output[outIndex + 2] = chr3;
                    outIndex += 3;
                }

                return output;
            }
        };

        zig.embed();
        var plugin = zig.findZigObject();
        plugin.requestStreams({
            updateImage : true,
            updateDepth : true,
        });

        var canvas = document.getElementById('canvas');
        // tell the plugin to update the RGB image
        plugin.addEventListener("NewFrame", function() {// triggered every new kinect frame
            var rgbImage = Base64.decode(plugin.imageMap);
            // plugin.imageMapResolution stores the resolution, right now hard-coded
            // to QQVGA (160x120 for CPU-usage reasons)
            // do stuff with the image
            drawDM(plugin, canvas);

        });

    }

    // document.addEventListener('DOMContentLoaded', loaded, false);
    return {
        init : function() {
            console.log("Init");
            loaded();
        }
    };
});
