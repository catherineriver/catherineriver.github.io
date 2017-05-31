$(document).ready(function(){
	$(".feature-section .owl-carousel").owlCarousel(
		{
		margin:30,
		loop:false,
		items:3,
		dots:false,
		nav:false,
	    responsive: {
	        0:{
	            items:1,
				dots: true
	        },
	        768:{
	            items:3,
	        	}
	  		}
  		}

	);
	$(".recommends-section .owl-carousel").owlCarousel(
	  {
	  margin:0,
	  loop:true,
	  center: true,
	  items:1,
	  dots:true,
	  nav:false,
	  responsive: {
		  0:{
			  items:1,
			  center:false,
		  },
		  1024:{
			  items:2,
			  center:true,
		  },
		  1900: {
			   items: 3
		  		}
			}
		}
	);
	$(".header-main").click(function() {
		$(this).toggleClass("active");
		$(".offCanvasMenu").toggleClass("open");
	});
});
