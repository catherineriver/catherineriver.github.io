$(function () {
	
	$('.js-mobile').click(function(){
		$('.js-mobile, .header-mobile').toggleClass('active')
	})
	
	$('.js-select').customSelect();
	
	$('.owl-carousel').owlCarousel({
		margin:0,
		loop:true,
		// autoWidth:true,
		items:1,
		dots: false,
		nav: true,
	})

});