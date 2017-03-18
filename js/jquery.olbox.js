/*! Olbox Lightbox Plugin | Myriam Frisano http://halfapx.com | https://github.com/mynimi/jquery-olbox */

(function ( $ ) {

    $.fn.olbox = function( options ) {

        var settings = $.extend({
            iframeRatioWidth : 16, // used for responsive iframe aspectRatio
            iframeRatioHeight:  9, // used for responsive iframe aspectRatio
            includeVisualNavigator: true, // include arrow buttons to navigate
            includeKeyNavigator: true, // include option to navigate with arrow keys
            dataAttribute: 'olbox', // set custom data-attribute (for example if multiple separate lightboxes will be needed)
            debug: false // setting to true will add console.logs after some of the steps
        }, options );

        // initiate empty array to fetch all of the data-attributes
        var toOpen = [];

        // loop through all occurences of selector, grab data attributes and push to array
        if(settings.includeVisualNavigator || settings.includeKeyNavigator){
            this.each(function(){
                var media = $(this).data(settings.dataAttribute);
                toOpen.push(media);
            });
        }

        if(settings.debug === true){
            console.log(toOpen);
        }

        // On Clicking the Selector, fetch media to load and run loadMedia which generates the lightbox or updates it
        this.unbind('click').bind('click', function(){
            var media = $(this).data(settings.dataAttribute);
            loadMedia(media);
        });

        // clicking olbox-open (everywhere behind the image) will remoce the lightbox
        $('body').on('click', '.olbox-open', function() {
            $('.olbox-shadow, .olbox-media, .olbox-open, .olbox-nav, .olbox-loader').remove();
        });

        if(settings.includeVisualNavigator || settings.includeKeyNavigator){
            // when clicking navigators, update media

            $('body').on('click', '.olbox-prev[data-'+settings.dataAttribute+'-prev]', function() {
                var prevMedia = $(this).data(settings.dataAttribute+'-prev');
                loadMedia(prevMedia);
            });

            $('body').on('click', '.olbox-next[data-'+settings.dataAttribute+'-next]', function() {
                var nextMedia = $(this).data(settings.dataAttribute+'-next');
                console.log('next is');
                loadMedia(nextMedia);
            });
        }


        $(document).keyup(function(e) {
            // hitting escape key will remove the lightbox
            if (e.which === 27) {
                $('.olbox-shadow, .olbox-media, .olbox-open, .olbox-nav, .olbox-loader').remove();
            }

            // hitting left and right arrow keys toggles a click on navigators (reload media)
            if(settings.includeKeyNavigator){
                // right
                if (e.which === 39) {
                    $('.olbox-next[data-'+settings.dataAttribute+'-next]').trigger('click');
                }

                // left
                if (e.which === 37) {
                    $('.olbox-prev[data-'+settings.dataAttribute+'-prev]').trigger('click');
                }
            }
        });

        // main Lightbox function
        function loadMedia(media){
            // reset image, iframe and hasWrapper Variables to reevaluate new media.
            var img = null,
                iframe = null,
                hasWrapper = null;

            if(settings.debug === true){
                console.log('media is '+media);
            }

            // get current position of media within previously fetched array
            // get previous and next links and set them within vars.
            if(settings.includeVisualNavigator || settings.includeKeyNavigator){
                var currentIndex = toOpen.indexOf(media),
                    prev = toOpen[currentIndex-1],
                    next = toOpen[currentIndex+1];

                // if there is no previous, assign last element of array
                if(prev === undefined){
                    prev = toOpen[toOpen.length-1];
                }

                // if there is no next, assign first one of array.
                if((currentIndex + 1) == toOpen.length){
                    next = toOpen[0];
                }

                if(settings.debug === true){
                    console.log('prev '+prev);
                    console.log('next '+next);
                }
            }

            // check if media is an image, if no image, iframe will be used.
            if(media.includes('.jpg','.png', '.gif', '.svg')){
                img = true;
                iframe = false;
            } else {
                iframe = true;
                img = false;
            }

            if (iframe) {
                // if iframe is included with tags, full iframe will be embedded, otherwise responsive fixed aspect Ratio will be used.
                // if you embed with the wrapper, responsiveness is not ensured within CSS
                if(media.includes('<iframe')){
                    hasWrapper = true;
                } else{
                    hasWrapper = false;
                }

                if (hasWrapper) {
                    // if there are iframe tags, just include that.
                    $('.olbox-media').remove();
                    $('body').append('<div class="olbox-media iframe"></div>');
                    $('.olbox-media.iframe').append(media);
                } else {
                    // if there are no iframe tags, generate new ones and embed the link
                    // responsive fixed aspect ratio using paddingHack (Aspect Ratio can be set within options)
                    $('.olbox-media').remove();
                    $('body').append('<div class="olbox-media iframe"></div>');
                    $('.olbox-media').append('<div class="olbox-iframe-wrapper"></div>');
                    var iframeWidth = 100;
                    $('.olbox-iframe-wrapper').css({
                        width: '100%',
                        padding: settings.iframeRatioHeight / settings.iframeRatioWidth * iframeWidth + '% 0 0 0'
                    });
                    $('.olbox-iframe-wrapper').append('<iframe src="' + media + '" allowfullscreen></iframe>');
                }
            }

            if (img) {
                // if there is already an image tag, go adjust the src, if there is not, generate new image tag.
                if($('.olbox-img').length){
                     $('.olbox-img').attr('src', media);
                } else {
                     $('body').append('<div class="olbox-media"><img src="' + media + '" class="olbox-img"></div>');
                }
            }

            // append elements if they don't exist already
            // elements: olbox-loader, olbox and closing toggle div
            if (!$('.olbox-loader').length) {
                $('body').append('<div class="olbox-loader">Loading</div>');
            }
            if (!$('.olbox-shadow').length) {
                $('body').append('<div class="olbox-shadow"></div>');
            }
            if (!$('.olbox-open').length) {
                $('body').append('<div class="olbox-open"></div>');
            }

            // Build Previous and Next Links
            if(settings.includeVisualNavigator || settings.includeKeyNavigator){
                if ($('.olbox-prev[data-'+settings.dataAttribute+'-prev]').length) {
                    $('.olbox-prev').data(settings.dataAttribute+'-prev', prev);
                } else {
                    $('olbox-nav').remove();
                    $('body').append(
                        '<div data-'+settings.dataAttribute+'-prev="' + prev + '" class="olbox-nav olbox-prev"' +
                        (settings.includeVisualNavigator === false ? 'style="display: none;"': '' ) +
                        '>prev</div>'
                    );
                }

                if ($('.olbox-next[data-'+settings.dataAttribute+'-next]').length) {
                    $('.olbox-next').data(settings.dataAttribute+'-next', next);
                } else {
                    $('olbox-nav').remove();
                    $('body').append(
                        '<div data-'+settings.dataAttribute+'-next="' + next + '" class="olbox-nav olbox-next"'+
                        (settings.includeVisualNavigator === false ? 'style="display: none;"': '' ) +
                        '>next</div>'
                    );
                }
            }
        }

        return this;
    };

}( jQuery ));
