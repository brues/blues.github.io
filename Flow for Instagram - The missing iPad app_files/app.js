define(['jquery', /*'smint',*/ 'dd', 'video'], function($) {
	// Cache the Window object
	$window = $(window);
	$('div[data-type="background"]').each(function(){
		var $bgobj = $(this); // assigning the object
		 
		$(window).scroll(function() {
			var yPos = -($window.scrollTop() / $bgobj.data('speed')); 

			// Put together our final background position
			var coords = '50% '+ yPos + 'px';

			// Move the background
			$bgobj.css({ backgroundPosition: coords });
		}); 
	});    
    document.createElement("article");
    document.createElement("section");


	// video for retina
	var retina = window.devicePixelRatio > 1;
	if(retina){
		$('#iPadMainVideo').attr("poster","../../static/img/backgrounds/ipad-poster@2x.jpg");
		videojs("iPadMainVideo", { "poster": "../../static/img/backgrounds/ipad-poster@2x.jpg", "controls": true, "autoplay": false, "preload": "none" });
	}
	else{
		$('#iPadMainVideo').attr("poster","../../static/img/backgrounds/ipad-poster.jpg");
		videojs("iPadMainVideo", { "poster": "../../static/img/backgrounds/ipad-poster.jpg", "controls": true, "autoplay": false, "preload": "none" });
	}


    // smint
    //$('.subMenu').smint();


    // VIDEO SLIDER
    var sliderOptions = {
    	item_width: 0,
    	newMarginL : 0
    };

    $('.videoSliderBox:first').before($('.videoSliderBox:last'));

    sliderOnLoad();
    $(window).bind("resize",function(e){
	    sliderOnLoad();
    });  

    $('.controls').click(function(){
    	// find clicked direction 
		var direction = "left";
    	if ($(this).hasClass('rightArrow')) {
    		direction = "right";
    	}

        var indent = parseInt($('.videoSlider').css('left'), 10);

    	if (direction === "right") {
    		indent = indent - parseInt(sliderOptions.item_width, 10);
	        $('.videoSlider:not(:animated)').animate({'left' : indent},500,function(){    
	            $('.videoSliderBox:last').after($('.videoSliderBox:first')); 
	            $('.videoSlider').css({'left' : sliderOptions.newMarginL});
	        }); 
    	} else {
    		indent = indent + parseInt(sliderOptions.item_width, 10);
	        $('.videoSlider:not(:animated)').animate({'left' : indent},500,function(){            
		        $('.videoSliderBox:first').before($('.videoSliderBox:last')); 
		        $('.videoSlider').css({'left' : sliderOptions.newMarginL});
	        });
    	}

        return false;
    });

	function sliderOnLoad() {

		if($('.videoSliderBox').length){
			var marginValue = $('.videoSliderBox').css('margin-left').replace(/[^-\d\.]/g, '') * 2;
	        sliderOptions.item_width = $('.videoSliderBox').outerWidth() + marginValue; 
	        var y = $('.videoSliderContainer').outerWidth();
	        var z = ((y - (3 * sliderOptions.item_width)) / 2) * (-1);
	        var shadowWidth = (y - (sliderOptions.item_width + marginValue)) / 2;
	        sliderOptions.newMarginL = (sliderOptions.item_width + z) * (-1);
	        $('.videoSlider').css({'left' : sliderOptions.newMarginL});
	        $('.leftScroll').css({'width' : shadowWidth});
	        $('.rightScroll').css({'width' : shadowWidth});
		}


	}
	// END VIDEO SLIDER


    // flash backup for video js
    videojs.options.flash.swf = "static/video/video-js.swf";


	// Show countries
	$.getJSON('http://flowapp.herokuapp.com/api/site/countries', function(e) {
		var currentCountry = e.country_code;

		for (var i = 0; i < e.countries.length; i = i + 1) {
		    var country_code = e.countries[i][0];
   		    var country_name = e.countries[i][1];

			country_name = country_name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			    return letter.toUpperCase();
			});

			if(country_code === currentCountry){var selected = 'selected="selected"';}
			else{var selected = "";}

		    var html = '<option ' + selected + ' value="' + country_code + '" name="countryCode" data-image="static/img/icons/blank.gif" data-imagecss="flag ' + country_code.toLowerCase() + '" data-title="' + country_name + '">' + country_name + '</option>';
			$(".selectLang").append(html);	
		}

		$(".selectLang").msDropdown({roundedBorder:false, visibleRows: 5, openDirection: 'alwaysDown'});
	});


    // .modal-trigger
    /*
	$(".modal-launcher, #modal-background, #modal-close").click(function (){
		$("#mc_embed_signup, #modal-background").toggleClass("active-window");
		return false;
	});
	*/


	//set you current country
	$("select.selectLang").change(function(){
		insertLocalUserAndShops( $(this).val().toUpperCase() );
	});
	insertLocalUserAndShops();

    // play / pause button for polaroid videos
    $.each($('.polaroidFrame'), function(){
    	var vid = $(this).find('.video-js').attr('id');
    	var playNow = false;
	    $(this).click(function(){
	    	if (playNow === true){
	    		playNow = false;
	    		_V_(vid).pause();
	    	}
	    	else{
	    		playNow = true;
		    	_V_(vid).play();
		   	}
	    })
    });
});

function insertLocalUserAndShops(userCountryCode) {
	//JSON DATA DOWNLOAD
	//$.getJSON("http://ip-api.com/json/?callback=", function(geo){
	$.getJSON('http://flowapp.herokuapp.com/api/site/countries', function(geo) {
		var countryCode = (userCountryCode !== undefined) ? userCountryCode : geo.country_code; // geo.countryCode.toUpperCase();

		var html = '<input type="text" name="countryCode" value="' + countryCode + '" class="is-hidden"/>';
		$(".formCountryCode").append(html);

		// TOP 30 SOPS
		$.getJSON('http://flowapp.cdn.filepipes.com/top/' + countryCode + '/shops.json', function(d) {
			// sort shops by 'followed_by' field 
		    d.data.sort(function(a, b){
		        return b.counts.followed_by - a.counts.followed_by;
		    });
			// empty topshops div
			$(".topShop").empty();
		    
		    // loop top 30 shops and insert
		    for (var key in d.data) {
		        // top 30
		        if (key === "20") break;
		        var shop = d.data[key];
		        // console.log(shop.website, shop.profile_picture, shop.username, shop.full_name);
				var html = '<a href="' + shop.website + '" class="shopsImg l-pull-left"><img src="' + shop.profile_picture + '" title="' + shop.username + '" alt="' + shop.full_name + '" /></a>';
			 	$(".topShop").append(html);
		    }
		});
		
		// TOP 5 USERS
		$.getJSON('http://flowapp.cdn.filepipes.com/top/' + countryCode + '/stars.json', function(z) {
			// sort celebs by 'followed_by' field 
		    z.data.sort(function(x, y){
		    	var y_count = (typeof y.counts !== 'undefined') ? y.counts.followed_by : -1;
		    	var x_count = (typeof x.counts !== 'undefined') ? x.counts.followed_by : -1;
		        return y_count - x_count;
		    });

			// empty div
			$("#top5").empty();
			$("#top10").empty();

			var is_firstCol = true;
			var firstCol = [];
			var secondCol = [];

		    // loop top 5 celebs and insert
		    for (var key in z.data) {
		    	var i = (key)*1;
		        // top 5
		        if (i === 10) break;

		        if (i === 5) {
		        	is_firstCol = false;
		        }

		        if (is_firstCol) {
			        firstCol.push(z.data[key]);
		        } else {
			        secondCol.push(z.data[key]);
		        }
		    }

			function renderColumn(column, selector, baseNumber){
				var baseNumber = (baseNumber !== undefined) ? baseNumber : 0;

				for (var key in column) {
					var celebs = column[key];
					var placeNo = baseNumber + ((key*1)+1);
					var html = '<div class="rankingBox"><ul class="list-inline"><li class=""><span class="rankNumber">' + placeNo + '</span></li><li class=""><a href="http://instagram.com/' + celebs.username + '" class="instagramLinks"><img src="' + celebs.profile_picture + '" alt="' + celebs.username + '" class="rankImg" /></a></li><li class="userInfo"><a href="http://instagram.com/' + celebs.username + '" class="instagramLinks"><span class="rankText">' + celebs.username + '</span> <span class="rankDesc">' + celebs.full_name + '</span></a></li></ul></div>';
					$(selector).append(html);
				}
			}
			renderColumn(firstCol, "#top5");
			renderColumn(secondCol, "#top10", 5);
		});
	});	
}