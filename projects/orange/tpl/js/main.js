$(function () {

	$('[data-action="expand"]').click(function(){
		$(this).attr('hidden', true).next('.hidden-text').removeAttr('hidden')
	})

	if ( $(window).width() > 571 ) {
		$('meta[name="viewport"]').get(0).setAttribute("content", "width=1048");
    }

    $('.scheme-nav').delegate('.scheme-nav__link', 'click', function () {
        var $item = $(this).parents('.scheme-nav__item');
        var itemIndex = $item.index();

        $item.addClass('active').siblings().removeClass('active');
        $('.scheme-floors').find('.scheme-floors__item').eq(itemIndex).addClass('active').siblings().removeClass('active');
    });

	new Scheme('.scheme', '.scheme-object');



	$('.js-toggle-menu').click(function(){
		$(this).toggleClass('is-active');
		$('.header-dropdown').toggleClass('is-active');
	})

	$('.js-select').customSelect();

	// carousel
	$('.carousel-wrap__content .owl-carousel').owlCarousel({
		margin:18,
		loop:true,
		autoWidth:true,
		items:4,
		dots: false,
		nav: true,
	})

	$('.mainpage-carousel').owlCarousel({
		margin: 0,
		loop: true,
		items: 1,
		nav: false,
		dots: true,
		center: true,
		autoWidth: true,
		responsive: {

			0: {
				autoWidth: false,
				items: 1,

			},

			1000: {
				autoWidth: true,
				items: 1

			}
		}
	})

	$('#mycalendar2').monthly({
		mode: 'picker',
		target: '#mytarget',
		maxWidth: '280px',
		startHidden: true,
		showTrigger: '#mytarget',
		stylePast: true,
		disablePast: true,
		weekStart: 'Mon'
	});

	$('.js-fancybox').fancybox({
		padding: 14,
		margin: 0,
		nextEffect : 'fade',
		prevEffect : 'fade',

		tpl: {
			next     : '<a class="fancybox-nav fancybox-next" href="javascript:;"><span>Вперед</span></a>',
			prev     : '<a class="fancybox-nav fancybox-prev" href="javascript:;"><span>Назад</span></a>',
			closeBtn : '<a title="Закрыть" class="fancybox-item fancybox-close" href="javascript:;"></a>',
		}
	})

	if($('.js-map').length) {
		ymaps.ready(init);
	};

	function init () {
	    myMap = new ymaps.Map("map", {
	            center: [55.76, 37.64],
	            zoom: 18,
				controls: ['fullscreenControl'],
	        }, {
	            searchControlProvider: 'yandex#search'
	        }),

	    // Создаем геообъект с типом геометрии "Точка".
	        myGeoObject = new ymaps.GeoObject({
	            // Описание геометрии.
	            geometry: {
	                type: "Point",
	                coordinates: [55.8, 37.8]
	            }
	        }, {
	            preset: 'islands#blueStretchyIcon',
	            draggable: true
	        });

	    myMap.geoObjects.add(myGeoObject);
	};


    var updateFeed = function() {
        $('.social-feed-container').socialfeed({
		    vk:{
		        accounts: ['#тцоранж', '#оранж'],    //Array: Specify a list of accounts from which to pull posts
		        limit: 10,                                   //Integer: max number of posts to load
		        source: 'all'                               //String: VK API post filter. Possible values: "Owner","Others","all","suggests"
		    },

            show_media: true,
        });
    };

	updateFeed();

});



// Прототип карты
var Scheme;

Scheme = function (mapSelector, shopSelector) {
	this.$container = $(mapSelector);

	var that = this;

	if(location.hash) {
		shopID = window.location.hash.substring(1);
		floorID = shopID.substring(0, 1);
		$currentPopup = $('[data-popup="'+shopID+'"]');
		$currentShop = this.$container.find('[data-shop="'+shopID+'"]');

		$currentShop.get(0).classList.add('current');

		$('.scheme-nav').find('.scheme-nav__item').eq(floorID - 1).addClass('active').siblings().removeClass('active');
		$('.scheme-floors').find('.scheme-floors__item').eq(floorID - 1).addClass('active').siblings().removeClass('active');

		var pos = $currentShop.get(0).getBBox(),
			position = {};

		position.top = pos.y +  $currentPopup.outerHeight() / 4 - 20;
		position.left = pos.x + $currentPopup.outerWidth() / 4;

		$currentPopup.addClass('active').css(position)
	}

	var handleMouseEnter = function (event) {
		that.showPopup($(event.target).parent('[data-shop]'), event);
	};

	var handleMouseLeave = function (event) {
		that.hidePopup($(event.target).parent('[data-shop]'));
	};

	var handleClick = function (event) {
		var link = that.$container.find('[data-popup="' + this.getAttribute('data-shop') + '"]').get(0).dataset.category;
		window.location = 'category/'+link+''
	};

	this.$container.on('mousemove', shopSelector, handleMouseEnter);
	this.$container.on('mouseleave', shopSelector, handleMouseLeave);
	this.$container.on('click', shopSelector, handleClick);
};

Scheme.prototype.getPopup = function (target) {
	return this.$container.find('[data-popup="' + target.get(0).getAttribute('data-shop') + '"]');
};


Scheme.prototype.showPopup = function (target, event) {
	var bbox = target.get(0).getBBox();
		position = {},
		$popup = this.getPopup(target);

	position.top = event.offsetY;
	position.left = event.offsetX;

	$popup
		.css(position)
		.addClass('active');
};

// Скрытие попапа
Scheme.prototype.hidePopup = function (target) {
	this.getPopup(target).removeClass('active');
};
