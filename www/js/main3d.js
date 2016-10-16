(function() {
    
    var vx=0;
    var vy=0;
    var vz=0;
    
    var ax=0;
    var ay=0;
    var az=0;

    var cameraX;
    var cameraY;

    var touchX=0;
    var touchY=0;
    var isMouseDown = false;

function init() {
var scene = new THREE.Scene();

  var width  = 320;
  var height = 540/2;
  var fov    = 60;
  var aspect = width / height;
  var near   = 1;
  var far    = 10000;
  var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.set( 0, 0, 0 );
  var cameragroup = new THREE.Object3D();
  //group.add( camera );
  scene.add( cameragroup );
  

  var renderer1 = new THREE.WebGLRenderer();
  renderer1.setSize( width, height );
  document.body.appendChild( renderer1.domElement );

  var renderer2 = new THREE.WebGLRenderer();
  renderer2.setSize( width, height );
  document.body.appendChild( renderer2.domElement );


  var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 0, 0.7, 0.7 );
  scene.add( directionalLight );

  var geometry = new THREE.CubeGeometry( 20, 50, 5 );
  var material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
  var mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );
  mesh.position.z = -100;

  var geometry2 = new THREE.CubeGeometry( 4000, 4000, 5 );
  var material2 = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
  var mesh2 = new THREE.Mesh( geometry2, material2 );
  scene.add( mesh2 );
  mesh2.position.y = 400;
  mesh2.position.z = -400;

  window.addEventListener("deviceorientation", function(evt) {      
    camera.rotation.order = "ZXY";
    camera.rotation.x = evt.beta / 180 * Math.PI;
    camera.rotation.y = evt.gamma / 180 * Math.PI;
    camera.rotation.z = -evt.webkitCompassHeading / 180 * Math.PI;  //alphaだと端末からみた相対座標になるため変更
    }, true  
  );

  window.addEventListener("touchmove", function(e) {
    e.preventDefault();
    camera.position.x = cameraX - ( e.touches[0].clientX - touchX ) /20;
    camera.position.y = cameraY + ( e.touches[0].clientY - touchY ) /20;
    }, true
  );

  window.addEventListener("touchstart", function(e) {
    e.preventDefault();
    if( isMouseDown == false ) {
        cameraX = camera.position.x;
        cameraY = camera.position.y;
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
        isMouseDown = true;
    }
    }, true
  );

  window.addEventListener("touchend", function(e) {
    e.preventDefault();
    isMouseDown = false;
    }, true
  );


  ( function renderLoop () {
    requestAnimationFrame( renderLoop );
    renderer1.render( scene, camera );
    renderer2.render( scene, camera );
    } 
  )();
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
