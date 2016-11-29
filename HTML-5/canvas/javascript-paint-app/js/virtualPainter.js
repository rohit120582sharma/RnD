$(function() {

  /* ****************************************************************** */
  /* ********************** Variables ********************** */
  /* ****************************************************************** */
  var colorThreshold = 20,
      blurRadius = 10,
      simplifyTolerant = 1,
      simplifyCount = 0,
      hatchLength = 4,
      hatchOffset = 0,
      imageInfo = null,
      cacheInd = null,
      cacheInds = [],
      downPoint = null,
      mask = null,
      masks = [],
      allowDraw = false,
      isMouseMoving = false,
      cirRadius = 10,
      currentThreshold = colorThreshold,
      toolType = "",
      paintCanvas,
      imgCanvas,
      grayImgCanvas,
      drawingCanvas,
      selectionCanvas,
      historyArr,
      historyEndIndex;



  /* ****************************************************************** */
  /* ********************** Controllers ********************** */
  /* ****************************************************************** */
  window.snapSelectedImage = snapSelectedImage;
  window.snapWebCamVideo = snapWebCamVideo;
  // ------------------ Draw Image Handler ------------------
  function snapSelectedImage(src){
    var img = new Image();
    img.onload=function(){
      initiatePaintApp(img, img.width, img.height);
    }
    //src = "http://stackoverflow.com/questions/22097747/getimagedata-error-the-canvas-has-been-tainted-by-cross-origin-data";
    //img.crossOrigin = "Anonymous";
    img.src = src;
  }
  // ------------------ Draw video hanlder ------------------
  function snapWebCamVideo(video){
    initiatePaintApp(video, video.videoWidth, video.videoHeight);
  }
  // ------------------ Initiate and drawing canvas handler ------------------
  function initiatePaintApp(src, srcWidth, srcHeight){
    resetCache();

    paintCanvas = $('#paintCanvas')[0];
    imgCanvas = document.createElement('canvas');
    grayImgCanvas = document.createElement('canvas');
    drawingCanvas = document.createElement('canvas');
    selectionCanvas = document.createElement('canvas');

    imageInfo = {
      width: srcWidth,
      height: srcHeight,
      context: selectionCanvas.getContext("2d")
    };
    imgCanvas.width = imageInfo.width;
    imgCanvas.height = imageInfo.height;
    grayImgCanvas.width = imageInfo.width;
    grayImgCanvas.height = imageInfo.height;
    paintCanvas.width = imageInfo.width;
    paintCanvas.height = imageInfo.height;
    drawingCanvas.width = imageInfo.width;
    drawingCanvas.height = imageInfo.height;
    selectionCanvas.width = imageInfo.width;
    selectionCanvas.height = imageInfo.height;

    imgCanvas.getContext("2d").drawImage(src, 0, 0);
    grayImgCanvas.getContext("2d").drawImage(src, 0, 0);

    var tempCanvas = document.createElement('canvas')
    var tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = imageInfo.width;
    tempCanvas.height = imageInfo.height;
    tempCtx.drawImage(imgCanvas, 0, 0);
    imageInfo.data = tempCtx.getImageData(0, 0, imageInfo.width, imageInfo.height).data;

    $("#magic-btn").trigger("click");
    grayCanvas(grayImgCanvas);
    resetHistory();
    drawPaint();
    eraseAction();
  }



  /* --------------------------------------------------- */
  /* --------------- Button Handlers --------------- */
  /* --------------------------------------------------- */
  // canvas mouse-click handler
  $('#paintCanvas').on('click', function(e){
    var p = $(e.target).offset(),
        x = Math.round(e.pageX - p.left),
        y = Math.round(e.pageY - p.top);

    downPoint = { x: x, y:y };
    if(toolType == "magic"){
      magic();
      trace();
    }
  });

  // tools handlers
  /* blur */
  $('#blur').on('change keyup', function () {
    blurRadius = Number($(this).val()) || 0;
    magic();
  });
  /* threshold */
  $('#threshold').on('change keyup', function () {
    currentThreshold = Number($(this).val()) || 0;
    magic();
  });
  /* magic tool */
  $("#magic-btn").bind("click", function(){
    toolType = "magic";
    resetBtnStatus();
    $(this).addClass("active");
    return false;
  });
  /* erase tool */
  $("#erase-btn").bind("click", function(){
    toolType = "erase";
    resetBtnStatus();
    $(this).addClass("active");
    return false;
  });
  /* undo & redo tool */
  $("#undo-btn").bind("click", function(){
    undoHistory();
    return false;
  });
  $("#redo-btn").bind("click", function(){
    redoHistory()
    return false;
  });
  /* reset tool */
  $("#reset-btn").bind("click", function(){
    var ctx = imageInfo.context;
    ctx.clearRect(0, 0, imageInfo.width, imageInfo.height);
    resetCache();
    resetHistory();
    drawPaint();

    $("#magic-btn").trigger("click");
    return false;
  });

  // ------------------ erase action ------------------
  function eraseAction(){
    paintCanvas.onmousedown = function(e){
      if(toolType == "erase"){
        allowDraw = true;
      }
    }
    paintCanvas.onmouseup = function(e){
      allowDraw = false;
      if(toolType == "erase" && isMouseMoving){
        addHistory();
      }
      isMouseMoving = false;
    }
    paintCanvas.onmousemove = function(e){
      if(!allowDraw){
        return;
      }
      var rect = paintCanvas.getBoundingClientRect();
      var xmouse = e.clientX - rect.left;
      var ymouse = e.clientY - rect.top;
      var ctxDraw = drawingCanvas.getContext("2d");
      ctxDraw.save();
      ctxDraw.clearRect(0, 0, imageInfo.width, imageInfo.height);
      ctxDraw.fillStyle = "purple";
      ctxDraw.beginPath();
      ctxDraw.arc(xmouse, ymouse, cirRadius, 0, 2 * Math.PI); // x, y, radius, 0, 2 * Math.PI, false
      ctxDraw.fill();
      ctxDraw.restore();

      var ctx = imageInfo.context;
      ctx.save();
      ctx.globalCompositeOperation ="destination-out";
      ctx.drawImage(drawingCanvas, 0, 0);
      ctx.restore();

      isMouseMoving = true;
      drawPaint();
    }
  }



  /* ****************************************************************** */
  /* ********************** Functions ********************** */
  /* ****************************************************************** */

  // ************************ Utility Functions ************************
  // ------------------ clone canvas ------------------
  function cloneCanvas(oldCanvas) {
    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
  }

  // ------------------ gray canvas ------------------
  function grayCanvas(canvas) {
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, imageInfo.width, imageInfo.height);
    var data = imageData.data;

    for(var i = 0; i < data.length; i += 4) {
      var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      // red
      data[i] = brightness;
      // green
      data[i + 1] = brightness;
      // blue
      data[i + 2] = brightness;
    }

    // overwrite original image
    ctx.putImageData(imageData, 0, 0);
  }

  // ************************ Magic Fill ************************
  // ------------------ magic-selection ------------------
  var magic = function () {    
    if (imageInfo) {
      var image = {
        data: imageInfo.data,
        width: imageInfo.width,
        height: imageInfo.height,
        bytes: 4
      };
      mask = MagicWand.floodFill(image, downPoint.x, downPoint.y, currentThreshold);
      mask = MagicWand.gaussBlurOnlyBorder(mask, blurRadius);
      masks.push(mask);
      cacheInds.push(MagicWand.getBorderIndices(mask));
      //drawBorder(true);
    }
  };

  // ------------------ draw border ------------------
  var drawBorder = function () {
    if (masks.length) {

      var x, y, k, i, j, m,
          w = imageInfo.width,
          h = imageInfo.height,
          ctx = imageInfo.context,
          imgData = ctx.createImageData(w, h),
          res = imgData.data;
      ctx.clearRect(0, 0, w, h);
      
      for (m = 0; m < masks.length; m++) {
        
        cacheInd = cacheInds[m];
        
        for (j = 0; j < cacheInd.length; j++) {
          i = cacheInd[j];
          x = i % w; // calc x by index
          y = (i - x) / w; // calc y by index
          k = (y * w + x) * 4; 
          if ((x + y + hatchOffset) % (hatchLength * 2) < hatchLength) { 
            // detect hatch color 
            res[k + 3] = 255; // black, change only alpha
          } else {
            res[k] = 255; // white
            res[k + 1] = 255;
            res[k + 2] = 255;
            res[k + 3] = 255;
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
  };
  setInterval(function () {
    hatchOffset = (hatchOffset + 1) % (hatchLength * 2);
    //drawBorder();
  }, 100);

  // ------------------ draw & fill magic-selection ------------------
  function trace(){
    var ctx = imageInfo.context;
    //ctx.clearRect(0, 0, imageInfo.width, imageInfo.height);
    for (var m = 0; m < masks.length; m++) {
      // draw contours
      var i, j, ps, cs = MagicWand.traceContours(masks[m]);
      cs = MagicWand.simplifyContours(cs, simplifyTolerant, simplifyCount);

      //inner
      ctx.beginPath();
      for (i = 0; i < cs.length; i++) {
        if (cs[i].inner) {
          ps = cs[i].points;
          ctx.moveTo(ps[0].x, ps[0].y);
          for (j = 1; j < ps.length; j++) {
            ctx.lineTo(ps[j].x, ps[j].y);
          }
        }
      }      
      ctx.fillStyle = selectedColor;
      ctx.fill();

      //outer
      ctx.beginPath();
      for (i = 0; i < cs.length; i++) {
        if (!cs[i].inner) {
          ps = cs[i].points;
          ctx.moveTo(ps[0].x, ps[0].y);
          for (j = 1; j < ps.length; j++) {
            ctx.lineTo(ps[j].x, ps[j].y);
          }
        }
      }
      ctx.fillStyle = selectedColor;
      ctx.fill();
    }

    resetCache();
    drawPaint();
    addHistory();
  };

  // ************************ History ************************
  function addHistory(){
    var startIndex = historyEndIndex + 1;
    var endIndex = historyArr.length - 1;
    var copyCanvas = cloneCanvas(selectionCanvas);

    endIndex = (endIndex <= 0) ? 0 : endIndex;

    historyArr.splice(startIndex, endIndex);
    historyArr.push(copyCanvas);
    historyEndIndex = historyArr.length - 1;
  }
  function resetHistory(){
    var copyCanvas = cloneCanvas(selectionCanvas);
    historyArr = [];
    historyArr.push(copyCanvas);
    historyEndIndex = 0;
  }
  function undoHistory(){
    historyEndIndex--;
    historyEndIndex = (historyEndIndex <= 0) ? 0 : historyEndIndex;

    var copyCanvas = historyArr[historyEndIndex];
    var context = copyCanvas.getContext("2d");
    var imageData = context.getImageData(0, 0, imageInfo.width, imageInfo.height);
    var ctx = imageInfo.context;
    ctx.save();
    ctx.clearRect(0, 0, imageInfo.width, imageInfo.height);
    ctx.putImageData(imageData, 0, 0);
    ctx.restore();
    drawPaint();
  }
  function redoHistory(){
    var length = historyArr.length - 1;
    historyEndIndex++;
    historyEndIndex = (historyEndIndex >= length) ? length : historyEndIndex;
    
    var copyCanvas = historyArr[historyEndIndex];
    var context = copyCanvas.getContext("2d");
    var imageData = context.getImageData(0, 0, imageInfo.width, imageInfo.height);
    var ctx = imageInfo.context;
    ctx.save();
    ctx.clearRect(0, 0, imageInfo.width, imageInfo.height);
    ctx.putImageData(imageData, 0, 0);
    ctx.restore();
    drawPaint();
  }

  // ************************ Reset ************************
  function resetCache(){
    mask = null;
    masks = [];
    cacheInds = [];
  }
  function resetBtnStatus(){
    $("#magic-btn").removeClass("active");
    $("#erase-btn").removeClass("active");
  }

  // ************************ draw & blend image + painted area ************************
  function drawPaint(){
    var ctx = paintCanvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, imageInfo.width, imageInfo.height);
    ctx.drawImage(imgCanvas, 0, 0, imageInfo.width, imageInfo.height);

    var blendCanvas = document.createElement("canvas");
    var ctxBlend = blendCanvas.getContext("2d");
    blendCanvas.width = imageInfo.width;
    blendCanvas.height = imageInfo.height;
    ctxBlend.save();
    ctxBlend.clearRect(0, 0, imageInfo.width, imageInfo.height);
    ctxBlend.drawImage(grayImgCanvas, 0, 0, imageInfo.width, imageInfo.height);
    ctxBlend.globalCompositeOperation = "overlay";
    ctxBlend.drawImage(selectionCanvas, 0, 0, imageInfo.width, imageInfo.height);
    ctxBlend.restore();

    var clippedCanvas = document.createElement("canvas");
    var ctxClipped = clippedCanvas.getContext("2d");
    clippedCanvas.width = imageInfo.width;
    clippedCanvas.height = imageInfo.height;
    ctxClipped.save();
    ctxClipped.clearRect(0, 0, imageInfo.width, imageInfo.height);
    ctxClipped.drawImage(selectionCanvas, 0, 0, imageInfo.width, imageInfo.height);
    ctxClipped.globalCompositeOperation = 'source-in';
    ctxClipped.drawImage(blendCanvas, 0, 0, imageInfo.width, imageInfo.height);
    ctxClipped.restore();

    ctx.drawImage(clippedCanvas, 0, 0, imageInfo.width, imageInfo.height);
    ctx.restore();
  }






  // ------------------ choose shade action ------------------
  /*$('.color-palette span').click(function(){
    var background=$(this).css("background-color");
    background = hexc(background);
    selectedColor = background;
  });*/
  window.selectedColor;
  function hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
      parts[i] = parseInt(parts[i]).toString(16);
      if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    return '#' + parts.join('');
  }
  
});