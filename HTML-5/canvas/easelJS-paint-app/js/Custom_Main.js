
/* -------------------------------- GLOBAL SCOPE -------------------------------- */
var _html;
var _body;
var _window = $(window);
var _document = $(document);

var _domElement;
var _isSupportedBrowser = true;

var _model;
var _controller;


/* -------------------------------- EVENT HANDLERS -------------------------------- */
_window.load(function(e) {
    _html = $("html");
	_body = $("body");
	
	checkBrowserSupportHandler();
});


/* -------------------------------- HANDLERS -------------------------------- */
function checkBrowserSupportHandler(){
	var gl = null;
	var isBrowserSupported = true;
	var canvasDOMElement = document.getElementById("canvas");
	
	try{
		gl = canvasDOMElement.getContext;
	}catch(e){
	}
	
	if(!gl){
		isBrowserSupported = false;
	}else{
		if($.browser.chrome){
			if( $.browser.version.split(".")[0] < 10){
				isBrowserSupported = false;
			}
		}else if($.browser.msie){
			if( $.browser.version.split(".")[0] < 11){
				isBrowserSupported = false;
			}
		}else if($.browser.mozilla){
			if( $.browser.version.split(".")[0] < 5){
				isBrowserSupported = false;
			}
		}else if($.browser.opera){
			if( $.browser.version.split(".")[0] < 15){
				isBrowserSupported = false;
			}
		}else if($.browser.safari ){
			if( $.browser.version.split(".")[0] < 6){
				isBrowserSupported = false;
			}
		}
	}
	
	if(!isBrowserSupported){
		$(".browser-not-supported").show();
		return;
	}
	
	checkDeviceSupportHandler();
}
function checkDeviceSupportHandler(){
	var isDeviceSupported = true;
	
	if(!isDeviceSupported){
		$(".device-size-not-supported").show();
		return;
	}else{
		$(".container").show();
	}
	
	_model = new Model();
	_model.startHandler();
	_controller = new Controller();
}


/* -------------------------------- UTILS HANDLERS -------------------------------- */
function getScaleRatio(AW, AH, TW, TH){
	var scaleRatio;
	var actualRatio = AW / AH;
	var targetRatio = TW / TH;
	if(targetRatio > actualRatio){
		scaleRatio = TH / AH;
	}else{
		scaleRatio = TW / AW;
	}
	return scaleRatio;
}

// Filters
var InvertFilter = new createjs.ColorMatrixFilter([
		-1,0,0,0,255, // red component
		0,-1,0,0,255, // green component
		0,0,-1,0,255, // blue component
		0,0,0,1,0  // alpha
]);
var GrayscaleFilter = new createjs.ColorMatrixFilter([
		0.30,0.30,0.30,0,0, // red component
		0.30,0.30,0.30,0,0, // green component
		0.30,0.30,0.30,0,0, // blue component
		0,0,0,1,0  // alpha
]);