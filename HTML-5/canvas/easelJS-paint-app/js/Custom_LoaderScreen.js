
(function(){
	// ---------------------------------- INHERITANCE ----------------------------------
	LoaderScreen.prototype = new createjs.Container();
		  
	// ---------------------------------- CLASS - CONSTRUCTOR ----------------------------------
	function LoaderScreen(){
		var _this = this;
		
		/* ---------------------- PRIVATE PROPERTIES ---------------------- */
		var _shapeTriangleLeft;
		var _shapeTriangleRight;
		var _shapePreloaderLine;
		
		// DEFAULT
		initialHandler();
		
		// INSTANCE PROPERTIES
		_this.startHandler = startHandler;
		_this.disposeHandler = disposeHandler;
		_this.updateHandler = updateHandler;
		
		
		/* ---------------------- PUBLIC HANDLERs ---------------------- */
		function startHandler(){
		}
		function disposeHandler(){
			_shapePreloaderLine.graphics.clear();
			
			createjs.Tween.removeTweens(_shapeTriangleLeft);
			createjs.Tween.get(_shapeTriangleLeft).to({x:-_model.canvasWidth, y:_model.canvasHeight}, 1000);
			
			createjs.Tween.removeTweens(_shapeTriangleRight);
			createjs.Tween.get(_shapeTriangleRight).to({x:_model.canvasWidth, y:-_model.canvasHeight}, 1000).call(completeHandler);
			function completeHandler(){
				_model.stage.removeChild(_this);
			}
		}
		function updateHandler(){
			var x = _model.canvasWidth * _model.loadQueue.progress;
			var y = _model.canvasHeight * _model.loadQueue.progress;
			
			_shapePreloaderLine.graphics.clear();
			_shapePreloaderLine.graphics.beginStroke("#014197")
			_shapePreloaderLine.graphics.setStrokeStyle(2);
			_shapePreloaderLine.graphics.moveTo(0, 0);
			_shapePreloaderLine.graphics.lineTo(x, y);
		}
		
		
		/* ---------------------- PRIVATE HANDLERs ---------------------- */
		function initialHandler(){
			_shapeTriangleLeft = new createjs.Shape();
			_shapeTriangleLeft.graphics.beginFill("#a3caff");
			_shapeTriangleLeft.graphics.moveTo(0, 0);
			_shapeTriangleLeft.graphics.lineTo(0, _model.canvasHeight);
			_shapeTriangleLeft.graphics.lineTo(_model.canvasWidth, _model.canvasHeight);
			_shapeTriangleLeft.graphics.endFill();
			
			_shapeTriangleRight = new createjs.Shape();
			_shapeTriangleRight.graphics.beginFill("#3e7ed5");
			_shapeTriangleRight.graphics.moveTo(0, 0);
			_shapeTriangleRight.graphics.lineTo(_model.canvasWidth, 0);
			_shapeTriangleRight.graphics.lineTo(_model.canvasWidth, _model.canvasHeight);
			_shapeTriangleRight.graphics.endFill();
			
			_shapePreloaderLine = new createjs.Shape();
			
			_this.addChild(_shapeTriangleLeft);
			_this.addChild(_shapeTriangleRight);
			_this.addChild(_shapePreloaderLine);
		}
		
				
		/* ---------------------- EVENT HANDLERs ---------------------- */
	}
	
	// ---------------------------------- END ----------------------------------
	window.LoaderScreen = LoaderScreen;
}())