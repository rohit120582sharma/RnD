/*custom slider*/
$.fn.slide = function(){
    "use strict";
    //defining variables
    var _this = this;
    var _slides = _this.find('.slide');
    var _length = _slides.length;
    var _prevSlide;
    var _currentSlide=0;
    var _nextSlide=0;
    var _swipeStatus=false;
    var _slideStatus=false;
    var _slideDelay=5;
    
    //resets the positions of the slides
    function setSlides(currentIndex){ 
        _currentSlide=currentIndex;
        _prevSlide = getSlideIndex('right');        
        _nextSlide = getSlideIndex('left');
        
        _slides.removeClass('active');
        _slides.each(function(){
            var slideIndex=$(this).index();
            
            if(slideIndex===_currentSlide){
                $(this).addClass('active');
                
                setValues($(this),0,'%');
            }else if(slideIndex===_prevSlide){
                setValues($(this),100,'%');
            }else{
                setValues($(this),-100,'%');
            }
        });
        
        _this.find('.carousel-indicators li').removeClass('active');
        _this.find('.carousel-indicators li').eq(_currentSlide).addClass('active');
        
        $('.slide *[data-animate]').each(function() {
            var animateClass = $(this).attr('data-animate');
            $(this).removeClass(animateClass).removeClass('animated');
        });
        
        _slideStatus=false;
    }    
    
    //adding events
    if(_length>1){
        _slides.hammer().bind("panstart",panStarts);
        _slides.hammer().bind("panmove", panMoves);
        _slides.hammer().bind("panend", paneEnds);
        _slides.hammer().bind("swipeleft", swipeLeft);
        _slides.hammer().bind("swiperight", swipeRight);
        
        //change the velocity and threshold of swipe to 0
        _slides.data('hammer').get('swipe').set({threshold:0,velocity:0});
    }
    
    //Pan Starts Function
    function panStarts(){
        if(_slideStatus===false){
            resetTransform(_slides.eq(_prevSlide));
            resetTransform(_slides.eq(_nextSlide));
            
            setValues(_slides.eq(_prevSlide),$(window).width(),'px');
            setValues(_slides.eq(_nextSlide),$(window).width()*-1,'px');
        }

        TweenMax.killAll(false, false, true);
    }
    
    //Pan Move Function
    function panMoves(e){
        if(_slideStatus===false){
            var _deltaX=e.gesture.deltaX;
            tweenPan(_deltaX);    
        }

        TweenMax.killAll(false, false, true);
    }
    
    //Pan Ends Function    
    function paneEnds(e){
        var swipeLimit=$(window).width()/5;
        if(_swipeStatus===false && _slideStatus===false){
            if(Math.abs(e.gesture.deltaX)<swipeLimit){
                tweenPan(0);
                _swipeStatus=false;
                TweenLite.delayedCall(_slideDelay,autoTweenSlide);
            }else{       
                if(e.gesture.deltaX<0){
                    swipeLeft();
                }else{
                    swipeRight();
                }
                _swipeStatus=true;

            }
        }
        _swipeStatus=false;
    }    
    
    //Swipe Left Function
    function swipeLeft(){
        TweenMax.killAll(false, false, true);
        if(_slideStatus===false){
            _swipeStatus=true;
            _slideStatus=true;
            
            var gotoSlide = getSlideIndex('left');
            
            tweenSlide('left',gotoSlide);        
        }
    }
    
    //Swipe Right Function
    function swipeRight(){
        TweenMax.killAll(false, false, true);
        if(_slideStatus===false){
            _swipeStatus=true;
            _slideStatus=true;
            
            var gotoSlide = getSlideIndex('right');
            
            tweenSlide('right',gotoSlide);
        }
    }
    
    //click event of dots
    _this.find('.carousel-indicators li').click(function(){
        TweenMax.killAll(false, false, true);
        if(!$(this).hasClass('active') && _slideStatus===false){
            var index=$(this).index();
            
            resetTransform(_slides.eq(index));
                        
            if(index<_currentSlide){
                setValues(_slides.eq(index),$(window).width(),'px');
                tweenSlide('right',index);
            }else{
                setValues(_slides.eq(index),$(window).width()*-1,'px');
                tweenSlide('left',index);
            }
        }
    });
    
    /////*****my functions*****/////
    
    //return the index of slide to be animated as per direction
    function getSlideIndex(dir){
        var slideIndex;
        
        if(dir==="right"){
            if(_currentSlide===0){
                slideIndex=_length-1;
            }else{
                slideIndex=_currentSlide-1;
            }
        }else if(dir==="left"){
            if(_currentSlide===_length-1){
                slideIndex=0;
            }else{
                slideIndex=_currentSlide+1;
            }
        }
        
        return slideIndex;
    }
    
    //sets the value of elements to animated
    function setValues(elem,val,type){
        TweenLite.to(elem,0, {x:String(val*-1)+type, force3D:true});
        TweenLite.to(elem.find('.transitionHolder'),0, {x:String(val)+type, force3D:true});
        
        TweenLite.to(elem.find('.contentHolder'),0, {x:String(val*-1)+type, force3D:true});
        TweenLite.to(elem.find('.contentHolderIns'),0, {x:String(val)+type, force3D:true});
    }
    
    //resets transformation for converting them from % to px
    function resetTransform(elem){
        TweenLite.set(elem, {clearProps:"transform"});
        TweenLite.set(elem.find('.transitionHolder'), {clearProps:"transform"});
        TweenLite.set(elem.find('.contentHolder'), {clearProps:"transform"});
        TweenLite.set(elem.find('.contentHolderIns'), {clearProps:"transform"});
    }
    
    //animates slide on pan
    function tweenPan(_deltaX){
        TweenLite.to(_slides.eq(_prevSlide), .25, {x:-$(window).width()+_deltaX, force3D:true});
        TweenLite.to(_slides.eq(_nextSlide), .25, {x:$(window).width()+_deltaX, force3D:true});
        
        TweenLite.to(_slides.eq(_prevSlide).find('.transitionHolder'), .25, {x:$(window).width()-_deltaX, force3D:true});
        TweenLite.to(_slides.eq(_nextSlide).find('.transitionHolder'), .25, {x:-$(window).width()-_deltaX, force3D:true});
    }
    
    //animates the slider
    function tweenSlide(dir,gotoSlide){
        var LeftVal;
        if(dir==="left"){            
            LeftVal="150";
        }else if(dir==="right"){            
            LeftVal="-200";
        }
        
        TweenLite.to(_slides.eq(gotoSlide), .8, {x:0, force3D:true,ease:Power2.easeInOut});
        TweenLite.to(_slides.eq(gotoSlide).find('.transitionHolder'), .8, {x:0, force3D:true,ease:Power2.easeInOut});
        
        TweenLite.to(_slides.eq(gotoSlide).find('.contentHolder'),1, {delay:.5,x:0, force3D:true,ease:Power2.easeInOut});
        TweenLite.to(_slides.eq(gotoSlide).find('.contentHolderIns'),1, {delay:.5,x:0, force3D:true,ease:Power2.easeInOut});
        
        TweenLite.fromTo(_slides.eq(gotoSlide).find('.contentHolder'), 1, {css: {left:LeftVal}}, {delay:.5,css:{left:"0"},ease:Power2.easeInOut,onComplete:slideComplete,onCompleteParams:[gotoSlide]});

        TweenLite.delayedCall(_slideDelay,autoTweenSlide);
    }
    
    //callback on complete of the slide transition
    function slideComplete(gotoSlide){
        setSlides(gotoSlide,0);
        
        $('.slide.active *[data-animate]').each(function(index, element) {
            var animateClass = $(this).attr('data-animate');
            $(this).addClass(animateClass).addClass('animated');
        });
    }
    
    //initialise
    slideComplete(0);
    
    //transition holder
    if($('#home-slider .slide').length>1){
        $('.slide').each(function(){
            var _this=$(this);
            for(var i=0;i<20;i++){        
                var randomNumber = Math.random();
                var dirClass;
                var left=String(i/20*100) + '%';
                var top;
                var height=25 + Math.random()*75 ;
                var width=1 + Math.ceil(Math.random()*8);
                var opacity=1;
                var colors=_this.attr('data-colors').split(',');            
                var bgColor=colors[Math.floor(Math.random()*colors.length)];
                
                
                if(randomNumber<=.5){
                    dirClass="moveUp";
                    top=String(50 + Math.random()*50) + '%';
                }else{
                    dirClass="moveDown";
                    top=String(50 - Math.random()*50) + '%';
                }
                
                if(Math.random()<=.25){
                    opacity=Math.random()*.25;
                }
                
                TweenLite.delayedCall(Math.random()*5,addLine,['<div class="lineWrapper" style="left:'+left+';top:'+top+';"><div class="line animated infinite '+dirClass+'" style="height:'+height+'px;width:'+width+'px;opacity:'+opacity+';background:'+bgColor+';"></div></div>',_this.find('.transitionHolder')]);
                
                
                //circles
                var heightWidth=(25+Math.floor(Math.random()*75))+'px';
                
                TweenLite.delayedCall(Math.random()*2,addLine,['<div class="ripple '+dirClass+'" style="left:'+left+';top:'+top+';width:+'+heightWidth+';height:+'+heightWidth+';border-color:'+bgColor+';opacity:'+opacity+';"><div class="circle"></div><div class="circle"></div><div class="circle"></div></div>',_this.find('.transitionHolder')]);
            }
        });
    }
    
    function addLine(line,elem){
         elem.append(line);
    }

    //autoSlide
    TweenLite.delayedCall(_slideDelay,autoTweenSlide);
    function autoTweenSlide(){
        var targetSlide = _currentSlide+1;
        if(targetSlide>=_length){
            targetSlide=0;
        }
        _this.find('.carousel-indicators li').eq(targetSlide).trigger('click');
    }
};