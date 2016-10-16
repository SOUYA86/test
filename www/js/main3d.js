(function() {

    //定数
    var EYE_WIDTH = 20;


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
    
    var t=0;


function init() {
var scene = new THREE.Scene();

  var width  = 320;
  var height = 540/2;
  var fov    = 40;
  var aspect = width / height;
  var near   = 1;
  var far    = 10000;
  var cameraR = new THREE.PerspectiveCamera( fov, aspect, near, far );
  cameraR.position.set( 0, +EYE_WIDTH, 0 );
  var cameraL = new THREE.PerspectiveCamera( fov, aspect, near, far );
  cameraL.position.set( 0, -EYE_WIDTH, 0 );
  var cameragroup = new THREE.Object3D();
  cameragroup.add( cameraR );
  cameragroup.add( cameraL );
  scene.add( cameragroup );
  

  var rendererR = new THREE.WebGLRenderer( {antialias:true} );
  rendererR.setSize( width, height );
  rendererR.shadowMapEnabled = true;
  document.body.appendChild( rendererR.domElement );

  var rendererL = new THREE.WebGLRenderer( {antialias:true} );
  rendererL.setSize( width, height );
  rendererL.shadowMap.enabled = true;
  document.body.appendChild( rendererL.domElement );


  //環境光
  var ambientLight = new THREE.AmbientLight( 0x222222 );
  scene.add( ambientLight );

  //太陽光
  var directionalLight = new THREE.DirectionalLight( 0xffffff , 1 );
  directionalLight.position.set( 0, 10000, 10000 );
  directionalLight.castShadow = true;
  scene.add( directionalLight );

  var Boxsize=50;
  var NUM=80;

  var geometry = new THREE.Geometry();
  var geometry2 = new THREE.CubeGeometry( Boxsize, Boxsize, Boxsize*1 );
  var material2 = new THREE.MeshPhongMaterial( { color: 0x0000ff } );  
  var i;
  var j;
  
  for(i=-NUM;i<=+NUM;i++){ 
      for(j=-NUM;j<=+NUM;j++){
            var z = Math.round((Math.random())-0.45)*Boxsize*((Math.random()*Math.random()*5+1));

            if ( z > 0 ) {
                var mesh2 = new THREE.Mesh( geometry2, material2 ); 
                mesh2.position.x = i*Boxsize;
                mesh2.position.y = j*Boxsize;
                mesh2.position.z = z - Boxsize*15;
                THREE.GeometryUtils.merge(geometry,mesh2);
            }
      }
  }
  
  var obj = new THREE.Mesh( geometry, material2);
  obj.castShadow = true;  
  scene.add(obj);
  
  
  var field = new THREE.Mesh( new THREE.CubeGeometry( Boxsize*NUM*2, Boxsize*NUM*2, 10 ), new THREE.MeshPhongMaterial( { color: 0xffffff } ));
  field.position.z = -Boxsize*15 - 5;
  field.castShadow = true;
  field.receiveShadow = true;
  scene.add(field);
  


  window.addEventListener("deviceorientation", function(evt) {      
    cameragroup.rotation.order = "ZXY";
    cameragroup.rotation.x = evt.beta / 180.0 * Math.PI;
    cameragroup.rotation.y = evt.gamma / 180.0 * Math.PI;
    cameragroup.rotation.z = evt.alpha / 180.0 * Math.PI;
    
    //camera.rotation.z = -evt.webkitCompassHeading / 180 * Math.PI;  //alphaだと端末からみた相対座標になる
    }, true  
  );

  window.addEventListener("touchmove", function(e) {
    e.preventDefault();
    cameragroup.position.x = cameraX - ( e.touches[0].clientX - touchX ) /20;
    cameragroup.position.y = cameraY + ( e.touches[0].clientY - touchY ) /20;
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
    rendererR.render( scene, cameraR );
    rendererL.render( scene, cameraL );
    cameragroup.position.x = Math.sin(t/180*Math.PI) * 1000;
    cameragroup.position.y = Math.cos(t/180*Math.PI) * 1000;
    t = t+1;    
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
