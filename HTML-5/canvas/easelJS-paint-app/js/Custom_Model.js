

/* -------------------------------- MODEL CLASS - SINGLATON -------------------------------- */
(function(){
	// LOCAL SCOPE
	var _this;
	
	// CONSTRUCTION
	function Model(){
		if(_this){
			return _this;
		}
		_this = this;
		
		// ---------------------- PRIVATE PROPERTIES ----------------------
		var _canvas
		var _canvasDom;
		var _canvasWidth;
		var _canvasHeight;
		var _windowWidth;
		var _windowHeight;
		
		var _stage;
		var _drawingScreen;
		var _strEditingAction = "";
		
		// DEFAULT
		initialHandler();
		
		// INSTANCE PROPERTIES
		_this.stage = _stage;
		_this.canvas = _canvas;
		_this.canvasDom = _canvasDom;
		_this.canvasWidth = _canvasWidth;
		_this.canvasHeight = _canvasHeight;
		
		_this.startHandler = startHandler;
		_this.updateHandler = updateHandler;
		_this.initialHandler = initialHandler;
		_this.disposeHandler = disposeHandler;
		
		// ---------------------- PUBLIC HANDLERS ----------------------
		function initialHandler(){
			_canvas = $("#canvas");
			_canvasDom = document.getElementById("canvas");
			_canvasWidth = _canvasDom.width;
			_canvasHeight = _canvasDom.height;
			
			_stage = new createjs.Stage(_canvasDom);
			_stage.enableMouseOver(40);			
			createjs.Touch.enable(_stage);
			createjs.Ticker.setFPS(60);
			createjs.Ticker.addEventListener("tick", tickerEventHandler);
		}
		function startHandler(){
			loadDataFromServicesHandler();
		}
		function disposeHandler(){
		}
		function updateHandler(){
		}
		
		// ---------------------- GET & SET HANDLERS ----------------------
		_this.setBGHandler = function(img){
			_drawingScreen.setBgImageHandler(img);
		};
		_this.setToleranceHandler = function(val){
			_drawingScreen.setToleranceHandler(val);
		};
		_this.getEditingActionHandler = function(){
			return _strEditingAction;
		};
		_this.setEditingActionHandler = function(str){
			_strEditingAction = str;
			_drawingScreen.setEditingActionHandler();
		};
		
		// ---------------------- PRIVATE HANDLERS ----------------------
		function loadDataFromServicesHandler(){
			$(".loader").show();
			$(".overlay-bg").show();
			loadPhotoGalleryHandler();
			buildScreenHandler();
		}
		function buildScreenHandler(){
			_drawingScreen = new DrawingScreen();
			_stage.addChildAt(_drawingScreen, 0);
		}
		
		function loadPhotoGalleryHandler(){
			$(".loader").hide();
			$(".overlay-bg").hide();
			$(".view-container").show();
		}
		
		// ---------------------- EVENT HANDLERS ----------------------
		function tickerEventHandler(E){
			if(_drawingScreen){
				_drawingScreen.cache(0, 0, _canvasWidth, _canvasHeight);
				_drawingScreen.updateHandler();
			}
			_stage.update();
		}
	}
	
	// END
	window.Model = Model;
}());
