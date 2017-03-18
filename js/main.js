 /* global $:false, document:false, window:false, setInterval: false */
 $(document).ready(function() {
     'use strict';
     $('.video-lightbox').olbox({
         dataAttribute: 'olbox-b'
     });
     $('.image-lightbox').olbox({
         dataAttribute: 'olbox-a'
     });
 });
