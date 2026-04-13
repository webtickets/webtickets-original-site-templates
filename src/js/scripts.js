 /*global jQuery, iziToast, noUiSlider*/

jQuery(document).ready(function($) {
	'use strict';

	// Check if Page Scrollbar is visible
	//------------------------------------------------------------------------------
	var hasScrollbar = function() {
	  // The Modern solution
	  if (typeof window.innerWidth === 'number') {
	    return window.innerWidth > document.documentElement.clientWidth;
		}

	  // rootElem for quirksmode
	  var rootElem = document.documentElement || document.body;

	  // Check overflow style property on body for fauxscrollbars
	  var overflowStyle;

	  if (typeof rootElem.currentStyle !== 'undefined') {
			overflowStyle = rootElem.currentStyle.overflow;
		}

	  overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow;

	    // Also need to check the Y axis overflow
	  var overflowYStyle;

	  if (typeof rootElem.currentStyle !== 'undefined') {
			overflowYStyle = rootElem.currentStyle.overflowY;
		}

	  overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY;

	  var contentOverflows = rootElem.scrollHeight > rootElem.clientHeight;
	  var overflowShown    = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle);
	  var alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll';

	  return (contentOverflows && overflowShown) || (alwaysShowScroll);
	};
	if (hasScrollbar()) {
		$('body').addClass('hasScrollbar');
	}


	// Disable default link behavior for dummy links that have href='#'
	//------------------------------------------------------------------------------
	var $emptyLink = $('a[href="#"]');
	$emptyLink.on('click', function(e) {
		e.preventDefault();
	});



  // Site Search
  //---------------------------------------------------------
  function searchActions( openTrigger, closeTrigger, clearTrigger, target ) {
    $( openTrigger ).on( 'click', function() {
      $( target ).addClass( 'search-open' );
      setTimeout( function() {
        $( target + ' #site-search' ).focus();
      }, 200);
    } );
    $( closeTrigger ).on( 'click', function() {
      $( target ).removeClass( 'search-open' );
    } );
    $( clearTrigger ).on('click', function(){
      $( target + ' #site-search' ).val('');
      setTimeout(function() {
        $( target + ' #site-search' ).focus();
      }, 200);
    });
  }
	searchActions( '.toolbar .tool-search', '.close-search', '.clear-search', '.navbar' );

	// Search Autocomplete
	function searchAutocomplete(target) {
		var options = {
			url: "../search-autocomplete.json",
			getValue: "name",
			list: {
				match: {
					enabled: true
				},
				onShowListEvent: function() {
					$(target).addClass('suggestion-visible');
				},
				onHideListEvent: function() {
					$(target).removeClass('suggestion-visible');
				}
			},
			template: {
				type: "custom",
				method: function(value, item) {
					return "<a href='" + item.link + "'><i class='" + item.icon + "'></i><span class='ac-title'>" + value + "</span><span class='ac-type'>" + item.type + "</span></a>";
				}
			}
		};
		$(target).easyAutocomplete(options);
	}
	searchAutocomplete('#site-search');


  // Mobile Menu
  //---------------------------------------------------------
	// $('[data-toggle="mobile-menu"]').on('click', function() {
	// 	$('body').toggleClass('menu-open');
	// 	$('.mobile-menu-wrapper').slideDown( "slow" );
	// });
	$('[data-toggle="mobile-menu"]').on('click', function() {
		var iteration = $(this).data('iteration') || 1
		switch (iteration) {
			case 1:
				$('body').addClass('menu-open');
				$('.mobile-menu-wrapper').slideDown( "slow" );
				break;
			case 2:
				$('body').removeClass('menu-open');
				$('.mobile-menu-wrapper').slideUp( "slow" );
				break;
		}
		iteration++;
		if (iteration > 2) iteration = 1
		$(this).data('iteration', iteration);
	});




	// Animated Scroll to Top Button
	//------------------------------------------------------------------------------
	var $scrollTop = $( '.scroll-to-top-btn' );
	if ( $scrollTop.length > 0 ) {
		$( window ).on( 'scroll', function () {
			if ( $( this ).scrollTop() > 600 ) {
				$scrollTop.addClass( 'visible' );
			} else {
				$scrollTop.removeClass( 'visible' );
			}
		} );
		$scrollTop.on( 'click', function ( e ) {
			e.preventDefault();
			$( 'html' ).velocity( 'scroll', {
				offset: 0,
				duration: 1200,
				easing: 'easeOutExpo',
				mobileHA: false
			} );
		} );
	}


	// Smooth scroll to element
  //---------------------------------------------------------
	$( document ).on( 'click', '.scroll-to', function ( event ) {
		var target = $( this ).attr( 'href' );
		if ( '#' === target ) {
			return false;
		}

		var $target = $( target );
		if( $target.length > 0 ) {
			var $elemOffsetTop = $target.data( 'offset-top' ) || 0;
			$( 'html' ).velocity( 'scroll', {
				offset: $( this.hash ).offset().top - $elemOffsetTop,
				duration: 1000,
				easing: 'easeOutExpo',
				mobileHA: false
			} );
		}
		event.preventDefault();
	} );


	// Filter List Groups
	//---------------------------------------------------------
	function filterList(trigger) {
		trigger.each(function() {
			var self = $(this),
					target = self.data('filter-list'),
					search = self.find('input[type=text]'),
					filters = self.find('input[type=radio]'),
					list = $(target).find('.list-group-item');

			// Search
			search.keyup(function() {
				var searchQuery = search.val();
				list.each(function() {
					var text = $(this).text().toLowerCase();
					(text.indexOf(searchQuery.toLowerCase()) == 0) ? $(this).show() : $(this).hide();
				});
			});

			// Filters
			filters.on('click', function(e) {
				var targetItem = $(this).val();
				if(targetItem !== 'all') {
					list.hide();
					$('[data-filter-item=' + targetItem + ']').show();
				} else {
					list.show();
				}

			});
		});
	}
	filterList($('[data-filter-list]'));


	// Count Input (Quantity)
	//------------------------------------------------------------------------------
	$(".incr-btn").on("click", function(e) {
		var $button = $(this);
		var oldValue = $button.parent().find('.quantity').val();
		$button.parent().find('.incr-btn[data-action="decrease"]').removeClass('inactive');
		if ($button.data('action') == "increase") {
			var newVal = parseFloat(oldValue) + 1;
		} else {
		 // Don't allow decrementing below 1
			if (oldValue > 1) {
				var newVal = parseFloat(oldValue) - 1;
			} else {
				newVal = 1;
				$button.addClass('inactive');
			}
		}
		$button.parent().find('.quantity').val(newVal);
		e.preventDefault();
	});
	

	// Countdown Function
	//------------------------------------------------------------------------------
	function countDownFunc( items, trigger ) {
		items.each( function() {
			var countDown = $(this),
					dateTime = $(this).data('date-time');

			var countDownTrigger = ( trigger ) ? trigger : countDown;
			countDownTrigger.downCount({
		      date: dateTime,
		      offset: +10
		  });
		});
	}
	countDownFunc( $('.countdown') );


	// Toast Notifications
	//------------------------------------------------------------------------------
	$('[data-toast]').on('click', function() {

		var self = $(this),
				$type = self.data('toast-type'),
				$icon = self.data('toast-icon'),
				$position = self.data('toast-position'),
				$title = self.data('toast-title'),
				$message = self.data('toast-message'),
				toastOptions = '';

		switch ($position) {
			case 'topRight':
				toastOptions = {
					class: 'iziToast-' + $type || '',
					title: $title || 'Title',
					message: $message || 'toast message',
					animateInside: false,
					position: 'topRight',
					progressBar: false,
					icon: $icon,
					timeout: 3200,
					transitionIn: 'fadeInLeft',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};
				break;
			case 'bottomRight':
				toastOptions = {
					class: 'iziToast-' + $type || '',
					title: $title || 'Title',
					message: $message || 'toast message',
					animateInside: false,
					position: 'bottomRight',
					progressBar: false,
					icon: $icon,
					timeout: 3200,
					transitionIn: 'fadeInLeft',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};
				break;
			case 'topLeft':
				toastOptions = {
					class: 'iziToast-' + $type || '',
					title: $title || 'Title',
					message: $message || 'toast message',
					animateInside: false,
					position: 'topLeft',
					progressBar: false,
					icon: $icon,
					timeout: 3200,
					transitionIn: 'fadeInRight',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};
				break;
			case 'bottomLeft':
				toastOptions = {
					class: 'iziToast-' + $type || '',
					title: $title || 'Title',
					message: $message || 'toast message',
					animateInside: false,
					position: 'bottomLeft',
					progressBar: false,
					icon: $icon,
					timeout: 3200,
					transitionIn: 'fadeInRight',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};
				break;
			case 'topCenter':
				toastOptions = {
					class: 'iziToast-' + $type || '',
					title: $title || 'Title',
					message: $message || 'toast message',
					animateInside: false,
					position: 'topCenter',
					progressBar: false,
					icon: $icon,
					timeout: 3200,
					transitionIn: 'fadeInDown',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};
				break;
			case 'bottomCenter':
				toastOptions = {
					class: 'iziToast-' + $type || '',
					title: $title || 'Title',
					message: $message || 'toast message',
					animateInside: false,
					position: 'bottomCenter',
					progressBar: false,
					icon: $icon,
					timeout: 3200,
					transitionIn: 'fadeInUp',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};
				break;
			default:
				toastOptions = {
					class: 'iziToast-' + $type || '',
					title: $title || 'Title',
					message: $message || 'toast message',
					animateInside: false,
					position: 'topRight',
					progressBar: false,
					icon: $icon,
					timeout: 3200,
					transitionIn: 'fadeInLeft',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};
		}

		iziToast.show(toastOptions);
	});


	// Wishlist Button
	//------------------------------------------------------------------------------
	$('.btn-wishlist').on('click', function() {
		var iteration = $(this).data('iteration') || 1,
				toastOptions = {
					title: 'Product',
					animateInside: false,
					position: 'topRight',
					progressBar: false,
					timeout: 3200,
					transitionIn: 'fadeInLeft',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};

		switch ( iteration) {
			case 1:
				$(this).addClass('active');
				toastOptions.class = 'iziToast-info';
				toastOptions.message = 'added to your wishlist!';
				toastOptions.icon = 'icon-bell';
				break;

			case 2:
				$(this).removeClass('active');
				toastOptions.class = 'iziToast-danger';
				toastOptions.message = 'removed from your wishlist!';
				toastOptions.icon = 'icon-ban';
				break;
		}

		iziToast.show(toastOptions);

		iteration++;
		if (iteration > 2) iteration = 1;
		$(this).data('iteration', iteration);
	});


	// Shop Categories Widget
	//------------------------------------------------------------------------------
	var categoryToggle = $('.widget-categories .has-children > a');

	function closeCategorySubmenu() {
		categoryToggle.parent().removeClass('expanded');
	}
	categoryToggle.on('click', function(e) {
		if($(e.target).parent().is('.expanded')) {
			closeCategorySubmenu();
		} else {
			closeCategorySubmenu();
			$(this).parent().addClass('expanded');
		}
	});


	// Tooltips
	//------------------------------------------------------------------------------
	$('[data-toggle="tooltip"]').tooltip();


	// Popovers
	//------------------------------------------------------------------------------
	$('[data-toggle="popover"]').popover();


	// Range Slider
	//------------------------------------------------------------------------------
	var rangeSlider  = document.querySelector('.ui-range-slider');
	if(typeof rangeSlider !== 'undefined' && rangeSlider !== null) {
		var dataStartMin = parseInt(rangeSlider.parentNode.getAttribute( 'data-start-min' ), 10),
				dataStartMax = parseInt(rangeSlider.parentNode.getAttribute( 'data-start-max' ), 10),
				dataMin 		 = parseInt(rangeSlider.parentNode.getAttribute( 'data-min' ), 10),
				dataMax   	 = parseInt(rangeSlider.parentNode.getAttribute( 'data-max' ), 10),
				dataStep  	 = parseInt(rangeSlider.parentNode.getAttribute( 'data-step' ), 10);
		var valueMin 			= document.querySelector('.ui-range-value-min span'),
				valueMax 			= document.querySelector('.ui-range-value-max span'),
				valueMinInput = document.querySelector('.ui-range-value-min input'),
				valueMaxInput = document.querySelector('.ui-range-value-max input');
		noUiSlider.create(rangeSlider, {
			start: [ dataStartMin, dataStartMax ],
			connect: true,
			step: dataStep,
			range: {
				'min': dataMin,
				'max': dataMax
			}
		});
		rangeSlider.noUiSlider.on('update', function(values, handle) {
			var value = values[handle];
			if ( handle ) {
				valueMax.innerHTML  = Math.round(value);
				valueMaxInput.value = Math.round(value);
			} else {
				valueMin.innerHTML  = Math.round(value);
				valueMinInput.value = Math.round(value);
			}
		});

	}


	// Off-Canvas Sidebar
	//-----------------------------------------------------------
	function offcanvasSidebar(triggerOpen, target, triggerClose) {
		$(triggerOpen).on('click', function() {
			$(this).addClass('sidebar-open');
			$(target).addClass('open');
		});
		$(triggerClose).on('click', function() {
			$(triggerOpen).removeClass('sidebar-open');
			$(target).removeClass('open');
		});
	}
	offcanvasSidebar('.sidebar-toggle', '.sidebar-offcanvas', '.sidebar-close');


	// Interactive Credit Card
	//------------------------------------------------------------------------------
	var $creditCard = $('.interactive-credit-card');
	if($creditCard.length) {
		$creditCard.card({
			form: '.interactive-credit-card',
			container: '.card-wrapper'
		});
	}


	// Gallery (Photoswipe)
	//------------------------------------------------------------------------------
	if($('.gallery-wrapper').length) {

		var initPhotoSwipeFromDOM = function(gallerySelector) {

			// parse slide data (url, title, size ...) from DOM elements
			// (children of gallerySelector)
			var parseThumbnailElements = function(el) {
				var thumbElements = $(el).find('.gallery-item:not(.isotope-hidden)').get(),
					numNodes = thumbElements.length,
					items = [],
					figureEl,
					linkEl,
					size,
					item;

				for (var i = 0; i < numNodes; i++) {

					figureEl = thumbElements[i]; // <figure> element

					// include only element nodes
					if (figureEl.nodeType !== 1) {
						continue;
					}

					linkEl = figureEl.children[0]; // <a> element

					// create slide object
					if ($(linkEl).data('type') == 'video') {
						item = {
							html: $(linkEl).data('video')
						};
					} else {
						size = linkEl.getAttribute('data-size').split('x');
						item = {
							src: linkEl.getAttribute('href'),
							w: parseInt(size[0], 10),
							h: parseInt(size[1], 10)
						};
					}

					if (figureEl.children.length > 1) {
						item.title = $(figureEl).find('.caption').html();
					}

					if (linkEl.children.length > 0) {
						item.msrc = linkEl.children[0].getAttribute('src');
					}

					item.el = figureEl; // save link to element for getThumbBoundsFn
					items.push(item);
				}

				return items;
			};

			// find nearest parent element
			var closest = function closest(el, fn) {
				return el && (fn(el) ? el : closest(el.parentNode, fn));
			};

			function hasClass(element, cls) {
				return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
			}

			// triggers when user clicks on thumbnail
			var onThumbnailsClick = function(e) {
				e = e || window.event;
				e.preventDefault ? e.preventDefault() : e.returnValue = false;

				var eTarget = e.target || e.srcElement;

				// find root element of slide
				var clickedListItem = closest(eTarget, function(el) {
					return (hasClass(el, 'gallery-item'));
				});

				if (!clickedListItem) {
					return;
				}

				// find index of clicked item by looping through all child nodes
				// alternatively, you may define index via data- attribute
				var clickedGallery = clickedListItem.closest('.gallery-wrapper'),
					childNodes = $(clickedListItem.closest('.gallery-wrapper')).find('.gallery-item:not(.isotope-hidden)').get(),
					numChildNodes = childNodes.length,
					nodeIndex = 0,
					index;

				for (var i = 0; i < numChildNodes; i++) {
					if (childNodes[i].nodeType !== 1) {
						continue;
					}

					if (childNodes[i] === clickedListItem) {
						index = nodeIndex;
						break;
					}
					nodeIndex++;
				}

				if (index >= 0) {
					// open PhotoSwipe if valid index found
					openPhotoSwipe(index, clickedGallery);
				}
				return false;
			};

			// parse picture index and gallery index from URL (#&pid=1&gid=2)
			var photoswipeParseHash = function() {
				var hash = window.location.hash.substring(1),
					params = {};

				if (hash.length < 5) {
					return params;
				}

				var vars = hash.split('&');
				for (var i = 0; i < vars.length; i++) {
					if (!vars[i]) {
						continue;
					}
					var pair = vars[i].split('=');
					if (pair.length < 2) {
						continue;
					}
					params[pair[0]] = pair[1];
				}

				if (params.gid) {
					params.gid = parseInt(params.gid, 10);
				}

				return params;
			};

			var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
				var pswpElement = document.querySelectorAll('.pswp')[0],
					gallery,
					options,
					items;

				items = parseThumbnailElements(galleryElement);

				// define options (if needed)
				options = {

					closeOnScroll: false,

					// define gallery index (for URL)
					galleryUID: galleryElement.getAttribute('data-pswp-uid'),

					getThumbBoundsFn: function(index) {
							// See Options -> getThumbBoundsFn section of documentation for more info
							var thumbnail = items[index].el.getElementsByTagName('img')[0]; // find thumbnail
							if($(thumbnail).length > 0) {
								var	pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
										rect = thumbnail.getBoundingClientRect();

								return {
									x: rect.left,
									y: rect.top + pageYScroll,
									w: rect.width
								};
							}
						}

				};

				// PhotoSwipe opened from URL
				if (fromURL) {
					if (options.galleryPIDs) {
						// parse real index when custom PIDs are used
						// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
						for (var j = 0; j < items.length; j++) {
							if (items[j].pid == index) {
								options.index = j;
								break;
							}
						}
					} else {
						// in URL indexes start from 1
						options.index = parseInt(index, 10) - 1;
					}
				} else {
					options.index = parseInt(index, 10);
				}

				// exit if index not found
				if (isNaN(options.index)) {
					return;
				}

				if (disableAnimation) {
					options.showAnimationDuration = 0;
				}

				// Pass data to PhotoSwipe and initialize it
				gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
				gallery.init();

				gallery.listen('beforeChange', function() {
					var currItem = $(gallery.currItem.container);
					$('.pswp__video').removeClass('active');
					var currItemIframe = currItem.find('.pswp__video').addClass('active');
					$('.pswp__video').each(function() {
						if (!$(this).hasClass('active')) {
							$(this).attr('src', $(this).attr('src'));
						}
					});
				});

				gallery.listen('close', function() {
					$('.pswp__video').each(function() {
						$(this).attr('src', $(this).attr('src'));
					});
				});

			};

			// loop through all gallery elements and bind events
			var galleryElements = document.querySelectorAll(gallerySelector);

			for (var i = 0, l = galleryElements.length; i < l; i++) {
				galleryElements[i].setAttribute('data-pswp-uid', i + 1);
				galleryElements[i].onclick = onThumbnailsClick;
			}

			// Parse URL and open gallery if it contains #&pid=3&gid=1
			var hashData = photoswipeParseHash();
			if (hashData.pid && hashData.gid) {
				openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
			}

		};

		// execute above function
		initPhotoSwipeFromDOM('.gallery-wrapper');
	}


	// Google Maps API
	//------------------------------------------------------------------------------
	var $googleMap = $('.google-map');
	if($googleMap.length) {
		$googleMap.each(function(){
			var mapHeight = $(this).data('height'),
					address = $(this).data('address'),
					zoom = $(this).data('zoom'),
					controls = $(this).data('disable-controls'),
					scrollwheel = $(this).data('scrollwheel'),
					marker = $(this).data('marker'),
					markerTitle = $(this).data('marker-title'),
					styles = $(this).data('styles');
			$(this).height(mapHeight);
			$(this).gmap3({
          marker:{
            address: address,
            data: markerTitle,
            options: {
            	icon: marker
            },
            events: {
              mouseover: function(marker, event, context){
                var map = $(this).gmap3('get'),
                  	infowindow = $(this).gmap3({get:{name:'infowindow'}});
                if (infowindow){
                  infowindow.open(map, marker);
                  infowindow.setContent(context.data);
                } else {
                  $(this).gmap3({
                    infowindow:{
                      anchor:marker,
                      options:{content: context.data}
                    }
                  });
                }
              },
              mouseout: function(){
                var infowindow = $(this).gmap3({get:{name:'infowindow'}});
                if (infowindow){
                  infowindow.close();
                }
              }
            }
          },
          map:{
            options:{
              zoom: zoom,
              disableDefaultUI: controls,
              scrollwheel: scrollwheel,
              styles: styles
            }
          }
			});
		});
	}


	// Table Mountain Ticket Flow
	//------------------------------------------------------------------------------
	// Wrapped in an IIFE so function declarations below are at the top level
	// of a function body (required by strict mode — declarations inside an
	// `if` block would fail uglify).
	(function() {
		var $flow = $('.ticket-flow');
		if (!$flow.length) { return; }

		var state = {
			category:      null,
			categoryLabel: null,
			type:          null,
			typeLabel:     null,
			quantity:      1
		};

		var $sections = {
			1: $flow.find('[data-section="1"]'),
			2: $flow.find('[data-section="2"]'),
			3: $flow.find('[data-section="3"]'),
			4: $flow.find('[data-section="4"]')
		};

		function updateHeadings() {
			$flow.find('[data-heading-slot="category"]').text(state.categoryLabel || '');
			$flow.find('[data-heading-slot="type"]').text(state.typeLabel || '');
		}

		function resetFrom(n) {
			// Clear state values for steps at and after n
			if (n <= 2) {
				state.type = null;
				state.typeLabel = null;
			}
			if (n <= 3) {
				state.quantity = 1;
			}

			// Clear visual selection state on cards in sections >= n
			for (var i = n; i <= 4; i++) {
				$sections[i].find('.ticket-option-card').removeClass('ticket-option-card--selected');
				$sections[i].find('.btn-select .btn').removeClass('selected');
			}

			// Deactivate all types groups when resetting step 2
			if (n <= 2) {
				$flow.find('.ticket-flow__types-group').removeClass('is-active');
			}

			// Reset quantity input and Continue button label
			$flow.find('.ticket-flow__quantity .quantity').val(1);
			$flow.find('[data-action="continue"]').text('Continue');

			// Slide up and deactivate sections at and after n
			for (var j = n; j <= 4; j++) {
				(function($sec) {
					$sec.stop(true, true).slideUp(200, function() {
						$sec.removeClass('is-active');
					});
				})($sections[j]);
			}

			updateHeadings();
		}

		function revealSection(n, shouldScroll) {
			if (shouldScroll !== false) { shouldScroll = true; }
			var $sec = $sections[n];
			$sec.addClass('is-active');
			$sec.stop(true, true).slideDown(400, function() {
				if (shouldScroll) {
					$('html').velocity('scroll', {
						offset: $sec.offset().top - 80,
						duration: 700,
						easing: 'easeOutExpo',
						mobileHA: false
					});
				}
			});
		}

		function selectCategory($card) {
			var id    = $card.data('category');
			var label = $card.find('.ticket-option-card__title').text().trim();

			resetFrom(2);
			state.category      = id;
			state.categoryLabel = label;

			// Mark this category card selected, clear siblings
			$sections[1].find('.ticket-option-card')
				.removeClass('ticket-option-card--selected');
			$sections[1].find('.btn-select .btn').removeClass('selected');
			$card
				.addClass('ticket-option-card--selected')
				.find('.btn-select .btn').addClass('selected');

			// Activate only the matching types group
			$flow.find('.ticket-flow__types-group').removeClass('is-active');
			$flow.find('.ticket-flow__types-group[data-category="' + id + '"]').addClass('is-active');

			updateHeadings();
			revealSection(2);

			// Pre-select the recommended type (visually + reveal step 3 without scrolling past step 2)
			var $recommended = $flow.find('.ticket-flow__types-group.is-active .ticket-option-card--recommended').first();
			if ($recommended.length) {
				selectType($recommended, false);
			}
		}

		function selectType($card, shouldScroll) {
			var id    = $card.data('type');
			var label = $card.find('.ticket-option-card__title').text().trim();

			resetFrom(3);
			state.type      = id;
			state.typeLabel = label;

			// Mark this type card selected within its group
			var $group = $card.closest('.ticket-flow__types-group');
			$group.find('.ticket-option-card').removeClass('ticket-option-card--selected');
			$group.find('.btn-select .btn').removeClass('selected');
			$card
				.addClass('ticket-option-card--selected')
				.find('.btn-select .btn').addClass('selected');

			updateHeadings();
			revealSection(3, shouldScroll);
		}

		function lockQuantity() {
			state.quantity = parseInt($flow.find('.ticket-flow__quantity .quantity').val(), 10) || 1;
			$sections[3].find('[data-action="continue"]')
				.addClass('selected')
				.text('Continue (' + state.quantity + ')');
			revealSection(4);
		}

		// Event delegation on the root so hide/show never loses bindings
		$flow.on('click', '[data-section="1"] .ticket-option-card', function(e) {
			e.preventDefault();
			selectCategory($(this));
		});

		$flow.on('click', '.ticket-flow__types-group .ticket-option-card', function(e) {
			e.preventDefault();
			selectType($(this));
		});

		$flow.on('click', '[data-action="continue"]', function(e) {
			e.preventDefault();
			lockQuantity();
		});

		// Note: the existing .incr-btn handler (lines 212-229) already handles +/-
	})();

});/*Document Ready End*/

// File Upload Options (Dropzone)
//------------------------------------------------------------------------------
Dropzone.options.fileUpload = {
	addRemoveLinks: true,
	dictRemoveFile: '',
	maxFiles: 1,
	dictDefaultMessage: 'Drop files here or click to upload! Note, we recommend to upload JPG or PNG images. The image size should be at least 210x210px.'
};
