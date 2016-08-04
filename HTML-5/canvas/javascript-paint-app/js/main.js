$(document).ready(function(e) {
    
    /*Window Load starts*/
    $(window).load(function() {
		
        $('.mainOuterMostWrapper').show();    
        $('.preloader.loading').remove();
        
        //scroll to current section
        if($(".scrollToElement").length){
            $('html, body').animate({
                scrollTop: $(".scrollToElement").offset().top
            },500);
        }
        
        //hamburger
        $('#hamburgerBtn a').click(function(e) {
            e.preventDefault();
            $('body').toggleClass('menuOpen');
        });
        
        $('#primarySmallMenu>li>a').click(function(e) {
            e.preventDefault();
            $(this).parent('li').toggleClass('open');
        });
        
        //==========About Us Slider==========//
        $('#sliderShow').click(function(e) {
            e.preventDefault();
			$('#home-slider').hide();
			$('#aboutUsCarousel').closest('.aboutus-slider').css('display','table');
			initAboutSlider();
        });
        
        function initAboutSlider(){
            $('#aboutUsCarousel').slick({
				arrows:true,
				dots:false,
				infinite:false,
				speed:500,
				slidesToShow:1,
				slidesToScroll:1,
				nextArrow: '<span class="icon-chevron-thin-right next"></span>',
				prevArrow: '<span class="icon-chevron-thin-left prev"></span>'
			});
        }
		
        $('#aboutUsCarousel').on('beforeChange', function(event, slick, currentSlide, nextSlide){
            activeAboutSlide(nextSlide);
            
            $('#aboutUsCarousel .slick-active .caption').addClass('hidden');
            $('#aboutUsCarousel .slick-active .history-box-wrapper').addClass('hidden');
        });
        
        
         $('#aboutUsCarousel').on('afterChange', function(){
            $('#aboutUsCarousel .slick-active .caption').removeClass('hidden');
            $('#aboutUsCarousel .slick-active .history-box-wrapper').removeClass('hidden');
        });
        
		$('#slider-navigation li a').click(function(e) {
            e.preventDefault();
            var index=$(this).parent().index();           
            
            activeAboutSlide(index);
            $('#aboutUsCarousel').slick('slickGoTo',index);
		});
        
        function activeAboutSlide(index){
            $('#slider-navigation li').removeClass('active');
            $('#slider-navigation li').eq(index).addClass('active');
        }
		
		$("input[name='propertyList']").change(function(){
            if($('#colorTherapySlider').parent('.stepWrapper').find('.arrowBtns .nextBtn').attr('gotoSlide')==='' && !$('#colorTherapySlider').parent('.stepWrapper').find('.alertText').hasClass('hide')){
                $('#colorTherapySlider').parent('.stepWrapper').find('.alertText').addClass('hide');
                $('#colorTherapySlider')[0].slick.refresh();
            }
            
            var index = $(this).closest('.radio').index();
            $('#colorTherapySlider').parent('.stepWrapper').find('.arrowBtns .nextBtn').attr('gotoSlide',index+1);
		});
        
        /* Color therapy Step Navigation */
        $('#colorTherapySlider').parent('.stepWrapper').find('.arrowBtns .prevBtn').click(function(e) {
            e.preventDefault();
            
            var index = $(this).attr('gotoSlide');
            $('#colorTherapySlider').slick('slickGoTo', index);
            
            $('#colorTherapySlider').parent('.stepWrapper').find('.arrowBtns .prevBtn').hide();
            $('#colorTherapySlider').parent('.stepWrapper').find('.arrowBtns .submitBtn').hide();
            $('#colorTherapySlider').parent('.stepWrapper').find('.arrowBtns .nextBtn').css('display','inline-block');
			$("#colorTherapySlider input[name='propertyList']").removeAttr('checked');
        });
        
        $('#colorTherapySlider').parent('.stepWrapper').find('.arrowBtns .nextBtn').click(function(e) {
            e.preventDefault();
            
            var index = $(this).attr('gotoSlide');
            
            if(index!==''){
                $('#colorTherapySlider').slick('slickGoTo', index);
                $('#colorTherapySlider').parent('.stepWrapper').find('.arrowBtns .prevBtn').css('display','inline-block');
                $('#colorTherapySlider').parent('.stepWrapper').find('.arrowBtns .submitBtn').css('display','inline-block');
                $('#colorTherapySlider').parent('.stepWrapper').find('.arrowBtns .nextBtn').hide();
            }else{
                $('#colorTherapySlider').parent('.stepWrapper').find('.alertText').removeClass('hide');
                $('#colorTherapySlider')[0].slick.refresh();
            }
        });
        
        $('#projectSwitchControl input[type="radio"]').change(function() {
            if($(this).val()==='indoor'){
                $('#projectSwitch').show();
            }else{
                $('#projectSwitch').hide();
            }
            $('#colorTherapySlider')[0].slick.refresh();
        });
        
        $('.list-like-color li a').click(function(e){
            e.preventDefault();
            var container = $(this).closest('.stepContainer');
            
            if(!$(this).parent('li').hasClass('active')){
                container.find('.list-like-color li.active').removeClass('active');
                $(this).parent('li').addClass('active');
                
                var index = container.find('.list-like-color li.active').index();
                container.find('.list-like-color-selected .form-group').addClass('hide');
                container.find('.list-like-color-selected .form-group').eq(index).removeClass('hide');
            }
        });
        
		//Isipiration toggle - temp
		$('#colorTherapySlider .submitBtn').click(function(){
			$('.sectionWrapper.inspirationSection').removeClass('hidden');
			$('html, body').animate({
			 scrollTop: $(".inspirationSection").first().offset().top - 100
			}, 500);
		});
		$('#colorTherapySlider .prevBtn').click(function(){
			$('.sectionWrapper.inspirationSection').addClass('hidden');
		});
		
		$("#colorPickerSlider input[name='propertyType']").click(function(){
             var slideGo = $(this).val();
			 $('#colorPickerSlider').slick('slickGoTo', slideGo);
			 $('#colorPickerSlider').parent('.stepWrapper').find('.arrowBtns .prevBtn').css('display','inline-block');
		});
		
		$('#colorPickerSlider').parent('.stepWrapper').find('.arrowBtns .prevBtn').click(function(e) {
            e.preventDefault();
			$('#colorPickerSlider').slick('slickGoTo', '0');
			$("#colorPickerSlider input[name='propertyType']").removeAttr('checked');
        });
        
        /*Color Calculator Step Navigation*/
        $('#colorCalculator').parent('.stepWrapper').find('.arrowBtns .prevBtn').click(function(e) {
            e.preventDefault();
            
            var slickCurrentSlide = $('#colorCalculator').slick('slickCurrentSlide');
            if(slickCurrentSlide===7){
                $('#colorCalculator').slick('slickGoTo', currentRoomStep+1);
            }else{
                $('#colorCalculator').slick('slickGoTo', slickCurrentSlide-1);
            }
            
            $('#colorCalculator').parent('.stepWrapper').find('.arrowBtns .submitBtn').hide();
            $('#colorCalculator').parent('.stepWrapper').find('.arrowBtns .nextBtn').css('display','inline-block');
                
            if(slickCurrentSlide-1===0){
                $('#colorCalculator').parent('.stepWrapper').find('.arrowBtns .prevBtn').hide();
            }
        });
        
        $('#colorCalculator').parent('.stepWrapper').find('.arrowBtns .nextBtn').click(function(e) {
            e.preventDefault();
            
            var currenSlideElem = $('#colorCalculator').find('.slick-current.slick-active');
            var formElem = currenSlideElem.find('form');
            
            if(formElem.valid()){
                var slickCurrentSlide = $('#colorCalculator').slick('slickCurrentSlide');
                if(slickCurrentSlide<(currentRoomStep+1)){
                    $('#colorCalculator').slick('slickGoTo', slickCurrentSlide+1);
                }else{
                    $('#colorCalculator').slick('slickGoTo',7);
                    $('#colorCalculator').parent('.stepWrapper').find('.arrowBtns .submitBtn').css('display','inline-block');
                    $('#colorCalculator').parent('.stepWrapper').find('.arrowBtns .nextBtn').hide();
                }
                
                if(slickCurrentSlide+1>=1){
                    $('#colorCalculator').parent('.stepWrapper').find('.arrowBtns .prevBtn').css('display','inline-block');
                }
            }else{
                //$('#colorCalculator')[0].slick.refresh();
            }
        });
        
        $('#colorCalculator').parent('.stepWrapper').find('.arrowBtns .submitBtn').click(function(e) {
            e.preventDefault();
            
            var currenSlideElem = $('#colorCalculator').find('.slick-current.slick-active');
            var formElem = currenSlideElem.find('form');
            if(formElem.valid()){
                //http request
            }
        });
        
        /*UPLOAD PICTURE*/
		$(':file').change(function(){
			$('.profileModal .inside').hide();
			$(this).closest('.profileModal').addClass('fileUpload');
		});
        
        //productList used
        $(".productListButton").click(function(e){
            e.preventDefault();
            $(this).closest('.inspirationSection').toggleClass('productOpen');
                         
            $('html, body').animate({
                scrollTop: $(this).closest('.inspirationSection').offset().top - $('.mainHeaderContainer').height()
            }, 500);
        });
        
        $(".productWrapper .close").click(function(){
            $(this).closest('.inspirationSection').removeClass('productOpen');
        });
        
        //scroll btn
        $('.arrowDown').click(function(e) {
            e.preventDefault();
            $('html,body').animate({scrollTop:$(window).height() - $('.mainHeaderWrapper').height() - $('.floatingfooter').height() });
        });
        
        //viewport
        $(window).scroll(function(){
            viewportJs();
            scrollCheck();
        });
        
        function viewportJs(){
            //custom viewport
            $('.custom-viewport').each(function(){
                var elemOffset=0;            
                if($(this).attr('elem-offset-prcnt')!==undefined){
                    elemOffset=(parseInt($(this).attr('elem-offset-prcnt'))/100)*$(window).height() * -1;
                }
                
                var elemDelay=0;            
                if($(this).attr('anim-delay')!==undefined){
                    elemDelay=$(this).attr('anim-delay');
                }
                
                var elemClass = 'this';
                if($(this).attr('elem-class')!==undefined){
                    elemClass=$(this).attr('elem-class');
                }
                
                var animClass = $(this).attr('anim-class');
                
                if(verge.inViewport($(this),elemOffset)){
                    if(elemClass==="this"){
                        TweenLite.delayedCall(elemDelay,addClass,[$(this),animClass]);
                    }else{
                        TweenLite.delayedCall(elemDelay,addClass,[$(this).find(elemClass),animClass]);
                    }
                }
                
                var repeat='false';
                if($(this).attr('repeat')!==undefined){
                    repeat=$(this).attr('repeat');
                }
                
                if(!verge.inViewport($(this),0) && repeat==='true'){
                    if(elemClass==="this"){
                        $(this).removeClass(animClass);
                        $(this).css('visibility','hidden');
                    }else{
                        $(this).find(elemClass).removeClass(animClass);
                        $(this).find(elemClass).css('visibility','hidden');
                    }
                }
            });
            
        }
        
        function initViewport(){
            $('.custom-viewport').each(function(){
                var elemClass = 'this';
                if($(this).attr('elem-class')!==undefined){
                    elemClass=$(this).attr('elem-class');
                }
                
                if(!verge.inViewport($(this),0)){
                    if(elemClass==="this"){
                        $(this).css('visibility','hidden');
                    }else{
                        $(this).find(elemClass).css('visibility','hidden');
                    }
                }
            });
        }
        
        function addClass(elem,animClass){
            elem.css('visibility','visible');
            elem.addClass(animClass);
        }
        
        //color therapy
        $(".askExpertBtn").click(function(e){
            e.preventDefault();
            $(".colorTherapy").toggleClass('expertForm');
        });
        $(".askExpertPopup .close").click(function(){
           $(".colorTherapy").removeClass('expertForm');
        });
        
        /*TimeLine Select*/
        var currentRoomStep=0;
        
        $('.timelineSelect li a').click(function(e) {
            e.preventDefault();
            $(this).closest('.timelineSelect').find('li').removeClass('active');
            
            var index = $(this).parent('li').index();
            for(var i=0;i<index+1;i++){
                $(this).closest('.timelineSelect').find('li').eq(i).addClass('active');
            }
        });
        
        /*Room Last Step Index*/
        $('#roomStepsTimeline li a').click(function(e) {
            e.preventDefault();
            
            currentRoomStep=$(this).parent('li').index();
            $(this).closest('.sliderWrapper').find('.lastSlide h3.stepTitle').html('Step ' + parseInt(currentRoomStep+3));
        });        
        
        /* play Video */
		$("#playVideo").click(function(){
			$(".video-wrapper").show();
		});
        
        /*tab switch callback*/
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {            
            initLazy();
        });
        
        /*color Pallete Switcher*/
        $('#colorPalleteSwitcher .primaryColorWrapper a.color').click(function(e) {
            e.preventDefault();
            var index = $(this).parent().index();
            
            if(!$(this).parent('.colorHolder').hasClass('active')){
                $('#colorPalleteSwitcher .primaryColorWrapper .colorHolder.active').removeClass('active');
                $('#colorPalleteSwitcher .primaryColorWrapper .colorHolder').eq(index).addClass('active');
                
                $('#colorPalleteSwitcher .subColorWrapper .subColorContainer.active').removeClass('active');
                $('#colorPalleteSwitcher .subColorWrapper .subColorContainer').eq(index).addClass('active');
            }
            
            $('#colorPalleteSwitcher .subColorWrapper a.color').removeClass('active');
            currentColorElem = $('#subColorScroll .subColorContainer').eq(index).find('.colorHolder').eq(0).find('.color');
            selectedColor=currentColorElem.attr('color');
            currentColorElem.addClass('active');
            
            $('#paintBtn').css('color',selectedColor);
        });
        
        /*Switch Tab on select change*/
        $('.switchTab').change(function(e) {
            var trgtIndex = $(this).find('option:selected').index();
            var trgtTab = $(this).attr('trgt-tab');
            var trgtId = $('#'+trgtTab).find('li').eq(trgtIndex).find('a').attr('href');
            $('#'+trgtTab+' a[href="'+trgtId+'"]').tab('show');
        });
		
        initViewport();
        viewportJs();
        
        function scrollCheck(){
            if($(window).scrollTop()>100){
                $('body').addClass('scroll');
            }else{
                $('body').removeClass('scroll');
            }
        }
		/*LOCATION*/
		
        function getLocation() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition, showError);
			} else { 
				console.log("Geolocation is not supported by this browser.");
			}
		}
		
		function showPosition(position) {
		console.log("Latitude: " + position.coords.latitude + 
			"Longitude: " + position.coords.longitude);
		}
		
		function showError(error) {
			switch(error.code) {
				case error.PERMISSION_DENIED:
				   console.log("User denied the request for Geolocation.");
					break;
				case error.POSITION_UNAVAILABLE:
					console.log("Location information is unavailable.");
					break;
				case error.TIMEOUT:
					console.log("The request to get user location timed out.");
					break;
				case error.UNKNOWN_ERROR:
					console.log("An unknown error occurred.");
					break;
			}
		}
		$('#nearme').on('click', function() {
			getLocation();
		});
		/*LOCATION*/
		
		/*** PROGRESS SLIDER****/
        if($(".SliderProgress").length){        
            $(".SliderProgress").slider({
                ticks: [0, 10, 20, 30, 40 , 50],
                ticks_labels: ["0", "10'", "20'", "30'", "40'", "50'"],
                ticks_snap_bounds: 30,
                tooltip_position:'bottom'
            });
        }
    });
    /*Window Load Ends*/

});

