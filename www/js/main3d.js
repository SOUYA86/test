function init() {

    requestAnimFrame(animate);
}


// Render callback
function animate() {
    
    requestAnimFrame(animate);
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
