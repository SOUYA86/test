  (function() {

function init() {
var scene = new THREE.Scene();

  var width  = 320;
  var height = 460;
  var fov    = 60;
  var aspect = width / height;
  var near   = 1;
  var far    = 1000;
  var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.set( 0, 0, 400 );
 
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( width, height );
  document.body.appendChild( renderer.domElement );
 
  var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 0, 0.7, 0.7 );
  scene.add( directionalLight );
 
  var geometry = new THREE.CubeGeometry( 20, 50, 5 );
  var material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
  var mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  var geometry2 = new THREE.CubeGeometry( 800, 800, 5 );
  var material2 = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
  var mesh2 = new THREE.Mesh( geometry2, material2 );
meth.setZ(800);
  scene.add( mesh2 );




window.addEventListener("deviceorientation", function(evt) {


camera.rotation.order = "ZXY";
camera.rotation.x = evt.beta / 6.28;
camera.rotation.y = evt.gamma / 6.28;
camera.rotation.z = evt.alpha / 6.28;


    });


 
  ( function renderLoop () {
    requestAnimationFrame( renderLoop );

    renderer.render( scene, camera );
  } )();
}

window.onload = function() {

    if(getUa() === false) init();

    else document.addEventListener("deviceready", init, false);

}



function setScale(bound) {

    switch (getUa()) {

        case "Android":

        case "iPad":

        case "iPhone":

            document.getElementsByTagName("canvas")[0].style["-webkit-transform"] = "scale(" + bound.zoom + "," + bound.zoom + ")";

            break;

        default:

            break;

    }

    

    return bound;

}





function setBound() {

    var bound = {

        width: 320,

        height: 460,

        zoom: 1

    };

    switch (getUa()) {

        case "Android":

        case "iPad":

        case "iPhone":

            bound.height = screen.availHeight * (bound.width / screen.availWidth);

            bound.zoom = screen.availWidth / bound.width;

            break;

        default:

            bound.height = window.innerHeight;

            break;

    }



    return bound;

}



function vibrate(duration) {

    if (typeof duration === 'undefined') duration = 500;

    if (typeof navigator.notification !== 'undefined') navigator.notification.vibrate(duration);

}



function getUa() {

    if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 ) {

        return 'iPhone'; 

    } else if(navigator.userAgent.indexOf('iPad') > 0) {

        return 'iPad';

    } else if(navigator.userAgent.indexOf('Android') > 0) {

        return 'Android';

    } else return false;
}

})();
