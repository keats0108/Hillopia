var RENDER = {
    init: function (property) {
		var History = window.History; 
		var b = property,
			URL = (b.PUBLISH) ? "/" : "/render",
			param = (b.PUBLISH) ? "/publish/true" : "",
			selectEL = '',
			galleryEL = new Object();

    	this.b = b;
		this.b.pageContent = {};
		this.b.pageContent[b.PAGE] = b.INITPAGE;
    	this.b.URL = URL;
    	this.b.param = param;
    	this.history = window.History;
    	this.b.MENULIST = [];
    	this.galleryEL = galleryEL;
    	_this = this;
    	$(window).ready(function() {
	        (function(window){
	            var History = window.History;
	            if ( !History.enabled ) {
	                return false;
	            }
	            History.Adapter.bind(window,'statechange',function(){
	                var State = History.getState(),
	                	cUrl = new getLocation(State.url),
	                	loc = cUrl.pathname,
	                	uri = (b.PUBLISH) ? loc.replace(/^\//,'').replace(/\/$/,'') : loc.replace(/\/*(render)\/*/,''),
	                	uri = uri.replace('/view/',','),
	                	s = uri.split(','),
	                	bookmark = '';

	                if(uri == b.URL || uri == '') {
	                	uri = (b.ONE) ? 'index' : b.MENULINK[0];
	                }

	                (typeof s[1] != "undefined") ? b.VIEW = s[1] : b.VIEW = '';
	                b.PAGE = decodeURI(uri);
	                if(b.PAGE.indexOf('@')>-1) {
	                	var tmp = b.PAGE.split('@');
	                	b.PAGE = tmp[0];
	                	bookmark = tmp[1];
	                }

	                if((b.PAGE).indexOf(',')>-1) {
	                	var tmp = b.PAGE.split(',');
	                	b.VIEW = tmp[1];
	                }

			    	var callParent = getParent(s[0],b.VIEW,	b.PAGE),
			    		pageMove = true;

			    	if(b.VIEW && s[0] != 'forum' && b.COUNT == 0 && !b.PUBLISH) {
			    		$(this).showModalFlat('INFORMATION','Page not found',true,false,'','ok');
			    		History.back();
			    		pageMove = false;
			    	}

			    	if(pageMove) {
			    		var menu_name = decodeURIComponent(loc);
			    		$('#tpl-menu.nav li').removeClass('active');
			    		$('#tpl-menu.nav li a[href="' + menu_name + '"]').parent().addClass('active');

			    		callParent.then(function() {
			    			$.post('/template/conf',{ sid : b.SID, page : b.PAGE, publish : b.PUBLISH }, function(data) {
			    				b.ISLOCK = data.islock;
			    				b.HEADER = (data.overlay) ? 1 : 0;

			    				var isSidebar = ($('header').hasClass('sidebar')) ? true : false;
			    				if(b.HEADER && !isSidebar) {
			    					$('.header-empty').css('height',0);
			    					$('.header.el-menu').removeClass('fixed');
			    					$('header.navbar').addClass('transparent');
			    				} else {
			    					$('header.navbar').removeClass('transparent');
			    				}

			    				$('#pageScript').remove();
			    				if(data.pageScript) $('body').append(data.pageScript);
			    				if(data.meta != null) {
			    					$.each(data.meta, function(k,v) {
			    						$('meta[name="' + k + '"]').attr('content',v);
			    						if(k == 'title') {
			    							$(document).prop('title', v);
			    						}
			    					});
			    				}
			    			},'json');
			    		}).then(function() {
			                clearDsgnbody();
			                if($('.popup').length) $('.popup').remove(); //clear Popup;
					    	showPageCallback(showPage, function() {
					        	if(b.VIEW) {
						        	_this.displayComment(b.VIEW);
					                funcCallback( displayPageToolbar, function() {
					                	setTimeout(function() {
						                    displaySnsShare(b.PARENT.pid);
						                    displayBottomList(b.PARENT.pid);
					                	}, 100);
					                });
					            }

					            var pgmove_vMode = $('.mobilepc_ch').attr('data-desktop-option');

							    setTimeout(function() {					    	
							    	if(b.ONE && !b.VIEW || (b.PAGE == b.MENULINK[0]) && !b.VIEW) setSitePopup();
									if(b.VALIDPLAN) {
										if(typeof b.SETTINGS.fnav != "undefined" && !$.isEmptyObject(b.SETTINGS.fnav)) $.fnav.draw(b.SETTINGS.fnav);
										if(typeof b.SETTINGS.viewportMode != "undefined" && b.SETTINGS.vpMode_onoff===true) $.mpcWeb.mpcWebhtml(pgmove_vMode,b.CONTENTS);
									}
							    }, 500);
					    	});
			    		}).then(function() {
			    			if(typeof $.cookie('gallery-item') != 'undefined' && b.VIEW == '') {
					        	setTimeout(function() {
					        		moveGallery($.cookie('gallery-item'));
					        	},500);
			    			} else if(typeof $.cookie('forum-item') != 'undefined' && b.VIEW == '') {
			    				setTimeout(function() {
			    					scrollToBlock('.element[data-id="' + $.cookie('forum-item') + '"]', 1000);
			    				}, 500);
			    			} else {
				    			var url = window.location;
				    			setTimeout(function() {
				    				moveScroll(0,url.href);
				    			},100);
			    			}
			    		});
			    	}
	            });

				History.Adapter.bind(window, 'popstate', function() { // history.js suggests statechange but it has a bug with urls with hashes not firing statechange
	                var State = History.getState(),
	                	cUrl = new getLocation(State.url),
	                	bUrl = new getLocation(window.location.href);

	                if(b.ONE) {
	                	if(cUrl.href!=window.location.href) {
	                		if(b.PAGE!='index') {
	                			var link = (!b.PUBLISH) ? '/render/index' : bUrl.pathname;
								var url = new getLocation(link);
					        	golink(_this,url);
								history.pushState('', '', link + bUrl.hash);
	                		} else {
	                			// if(bUrl.hash) {
	                			// 	var go = (bUrl.hash).replace('#','');
	                			// 	moveLinkPage(go);
	                			// }
	                		}
	                	}
	                }
				});
	            
	        })(window);

		    $('.dsgn-body').addClass('mode-render');

	    	//$.modalON();

			if(typeof b.SETTINGS == 'undefined') return;
			if(typeof b.SETTINGS.rightClick == 'undefined' || b.SETTINGS.rightClick === false) return;
		    $('body').on("contextmenu", function(event){ return false; });
			$('body').on("selectstart", ".element, .forum-view, .comment-list", function(event){ return false; });
	    	$('body').on("dragstart", ".element, .forum-view, .comment-list",  function(event){ return false; });
	    });
		
		Pace.on('done', function() {
			var vpmode_opt = $('.mobilepc_ch').attr('data-desktop-option'),
				vpmode = vpmode_opt ? vpmode_opt : b.SETTINGS.viewportMode;

			setTimeout(function() { 
				$('body').removeClass('pace-disable'); },500);
		        if(typeof $.cookie('gallery') != 'undefined' && b.VIEW == '') {
		        	moveGallery($.cookie('gallery-item'));
		        }
		        if(typeof b.SETTINGS.viewportMode != "undefined" && b.SETTINGS.vpMode_onoff===true) {
		        	$.mpcWeb.mpcWebhtml(vpmode,b.CONTENTS);
		        }
	        // moveScroll(0);
		});

	    $('.dsgn-body').addClass('mode-render');
    	// (b.WRAP) ? $('.dsgn-body').addClass('tiny') : $('.dsgn-body').removeClass('tiny');

		$('header').wrap('<div class="header el-menu" data-el="el-menu" data-name="menu"></div>');

		var $tag = $('header');
		$tag.removeClass('tpl-menu');
		if(b.ONE){
			if(b.VIEW) $tag.find('#site-home').attr('href',URL).removeClass('mini-home');
			else $tag.find('#site-home').attr('href','javascript:;').addClass('mini-home');
		} else $tag.find('#site-home').attr('href',URL).removeClass('mini-home');

		var isSidebar = $tag.hasClass('sidebar');
		if(isSidebar) {
			$('.dsgn-body').addClass('sidebar');
			$('.header.el-menu').addClass('sidebar');
		}

		if(b.HEADER && !isSidebar) {
			$('header.navbar').addClass('transparent');
		}

		menu_color = $('header.navbar').css('background-color');
		header_fixed = $('header.navbar').height();
		if(menu_color==('rgba(0, 0, 0, 0)')) {
			$('header.navbar').css('background-color',$('dsgn-body').css('background-color'));
		}

		// footer
		$('.footer-' + b.SID).addClass('el-footer').addClass('element').attr('data-type','footer');

	    $(window).on('scroll',function() {
			if ($(this).scrollTop() > 200) {
				$('#goto-top').fadeIn(200);
			} else {
				$('#goto-top').fadeOut(200);
			}
	        if($('.dsgn-body').hasClass('sidebar')==false) {
	            fixedMenu();
	        }
	        scrollspy();	
	        parallax();
	    });

		$(window).on("orientationchange",function(){
			if($('.blueimp-gallery-display').length) {
				var $slide = $('.blueimp-gallery .slides .slide'),
					play = $('.blueimp-gallery-playing').length,
					idx = 0;
				$.each($slide, function(i,v) {
		        	var trans = $(this).attr('style');
		        	if(trans.indexOf('translate(0px, 0px)') > 0) {
		        		idx = $(this).attr('data-index');
		        	}
				});

				var gallery = $('.blueimp-gallery-display').attr('id');
				$('#' + gallery + ' .close').click();
				$.processON();
				setTimeout(function() { 
					$.processOFF() ; 
					$('.gallery-item[data-index="' + idx + '"] a[data-gallery="#' + gallery + '"]').click(); 
					if(play) $('#' + gallery + ' .play-pause').click();
				}, 1000);
			}
		});

		$(window).resize(function () {
			$('.config-image-view').hide();
			if(window.innerWidth <= 768 && $('.dsgn-body').hasClass('sidebar')) {
				if($('header.navbar').hasClass('sidebar')) {
					cssSidebar('0px');
				}
				$('.dsgn-body').removeClass('sidebar').addClass('removed-sidebar');
			} else if (window.innerWidth > 768 && $('.dsgn-body').hasClass('removed-sidebar')) {
				if($('header.navbar').hasClass('sidebar')) {
					cssSidebar($('header.navbar').outerWidth() + 'px');
				}
				$('.dsgn-body').removeClass('removed-sidebar').addClass('sidebar');
				var top = ($('.creatorlink-header').length == 1) ? '55px' : '0px';
				$('.el_0').css('margin-top',top);
				if($(".header-empty").length > 0) $('.header-empty').remove();
			}

            if( $(".header-empty").length > 0 && $('.header-empty').height() != $('.el-menu').height() ) {
            	$('.header-empty').css('height',$('.el-menu').height()+'px');
            }

	        if(window.innerWidth <= 768) {
	            if($('#tpl-menu li.active.dropdown').length > 0) $('#tpl-menu li.active.dropdown').removeClass('active');

				// menu sidebar - height overflow
	            if($('.el-menu header').hasClass('sidebar')) $('.el-menu header.navbar #tpl-menu').closest('.collapse').removeAttr('style');
	        } else {
	            if($('#tpl-menu li.active').closest('ul').hasClass('dropdown-menu')) $('#tpl-menu li.active').closest('li.dropdown').addClass('active');
	        }

	        if($('.fnav').length > 0) {
	            var vpmode_opt = $('.mobilepc_ch').attr('data-desktop-option'),
                	vpmode = vpmode_opt ? vpmode_opt : b.SETTINGS.viewportMode;

	        	if(window.innerWidth <= 480) {
	        		if(vpmode == 'mobile_web') $('#goto-top,#cl-music-player-icon').removeClass('moved movepc').addClass('moveMpc');
	        		else $('#goto-top,#cl-music-player-icon').removeClass('moveMpc movepc').addClass('moved');
	        	} else {
	        		if(b.SETTINGS.vpMode_onoff === true && vpmode == 'mobile_pc') $('#goto-top,#cl-music-player-icon').removeClass('moved moveMpc').addClass('movepc');
	        		else $('#goto-top,#cl-music-player-icon').removeClass('moved moveMpc movepc');
	        	}
	        }	

	        fixedMenu();
	        scrollspy();
	        if($('.fr-view').length) {
	            setForumWrap();
	        }
	        sitePopupResize();
	    });
	    this.liveUpdate(b.SMENU);

		var displaySnsShare = function(pid) {
		    var option = (b.PARENT.settings) ? jQuery.parseJSON(b.PARENT.settings) : {};
		    if(typeof option.sns_share_display == "undefined" || !option.sns_share_display) return false;
		    else if ( option.sns_share_display == "ON") {
		    	if((b.PAGE).split(",")[0] == 'forum') $('.tpl-forum-list-footer .tpl-page-toolbar .tpl-forum-toolbar-button.share').removeClass('hide');
		    	else $( '.tpl-page-footer' ).removeClass( 'hide' );
		    }
		}


		$('.siteLANG ul a, .siteLANG-dmenu-wrap ul li a').live({
			click: function(e) {
				e.preventDefault();
				var sid = (typeof SID != 'undefined' && SID) ? SID : property.SID,
					slang_code = $(this).attr('data-code'),
					slang_str = $(this).text().trim();

				changeLanguage(slang_code);
			}
		});


		$('.sitePopupTodayHide').live({
			click: function() {
				var selectedPopup = $(this).closest('.modal-popup').attr('id'),
					checked = ($(this).prop('checked')) ? true : false;
				if(checked) $('#' + selectedPopup).find('.popup-close').click();
			}
		});

		$('.popup-close').live({
		    click: function() {
		        var selectedPopup = $(this).closest('.modal-popup').attr('id'),
		            idx = $(this).closest('.modal-popup').attr('data-idx'),
		            ptime = $(this).closest('.modal-popup').attr('data-time'),
		            isTodayHide = $(this).closest('.modal-popup').find('.sitePopupTodayHide').prop('checked'),
		            date = new Date();
		            
		        var ptime_val = {
					'always'    : 0,
					'onlyone'   : 365 * 24 * 60 * 60 * 1000,
					'week'      : 7 * 24 * 60 * 60 * 1000, 
					'day'       : 24 * 60 * 60 * 1000, 
					'12hour'    : 12 * 60 * 60 * 1000, 
					'6hour'     : 6 * 60 * 60 * 1000, 
					'2hour'     : 2 * 60 * 60 * 1000, 
					'1hour'     : 60 * 60 * 1000, 
					'30min'     : 30 * 60 * 1000, 
					'10min'     : 10 * 60 * 1000
		        };

		        if(isTodayHide) {
		        	date.setTime(date.getTime() + ptime_val['day']);
		        } else { 
		        	date.setTime(date.getTime() + ptime_val[ptime]);
		        }
		        $('#' + selectedPopup).fadeOut();
		        if(isTodayHide || (typeof ptime !='undefined' && ptime != 'always' && ptime != '')) { $.cookie(selectedPopup, true, { path: '/', expires: date}); }
		        else { $.removeCookie(selectedPopup, { path: '/' }); }
		    }
		});

		var displayBottomList = function(pid) {
			var option = (b.PARENT.settings) ? jQuery.parseJSON(b.PARENT.settings) : {};
			if(typeof option.bottomlist_display == "undefined" || !option.bottomlist_display) return false;
			else if (option.bottomlist_display == 'ON') {
				var checkUrl = b.PAGE.split(","),
					type = (checkUrl[0] == "forum") ? "F" : "P";

					$.bottomlist.init({
						pid : pid,
						type : type
					});
				}
		}

		var moveScroll = function(interval, loc) {
			var url = (typeof loc == 'undefined') ? decodeURIComponent(document.URL) : decodeURIComponent(loc);
		    link = url.split('#').pop();
		    if($.inArray(link,b.MENULINK) > -1 && b.ONE && !b.VIEW) {
		        moveLinkPage(link,interval);
		        $.removeCookie('gallery', { path: '/' });
		        $.removeCookie('gallery-item', { path : '/' });
		    } else if (url.match(/\@/g)) {
		        link = url.split('\@').pop();
		        var bookmark_link = url.substr(url.lastIndexOf('/')+1);
		        if(link) moveLinkPage(bookmark_link,800,true);
		    }
		}

		var moveBookmark = function(page,bookmark,interval,target) {
			var page_arr = (typeof page == 'undefined') ? new Array() : page.split('\,'),
				view = (page_arr.length > 1) ? page_arr[1] : '';

		    interval = (typeof interval == 'undefined') ? 1200 : interval;
		    target = (typeof target == 'undefined') ? '' : target;

		    if( (view!='' && view==b.VIEW && !target) || (view=='' && !b.VIEW && page_arr[0]==b.PAGE && !target) ) {
		        moveLinkPage(page_arr[0]+bookmark,interval,true);
		    } else {
		        var linkUrl = '';
		        if(b.ONE) {
		            linkUrl = (view.length>0) ? '/index/view/' + view : '/index';
		            linkUrl = (!b.PUBLISH) ? '/render' + linkUrl + bookmark : linkUrl + bookmark;
		        } else {
		        	var url_str = (view.length>0) ? page_arr[0] + '/view/' + view : page;
		            linkUrl = (URL=="/") ? "/" + url_str + bookmark : URL + "/" + url_str + bookmark;  
		        }

		        if(target) {
					var openLinkPage = window.open("about:blank");
					openLinkPage.location.href=linkUrl;
		        } else {
					var url = new getLocation(linkUrl);		        	
		        	golink(_this,url);
		        	// location.replace(linkUrl);
		        }
		        
		    }
		}

		var moveLinkPage = function(link,interval,isblock) {
			interval = (typeof interval == 'undefined') ? 1200 : interval;
			if(typeof isblock == 'undefined') isblock = "";
		    if($('.dsgn-body').width()<769) {
		        header_fixed = $('.el-menu .navbar-header').height()-1;
		    } else {
		        header_fixed = $('#tpl-menu').height();
		    }

		    var isBookmark = false, bookmark_arr = new Array();
		    link = decodeURIComponent(link);
			if(link.match(/\@/g)) { 
				isBookmark = true;
				bookmark_arr = link.split('\@');


				var check_link = true,
					is_visible_menu = false;

				$.each(b.SMENU, function (idx, obj) {
					if(is_o_page == obj.name.replace(/ /g,'-')) {
						if(!obj.link) check_link = false;
						if(obj.display == 'on') is_visible_menu = false;
					}
					if(obj.children) {
						$.each(obj.children, function (i, v){
							if(is_o_page == v.name.replace(/ /g,'-')) {
								if(!v.link) check_link = false;
								if(v.display == 'on') is_visible_menu = false;
							}
						});
					}
				});

				var is_here = ($('.element[data-bookmark="' + bookmark_arr[1] + '"]').length > 0 ) ? true : false,
					is_page = (b.PAGE.toLowerCase()==bookmark_arr[0].toLowerCase() || b.VIEW && b.VIEW == bookmark_arr[0]) ? true : false,
					is_o_page = (bookmark_arr[0].indexOf(',') > -1 && !b.VIEW) ? bookmark_arr[0].substring(0,bookmark_arr[0].indexOf(',')) : (b.VIEW) ? 'index' : bookmark_arr[0],
					// is_visible_menu = ($.inArray(is_o_page,b.MENULINK)>-1) ? true : false,
					// check_link = ( $('#tpl-menu li a[href*="'+is_o_page+'"]').length > 0 && $('#tpl-menu li a[href*="'+is_o_page+'"]').text().trim().replace(/ /gi,'-') == is_o_page ) ? false : true,
					is_link = (check_link && is_visible_menu && is_o_page != 'INTRO') ? true : false,
					is_visible = (check_link && is_visible_menu && is_o_page != 'INTRO') ? true : false;

				if( ( !is_visible_menu && is_o_page!='index' ) ||
					( /*!is_page &&*/ ( is_link || is_visible ) ) ||
					( is_page && !is_here ) )  { 
					if(is_visible_menu==false) ;
					else return false; 
				}
				link = 'element[data-bookmark="' + bookmark_arr[1] + '"]';     
				
			} else {
			    link = (isblock=="") ? "link-to-" + link : link;
			}

		    var offset = ($('.dsgn-body').hasClass('sidebar')) ? 0 : -header_fixed;
		    if($('header.navbar').hasClass('disableOffset') && !$('.'+link).hasClass('el_0')) offset = 0;

		    // $('body').scrollTo('.'+link,interval,{offset:offset,easing :'easeInOutQuart'});
		    if($('.'+link).length==0) return;
		    var sTop = $('.'+link).offset().top + offset,
		    	duration = (typeof $('#tpl-menu').attr('data-duration') != "undefined") ? parseInt($('#tpl-menu').attr('data-duration')) : 1000;
		    $('html, body').animate({
		        scrollTop: sTop
		    },duration, 'easeInOutQuart');

		    var menuStr = (!isBookmark) ? link.replace('link-to-','') : bookmark_arr[0];
		    // setTimeout(function() {
			   //  $('#tpl-menu li').find("a:contains('" + menuStr + "')").closest('li').addClass('active').siblings().removeClass('active');
		    // },10);
		}

		var getParent = function(parent,id,page) {
		    var deferred = $.Deferred();
		    if(id) {
		    	parent = (parent == 'forum') ? parent : 'project';
				$.getJSON('/template/get/parent/' + parent + '/id/' + id + '/sid/' + _this.b.SID + '/page/' + encodeURIComponent(page) + _this.b.param, function(data) {
					_this.b.PARENT = data.PARENT;
					_this.b.COUNT = data.COUNT;
				});
		    } else {
				_this.b.PARENT = {};
				_this.b.COUNT = 0;
		    }
			deferred.resolve();
		    return deferred.promise();
		}

		var showPageCallback = function(func,callback) {
		    func(b.MCSS, b.MSTYLE, b.MTAG, true);
		    if(typeof callback=='function') {
		    	callback();
		    }
		}

		var showPage = function (css, style, tag, prop) {
			if($('.fmcss').length > 0) $('.fmcss').remove();
		    $.each(style.children,function(k,v) {
		        if(k!='.dsgn-body') {
		            delete style.children[k];
		        }
		    });			
    		elFooter();

		    if(b.HEADER && !isSidebar) {
		        $('header.navbar').addClass('transparent');
		    }

		    menu_color = $('header.navbar').css('background-color');
		    header_fixed = $('header.navbar').height();
		    if(menu_color==('rgba(0, 0, 0, 0)')) {
		        $('header.navbar').css('background-color',$('dsgn-body').css('background-color'));
		    }

		    var is_lock_block = 'active';
		    if(b.ISLOCK == 'true') { 
				isMenuLock(function() {
					if(b.ISLOCK == 'true' && is_lock_block == '' || b.ISLOCK != 'true') elPush(prop);
				});

				// is_lock_block = isMenuLock();
		    } else {
				if(b.ISLOCK == 'true' && is_lock_block == '' || b.ISLOCK != 'true') elPush(prop);		    	
		    }

		    if(b.PARENT.page) {
		        $('#tpl-menu li').find("a:contains('" + b.PARENT.page + "')").parent().addClass('active');
		    } else {
		        if(b.ONE && b.SMENU[0].display == "off") {
		            $('#tpl-menu li').first().addClass('active');
		        }
		    };

		    RENDER.setLoginout(b.LOGINOUT, b.SID, b.PUBLISH, b.PROFILEIMG);
		    $('body,html').animate({scrollTop: 0}, 300,'easeInOutQuart');
		}

		var loadPush = function(data) {
		    var deferred = $.Deferred();
		    var pageID = b.PAGE.split(","),
		        chgBG = false,
		        tmpTag = '',
		        currentPAGE = b.PAGE,
		        default_t_css = '', default_m_css = '';

			var googleFonts = {
					'abel' : 'Abel',
                    'abril fatface' : 'Abril+Fatface',
					'alegreya' : 'Alegreya:400,400i',
					'cardo' : 'Cardo:400,400i',
					'cookie' : 'Cookie',
					'dancing script' : 'Dancing+Script:400',
					'dosis' : 'Dosis:400',
					'droid sans' : 'Droid+Sans:400',
					'droid serif' : 'Droid+Serif:400,400i',
					'great vibes' : 'Great+Vibes',
					'lato' : 'Lato:400,400i',
					'libre baskerville' : 'Libre+Baskerville:400,400i',
					'lora' : 'Lora:400,400i',
					'montserrat' : 'Montserrat:400,400i',
					'muli' : 'Muli:400,400i',
					'nixie one' : 'Nixie+One',
					'noto sans kr' : 'Noto+Sans+KR:100,300,400',
					'noto sans' : 'Noto+Sans:400,400i',
					'open sans' : 'Open+Sans:100,400',
					'oswald' : 'Oswald:400',
					'playball' : 'Playball',
					'playfair display' : 'Playfair+Display:400,400i',
					'pT sans' : 'PT+Sans:400,400i',
					'pT serif' : 'PT+Serif:400,400i',
					'questrial' : 'Questrial',
					'quicksand' : 'Quicksand:400',
					'raleway' : 'Raleway:400,400i',
					'roboto' : 'Roboto:400,400i',
					'stalemate' : 'Stalemate'
			}

	        $('#el-empty').empty();
	        b.COUNT = data.length;

	        $.each(data, function (idx, val) {	        	
	            var tag = htmlspecialchars_decode(val.eltag,'ENT_QUOTES'),
	            	gallery_empty = true,
	            	fontload = [];
	        	
	            if(val.type == "project" && val.eltag.charAt(0) == '\<') tag = val.eltag;

	            $.each(val.fonts, function(i,v) {
	            	if(b.ELFONTS.indexOf(i)<0) {
	            		b.ELFONTS.push(i);
	            		if(v) $('#loadfonts').append(v);
	            		else {
	            			if(i in googleFonts)
	            				WebFont.load({ google : { families : [ googleFonts[i.toLowerCase()] ] }});
	            		}
	            	}
	            });

	            if (val.type == "gallery") {
	                $('#el-empty').append($(tag));
	                $('#el-empty').find('[data-loop="true"]').html('');

	                var nodes = $(tag).find('[data-loop="true"]').children(),
	                    p = $('#el-empty').children(),
	                    i = [],
	                    view = $(tag).find("[data-loop='true']").data('view'),
	                    total = 0;

                    galleryEL[val.seq] = {
                    	'seq' : val.seq,
                    	'eltag' : tag,
                    	'folder' : val.folder,
                    	'mode' : val.mode,
                    	'elsettings' : val.elsettings,
                    	'feature' : val.feature,
                    };

	                if(typeof view == "undefined") view = 10;
	                var cookie_page = 1,
	                	cookie_view = view,
	                    cookie_gallery_category = '',
	                    is_gc_cookie = (typeof $.cookie('gallery-category-'+val.seq) != 'undefined' && $.cookie('gallery-category-'+val.seq).length > 0) ? true : false;

	                if(typeof $.cookie('loadmore-' + val.seq) != 'undefined' && $.cookie('loadmore-' + val.seq).length > 0) {
	                    cookie_page = $.cookie('loadmore-'+val.seq);
	                    cookie_gallery_category = (typeof $.cookie('gallery-category-'+val.seq) != 'undefined') ? $.cookie('gallery-category-'+val.seq) : '';
	                    $.cookie('gallery-page-' + val.seq, cookie_page, { path : '/', expires: 12 * 60 * 60 * 1000 });
	                    $.cookie('gallery-category-' + val.seq, cookie_gallery_category, { path : '/', expires: 12 * 60 * 60 * 1000 });
	                    cookie_view = cookie_page * view;
	                    $.removeCookie('loadmore-'+val.seq, { path : '/' });  
	                } else { 
	                    $.cookie('gallery-page-' + val.seq, 1, { path : '/', expires: 12 * 60 * 60 * 1000 });
	                    $.cookie('gallery-category-' + val.seq, cookie_gallery_category, { path: '/', expires: 12 * 60 * 60 * 1000 });
	                }
	                
	                $.ajax({
	                    url: '/template/gallery/list/pid/' + val.seq + '/sid/' + b.SID + '/spage/' + currentPAGE + '/mode/design/view/' + cookie_view + param,
	                    data: { sfl: 'category', stx: unescape(cookie_gallery_category) },
	                    dataType: 'json',
	                    type: 'POST',
	                    async: false,
	                    cache: false,
	                    success: function (data) {
	                        $.each(data.list, function (idx, v) {
	                            i.push(v);
	                        });

	                        total = (typeof data.total.list_total == 'undefined') ?  data.total : data.total.list_total;
				            cookie_view = ( cookie_view > total ) ? total : cookie_view;
	                        // cookie_view = (cookie_view < total) ? cookie_view : total;

	                        if(total>0) gallery_empty = false;
	                        if( i.length>0 || (i.length==0 && is_gc_cookie) ) {
	                            var loop_count = nodes.length, item_index = 0;
	                            var elem = []
	                            $.each(i,function(index,v) {
	                                loop_pos = index%loop_count;
	                                c = nodes[loop_pos];

	                                v.title = (v.title.length>0) ? v.title : 'Title';
	                                v.caption = (v.caption.length>0) ? v.caption : 'You can change this text';
	                                $(c).addClass('gallery-item').attr('data-index',index).attr('data-seq',v.seq);


	                                var vgsettings = (typeof v.gsettings != 'undefined' && v.gsettings) ? $.parseJSON(v.gsettings) : {},
								        img_path = (typeof vgsettings['storage'] != 'undefined') ? vgsettings['storage'] : _this.b.RESOURCE + "/" + _this.b.SID + "/",
								        img_original = (typeof vgsettings['storage'] != 'undefined') ? img_path + '1920/' : img_path;

									var folder = (val.folder == 0) ? "" : val.folder + "/";
									$(c).find('img').attr("src", img_path + folder + v.image);

									var glink = (typeof vgsettings['glink'] != 'undefined' && vgsettings['glink']) ? vgsettings['glink'] : '',
										glink_target = (typeof vgsettings['glink_target'] != 'undefined' && vgsettings['glink_target']) ? vgsettings['glink_target'] : '';

									if(glink) {
										if(glink.match(/^\@/g) !== null) {														// link-type: link-bookmark ==> a[attr-bookmark]
											var bookmark_seq = glink.replace(/^\@/g,'');
											if(typeof _this.b.SETTINGS.blockBookmarkList == 'undefined' || typeof _this.b.SETTINGS.blockBookmarkList['bookmark' + bookmark_seq] == 'undefined') {
												glink = '';
												glink_target = '';
											}
                                        } else if(_this.b.MENULIST.indexOf(glink.replace(/^\//g,"").replace(/ /g,"-")) > -1) {  // link-type: link-menu     ==> a[data-user-link]
                                        } else {                                                                                // link-type: link-out      ==> a[attr-link]
											if(checkBase64Encode(glink)) glink = Base64.decode(glink);
										}
									}

	                                if(glink) {
										var glink_val = makeLinkUrl(glink, b.ONE, b.VIEW);

										$(c).find('a').removeAttr('data-gallery').removeAttr('data-user-link').removeAttr('attr-bookmark').removeAttr('attr-link');
										$(c).find('a').attr('href',glink_val);

										if(_this.b.MENULIST.indexOf(glink.replace(/ /g,'-'))>-1) {
											$(c).find('a').attr('data-user-link',glink_val);
										} else if(glink.match(/^\@/g)) {
											$(c).find('a').attr('attr-bookmark',glink.replace(/^\@/g,''));
										} else {
											$(c).find('a').attr('attr-link',glink);
										}
	                                } else {
		                                $(c).find('a').removeAttr('data-user-link').removeAttr('attr-bookmark').removeAttr('attr-link');

										if (val.mode == "gallery") {
											$(c).find('a').attr("href", img_original + v.image);
											$(c).find('a').attr('data-gallery', '#gframe-' + val.seq);

											var elsettings = (val.elsettings == "") ? {} : $.parseJSON(val.elsettings),
											img_onoff = (typeof elsettings.img_original_display == "undefined") ?  "OFF": elsettings.img_original_display;
											$(c).find('a').attr('data-img-original',img_onoff);
										} else {
											$(c).find('a').removeAttr('data-gallery');
											$(c).find('a').attr("href", ((URL=="/") ? "" : URL) + "/" + b.PAGE + "/view/" + v.seq);
										}
		                            }

									if(glink_target == '_blank') $(c).find('a').attr('target','_blank');
									else $(c).find('a').removeAttr('target');

	                                $(c).find('a').attr("data-title", v.title).attr('title',v.title);

	                                // caption
	                                var ftitle = $(c).find('h5.figure'),
	                                    fcaption = $(c).find('p.figure'),
	                                    fdatetime = $(c).find('.figure.datetime'),
	                                    fhashtag = $(c).find('.figure.hashtag');

	                                // datetime / hashtag
	                                if(fdatetime.length<1) {
	                                    $(c).find('figcaption').append("<div class='figure datetime hide'></div>");
	                                    fdatetime = $(c).find('.figure.datetime');
	                                }
	                                if(fhashtag.length<1) {
	                                    $(c).find('figcaption').append("<div class='figure hashtag hide'></div>");
	                                    fhashtag = $(c).find('.figure.hashtag');
	                                }

	                                $(c).find('figcaption').removeClass('hide');
	                                if (v.title || v.caption) {
	                                    ftitle.html(v.title);
	                                    var gallery_caption = v.caption;
	                                    gallery_caption = gallery_caption.replace(/\n/g, "<br />");
	                                    fcaption.html(gallery_caption);
	                                    fcaption.removeClass('hide');
	                                    fdatetime.text(v.datetime);
	                                    fhashtag.text(v.hashtag);
	                                }
	                                $(p).find('[data-loop="true"]').append($(c)[0].outerHTML);		                                
	                            });
	                            
	                        } else {
	                            if(val.mode=='project') {
	                            	nodes.addClass('gallery-item');
	                                nodes.find('a').attr('href', ((URL=="/") ? "" : URL) + "/" + b.PAGE + "/view/template").removeAttr('data-gallery').find('img').attr('data-index',0);
	                            }
	                            $(p).find('[data-loop="true"]').append(nodes);
	                        }

	                        tag = $(p)[0].outerHTML;
	                        $('#el-empty').empty();
	                    }
	                });
	            } else {
	                if(typeof pageID[1] != "undefined" && idx==0 && pageID[1] != 'template' && b.COUNT==0) {
	                    d = document.createElement('div');
	                    $(d).addClass('temp-element').html(tag);
	                    var pTitle = (b.PARENT.title) ? b.PARENT.title : "Title",
	                        pCaption = (b.PARENT.caption) ? b.PARENT.caption : "You can change this text";
	                    pCaption = pCaption.replace(/\n/g, "<br />");

	                    $(d).find('.data-date').text(b.PARENT.datetime);
	                    $(d).find('.data-category').text(b.PARENT.category);
	                    $(d).find('h5.figure').text(pTitle);
	                    $(d).find('p.figure').html(pCaption);

	                    tag = $(d).html();
	                    $(d).remove();
	                    tmpTag = tag;
	                }
	            }
                // gallery frame add
                tag = appendGalleryFrame($(tag),val.seq);

	            //add style
	            var $style_tag = $('<style type="text/css"></style>');
	            $style_tag.attr('id',"el_"+idx+"css");
	            
	            $style_tag.html(htmlspecialchars_decode(val.elcss));
	            $('.header').before($style_tag);

	            //change carousel id
	            var $tag = $(tag);
	            $.each($tag.find('[data-edit="true"]'), function(i,v) {
	                var source = $(this).outerHTML();
	                source = source.replace(/&lt;&nbsp;/g,"&lt;").replace(/&nbsp;&gt;/g,"&gt;").replace(/data-attr-bookmark/g,'attr-bookmark');
	                $(this).replaceWith(source);
	            });
	            
	            if(typeof total == 'undefined') total = 0;
	            if (val.type == "gallery" && total > view && total > cookie_view) {
	                btn_class = (val.feature=='masonry') ? "gallery-loadmore masonry-layout" : "gallery-loadmore";
	                $tag.find('.'+btn_class).remove();
	                $tag.append('<div class="' + btn_class + '" data-total = "' + total + '" data-id="' + val.seq + '" data-page="' + (Number(cookie_page)+1)+ '" data-view="' + view + '" data-folder="' + val.folder + '" data-mode="' + val.mode + '">LOAD MORE &nbsp;(<span class="display">' + cookie_view + '</span> / ' + total + ')</div>');
	            }

	            msny = (val.feature=='masonry') ? true : false;
	            $tag.addClass('el_' + idx)
	                .attr('data-id', val.seq)
	                .attr('data-el','el_' + idx)
	                .attr('data-pos', idx+1)
	                .attr('data-name', val.elname)
	                .attr('data-msny', msny)
	                .attr('data-type', val.type)
	                .attr('data-width', val.folder)
	                .attr('data-overlap',val.overlap);

	            if(val.type=='forum') $tag.addClass('preloading');
	            if(val.type2) {
					$tag.attr('data-type2', val.type2);
	            }
	          
	            if(b.ONE && val.orgpos==1) {
	                $tag.attr('data-link', val.orgpage);
	            }

				$tag.find('[data-map="true"]').attr('id','map-'+val.seq);
	            $tag.addClass('element');
				var map_url = $tag.find('[data-map="true"]').attr('data-url');
	            if(val.orgpos==1)  $tag.addClass('link-to-'+val.orgpage.replace(/ /g,"-"));
	            $.each($tag.find('[data-edit="true"]'), function(i,v) {
	                $(this).css('z-index','');
	            });
				
	            $('.el-footer').before($tag);

				var settings = (val.elsettings == "" || typeof val.elsettings == "undefined") ? {} : $.parseJSON(val.elsettings);

	            if(val.type == 'sns' && typeof val.type2 != 'undefined' && val.type2 == 'feed') {
	                $tag.find('.data-feed-load-more').attr('data-feed-el',val.elname);
	                $tag.find('.data-feed-load-more').removeAttr('style');
	                $tag.find('.show-posts').removeClass('show-posts');
	                if(typeof settings.sns != 'undefined' &&  (settings.sns.twitter || settings.sns.instagram)) {
	                    updateFeed(val.elname,settings.sns);
	                    loadingElement(val.elname,'loading posts...');
	                }
	            }

	            if(val.type == 'others' && typeof val.type2 != 'undefined' && val.type2 == 'countdown') {
	                var el_dday = $tag.find('[data-dday="true"]'),
	                	cd_date = (el_dday.attr('data-countdown')) ? el_dday.attr('data-countdown') : new Date(),
	                    dateformat  = { days : '%D', hours: '%H', minutes: '%M', seconds: '%S' },
                        dateendformat  = { days : '00', hours: '00', minutes: '00', seconds: '00' };
					
					if( typeof settings.countdown != "undefined" && settings.countdown ) {  //set - block setting date 
                        cd_date = settings.countdown;
	                }
	                if( !el_dday.attr('data-countdown') && typeof countdown == "object" ) { //set - example date
	                    cd_date.setTime(cd_date.getTime() + (35*24*60*60*1000));
	                }
		            cd_date = moment(cd_date).format('YYYY/MM/DD HH:mm:ss');

	                el_dday.find('.date-item').each(function() {
	                    if(typeof $(this).attr('data-format') != 'undefined' && $(this).attr('data-format')) {
	                        dateformat[$(this).attr('data-datetype')] = $(this).attr('data-format');
	                    }
	                    if(typeof $(this).attr('data-finish') != 'undefined' && $(this).attr('data-finish')) {
	                        dateendformat[$(this).attr('data-datetype')] = $(this).attr('data-finish');
	                    }
	                });

	                el_dday.countdown(cd_date, function(event) {
			            if(event.elapsed) {
		                    $tag.find('.date-item[data-datetype="days"]').text(dateendformat['days']);
		                    $tag.find('.date-item[data-datetype="hours"]').text(dateendformat['hours']);
		                    $tag.find('.date-item[data-datetype="minutes"]').text(dateendformat['minutes']);
		                    $tag.find('.date-item[data-datetype="seconds"]').text(dateendformat['seconds']);
		                } else {
		                    $tag.find('.date-item[data-datetype="days"]').text(event.strftime(dateformat['days']));
		                    $tag.find('.date-item[data-datetype="hours"]').text(event.strftime(dateformat['hours']));
		                    $tag.find('.date-item[data-datetype="minutes"]').text(event.strftime(dateformat['minutes']));
		                    $tag.find('.date-item[data-datetype="seconds"]').text(event.strftime(dateformat['seconds']));
		                }
	                });
	            }

				if(typeof settings.bookmark != "undefined" && settings.bookmark) {
					$tag.attr('data-bookmark',val.seq);
				}

	            if(val.type == "gallery") {
	            	var category_onoff = (typeof settings.category_display == "undefined") ?  "OFF" : settings.category_display;
	                $tag.attr('data-category',category_onoff);

	                if(category_onoff == "ON") {
	                	loadGalleryCategoryBlock($tag,val.seq,category_onoff,settings);
	                	if(gallery_empty && !is_gc_cookie) $tag.find('.gallery-category-nav').addClass('empty');
	                }
	            }
	            if(val.type == "forum") {
	            	var view = $tag.find('[data-loop="true"]').attr('data-view');
	                if(typeof view == "undefined") view = 10;
	                if(typeof $.cookie('forum_' + val.seq) != "undefined" && $.cookie('forum_' + val.seq)) {
	                	$.forum.init(val.seq,b.PAGE,view,$.cookie('forum_' + val.seq),$.cookie('forum_'+ val.seq +'_sfl'),$.cookie('forum_'+ val.seq +'_stx'),$.cookie('forum_'+ val.seq +'_scate'));
	                } else 
	                	$.forum.init(val.seq,b.PAGE,view);
	                	
	                $.removeCookie('forum', { path : '/' });
	                $.removeCookie('forum_'+val.seq, { path : '/' });
	                $.removeCookie('forum_'+val.seq+'_sfl', { path : '/' });
	                $.removeCookie('forum_'+val.seq+'_stx', { path : '/' });
	                $.removeCookie('forum_'+val.seq+'_scate', { path : '/' });
	            }

				if(val.type == "video") {
					if (navigator.userAgent.match(/(safari)/gi) !== null) {
						$tag.find("video").each(function() {
							//safari...
							$(this).attr('webkit-playsinline',1);
							$(this).attr('playsinline',1);
						});
					}

					if (navigator.userAgent.match(/(iPod|iPhone|iPad)/gi) !== null) {
						$tag.find("video").each(function() {
							$(this).removeAttr('muted');
							$(this).removeAttr('loop');
							$(this).removeAttr('autoplay');
							$(this).removeAttr('preload');
						});
					}
				}

	            if(b.VIEW) {
	            	var img_onoff = (typeof settings.img_original_display == "undefined") ?  "OFF": settings.img_original_display;
	            	$tag.find('img[data-attach="true"]').attr('data-img-original',img_onoff);
					var c_g_p = (typeof $.cookie('gallery-page-' + b.PARENT.pid) != 'undefined') ? $.cookie('gallery-page-' + b.PARENT.pid) : 1;
			    	$.cookie('gallery',b.PARENT.pid, { path: '/', expires: 12 * 60 * 60 * 1000 });
			    	$.cookie('loadmore-' + b.PARENT.pid, c_g_p, { path: '/', expires: 12 * 60 * 60 * 1000 });
	            }

				if(typeof map_url != 'undefined') {
	                map_style = $tag.find('[data-map="true"]').attr('data-style');
					if(b.VALIDPLAN) {
						loadmap(map_url,'map-'+val.seq, map_style);
					} else {
						$tag.find('.google-map').addClass('disabled-map');
					}
	            }

	            // log 
	            if(typeof settings['google_track'] != "undefined") {
            		$('.dsgn-body').append("<script type='text/javascript' src='//www.googleadservices.com/pagead/conversion_async.js'></script>");
	            }

		        $('.dsgn-body').fitVids();
		        $('.carousel').carousel({
		        	pause: 'none'
		        });

	            //add script
	            if(val.eljs){
	                var js_string = val.eljs;
	                var $script_tag = $('<script type="text/javascript" id="js_' + idx + '"></script>');
	                $script_tag.html(js_string);
	                $('.dsgn-body').append($script_tag);
	            }

	            //add style
	            var jcss = CSSJSON.toJSON(val.elcss),
	            	elpd = style.getPadding(jcss,val.elname);

            	var elFonts = $tag.css('font-family');
        		elFonts = elFonts + ',"Nanum Gothic"';
        		elFonts = elFonts.replace(/"/g, '\'');
        		$tag.css('font-family',elFonts);

	            var pt = parseInt(elpd.top),
	                pb = parseInt(elpd.bottom);
	                
	            if(pt>0||pb>0){
	                default_t_css = default_t_css + '\n 	.'+val.elname + '{';
	                if(Math.ceil(pt*0.8)>0)
	                default_t_css = default_t_css + 'padding-top: '+Math.ceil(pt*0.8) + 'px!important;';
	                if(Math.ceil(pb*0.8)>0)
	                default_t_css = default_t_css + 'padding-bottom: '+Math.ceil(pb*0.8) + 'px!important;';
	                default_t_css = default_t_css + '}';

	                default_m_css = default_m_css + '\n 	.'+val.elname + '{';
	                if(Math.ceil(pt*0.5)>0)
	                default_m_css = default_m_css + 'padding-top: '+Math.ceil(pt*0.5) + 'px!important;';
	                if(Math.ceil(pb*0.5)>0)
	                default_m_css = default_m_css + 'padding-bottom: '+Math.ceil(pb*0.5) + 'px!important;';
	                default_m_css = default_m_css + '}';
	            }
	            if(idx == data.length-1){
	                var css = "@media only screen and (max-width:767px) {" + default_t_css + "\n}\n";
	               	css = css + "@media only screen and (max-width:480px) {" + default_m_css + "\n}";

                    if($('#el-paddingcss').length == 0) $('.dsgn-body').find('#el_'+(data.length-1)+'css').after("<style id='el-paddingcss'>"+css+"</style>");
                    else $('#el-paddingcss').append(css);
	            }

	        });

	        if(b.VIEW) {
		        // prev next
		        $('.data-page-prev').addClass('active');
				$('.data-page-next').addClass('active');

		        if(b.PARENT.prev === null) $('.data-page-prev').removeClass('active');
				if(b.PARENT.next === null) $('.data-page-next').removeClass('active');
	        }

	        if(b.SMENU) {
	        	// var MENULINK = [], MENULIST = [];
			    $.each(b.SMENU, function (idx, obj) {
			    	b.MENULIST.push(obj.name.replace(/ /g,'-'));
			    	if(obj.display=='on') b.MENULINK.push(obj.name.replace(/ /g,'-'));
			        if(obj.children) {
			            $.each(obj.children, function (i, v){
					    	b.MENULIST.push(v.name.replace(/ /g,'-'));
			            	if(v.display=='on') b.MENULINK.push(v.name.replace(/ /g,'-'));
			            });
			        }
			    });
	        }

            var isPage = false;
            $.each(b.MENULIST, function(i,k) {
                isPage = (k.toUpperCase() == b.PAGE.toUpperCase()) ? true : isPage;
            });

            if(!b.ONE && !b.VIEW && !isPage) location.replace(URL);

	        $('.el-footer').show();
	        parallax();
			deferred.resolve();
		    return deferred.promise();
		}

		var elPush = function (prop) {
		    /* prop - reorder list hide */
		    var pageID = b.PAGE.split(","),
		        chgBG = false,
		        tmpTag = '',
		        currentPAGE = '',
		        default_t_css = '', default_m_css = '';

			currentPAGE = (property.COUNT==0 && pageID[1] && pageID[0]!="forum") ? "index,template" : b.PAGE;
			param = (currentPAGE=="index,template" && param.indexOf("/org/") == -1) ? param + '/org/' + b.PAGE : param;

	        if(pageID[0] == "forum" && b.VIEW && property.COUNT==0) {
		    	clearDsgnbody();
		    	var ps_fmview = $.forum.view(b.VIEW);
		    	ps_fmview.then(function() {
		    		_this.displayComment(b.VIEW);
		    		$('.el-footer').show();
		    	});
			    return false;
	        }

	        // console.log(b.pageContent.hasOwnProperty(currentPAGE));
	        // console.log(b.pageContent);
	        if(b.pageContent.hasOwnProperty(currentPAGE)) {
	        	var loadingContents = loadPush(b.pageContent[currentPAGE]);

	        } else {
				$.ajax({
	                url: '/template/contents/sid/' + b.SID + '/page/' + encodeURIComponent(currentPAGE) + param,
			        dataType: 'json',
	                type: 'GET',
	                async: false,
	                success: function(data) {
				    	if(typeof data.error != "undefined" || data.error) {
				    		if(currentPAGE!='index,template') {
					    		alert($.lang[LANG]['page.not.found']);
					    		location.replace('/');
				    		}
				    	}
				    	b.pageContent[currentPAGE] = data;
				    	var loadingContents = loadPush(data);
	                }
				});
	        }
		}

		var scrollspy = function() {
		    if(!b.ONE) return false;
		    var top = 0,
		        active = '';

		    top = ($('.dsgn-body').hasClass('sidebar')) ? 0 : $('.header.el-menu').height();

		    $.each(b.MENULINK,function(i,v) {
		        var $el = $('.link-to-'+v);

		        if($el.length>0) {
		            var offset = $el.offset();
		            if((Math.floor(offset.top) - $(document).scrollTop())<=top) active = v;
		        }

		    });

			if(!$('#tpl-menu li a[href="#'+active+'"]').parent().hasClass('active')) {
				$('#tpl-menu li').removeClass('active').removeClass('open');

				$('#tpl-menu li a[href="#'+active+'"]').parent().addClass('active');
				if( $('#tpl-menu li a[href="#'+active+'"]').closest('.dropdown-menu').length>0 ) {
					if($('body').width() > 768) $('#tpl-menu li a[href="#'+active+'"]').closest('.dropdown').addClass('active');
					else $('#tpl-menu li a[href="#'+active+'"]').closest('.dropdown').addClass('open');
				}
			}

		    if($(document).scrollTop() + $('body').height() == $('body').prop('scrollHeight')) {
		        var last = b.MENULINK[b.MENULINK.length-1],
		            $el = $('.link-to-'+last);

		        if($el.length>0) {
		            if($el.offset().top>top) {
		                $('#tpl-menu li').removeClass('active').removeClass('open');

		                $('#tpl-menu li a[href="#'+last+'"]').parent().addClass('active');
						if($('#tpl-menu li a[href="#'+last+'"]').closest('.dropdown-menu').length>0) {
							if($('body').width() > 768) $('#tpl-menu li a[href="#'+last+'"]').closest('.dropdown').addClass('active');
							else $('#tpl-menu li a[href="#'+last+'"]').closest('.dropdown').addClass('open');
						}
		            }
		        }
		    }

		}

		var fixedMenu = function() {
		    header_fixed = $('.header.el-menu').height();

		    var user_menu = $('.el-menu'),
				menu_color = $('header.navbar').css('background-color'),
				menu_bg_img = (typeof $('header.navbar').css('background-image') != 'undefined') ? $('header.navbar').css('background-image') : 'none',
				menu_bg_position = (typeof $('header.navbar').css('background-position') != 'undefined') ? $('header.navbar').css('background-position') : 'center center',
				menu_bg_repeat = (typeof $('header.navbar').css('background-repeat') != 'undefined') ? $('header.navbar').css('background-repeat') : 'no-repeat',
				menu_bg_size = (typeof $('header.navbar').css('background-size') != 'undefined') ? $('header.navbar').css('background-size') : 'cover';

		    if($(document).scrollTop() > header_fixed && user_menu.hasClass('fixed')==false && !$('.dsgn-body').hasClass('sidebar')) {
		        user_menu.fadeOut('fast', function() {
		            $(this).addClass('fixed').fadeIn('fast');
		            $('.fixed').addClass('fixed-position');
		            if(!b.HEADER || $('header.navbar').hasClass('sidebar') ) {
	                	var topval = ($('.creatorlink-header').length==1) ? '55px' : '0';
		            	$('.el_0').css('margin-top',topval);
		                var $header_empty = $('<div class="header-empty"></div>');
		                if($(".header-empty").length==0) {
		                	var topval = ($('.creatorlink-header').length==1) ? '55px' : '0';
			                $header_empty.css({
			                    'background-color' : $('header.navbar').css('background-color'),
								'background-image' : menu_bg_img,
								'background-position' : menu_bg_position,
								'background-repeat' : menu_bg_repeat,
								'background-size' : menu_bg_size,
			                    //'position' : 'relative',
			                    'width' : '100%',
			                    'height' : header_fixed+'px',
			                    'top' : topval,
			                    'z-index' : '1'
			                });
			                $('.dsgn-body').prepend($header_empty);
			            }
       		        	$(".header-empty").css('position','relative');
		            } else {
		            	$('header.navbar').removeClass('transparent');
		            }
		            if($('body').width() > 768) $('.menu-logo-top').hide();
		        });        
		    } else if($(document).scrollTop() < header_fixed && user_menu.hasClass('fixed') && !$('.dsgn-body').hasClass('sidebar')){
		        user_menu.fadeOut('fast', function(){
			        $('.header-empty').css('position','absolute');
		            $('.fixed').addClass('fixed-position');
		            user_menu.removeClass('fixed').fadeIn('fast');
		            if(!b.HEADER  || $('header.navbar').hasClass('sidebar') ) {
		            	$('.el_0').css('top','0');
		            } else {
		            	$('header.navbar').addClass('transparent');
		            	if($('.creatorlink-header').length == 1) $('div.header.fixed-position').addClass('top-zero');
		            }
		            $('.menu-logo-top').show();
		        });
		    }

	        if(window.innerWidth > 768) {
				// menu sidebar - height overflow
				if($('.el-menu header').hasClass('sidebar')) {
					var menu_offset_top = ($('.el-menu header.navbar #tpl-menu').offset().top - $('header').offset().top) - 15,
						sidebar_menu = $('.el-menu header.navbar #tpl-menu').innerHeight(),
						sidebar_menu_last = $('.el-menu header.navbar #tpl-menu > li').eq( $('.el-menu header.navbar #tpl-menu > li').length-1 ),
						sidebar_menu_list_padding = (sidebar_menu_last.find('.dropdown-menu').length > 0) ? sidebar_menu_last.find('.dropdown-menu').innerHeight() + 30 : 60,
						submenu_max_height = 0;

					$('.el-menu header.navbar #tpl-menu > li > .dropdown-menu').each(function() {
						if($(this).innerHeight() > submenu_max_height) submenu_max_height = $(this).innerHeight();
					});

					var sidebar_menu_list_height = (submenu_max_height > 0) ? (menu_offset_top + sidebar_menu + submenu_max_height) + 'px' : 'auto',
                    	sidebar_menu_list_max_height = window.innerHeight - menu_offset_top;

					$('.el-menu header.navbar #tpl-menu').closest('.collapse').css({
						'padding-bottom': sidebar_menu_list_padding + 'px',
						'height': sidebar_menu_list_height,
						'max-height': sidebar_menu_list_max_height + 'px'
					});
				}
			}
		}

		var elFooter = function() {
			
			if($('.el-footer').length) return false;
			if(b.FTAG == '') b.FTAG = '<div class="footer-' + b.SID + '"></div>';
		    $footer = $(b.FTAG);
		    $footer.find('.link-site-home').prop('href',URL);
		    $footer.addClass('element')
		           .addClass('el-footer')
		           .attr('data-type','footer')
		           .attr('data-el','el-footer')
		           .attr('data-id','footer')
		           .attr('data-name','footer-' + b.SID);

		    $footer.appendTo($('.dsgn-body'));
		    $('.dsgn-body').prepend("<style id='el-footercss'>" + b.FCSS + "</style>");


			/*180822 add*/
			// before v1 creatorlink-box remove
			if($('.el-footer').find('.creatorlink-box').length > 0 ) {
				if($('.el-footer').find('.creatorlink-box').prev().hasClass('col-md-10')) $('.el-footer').find('.creatorlink-box').prev().removeClass('col-md-10').addClass('col-md-12');
				$('.el-footer').find('.creatorlink-box').remove();
			}
			// before v2 creatorlink-footer remove
			if( $('.el-footer').find('.creatorlink-footer').length > 0) {
				$('.el-footer').find('.creatorlink-footer').remove();
			}

			// made it with Creatorlink
			if(!b.VALIDPLAN || b.VALIDTYPE == 'PK' || b.VALIDTYPE == 'FR') {
				$('.goto-top').addClass('moved');
				var templates = ["WINTONI","ILIENSIS","JAVAN","ACINONYX","OCHOTONA","TAYRA","FENNEC","BELUGA","ITATSI","PENNANTII","LUSCINIUS","KIDOGO","ROUREI","GRAYSONI","PAGENSIS","LILLIAE","INSCINIUS","DIAZI","GERPI","LUTREOLA","WALIE","GAMBIERI","SAOLA","WALDENI","INDRI","JEFFERYI"];
				var t = templates.map(function(v) { return v.toLowerCase(); });
				if(t.indexOf(b.SID) < 0) 
					setMadeWithCreatorlink();
			}

			/*180822  delete - powered by Creatorlink
			// before creatorlink-box remove
			if($('.el-footer').find('.creatorlink-box').length > 0 ) { 
				if($('.el-footer').find('.creatorlink-box').prev().hasClass('col-md-10')) $('.el-footer').find('.creatorlink-box').prev().removeClass('col-md-10').addClass('col-md-12');
				$('.el-footer').find('.creatorlink-box').remove();
			}

			if($('.el-footer').find('*[data-edit="true"]').first().closest('.row').children('div').length == 1 &&
				$('.el-footer').find('*[data-edit="true"]').first().closest('.row').children('div').hasClass('col-md-10') ) {
				$('.el-footer').find('*[data-edit="true"]').first().closest('.row').children('div').removeClass('col-md-10').addClass('col-md-12');
			}

			if(typeof b.VALIDPLAN != "undefined" && b.VALIDPLAN && b.VALIDTYPE != 'PK') {
				if( $('.el-footer').find('.creatorlink-footer').length > 0 ) $('.el-footer').find('.creatorlink-footer').remove();
			} else {
				var el_f_style = $('.el-footer').attr('style');
				if(typeof el_f_style != 'undefined' && 
					(el_f_style.indexOf('display') > -1 || el_f_style.indexOf('opacity') > -1 || el_f_style.indexOf('z-index') > -1) ) $('.el-footer').removeAttr('style');
				if($('.el-footer').css('display') == 'none') $('.el-footer').css('display','block');
				if($('.el-footer').css('opacity') < 1) $('.el-footer').css('opacity',1);
				if($('.el-footer').css('z-index') != 'auto') $('.el-footer').css('opacity','auto');

				if( $('.el-footer').find('.creatorlink-footer').length == 0) setFooterCretorlinkBox();
				setFooterLink();
			}
			*/

		    if(!b.FTAG || b.FOOTER) {
		        $footer.hide();
		    }
		}

		var reloadMasonry = function(container,items) {
			$('.gallery-loading-status').remove();
		    container.masonry().append(items);
		    container.masonry('appended',items).masonry();
		}		

		function setDefaultValue(value) {
			return (typeof value == "undefined") ? "" : value;
		}

		function setDefaultValueEtc(type, el) {
			type = (typeof el.attr('data-contact-etc-type') != "undefined" && el.attr('data-contact-etc-type') ) ? el.attr('data-contact-etc-type') : type;
            
            var input_type = ["text","email","number","tel","url"];
            if($.inArray(type,input_type)) {
				return (typeof el.val() == "undefined") ? "" : el.val();
			} else if(type == "checkbox") {
				return ( el.prop('checked') ) ? 'O' : 'X';
			} else if(type == "radio") {
				return el.find('input:radio:checked').val();
			} else if(type == "selectbox") {
				var result = (el.find('option').length > 0 ) ? el.find('option:checked').val() : el.find('.active').find('.opval').text();
				return result;
			} else {
				return 'etc article';
			}
		}

		function setDefaultForm(el) {
			$(el + ' [form-idx]').val('');
			$(el + ' [form-idx]').find('.form-date').val('');
			$(el).find('input:checkbox').removeAttr('checked');
			$(el).find('input:radio').removeAttr('checked');
		}

		function setDefaultContactForm(el) {
			$(el + ' [data-contact-firstname]').val('');
			$(el + ' [data-contact-lastname]').val('');
			$(el + ' [data-contact-email]').val('');
			$(el + ' [data-contact-website]').val('');
			$(el + ' [data-contact-phone]').val('');
			$(el + ' [data-contact-subject]').val('');
			$(el + ' [data-contact-message]').val('');
			$(el).find('input:checkbox').removeAttr('checked');
			$(el).find('input:radio').removeAttr('checked');
		}

		function setDefaultContactFormEtc(el) {
			$(el).find('[data-contact-etc]').each(function(i) {
				var type = (typeof $(this).attr('data-contact-etc-type') != "undefined" && $(this).attr('data-contact-etc-type') ) ? $(this).attr('data-contact-etc-type') : $(this).attr('type');
				
				var input_type = ["text","email","number","tel","url"];
				if($.inArray(type,input_type)) {
					$(this).val('');
				} else if(type == "checkbox") {
					$(this).removeAttr('checked');
				} else if(type == "radio") {
					$(this).find('input:radio').first().click();
				} else if(type == "selectbox") {
					if($(this).find('option').length > 0) {
						$(this).find('option:first').attr('selected','selected');
					} else {
						$(this).find('.active').removeClass('active');
						$(this).find('li').first().addClass('active');
					}
				}
			});
		}

		var ieLineClamp = function() {
		    if(isIE()) {
		        $('[data-ie-clamp]').each(function(index, element) {
		            var clamp = $(this).attr('data-ie-clamp').split(','),
		                line = new Array();

		            $.each(clamp,function(k,v) {
		                line.push(v);
		            });

		            for(i=line.length; i<3; i++) line[i] = 0;
		            var idx = getScreenIndex();
		            var apply = line[idx];

		            // console.log($(element).text());
		            //safeClamp(element, apply);
		            $clamp(element, {clamp:apply, useNativeClamp:false });
		        });
		    }
		}

		var safeClamp = function (selector, lines) {
			lines = lines || 3; // a default
			$(selector).each( function() {
				if($(this).text()) {
					$clamp( this, { clamp: lines, useNativeClamp:false  });
				}
			});
		}

		$('.data-page-back').live({
		    click : function() {
				var pPage = b.PARENT.page,
					inMenu = ($.inArray(pPage,b.MENULIST) == -1) ? false : true;

				if(!inMenu) {
					$(this).showModalFlat('INFORMATION','이동할 수 없습니다',true,false,'','ok');
					return false;
				} else {
					var c_g_p = (typeof $.cookie('gallery-page-' + b.PARENT.pid) != 'undefined') ? $.cookie('gallery-page-' + b.PARENT.pid) : 1;
			    	$.cookie('gallery',b.PARENT.pid, { path: '/', expires: 12 * 60 * 60 * 1000 });
			    	$.cookie('loadmore-' + b.PARENT.pid, c_g_p, { path: '/', expires: 12 * 60 * 60 * 1000 });
			    	
			    	var url_replace = (b.URL == "/") ? "" : b.URL;
			    	if(b.ONE) {
			    		_this.history.pushState(null,b.TITLE,url_replace + '/index#' + b.PARENT.page);
			    	} else {
			    		var page = b.PAGE.split(",");
			    		if(page[1]=='template') {
				    		_this.history.pushState(null,b.TITLE,url_replace + '/' + page[0]);
			    		} else {
				    		_this.history.pushState(null,b.TITLE,url_replace + '/' + b.PARENT.page);
			    		}		    		
			    	}
			    }
		    }
		});

	    $('#config-mode-view').click(function() {
	    	location.href = "//" + b.HOST + b.REFERER;
	    });

		$('body').on('click','.mini-home, #goto-top', function(event) { 
			event.preventDefault();	
			$('body,html').animate({scrollTop: 0}, 900,'easeInOutQuart'); 
		});	

		$('.data-page-prev').live({
		    click : function(e) {
		    	if(!$(this).hasClass('active') || b.PARENT.prev === null) return false;
		    	if(typeof b.PARENT.page == 'string' && $.inArray(b.PARENT.page,b.MENULIST) == -1) return false;
		        var page = b.PAGE.split(",");
		    	var url_replace = (b.URL == "/") ? "" : b.URL;
		    	_this.history.pushState(null,b.TITLE,url_replace + '/' + page[0] + '/view/' + b.PARENT.prev);
		    }
		});

		$('.data-page-next').live({
		    click : function() {
		    	if(!$(this).hasClass('active') || b.PARENT.next === null) return false;
		    	if(typeof b.PARENT.page == 'string' && $.inArray(b.PARENT.page,b.MENULIST) == -1) return false;
		        var page = b.PAGE.split(",");
		    	var url_replace = (b.URL == "/") ? "" : b.URL;
		    	_this.history.pushState(null,b.TITLE,url_replace + '/' + page[0] + '/view/' + b.PARENT.next);
		    }
		});

		$("#tpl-menu.nav > li:not(.siteUM, siteCM, .siteLANG) a, a#site-home").live({
		    click : function(e) {
				if(e.target.className.indexOf('fa') > -1 && $(this).closest('header').hasClass('navbar-simple')) { return false; }
				if(typeof $(this).attr('data-toggle') != 'undefined') { return false; }
		    	e.preventDefault();

		    	if($('body').width() < 769) {
		    		if(typeof $(this).attr('id') == 'undefined') $('.navbar-toggle').click();
		    	}
		    	var loc = $(this).attr('href'),
		    		uri = (b.PUBLISH) ? loc : loc.replace('/render/',''),
		    		blank = $(this).attr('target'),
		    		bookmark = $(this).attr('attr-bookmark');

		    	if(typeof bookmark !='undefined' && bookmark) return false;
		    	if(typeof blank != 'undefined' && (blank == '_blank' || blank == 'blank')) {
		    		window.open(loc);
		    		e.stopPropagation();
		    		return false;
		    	}

		    	if(b.ONE!='1') {

			    	if(loc == 'javascript:;') return false;

			    	if(uri == "/render" || uri == "/") {
			    		uri = b.MENULINK[0];
			    		$('body,html').animate({scrollTop: 0}, 900,'easeInOutQuart'); 
			    	}

			    	if(loc.match(/\@/g) === null && loc.match(/\//g) === null) {
			    		window.location.href = loc;
			    		return false;
			    	}

			    	var url = new getLocation(loc);
				    golink(_this,url);
		    		// _this.history.pushState(null,b.TITLE,(b.PUBLISH) ? "/" + uri : "/render/" + uri);
		    	} else {
			    	if(loc == 'javascript:;') {
			    		loc = '#';
			    	}

			    	var hash = '';
					if(_this.b.PUBLISH) {
						if(loc.indexOf('/index/view/') > -1 && b.ONE) ;
						else loc = loc.replace('/index','');
					} else {
						if(loc.indexOf('/index/view/') > -1 && b.ONE) ;
						else loc = loc.replace('/render/index','');
					}
					hash = loc;

			    	var fstr = loc.charAt(0);
			    	switch(fstr) {
			    		case "#":
			    			if(_this.b.PAGE == 'index') {
					    		if($(this).hasClass('mini-home')) {
					    			$('body,html').animate({scrollTop: 0}, 900,'easeInOutQuart'); 
					    			history.pushState('', '', hash);
					    			return false;
					    		}
			    				var urlType = (b.PUBLISH) ? '/index' : '/render';
								_this.history.pushState(null,b.TITLE,urlType + hash);
			    			} else {
				    			loc = (_this.b.PUBLISH) ? '/index' : '/render/index';
								_this.history.pushState(null,b.TITLE,loc);
								history.pushState('', '', loc + hash);
			    			}
			    			break;
			    		case "@":

			    			break;
			    		case "/":
			    			if(loc == '/render' || loc == '/') {
			    				loc = (_this.b.PUBLISH) ? '/index' : '/render/index';	
				    			$('body,html').animate({scrollTop: 0}, 900,'easeInOutQuart'); 
			    			}
			    			
					    	var url = new getLocation(loc);
					    	golink(_this,url);
			    			break;
			    		default:
					    	// var url = new getLocation(loc);
					    	// golink(_this,url);
					    	window.location.href = loc;
			    			break;
			    	}
	
			    	// window.location.href = loc;
		    	}
		    }
		});

		$('[data-type="gallery"] [data-loop="true"] > .grid').live({
			touchstart: function() {
				galleryStartHover();
			},
			touchend: function() {
				galleryCloseHover();
			},
			click: function() {
				galleryMovelink();
			}
		});

		$('.gallery-item a').live({
			click : function(e) {
		    	e.preventDefault();
				var loc = $(this).attr('href'),
					mode = $(this).attr('data-gallery'),
					menu_link = $(this).attr('data-user-link'),
					bookmark = $(this).attr('attr-bookmark'),
					blank = $(this).attr('target'),
					user_link = $(this).attr('attr-link');


				if( (typeof mode!='undefined' && mode.length>0) ||
					(typeof menu_link!='undefined' && menu_link.length>0) ||
					// (typeof user_link!='undefined' && user_link.length>0) ||
					(typeof bookmark!='undefined' && bookmark.length>0) 
				) return;

				if(typeof blank!='undefined' && blank.length) {
					var url = (typeof user_link != 'undefined' && user_link.match("^(tel:|mailto:|sms:)") === null) ? makeLinkUrl(user_link, b.ONE, b.VIEW) : loc;
					var openNewWindow = window.open(url);
				} else {
					if(typeof user_link != 'undefined' && user_link.match("^(tel:|mailto:|sms:)") !== null) {
						location.href=loc;
					} else {
						var url = new getLocation(loc);
						golink(_this,url);
					}
		    	}

		    	// 	uri = (b.PUBLISH) ? loc : loc.replace('/render/',''),
		    	// 	attr = $(this).attr('attr-link');

		    	// if(typeof attr!='undefined' && attr) return;
	    		// _this.history.pushState(null,b.TITLE,(b.PUBLISH) ? "/" : "/render/" + uri);
			}
		});


		$(".navbar-simple .nav li a .fa").live('click', function(e) {
			if($(this).closest('header').hasClass('navbar-simple')) {
				$(this).closest('a').next('ul.dropdown-menu').slideToggle(200).closest('li').toggleClass('open').siblings().removeClass('open').find('ul.dropdown-menu').slideUp(200);
				e.preventDefault();
				return false;
			} 
		});

		$(".nav li a[href*=#]").live({
		    click : function(e) {
				if(e.target.className.indexOf('fa') > -1 && $(this).closest('header').hasClass('navbar-simple')) {
					e.preventDefault();
					return false;
				}

		        var link = $(this).attr('href').replace("#","");
		        if(link.substring(0,1) == '/') link = link.substring(1,link.length);
		        if(b.MENULINK.indexOf(link) > -1) {
		            if($('.dsgn-body').width()<769) {
		                $('.el-menu .navbar-toggle').click();
		                setTimeout(function() {
		                    moveLinkPage(link);
		                },250);
		            } else moveLinkPage(link);
		        }
		    }
		});

		// menu sidebar - height overflow
		if($('body').width() > 768) {
			$(".sidebar .nav li.dropdown").live({
				mouseenter: function(e) {
					$(this).closest('#tpl-menu').parent().css({
						'margin-right' : '-260px',
						'padding-right' : '260px',
					});
				},
				mouseleave: function(e) {
					$(this).closest('#tpl-menu').parent().css({
						'margin-right' : '',
						'padding-right' : '',
					});
				}
			});
		}

		$('body').on('touchstart.dropdown.data-api, click','header .siteUM-dmenu-wrap, header .siteLANG-dmenu-wrap', function(e) {
			if(e.target.className.indexOf('siteUM-dmenu-wrap') > -1 || e.target.className.indexOf('siteLANG-dmenu-wrap') > -1) {
				if($(this).hasClass('open')) $(this).removeClass('open');
			} 
		});
		$('body').on('touchstart.dropdown.data-api, click', 'header.navbar-simple .navbar-collapse.in', function(e) {
			if(e.target.className.indexOf('navbar-collapse') > -1) {
				$('.navbar-toggle').click();
			}
		});

		$("a[href*=#][attr-link]").live({
		    click : function(e) {
				if(e.target.className.indexOf('fa') > -1 && $(this).closest('header').hasClass('navbar-simple')) {
					e.preventDefault();
					return false;
				}
				$.removeCookie('gallery', { path: '/' });
				$.removeCookie('gallery-item', { path : '/' });
				$.removeCookie('forum', { path : '/' });
				$.removeCookie('forum-item', { path : '/' });

		        if($(this).attr('target') != '_blank') {
			        var link = $(this).attr('href').replace("#","");
			        if(b.MENULINK.indexOf(link) > -1) {
			            if($('.dsgn-body').width()<769) {
			                $('.el-menu .navbar-toggle').click();
			                setTimeout(function() {
			                    moveLinkPage(link);
			                },250);
			            } else moveLinkPage(link);
			        } else if($('.' + link).length) {
			        	moveLinkPage(link,1200,true);
			        }
		    	}
		    }
		});

		$('.gallery-category-nav li a').live({
		    click: function() {
		    	if($(this).closest('.gallery-category-nav').hasClass('empty')) {
		    		$(this).blur();
		    		return false;
		    	}

		        if($(this).closest('li').hasClass('active')) return;

		        var d = new Date(),
		            now = d.getTime(),
		            idx = $(this).attr('data-idx'),
		            sfl = 'category',
		            stx = (idx != '0') ? $(this).text().trim() : '',
		            pid = $(this).closest('.element[data-type="gallery"]').attr('data-id');

		        $('.element[data-id="'+pid+'"] .gallery-category-nav li').removeClass('active');
		        $('.element[data-id="'+pid+'"] .gallery-category-nav li').eq(idx).addClass('active');

		        $('#el-empty').empty();
		        
	            var val = _this.galleryEL[pid],
	                tag = htmlspecialchars_decode(val.eltag,'ENT_QUOTES');

                $('#el-empty').append($(tag));
                $('#el-empty').find('[data-loop="true"]').html('');

                var nodes = $(tag).find('[data-loop="true"]').children(),
                    p = $('#el-empty').children(),
                    i = [],
                    view = $(tag).find('[data-loop="true"]').data('view'),
                    total = 0,
                    display = 0;

                if(typeof view == "undefined") view = 10;
	            var cookie_page = 1,
	                cookie_view = view,
	                cookie_gallery_category = (typeof escape(stx) != 'undefined') ? escape(stx) : '',
	                is_gc_cookie = (typeof $.cookie('gallery-category-'+val.seq) != 'undefined' && $.cookie('gallery-category-'+val.seq).length > 0) ? true : false;

	            $.cookie('gallery',val.seq, { path: '/', expires: 12 * 60 * 60 * 1000 });
	            $.cookie('loadmore-' + val.seq, cookie_page, { path: '/', expires: 12 * 60 * 60 * 1000 });
	            $.cookie('gallery-page-' + val.seq, cookie_page, { path : '/', expires: 12 * 60 * 60 * 1000 });
	            $.cookie('gallery-category-' + val.seq, cookie_gallery_category, { path : '/', expires: 12 * 60 * 60 * 1000 });

                $.ajax({
                    url: '/template/gallery/list/pid/' + val.seq + '/sid/' + b.SID + '/spage/' + b.PAGE + '/mode/design/view/' + cookie_view  + param,
                    data: { sfl: sfl, stx: stx },
                    dataType: 'json',
                    type: 'POST',
                    async: false,
                    cache: false,
                    success: function (data) {
                        $.each(data.list, function (idx, value) {
                            i.push(value);
                        });

                        total = (typeof data.total.list_total != "undefined") ? data.total.list_total : data.total ;
                        display = data.list.length;

                        if ( i.length>0 || (i.length==0 && is_gc_cookie) ) {
                            var loop_count = nodes.length, item_index = 0;
                            var elem = [];
                            $.each(i,function(index,v) {
                                loop_pos = index%loop_count;
                                c = nodes[loop_pos];

                                v.title = (v.title.length>0) ? v.title : 'Title';
                                v.caption = (v.caption.length>0) ? v.caption : 'You can change this text';
                                $(c).addClass('gallery-item').attr('data-index',index).attr('data-seq',v.seq);

                                var vgsettings = (typeof v.gsettings != 'undefined' && v.gsettings) ? $.parseJSON(v.gsettings) : {},
							        img_path = (typeof vgsettings['storage'] != 'undefined') ? vgsettings['storage'] : _this.b.RESOURCE + "/" + _this.b.SID + "/",
							        img_original = (typeof vgsettings['storage'] != 'undefined') ? img_path + '1920/' : img_path;

								var folder = (val.folder == 0) ? "" : val.folder + "/";
								$(c).find('img').attr("src", img_path + folder + v.image);
								
								var glink = (typeof vgsettings['glink'] != 'undefined' && vgsettings['glink']) ? vgsettings['glink'] : '',
									glink_target = (typeof vgsettings['glink_target'] != 'undefined' && vgsettings['glink_target']) ? vgsettings['glink_target'] : '';

								if(glink) {
									if(glink.match(/^\@/g) !== null) {														// link-type: link-bookmark ==> a[attr-bookmark]
										var bookmark_seq = glink.replace(/^\@/g,'');
										if(typeof _this.b.SETTINGS.blockBookmarkList == 'undefined' || typeof _this.b.SETTINGS.blockBookmarkList['bookmark' + bookmark_seq] == 'undefined') {
											glink = '';
											glink_target = '';
										}
									} else if(_this.b.MENULIST.indexOf(glink.replace(/^\//g,"").replace(/ /g,"-")) > -1) {  // link-type: link-menu     ==> a[data-user-link]
									} else {                                                                                // link-type: link-out      ==> a[attr-link]
										if(checkBase64Encode(glink)) glink = Base64.decode(glink);
									}
								}

                                if(glink) {
									var glink_val = makeLinkUrl(glink, b.ONE, b.VIEW);

								    $(c).find('a').removeAttr('data-gallery').removeAttr('data-user-link').removeAttr('attr-bookmark').removeAttr('attr-link');
								    $(c).find('a').attr('href',glink_val);

								    if(_this.b.MENULIST.indexOf(glink.replace(/ /g,'-'))>-1) {
								        $(c).find('a').attr('data-user-link',glink_val);
								    } else if(glink.match(/^\@/g)) {
								        $(c).find('a').attr('attr-bookmark',glink.replace(/^\@/g,''));
								    } else {
								        $(c).find('a').attr('attr-link',glink);
								    }
                                } else {
		                            $(c).find('a').removeAttr('data-user-link').removeAttr('attr-bookmark').removeAttr('attr-link');

	                                if (val.mode == "gallery") {
	                                    $(c).find('a').attr("href", img_original + v.image);
	                                    $(c).find('a').attr('data-gallery', '#gframe-' + val.seq);

	                                    var elsettings = (val.elsettings == "") ? {} : $.parseJSON(val.elsettings),
					                    	img_onoff = (typeof elsettings.img_original_display == "undefined") ?  "OFF": elsettings.img_original_display;
	                                    $(c).find('a').attr('data-img-original',img_onoff);
	                                } else {
		                                $(c).find('a').attr("href", ((b.URL=="/") ? "" : b.URL) + "/" + b.PAGE + "/view/" + v.seq);
	                                    $(c).find('a').removeAttr('data-gallery');
	                                }
	                            }

								if(glink_target == '_blank') $(c).find('a').attr('target','_blank');
								else $(c).find('a').removeAttr('target');

                                $(c).find('a').attr("data-title", v.title).attr('title',v.title);

                                // caption
                                var ftitle = $(c).find('h5.figure'),
                                    fcaption = $(c).find('p.figure'),
                                    fdatetime = $(c).find('.figure.datetime'),
                                    fhashtag = $(c).find('.figure.hashtag');

                                // datetime / hashtag
                                if(fdatetime.length<1) {
                                    $(c).find('figcaption').append("<div class='figure datetime hide'></div>");
                                    fdatetime = $(c).find('.figure.datetime');
                                }
                                if(fhashtag.length<1) {
                                    $(c).find('figcaption').append("<div class='figure hashtag hide'></div>");
                                    fhashtag = $(c).find('.figure.hashtag');
                                }

                                $(c).find('figcaption').removeClass('hide');
                                if (v.title || v.caption) {
                                    ftitle.html(v.title);
                                    var gallery_caption = v.caption;
                                    gallery_caption = gallery_caption.replace(/\n/g, "<br />");
                                    fcaption.html(gallery_caption);
                                    fcaption.removeClass('hide');
                                    fdatetime.text(v.datetime);
                                    fhashtag.text(v.hashtag);
                                }
                                $(p).find('[data-loop="true"]').append($(c)[0].outerHTML);
                            });
                        } else {
                        	if(idx == '0') {
	                            nodes.find('a')
	                                .addClass('emptyGalleryItem')
	                                .attr('href', "/config/page/" + b.PAGE + "/view/template")
	                                .removeAttr('data-gallery')
									.removeAttr('data-user-link')
									.removeAttr('attr-bookmark')
									.removeAttr('attr-link')
	                                .find('img')
	                                .attr('data-index',0);
	                            $(p).find('[data-loop="true"]').append(nodes);
                        	}
                        }

                        tag = $(p)[0].outerHTML;
                        if (val.mode == "gallery" && total) tag = appendGalleryFrame($(tag),val.seq,val.elsettings);
                        $('#el-empty').empty();
                    }
                });

                var $tag = $(tag);
                $.each($tag.find('[data-edit="true"]'), function() {
                    var source = $(this).html();
                    source = source.replace(/&lt;&nbsp;/g,"&lt;").replace(/&nbsp;&gt;/g,"&gt;");
                    $(this).html(source);
                });

                if(val.feature=='masonry') {
                    var $container = $('.element[data-id="' + pid + '"] .container'),
                        $gallery_items = $tag.find('[data-loop="true"]');

                    $container.html('');
                    $('.element[data-id="' + pid + '"] [data-loop="true"]').before("<div class='gallery-loading-status'><div class='loading-dots'></div></div>");

                    var process_index = 0,
	                last_view = (view > total) ? total : view; 
                    $gallery_items.imagesLoaded().progress(function(imgload, image) {
                        process_index++;
                        if(total>0 && last_view==process_index) {
                        	reloadMasonry($container,$gallery_items);
                        }
                    });
                } else {
                    $('.element[data-id="'+val.seq+'"] [data-loop="true"]').replaceWith($tag.find('[data-loop="true"]'));
                }

                if(total == 0 ) {
	                if(val.feature=='masonry') { 
	                    $('.element[data-id="'+val.seq+'"]').find('.container').removeAttr('style');
	                } else {
	                    $('.element[data-id="'+val.seq+'"]').find('[data-loop="true"]').addClass('empty').empty();
	                }
                    $('.element[data-id="'+val.seq+'"]').find('.gallery-loadmore').remove();
                } else if ( total == view || view > display ) {
                    $('.element[data-id="'+val.seq+'"]').find('.gallery-loadmore').remove();
                } else {
	                var btn_class = (val.feature=='masonry') ? "gallery-loadmore masonry-layout" : "gallery-loadmore",
	                    btn_tag = '<div class="' + btn_class + '" data-total = "' + total + '" data-id="' + val.seq + '" data-page="2" data-view="' + view + '" data-folder="' + val.folder + '" data-mode="' + val.mode + '">LOAD MORE &nbsp;(<span class="display">' + cookie_view + '</span> / ' + total + ')</div>';

	                if($('.element[data-id="'+val.seq+'"] .gallery-loadmore').length > 0) $('.element[data-id="'+val.seq+'"] .gallery-loadmore').replaceWith(btn_tag);
	                else $('.element[data-id="'+val.seq+'"]').append(btn_tag);
                }

                if($('.element[data-id="'+val.seq+'"]').find('*[data-direffect="true"]').length > 0 ) {
                    setTimeout(function() {
                        $('.element[data-id="'+val.seq+'"]').find('.grid').each(function() {
                            $(this).hoverdir();
                        });
                    }, 400);
                }
		    }
		});

		$('header.navbar-simple .navbar-toggle').live('click',function(e) {
			var check = $(this).hasClass('collapsed') ? false : true;

			if(check) {
				var p_t = $('.el-menu header').height() + 'px';

				$('.element').each(function(){ $(this).addClass('blur-filter'); });
				$('.el-menu').addClass('blur-filter');

				if($('body').height() > ($('.el-menu').find('#tpl-menu').height() + 80)) $('.el-menu').find('#tpl-menu').addClass('center-position');
				else $('.el-menu').find('#tpl-menu').removeClass('center-position');
				
				$('.dsgn-body').bind('touchmove');
				$('#goto-top').hide();
			} else {
				$('.element').each(function(){ $(this).removeClass('blur-filter'); });
				$('.el-menu').removeClass('blur-filter');
		        $('.dsgn-body').unbind('touchmove');
				$('#goto-top').show();
			}
		});

		$('#tpl-menu > li:not(.siteUM, .siteCM, .siteLANG) a').live({
			click : function(e) {
				$.removeCookie('gallery', { path: '/' });
				$.removeCookie('gallery-item', { path : '/' });
				$.removeCookie('forum', { path : '/' });
				$.removeCookie('forum-item', { path : '/' });

				if(e.target.className.indexOf('fa') > -1 && $(this).closest('header').hasClass('navbar-simple')) {
					e.preventDefault();
					return false;
				}

		        //$(this).siblings('.active').removeClass('active');
		        if($(this).hasClass('loginout')) {
		        	if(b.URL == '/render') {
		        		$(this).showModalFlat('INFORMATION','미리보기에서는 제공되지 않습니다.',true,false,'','ok');
		        		return false;
		        	}
		            $('#loginModal').modal('show');
		            $('#loginModal').css('z-index',1042);
		            $('.modal-backdrop.fade.in').css('z-index', 1041);
		        } else {
					$('#tpl-menu li').removeClass('active').removeClass('open');
					
					$(this).parent().addClass('active');
					if($(this).closest('.dropdown-menu').length>0) {
						if($('body').width() > 768) $(this).closest('.dropdown').addClass('active');
						else $(this).closest('.dropdown').addClass('open');
					}
		            
			    }
		    }
		});

		$('.element[data-type="gallery"]').live({
			mouseenter : function() {
				$(this).find('.row[data-direffect="true"] .grid').each(function() {
				$(this).hoverdir();
				});
			}
		});	

		$('.creatorlink-header .data-user > ul > li').live({
			click : function() {
				$(this).closest('.pull-right').toggleClass('open');
				if($(this).closest('.pull-right').hasClass('open')) {
					$('.popover').show();
				} else {
					$('.popover').hide();
				}
			}
		});


		$('*[data-user-link]').live('click',function(e) {
			if(e.target.className.indexOf('fa') > -1 && $(this).closest('header').hasClass('navbar-simple')) {
				return false;
			}
			$.removeCookie('gallery', { path: '/' });
			$.removeCookie('gallery-item', { path : '/' });
			$.removeCookie('forum', { path : '/' });
			$.removeCookie('forum-item', { path : '/' });

		    var userLink = $(this).attr('href');
		    if(userLink.match(/^mailto:|^tel:|^sms:/gi) !== null) {
		    	window.location.href = userLink;
		    	return false;
		    }
			if(typeof userLink == "undefined" || $(this).attr('data-user-link') == '' ) {
				if($(this).attr('target') == '_blank' || $(this).attr('target') == 'blank') {
			    	var openNewWindow = window.open(userLink);
			    	return false;
		    	} else  {
			    	var url = new getLocation(userLink);
			    	golink(_this,url);
			    	return false;
		    	}
			}

			e.preventDefault();
		    if(b.ONE) {
		    	if(userLink.charAt(0)=="/") {
				    var linkRegExp = /\/view\//gi;
				    var linkMatch = userLink.match(linkRegExp);
				    if(linkMatch && linkMatch[0]) {
					    var url = ((b.URL=="/") ? "" : b.URL) + userLink;
					    if($(this).attr('target') == '_blank') {
					    	var openNewWindow = window.open(url);
					    } else { 
						    location.href=url;
						}
					    return false;
				    }
			    	userLink = userLink.charAt(0).replace("/","") + userLink.slice(1);
			    	if($(this).attr('target') == '_blank') {
					    var url = ((b.URL=="/") ? "/" : b.URL) + '#' + userLink;
				    	var openNewWindow = window.open(url);
			    	} else { 
			    		if(b.VIEW) {
						    var url = ((b.URL=="/") ? "/" : b.URL) + '#' + userLink;
					    	url = new getLocation(url);
					    	golink(_this,url);
			    		} else {
			    			moveLinkPage(userLink);
			    		}
				    }
		    	} else {
		    		// alert('Invalid URL');
		    		return false;
		    	}
		    } else {
			    var url = ((b.URL=="/") ? "" : b.URL) + userLink;
			    if($(this).attr('target') == '_blank' || $(this).attr('target') == 'blank') {
			    	var openNewWindow = window.open(url);
			    } else { 
			    	url = new getLocation(url);
			    	golink(_this,url);
				}
		    }
		});

		$("a[attr-bookmark]").live({
		    click : function(e) {
		        e.preventDefault();
				if(e.target.className.indexOf('fa') > -1 && $(this).closest('header').hasClass('navbar-simple')) {
					return false;
				}

				$.removeCookie('gallery', { path: '/' });
				$.removeCookie('gallery-item', { path : '/' });
				$.removeCookie('forum', { path : '/' });
				$.removeCookie('forum-item', { path : '/' });

		        var a_el = $(this),
		        	link = $(this).attr('href').replace(/^\@/g,''),
		            target = (typeof $(this).attr('target') != 'undefined') ? $(this).attr('target') : '';

		        if($('.element[data-bookmark="' + link + '"]').length > 0 && target != '_blank') {
		            moveLinkPage(b.PAGE+'\@'+link,1200,true);
		        } else {
		        	var attr_bookmark = $(this).attr('attr-bookmark');
		        	if(typeof attr_bookmark != 'undefined' && attr_bookmark && typeof b.SETTINGS.blockBookmarkList['bookmark' + attr_bookmark] != 'undefined') {
		        		// if(b.SETTINGS.blockBookmarkList['bookmark' + attr_bookmark] == link) {
		        			link = attr_bookmark;
		        		// }
		        	}
					if(typeof b.SETTINGS.blockBookmarkList == 'undefined'|| !b.SETTINGS.blockBookmarkList || typeof b.SETTINGS.blockBookmarkList['bookmark'+link] == 'undefined' ) {
						a_el.find('img[data-attach="true"]').unwrap();
						return false;
					}

		            $.post('/template/bookmarkBlock', {sid: b.SID, seq: link, publish : b.PUBLISH}, function(data) {
						checkError(data);

						var d = data[0];
						if(typeof d.orgpage == "undefined" || d.orgpage.length == 0) d.orgpage = d.page;

						var	org_title = d.orgpage.replace(/-/g," "),
							bb_o_page = (d.page.match(/^index/g) !== null ) ? org_title : d.page,
							bb_page = (bb_o_page.match(/\,/g) !== null) ? bb_o_page.substring(0,d.page.indexOf('\,')) : bb_o_page;


						var check_link = true,
							is_visible_menu = false;

						$.each(b.SMENU, function (idx, obj) {
							if(bb_page == obj.name.replace(/ /g,'-')) {
								if(!obj.link) check_link = false;
								if(obj.display == 'on') is_visible_menu = false;
							}
							if(obj.children) {
								$.each(obj.children, function (i, v){
									if(bb_page == v.name.replace(/ /g,'-')) {
										if(!v.link) check_link = false;
										if(v.display == 'on') is_visible_menu = false;
									}
								});
							}
						});

						var is_here = ($('.element[data-bookmark="' + link + '"]').length > 0 ) ? true : false,
							is_page = (b.PAGE.toLowerCase()==d.page.toLowerCase()) ? true : false,
							// is_visible_menu = ($.inArray(bb_page,b.MENULINK)>-1) ? true : false,
							// check_link = ( $('#tpl-menu li a[href*="'+bb_page+'"]').length > 0 && $('#tpl-menu li a[href*="'+bb_page+'"]').text().trim().replace(/ /gi,'-') == bb_page ) ? false : true,
							is_link = ( check_link && is_visible_menu && org_title != 'INTRO' ) ? true : false,
							is_visible = (check_link && is_visible_menu && org_title != 'INTRO') ? true : false;


						// console.log('is_visible_menu : ' + is_visible_menu);
						// console.log('bb_page : ' + bb_page);
						// console.log('d.glivisible : ' + d.glivisible);
						// console.log('is_link : ' + is_link);
						// console.log('is_visible : ' + is_visible);
						// console.log('is_here : ' + is_here);
						// console.log('is_page : ' + is_page);

						if( ( !is_visible_menu && bb_page!='index' ) || 
							( typeof d.glivisible!='undefined' && d.glivisible ) ||
							( /*( (is_here && target=='_blank') || !is_page ) &&*/ ( is_link || is_visible ) ) ||
							( !is_here && is_page ) )  {
								if(is_visible_menu == false) {
									moveBookmark(d.page,'\@'+link,1200,target);
								} else {
									a_el.find('img[data-attach="true"]').unwrap();
									return false;
								}
						} else {
							moveBookmark(d.page,'\@'+link,1200,target);
						}

		            }, 'json');
		        }
		        
		    }
		});

		$('.element img[data-attach="true"][data-img-original="ON"]').live({
			click: function(e) {
				$(this).mouseenter();
			},
			mouseenter : function(e) {
				if(!selectEL || typeof selectEL == 'undefined') {
					selectEL = $(this).closest('.element').attr('data-el');
				}
				if(typeof selectEL == "undefined") return false;

				var offset = $(this).offset(),
			        left = $(this).width() + offset.left-25,
					top = offset.top;
				var index = $('.' + selectEL + ' img[data-attach="true"]').index(this);

				if(b.VIEW) {
					var src = $(this).prop('src').split('/'),
						file = src[src.length-1];					
					$('.config-image-view').css({ top : top + 'px', left : left + 'px' }).attr('data-src',$(this).prop('src')).attr('data-index',index).show();
				}
			},
			mouseleave : function(e) {
				$('.config-image-view').hide();
			}
		});

		$('.config-image-view').live({
			mousemove : function(e) { $('.config-image-view').show(); },
			mouseout : function(e) { $('.config-image-view').show(); }
		});

	    $('.config-image-view').on({
			click: function (e) {
				$('.config-image-view').hide();

				var src = $(this).attr('data-src').split('/'),
					file = src[src.length-1],
	                free = (src[4]=='free') ? true : false;

				if(b.SID && file) {
					$('.tooltip.in').removeClass('in');
			  		$(this).attr("href","/image/original/sid/" + b.SID + "/file/" + file + '/free/' + free);
				} else {
					// console.log('None:: sid or src');
					return false;
				}
	        }
	    });

		$('[data-lock-password]').live('keydown.autocomplete', function(e) {
		    if (e.keyCode == 13) {
		    	$('[data-lock-submit]').click();
			}
		});

		$('[data-form-submit]').live('click', function() { 
			if($('#flat-modal').length) return;
			var $parent = $(this).parents('.element'),
				$items = $parent.find('[form-idx]'),
				values = {},
				pid = $parent.attr('data-id'),
				submit = true,
				el = '.' + $(this).parents('.element').attr('data-name');

			$parent.find('.error').remove();
			$.each($items, function(i,v) {
				var idx = $(this).attr('form-idx'),
					name = $(this).attr('form-name'),
					type = $(this).attr('form-type'),
					require = $(this).attr('form-require'),
					seq = $(this).attr('form-seq');

				switch(type) {
					case "radio":
					case "check":
						if(type == 'radio') {
							var val = $(this).find(':radio[name]:checked').val();
							values[seq] = (typeof val == 'undefined') ? '' : val;
						} else {
							values[seq] = $(this).find(':checkbox[name]:checked').map(function() { return this.value; } ).get().join();
						}

						if(typeof require != 'undefined' && require) {
							if(!values[seq]) {
								formRequireDisplay($(this),i+1);
								submit = false;
							}
						}
						break;
					case "date":
					case "date2":
						var date = $(this).find('input').map(function() { return this.value; } ).get(),
							valid = true;

						$.each(date, function(k,d) {
							if(d=='') valid = false;
						});

						if(typeof require != 'undefined' && require) {
							if(valid == false) {
								formRequireDisplay($(this),i+1);
								submit = false;
							}
						}
						values[seq] = date.join('');
						break;
					default : 
						values[seq] = $(this).val().trim();
						if(typeof require != 'undefined' && require) {
							if(!values[seq]) {
								formRequireDisplay($(this),i+1);
								submit = false;
							}
						}
						break;
				}
			});

			var $privacy = $parent.find('.form-privacy'),
				check;

			if($privacy.css('display')!='none') {
				check = $privacy.find('.check-privacy').prop('checked');
				if(check === false) {
					formRequireDisplay($privacy.find('.check-privacy'),'privacy');
					submit = false;
				}
			}

			if(submit) {
				$.processON();
		        $.ajax({
		            url: '/template/forms/submit',
					data: { sid : b.SID, pid : pid, values : values, check : check },
					dataType: 'json',
					type: 'POST',
		            async: true,
		            cache: false,
		            success: function (data) {
					    $.processOFF();
						checkError(data);
						$(this).showModalFlat('INFORMATION',data.done,true,false);

			    		setDefaultForm(el);
			    		if(typeof formCallback == 'function')
			    			formCallback(pid);
			    	}
				},'json');
			}
		});

		var formRequireDisplay = function($obj,idx) {
			var blang = $obj.parents('.element').attr('data-lang'),
				sdefault = '';
			if(typeof blang == 'undefined') {
				blang = getLanguage(true);
			}
	        if(blang == 'ko') {
	            sdefault = '필수 입력 사항';
	        } else if(blang == 'en') {
	            sdefault = 'Required';
	        } else if(blang == 'ja') {
	            sdefault = '必須';
	        } else {
	            sdefault = 'Required';
	        }

			var $parent = $obj.parents('.form-group'),
				$html = $('<div class="error">' + sdefault + '</div>');
			$parent.append($html);
			if($obj.parents('.form-inline').find('.error').length==1) {
				if(isNumber(idx)) $('body').scrollTo($('[form-idx="' + idx + '"]'), 0, { offset : -150 } );
				else  $('body').scrollTo($parent, 0, { offset : -150 } );
			}
		}

		$('.date-yyyy').live('keyup', function(e) {
			var val = $(this).val();
			if(val.length>=4) {
				if((e.target.selectionStart).length) ;
				else {
					if(isNaN(parseInt(val))) {
						$(this).val('1900');
					}
					$(this).parents('.form-group').find('.date-mm').focus();
				}
			}				
		}).live('blur', function(e) {
			var val = $(this).val();
			if(isNaN(parseInt(val))) {
				$(this).val('1900');
			} else {
				if(parseInt(val)<1900) {
					$(this).val('1900');
				}
			}
		});

		$('.date-mm, .date-dd, .date-hh, .date-ii').live('keyup', function(e) {
			var val = $(this).val();
			if(val.length>=2) {
				if((e.target.selectionStart).length) ;
				else {
					if(isNaN(parseInt(val))) {
						$(this).val('00');
					}
					if($(this).hasClass('date-mm')) {
						$(this).parents('.form-group').find('.date-dd').focus();
					} else if($(this).hasClass('date-dd')) {
						$(this).parents('.form-group').find('.date-hh').focus();
					} else if($(this).hasClass('date-hh')) {
						$(this).parents('.form-group').find('.date-ii').focus();
					} else if($(this).hasClass('date-ii')) {
						// $(this).parents('.form-group').next().find('input').focus();
					}
				}
			}				
		}).live('blur', function(e) {
			var val = $(this).val();
			if(isNaN(parseInt(val))) {
				$(this).val('01');
			} else {
				if(val.length==1) {
					$(this).val('0' + val);
				} else {
					if($(this).hasClass('date-mm') && parseInt(val)>12) {
						$(this).val('12');
					} else if($(this).hasClass('date-dd') && parseInt(val)>31) {
						$(this).val('31');
					} else if($(this).hasClass('date-hh') && parseInt(val)>23) {
						$(this).val('00');
					} else if($(this).hasClass('date-ii') && parseInt(val)>59) {
						$(this).val('00');
					}
				}
			}
		});

		$('[data-lock-submit]').live('click', function() { 
			$.modalON();
			var el = '.' + $(this).parents('element').attr('data-name');

			var pw = $('[data-lock-password]').val();
			if(pw.length == 0 ) {
				$('[data-lock-password]').focus();
				$('.error-text').text('! ' + $.lang[LANG]['config.enter-password']);
			}
			$.post('/template/menuLockController/type/pw_check', {s: b.SMENU, sid: b.SID, page: b.PAGE, pw: pw, publish : b.PUBLISH}, function(data) {
				checkError(data);
				$.modalOFF();
				if(data.result) {
					window.location.reload(true);
				} else {
					$('[data-lock-password]').focus();
					$('.error-text').text('! ' + $.lang[LANG]['config.enter-password']);
				}
			}, 'json');
		});

		$('[data-contact-submit]').live('click',function() {
			if($('#flat-modal').length || window.location != window.parent.location) return;
			$.modalON();
		    var el = '.' + $(this).parents('.element').attr('data-name'),
		    	el_id = $(this).parents('.element').attr('data-id'),
		    	google_track = $(this).attr('data-google-track'),
		    	google_track_run = false,
		    	daum_track = $(this).attr('data-daum-track'),
		    	daum_track_run = false,
		    	naver_track = $(this).attr('data-naver-track'),
		    	naver_track_run = false;
			
			google_track_run = (typeof google_track != "undefined") ? true : false;
			daum_track_run = (typeof daum_track != "undefined") ? true : false;
			naver_track_run = (typeof naver_track != "undefined") ? true : false;

		    if($(el).length==0 || $(el).length>1) {
		        alert('Invalid form data');
		        return false;
		    }

		    var firstname = setDefaultValue($(el + ' [data-contact-firstname]').val()),
		    	lastname = 	setDefaultValue($(el + ' [data-contact-lastname]').val()),
		    	email = 	setDefaultValue($(el + ' [data-contact-email]').val()),
		    	web = 		setDefaultValue($(el + ' [data-contact-website]').val()),
		    	phone = 	setDefaultValue($(el + ' [data-contact-phone]').val()), 
		    	subject = 	setDefaultValue($(el + ' [data-contact-subject]').val()),
		    	message = 	setDefaultValue($(el + ' [data-contact-message]').val()),
		    	etc = {};
    		$(el + ' [data-contact-etc]').each(function(i) {
				var key = $(this).attr('data-contact-etc');
				etc[key] = setDefaultValueEtc($(this).attr('type'),$(this));
			});

		    var require_firstname 	= $(el + ' [data-contact-firstname]').attr('data-required'),
		    	require_lastname 	= $(el + ' [data-contact-lastname]').attr('data-required'),
		    	require_email		= $(el + ' [data-contact-email]').attr('data-required'),
		    	require_web			= $(el + ' [data-contact-website]').attr('data-required'),
		    	require_phone		= $(el + ' [data-contact-phone]').attr('data-required'),
		    	require_subject 	= $(el + ' [data-contact-subject]').attr('data-required');

		    /*default:: required[email,message] | optional[firstname,lastname,web,phone,subject]  // data-optional='true'->optional, 'false'->required */
		    var optional_firstname  = $(el + ' [data-contact-firstname]').attr('data-optional'),
		    	optional_lastname   = $(el + ' [data-contact-lastname]').attr('data-optional'),
		    	optional_email		= $(el + ' [data-contact-email]').attr('data-optional'),
		    	optional_web		= $(el + ' [data-contact-web]').attr('data-optional'),
		    	optional_phone		= $(el + ' [data-contact-phone]').attr('data-optional'),
		    	optional_subject	= $(el + ' [data-contact-subject]').attr('data-optional'),
		    	optional_message	= $(el + ' [data-contact-message]').attr('data-optional');
		    var optional_etc		= {};

    		$(el + ' [data-contact-etc]').each(function(i) {
				var key = $(this).attr('data-contact-etc');
				optional_etc[key] = $(this).attr('data-optional');
			});

    		var $parent = $(this).parents('.element'),
    			el = '.' + $(this).parents('.element').attr('data-name'),
		    	contprivacy = $(el+' .form-group.contact-privacy-area').css('display'),
        		contprivacy_display = (typeof contprivacy == "undefined" || contprivacy == 'none') ? false : true,
    			privacy_check = $parent.find('.contact-checkbox-text'),
				privacy_chk = privacy_check.is(":checked"),
				check = true,
		    	check_option = [];

		    if((!firstname && typeof optional_firstname != 'undefined' && optional_firstname == "false") || (!lastname && typeof optional_lastname != 'undefined' && optional_lastname == "false")) {
		    	var str = ($(el + ' [data-contact-firstname]').attr('data-contact-firstname').length > 0) ? $(el + ' [data-contact-firstname]').attr('data-contact-firstname') : 'name';
		    	check_option.push(str);
		    }
		    
		    if(!web && typeof optional_web != 'undefined' && optional_web == "false") {
		    	var str = ($(el + ' [data-contact-web]').attr('data-contact-web').length > 0) ? $(el + ' [data-contact-web]').attr('data-contact-web') : 'web';
		    	check_option.push(str);
		    }

		    if(!phone && typeof optional_phone != 'undefined' && optional_phone == "false") {
		    	var str = ($(el + ' [data-contact-phone]').attr('data-contact-phone').length > 0) ? $(el + ' [data-contact-phone]').attr('data-contact-phone') : 'phone';
		    	check_option.push(str);
		    }

		    if(!subject && typeof optional_subject != 'undefined' && optional_subject == "false") {
		    	var str = ($(el + ' [data-contact-subject]').attr('data-contact-subject').length > 0) ? $(el + ' [data-contact-subject]').attr('data-contact-subject') : 'subject';
		    	check_option.push(str);
		    }

		    if(!email) {
		    	if(typeof optional_email != 'undefined' && optional_email == "true") check = true;
		    	else if ($(el + ' [data-contact-email]').length == 0) check = true;
		    	else check = false;

		    	var str = ($(el + ' [data-contact-email]').attr('data-contact-email').length > 0) ? $(el + ' [data-contact-email]').attr('data-contact-email') : 'email';
		    	if(!check) check_option.push(str);
		    }
		    if(!message) {
		    	if(typeof optional_message != 'undefined' && optional_message == "true") check = true;
		    	else check = false;

		    	var str = ($(el + ' [data-contact-message]').attr('data-contact-message').length > 0) ? $(el + ' [data-contact-message]').attr('data-contact-message') : 'message';
		    	if(!check) check_option.push(str);
		    }

		   	$.each(etc,function(k,v){
		   		if(!etc[k] && typeof optional_etc[k] != 'undefined' & optional_etc[k] == "false") {
		   			check_option.push(k);
		   		}
		   	});

		   	check = ((check_option.length == 0) && ((contprivacy_display == false) || (privacy_chk == true))) ? true : false;

		    if(require_firstname == "true" && !firstname) {
		    	$(this).showModalFlat('INFORMATION',$(el + ' [data-contact-firstname]').attr('placeholder') + $.lang[LANG]['check.required'], true, false, '', 'ok');
		    	return false;
		    }

		    if(require_lastname == "true" && !lastname) {
		    	$(this).showModalFlat('INFORMATION',$(el + ' [data-contact-lastname]').attr('placeholder') + $.lang[LANG]['message.check.required'], true, false, '', 'ok');
		    	return false;
		    }

		    if(require_web == "true" && !web) {
		    	$(this).showModalFlat('INFORMATION',$(el + ' [data-contact-website]').attr('placeholder') + $.lang[LANG]['message.check.required'], true, false, '', 'ok');
		    	return false;
		    }

		    if(require_phone == "true" && !phone) {
		    	$(this).showModalFlat('INFORMATION',$(el + ' [data-contact-phone]').attr('placeholder') + $.lang[LANG]['message.check.required'], true, false, '', 'ok');
		    	return false;
		    }

		    if(require_subject == "true" && !subject) {
		    	$(this).showModalFlat('INFORMATION',$(el + ' [data-contact-subject]').attr('placeholder') + $.lang[LANG]['message.check.required'], true, false, '', 'ok');
		    	return false;
		    }

		    if(check) {
		    	$.post('/template/update/type/contact',{
		    		id : b.SID,
		    		seq : el_id,
		    		s : 'message',
		    		firstname : firstname,
		    		lastname : lastname,
		    		email : email,
		    		web : web,
		    		phone : phone,
		    		subject : subject,
		    		message : message,
		    		etc : JSON.stringify(etc),
		    	}, function(data) {
		    		checkError(data);
		    		if(typeof data.error == "undefined" || data.error=="") {
			    		$(this).showModalFlat('INFORMATION',$.lang[LANG]['message.sent'],true,false, '', 'ok');
			    		setDefaultContactForm(el);
			    		setDefaultContactFormEtc(el);
			    		if(typeof contactCallback == 'function')
			    			contactCallback();
		    		}
		    	},'json');
			    setTimeout(function() {
				    $.modalOFF();
			    },1000);
		    } else {
		    	$.modalOFF();
		    	var check_str = '';
		    	$.each(check_option,function(k,v) {
		    		check_str = (check_str) ? check_str + ' / ': '';
		    		check_str = check_str + v;
	            });
	            
		    	if(check_str) {
		    		var modal = $(this).showModalFlat('INFORMATION',check_str+ $.lang[LANG]['message.check.required'],true,false, '', 'ok');
		    	} else {
		    		var modal = $(this).showModalFlat('INFORMATION',$.lang[LANG]['message.privacy.check.required'],true,false, '', 'ok');
		    	}
		    	
		    }					    
		});	
	
		$('.contact-privacy-text').live('click',function() {
			var el = '.' + $(this).parents('.element').attr('data-name'),
				privacy_textarea = $(el+" .form-inline .contact-privacy-area .contact-privacy-box").css('display'),
		        con_privacy_display = (privacy_textarea !='none') ? true : false;

	        if(con_privacy_display) {
		        $(el+" .form-inline .contact-privacy-area .contact-privacy-box").css('display','none');
		    } else {
		        $(el+" .form-inline .contact-privacy-area .contact-privacy-box").css('display','');
		    }
		});
		
		$('.gallery-loadmore').live({
		    click: function() {
		        var id = $(this).data('id'),
		            page = $(this).data('page'),
		            view = $(this).data('view'),
		            mode = $(this).data('mode'),
		            folder = $(this).data('folder'),
		            org = $('[data-id="' + id + '"]').find('[data-loop="true"]'),
		            nodes = org.clone().children(),
		            $this = $(this),
		            $container = $('[data-id="' + id + '"] .container'),
		            isMasonry = $(this).hasClass('masonry-layout'),
		            items = 0,
		            total = 0,
		            gallery_item = '',
		            $gc = $('.element[data-id="' + id + '"] .gallery-category-nav li.active'),
		            sfl = ($gc.index() > 0) ? 'category' : '',
		            stx = (sfl) ? $gc.text().trim() : '';

		        var val = galleryEL[id];

		        $.ajax({
		            url: '/template/gallery/list/pid/' + id + '/sid/' + property.SID + '/spage/' + property.PAGE + '/page/' + page + '/view/' + view + '/mode/visible' + param,
					data: { sfl:sfl, stx:stx },
					dataType: 'json',
					type: 'POST',
		            async: false,
		            cache: false,
		            success: function (data) {
		            	$.cookie('gallery-page-' + id, page, { path: '/', expires: 12 * 60 * 60 * 1000 });
		                var stx_str = (typeof escape(stx) != 'undefined') ? escape(stx) : '';
		                $.cookie('gallery-category-' + id, stx_str, { path: '/', expires: 12 * 60 * 60 * 1000 });
		                var loop_count = nodes.length;

                        total = (typeof data.total.list_total != "undefined") ? data.total.list_total : data.total ;
		                items = data.list.length;

		                $.each(data.list,function(i,v) {
		                    loop_pos = i%loop_count;
		                    c = nodes[loop_pos];
		                    item_index = ((page-1)*loop_count) + i;
		                    $(c).addClass('gallery-item').attr('data-index',item_index).attr('data-seq',v.seq);

                            var vgsettings = (typeof v.gsettings != 'undefined' && v.gsettings) ? $.parseJSON(v.gsettings) : {},
						        img_path = (typeof vgsettings['storage'] != 'undefined') ? vgsettings['storage'] : _this.b.RESOURCE + "/" + _this.b.SID + "/",
						        img_original = (typeof vgsettings['storage'] != 'undefined') ? img_path + '1920/' : img_path;

							var folder = (val.folder == 0) ? "" : val.folder + "/";
							$(c).find('img').attr("src", img_path + folder + v.image);
							
							var glink = (typeof vgsettings['glink'] != 'undefined' && vgsettings['glink']) ? vgsettings['glink'] : '',
								glink_target = (typeof vgsettings['glink_target'] != 'undefined' && vgsettings['glink_target']) ? vgsettings['glink_target'] : '';

							if(glink) {
								if(glink.match(/^\@/g) !== null) {														// link-type: link-bookmark ==> a[attr-bookmark]
									var bookmark_seq = glink.replace(/^\@/g,'');
									if(typeof _this.b.SETTINGS.blockBookmarkList == 'undefined' || typeof _this.b.SETTINGS.blockBookmarkList['bookmark' + bookmark_seq] == 'undefined') {
										glink = '';
										glink_target = '';
									}
                                } else if(_this.b.MENULIST.indexOf(glink.replace(/^\//g,"").replace(/ /g,"-")) > -1) {  // link-type: link-menu     ==> a[data-user-link]
                                } else {                                                                                // link-type: link-out      ==> a[attr-link]
									if(checkBase64Encode(glink)) glink = Base64.decode(glink);
								}
							}

                            if(glink) {
		                        var glink_val = makeLinkUrl(glink, property.ONE, property.VIEW);
		                        
		                        $(c).find('a').removeAttr('data-gallery').removeAttr('data-user-link').removeAttr('attr-bookmark').removeAttr('attr-link');
		                        $(c).find('a').attr('href',glink_val);
		                        
		                        if(_this.b.MENULIST.indexOf(glink.replace(/ /g,'-'))>-1) {
		                            $(c).find('a').attr('data-user-link',glink_val);
		                        } else if(glink.match(/^\@/g)) {
		                            $(c).find('a').attr('attr-bookmark',glink.replace(/^\@/g,''));
		                        } else {
		                            $(c).find('a').attr('attr-link',glink);
		                        }
                            } else {
                                $(c).find('a').removeAttr('data-user-link').removeAttr('attr-bookmark').removeAttr('attr-link');

								if (mode == "gallery") {
									$(c).find('a').attr("href", img_original + v.image);
									$(c).find('a').attr('data-gallery', '#gframe-' + id);
									var img_onoff = (typeof vgsettings.img_original_display == "undefined") ?  "OFF": vgsettings.img_original_display;
									$(c).find('a').attr('data-img-original',img_onoff);
								} else {
									$(c).find('a').attr("href", ((b.URL=="/") ? "" : b.URL) + "/" + b.PAGE + "/view/" + v.seq);
									$(c).find('a').removeAttr('data-gallery');
								}
			                }
		                    if(glink_target == '_blank') $(c).find('a').attr('target','_blank');
		                    else $(c).find('a').removeAttr('target');

		                    $(c).find('a').attr("title", v.title).attr('data-title',v.title);

		                    // caption
		                    var ftitle = $(c).find('h5.figure'),
		                        fcaption = $(c).find('p.figure'),
		                        fdatetime = $(c).find('.figure.datetime'),
		                        fhashtag = $(c).find('.figure.hashtag');

		                    // datetime / hashtag
		                    if(fdatetime.length<1) {
		                        $(c).find('figcaption').append("<div class='figure datetime hide'></div>");
		                        fdatetime = $(c).find('.figure.datetime');
		                    }
		                    if(fhashtag.length<1) {
		                        $(c).find('figcaption').append("<div class='figure hashtag hide'></div>");
		                        fhashtag = $(c).find('.figure.hashtag');
		                    }

		                    $(c).find('figcaption').removeClass('hide');

		                    if(v.title.length==0) v.title = "Title";
		                    if(v.caption.length==0) v.caption = "You can change this text";

		                    ftitle.html(v.title);
                            var gallery_caption = v.caption;
                            gallery_caption = gallery_caption.replace(/\n/g, "<br />");
                            fcaption.html(gallery_caption);
		                    fdatetime.text(v.datetime);
		                    fhashtag.text(v.hashtag);
		                    fcaption.removeClass('hide');

		                    if(isMasonry) {
		                        gallery_item = gallery_item + $(c)[0].outerHTML;
		                    } else {
		                        org.append($(c)[0].outerHTML);    
		                    }
		                });
		            }
		        });

		        if(isMasonry) {
		            var $gallery_items = $(gallery_item);
		            $gallery_items.hide();
		            //$container.masonry().append($gallery_items);
		            $('.gallery-loadmore[data-id="' + id + '"]').before("<div class='gallery-loading-status'><div class='loading-dots'></div></div>");
					var process_index = 0;		            
		            $gallery_items.imagesLoaded().progress(function(imgload, image) {
		            	process_index++;
		                var $item = $(image.img).parents('.grid');
		                $item.show();
		                //$container.masonry('appended',$item).masonry();
		                if(items == process_index) {
		                    reloadMasonry($container,$gallery_items);
		                }		                
		            });
		        }

		        var cookie_page = $.cookie('gallery-page-'+id),
		            view = (view > total) ? total : view,
		            cookie_view = ( (cookie_page*view) > total ) ? total : cookie_page*view;

		        // display = ($this.hasClass('masonry-layout')) ? $container.masonry('getItemElements').length + items : org.children().length;
		        // org.parents('.element').find('.display').text(display);
		        org.parents('.element').find('.display').text(cookie_view);

		        if(total<=cookie_view) $('.gallery-loadmore[data-id="'+id+'"]').fadeOut();
		        if(items) $(this).data('page', page + 1);

                if(org.parents('.element').find('*[data-direffect="true"]').length > 0 ) {
                    setTimeout(function() {
                        org.parents('.element').find('.grid').each(function() {
                            $(this).hoverdir();
                        });
                    }, 400);
				}
		    }
		});		

		$('.gallery-item a[title]').live('mouseenter', function () {
		    $(this).tooltip('destroy');
		});

		$('.gallery-item').live('click', function(e) {
			var pid = $(this).parents('.element').attr('data-id');
		    $('.blueimp-gallery').addClass('blueimp-gallery-controls');
		    $('.blueimp-gallery a.view-original').remove();
		    if($(this).find('a').attr('data-img-original') == 'ON') {
			    $('.blueimp-gallery a.close').after('<a class="view-original" data-id="' + pid + '"><img src="https://storage.googleapis.com/i.addblock.net/icon/fa_gframe_vieworiginal.png" class="img-responsive"></a>');
			}
		   	$.cookie('gallery-item', $(this).attr('data-seq'), { path : '/', expires: 12 * 60 * 60 * 1000 });
		   	if(b.PARENT.prev != null) $('.data-page-prev').addClass('active');
		   	if(b.PARENT.next != null) $('.data-page-next').addClass('active');
			e.stopPropagation();
		});

		$('body').on('click','.blueimp-gallery a.view-original', function(e) {
		    var idx = 0,
		        eid = $(this).attr('data-id');
		    $('#gframe-' + eid + ' .slide').each(function(i,v) {
		        var trans = $(v).attr('style');
		        if(trans.indexOf('translate(0px, 0px)')>-1) {
		            idx=i;
		        }
		    });
		    var src = $('#gframe-' + eid + ' .slide[data-index="' + idx + '"] > img').attr('src');
		    $('.blueimp-gallery a.view-original').attr('href',src).attr('target','_blank');
		    e.stopPropagation();
		});

		/* page count */
		if(Object.keys(b.CONTENTS).length) {
			var ps_elupdate = this.contentUpdate(b.CONTENTS);
			ps_elupdate.then(function() {
				elFooter();
				if(b.COUNT) _this.displayComment(b.VIEW);
			}).then(function() {
				if(b.VIEW) displayPageToolbar();
			}).then(function() {
	    		if(b.VIEW) displaySnsShare(b.PARENT.pid);
	    	}).then(function() {
				if(b.VIEW) displayBottomList(b.PARENT.pid);
			}).then(function() {
				if(b.ONE && !b.VIEW || b.PAGE == b.MENULINK[0] && !b.VIEW) setSitePopup();

				if(b.VALIDPLAN) {
					if(typeof b.SETTINGS.fnav != "undefined" && !$.isEmptyObject(b.SETTINGS.fnav)) $.fnav.draw(b.SETTINGS.fnav);
				}
	    	});
		} 
		else {
			var checkUrl = b.PAGE.split(",");
			if(property.COUNT==0) {
				elFooter();
			    if(checkUrl[0] == "forum" && b.VIEW) {
					var ps_fmview = $.forum.view(b.VIEW);
					ps_fmview.then(function() {
						_this.displayComment(b.VIEW);
					}).then(function() {
						if(b.VIEW) {
							displaySnsShare(b.PARENT.pid);
							displayBottomList(b.PARENT.pid);
						}
						if(b.VALIDPLAN) {
							if(typeof b.SETTINGS.fnav != "undefined" && !$.isEmptyObject(b.SETTINGS.fnav)) $.fnav.draw(b.SETTINGS.fnav);
						}						
					});
				}
			}
		}

		if(typeof b.SETTINGS.hideScrollTop == 'undefined') {
			$('#goto-top').css('visibility','visible');
		}

	    $(window).load(function() {
	    	$('#no-fouc').css('opacity','1');
	        if(typeof $.cookie('gallery') != 'undefined' && b.VIEW == '') {
	        	moveGallery($.cookie('gallery'));
	        	$.removeCookie('gallery',{ path : '/' });
	        }
	        moveScroll(0);
		    _this.loaded();

		    if(typeof b.SETTINGS.musicUse != "undefined" && b.SETTINGS.musicUse === true)
				$.musicON();

			var used_disk_value = b.USED_DISK / 1024,
				used_disk = Math.ceil(used_disk_value); // byte으로 가져와서 megsabyte으로 변한다

			if((used_disk > b.DISK_SPACE) && (b.MB_LEVEL != 10)) setlimitdiskPopup();

	    });
    },
    contentUpdate : function(contents) {
	    var deferred = $.Deferred();
    	var b = this.b,
    		_this = this,
    		idx = 0;

		isMenuLock(function() {
			var default_t_css = '', default_m_css  = '';
	    	$.each(contents, function(i,v) {
	    		var c = v.element,
	    			$el = $('.' + c.elname),
	    			msny = (c.feature=='masonry') ? true : false;

	            if(c.orgpos==1)  $el.addClass('link-to-'+c.orgpage.replace(/ /g,"-"));

	            $el.addClass('el_' + idx)
	            	.addClass('element')
	            	.addClass('hide')
	                .attr('data-id', c.seq)
	                .attr('data-el','el_' + idx)
	                .attr('data-pos', c.pos)
	                .attr('data-name', c.elname)
	                .attr('data-msny', msny)
	                .attr('data-type', c.type)
	                .attr('data-type2', c.type2)
	                .attr('data-mode', c.mode)
	                .attr('data-width', c.folder)
	                .attr('data-overlap',c.overlap);
	            if(b.ISLOCK == 'false') $el.removeClass('hide');
	            else $el.addClass('locked');

	            if(c.type == 'forum') $el.addClass('preloading');
	            //add style
	            var jcss = CSSJSON.toJSON(c.elcss),
	            	elpd = style.getPadding(jcss,c.elname);

            	var elFonts = $el.css('font-family');
        		elFonts = elFonts + ',"Nanum Gothic"';
        		var reFonts = elFonts.replace(/"/g, '\'');
        		$el.css('font-family',reFonts);

	            var pt = parseInt(elpd.top),
	                pb = parseInt(elpd.bottom);
	                
	            if(pt>0||pb>0){
	                default_t_css = default_t_css + '\n 	.'+c.elname + '{';
	                if(Math.ceil(pt*0.8)>0)
	                default_t_css = default_t_css + 'padding-top: '+Math.ceil(pt*0.8) + 'px!important;';
	                if(Math.ceil(pb*0.8)>0)
	                default_t_css = default_t_css + 'padding-bottom: '+Math.ceil(pb*0.8) + 'px!important;';
	                default_t_css = default_t_css + '}';

	                default_m_css = default_m_css + '\n 	.'+c.elname + '{';
	                if(Math.ceil(pt*0.5)>0)
	                default_m_css = default_m_css + 'padding-top: '+Math.ceil(pt*0.5) + 'px!important;';
	                if(Math.ceil(pb*0.5)>0)
	                default_m_css = default_m_css + 'padding-bottom: '+Math.ceil(pb*0.5) + 'px!important;';
	                default_m_css = default_m_css + '}';
	            }
	            
	            if(idx == Object.keys(b.CONTENTS).length-1){
	                var css = "@media only screen and (max-width:767px) {" + default_t_css + "\n}\n";
	               	css = css + "@media only screen and (max-width:480px) {" + default_m_css + "\n}";

	                if($('#el-paddingcss').length == 0) $('.dsgn-body').find('#el_'+(Object.keys(b.CONTENTS).length-1)+'css').after("<style id='el-paddingcss'>"+css+"</style>");
	                else $('#el-paddingcss').append(css);
	            }

	            var settings = (c.elsettings == "" || typeof c.elsettings == "undefined") ? {} : $.parseJSON(c.elsettings);

				if(typeof settings.bookmark != "undefined" && settings.bookmark) {
					$el.attr('data-bookmark',c.seq);
				}
				if(b.VIEW && c.type == 'project') {
					$el.find('.data-page-prev').addClass('active');
					$el.find('.data-page-next').addClass('active');

                    if(b.PARENT.prev == null) $el.find('.data-page-prev').removeClass('active');
                    if(b.PARENT.next == null) $el.find('.data-page-next').removeClass('active');
                }

                if(b.VIEW) {
	            	var img_onoff = (typeof settings.img_original_display == "undefined") ?  "OFF": settings.img_original_display;
	            	$el.find('img[data-attach="true"]').attr('data-img-original',img_onoff);
                }


				if(c.type == "video") {
					if (navigator.userAgent.match(/(safari)/gi) !== null) {
						$el.find("video").each(function() {
							//safari...
							$(this).attr('webkit-playsinline',1);
							$(this).attr('playsinline',1);
						});
					}
					if (navigator.userAgent.match(/(iPod|iPhone|iPad)/gi) !== null) {
						$el.find("video").each(function() {
							$(this).removeAttr('muted');
							$(this).removeAttr('loop');
							$(this).removeAttr('autoplay');
							$(this).removeAttr('preload');
						});
					}
				} else if(c.type == 'forum') {
					_this.forumUpdate(v.element.seq, 1, v.view, c.page, v.list);
				} else if(c.type == 'gallery') {
                    _this.galleryEL[c.seq] = {
                    	'seq' : c.seq,
                    	'eltag' : c.eltag,
                    	'folder' : c.folder,
                    	'mode' : c.mode,
                    	'elsettings' : c.elsettings,
                    	'feature' : c.feature,
                    };

					_this.galleryUpdate(c,v);
				} else if(c.type == 'sns' && c.type2 == 'feed') {
	                $el.find('.data-feed-load-more').attr('data-feed-el',c.elname);
	                $el.find('.data-feed-load-more').removeAttr('style');
	                $el.find('.show-posts').removeClass('show-posts');
                	if(typeof settings.sns != "undefined" && (settings.sns.twitter || settings.sns.instagram)) {
		                updateFeed(c.elname,settings.sns);
	                    loadingElement(c.elname,'loading posts...');
	                }
				} else if(c.type == 'others' && c.type2 == 'countdown') {
	                var el_dday = $el.find('[data-dday="true"]'),
	                	cd_date = (el_dday.attr('data-countdown')) ? el_dday.attr('data-countdown') : new Date(),
	                    dateformat  = { days : '%D', hours: '%H', minutes: '%M', seconds: '%S' },
	                    dateendformat  = { days : '00', hours: '00', minutes: '00', seconds: '00' };
					
					if( typeof settings.countdown != "undefined" && settings.countdown ) {  //set - block setting date 
                        cd_date = settings.countdown;
	                }
	                if( !el_dday.attr('data-countdown') && typeof cd_date == "object" ) { //set - example date
	                    cd_date.setTime(cd_date.getTime() + (35*24*60*60*1000));
	                }
		            cd_date = moment(cd_date).format('YYYY/MM/DD HH:mm:ss');
	                
	                el_dday.find('.date-item').each(function() {
	                    if(typeof $(this).attr('data-format') != 'undefined' && $(this).attr('data-format')) {
	                        dateformat[$(this).attr('data-datetype')] = $(this).attr('data-format');
	                    }
	                    if(typeof $(this).attr('data-finish') != 'undefined' && $(this).attr('data-finish')) {
	                        dateendformat[$(this).attr('data-datetype')] = $(this).attr('data-finish');
	                    }
	                });

	                el_dday.countdown(cd_date, function(event) {
			            if(event.elapsed) {
		                    $el.find('.date-item[data-datetype="days"]').text(dateendformat['days']);
		                    $el.find('.date-item[data-datetype="hours"]').text(dateendformat['hours']);
		                    $el.find('.date-item[data-datetype="minutes"]').text(dateendformat['minutes']);
		                    $el.find('.date-item[data-datetype="seconds"]').text(dateendformat['seconds']);
		                } else {
		                    $el.find('.date-item[data-datetype="days"]').text(event.strftime(dateformat['days']));
		                    $el.find('.date-item[data-datetype="hours"]').text(event.strftime(dateformat['hours']));
		                    $el.find('.date-item[data-datetype="minutes"]').text(event.strftime(dateformat['minutes']));
		                    $el.find('.date-item[data-datetype="seconds"]').text(event.strftime(dateformat['seconds']));
		                }
	                });	
				}
	            idx++;
	    	});

			// $('.tag.preloading').replaceWith(function () {
			//     return $(this).html();
			// });
			$('.preloading').removeClass('preloading');
			if(b.ISLOCK == 'true') {
				$('.hide.locked').remove();
				return false;
			}
			
			var $el = $('[data-map="true"]');
			$.each($el, function(i,v) {
				var map_url = $(this).attr('data-url'),
					map_style = $(this).attr('data-style'),
					id = $(this).parents('.element').attr('data-id');
				
				$(this).attr('id','map-'+id);
				if(typeof map_url!='undefined' && map_url!='' && typeof id != "undefined") {
					if(b.VALIDPLAN) {
						loadmap(map_url,'map-'+id, map_style);
					} else {
						$(this).addClass('disabled-map');
					}
				}
			});
	    	$('.dsgn-body').fitVids();

		});
		parallax();

		deferred.resolve();
	    return deferred.promise();
    },
    setLoginout : function (show, sid, site, profileimg) {
		if(show=='1') {
			$.getJSON("/template/checkLogin", function(data) {
				if(data.user && site) {
					if($('#tpl-menu').find('.loginout')) $('#tpl-menu').find('.loginout').remove();
					setLoginoutNav(sid, function() {
						getProfileMember();
						getProfileAuthor(sid,profileimg);
						$('.el_0').css('margin-top','55px');
					});
				} else {
					$('#tpl-menu').append('<li class="loginout"><a href="javascript:;" title="CREATORLINK login"><i class="fa fa-user"></i></a></li>'); 
				}
			});
	    }
    },
    liveUpdate : function(obj) {
    	var b = this.b;
	    var menu = $('#tpl-menu'),
	        idx = 0,
	        regex = /^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,7}(\:[0-9]+)?(\/\S[^\{\}]*)?$/,
	        regex2 = /^((http(s?))\:\/\/)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,7}(\:[0-9]+)?(\/\S[^\{\}]*)?$/;
	    menu.empty();
		if($('.fmcss').length > 0) $('.fmcss').remove(); //forum background css

	    $.each(obj, function (idx, obj) {
	        b.MENULIST.push(obj.name.replace(/ /g,'-'));
	        if(obj.children) {
	            $.each(obj.children, function (idx, obj){
	                b.MENULIST.push(obj.name.replace(/ /g,'-'));
	            });
	        }
	    });

	    for (i = 0; i < obj.length; i++) {
	        var link = obj[i].name,
	            link = (b.MENULIST.indexOf(link.replace(/ /g,'-')) > -1) ? link.replace(/ /g,'-') : link,
		        parent = b.PAGE.split(','),
	            link_text = '', target = '', isBookmark = '';

	        if(i==0) {
	            if(obj[i].display=='on') b.MENULINK.push(link);
	            continue;
	        }

	        var active = (link == b.PAGE || link == parent[0]) ? 'active' : '',
	            sub = obj[i].children.length;


	        if(b.ONE) {
	        	linkUrl = (b.VIEW) ? '/#' : '#';
	        	linkUrl = (b.VIEW && !b.PUBLISH) ? '/render/index#' : linkUrl;
	        } else {
	            linkUrl = (b.URL=="/") ? "/" : b.URL + "/";  
	        } 

	        if (obj[i].display == 'on') {
				b.MENULINK.push(link);

				var checkLink = (obj[i].link) ? true : false,
					checkLinkInner = (obj[i].link && b.MENULIST.indexOf(obj[i].link.replace(/ /g,'-')) > -1) ? true : false,
					checkLinkBookmark = (obj[i].link.match(/^\@/g) !== null) ? true : false;

				link = (checkLink) ? ((checkLinkInner) ? obj[i].link.replace(/ /g,'-') : obj[i].link) : link;
				isBookmark = (checkLinkBookmark) ? 'attr-bookmark="'+link.replace(/^\@/g,'')+'"' : '';
				target = (obj[i].ltarget == '_blank') ? 'target="_blank"' : '';

				if(checkLink && !checkLinkInner && !checkLinkBookmark) { // link-type: link-out      ==> a[attr-link]
					if(checkBase64Encode(link)) link = Base64.decode(link);
				}

	            if (sub) {
	                var sub_menu = '',
	                    sub_show = 0;

	                sub_menu = '<ul class="dropdown-menu">\r\n';
	                for (j = 0; j < obj[i].children.length; j++) {
	                    var child = obj[i].children,
							checkChildLink = (child[j].link) ? true : false,
							checkChildLinkInner = (b.MENULIST.indexOf(child[j].link.replace(/ /g,'-')) > -1) ? true : false,
							checkChildLinkBookmark = (child[j].link.match(/^\@/g) !== null) ? true : false,
							child_link = (child[j].link) ? ((checkChildLinkInner) ? child[j].link.replace(/ /g,'-') : child[j].link) : '',
							child_isBookmark = (checkChildLinkBookmark) ? 'attr-bookmark="' + child_link.replace(/^\@/g,'') + '"' : '',
	                    	sub_link = (child_link) ? child_link : child[j].name.replace(/ /g, "-"),
							sub_target = (child[j].ltarget == '_blank') ? 'target="_blank"' : '',
							sub_active = '';

						if(checkChildLink && !checkChildLinkInner && !checkChildLinkBookmark) { // link-type: link-out      ==> a[attr-link]
							if(checkBase64Encode(child_link)) sub_link = Base64.decode(child_link);
						}

						if (!active && (sub_link == b.PAGE || link == parent[0])) {
							sub_active = 'active';
							if($('body').width() > 768) active = 'active';
							else active = 'open';
						}	                    	

	                    if (child[j].display == 'on') {
		                    b.MENULINK.push(child[j].name.replace(/ /g, '-'));
	                        link_text = (b.MENULIST.indexOf(sub_link)>-1) ? linkUrl+sub_link : (!regex2.test(sub_link) && regex.test(sub_link)) ? '//'+sub_link : sub_link ;
	                        sub_menu = sub_menu + '<li class="' + sub_active + '"><a href="' + link_text + '" ' + sub_target + ' ' + child_isBookmark + '>' + child[j].name + '</a></li>\r\n';

	                        sub_show++;
	                    }
	                }
	                sub_menu = sub_menu +'</ul>\r\n';
	                if(link == 'folder-menu') {
	                	link_text = 'javascript:;';
	                	target = '';
	                    if(typeof menu.closest('.navbar-menu-'+b.SID).attr('data-submenu') != 'undefined') target = ' data-toggle="dropdown" aria-expanded="false" data-submenu="true" ';
	                } else {
		                link_text = (b.MENULIST.indexOf(link)>-1) ? linkUrl + link : (!regex2.test(link) && regex.test(link)) ? '//'+link : link;
		            }

                var caret = ($('header.navbar').hasClass('sidebar')) ? ' <i class="fa fa-caret-right fa-1" aria-hidden="true"></i>' : ' <i class="fa fa-caret-down fa-1" aria-hidden="true"></i>';
                if (sub_show) {
                		var sub_menu_open = (typeof menu.closest('.navbar-menu-'+b.SID).attr('data-submenu') != 'undefined' && menu.closest('.navbar-menu-'+b.SID).attr('data-submenu') == 'open' && active != 'open') ? 'open' : '';
	                	menu.append('\r\n<li class="' + active + ' dropdown ' + sub_menu_open + '"><a href="' + link_text + '" class="dropdown-toggle" ' + target + ' ' + isBookmark + '>' + obj[i].name + caret + '</a></li>\r\n');
	                } else {
	                	menu.append('\r\n<li class="' + active + '"><a href="' + link_text + '" ' + target + ' ' + isBookmark + '>' + obj[i].name + '</a></li>\r\n');
	                }
	                if(sub_show) menu.find('.dropdown:last').append(sub_menu);
	            } else {
	                if(link == 'folder-menu') {
	                	link_text = 'javascript:;';
	                	target = '';
	                    if(typeof menu.closest('.navbar-menu-'+b.SID).attr('data-submenu') != 'undefined') target = ' data-toggle="dropdown" aria-expanded="false" data-submenu="true" ';
	                } else {
		                link_text = (b.MENULIST.indexOf(link)>-1) ? linkUrl + link : (!regex2.test(link) && regex.test(link)) ? '//'+link : link ;
		            }
	            	menu.append('\r\n<li class="' + active + '"><a href="' + link_text + '" ' + target + ' ' + isBookmark + '>' + obj[i].name + '</a></li>');
	            } 
	            idx++;
	        }
		}

		if(typeof b.VALIDPLAN != 'undefined' && b.VALIDPLAN) {
			if(typeof b.VALIDTYPE != 'undefined' && b.VALIDTYPE == "BN" && typeof b.SITEUM != 'undefined' && b.SITEUM > -1) {
				$.umember.init(b.SITEUM,b.SITEUMLANG,b.SITEUMDISPLAY, function() { $.slang.init(b.SLANG);} );
			} else {
				$.slang.init();
			}
		}
	    $('header .navbar-nav').removeClass('hide').removeClass('preloading');
	    $('body,html').animate({scrollTop: 0}, 300,'easeInOutQuart');
	},
	galleryUpdate : function(el,data) {
		var _this = this;

        $('#el-empty').append($(data.source));
        $('#el-empty').find('[data-loop="true"]').html('');

		var gallery_empty = false,
			source = data.source,
			nodes = $(source).find('[data-loop="true"]').children(),
			p = $('#el-empty').children(),
            i = [],
            view = $(source).find("[data-loop='true']").data('view'),
            total = 0;

        if(typeof view == "undefined") view = 10;

        var cookie_page = 1,
            cookie_view = view;
            cookie_gallery_category = '',
            is_gc_cookie = (typeof $.cookie('gallery-category-'+el.seq) != 'undefined' && $.cookie('gallery-category-'+el.seq).length > 0) ? true : false;

        if($.cookie('loadmore-' + el.seq)) {
            cookie_page = $.cookie('loadmore-'+el.seq);
            cookie_gallery_category = $.cookie('gallery-category-'+el.seq);
            $.cookie('gallery-page-' + el.seq, cookie_page, { path : '/', expires: 12 * 60 * 60 * 1000 });
            $.cookie('gallery-category-' + el.seq, cookie_gallery_category, { path : '/', expires: 12 * 60 * 60 * 1000 });
            cookie_view = cookie_page * view;
            $.removeCookie('loadmore-'+el.seq, { path : '/' });  
        } else { 
            $.cookie('gallery-page-' + el.seq, 1, { path : '/', expires: 12 * 60 * 60 * 1000 });	
            $.cookie('gallery-category-' + el.seq, cookie_gallery_category, { path: '/', expires: 12 * 60 * 60 * 1000 });
        }		

        if(typeof data.total.list_total == 'undefined') {
	        total = data.total;
        } else {
	        total = data.total.list_total;
        }
        cookie_view = (cookie_view < total) ? cookie_view : total;

        if(total>0) gallery_empty = false;

        if(total > 0) {
            var loop_count = nodes.length, item_index = 0, elem = [];
            $.each(data.list,function(index,v) {
                loop_pos = index%loop_count;
                c = nodes[loop_pos];

                v.title = (v.title) ? v.title : 'Title';
                v.caption = (v.caption.length>0) ? v.caption : 'You can change this text';
                $(c).addClass('gallery-item').attr('data-index',index).attr('data-seq',v.seq);

                var vgsettings = (typeof v.gsettings != 'undefined' && v.gsettings) ? $.parseJSON(v.gsettings) : {},
			        img_path = (typeof vgsettings['storage'] != 'undefined') ? vgsettings['storage'] : _this.b.RESOURCE + "/" + _this.b.SID + "/",
			        img_original = (typeof vgsettings['storage'] != 'undefined') ? img_path + '1920/' : img_path;

				var folder = (data.element.folder == 0) ? "" : data.element.folder + "/";
				$(c).find('img').attr("src", img_path + folder + v.image);

				var glink = (typeof vgsettings['glink'] != 'undefined' && vgsettings['glink']) ? vgsettings['glink'] : '',
					glink_target = (typeof vgsettings['glink_target'] != 'undefined' && vgsettings['glink_target']) ? vgsettings['glink_target'] : '';

				if(glink) {
					if(glink.match(/^\@/g) !== null) { 														// link-type: link-bookmark ==> a[attr-bookmark]
						var bookmark_seq = glink.replace(/^\@/g,'');
						if(typeof _this.b.SETTINGS.blockBookmarkList == 'undefined' || typeof _this.b.SETTINGS.blockBookmarkList['bookmark' + bookmark_seq] == 'undefined') {
							glink = '';
							glink_target = '';
						}
                    } else if(_this.b.MENULIST.indexOf(glink.replace(/^\//g,"").replace(/ /g,"-")) > -1) {  // link-type: link-menu     ==> a[data-user-link]
                    } else {                                                                                // link-type: link-out      ==> a[attr-link]
						if(checkBase64Encode(glink)) glink = Base64.decode(glink);
					}
				}
									
				if(glink) {
					var glink_val = makeLinkUrl(glink, _this.b.ONE, _this.b.VIEW);

					$(c).find('a').removeAttr('data-gallery').removeAttr('data-user-link').removeAttr('attr-bookmark').removeAttr('attr-link');
					$(c).find('a').attr('href',glink_val);

					if(_this.b.MENULIST.indexOf(glink.replace(/ /g,'-'))>-1) {
						$(c).find('a').attr('data-user-link',glink_val);
					} else if(glink.match(/^\@/g)) {
						$(c).find('a').attr('attr-bookmark',glink.replace(/^\@/g,''));
					} else {
						$(c).find('a').attr('attr-link',glink);
					}
				} else {
                    $(c).find('a').removeAttr('data-user-link').removeAttr('attr-bookmark').removeAttr('attr-link');

					if (el.mode == "gallery") {
						$(c).find('a').attr("href", img_original + v.image);
						$(c).find('a').attr('data-gallery', '#gframe-' + v.seq);

			            var elsettings = (el.elsettings == "") ? {} : $.parseJSON(el.elsettings),
							img_onoff = (typeof elsettings.img_original_display == "undefined") ?  "OFF": elsettings.img_original_display;
						$(c).find('a').attr('data-img-original',img_onoff);
					} else {
						$(c).find('a').removeAttr('data-gallery');
						$(c).find('a').attr("href", ((_this.b.URL=="/") ? "" : _this.b.URL) + "/" + _this.b.PAGE + "/view/" + v.seq);
					}
				}

				if(glink_target == '_blank') $(c).find('a').attr('target','_blank');
				else $(c).find('a').removeAttr('target');

                $(c).find('a').attr("data-title", v.title).attr('title',v.title);

                // caption
                var ftitle = $(c).find('h5.figure'),
                    fcaption = $(c).find('p.figure'),
                    fdatetime = $(c).find('.figure.datetime'),
                    fhashtag = $(c).find('.figure.hashtag');

                // datetime / hashtag
                if(fdatetime.length<1) {
                    $(c).find('figcaption').append('<div class="figure datetime hide"></div>');
                    fdatetime = $(c).find('.figure.datetime');
                }
                if(fhashtag.length<1) {
                    $(c).find('figcaption').append('<div class="figure hashtag hide"></div>');
                    fhashtag = $(c).find('.figure.hashtag');
                }

                $(c).find('figcaption').removeClass('hide');
                if (v.title || v.caption) {
                    ftitle.html(v.title);
                    var gallery_caption = v.caption;
                    gallery_caption = gallery_caption.replace(/\n/g, '<br />');
                    fcaption.html(gallery_caption);
                    fcaption.removeClass('hide');
                    fdatetime.text(v.datetime);
                    fhashtag.text(v.hashtag);
                }
                $(p).find('[data-loop="true"]').append($(c)[0].outerHTML);		 
            });
        } else {
            if(el.mode=='project') {
            	nodes.addClass('gallery-item');
                nodes.find('a').attr('href', ((this.b.URL=="/") ? "" : this.b.URL) + "/" + this.b.PAGE + "/view/template").removeAttr('data-gallery').find('img').attr('data-index',0);
            }
            $(p).find('[data-loop="true"]').append(nodes);
        }
        var tag = $(p)[0].outerHTML;
        $('#el-empty').empty();

        if (el.type == "gallery" || el.mode == "gallery") tag = appendGalleryFrame($(tag),el.seq,el.elsettings);
        $('.' + el.elname).html($(tag).html()).removeClass('preloading');

        // loadmore...
        if(typeof total == 'undefined') total = 0;
        if (el.type == "gallery" && total > view && total > cookie_view) {
            btn_class = (el.feature=='masonry') ? "gallery-loadmore masonry-layout" : "gallery-loadmore";
            $('.' + el.elname).find('.'+btn_class).remove();
            $('.' + el.elname).append('<div class="' + btn_class + '" data-total = "' + total + '" data-id="' + el.seq + '" data-page="' + (Number(cookie_page)+1)+ '" data-view="' + view + '" data-folder="' + el.folder + '" data-mode="' + el.mode + '">LOAD MORE &nbsp;(<span class="display">' + cookie_view + '</span> / ' + total + ')</div>');
        }

        if(el.type == "gallery") {
            var elsettings = (el.elsettings == "") ? {} : $.parseJSON(el.elsettings),
				category_onoff = (typeof elsettings.category_display == "undefined") ?  "OFF" : elsettings.category_display;
            $('.' + el.elname).attr('data-category',category_onoff);

            if(category_onoff == "ON") {
            	loadGalleryCategoryBlock($('.' + el.elname),el.seq,category_onoff,elsettings);
            	if(total==0 && !is_gc_cookie) $('.' + el.elname).find('.gallery-category-nav').addClass('empty');
            }
        }

        if(el.feature=='masonry')
        	this.refreshMasonry(el.elname);

	},
	forumUpdate : function(pid,page_num,view,page,data) {
		$.forum.update(pid, page_num, view, page, '', '', '',data);
	},
	refreshMasonry : function(el) {
	    var $container = $('.' + el + ' .container');
	    $container.imagesLoaded(function () {

	        $container.masonry({
	            itemSelector: '.grid',
	            columnWidth: '.grid'
	        });
	        $container.masonry();

	        $container.find('img').off('load.userEL502469').on('load.userEL502469', function () {
	            $container.masonry();
	        });
	    });		
	},
	displayComment : function(pid) {
	    var option = (this.b.PARENT.settings) ? jQuery.parseJSON(this.b.PARENT.settings) : {};
	    if(typeof option.comment_display == "undefined" || !option.comment_display || option.comment_display=="OFF") return false;
	    var checkUrl = this.b.PAGE.split(","),
	        type = (checkUrl[0] == "forum") ? "F" : "P";

	    $.comment.init({
	        pid : pid,
	        type : type
	    });
	},
	loaded : function() {
		var b = _this.b;
		if($('body').width() <= 768 && $('.dsgn-body').hasClass('sidebar')) {
			if($('header.navbar').hasClass('sidebar')) {
				cssSidebar('0px');
			}
			$('.dsgn-body').removeClass('sidebar').addClass('removed-sidebar');
		} else if ($('body').width() > 768 && $('.dsgn-body').hasClass('removed-sidebar')) {
			if($('header.navbar').hasClass('sidebar')) {
				cssSidebar($('header.navbar').outerWidth() + 'px');
			}
			$('.dsgn-body').removeClass('removed-sidebar').addClass('sidebar');
		}

        $('.carousel').carousel({
        	pause: 'none'
        });

        $('[data-fixed-width]').each(function() {
            $(this).css('width',$(this).attr('data-fixed-width')+'px');
        });
        
        SCREEN = getScreen();
        var targetUrl = document.URL,
        	isMoveLink = targetUrl.match(/#/g);

        $('.menu-logo-top').show();

    	if(typeof $.cookie('gallery-item') != 'undefined' && b.VIEW == '') {
    		moveGallery($.cookie('gallery-item'));
    		// $('body').scrollTo('.gallery-item[data-seq="' + $.cookie('gallery-item') + '"]',{offset:-100,easing : 'easeInOutQuart'});
    		// $.removeCookie('gallery-item', { path : '/' });
    	}

    	if(typeof $.cookie('forum-item') != 'undefined' && b.VIEW == '') {
    		scrollToBlock('.element[data-id="' + $.cookie('forum-item') + '"]', 1000);
    		$.removeCookie('forum-item', { path : '/' });
    	}

	    if(b.TRAFFICLIMIT) {
	    	if($('.made-with-creatorlink').length > 0) $('.made-with-creatorlink').hide();
	    	var host = (typeof SERVICE == 'undefined') ? property.SERVICE : SERVICE,
	    		str = (host.indexOf('gabia') > -1) ? '\
					<div class="traffic-limit-modal creatorlink-gabia">\
						<div class="inner-box text-center">\
	                        <p class="col-md-12 col-sm-12 col-xs-12">\
	                        	<a href="//www.gabia.com" target="_blank" class="gabia-logo"><img src="//storage.googleapis.com/i.addblock.net/gabia/logo_w.png" alt="Gabia logo" /></a>\
	                        	<img src="//storage.googleapis.com/i.addblock.net/gabia/logo_and.png" class="logo-and"/>\
	                        	<a href="//creatorlink.gabia.com" target="_blank" class="creatorlink-logo"><img src="//storage.googleapis.com/i.addblock.net/creatorlink_logo_w1.png" alt="Creatorlink-gabia logo" /></a>\
	                        	<a href="//www.gabia.com/mygabia/service" target="_blank" class="limit-txt">' + $.lang[LANG]['plan.traffice-space.limit.modal.text.gabia'] + ' </a>\
                        	</p>\
						</div>\
					</div>\
	    	' : '\
					<div class="traffic-limit-modal">\
						<div class="inner-box text-center">\
	                        <p class="col-md-6 col-sm-12 col-xs-12 col-md-offset-3"><a href="//creatorlink.net"><img src="//storage.googleapis.com/i.addblock.net/creatorlink_logo_w.png" alt="Creatorlink logo" />' + $.lang[LANG]['plan.traffice-space.limit.modal.text'] + ' <i class="fa fa-angle-double-right" aria-hidden="true"></i></a></p>\
                            <p class="col-md-3 col-sm-12 col-xs-12"><a href="//creatorlink.net"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + $.lang[LANG]['plan.traffice-space.limit.modal.title'] + '</a></p>\
						</div>\
					</div>\
	    	';
	    	$('body').append(str);
	    } else {
    		if($('.made-with-creatorlink').length > 0 && $('.made-with-creatorlink').css('display') == "none") $('.made-with-creatorlink').show();
	    }

    	if($('body').width() > 768) {
    		$('.form-date').attr('type','text');
    		$('.form-date').attr('maxlength','2');
    		$('.date-yyyy').attr('maxlength','4');
    	}



        // menu sidebar - height overflow
        if($('.el-menu header').hasClass('sidebar')) {
			if($('body').width() > 768) {
				setTimeout(function() {
					var menu_offset_top = ($('.el-menu header.navbar #tpl-menu').offset().top - $('header').offset().top) - 15,
						sidebar_menu = $('.el-menu header.navbar #tpl-menu').innerHeight(),
						sidebar_menu_last = $('.el-menu header.navbar #tpl-menu > li').eq( $('.el-menu header.navbar #tpl-menu > li').length-1 ),
						sidebar_menu_list_padding = (sidebar_menu_last.find('.dropdown-menu').length > 0) ? sidebar_menu_last.find('.dropdown-menu').innerHeight() + 30 : 60,
						submenu_max_height = 0;

					$('.el-menu header.navbar #tpl-menu > li > .dropdown-menu').each(function() {
						if($(this).innerHeight() > submenu_max_height) submenu_max_height = $(this).innerHeight();
					});

					var sidebar_menu_list_height = (submenu_max_height > 0) ? (menu_offset_top + sidebar_menu + submenu_max_height) + 'px' : 'auto',
	                    sidebar_menu_list_max_height = window.innerHeight - menu_offset_top;
						
					$('.el-menu header.navbar #tpl-menu').closest('.collapse').css({
						'padding-bottom': sidebar_menu_list_padding + 'px',
						'height': sidebar_menu_list_height,
						'max-height': sidebar_menu_list_max_height + 'px',
					});
				}, 1000);
			} else {
				$('.el-menu header.navbar #tpl-menu').closest('.collapse').removeAttr('style');
			}

        }

        $.modalOFF();
	},
	loadPage : function(page) {

	}
}

var setlimitdiskPopup = function() {
	var icon = '<i class="site-space-icon fa fa-exclamation-circle"></i>',
		str = '<div class="site-space-disk">\
					<p>'+$.lang[LANG]['plan.disk-space.popup.limit.contents']+'</p>\
				</div>\
				';

	$(this).showModalFlat(icon + $.lang[LANG]['plan.disk-space.popup.limit.title'], str,false,false).addClass('flat-site-spacelimit-modal');
	$('.modal-backdrop.in').css('opacity','0');
}

var setSitePopup = function() {
    if(typeof property.SETTINGS != 'undefined' && property.SETTINGS.showPopup === true && typeof property.SETTINGS.sitePopup != "undefined" ) {
        sitePopupOpen();
    }
}

var sitePopupOpen = function(idx,data) {
	var site_popup = (typeof data != 'undefined' & data) ? data : new Array();
	if(site_popup.length == 0)  site_popup = (typeof property.SETTINGS.sitePopup != 'undefined' && property.SETTINGS.sitePopup) ? property.SETTINGS.sitePopup : site_popup;
	if(site_popup.length > 0) {
        $('.refresh-popup').show().removeAttr('style');
        var isShow = true;

		if(typeof idx != 'undefined') {
			if($('#'+property.SID+'Popup'+idx).length == 0) isShow = false;
			else $('#'+property.SID+'Popup'+idx).fadeIn();
		} else {

			if($('.site-popup .modal-popup').length > 0) { 
				$('.site-popup .modal-popup').fadeIn();
			} else { 
				isShow = false; 
			}
		}
		var popVpmode_opt = $('.mobilepc_ch').attr('data-desktop-option'),
			popVpmode = popVpmode_opt ? popVpmode_opt : property.SETTINGS.viewportMode;

		if(!isShow) {
	        var modal = $(this).showPopupModal(site_popup,property.SID,popVpmode,property.SETTINGS.vpMode_onoff);
	        return modal;
	    }
	}
}

var sitePopupResize = function() {
	if($('.popup').find('.modal-popup').length == 0) return false;
	$('.modal-popup').each(function(i) {
		if($(this).css('display') != 'none') {
			var popupEL = $('.modal-popup[data-idx="'+i+'"]'),
				b_w = $(this).closest('.popup-modal').width(),
				p_l = parseInt(popupEL.css('left').replace('px','')),
				p_m_l = i*parseInt(popupEL.css('margin-left').replace('px','')),
				p_w = popupEL.width();

			if(b_w <= p_l + p_m_l + p_w) {
                if($(this).closest('.popup-modal').hasClass('popupimg-overflow-y')) {
                    fitOverflowPopup(i,p_m_l);
                } else {
                    fitRefreshPopup();
                    return false;
                }
			}
		}
	});

	function fitOverflowPopup(idx,margin) {
		$('.modal-popup[data-idx="'+idx+'"]').css({'left': margin+'px'});
		$('.modal-popup[data-idx="'+idx+'"]').addClass('fit-popup fit-'+margin);
	}

	function fitRefreshPopup() {
		$('.modal-popup').each(function(idx) {
			var margin = idx*30,
				p_t = parseInt($(this).css('top').replace('px','')) + margin;

			$('.modal-popup[data-idx="'+idx+'"]').css({'left': margin+'px', 'top': p_t+'px'});
			$('.modal-popup[data-idx="'+idx+'"]').addClass('fit-popup fit-'+margin);
		});
	}
}


var activeEL = function(el) {
    header_fixed = $('header.navbar').height();
    var offset = ($('.dsgn-body').hasClass('sidebar')) ? 0 : -header_fixed;
    $('body').scrollTo('.'+el,0,{offset:offset});
}

var setLoginoutNav = function (sid, callback) {
	$('.creatorlink-header').remove();
	$('#tpl-menu li.loginout').remove();
	var str = '<div class="creatorlink-header">\n';
	str = str + '<div class="logo-text col-md-4 col-sm-6">\n';
	str = str + '	<a href="http://creatorlink.net"><img src="https://storage.googleapis.com/i.addblock.net/main/site_creatorlink_logo.png" alt="" /></a>\n';
	str = str + '</div>\n';
	str = str + '<div class="data-site col-md-4 col-sm-6 col-xs-6">\n';
	str = str + '	<ul>\n';
	str = str + '		<li class="profile-img"></li>\n';
	str = str + '		<li><span class="text">' + sid + '</span></li>\n';
	str = str + '	</ul>\n';
	str = str + '</div>\n';
	str = str + '<div class="data-user col-md-4 col-sm-6 col-xs-6">\n';
	str = str + '	<ul class="pull-right">\n';
	str = str + '		<li class="profile-img"></li>\n';
	str = str + '		<li><span class="caret"></span></li>\n';
	str = str + '	</ul>\n';
	str = str + '	<div class="message"></div>\n';
	str = str + '</div>\n';
	str = str + '</div>\n';
	str = str + '\n';
	str = str + '\n';
	$('.header.el-menu').before(str);
	var top = ($('header').hasClass('transparent')) ? '0' : '55px';
	$('.header.el-menu').css('top',top);
	if(top == '0') $('.creatorlink-header + .popover + .fixed-position').css('top','0');

	if(typeof callback == 'function') callback();
}

var getProfileAuthor = function(sid,img) {
	var imgstr = (img == 'https://storage.googleapis.com/i.addblock.net/member/profile_default.png') ? 'https://storage.googleapis.com/i.addblock.net/member/profile_default_top.png' : img;
	var str = 		'<span class="hexagon">\n';
		str = str + '	<svg viewBox="0 0 32 32">\n';
		str = str + '		<pattern id="pfimg-" + sid +"" patternUnits="userSpaceOnUse" width="32" height="32">\n';
		str = str + '			<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href=""+imgstr+"" x="-2px" y="-2px" width="36" height="36"></image>\n';
		str = str + '		</pattern>\n';
		str = str + '		<polygon points="16 0 30 8 30 24 16 32 2 24 2 8" fill="url(#pfimg-" + sid +")"></polygon>\n';
		str = str + '	</svg>\n';
		str = str + '</span>\n';
	$('.data-site .profile-img').append(str);
}

var getProfileMember = function() {
	$.getJSON('/template/checkLogin', function(data) {
		// if(!data.user) { }
		var imgstr = (data.myimg == 'https://storage.googleapis.com/i.addblock.net/member/profile_default.png') ? 'https://storage.googleapis.com/i.addblock.net/member/profile_default_top.png' : data.myimg;
		var str = 		'<span class="hexagon">\n';
			str = str + '	<svg viewBox="0 0 32 32">\n';
			str = str + '		<pattern id="pfimg-" + data.user +"" patternUnits="userSpaceOnUse" width="32" height="32">\n';
			str = str + '			<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href=""+imgstr+"" x="-2px" y="-2px" width="36" height="36"></image>\n';
			str = str + '		</pattern>\n';
			str = str + '		<polygon points="16 0 30 8 30 24 16 32 2 24 2 8" fill="url(#pfimg-" + data.user +")"></polygon>\n';
			str = str + '	</svg>\n';
			str = str + '</span>\n';
		$('.data-user .profile-img').append(str);
		$('.data-user .profile-img').addClass('user-'+data.name);
		$('.data-user .user-name').append('<span>'+data.name+'</span>');
		// $('.data-user .logoutlink').before('<span>You&apos;re logged in as '+data.name+' </span>');

		var str3_mysite = '';
		if($('.data-site ul li span.text').text() == data.sid) {
			$('.data-site').text('');
			var isNewmessage = (data.newCount == 0 ) ? false : true;
			var str2 = 		'<ul class="sub-menu pull-right">\n';
				str2 = str2 + '	<li class="newCount">\n';
				str2 = str2 + '		<a href="/message"><i class="fa fa-envelope"></i>\n';
				if(isNewmessage) str2 = str2 + '<span class="badge">"+data.newCount+"</span>\n';
				str2 = str2 + '</a>\n';
				str2 = str2 + '	</li>\n';
				str2 = str2 + '</ul>\n';
			$(".data-user .message").append(str2);
		} else {
			str3_mysite = '		<div class="item"><a href="http://'+data.sid+'.creatorlink.net"><img src="https://storage.googleapis.com/i.addblock.net/main/icon_mysite.png"/><img src="https://storage.googleapis.com/i.addblock.net/main/icon_mysite_active.png" class="active"/>'+ $.lang[LANG]['header.mysite'] + '</a></div>\n';
		}

		var str3 = 		'<div class="popover bottom" id="pop"+data.name+"">\n';
			str3 = str3 + '	<div class="arrow"></div>\n';
			str3 = str3 + '	<div class="popover-content">\n';
			str3 = str3 + '		<div class="user-name">"+data.name+"</div>\n';
			str3 = str3 + str3_mysite;
			str3 = str3 + '		<div class="item"><a href="http://creatorlink.net"><img src="https://storage.googleapis.com/i.addblock.net/main/icon_dashboard.png"/><img src="https://storage.googleapis.com/i.addblock.net/main/icon_dashboard_active.png" class="active"/>'+ $.lang[LANG]['header.dashboard'] + '</a></div>\n';
			str3 = str3 + '		<div class="item"><a href="/mypage" ><img src="https://storage.googleapis.com/i.addblock.net/main/icon_acc.png"/><img src="https://storage.googleapis.com/i.addblock.net/main/icon_acc_active.png" class="active"/>'+ $.lang[LANG]['header.mypage'] +'</a></div>\n';
			str3 = str3 + '		<div class="item"><a href="/profile/myboard" ><img src="https://storage.googleapis.com/i.addblock.net/main/icon_qna.png"/><img src="https://storage.googleapis.com/i.addblock.net/main/icon_qna_active.png" class="active"/>'+ $.lang[LANG]['header.cts'] +'</a></div>\n';
			str3 = str3 + '		<div class="item user-logout"><a href="/member/login/out" class="logoutlink"><img src="https://storage.googleapis.com/i.addblock.net/main/icon_logout.png"/><img src="https://storage.googleapis.com/i.addblock.net/main/icon_logout_active.png" class="active"/>'+ $.lang[LANG]['header.logout'] + '</a></div>\n';
			str3 = str3 + '	</div>\n';
			str3 = str3 + '	</div>\n';
		$('.creatorlink-header').after(str3);

	});
}

var pageHeight = function() {
    $('.page-comments').css('margin-top','0px');
    $('.el-footer').css('margin-top','0px');
    var docHeight = $('.dsgn-body').height();
    $('.dsgn-body').wrapInner('<div class="dsgn-body-wrap"></div>');
    var dsgnHeight = $('.dsgn-body-wrap').height();
    var diff = docHeight - dsgnHeight;
    $('.dsgn-body > .dsgn-body-wrap').contents().unwrap();
    return (diff>0) ? diff : 0;
}

var setHeight = function(height) {
	if(typeof property.VIEW == 'undefined' || property.VIEW == "") return false;
    if(height>0) {
        height = (typeof MODE == "undefined") ? height : height-35;
        if($('.page-comments').length) {
            $('.page-comments').css('margin-top',height+'px');
		} else if($('.page-bottomlist').length) {
			$('.page-bottomlist').css('margin-top',height+'px');
        } else if($('.el-footer').length) {
            $('.el-footer').css('margin-top',height+'px');
        }
    }
}

var appendGalleryFrame = function(tpl,seq) {
    tpl.find("[data-gallery]").attr('data-gallery','#gframe-' + seq);
    galleryFrame(seq);
    return tpl;
}

var galleryFrame = function (id) {
    var str = '\
		<div id="gframe-' + id + '" class="blueimp-gallery blueimp-gallery-controls">\
		    <div class="slides"></div>\
		    <h3 class="title"><p>caption test</p></h3>\
		    <a class="prev"><img src="https://storage.googleapis.com/i.addblock.net/icon/fa_gframe_prev.png" alt="" /></a>\
		    <a class="next"><img src="https://storage.googleapis.com/i.addblock.net/icon/fa_gframe_next.png" alt="" /></a>\
		    <a class="close"><img src="https://storage.googleapis.com/i.addblock.net/icon/fa_gframe_close.png" alt="" /></a>\
		    <a class="play-pause"></a>\
		    <ol class="indicator"></ol>\
		</div>\
    ';
    $('.gallery-frame').append(str);
}        

var makeLinkUrl = function(link, one, view) {
    var link_url = '', link_val = '',
        is_menu = (property.MENULIST.indexOf(link.replace(/ /g,'-'))>-1) ? true : false,
        regex = /^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,7}(\:[0-9]+)?(\/\S[^\{\}]*)?$/,
        regex2 = /^((http(s?))\:\/\/)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,7}(\:[0-9]+)?(\/\S[^\{\}]*)?$/;
    
        if(one) {
        	link_url = (view) ? '/#' : '#';
        	link_url = (view && !property.PUBLISH) ? '/render/index#' : link_url;
        	if(is_menu) link_url = "/";
        } else {
            link_url = (property.URL=="/" || is_menu) ? "/" : property.URL + "/"; 
        }

        if(link) {
            link_val = (property.MENULIST.indexOf(link.replace(/ /g,'-'))>-1) ? link_url + link.replace(/ /g,'-') : (!regex2.test(link) && regex.test(link)) ? '//'+link : link;
        }
    return link_val;
}

var checkError = function(data) {
    if(typeof data.error != "undefined" && data.error) {
        alert(data.error);
        if(data.error=="No user data") {
            location.href='/member/login';
        }
        return true;
    }
    return false;
}

var funcCallback = function(func,callback) {
    func();
    if(typeof callback=='function') {
        callback();
    }
}

var cssSidebar = function(width) {
	var dsgn_css = CSSJSON.toJSON($('#dsgn-body').text());
	if(typeof dsgn_css['children']['.dsgn-body.sidebar'] == 'undefined') {
		dsgn_css['children']['.dsgn-body.sidebar'] = {'children' : {}, 'attributes' : { 'padding-left' : ''}};
	}
		
	dsgn_css['children']['.dsgn-body.sidebar']['attributes']['padding-left'] = width;
	$('#dsgn-body').text(CSSJSON.toCSS(dsgn_css));
}
var getScreen = function() {
    var wid = window.innerWidth;

    var screen_size = 0;
    if (0 < wid && wid < 480) {
        screen_size = 320;
    } else if(wid <= 480 && wid <768) {
        screen_size = 480;
    } else if (768 <= wid && wid < 992) {
        screen_size = 768;
    } else if (992 <= wid && wid < 1200 ) {
        screen_size = 992;
    } else if (wid >= 1200) {
        screen_size = 1200;
    }

    return screen_size;
}

var getScreenIndex = function() {
    var idx = 0;
    switch(SCREEN) {
        case 320:
        case 480:
            idx = 2;
            break;
        case 769:
            idx = 1;
            break;

        case 992:
        case 1200:
            idx = 0;
            break;

        default : idx = 0; break;
    }
    return idx;
}
var moveGallery = function(element) {
    var header_fixed = $('header.navbar').height();
    	offset = ($('.dsgn-body').hasClass('sidebar')) ? 0 : -header_fixed,
    	$item = $('.gallery-item[data-seq="'+element+'"]');

    if($('header.navbar').hasClass('disableOffset') && !$('.'+link).hasClass('el_0')) offset = 0;
    if($item.length==0) return;
    var sTop = $item.offset().top + offset;
    $('html, body').animate({
        scrollTop: sTop
    },1000, 'easeInOutQuart');		  

    $.removeCookie('gallery', { path: '/' });
    $.removeCookie('gallery-item', { path : '/' });
}

var scrollToBlock = function(el,interval) {
    var header_fixed = $('header.navbar').height();
    	offset = ($('.dsgn-body').hasClass('sidebar')) ? 0 : -header_fixed,
    	$item = $(el);

    if($('header.navbar').hasClass('disableOffset') && !$('.'+link).hasClass('el_0')) offset = 0;
    interval = (typeof interval == 'undefined') ? 1200 : interval;

    if($item.length==0) return;
    var sTop = $item.offset().top + offset;
    $('html, body').animate({
        scrollTop: sTop
    },interval, 'easeInOutQuart');
}

var clearDsgnbody = function() {
	$('.menu-lock-block').remove();
	$('.config-image-view').hide();
	$('.forum-view').remove();
	$('.page-comments').remove();
	$('.page-bottomlist').remove();
	$('.tpl-page-footer').remove();
	$('.el-footer').hide();
	var element = $('div[class*="el_"]'),
		css = $('style[id*="el_"]'),
		js = $('script[id*="js_"]');

	element.remove();
	css.remove();
	js.remove();
	// $.each(element, function(i,v) {
	// 	$('.el_' + (i+1)).remove();
	// 	$('#el_' + (i+1) + 'css').remove();
	// 	$('#js_' + (i+1)).remove();
	// });
}

var golink = function(_this,link) {
	var wloc = window.location,
		local_link = (wloc.hostname == link.hostname) ? true : false;

	if(local_link) {
    	var loc = link.pathname,
    		uri = (_this.b.PUBLISH) ? loc : loc.replace('/render/','');

    	if((uri == "/render" || uri == "/") && !_this.b.ONE) {
    		uri = _this.b.MENULINK[0];
    	}

    	var go = (_this.b.PUBLISH) ? "/" + uri + link.hash: "/render/" + uri + link.hash;
		_this.history.pushState(null,_this.b.TITLE,go);
	} else {
		location.href = link.href;
	}
}

var parallax = function() {
	var deviceScreen = getScreen();
    $('.element[data-parallax="true"]').each(function() {
        //var yPos = -($('body').height() - $(document).scrollTop());
        // var yPos = -($(this).offset().top - $(document).scrollTop());

        // yPos = (yPos/100);
        // coords = '50% '+ yPos + 'px';
        // if(isMobile())
	       //  $(this).css('background-attachment','fixed !important');
        // else 
        var deviceAgent = navigator.userAgent.toLowerCase();
		if (deviceAgent.match(/(iphone|ipod|ipad)/)) {
			$(this).css('background-attachment','scroll');
		} else {
			$(this).css('background-attachment','fixed');
		}
        $(this).css('background-position','center center');
        $(this).css('-webkit-background-size','cover');
		$(this).css('-moz-background-size','cover');
		$(this).css('-o-background-size','cover');
		$(this).css('background-size','cover');
        $(this).css('background-repeat','no-repeat');
    });
}


		var loadGalleryCategoryBlock = function(el,pid,category_onoff,settings) {
		    var $el = el,
		        margin_val = $el.find('.row[data-loop="true"]').css('margin-left'),
		        padding_val = $el.find('.grid').first().css('padding-left'),
		        gc = (category_onoff == "ON") ? true : false;

		    if(pid) {
		        if(gc) {
		            if($el.find('.gallery-category-wrap').length == 0) {
		                if(typeof $el.attr('data-msny') != "undefined" && $el.attr('data-msny') == "true" ) $el.prepend(galleryCategoryBlockNav(pid,category_onoff,settings));
		                else $el.find('[data-loop="true"]').before(galleryCategoryBlockNav(pid,category_onoff,settings));
		            } else {
		                $el.find('.gallery-category-wrap').replaceWith(galleryCategoryBlockNav(pid,category_onoff,settings));
		            }
				    if($el.find('.row[data-loop="true"]').find('.emptyGalleryItem').length > 0 && $el.find('.gallery-category-nav .active').index() == 0) $el.find('.gallery-category-nav').addClass('empty');
		        } else {
		            $el.find('.gallery-category-wrap').remove();
		        }
		    }

		    $el.find('.gallery-category-wrap').css({'margin-left': margin_val, 'margin-right': margin_val });
		    $el.find('.gallery-category-nav').css({'padding-left': padding_val, 'padding-right': padding_val });

		    var gc_width_control = ($el.find('.container').hasClass('full-width')) ? true : false; 
		    if(typeof $el.attr('data-msny') != "undefined" && $el.attr('data-msny') == "true" || gc_width_control) {
		        var width = (gc_width_control && $el.find('.container').css('margin')=="0px") ? $el.find('.container').outerWidth()-40 : $el.find('.container').outerWidth();
		        $el.find('.gallery-category-wrap').css({'width': width, 'margin':'0 auto'});
		    }

		}

		var galleryCategoryBlockNav = function(pid,category_onoff,settings) {
		    var str = "";

		    var gallery_category_home = (typeof settings.category_home == "undefined") ? "All" : settings.category_home,
        		gallery_settings_category = (typeof settings.category == "undefined") ? "" : settings.category.replace(/\|/g,"").replace(/\,/g,", "),
			    gallery_settings_category_color = (typeof settings.category_color_type == "undefined") ? '' : settings.category_color_type,
			    category_nav_list = '',
			    g_category = (typeof gallery_settings_category != "undefined" && gallery_settings_category) ? gallery_settings_category.split(',') : {};

	        var active_arr = [],
	            cookie_gallery_category = unescape($.cookie('gallery-category-'+pid));

		        $.each(g_category, function(i,v) {
		            var active = (v.trim() == cookie_gallery_category) ? 'active' : '';
		            active_arr.push(active);
		            if(v) category_nav_list = category_nav_list + '\
		                    <li class="'+active+'"><a href="javascript:;" data-idx="'+ (i+1) +'">'+v.trim()+'</a></li>\
		                ';
		        });

		        var active_empty = ($.inArray('active',active_arr) == -1) ? 'active' : '';
		        str = '\
		            <div class="gallery-category-wrap">\
		                <ul class="gallery-category-nav" data-category-color="' + gallery_settings_category_color + '">\
		                    <li class="'+active_empty+'"><a href="javascript:;" data-idx="0">' + gallery_category_home + '</a></li>\
		                    ' + category_nav_list + '\
		                </ul>\
		            </div>\
		        ';
		    return str;
		}

function isMenuLock(callback) {
    var is_lock_block = 'active', r;
    if(property.ISLOCK == 'true') { 
    	r = $.post('/template/menuLockController/type/lock_check', {s: property.SMENU, sid: property.SID, page: property.PAGE, publish : property.PUBLISH}, function(data) {
			var lock_type = data.lock_type,
				lock_error_type = (typeof data.error_data != "undefined" && data.error_data.type) ? '.' + data.error_data.type : '';

			if(!data.error && data.result) { 
				property.ISLOCK = 'false';
			} else {
				var text = $.lang[LANG]["render.meun-lock." + lock_type + ".text"];

				if (lock_type=='umlevel') {
					text = $.lang[LANG]["render.meun-lock." + lock_type + ".text" + lock_error_type ];
					if(lock_error_type == '.lowerlevel') text = text.replace(/\#/gi, data.error_data.umlevel);
				}

				var str = "\
							<div class='menu-lock-block'>\
								<div class='inner-box text-center'>\
									<div class='form-inline' role='form'>\
										<div clas='text'>\
											<p> " + text + " </p>\
										</div>";
					if(lock_type=='password') {
						str = str + "\
										<div clas='form-group'>\
											<input class='form-control' type='password' placeholder='password' data-lock-password=''/>\
											<label class='error-text'></label>\
										</div>\
										<div clas='form-group'>\
											<span class='btn' data-edit='true' data-selector='.btn' data-lock-submit=''>Okay</span>\
										</div>\
						";
					}
					str = str + "\
									</div>\
								</div>\
							</div>\
				";
		        $('.header.el-menu').after(htmlspecialchars_decode(str));
			}
		    if(typeof callback == 'function') {
		    	callback();
		    }

    	},'json');
    } else {
	    if(typeof callback == 'function') {
	    	callback();
	    }
	}
}

function galleryStartHover() {
    $(this).find('figure').addClass("hover");
};
function galleryCloseHover() {
    $(this).find('figure').removeClass("hover");
};
function galleryMovelink() {
	$(this).find('a').click();
};
