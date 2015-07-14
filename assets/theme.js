$(document).ready(function() {  

  $.shifter({
    maxWidth: "740px"
  });  

  // Call Fancybox globally on all elements with class fancybox
  $(".fancybox").fancybox({
    helpers: {
      overlay: {
        locked: false
      }
    }
  }); 

  $('.flexslider').flexslider({
    animation: "fade",
    controlNav: true,
    slideshowSpeed: 5000,
    directionNav: true
  });

  $('.coll-filter').customSelect();

  

  //<![CDATA[
  jQuery(function() {
    jQuery('#sidebar ul li a').each(function() {
      if (jQuery(this).attr('href')  ===  window.location.pathname) {
        jQuery(this).addClass('current');
      }
    });
  });  
  //]]>


}); 

   
