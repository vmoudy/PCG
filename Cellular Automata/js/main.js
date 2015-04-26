/**
 * @author Kate Compton
 */
/**
 * @author Kate Compton
 */

require.config({

    paths : {

        'inheritance' : './vendor/inheritance',
        'common' : './common/commonUtils',
        'react' : './vendor/react',
        'three' : './vendor/three',
        'fresnel' : './vendor/FresnelShader',
        'curveExtras' : './vendor/CurveExtras',
        'noise' : './vendor/simplex_noise',
        'seedrandom' : './vendor/seedrandom',
        'processing' : './vendor/processing',
        'rhill-voronoi': "./vendor/rhill-voronoi-core"
    },
    shim : {

        'fresnel' : {
            exports : '_three',
            deps : ['three']
        },
        'curveExtras' : {
            exports : '_three',
            deps : ['three']
        },

        'react' : {
            exports : 'React'
        },

    }
});

require(["./app"], function(_app) {
    console.log("Start");

    app.init();

});
