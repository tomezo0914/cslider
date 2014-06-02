(function($) {
  var VERSION = '0.0.1';
  var DEFAULT_INTERVAL_SEC = 5000;
  var DEFAULT_TRANSITION_SEC = 2000;
  var DEFAULT_SLIDE_IMG_SELECTOR = '#cslider img';
  var DEFAULT_SLIDE_CAPTION_SELECTOR = '#cslider .cslider-caption';
  var DEFAULT_CSS_POSITION_ATTR = 'data-css-position';
  var DEFAULT_CSS_POSITION_UPDATE = 'original';
  var DEFAULT_SLIDE_DISPLAY_HEIGHT = -1;
  var DEFAULT_NAV_CLASS = 'cslider-nav';
  var DEFAULT_NAV_SELECTED_CLASS = 'active';

  // public variable ----
  var opts = null;

  var currentIndex = 0;
  var nextIndex = 0;

  var imageArray = null;
  var imageSize = null;
  var captionArray = null;
  var captionSize = null;

  var timerId;

  // public method ----

  /**
   * Return the version.
   * @return {string}
   */
  $.fn.version = function() {
    return VERSION;
  };

  /**
   * Initialize slide settings.
   * @param {hash}
   */
  $.fn.cslider = function(options) {
    // set options parameters.
    opts = $.extend({}, $.fn.cslider.defaults, options);

    // initialize...
    imageArray = $(opts.slideImgSelector);
    imageSize = imageArray.length;

    if (opts.visibleCaption === true) {
      captionArray = $(opts.slideCaptionSelector);
      captionSize = captionArray.length;
      if (imageSize != captionSize) {
        throw 'Do not match the number of img and captions.';
      }
    }

    for (var i = 0; i < imageSize; i++) {
      var _opacity = '0';
      if (i == 0) {
        _opacity = '1';
      }

      var elmImg = $(imageArray[i]);
      elmImg.css({
        opacity: _opacity
      });

      // centering the original images.
      if (opts.centeringImg === true && opts.displayHeight > 0) {
        var isForceCentering = false;
        if (elmImg.css('top') == '0px' && elmImg.css('left') == '0px') {
          isForceCentering = true;
        }

        if (elmImg.attr(opts.cssPositionAttr) == opts.cssPositionUpdate || isForceCentering === true) {
          if (elmImg.height() > opts.displayHeight) {
            var ih = (elmImg.height() - opts.displayHeight) / 2;
            elmImg.css({
              top: '-' + ih + 'px'
            });
          }
        }
      }

      // initialize caption opacity.
      if (opts.visibleCaption === true) {
        $(captionArray[i]).css({
          opacity: _opacity
        });
      }
    }

    // append navigation.
    if (opts.visibleNav === true) {
      var nav = '<div class="' + opts.navigationClass + '">';
      for (var i = 0; i < imageSize; i++) {
        if (i == 0) {
          nav = nav + '<a rel="' + (i + 1) + '" class="' + opts.navigationSelectedClass + '">' + (i + 1) + '</a>\n';
        } else {
          nav = nav + '<a rel="' + (i + 1) + '">' + (i + 1) + '</a>\n';
        }
      }
      nav = nav + '</div>';
      this.append(nav);

      $('.' + opts.navigationClass + ' a').on('click', function() {
        // skip slide show.
        skipSlideShow($(this).attr('rel'));
      });
    }

    // slide start.
    timerId = setInterval(slideShow, opts.intervalSec);
  };

  // defaults parametrs.
  $.fn.cslider.defaults = {
    intervalSec: DEFAULT_INTERVAL_SEC,
    transitionSec: DEFAULT_TRANSITION_SEC,
    slideImgSelector: DEFAULT_SLIDE_IMG_SELECTOR,
    slideCaptionSelector: DEFAULT_SLIDE_CAPTION_SELECTOR,
    visibleCaption: true,
    centeringImg: true,
    cssPositionAttr: DEFAULT_CSS_POSITION_ATTR,
    cssPositionUpdate: DEFAULT_CSS_POSITION_UPDATE,
    displayHeight: DEFAULT_SLIDE_DISPLAY_HEIGHT,
    visibleNav: true,
    navigationClass: DEFAULT_NAV_CLASS,
    navigationSelectedClass: DEFAULT_NAV_SELECTED_CLASS
  };

  // private method ----

  /**
   * Start slide show.
   */
  var slideShow = function() {
    if (currentIndex == 0) {
      nextIndex = 1;
    } else if (currentIndex == imageSize - 1) {
      nextIndex = 0;
    } else {
      nextIndex = currentIndex + 1;
    }

    // transiton run.
    transitionRun();
  };

  /**
   * Skip to a selected content.
   * @param {integer}
   */
  var skipSlideShow = function(selectedIndex) {
    // stop timer.
    clearInterval(timerId)
    timerId = '';

    nextIndex = selectedIndex - 1;

    // force transiton run.
    transitionRun();

    // start slide show.
    timerId = setInterval(slideShow, opts.intervalSec);
  };

  /**
   * Run transition animation.
   */
  var transitionRun = function() {
    $(imageArray[currentIndex]).css({ zIndex: '99'}).stop().animate({ opacity: '0'}, opts.transitionSec);
    $(imageArray[nextIndex]).css({ zIndex: '100'}).stop().animate({ opacity: '1'}, opts.transitionSec);

    if (opts.visibleCaption === true) {
      $(captionArray[currentIndex]).css({ zIndex: '99'}).stop().animate({ opacity: '0'}, opts.transitionSec);
      $(captionArray[nextIndex]).css({ zIndex: '100'}).stop().animate({ opacity: '1'}, opts.transitionSec + 500);
    }

    currentIndex = nextIndex;
    if (opts.visibleNav === true) {
      $('.' + opts.navigationClass + ' a').each(function() {
        var elm = $(this);
        if (elm.attr('rel') == currentIndex + 1) {
          elm.addClass(opts.navigationSelectedClass);
        } else {
          elm.removeClass(opts.navigationSelectedClass);
        }
      });
    }
  };

}) (jQuery);
