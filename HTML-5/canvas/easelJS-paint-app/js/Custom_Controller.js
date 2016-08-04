
/* ---------------------------------------- CONTROLLER CLASS - SINGLATON ---------------------------------------- */
(function(){
	
	// ---------------------------------- LOCAL SCOPE ----------------------------------
	var _this;
	
	
	// ---------------------------------- CLASS - CONSTRUCTOR ----------------------------------
	function Controller(){
		if(_this){
			return _this;
		}
		_this = this;
		
		
		/* ---------------------- PRIVATE PROPERTIES ---------------------- */
		var uploadImageBtn;
		var inputEventObj;
		
		var brushBtn;
		var eraseBtn;
		var resetBtn;
		var magicFillBtn;
		var magicFillToleranceSlider;
		
		var backBtn;
		var saveBtn;
				
		// DEFAULT
		initialHandler();
		
		
		/* ---------------------- PRIVATE HANDLERs ---------------------- */
		function initialHandler(){
			// upload pic tool
			uploadImageBtn = $(".view-upload-image-btn > input");
			uploadImageBtn.bind("change", uploadPicHandler);
			
			// Editing tools
			brushBtn = $("#brush-btn");
			eraseBtn = $("#erase-btn");
			resetBtn = $("#reset-btn");
			magicFillBtn = $("#magic-fill-btn");
			magicFillToleranceSlider = $("#magic-fill-slider");
			
			brushBtn.bind("click", brushClickHandler);
			eraseBtn.bind("click", eraseClickHandler);
			resetBtn.bind("click", resetClickHandler);
			magicFillBtn.bind("click", magicFillClickHandler);
			magicFillToleranceSlider.slider({
				min:15,
				change:function(event, ui){
					_model.setToleranceHandler(ui.value);
				},
				create:function(event, ui){
					_model.setToleranceHandler(15);
				}
			});
			
			// File tools
			saveBtn = $("#save-btn");
			backBtn = $("#back-btn");
			saveBtn.bind("click", saveClickHandler);
			backBtn.bind("click", backClickHandler);
			
			//colorDropBox = $("#color_drop_box");
			//colorDropBox.bind("change", colorDropBoxChangeHandler);
		}
		
		
		/* ---------------------- EVENT HANDLERs ---------------------- */
		function brushClickHandler(){
			resetAllEditingBtnHandler();
			resetToleranceSliderHandler();
			brushBtn.addClass("active");
			_model.setEditingActionHandler("brush");
		}
		function eraseClickHandler(){
			resetAllEditingBtnHandler();
			resetToleranceSliderHandler();
			eraseBtn.addClass("active");
			_model.setEditingActionHandler("erase");
		}
		function resetClickHandler(){
			var strAction = _model.getEditingActionHandler();
			_model.setEditingActionHandler("reset");
			_model.setEditingActionHandler(strAction);
		}
		function magicFillClickHandler(){
			resetAllEditingBtnHandler();
			magicFillBtn.addClass("active");
			_model.setEditingActionHandler("magicfill");
			if(magicFillToleranceSlider.css('display') == "none"){
				magicFillToleranceSlider.show();
			}else{
				magicFillToleranceSlider.hide();
			}
		}
		function uploadPicHandler(E){
			var reader = new FileReader();
			reader.onload = function(event){
				var img = new Image();
				img.onload=function(){
					$(".view-upload-image-btn").hide();
					$(".view-canvas").show();
					
					_model.setEditingActionHandler("reset");
					brushClickHandler();
					_model.setBGHandler(img);
					E.target.value = "";
				}
				img.src = event.target.result;
			}
			reader.readAsDataURL(E.target.files[0]);
		}
		function saveClickHandler(){
			var dt = _model.canvasDom.toDataURL();
			this.href = dt;
		}
		function backClickHandler(){
			$(".view-upload-image-btn").show();
			$(".view-canvas").hide();
			return false;
		}
		function colorDropBoxChangeHandler(){
			//_model.setDrawingColor(colorDropBox.val());
		}
		
		/* ---------------------- EVENT HANDLERs ---------------------- */
		function resetAllEditingBtnHandler(){
			$("ul.view-canvas-editing-tools > li").each(function(index, element) {
                var liTag = $(this);
				liTag.removeClass("active");
            });
		}
		function resetToleranceSliderHandler(){
			magicFillToleranceSlider.hide();
		}
	}
	
	
	// ---------------------------------- END ----------------------------------
	window.Controller = Controller;
}());
