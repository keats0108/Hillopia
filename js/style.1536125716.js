var style = new function () {
	var base = this;
	this.fonts = FONTS;
	var getPropertyValue = function(k,v) {
		switch(k) {
			case "background-color":
				base.property.bgColor = v;
				break;
			case "background-image":
				base.property.bgUrl = $(base.selector).css('background-image');
				break;
			case "background-repeat":
				// base.property.bgRepeat = (!base.property.bgRepeat) ? "no-repeat" : $(base.selector).css('background-repeat');
				base.property.bgRepeat = $(base.selector).css('background-repeat');
				break;
			case "background-position":
				// base.property.bgPosition = (!base.property.bgPosition || base.property.bgPosition=='0% 0%') ? "center center" : $(base.selector).css('background-position');
				base.property.bgPosition = $(base.selector).css('background-position');
				break;
			case "background-attach":
				base.property.bgAttach = $(base.selector).css('background-attach');
				break;
			case "background-size":
				// base.property.bgSize = (!base.property.bgSize) ? "cover" : $(base.selector).css('background-size');
				base.property.bgSize = $(base.selector).css('background-size');
				break;
			// case "background-attachment":
			// 	base.property.bgAttachment = (base.property.bgSize == "cover") ? 'fixed' : 'scroll';
			// 	break;
			case "color":
				_txcolor = v.match(/#[\w]{1,6}/gi);
				base.property.txColor = (_txcolor!=null) ? _txcolor[0] : '';
				break;
			
			case "padding": case "padding-left": case "padding-right": case "padding-top": case "padding-bottom":
				base.property.pdTop = $(base.selector).css('padding-top').replace("px","");
				base.property.pdBottom = $(base.selector).css('padding-bottom').replace("px","");
				base.property.pdLeft = $(base.selector).css('padding-left').replace("px","");
				base.property.pdRight = $(base.selector).css('padding-right').replace("px","");
				break;

			case "font-size":
				base.property.txSize = $(base.selector).css('font-size').replace("px","");
				break;

			case "font-family":
				base.property.txName = $(base.selector).css('font-family');	
				break;
		}

	};

	this.get = function(j,selector) {
		this.property = {
			bgColor : '',
			bgPosition : '',
			bgRepeat : '',
			bgUrl : '',
			bgAttach : '',
			bgSize : '',
			bgAttachment: '',
			txColor : '',
			txSize : 0,
			txName : '',
			
			pdTop : 0,
			pdBottom : 0,
			pdLeft : 0,
			pdRight : 0
		};

		selector = '.' + selector;
		this.selector = $(selector);

		if(typeof j["children"][selector] != "undefined") {
			var c = j["children"][selector]["attributes"];
			$.each(c,function(k,v) {
				getPropertyValue(k,v);
			});
			if(!this.property.bgPosition) this.property.bgPosition = 'center center';
			if(!this.property.bgRepeat) this.property.bgRepeat = 'no-repeat';
			if(!this.property.bgSize) this.property.bgSize = 'cover';
			if(!this.property.bgAttachment) this.property.bgAttachment = 'scroll';
		}
		return this.property;
	};

	this.set = function(j,o,selector,key,val,path) {
		selector = '.' + selector;
		var r = initObject(j,selector);

		switch(key) {
			case "background-color-all":
			case "background-color":
				o.bgColor = style.getColorORTransparent(val);
				
				if(selectEL=='el-menu') { 
					style.setCssProperty(j,selector,key,o.bgColor); 
				}
				break;
			case "background-position": 	
				o.bgPosition = (!o.bgPosition || o.bgPosition=="0% 0%") ? "center center" : o.bgPosition;
				break;
			case "background-image": 		
				//o.bgUrl = "url(" + p + '/1200/' + val + ")";
				val = encodeURIComponent(val);
				o.bgUrl = (val!="none") ? "url('" + path + '/' + val + "')" : val;

				if(selectEL=='el-menu') {
					var version = ($('.'+selectEL).find('header').hasClass('navbar-simple')) ? 'simple' : 'default',
						selector_set = getMenuCssSelector(key,selector,version);

					if(!$.isEmptyObject(selector_set.delete)) {
						$.each(selector_set.delete, function(k,v) {
							style.deleteCssProperty(j,v);
						});
					}

					if(!$.isEmptyObject(selector_set.set)) {
						$.each(selector_set.set, function(k,v) {
							v = (v.indexOf('↵') > -1) ? v.replace(/↵/gi, '\n') : v;
							v = v.replace(/\, /gi,'\,');

							if(typeof j["children"][v] == "undefined") initObject(j,v);
							if(val == 'none') {
								var bg_color = $('.bg-picker-el-menu').css('background-color');
								j["children"][v]["attributes"]['background-color'] = bg_color;
							} else {
								if(k.match(/main/gi) !== null) j["children"][v]["attributes"]['background-color'] = 'transparent';
							}
						});
					}

				}
				break;
			// case "background-attachment": 	
			// 	o.bgAttachment = (o.bgSize == 'cover') ? 'fixed' : 'scroll';
			// 	break;
			case "background-repeat":
				o.bgRepeat = (!o.bgRepeat) ? "no-repeat" : o.bgRepeat;
				break;
			case "background-size": 		
				o.bgSize = (!o.bgSize) ? "cover" : o.bgSize;
				break;
			case "color": 					o.txColor = val; break;
			case "padding":
				o.pdTop = this.selector.css('padding-top').replace("px","");
				o.pdBottom = this.selector.css('padding-bottom').replace("px","");
				o.pdLeft = this.selector.css('padding-left').replace("px","");
				o.pdRight = this.selector.css('padding-right').replace("px","");
				break;
		}

		delete j["children"][selector]["attributes"]["padding-left"];
		delete j["children"][selector]["attributes"]["padding-right"];
		delete j["children"][selector]["attributes"]["padding-top"];
		delete j["children"][selector]["attributes"]["padding-bottom"];

		j["children"][selector]["attributes"]["background-color"] = o.bgColor;
		j["children"][selector]["attributes"]["background-image"] = o.bgUrl;
		if($(selector).attr('data-parallax') == "true") {
			j["children"][selector]["attributes"]["background-attachment"] = 'fixed';
		}
		/*
		j["children"][selector]["attributes"]["background-repeat"] = (!j["children"][selector]["attributes"]["background-repeat"]) ? "no-repeat" : this.selector.css('background-repeat');
		j["children"][selector]["attributes"]["background-position"] = (!j["children"][selector]["attributes"]["background-position"]) ? "center center" : this.selector.css('background-position');
		j["children"][selector]["attributes"]["background-size"] = (!j["children"][selector]["attributes"]["background-size"]) ? "cover" : this.selector.css('background-size');
		*/
		j["children"][selector]["attributes"]["background-repeat"] = o.bgRepeat;
		j["children"][selector]["attributes"]["background-position"] = o.bgPosition;
		j["children"][selector]["attributes"]["background-size"] = o.bgSize;
		// j["children"][selector]["attributes"]["background-attachment"] = o.bgAttachment;

		j["children"][selector]["attributes"]["padding"] = o.pdTop + 'px ' + o.pdRight + 'px ' + o.pdBottom + 'px ' + o.pdLeft + 'px';
		j["children"][selector]["attributes"]["color"] = o.txColor;
		j["children"][selector]["attributes"]["font-family"] = this.selector.css('font-family');
		j["children"][selector]["attributes"]["font-size"] = this.selector.css('font-size');
		return j;
	}


	var getMenuCssSelector = function(key, selector, version) {
		var str = '',
			user = '.menu-' + SID,
			simple_user = (selector.indexOf('menu-temp')>-1) ? '.menu-temp-' + SID : user,
			default_selector = {
				"color" : { 
					"default" : user + " ul.navbar-nav > li > a,\n" 
								+ user + " ul.navbar-nav > li > a:active,\n"
								+ user + " ul.navbar-nav > li > a:focus,\n"
								+ user + " .dropdown-menu > li > a,\n"
								+ user + " .dropdown-menu > li > a:active,\n"
								+ user + " .dropdown-menu > li > a:focus",
					"hover"	  : user + ".navbar-default .navbar-nav > li > a:hover,\n"
								+ user + ".navbar-default .navbar-nav > li:hover > a,\n"
								+ user + ".navbar-default .navbar-nav > li:hover > a:focus,\n" 
								+ user + ".navbar-default .navbar-nav > li:hover > a:active,\n" 
								+ user + ".navbar-default .navbar-nav > li.active > a,\n"
								+ user + ".navbar-default .navbar-nav > li.active > a:focus,\n"
								+ user + ".navbar-default .navbar-nav > li.active > a:active,\n"
								+ user + ".navbar-default .navbar-nav > li.active > a:hover,\n"
								+ user + ".navbar-default .dropdown-menu > li > a:hover,\n"
								+ user + ".navbar-default .dropdown-menu > li:hover > a,\n"
								+ user + ".navbar-default .dropdown-menu > li:hover > a:focus,\n" 
								+ user + ".navbar-default .dropdown-menu > li:hover > a:active,\n" 
								+ user + ".navbar-default .dropdown-menu > li.active > a,\n"
								+ user + ".navbar-default .dropdown-menu > li.active > a:focus,\n"
								+ user + ".navbar-default .dropdown-menu > li.active > a:active,\n"
								+ user + ".navbar-default .dropdown-menu > li.active > a:hover"
				},
				"background-color" : {
					"default" : user + " .navbar-nav#tpl-menu .dropdown .dropdown-menu,\n"
								+ user + " .navbar-nav#tpl-menu",
					"init"	  : user + " ul.navbar-nav > li > a,\n" 
								+ user + " ul.navbar-nav > li > a:active,\n"
								+ user + " ul.navbar-nav > li > a:focus,\n"
								+ user + " .dropdown-menu > li > a,\n"
								+ user + " .dropdown-menu > li > a:active,\n"
								+ user + " .dropdown-menu > li > a:focus,\n"
								+ user + ".navbar-default .navbar-nav > li > a,\n"
								+ user + ".navbar-default .navbar-nav > li > a:focus,\n"
								+ user + ".navbar-default .navbar-nav > li > a:hover,\n"
								+ user + ".navbar-default .navbar-nav > li:hover > a,\n"
								+ user + ".navbar-default .navbar-nav > li:hover > a:focus,\n" 
								+ user + ".navbar-default .navbar-nav > li:hover > a:active,\n" 
								+ user + ".navbar-default .navbar-nav > li.active > a,\n"
								+ user + ".navbar-default .navbar-nav > li.active > a:focus,\n"
								+ user + ".navbar-default .navbar-nav > li.active > a:active,\n"
								+ user + ".navbar-default .navbar-nav > li.active > a:hover,\n"
								+ user + ".navbar-default .dropdown-menu > li > a:hover,\n"
								+ user + ".navbar-default .dropdown-menu > li:hover > a,\n"
								+ user + ".navbar-default .dropdown-menu > li:hover > a:focus,\n" 
								+ user + ".navbar-default .dropdown-menu > li:hover > a:active,\n" 
								+ user + ".navbar-default .dropdown-menu > li.active > a,\n"
								+ user + ".navbar-default .dropdown-menu > li.active > a:focus,\n"
								+ user + ".navbar-default .dropdown-menu > li.active > a:active,\n"
								+ user + ".navbar-default .dropdown-menu > li.active > a:hover",
				},
				"background-color-all" : {
					"default" : user + " .navbar-nav#tpl-menu .dropdown .dropdown-menu,\n"
								+ user + " .navbar-nav#tpl-menu",
				},
				"background-image" : {
					"default" : user + " .navbar-nav#tpl-menu .dropdown .dropdown-menu",
				},
				"border-color" : {
					"default" : "",
				},
				"font-size" : {
					"default" : user + " ul.navbar-nav > li > a,\n" 
						  		+ user + " ul.navbar-nav > li > a:focus,\n"
								+ user + " .dropdown-menu > li > a,\n"
								+ user + " .dropdown-menu > li > a:focus",
				},
				"font-family" : {
					"default" : user + " ul.navbar-nav > li > a,\n"
								+ user + " .dropdown-menu > li > a",
				},

			},
			simple_selector = {
				"color" : {
					"main_default"	: simple_user   + " ul.navbar-nav > li > a, \n"
									  + simple_user + " ul.navbar-nav > li > a:focus",
					"main_hover"	: simple_user   + " ul.navbar-nav > li > a:hover, \n"
									  + simple_user + " ul.navbar-nav > li:hover > a",
					"main_active"	: simple_user   + " ul.navbar-nav > li.active > a, \n"
									  + simple_user + " ul.navbar-nav > li.active > a:focus, \n"
									  + simple_user + " ul.navbar-nav > li.active > a:hover",
					"sub_default"	: simple_user   + " ul.dropdown-menu > li > a, \n"
									  + simple_user + " ul.dropdown-menu > li > a:focus",
					"sub_hover"		: simple_user   + " ul.dropdown-menu > li > a:hover, \n"
									  + simple_user + " ul.dropdown-menu > li:hover > a",
					"sub_active"	: simple_user   + " ul.dropdown-menu > li.active > a, \n"
									  + simple_user + " ul.dropdown-menu > li.active > a:focus, \n"
									  + simple_user + " ul.dropdown-menu > li.active > a:hover",
				},
				"background-color" : {
					"main_default"	: simple_user   + " ul.navbar-nav > li > a, \n"
									  + simple_user + " ul.navbar-nav > li > a:focus",
					"main_hover"	: simple_user   + " ul.navbar-nav > li > a:hover, \n"
									  + simple_user + " ul.navbar-nav > li:hover > a",
					"main_active"	: simple_user   + " ul.navbar-nav > li.active > a, \n"
									  + simple_user + " ul.navbar-nav > li.active > a:focus, \n"
									  + simple_user + " ul.navbar-nav > li.active > a:hover",
					"sub_default"	: simple_user   + " ul.dropdown-menu > li > a, \n"
									  + simple_user + " ul.dropdown-menu > li > a:focus",
					"sub_hover"		: simple_user   + " ul.dropdown-menu > li > a:hover, \n"
									  + simple_user + " ul.dropdown-menu > li:hover > a",
					"sub_active"	: simple_user   + " ul.dropdown-menu > li.active > a, \n"
									  + simple_user + " ul.dropdown-menu > li.active > a:focus, \n"
									  + simple_user + " ul.dropdown-menu > li.active > a:hover",
				},
				"background-color-all" : {
					"menublock"		: simple_user,
					"main_default"	: simple_user   + " ul.navbar-nav > li > a, \n"
									  + simple_user + " ul.navbar-nav > li > a:focus",
					"main_hover"	: simple_user   + " ul.navbar-nav > li > a:hover, \n"
									  + simple_user + " ul.navbar-nav > li:hover > a",
					"main_active"	: simple_user   + " ul.navbar-nav > li.active > a, \n"
									  + simple_user + " ul.navbar-nav > li.active > a:focus, \n"
									  + simple_user + " ul.navbar-nav > li.active > a:hover",
					"sub_default"	: simple_user   + " ul.dropdown-menu > li > a, \n"
									  + simple_user + " ul.dropdown-menu > li > a:focus",
					"sub_hover"		: simple_user   + " ul.dropdown-menu > li > a:hover, \n"
									  + simple_user + " ul.dropdown-menu > li:hover > a",
					"sub_active"	: simple_user   + " ul.dropdown-menu > li.active > a, \n"
									  + simple_user + " ul.dropdown-menu > li.active > a:focus, \n"
									  + simple_user + " ul.dropdown-menu > li.active > a:hover",
				},
				"background-image" : {
					"main_default"	: simple_user   + " ul.navbar-nav > li > a, \n"
									  + simple_user + " ul.navbar-nav > li > a:focus",
					"main_hover"	: simple_user   + " ul.navbar-nav > li > a:hover, \n"
									  + simple_user + " ul.navbar-nav > li:hover > a",
					"main_active"	: simple_user   + " ul.navbar-nav > li.active > a, \n"
									  + simple_user + " ul.navbar-nav > li.active > a:focus, \n"
									  + simple_user + " ul.navbar-nav > li.active > a:hover",
					"sub_default"	: simple_user   + " ul.dropdown-menu > li > a, \n"
									  + simple_user + " ul.dropdown-menu > li > a:focus",
					"sub_hover"		: simple_user   + " ul.dropdown-menu > li > a:hover, \n"
									  + simple_user + " ul.dropdown-menu > li:hover > a",
					"sub_active"	: simple_user   + " ul.dropdown-menu > li.active > a, \n"
									  + simple_user + " ul.dropdown-menu > li.active > a:focus, \n"
									  + simple_user + " ul.dropdown-menu > li.active > a:hover",
				},
				"border-color" : {
					"main_default"	: " ",
					"main_hover"	: " ",
					"main_active"	: " ",
					"sub_default"	: " ",
					"sub_hover"		: " ",
					"sub_active"	: " ",
				},
				"font-size" : {
					"main_default" : user + " ul.navbar-nav > li > a" ,
					"sub_default"  : user + " ul.dropdown-menu > li > a",
				},
				"font-family" : {
					"main_default" : user + " ul.navbar-nav > li > a" ,
					"sub_default"  : user + " ul.dropdown-menu > li > a",
				},
				"logo-color"  : {
					"color"				: simple_user + " #mini-home",
				},
			}

		if(version == 'simple') {
			str = { "delete" : default_selector[key], "set" : simple_selector[key] } ;

		} else {
			str = { "delete" : {}, "set" : default_selector[key] };
		}
		str = (version == 'simple') ? { "delete" : default_selector[key], "set" : simple_selector[key] } : { "delete" : {}, "set" : default_selector[key] };
		return str;
	}

	this.setCssProperty = function(j,selector,key,val) {
		selector = (selector.indexOf('↵') > -1) ? selector.replace(/↵/gi, '\n') : selector;
		selector = selector.replace(/\, /gi,'\,');
		if(typeof j["children"][selector] == "undefined") j = initObject(j,selector);

		if(selectEL == 'el-menu') {	
            var selectorKey = (key == 'color' && selector == '.menu-'+SID+' #tpl-logo-text') ? 'logo-color' : key,
				version = ($('.'+selectEL).find('header').hasClass('navbar-simple')) ? 'simple' : 'default',
				selector_set = getMenuCssSelector(key,selector,version);

			if(!$.isEmptyObject(selector_set.delete)) {
				$.each(selector_set.delete, function(k,v) {
					style.deleteCssProperty(j,v);
				});
			}

			if(key == 'background-color-all') key = 'background-color'; //menu block - all background color change
			if(!$.isEmptyObject(selector_set.set)) {

				if( selector == '.menu-'+SID+' ul#tpl-menu > li > a' || selector == '.menu-' + SID || selector == '.menu-temp-' + SID ) {
					if(selector == '.menu-'+SID+' ul#tpl-menu > li > a') style.deleteCssProperty(j,selector);
					var color = (key == 'color') ? this.setStyle(j,hex2rgb(val),'el-menu') : [];

					$.each(selector_set.set, function(k,v) {
						v = (v.indexOf('↵') > -1) ? v.replace(/↵/gi, '\n') : v;
						v = v.replace(/\, /gi,'\,');

						var value = (color.length== 0) ? val : ((k.match(/default/gi) !== null) ? color[0] : color[1]);
						if(typeof j["children"][v] == 'undefined') initObject(j,v);

						if( key == "background-color" && value.indexOf('transparent') == -1 && value.indexOf('rgba(0,0,0,0)') == -1 ) {
							var menu_bg_img = (typeof $('.'+selectEL).find('header').css('background-image') != 'undefined') ? $('.'+selectEL).find('header').css('background-image') : '';
							if(menu_bg_img && menu_bg_img!='none' && menu_bg_img!='initial' && menu_bg_img!='inherit') {
								// [MENU BLOCK] used Background-Image, ==> main menu bg : transparent, sub menu bg : color
								if(k.match(/main/gi) !== null ) value ='transparent';
							}
						}
						
						if( key == "font-size" && k.match(/sub/gi) !== null ) { //Sub Menu Font size 
							var f_size = parseInt(value.replace('px',''));
							value = (f_size - 2 ) + 'px';
						}

						if( key == "color" && version == 'simple' && k == 'main_default' ) { //Menu text color Change ==> Mobile Toggle bar color
							var block_selector = (selector.indexOf('menu-temp')>-1) ? '.menu-temp-' + SID : '.menu-' + SID,
								toggle_bar_selector = block_selector + " .navbar-toggle .icon-bar";

							if(typeof j["children"][toggle_bar_selector] == 'undefined') initObject(j,toggle_bar_selector);
                            j["children"][toggle_bar_selector]["attributes"]['background-color'] = value;
						}

						j["children"][v]["attributes"][key] = value;
					});

				} else {
					
                    if(selectorKey == 'logo-color') { //logo text color Change ==> Logo Top btn color width Change

                        var menu_btn_set = getMenuCssSelector(selectorKey,selector,version);
                        if(typeof menu_btn_set.set != "undefined" && menu_btn_set.set) {
	                        $.each(menu_btn_set.set, function(k,v) {
	                            if(typeof j["children"][v] == 'undefined') initObject(j,v);
	                            j["children"][v]["attributes"][k] = val;
	                        });
                        }
                    }

					j["children"][selector]["attributes"][key] = val;
				}

			} else {
				j["children"][selector]["attributes"][key] = val;
			}

		} else {

			//showcase index numbering
			if (selector == '.userEL' + $('.'+selectEL).attr('data-id') + ' .carousel-indicators li' && key=="border-color") {
				var indicator_type = $('.'+selectEL).find(".carousel-indicators").attr('data-indicator'),
					user = ".userEL" + $('.'+selectEL).attr('data-id'),
					index_focus = user + " .carousel-indicators li\n",
					index_hover = user + " .carousel-indicators li.active\n",	
					color = this.setStyle(j,hex2rgb(val),'rolling-index');

				initObject(j,index_focus);
				initObject(j,index_hover);

				if (indicator_type == "background") key = "background-color";
				if (indicator_type == "line-background") {
					//indicator border,bg-transparent //:active  border,background
					j["children"][index_focus]["attributes"][key] = color[0] + ' !important';
					j["children"][index_hover]["attributes"][key] = color[0] + ' !important';
					j["children"][index_hover]["attributes"]["background-color"] = color[0] + ' !important';
				} else {
					//indicator only line OR background
					j["children"][index_focus]["attributes"][key] = color[0] + ' !important';
					j["children"][index_hover]["attributes"][key] = color[1] + ' !important';
					j["children"][index_focus]["attributes"]["color"] = color[0] + ' !important';
					j["children"][index_hover]["attributes"]["color"] = color[1] + ' !important';
				}

			} else {
				j["children"][selector]["attributes"][key] = val;	
			}


		}
		return j;
	}

	this.getCssProperty = function(j,selector,key) {
		if(typeof j["children"][selector] == "undefined") j = initObject(j,selector);
		if(typeof j["children"][selector]["attributes"][key] == "undefined") {
			j["children"][selector]["attributes"][key] = "initial";
		}
		return j["children"][selector]["attributes"][key];
	}

	this.deleteCssProperty = function(j,selector) {
		if(typeof j["children"][selector] == "undefined") j = initObject(j,selector);
		delete j["children"][selector];
		return j;
	}

	this.find = function(j,selector) {
		for(var key in j.children) {
			if(key.indexOf(selector)>-1) return j.children[key].attributes["background-image"].trim().replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'');
		}
	}

	this.setTargetBackground = function(j,selector,val,p) {
		val = encodeURIComponent(val);
		for(var key in j.children) {
			if(key.indexOf(selector)>-1) {
				val = encodeURIComponent(val);
				j.children[key].attributes["background-image"] = "url('" + p + '/' + val + "'')";
			}
		}
		return j;
	}

	this.getHex = function(rgb) {
		if(rgb == 'transparent') return rgb;

		var rgb = this.getRGBobject(rgb),
	    	r = parseInt(rgb.r, 10).toString(16),
        	g = parseInt(rgb.g, 10).toString(16),
        	b = parseInt(rgb.b, 10).toString(16);

    	return "#"+ (
		        (r.length == 1 ? "0"+ r : r) +
		        (g.length == 1 ? "0"+ g : g) +
		        (b.length == 1 ? "0"+ b : b)
	        );
	}

	this.getRGBobject = function(rgb) {
		if(typeof rgb == 'undefined') rgb = "rgb(255,255,255)";
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		var r = [];

		r.r = rgb[1], r.g = rgb[2], r.b = rgb[3];
    	return r;
	}

	function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

	this.setStyle = function(j,rgb,el) {
		var r = parseInt(rgb.r), g = parseInt(rgb.g), b = parseInt(rgb.b),
			r1 = (r + 50 < 256) ? r + 50 : 255,
			g1 = (g + 50 < 256) ? g + 50 : 255,
			b1 = (b + 50 < 256) ? b + 50 : 255,
			r2 = (r - 50 > -1 ) ? r - 50 : 0,
			g2 = (g - 50 > -1 ) ? g - 50 : 0,
			b2 = (b - 50 > -1 ) ? b - 50 : 0,
			r3 = (r + 100 < 256 ) ? r + 100 : 255,
			g3 = (g + 100 < 256 ) ? g + 100 : 255,
			b3 = (b + 100 < 256 ) ? b + 100 : 255;

		var c1 = rgb2hex(r,g,b),
			c2 = rgb2hex(r1,g1,b1),
			c3 = rgb2hex(r2,g2,b2),
			c4 = rgb2hex(r3,g3,b3);

		if(el == "el-menu") {
			return [c1,c2];
		} else if (el =="rolling-index") {
			if(r<80 && g<80 && b<80) return [c1,c4];
			else if (r<150 && g<150 && b<150) return [c1,c2];
			else return [c1,c3];
		} else {
			return setStyleValue(j,c1,c2,c3);
		}
		
	}

	var setStyleValue = function(j,c1,c2,c3) {
		$.each(j.children, function(k,v) {
			switch(k) {
				// color
				case ".dsgn-body h3,\n.dsgn-body h4,\n.dsgn-body h5" :
				case ".dsgn-body a":
				case ".dsgn-body .alternative-font":
				case ".dsgn-body div.tabs ul.nav-tabs a,\n.dsgn-body div.tabs ul.nav-tabs a:hover":
					v.attributes["color"] = c1;
					break;

				case ".dsgn-body header ul.nav-main > li:hover > a,\n.dsgn-body header ul.nav-main li.active > a,\n.dsgn-body header ul.nav-main li.active > a:hover,\n.dsgn-body header ul.nav-main li.active > a:focus,\n.dsgn-body header ul.nav-main li.active i.icon-caret-down":
					v.attributes["color"] = c1 + ' !important';
					break;

				case ".dsgn-body a:hover":
					v.attributes["color"] = c2;
					break;

				case ".dsgn-body a:active":
					v.attributes["color"] = c3;
					break;

				// background-color
				case ".dsgn-body .text-bg":
				case ".dsgn-body .pagination > .active > a,\n.dsgn-body .pagination > .active > span,\n.dsgn-body .pagination > .active > a:hover,\n.dsgn-body .pagination > .active > span:hover,\n.dsgn-body .pagination > .active > a:focus,\n.dsgn-body .pagination > .active > span:focus":
				case ".dsgn-body .label-primary":
					v.attributes["background-color"] = c1 + " !important";
					break;

				// background-color + border-color
				case ".dsgn-body .btn-primary,\n.dsgn-body .pagination > .active > a,\n.dsgn-body ul.nav-pills > li.active > a":
					v.attributes['background-color'] = c1;
					v.attributes['border-color'] = "#006da3";
					break;
				/*
				case ".dsgn-body .btn-primary:hover,\n.dsgn-body .pagination > .active > a:hover,\n.dsgn-body ul.nav-pills > li.active > a:hover":
					v.attributes['background-color'] = "#008fd6";
					v.attributes['border-color'] = "#0074ad";
					break;
				*/
				case ".dsgn-body .btn-primary:focus,\n.dsgn-body .pagination > .active > a:focus,\n.dsgn-body ul.nav-pills > li.active > a:focus":
					v.attributes['background-color'] = "#007ab8";
					v.attributes['border-color'] = "#007ab8";
					break;

				case ".dsgn-body .btn-default,\n.dsgn-body .btn-default.btn-lg,\n.dsgn-body .btn-default.btn-sm,\n.dsgn-body .btn-default.btn-xs":
				case ".dsgn-body .label-default":
					v.attributes['border-color'] = c1;
					v.attributes['background-color'] = "transparent";
					v.attributes['color'] = c1;
					break;

				case ".dsgn-body .btn-default:hover,\n.dsgn-body .btn-default.btn-lg:hover,\n.dsgn-body .btn-default.btn-sm:hover,\n.dsgn-body .btn-default.btn-xs:hover":
					v.attributes['border-color'] = c2;
					v.attributes['background-color'] = "#0D0D0D";
					v.attributes['color'] = c2;
					break;

				case ".dsgn-body .btn-default:focus,\n.dsgn-body .btn-default.btn-lg:focus,\n.dsgn-body .btn-default.btn-sm:focus,\n.dsgn-body .btn-default.btn-xs:focus":
					v.attributes['border-color'] = c3;
					v.attributes['background-color'] = "#000000";
					v.attributes['color'] = c3;
					break;

				case ".dsgn-body div.tabs ul.nav-tabs a:hover":
					v.attributes['border-top-color'] = c1;
					break;

				case ".dsgn-body div.tabs ul.nav-tabs li.active a":
					v.attributes['border-top-color'] = c1;
					v.attributes['color'] = c1;
					break;
			}
		});
		return j;
	}

	this.selectFontForm = function(cls,fn,font) {
		if(typeof font=="undefined" || !font) {
			// console.log('undefined font-family');
			return false;
		}
		var tf = font.split(",");
		fn = tf[0].replace(/'/g,'').replace(/"/g,'').replace('-',' ').trim();
		var str = '';

		str = "<div class='" + cls + "'>";
		for(i=0;i<this.fonts.length;i++) {
			fonts_check = (fn==this.fonts[i]) ? "class='active'" : "";
			var font_tmp = this.fonts[i].replace(/ /g,'-'),
				font_name = (font_tmp in $.lang[LANG]) ? $.lang[LANG][font_tmp] : this.fonts[i];

			if(font_name.substring(0,1) != '@')
				str = str + "<div value='" + this.fonts[i] + "' " + fonts_check + " data-font-family='" + this.fonts[i] + "' style=\"font-family:'" + this.fonts[i] + "'\">" + font_name + "</div>";
			else
				str = str + "<hr />";
		}
		str = str + "</div>";
		return str;
	}

	this.rgbahex = function(rgb) {
		var rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		return (rgb && rgb.length === 4) ? "#" +
				("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	}

	this.selectGalleryCategoryColorSetForm = function(cls,fn,el,elname,colortype) {
		var selector = '.'+elname+' .gallery-category-nav li:not(.active) a, .'+elname+' .gallery-category-nav li:not(.active):before',
            active_selector = '.'+elname+' .gallery-category-nav li.active a, .'+elname+' .gallery-category-nav li a:hover, .'+elname+' .gallery-category-nav li a:focus, .'+elname+' .gallery-category-nav li.active:after',
			gc_type = [],
			gc_color = [],
			gc_colorHex = [],
			gc_colorOpacity = [],
			gc_colorset_state = [],
			default_color = ($('.'+elname).css('color') != 'undefined') ? $('.'+elname).css('color') : $('.dsgn-body').css('color');

		$.each(fn, function(i,v) {
			var color = (!v) ? default_color : v,
				opacity = '',
				colorHex = '',
				css_status = true;

			if(typeof v == 'undefined' || !v) {
				opacity = '0';
				css_status = false;

				if( i.indexOf('font')>-1 ) { 
					color = (i.indexOf('active')==-1) ? 'rgb(135, 135, 135)' : 'rgb(175, 175, 175)';
					opacity = '';
					colorHex = style.rgbahex(color);
				} 
				if ( i.indexOf('border')>-1 ) {
					color = '';
					colorHex = 'transparent';
				} 

			} else {
				colorHex = style.rgbahex(color);
				if(color.match(/\,/g) != null && color.match(/\,/g).length ==3) {
					opacity = color.substr((color.lastIndexOf(',')+1),(color.lastIndexOf(')')- (color.lastIndexOf(',')+1))).trim();
					colorHex = (opacity=='0') ? 'transparent' : colorHex;
					css_status = (opacity=='0') ? false : css_status;
				}
			}

			gc_type.push(i);
			gc_color.push(color);
			gc_colorHex.push(colorHex);
			gc_colorOpacity.push(opacity);
			gc_colorset_state.push(css_status);
		});

		var now_palette = '\
						<div class="color-line cg-font">\
							<div class="option_name">' + $.lang[LANG]["editor.gallery.category.font"] + '</div>\
							<div class="default-color">\
								<span class="color-picker">\
									<span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + selector + '" pn="color" data-toggle="tooltip" data-placement="top" title="color" data-opacity="" style="background-color: '+gc_colorHex[0]+'"></span>\
								</span>\
							</div>\
							<div class="active-color">\
								<span class="color-picker">\
									<span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + active_selector + '" pn="color" data-toggle="tooltip" data-placement="top" title="color" data-opacity="" style="background-color: '+gc_colorHex[1]+'"></span>\
								</span>\
							</div>\
						</div>\
		';

		var display_palette_box = (gc_colorset_state[2] || gc_colorset_state[3]) ? '' : 'disabled';
		now_palette = now_palette + '\
					<div class="color-line cg-box ' + display_palette_box + '">\
						<div class="option_name">' + $.lang[LANG]["editor.gallery.category.box"] + '</div>\
						<div class="default-color" data-gc-state="' + gc_colorOpacity[2] + '">\
							<span class="color-picker">\
								<span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + selector + '" pn="background-color" data-toggle="tooltip" data-placement="top" title="color" data-opacity="'+gc_colorOpacity[2]+'" style="background-color: '+gc_colorHex[2]+'"></span>\
							</span>\
						</div>\
						<div class="active-color" data-gc-state="' + gc_colorOpacity[3] + '">\
							<span class="color-picker">\
								<span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + active_selector + '" pn="background-color" data-toggle="tooltip" data-placement="top" title="color" data-opacity="'+gc_colorOpacity[3]+'" style="background-color: '+gc_colorHex[3]+'"></span>\
							</span>\
						</div>\
					</div>\
		';

		var display_palette_line = (gc_colorset_state[4] || gc_colorset_state[5]) ? '' : 'disabled';
		now_palette = now_palette + '\
					<div class="color-line cg-line ' + display_palette_line + '">\
						<div class="option_name">' + $.lang[LANG]["editor.gallery.category.line"] + '</div>\
						<div class="default-color" data-gc-state="' + gc_colorOpacity[4] + '">\
							<span class="color-picker">\
								<span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + selector + '" pn="border-color" data-toggle="tooltip" data-placement="top" title="color" data-opacity="'+gc_colorOpacity[4]+'" style="background-color: '+gc_colorHex[4]+'"></span>\
							</span>\
						</div>\
						<div class="active-color" data-gc-state="' + gc_colorOpacity[5] + '">\
							<span class="color-picker">\
								<span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + active_selector + '" pn="border-color" data-toggle="tooltip" data-placement="top" title="color" data-opacity="'+gc_colorOpacity[5]+'" style="background-color: '+gc_colorHex[5]+'"></span>\
							</span>\
						</div>\
					</div>\
		';

		var pnStr = '';
		$.each(gc_type, function(i,v) {
			if(gc_colorset_state[i]) pnStr = pnStr + v + ',';
		});

		var colorSet = ["black", "gray", "white", ''];
		$.each(colorSet, function(i, v) {
			colorSet[i] = (v == colortype) ? 'active' : '';
		});

		var str = '\
			<div class="btn-group btn-group-sm">\
				<div  class="btn-color-mode ' + colorSet[0] + '">\
					<button type="button" class="ctrl-gc-color" data-type="black" data-elname="' + elname + '" data-pn="' + pnStr + '"></button>\
				</div>\
				<div  class="btn-color-mode ' + colorSet[1] + '">\
					<button type="button" class="ctrl-gc-color" data-type="gray" data-elname="' + elname + '" data-pn="' + pnStr + '"></button>\
				</div>\
				<div  class="btn-color-mode ' + colorSet[2] + '">\
					<button type="button" class="ctrl-gc-color" data-type="white" data-elname="' + elname + '" data-pn="' + pnStr + '"></button>\
				</div>\
				<div class="btn-color-mode btn-group now-color-palette ' + colorSet[3] + '">\
					<button type="button" class="ctrl-gc-color" data-type="custom"><i class="fa fa-cog"></i></button>\
					<div class="dropdown-menu">\
						<div class="color-picker-wrap">\
							<div class="header-line">\
								<div class="option_name"></div>\
								<div class="default_color">' + $.lang[LANG]["editor.gallery.category.standard"] + '</div>\
								<div class="active_color">' + $.lang[LANG]["editor.gallery.category.rollover"] + '</div>\
							</div>\
							' + now_palette + '\
						</div>\
					</div>\
				</div>\
			</div>\
		';

		return str;
	}

	this.selectTextAlignForm = function(cls,fn,elname) {
		elname = (elname=='none' || typeof elname=='undefined') ? '.dsgn-body' : elname;
		var text_align_undefined = ['start', '-webkit-auto'];

		var ta = ($(elname).css('text-align') && $.inArray($(elname).css('text-align'),text_align_undefined)==-1) ? $(elname).css('text-align') : 'left',
			ta_l = (ta == 'left') ? 'active' : '',
			ta_c = (ta == 'center') ? 'active' : '',
			ta_r = (ta == 'right') ? 'active' : ''; 

		var str = '';

		str = '\
			<div class="btn-group btn-group-sm" data-toggle="buttons" role="group" aria-label="gallery category align">\
				<label class="ctrl-text-align-el btn btn-default '+ta_l+'" data-text-align="left" data-elname="'+elname+'"><input type="radio" name="gcalign" id="gcAlignLeft" autocomplete="off" /><img class="fa" src="https://storage.googleapis.com/i.addblock.net/icon-align-left.gif" alt="gallery category align left" /><img class="fa on" src="https://storage.googleapis.com/i.addblock.net/icon/icon-align-left_on.gif" alt="gallery category align left" /></label>\
				<label class="ctrl-text-align-el btn btn-default '+ta_c+'" data-text-align="center" data-elname="'+elname+'"><input type="radio" name="gcalign" id="gcAlignCenter" autocomplete="off" /><img class="fa" src="https://storage.googleapis.com/i.addblock.net/icon-align-center.gif" alt="gallery category align center" /><img class="fa on" src="https://storage.googleapis.com/i.addblock.net/icon/icon-align-center_on.gif" alt="gallery category align center" /></label>\
				<label class="ctrl-text-align-el btn btn-default '+ta_r+'" data-text-align="right" data-elname="'+elname+'"><input type="radio" name="gcalign" id="gcAlignRight" autocomplete="off" /><img class="fa" src="https://storage.googleapis.com/i.addblock.net/icon-align-right.gif" alt="gallery category align right" /><img class="fa on" src="https://storage.googleapis.com/i.addblock.net/icon/icon-align-right_on.gif" alt="gallery category align right" /></label>\
			</div>\
		';
		return str;
	}
	

	this.selectFontSelectForm = function(cls,fn,elname) {
		if(FONTS != this.fonts) { 
			this.fonts = FONTS ;
		}
		elname = (elname=='none' || typeof elname=='undefined') ? '.dsgn-body' : elname;
		var tf = $(elname).css('font-family');

		if(cls=='ctrl-font-family-el') tf = fn;

		if(tf==null) {
			console.log(cls);
			console.log(fn);
			console.log(elname);
			alert('Block config error : ' + elname + '\r\nstyle.js line: 306');
			return false;
		}
		tf = explode(",",tf);

		var str = '';

		str ='\
        <div class="btn-group">\
            <button type="button" class="btn btn-default dropdown-toggle font-preview" data-toggle="dropdown"><span class="' + cls + '-active" style="font-family:\'' + fn + '\'">' + fn + '</span> <span class="caret"></span></button>\
            <ul class="dropdown-menu scrollable-menu" role="menu">\
        ';
        
		for(i=0;i<this.fonts.length;i++) {
			fonts_check = (fn==this.fonts[i]) ? "active" : "";
			var font_tmp = this.fonts[i].replace(/ /g,'-'),
				font_name = (font_tmp in $.lang[LANG]) ? $.lang[LANG][font_tmp] : this.fonts[i];

			if(font_name.substring(0,1) != '@')
				str = str + "<li class='" + cls + " " + fonts_check + "' data-elname='" + elname + "' data-font-family='" + this.fonts[i] + "' style=\"font-family:'" + this.fonts[i] + "'\"><a href='javascript:;'>" + font_name + "</a></li>";
			else
				str = str + "<li class='dividers'><hr /></li>";
		}
        str = str + '\
            </ul>\
            <div class="default-language-box"><span class="btn-default-language"><img src="https://storage.googleapis.com/i.addblock.net/icon/fa_plus_icon_b.png" alt="" /> '+ $.lang[LANG]['editor.languages-support'] +'</span></div>\
        </div>\
	    ';
		return str;
	}

	this.selectBackgroundSelectForm = function(type,id,val,elname,ctrl_class) {
		var position = ["left top","left center","left bottom","right top","right center","right bottom","center top","center center","center bottom"],
			repeat = ["repeat","repeat-x","repeat-y","no-repeat"],
			bgsize = ["auto","cover","contain"],
			property = [];

		elname = (typeof elname == "undefined") ? "" : elname;
		ctrl_class = (typeof ctrl_class == "undefined") ? "" : ctrl_class;
		langCtrl = "";
		switch(type) {
			case "position" : 
				property = position; 
				langCtrl = type; 
				val = (val=='initial') ? "center center" : val;
				break;
			case "repeat" : 
				property = repeat; 
				langCtrl = type; 
				val = (val=='initial') ? "no-repeat" : val;
				break;
			case "bgsize" : 
				property = bgsize; 
				langCtrl = "size"; 
				val = (val=='initial') ? "cover" : val;
				break;
		}

		str = "<select class='form-control property-form " + ctrl_class + "' id='" + id + "' data-elname='" + elname + "'>";
		for(i=0;i<property.length;i++) {
			check = (property[i]==val) ? "selected" : "";
			var strlang = "editor.background." + langCtrl + "." + property[i].replace(" ","-");
			str = str + "<option value='" + property[i] + "' " + check + ">" + $.lang[LANG][strlang] + "</option>";
		}
		str = str + "</select>";
		return str;
	}

	var hex2rgb = function(hex) {
	    if (hex.lastIndexOf('#') > -1) {
	        hex = hex.replace(/#/, '0x');
	    } else {
	        hex = '0x' + hex;
	    }
	    var r = hex >> 16;
	    var g = (hex & 0x00FF00) >> 8;
	    var b = hex & 0x0000FF;
	    return rgb = { r : r, g : g, b : b};
	}

	var rgb2hex = function(r,g,b) {
		return "#" +
		("0" + parseInt(r,10).toString(16)).slice(-2) +
		("0" + parseInt(g,10).toString(16)).slice(-2) +
		("0" + parseInt(b,10).toString(16)).slice(-2);
	}

	var initObject = function(j,selector) {
		if(typeof j["children"][selector] == "undefined") {
			j["children"][selector] = {};
			j["children"][selector]["attributes"] = {};
		}
		return j;
	}

	var trim = function(str) {
		return str.replace(/^\s+|\s+$/g, '');
	}

	this.getElementProperty = function(property,selector,idx,el) {
		switch(property) {
			case "border" :
				var is_indicator = (selector.indexOf('carousel-indicators li') != -1 && $(selector).parents('.carousel-indicators').attr('data-indicator')=='background') ? true : false,
					color = (is_indicator) ? $(selector).css('background-color') : $(selector).css('border-top-color'),
					color = ($(selector).length) ? color : "rgb(0,0,0)",
					rgbExp = /rgb\(\d{1,3}\,\s?\d{1,3}\,\s?\d{1,3}\)\s*/,
					colorMatch = color.match(rgbExp),
					colorHex = this.getHex(colorMatch[0].trim());

				/*
				var color = $(selector).css('border-color'),
					width = $(selector).css('border-width').replace("px",""),
					border = $(selector).css('border-style').replace("px",""),
					radius = $(selector).css('border-radius').replace("px",""),
					style = "none|dotted|dashed|solid|double|groove|ridge|inset|outset";
				style_array = style.split("|");
				border = (border=="hidden" || border=="initial" || border =="inherit") ? "none" : border;
	            width = Math.floor(width);
	            radius = Math.floor(radius);
	            */
				var str = "\
					<div class='panel-body sub'>\
						<p>\
							<label class='sm' data-lang='editor.background.color'>Color</label>\
							<span class='color-picker'>\
								<span class='color tooltips ctrl-" + property + "-picker-" + idx + "' el='" + el + "' data-selector='" + selector + "' pn='color' data-toggle='tooltip' data-placement='top' title='color' style='background-color:" + colorHex + "'></span>\
							</span>\
						</p>\
						";
					/*
					if(!isNaN(width)) {
						str = str + "\
							<p>\
								<div class='sl'>\
									<label class='sm'><span data-lang='config.extra.border.width'>Width</span> <span class='slider-value'>" + width + "</span>px</label>\
									<div class='ctrl-el-border-width-slider' data-slider-min='0' data-slider-max='50' data-slider-step='1' data-slider-value='" + width + "' data-slider-tooltip='hide' el='' selector='" + selector + "' pn='border-width'></div>\
								</div>\
							</p>\
						";
					}

					if(border.indexOf(" ")<0) {
						str = str + "\
							<p>\
								<label class='sm' data-lang='config.extra.border.style'>Style</label>\
								<select class='form-control property-form ctrl-el-border-style' data-selector='" + selector + "'>\
						";
						for(i=0;i<style_array.length;i++) {
							str = str + "\
								<option value='" + style_array[i] + "' " + ((style_array[i]==border) ? "selected" : "") + ">" + style_array[i] + "</option>\
							";
						}
						str = str + "\
								</select>\
							</p>\
						";
					}
					str = str + "\
						<p>\
							<div class='sl'>\
								<label class='sm'><span data-lang='config.extra.border.radius'>Radius</span> <span class='slider-value'>" + radius + "</span>px</label>\
								<div class='ctrl-el-border-radius-slider' data-slider-min='0' data-slider-max='50' data-slider-step='1' data-slider-value='" + radius + "' data-slider-tooltip='hide' el='' selector='" + selector + "' pn='border-radius'></div>\
							</div>\
						</p>\
					</div>\
					";
					*/
					str = str + "</div>";
			break;
		}
		return str;
	}

	this.getPadding = function(j,selector) {
		var padding = {
			top : 0,
			bottom : 0,
			left : 0,
			right : 0

		}
		selector = '.' + selector;
		j = initObject(j,selector);

		$.each(j["children"][selector]["attributes"], function(k,v) {
			if(v == "" || v == "initial") v = 0;
			switch(k) {
				case "padding-top":
					v = v.replace(/px/g,"");
					padding.top = v;
					break;
				case "padding-bottom":
					v = v.replace(/px/g,"");
					padding.bottom = v;
					break;
				case "padding":
					v = v.replace(/px/g,"");
					var p = v.split(" ");
					
					switch(p.length) {
						case 1:
							padding.top = p[0];
							padding.right = p[0];
							padding.bottom = p[0];
							padding.left = p[0];
							break;
						case 2:
							padding.top = p[0];
							padding.right = p[1];
							padding.bottom = p[0];
							padding.left = p[1];
							break;
						case 3:
							padding.top = p[0];
							padding.right = p[1];
							padding.bottom = p[2];
							padding.left = p[1];
							break;
						case 4:
							padding.top = p[0];
							padding.right = p[1];
							padding.bottom = p[2];
							padding.left = p[3];
							break;
					}
					break;
			}
		});
		return padding;
	}	
	this.getUserFontsArr = function(cls,fn) {
		if(FONTS != this.fonts) { 
			this.fonts = FONTS ;
		}

		var arr = {};

		for(i=0;i<this.fonts.length;i++) {
			var font_tmp = this.fonts[i].replace(/ /g,'-'),
				font_name = (font_tmp in $.lang[LANG]) ? $.lang[LANG][font_tmp] : this.fonts[i];

			if(font_name.substring(0,1) != '@')
				// str = str + "<li class='" + cls + " " + fonts_check + "' data-elname='" + elname + "' data-font-family='" + this.fonts[i] + "' style=\"font-family:'" + this.fonts[i] + "'\"><a href='javascript:;'>" + font_name + "</a></li>";
				arr["'" + this.fonts[i] + "'"] = font_name
		}
		return arr;
	}
	this.getFontcss = function(fonts) {
		fonts = fonts.replace(/'/g,'').replace(/"/g,'');
		var arr = fonts.split(","),
			r = arr[0];
		return r.trim();
	}

	this.getColorORTransparent = function(color) {
		if(typeof color == "undefined") return 'transparent';

		color = color.replace(/ /gi,'').replace(/!important/gi,'');
		var color_16 = /#?([A-Fa-f0-9]){3}(([A-Fa-f0-9]){3})?/,
			color_regexp = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))$/i,
			check_regexp = ( color_16.test(color) || color_regexp.test(color) ) ? true : false,
			check_not_tp = ( color!='rgba(0,0,0,0)' && color.indexOf('transparent')==-1 ) ? true : false;

		return (check_regexp && check_not_tp) ? color : 'transparent';        	
	}

	this.menuColorSetForm = function(j,selector) {
		var tpl_selector = {
				'main_default'	: 'ul.navbar-nav li:not(.active) a ',
				'main_hover'	: 'ul.navbar-nav li:not(.active) a:hover ',
				'main_active'	: 'ul.navbar-nav li.active a ',
				'sub_default'	: 'ul.dropdown-menu li:not(.active) a ',
				'sub_hover'		: 'ul.dropdown-menu li:not(.active) a:hover ',
				'sub_active'	: 'ul.dropdown-menu li.active a ',
			},
			user = ".menu-edit-" + SID,
			init_selector = {
				'main_default'	: user + ' ul.navbar-nav > li > a,\n '+ user + ' ul.navbar-nav > li > a:focus ',
				'main_hover'	: user + ' ul.navbar-nav > li > a:hover,\n '+ user + ' ul.navbar-nav > li:hover > a ',
				'main_active'	: user + ' ul.navbar-nav > li.active > a,\n '+ user + ' ul.navbar-nav > li.active > a:focus, \n'+ user + ' ul.navbar-nav > li.active > a:hover ',
				'sub_default'	: user + ' ul.dropdown-menu > li > a,\n '+ user + ' ul.dropdown-menu > li > a:focus ',
				'sub_hover'		: user + ' ul.dropdown-menu > li > a:hover,\n '+ user + ' ul.dropdown-menu > li:hover > a ',
				'sub_active'	: user + ' ul.dropdown-menu > li.active > a,\n '+ user + ' ul.dropdown-menu > li.active > a:focus, \n'+ user + ' ul.dropdown-menu > li.active > a:hover ',
			},
			tpl_color_state = {
				'main_default_font' : false,
				'main_hover_font' : false,
				'main_active_font' : false,
				'main_default_bg' : false,
				'main_hover_bg' : false,
				'main_active_bg' : false,
				'sub_default_font' : false,
				'sub_hover_font' : false,
				'sub_active_font' : false,
				'sub_default_bg' : false,
				'sub_hover_bg' : false,
				'sub_active_bg' : false,
			},
			tpl_color_set = {
				'main_default_font' : '',
				'main_hover_font' : '',
				'main_active_font' : '',
				'main_default_bg' : '',
				'main_hover_bg' : '',
				'main_active_bg' : '',
				'sub_default_font' : '',
				'sub_hover_font' : '',
				'sub_active_font' : '',
				'sub_default_bg' : '',
				'sub_hover_bg' : '',
				'sub_active_bg' : '',
			},
			tpl_color_hex = new Object(),
			tpl_color_opacity = new Object(),
			tpl_color_selector = new Object(),
			tpl_etc_list = new Object();


		$.each(j["children"], function(key,value) {
			var tpl_key = key.replace(/ /gi,'');
			if(tpl_key.match(/ul.navbar-nav>li/gi) === null && tpl_key.match(/ul.dropdown-menu>li/gi) === null) return;

			var c = value["attributes"],
				check = {
					'main_default' : (tpl_key.match(/ul.navbar-nav>li>a/gi) !== null) ? true : false,
					'main_hover' : (tpl_key.match(/ul.navbar-nav>li>a:hover/gi) !== null || tpl_key.match(/ul.navbar-nav>li:hover>a/gi) !== null) ? true : false,
					'main_active' : (tpl_key.match(/ul.navbar-nav>li.active>a/gi) !== null) ? true : false,
					'main_after' : (tpl_key.match(/:after/gi) !== null) ? true : false,
					'main_before' : ( tpl_key.match(/:before/gi) !== null) ? true : false,
					'sub_default' : (tpl_key.match(/ul.dropdown-menu>li>a/gi) !== null) ? true : false,
					'sub_hover' : (tpl_key.match(/ul.dropdown-menu>li>a:hover/gi) !== null || tpl_key.match(/ul.dropdown-menu>li:hover>a/gi) !== null) ? true : false,
					'sub_active' : (tpl_key.match(/ul.dropdown-menu>li.active>a/gi) !== null) ? true : false,
					'sub_after' : (tpl_key.match(/:after/gi) !== null) ? true : false,
					'sub_before' : (tpl_key.match(/:before/gi) !== null ) ? true : false,
				},
				check_etc = {
					'main_default_before' : (tpl_key.match(/ul.navbar-nav>li>a:before/gi) !== null || tpl_key.match(/ul.navbar-nav>li:before/gi) !== null) ? true : false,
					'main_hover_before' : (tpl_key.match(/ul.navbar-nav>li>a:hover:before/gi) !== null || tpl_key.match(/ul.navbar-nav>li:hover:before/gi) !== null) ? true : false,
					'main_active_before' : (tpl_key.match(/ul.navbar-nav>li.active>a:before/gi) !== null || tpl_key.match(/ul.navbar-nav>li.active:before/gi) !== null) ? true : false,
					'main_default_after' : (tpl_key.match(/ul.navbar-nav>li>a:after/gi) !== null || tpl_key.match(/ul.navbar-nav>li:after/gi) !== null) ? true : false,
					'main_hover_after' : (tpl_key.match(/ul.navbar-nav>li>a:hover:after/gi) !== null || tpl_key.match(/ul.navbar-nav>li:hover:after/gi) !== null) ? true : false,
					'main_active_after' : (tpl_key.match(/ul.navbar-nav>li.active>a:after/gi) !== null || tpl_key.match(/ul.navbar-nav>li.active:after/gi) !== null) ? true : false,
					'sub_default_before' : (tpl_key.match(/ul.dropdown-menu>li>a:before/gi) !== null || tpl_key.match(/ul.dropdown-menu>li:before/gi) !== null) ? true : false,
					'sub_hover_before' : (tpl_key.match(/ul.dropdown-menu>li>a:hover:before/gi) !== null || tpl_key.match(/ul.dropdown-menu>li:hover:before/gi) !== null) ? true : false,
					'sub_active_before' : (tpl_key.match(/ul.dropdown-menu>li.active>a:before/gi) !== null || tpl_key.match(/ul.dropdown-menu>li.active:before/gi) !== null) ? true : false,
					'sub_default_after' : (tpl_key.match(/ul.dropdown-menu>li>a:after/gi) !== null || tpl_key.match(/ul.dropdown-menu>li:after/gi) !== null) ? true : false,
					'sub_hover_after' : (tpl_key.match(/ul.dropdown-menu>li>a:hover:after/gi) !== null || tpl_key.match(/ul.dropdown-menu>li:hover:after/gi) !== null) ? true : false,
					'sub_active_after' : (tpl_key.match(/ul.dropdown-menu>li.active>a:after/gi) !== null || tpl_key.match(/ul.dropdown-menu>li.active:after/gi) !== null) ? true : false,
				}

			var type = (tpl_key.match(/ul.navbar-nav>li/gi) != null) ? 'main' : 'sub',
				mode = '';

			if( check[type+'_default'] && !check[type+'_hover'] && !check[type+'_after'] && !check[type+'_before'] ) {
				mode = 'default';
			} else if ( check[type+'_hover'] && !check[type+'_after'] && !check[type+'_before']) {
				mode = 'hover';
			} else if ( check[type+'_active'] && !check[type+'_after'] && !check[type+'_before'] ) {
				mode = 'active';
			} 

			var used_menu_etc = Object.keys(check_etc).map(function(key) { 
				 return check_etc[key];
			});
			if($.inArray(true,used_menu_etc) > -1) {

				$.each(check_etc, function(k,check) {
					if(check) {
						var etc_ctype = (typeof c['color'] != 'undefined') ? 'color' : ( (typeof c['border-color'] != 'undefined') ? 'border-color' : 'background-color'),
							used_etc_effect = true;
							
						if(typeof c['opacity'] != 'undefined' && c['opacity'] == 0) { used_etc_effect = false; }
						if(typeof c['display'] != 'undefined' && c['opacity'] == 'none') { used_etc_effect = false; }
						if(typeof c['width'] != 'undefined' && c['width'] == '0px') { used_etc_effect = false; }
						if(typeof c['height'] != 'undefined' && c['height'] == '0px') { used_etc_effect = false; }

						if(style.getColorORTransparent(c[etc_ctype]) == 'transparent') { used_etc_effect = false; }

						if(used_etc_effect) {
							tpl_etc_list[k] = {
								'selector' : key,
								'css_type' : etc_ctype
							};
						}

					}
				});
			}

			if(mode) {
				tpl_color_selector[type+'_'+mode] = key;
				if( typeof c['color'] != "undefined" ) tpl_color_set[type+'_'+mode+'_font'] = c['color'];
				if( typeof c['background-color'] != "undefined" ) tpl_color_set[type+'_'+mode+'_bg'] = c['background-color'];

				if(typeof c['opacity'] != "undefined" && typeof tpl_color_set[type+'_'+mode+'_bg']) tpl_color_opacity[type+'_'+mode+'_bg'] = c['opacity'];
			}

		});

		var default_font = ( typeof $('.'+selector).css('color') != 'undefined' ) ? style.getColorORTransparent($('.'+selector).css('color')) : style.getColorORTransparent($('.dsgn-body').css('color')),
			default_bg = ( typeof $('.'+selector).css('background-color') != 'undefined' ) ? style.getColorORTransparent($('.'+selector).css('background-color')) : style.getColorORTransparent($('.dsgn-body').css('background-color'));

		$.each(tpl_color_set, function(k,v) {
			var type = (k.indexOf('main_') > -1) ? 'main' : 'sub',
				mode = k.substr(k.indexOf('_')+1, (k.lastIndexOf('_')-(k.indexOf('_')+1))),
				fn = (k.indexOf('font') > -1) ? 'font' : 'bg';

			if(v.indexOf('important') > -1) { v = v.trim().replace('!important',''); }

			if(!v) {
				var color = (fn == 'font') ? $('.'+selector).find(tpl_selector[type+'_'+mode]).css('color') : $('.'+selector).find(tpl_selector[type+'_'+mode]).css('background-color');
				color = (style.getColorORTransparent(color) != 'transparent') ? style.getColorORTransparent(color) : style.getColorORTransparent(eval('default_' + fn));

				if(color != 'transparent') v = color;
				else if( mode != 'default') {
					var sub_key = (mode == 'hover') ? type+'_active_'+fn : type+'_hover_'+fn;
					
					if(tpl_color_set[sub_key]) v = tpl_color_set[sub_key];
					else v = tpl_color_set[type+'_default_'+fn];
				}

				tpl_color_opacity[k] = (v) ? 1 : 0;
				if(v) {
					tpl_color_state[k] = true;
					tpl_color_set[k] = v;
				}

			} else {
				v = style.getColorORTransparent(v);
				tpl_color_state[k] = true;
			}

			if(typeof tpl_color_opacity[k] == 'undefined') {
				var opacity_val = (v == 'transparent' || !tpl_color_set[k]) ? 0 : 1;
				tpl_color_opacity[k] = (v.indexOf('rgba') > -1) ? v.substr((v.lastIndexOf(',')+1),(v.lastIndexOf(')')- (v.lastIndexOf(',')+1))).trim() : opacity_val;
			}

			tpl_color_hex[k] = (v.indexOf('#') > -1 ) ? v : style.rgbahex(v);

		});


		var getColorBox = function(menu_type, css_type, color_set) {
			var mode = ['default','hover','active'],
				str = '',
				pn = (css_type == 'font') ? 'color' : 'background-color',
				check_return = false;

			if(menu_type == 'menublock') {
				var menu_bg = ($('.bg-picker-el-menu').css('background-color')) ? $('.bg-picker-el-menu').css('background-color') : $('.'+selectEL).find('header').css('background-color'),
					menu_bg_transparent = ( style.getColorORTransparent(menu_bg) == 'transparent' ) ? 'checked-transparent' : '';

				str = '\
							<div class="color-box '+menu_bg_transparent+'" data-ctype="bg">\
								<span class="color tooltips ctrl-menu-color-picker bg-picker-el-menu-temp" el="el-menu" data-selector=".menu-temp-' + SID + '" pn="background-color-all" data-toggle="tooltip" data-placement="top" data-original-title="color" data-opacity="" style="background-color:' + menu_bg + '"></span>\
							</div>\
				';
				return str;
			}

			mode.forEach(function(i,v) {
				var class_opacity = (tpl_color_opacity[menu_type+'_'+i+'_'+css_type] == 0) ? 'transparent' : '',
					class_transprent = ( style.getColorORTransparent($('.'+selectEL).find('header').css('background-color')) == 'transparent' 
											&& style.getColorORTransparent($('.'+selectEL).find('ul.navbar-nav > li > a').css('background-color')) == 'transparent' 
											&& style.getColorORTransparent($('.'+selectEL).find('ul.dropdown-menu > li > a').css('background-color')) == 'transparent' ) ? ' checked-transparent' : '',
					transparent_tooltip = '',
					menu_bg_img = (typeof $('.'+selectEL).find('header').css('background-image') == 'undefined' ) ? '' : $('.'+selectEL).find('header').css('background-image'), 
					class_bg_img = ( menu_bg_img && menu_bg_img != 'none' && menu_bg_img != 'inherit' && menu_bg_img != 'initial' ) ? ' used-bg' : '';

				if(css_type == 'bg' && (class_opacity !== '' || class_transprent !== '') ) {
					transparent_tooltip = (class_transprent) ? $.lang[LANG]['editor.menu.color.transparent.edit.info'] : $.lang[LANG]['editor.menu.color.transparent.edit.info2'];
				}

				var etc_str = '',
					check_etc = (typeof tpl_etc_list[menu_type+'_'+i+'_before'] != 'undefined' || typeof tpl_etc_list[menu_type+'_'+i+'_after'] != 'undefined') ? true : false;
				
				if(pn == 'color' && check_etc) {
					if(typeof tpl_etc_list[menu_type+'_'+i+'_before'] != 'undefined') {
						etc_str += '\
						<input type="hidden" class="menu-etc" value="' + tpl_etc_list[menu_type+'_'+i+'_before']['css_type'] + '" data-selector="'+ tpl_etc_list[menu_type+'_'+i+'_before']['selector'] +'"/>\
						';
					}
					if(typeof tpl_etc_list[menu_type+'_'+i+'_after'] != 'undefined') {
						etc_str += '\
						<input type="hidden" class="menu-etc" value="' + tpl_etc_list[menu_type+'_'+i+'_after']['css_type'] + '" data-selector="'+ tpl_etc_list[menu_type+'_'+i+'_after']['selector'] +'"/>\
						';
					}
				}

				if(menu_type == 'main' && css_type == 'font' && v == 0) { //Menu Color Settings - Menu text color Change ==> Mobile Toggle bar color
					var block_selector = (selector.indexOf('menu-temp')>-1) ? '.menu-temp-' + SID : '.menu-' + SID,
						toggle_bar_selector = block_selector + " .navbar-toggle .icon-bar";

					etc_str += '\
						<input type="hidden" class="menu-etc" value="background-color" data-selector="' + toggle_bar_selector +'" />\
					';
				}

				str = str + '\
							<div class="color-box '+class_opacity + class_transprent + class_bg_img +'" data-type="'+ menu_type + '" data-mode="'+ i + '" data-ctype="'+ css_type + '" data-cstate="' + tpl_color_state[menu_type+'_'+i+'_'+css_type] + '"  data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="'+transparent_tooltip + '">\
								<span class="color-picker">\
									<span class="color tooltips ctrl-menu-color-picker" el="elmenu-color-edit" data-selector="' + tpl_color_selector[menu_type+'_'+i] + '" pn="'+pn+'" data-toggle="tooltip" data-placement="top" data-original-title="color" data-opacity="'+tpl_color_opacity[menu_type+'_'+i+'_'+css_type]+'" style="background-color: '+tpl_color_hex[menu_type+'_'+i+'_'+css_type]+'"></span>\
								</span>\
								' + etc_str + '\
							</div>\
							';
				if(v == 2) check_return = true;
			});
			if(check_return) return str;
		}

		var color_panel_menublock = getColorBox('menublock','bg',tpl_color_set),
			color_panel_main_font = getColorBox('main','font',tpl_color_set),
			color_panel_main_bg = getColorBox('main','bg',tpl_color_set),
			color_panel_sub_font = getColorBox('sub','font',tpl_color_set),
			color_panel_sub_bg = getColorBox('sub','bg',tpl_color_set),
			menublock_palette = '',
			main_palette = '',
			sub_palette = '';

		menublock_palette = '\
						<div class="color-line">\
							' + color_panel_menublock + '\
						</div>\
		';

		main_palette = '\
						<div class="color-line">\
							<div class="option_name">' + $.lang[LANG]["editor.menu.color.font"] + '</div>\
							' + color_panel_main_font + '\
						</div>\
						<div class="color-line">\
							<div class="option_name">' + $.lang[LANG]["editor.menu.color.bg"] + '</div>\
							' + color_panel_main_bg + '\
						</div>\
		';
		sub_palette = '\
						<div class="color-line">\
							<div class="option_name">' + $.lang[LANG]["editor.menu.color.font"] + '</div>\
							' + color_panel_sub_font + '\
						</div>\
						<div class="color-line">\
							<div class="option_name">' + $.lang[LANG]["editor.menu.color.bg"] + '</div>\
							' + color_panel_sub_bg + '\
						</div>\
		';


		var menublock_palette_class = (LANG == 'en') ? 'col-xs-8 col-sm-8 col-md-8 col-xs-offset-1 col-sm-offset-1 col-md-offset-1' : 'col-xs-9 col-sm-9 col-md-9',
			menublock_palette_margin = (LANG == 'en') ? 'margin-top: 0;' : 'margin-top: 9px';
		var str = '\
			<div class="elmenu-color-sidebar">\
				<h5 class="text-center">' + $.lang[LANG]["editor.menu.color-edit"] + '</h5>\
				<div class="row">\
					<div class="col-xs-9 col-sm-9 col-md-9 col-xs-offset-3 col-sm-offset-3 col-md-offset-3 clearfix">\
									<div class="header-line">\
										<div class="mode_name default_color">' + $.lang[LANG]["editor.menu.color.default"] + '</div>\
										<div class="mode_name hover_color">' + $.lang[LANG]["editor.menu.color.hover"] + '</div>\
										<div class="mode_name active_color">' + $.lang[LANG]["editor.menu.color.active"] + '</div>\
									</div>\
					</div>\
				\
					<div class="col-xs-3 col-sm-3 col-md-3">\
						<h6>' + $.lang[LANG]["editor.menu.color.menu"] + '</h6>\
					</div>\
					<div class="col-xs-9 col-sm-9 col-md-9 no-padding">\
						<div class="btn-group btn-group-sm">\
							<div class="btn-color-mode btn-group color-palette">\
								<div class="color-picker-wrap">\
									' + main_palette + '\
								</div>\
							</div>\
						</div>\
					</div>\
				\
					<div class="clearfix"></div>\
					<hr/>\
				\
					<div class="col-xs-3 col-sm-3 col-md-3">\
						<h6>' + $.lang[LANG]["editor.menu.color.submenu"] + '</h6>\
					</div>\
					<div class="col-xs-9 col-sm-9 col-md-9 no-padding">\
						<div class="btn-group btn-group-sm">\
							<div class="btn-color-mode btn-group color-palette">\
								<div class="color-picker-wrap">\
									' + sub_palette + '\
								</div>\
							</div>\
						</div>\
					</div>\
				\
					<div class="clearfix"></div>\
					<hr/>\
				\
					<div class="col-xs-3 col-sm-3 col-md-3">\
						<h6 style="' + menublock_palette_margin + '">' + $.lang[LANG]["editor.menu.color.menublock"] + '</h6>\
					</div>\
					<div class="no-padding '+ menublock_palette_class + '">\
						<div class="btn-group btn-group-sm">\
							<div class="btn-color-mode btn-group color-palette">\
								<div class="color-picker-wrap">\
									' + menublock_palette + '\
								</div>\
							</div>\
						</div>\
					</div>\
				\
					<div class="clearfix"></div>\
					<div class="btn-wrap">\
							<div class="btn btn-default btn-sm close-btn-menuColorSet">' + $.lang[LANG]["config.cancel"] + '</div>\
							<div class="btn btn-primary btn-sm save-btn-menuColorSet">' + $.lang[LANG]["config.ok"] + '</div>\
					</div>\
				</div>\
			</div>\
		';

		return str;

	}

}