(function() {
    
var SETTINGS_GRAVITY = 0.10,
    SETTINGS_FPS = 30,
    SETTINGS_BALL_NUM = 1,
    SETTINGS_BOUND_X = 0.13,
    SETTINGS_BOUND_Y = 1.04,
    SETTINGS_ACCELEROMETER_RELOAD_FREQ = 100,
    SETTINGS_PADDLE_ACCEL = 2.8,
    SETTINGS_POINT = 1000,
    SETTINGS_POINT_SILVER = 200,
    SETTINGS_POINT_GOLD = 3000000;
    
var GAMESTATE_STOP = 0,
    GAMESTATE_PLAY = 1;

//var accelerationWatch = null;

var imgPath = {
    'ball' : 'img/ball.png',
    'paddle' : 'img/paddle.png',
    'block_red' : 'img/block_red.png',
    'block_green' : 'img/block_green.png',
    'block_blue' : 'img/block_blue.png',
    'block_silver' : 'img/block_silver.png',
    'block_gold' : 'img/block_gold.png'
};
    

var BB = {
    stage: new PIXI.Stage(0x000000),
    renderer: null,
    screenSize: null,
    paddle: null,
    balls: [],
    blocks: [],
    score: 0,
    scoreLabel: null,
    accelLabel: null,
    xLabel: null,
    yLabel: null,
    zLabel: null,
    gxLabel: null,
    gyLabel: null,
    gzLabel: null,
    rxLabel: null,
    ryLabel: null,
    rzLabel: null,
    xL: 0.00,
    yL: 0.00,
    zL: 0.00,
    vx: 0,
    vy: 0,
    vz: 0,
    ax1: 0,
    ay1: 0,
    az1: 0,
    ax2: 0,
    ay2: 0,
    az2: 0,
    bax: 0,
    bay: 0,
    baz: 0,
    cnt:0,
    t: new Date(),
    isMouseDown: false,
    
    // Reset current game and start new one
    reset: function() {
        
BB.xLabel = new PIXI.Text("aaaaaaaaaa", {font: "12px/1.2 vt", fill: "white"});
BB.xLabel.position.x =0;
BB.xLabel.position.y = 40;
BB.stage.addChild(BB.xLabel);

BB.yLabel = new PIXI.Text("aaaaaaaaaa", {font: "12px/1.2 vt", fill: "white"});
BB.yLabel.position.x =0;
BB.yLabel.position.y = 60;
BB.stage.addChild(BB.yLabel);

BB.zLabel = new PIXI.Text("aaaaaaaaaa", {font: "12px/1.2 vt", fill: "white"});
BB.zLabel.position.x =0;
BB.zLabel.position.y = 80;
BB.stage.addChild(BB.zLabel);

BB.gxLabel = new PIXI.Text("aaaaaaaaaa", {font: "12px/1.2 vt", fill: "white"});
BB.gxLabel.position.x =0;
BB.gxLabel.position.y =100;
BB.stage.addChild(BB.gxLabel);

BB.gyLabel = new PIXI.Text("aaaaaaaaaa", {font: "12px/1.2 vt", fill: "white"});
BB.gyLabel.position.x =0;
BB.gyLabel.position.y = 120;
BB.stage.addChild(BB.gyLabel);

BB.gzLabel = new PIXI.Text("aaaaaaaaaa", {font: "12px/1.2 vt", fill: "white"});
BB.gzLabel.position.x =0;
BB.gzLabel.position.y = 140;
BB.stage.addChild(BB.gzLabel);

BB.rxLabel = new PIXI.Text("aaaaaaaaaa", {font: "12px/1.2 vt", fill: "white"});
BB.rxLabel.position.x =0;
BB.rxLabel.position.y = 160;
BB.stage.addChild(BB.rxLabel);

BB.ryLabel = new PIXI.Text("aaaaaaaaaa", {font: "12px/1.2 vt", fill: "white"});
BB.ryLabel.position.x =0;
BB.ryLabel.position.y = 180;
BB.stage.addChild(BB.ryLabel);

BB.rzLabel = new PIXI.Text("aaaaaaaaaa", {font: "12px/1.2 vt", fill: "white"});
BB.rzLabel.position.x =0;
BB.rzLabel.position.y = 200;
BB.stage.addChild(BB.rzLabel);

        BB.gameState = GAMESTATE_PLAY;
    }
}


function init() {
    // Accelerometer
    /*
    if (typeof navigator.accelerometer !== 'undefined' && !accelerationWatch) {
        accelerationWatch = navigator.accelerometer.watchAcceleration(
            BB.updateAcceleration, 
            function(ex) {
                alert("accel fail (" + ex.name + ": " + ex.message + ")");
            }, 
            {frequency: SETTINGS_ACCELEROMETER_RELOAD_FREQ}
        );
    }
    */
    BB.screenSize = setBound();
 
    BB.renderer = (getUa() === "Android") ? new PIXI.CanvasRenderer(BB.screenSize.width, BB.screenSize.height) : new PIXI.autoDetectRenderer(BB.screenSize.width, BB.screenSize.height),
    BB.renderer.transparent = false;
    document.body.appendChild(BB.renderer.view);
    
    setScale(BB.screenSize);
    
    BB.reset();
    
    // Event listeners to control the paddle
    
    window.addEventListener("devicemotion", function(evt){  
    
        var now = new Date();
        var t = (now - BB.t)/1000;
        
        if( t > 0.05) {
        
        BB.t = now;

        //生の値はブレが大きいので桁数を絞る
        var x = evt.acceleration.x;
        var y = evt.acceleration.y;
        var z = evt.acceleration.z;
        
        
        if (Math.abs(x) < 0.098){
          x = - sgn(BB.vx)*0.098;  
          BB.vx = BB.vx * 0.9;
        } 
        if (Math.abs(y) < 0.098 ){
          y = - sgn(BB.vy)*0.098;
          BB.vy = BB.vy * 0.9;
        }
        if (Math.abs(z) < 0.098 ){
          z = - sgn(BB.vz)*0.098;
          BB.vz = BB.vz * 0.9;
        }
        
        //今回値の計算
        var ax0 = x;
        var ay0 = y;
        var az0 = z;
            
        //前回値の取得
        var ax1 = BB.ax1;
        var ay1 = BB.ay1;
        var az1 = BB.az1;
            
        //前々回値の取得
        var ax2 = BB.ax2;
        var ay2 = BB.ay2;
        var az2 = BB.az2;

        BB.cnt += 1;
            
        if (BB.cnt > 50 ){
            //速度の計算
            BB.vx += ax0 * t;
            BB.vy += ay0 * t;
            BB.vz += az0 * t;
            //BB.vx += Math.round(calcV(ax0, ax1, ax2, t)*10000)/10000;
            //BB.vy += Math.round(calcV(ay0, ay1, ay2, t)*10000)/10000;
            //BB.vz += Math.round(calcV(az0, az1, az2, t)*10000)/10000;
            BB.vx = Math.abs(BB.vx) >= 0.01 ? BB.vx :0;
            BB.vy = Math.abs(BB.vy) >= 0.01 ? BB.vy :0;
            BB.vz = Math.abs(BB.vz) >= 0.01 ? BB.vz :0;
            
            
            //距離の計算
            BB.xL += BB.vx * t;
            BB.yL += BB.vy * t;
            BB.zL += BB.vz * t;
            //BB.xL += calcL(ax0, ax1, ax2, BB.vx, t);
            //BB.yL += calcL(ay0, ay1, ay2, BB.vy, t);
            //BB.zL += calcL(az0, az1, az2, BB.vz, t);
    
            BB.xLabel.setText("ax:"+ax0+"   interval:" +t) ;
            BB.yLabel.setText("ay:"+ay0);
            BB.zLabel.setText("az:"+az0);
            BB.gxLabel.setText("xL:"+BB.xL);
            BB.gyLabel.setText("yL:"+BB.yL);
            BB.gzLabel.setText("zL:"+BB.zL);
            BB.rxLabel.setText("vx:"+BB.vx);  
            BB.ryLabel.setText("vy:"+BB.vy);  
            BB.rzLabel.setText("vz:"+BB.vz);
            
            console.log(BB.cnt+":  ax:"+Math.round(ax0*1000)+": ay:"+Math.round(ay0*1000)+": az:"+Math.round(az0*1000));
            
        
        }
        
        //後処理
        BB.ax2 = ax1;
        BB.ay2 = ay1;
        BB.az2 = az1;
        BB.ax1 = ax0;
        BB.ay1 = ay0;
        BB.az1 = az0;

        }

    }, true);

    requestAnimFrame(animate);
}


function sgn(i) {
    if(i > 0){
        return 1;
    }
    if(i < 0){
        return -1;
    }
    return 0;
}

function calcV(a0, a1, a2, t){    
    var k1 = (a2 -2*a1 + a0) / (2*(t)*(t));
    var k2 = (a2 -4*a1 + 3*a0) / (2*(t));
    
    var result = k1/3*(-t)*(-t)*(-t) + k2/2*(-t)*(-t) + a0*(-t); 
    
    return - result;
}

function calcL(a0, a1, a2, v0, t){    
    var k1 = (a2 -2*a1 + a0) / (2*(t)*(t));
    var k2 = (a2 -4*a1 + 3*a0) / (2*(t));
    
    var result = k1/12*(-t)*(-t)*(-t)*(-t) + k2/6*(-t)*(-t)*(-t) + a0/2*(-t)*(-t) + v0*(-t); 
    
    return - result;
}


// Render callback
function animate() {
    
    requestAnimFrame(animate);
    BB.renderer.render(BB.stage);
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
