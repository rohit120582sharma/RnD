
(function(){
	// ---------------------------------- INHERITANCE ----------------------------------
	DrawingScreen.prototype = new createjs.Container();
	
	// ---------------------------------- CLASS - CONSTRUCTOR ----------------------------------
	function DrawingScreen(){
		var _this = this;
		
		/* ---------------------- PRIVATE PROPERTIES ---------------------- */
		// drawing & masking display-object structure with layring
		var _mcMain;
		
		var _mcBg;
		var _bmBg;
		var _bmdBg;
		var _mcBgGray;
		var _bmBgGray;
		
		var _mcBaseCoat;
		var _bmBaseCoat;
		var _bmdBaseCoat;
		
		var _mcMask;
		var _bmMask;
		var _bmdMask;
		
		// bitmap-data drawing objects
		var _rect;
		var _matrix;
		var _colorTransform;
		var _alphaMaskFilter;
		var _mcMaskDrawContainer;
		
		//
		var _nBrushSize;
		var _nTolerance;
		var _drawingCompositeOperation;
		
		// DEFAULT
		initialHandler();
		
		// INSTANCE PROPERTIES
		_this.startHandler = startHandler;
		_this.disposeHandler = disposeHandler;
		_this.updateHandler = updateHandler;
		
		/* ---------------------- PUBLIC HANDLERs ---------------------- */
		function startHandler(){
			_this.visible = true;
		}
		function disposeHandler(){
			_this.visible = false;
		}
		function updateHandler(){
		}
		
		// ---------------------- GET & SET HANDLERS ----------------------
		_this.setBgImageHandler = function(img){
			_bmdBg.drawImage(img, 0, 0, _model.canvasWidth, _model.canvasHeight, 0, 0, _model.canvasWidth, _model.canvasHeight);
			_bmBgGray.image = _bmBg.image;
			_bmBgGray.filters = [GrayscaleFilter];
			_bmBgGray.updateCache(0, 0, _model.canvasWidth, _model.canvasHeight);
			_mcBgGray.updateCache(0, 0, _model.canvasWidth, _model.canvasHeight);
		};
		_this.setToleranceHandler = function(val){
			_nTolerance = val;
		}
		_this.setEditingActionHandler = function(){
			_model.canvas.removeAttr("class");
			_drawingCompositeOperation = "";
			
			switch(_model.getEditingActionHandler()){
				case "brush":
					_drawingCompositeOperation = "";
					_model.canvas.addClass("brush");
					break;
				case "erase":
					_drawingCompositeOperation = "destination-out";
					_model.canvas.addClass("erase");
					break;
				case "reset":
					_bmdMask.clearRect(0, 0, _model.canvasWidth, _model.canvasHeight);
					updateCacheHandler();
					break;
				case "magicfill":
					_model.canvas.addClass("magicfill");
					break;
			}
		}
		
		/* ---------------------- PRIVATE HANDLERs ---------------------- */
		function initialHandler(){
			/* ------- attributes ------- */
			_nBrushSize = 20;
			_drawingCompositeOperation = "";
			
			_mcMaskDrawContainer = new createjs.Container();
			_matrix = new createjs.Matrix2D();
			_colorTransform = new createjs.ColorTransform();
			_rect = new createjs.Rectangle(0, 0, _model.canvasWidth, _model.canvasHeight);
			_alphaMaskFilter = new createjs.AlphaMaskFilter();
			
			
			/* ------- UI architecture ------- */
			_mcMain = new createjs.Container();
			
			/* mc bg */
			_bmdBg = new createjs.BitmapData(null, _model.canvasWidth, _model.canvasHeight);
			_bmBg = new createjs.Bitmap(_bmdBg.canvas);
			_mcBg = new createjs.Container();
			_mcBg.addChild(_bmBg);
			
			/* color fill */			
			// bg clone image
			_bmBgGray = _bmBg.clone();
			_bmBgGray.filters = [GrayscaleFilter];
			_bmBgGray.cache(0, 0, _model.canvasWidth, _model.canvasHeight);
			_mcBgGray = new createjs.Container();
			_mcBgGray.addChild(_bmBgGray);
			
			// base coat
			_bmdBaseCoat = new createjs.BitmapData(null, _model.canvasWidth, _model.canvasHeight, 0x0000ff);
			_bmBaseCoat = new createjs.Bitmap(_bmdBaseCoat.canvas);
			_mcBaseCoat = new createjs.Container();
			_mcBaseCoat.addChild(_bmBaseCoat);
			_mcBaseCoat.compositeOperation = "overlay";
			
			/* mc mask */
			_bmdMask = new createjs.BitmapData(null, _model.canvasWidth, _model.canvasHeight);
			_bmMask = new createjs.Bitmap(_bmdMask.canvas);
			_mcMask = new createjs.Container();
			_mcMask.addChild(_bmMask);
			
			/* UI layering */
			_this.addChild(_mcMain);
			_mcMain.addChild(_mcBg);
			_mcMain.addChild(_mcBgGray);
			_mcMain.addChild(_mcBaseCoat);
			
			/* masking action */
			_mcMask.cache(0, 0, _model.canvasWidth, _model.canvasHeight);
			_mcMaskDrawContainer.cache(0, 0, _model.canvasWidth, _model.canvasHeight);
			
			_alphaMaskFilter.mask = _mcMask.cacheCanvas;
			_mcBgGray.filters = [_alphaMaskFilter];
			_mcBaseCoat.filters = [_alphaMaskFilter];
			_mcBgGray.cache(0, 0, _model.canvasWidth, _model.canvasHeight);
			_mcBaseCoat.cache(0, 0, _model.canvasWidth, _model.canvasHeight);
			
			/* event listener */
			_model.stage.addEventListener("stagemousedown", stageMouseDownHandler);
			_model.stage.addEventListener("stagemousemove", globalStageMouseMoveHandler);
		}
		function magicFillActionHandler(E){
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext('2d');
			canvas.width = _model.canvasWidth;
			canvas.height = _model.canvasHeight;
			ctx.drawImage(_bmdBg.canvas, 0, 0);
			var bitmap = ctx.getImageData(0, 0, _model.canvasWidth, _model.canvasHeight);
			
			var tempCanvas = document.createElement("canvas");
			var tempCtx = tempCanvas.getContext('2d');
			tempCanvas.width = _model.canvasWidth;
			tempCanvas.height = _model.canvasHeight;
			var tempBitmap = tempCtx.getImageData(0, 0, _model.canvasWidth, _model.canvasHeight);
			
			floodFill(bitmap, tempBitmap, [ 255, 0, 0, 128 ], _nTolerance, Math.round(E.stageX), Math.round(E.stageY));
			tempCtx.putImageData(tempBitmap, 0, 0);
			
			_bmdMask.draw(tempCanvas, _matrix, _colorTransform, "", _rect, true);
			updateCacheHandler();
		}
		
		/* ---------------------- EVENT HANDLERs ---------------------- */
		function globalStageMouseMoveHandler(E){
		}
		function stageMouseDownHandler(E){
			if(_model.getEditingActionHandler() == "brush" || _model.getEditingActionHandler() == "erase"){
				_model.stage.addEventListener("stagemouseup", stageMouseUpHandler);
				_model.stage.addEventListener("stagemousemove", stageMouseMoveHandler);
				stageMouseMoveHandler(E);
			}else if(_model.getEditingActionHandler() == "magicfill"){
				magicFillActionHandler(E);
			}
		}
		function stageMouseUpHandler(E){
			_model.stage.removeEventListener("stagemouseup", stageMouseUpHandler);
			_model.stage.removeEventListener("stagemousemove", stageMouseMoveHandler);
		}
		function stageMouseMoveHandler(E){
			var g = new createjs.Graphics();
			g.beginFill("#cccccc");
			g.drawCircle(0, 0, _nBrushSize);
			g.endFill();
			var shape = new createjs.Shape(g);
			shape.x = E.stageX + _nBrushSize * 0.5;
			shape.y = E.stageY + _nBrushSize * 0.5;
			
			_mcMaskDrawContainer.addChild(shape);
			_mcMaskDrawContainer.updateCache(0, 0, _model.canvasWidth, _model.canvasHeight);
			_bmdMask.draw(_mcMaskDrawContainer, _matrix, _colorTransform, _drawingCompositeOperation, _rect, true);
			_mcMaskDrawContainer.removeChild(shape);
			
			updateCacheHandler();
		}
		function updateCacheHandler(){
			_mcMask.updateCache(0, 0, _model.canvasWidth, _model.canvasHeight);
			_mcBgGray.updateCache(0, 0, _model.canvasWidth, _model.canvasHeight);
			_mcBaseCoat.updateCache(0, 0, _model.canvasWidth, _model.canvasHeight);
		}
	}
	
	// ---------------------------------- END ----------------------------------
	window.DrawingScreen = DrawingScreen;
}())