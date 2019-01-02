var LANG = getLanguage();

$(window).load(function(data) {
	setLanguage(LANG);
	collectionSortable();
});


$(function() {

	$.slang = {
		init: function(data) {
			if(typeof data != "undefined" && data) {
				if(PAGE_MODE == 'c') SLANG = data;
				else property.SLANG = data;
			}

			var slang = (PAGE_MODE == 'c') ? SLANG : property.SLANG;
			if(!$.isEmptyObject(slang)) $.slang.set('on');
			else $.slang.set('off');
		},
		set: function(onoff) {
			if(onoff.match(/on/gi)) $.slang.make();
			else $('#tpl-menu').find('.siteLANG').remove();
		},
		make: function() {
			var caret = ($('.el-menu > header.navbar').hasClass('sidebar')) ? 'fa fa-caret-right fa-1' : 'fa fa-caret-down fa-1',
				slang_data = (PAGE_MODE == 'c') ? SLANG['lists'] : property.SLANG['lists'],
				slang_str = (PAGE_MODE == 'c') ? SLANG['select'] : property.SLANG['select'],
				slang_list = '';

			$.each(slang_data, function(i,o) {
				var active = (o['name'] == slang_str) ? 'active' : '';
				slang_list += '\
						<li><a href="javascript:;" data-code="' + o['code'] + '">' + o['name'] + '</a></li>\
				';
			});

			var content = '\
				<li class="siteLANG dropdown">\
					<a href="javascript:;" class="dropdown-toggle"><span class="fa fa-globe" aria-hidden="true"></span><span class="slang-active">' + slang_str + '</span></a>\
					<ul class="dropdown-menu">\
						' + slang_list + '\
					</ul>\
				</li>\
				',
				mobile_content = '\
				<div class="siteLANG micon dropdown">\
					<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-target=".siteLANG-dmenu-wrap"><i class="cl-icon cl-icon-globe" aria-hidden="true"></i></a>\
				</div>\
				',
				mobile_dropdown_menu = '\
				<div class="siteLANG-dmenu-wrap">\
					<!--<span class="dropdown-close"><span class="icon-bar"></span><span class="icon-bar"></span></span>-->\
					<ul class="dropdown-menu">\
						' + slang_list + '\
					</ul>\
				</div>\
			';

			if($('#tpl-menu').find('.siteLANG').length > 0) $('#tpl-menu').find('.siteLANG').replaceWith(content);
			else $('#tpl-menu').append(content);


			if($('div.siteLANG.micon').length>0) $('div.siteLANG.micon').replaceWith(mobile_content);
			else $('.el-menu .navbar-toggle').before(mobile_content);

			if($('div.siteLANG-dmenu-wrap').length>0) $('div.siteLANG-dmenu-wrap').replaceWith(mobile_dropdown_menu);
			else if($('div.siteUM-dmenu-wrap').length>0) $('div.siteUM-dmenu-wrap').after(mobile_dropdown_menu);
			else $('#tpl-menu').parent().after(mobile_dropdown_menu);

			$('.el-menu .navbar-header div.siteLANG.micon').css({
				'color': $('.el-menu .navbar-toggle .icon-bar').css('background-color'),
				'right': '56px',
			});


		}
	} /*slang end*/


	$.cmember = {
		init: function (used, callback) {
			return false; //추후
			SITECM = used;

			if(SITECM) $.cmember.setLogin('on');
			else $.cmember.setLogin('off');
		},
		setLogin: function(onoff) {

			if(onoff.match(/on/gi)) {
				if($('#tpl-menu').find('.siteCM').length > 0) return false;
				else $('#tpl-menu').append($.cmember.makeSiteCM());
			} else {
				if($('#tpl-menu').find('.siteCM').length > 0) $('#tpl-menu').find('.siteCM').remove();
			}
		},
		makeSiteCM: function() {
			var str = $.lang[LANG]['manager.site-um.login'],
				caret = ($('.el-menu > header.navbar').hasClass('sidebar')) ? 'fa fa-caret-right fa-1' : 'fa fa-caret-down fa-1',
				check_admin = true, /*사용자 세션값 로드. [관리자 유무]. .*/
				check_login = false;
				// check_login = (typeof $.cookie('PHPSESSID') != 'undefined' && $.cookie('PHPSESSID')) ? true : false; /*사용자 세션값 로드. [true|false]. 로그인 여부 check*/

			// var um_name = 'testlogin'; /*사용자 세션값 로드. [사용자이름:um_name]. 사용자 이름 출력.*/
			var host_url = (PAGE_MODE == 'c') ? 'http://' + HOST : 'http://' + property.HOST;

			var content = (!check_login) ? '<li class="siteCM"><a class="clogin" href="javascript:;"><span class="glyphicon glyphicon-user"></span> ' + str + '</li>' : '\
				<li class="siteCM dropdown">\
					<a href="javascript:;" class="dropdown-toggle">' + um_name + ' <i class="' + caret + '" aria-hidden="true"></i></a>\
					<ul class="dropdown-menu">\
						<li><a href="'+host_url+'/dashboard" target="_blank">' + $.lang[LANG]['manager.site-um.dashboard'] + '</a></li>\
						<li><a class="clogout" href="javascript:;">' + $.lang[LANG]['manager.site-um.logout'] + '</a></li>\
					</ul>\
				</li>\
			';

			return content;
		},
		showLoginModal: function() {
			var content = '\
				<ul class="comment-signForm nav nav-tabs default-mode" role="tablist">\
					<li class="signType default-mode" role="presentation"><a href="#creatorlink" aria-controls="creatorlink" role="tab" data-toggle="tab"><img src="https://storage.googleapis.com/i.addblock.net/icon/icon-sign-creatorlink.png"><br><br>' +  $.lang[LANG]['config.creatorlink'] + '</a></li>\
				</ul>\
				<div class="tab-content">\
					<div role="tabpanel" class="tab-pane active" id="creatorlink">\
						<div class="login form-group">\
							<input type="text" id="mb_forum_id" name="mb_id" class="form-control" placeholder="' +  $.lang[LANG]['config.modal.emailaddress'] + '">\
							<input type="password" id="mb_forum_password" name="mb_password" class="form-control" placeholder="' +  $.lang[LANG]['config.modal.password'] + '">\
						</div>\
						<div class="btn-wrap">\
							<a href="#" class="btn btn-primary btn-lg btn-block [forum-login]">' +  $.lang[LANG]['config.modal.login'] + '</a>\
						</div>\
						<div class="bottom-box text-right ' + LANG + '">\
							<span>' +  $.lang[LANG]['page.member.login-modal.jointext2'] + '</span>&nbsp;&nbsp;&nbsp;<a href="//creatorlink.net/member/join" target="_blank"><u><b>' +  $.lang[LANG]['page.member.login-modal.join2'] + '</b></u></a>\
						</div>\
					</div>\
				</div>\
			';

			var cLoginModal = $(this).showModalFlat('로그인', $.lang[LANG]['re-login.info'] + content, true, true, function() {
				var isSubmit = true;
				$('.error').remove();

				var $name = $('#comm-name'),
					$pass = $('#comm-pass'),
					$key = $('#wr_key'),
					nameLength = getBytes( $name.val() );

				if( nameLength==0) {
					$name.after('<label class="error">' +  $.lang[LANG]['config.enter-name'] + '</label>').focus();
					isSubmit = false;
				}
				else if ( nameLength > 20 ) {
					$name.after('<label class="error">' +  $.lang[LANG]['config.guest-id-max-length'] + '</label>').focus();
					isSubmit = false;
				}
				if($pass.val().length<4) {
					$pass.after('<label class="error">' +  $.lang[LANG]['config.pass-min-length'] + '</label>').focus();
					isSubmit = false;
				}

				if(isSubmit==true) {
					modal.modal('hide');
					// user.name = data.name = $name.val();
					// user.nameLength = nameLength;
					// user.pass = hex_md5( $pass.val() );
					// user.key = $key.val().trim();
					// setWriteUser(data);
				}

			},'ok','','w450',true,'');
			$('.flat-modal .modal-body').addClass('comment');
			$('.flat-modal .modal-footer').hide();
			$('#flat-modal').css('z-index','1041');
			$('.flat-modal').next('.modal-backdrop').css('z-index','1040');
			// if(!user.pass) $('.flat-modal .signType').last().hide();

		},
	} /*cmember end*/


	$.umember = {
		init: function(um_used, um_lang, um_display, callback) {
			if(typeof um_used != "undefined" && um_used) {
				if(PAGE_MODE == 'c') SITEUM = um_used;
				else property.SITEUM = um_used;
			}

			if(typeof um_lang != "undefined" && um_lang) {
				if(PAGE_MODE == 'c') SITEUMLANG = um_lang;
				else property.SITEUMLANG = um_lang;
			}

			if(typeof um_display != "undefined" && um_display) {
				if(PAGE_MODE == 'c') SITEUMDISPLAY = um_display;
				else property.SITEUMDISPLAY = um_display;
			}

			var s_um = (PAGE_MODE == 'c') ? SITEUM : property.SITEUM;
			if(s_um == 0 || (typeof s_um == 'string' && s_um == '0')) {
				$('#tpl-menu').find('.siteUM').remove();
				$('div.siteUM.micon').remove();
				$('div.siteUM-dmenu-wrap').remove();
				if(typeof callback == 'function') { callback(); }
			} else {
				$.umember.makeSiteUM(callback);
			}
		},
		setUM: function(onoff,callback) {
			if(onoff.match(/on/gi)) $.umember.makeSiteUM(callback);
			else {
				$('#tpl-menu').find('.siteUM').remove();
				$('div.siteUM.micon').remove();
				$('div.siteUM-dmenu-wrap').remove();
			}
		},
		makeSiteUM: function(callback) {
			var sid = (PAGE_MODE == 'c') ? SID : property.SID,
				s_validtype = (PAGE_MODE == 'c') ? VALIDTYPE : property.VALIDTYPE,
				s_um = (PAGE_MODE == 'c') ? SITEUM : property.SITEUM,
				s_um_lang = (PAGE_MODE == 'c') ? SITEUMLANG : property.SITEUMLANG,
				s_um_display = (PAGE_MODE == 'c') ? SITEUMDISPLAY : property.SITEUMDISPLAY,
				s_service = (PAGE_MODE == 'c') ? SERVICE : property.SERVICE;

			if(s_validtype != 'BN') {
				$.umember.setUM('off');
				return false;
			}

			var display = (s_um == 1) ? 'login' : s_um_display,
				caret = ($('.el-menu > header.navbar').hasClass('sidebar')) ? 'fa fa-caret-right fa-1' : 'fa fa-caret-down fa-1',
				str = (s_um == 1) ? $.lang[LANG]['manager.site-um.login'] : ((s_um_display) ? $.lang[s_um_lang]['manager.site-um.'+s_um_display] : '');

			$.post('/umember/login/check', { sid : sid }, function(r) {
				var check_login = (typeof r.member != "undefined") ? r.member.check_login : false, 
					check_admin = (typeof r.member != "undefined") ? r.member.check_adm : false, 
					check_uadmin = (typeof r.member != "undefined") ? r.member.check_uadm : false,
					check_id_type = (typeof r.member != "undefined") ? r.member.id_type : '',
 					login_id = (typeof r.member != "undefined") ? r.member.id : '';

//***********************************************************************************************************************바꾸기 아래
			// live
				// var host_url = (s_service.indexOf('gabia') > -1) ? 'http://creatorlink-gabia.com' : 'http://creatorlink.net',
					// menu_mygabia_str = (s_service.indexOf('gabia') > -1 && (check_admin || check_uadmin)) ? '\

			// gabia test
				// var host_url = (s_service.indexOf('gabia') == -1) ? 'http://creatorlink-gabia.com' : 'http://creatorlink.net',
					// menu_mygabia_str = (s_service.indexOf('gabia') == -1 && (check_admin || check_uadmin)) ? '\

				var host_url = (s_service.indexOf('gabia') > -1) ? 'http://creatorlink-gabia.com' : 'http://creatorlink.net',
					menu_url = {
					'dashboard': (check_uadmin) ? '/_admin/dashboard' : host_url + '/dashboard',
					'member'   : (check_uadmin) ? '/_admin/member' : host_url + '/manager/member',
				};

				var menu_dashboard_str = (check_admin || check_uadmin) ? '\
							<li><a href="' + menu_url['dashboard'] + '" target="_blank">' + $.lang[LANG]['manager.site-um.dashboard'] + '</a></li>\
							' : '',
					menu_member_str = (check_admin) ? '\
							<li><a href="' + host_url + '/manager/member" target="_blank">' + $.lang[LANG]['manager.site-um.manage'] + '</a></li>\
							' : '',
					menu_mygabia_str = (s_service.indexOf('gabia') > -1 && (check_admin || check_uadmin)) ? '\
							<li><a href="https://www.gabia.com/mygabia/service" target="_blank">' + $.lang[LANG]['manager.site-um.mypage.gabia'] + '</a></li>\
							' : '',
					menu_mypage_str = (check_admin) ? '' : '\
							<li><a class="mypage" href="javascript:;">' + $.lang[LANG]['manager.site-um.mypage'] + '</a></li>\
							';

				var menu_str = menu_dashboard_str + menu_member_str + menu_mygabia_str + menu_mypage_str,
					content = (!check_login) ? '<li class="siteUM"><a class="' + display + '" href="javascript:;"><span class="glyphicon glyphicon-user"></span> ' + str + '</a></li>' : '\
					<li class="siteUM dropdown">\
						<a href="javascript:;" class="dropdown-toggle">' + login_id + ' <i class="' + caret + '" aria-hidden="true"></i></a>\
						<ul class="dropdown-menu">\
							' + menu_str + '\
							<li><a class="logout" href="javascript:;">' + $.lang[LANG]['manager.site-um.logout'] + '</a></li>\
						</ul>\
					</li>\
					',
					mobile_content = (!check_login) ? '<div class="siteUM micon"><a class="' + display + '" href="javascript:;"><i class="cl-icon cl-icon-login" aria-hidden="true"></i></a></div>' : '\
					<div class="siteUM micon dropdown">\
						<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-target=".siteUM-dmenu-wrap"><i class="cl-icon cl-icon-login" aria-hidden="true"></i></a>\
					</div>\
					',
					mobile_dropdown_menu = '\
					<div class="siteUM-dmenu-wrap">\
						<!--<span class="dropdown-close"><span class="icon-bar"></span><span class="icon-bar"></span></span>-->\
						<ul class="dropdown-menu">\
							' + menu_str + '\
							<li><a class="logout" href="javascript:;">' + $.lang[LANG]['manager.site-um.logout'] + '</a></li>\
						</ul>\
					</div>\
				';

//***********************************************************************************************************************바꾸기 아래
			// live
					// var mypage_url = (s_service.indexOf('gabia') > -1) ? 'https://www.gabia.com/mygabia/service' : 'http://creatorlink.net/mypage',
					// 	mypage_name = (s_service.indexOf('gabia') > -1) ? $.lang[LANG]['manager.site-um.mypage.gabia'] : $.lang[LANG]['manager.site-um.mypage'];

			// gabia test
					// var mypage_url = (s_service.indexOf('gabia') == -1) ? 'https://www.gabia.com/mygabia/service' : 'http://creatorlink.net/mypage',
					// 	mypage_name = (s_service.indexOf('gabia') == -1) ? $.lang[LANG]['manager.site-um.mypage.gabia'] : $.lang[LANG]['manager.site-um.mypage'];

				if(check_id_type == 'creatorlink' && !check_admin && login_id) { //creatorlink member
					var mypage_url = (s_service.indexOf('gabia') > -1) ? 'https://www.gabia.com/mygabia/service' : 'http://creatorlink.net/mypage',
						mypage_name = (s_service.indexOf('gabia') > -1) ? $.lang[LANG]['manager.site-um.mypage.gabia'] : $.lang[LANG]['manager.site-um.mypage'];

					content = '\
					<li class="siteUM dropdown">\
						<a href="javascript:;" class="dropdown-toggle">' + login_id + ' <i class="' + caret + '" aria-hidden="true"></i></a>\
						<ul class="dropdown-menu">\
							<li><a href="' + host_url + '/dashboard" target="_blank">' + $.lang[LANG]['manager.site-um.dashboard'] + '</a></li>\
							<li><a href="' + mypage_url + '" target="_blank">' + mypage_name + '</a></li>\
							<li><a class="logout" href="javascript:;">' + $.lang[LANG]['manager.site-um.logout'] + '</a></li>\
						</ul>\
					</li>\
					',
					mobile_content = '\
					<div class="siteUM micon dropdown">\
						<a href="javascript:;" class="dropdown-toggle" data-target=".siteUM-dmenu-wrap"><i class="fa fa-user" aria-hidden="true"></i></a>\
					</div>\
					'
					mobile_dropdown_menu = '\
					<div class="siteUM-dmenu-wrap">\
						<!--<span class="dropdown-close"><span class="icon-bar"></span><span class="icon-bar"></span></span>-->\
						<ul class="dropdown-menu">\
							<li><a href="' + host_url + '/dashboard" target="_blank">' + $.lang[LANG]['manager.site-um.dashboard'] + '</a></li>\
							<li><a href="' + mypage_url + '/mypage" target="_blank">' + $.lang[LANG]['manager.site-um.mypage'] + '</a></li>\
							<li><a class="logout" href="javascript:;">' + $.lang[LANG]['manager.site-um.logout'] + '</a></li>\
						</ul>\
					</div>\
					';
				} 


				var successSiteUMLogin = new Promise(function(resolve, reject) {
					if($('#tpl-menu').find('.siteUM').length > 0) $('#tpl-menu').find('.siteUM').replaceWith(content);
					else {
						if($('#tpl-menu').find('.siteLANG').length > 0 ) $('#tpl-menu').find('.siteLANG').before(content);
						else $('#tpl-menu').append(content);
					}

					if($('div.siteUM.micon').length>0) $('div.siteUM.micon').replaceWith(mobile_content);
					else $('.el-menu .navbar-toggle').before(mobile_content);

					if($('div.siteUM-dmenu-wrap').length>0) $('div.siteUM-dmenu-wrap').replaceWith(mobile_dropdown_menu);
					else $('#tpl-menu').parent().after(mobile_dropdown_menu);

					var check_slang = (PAGE_MODE == 'c') ? SLANG : property.SLANG;
					$('.el-menu .navbar-header div.siteUM.micon').css({
						'color': $('.el-menu .navbar-toggle .icon-bar').css('background-color'),
						'right': ($.isEmptyObject(check_slang)) ? '56px' : '91px',
					});

					resolve();
				});

				successSiteUMLogin.then(function(value) {
					if(typeof callback == 'function') {
						callback();
					}
				});
			},'json');

		},
		showMngModal: function(sid, content, id, backdrop, showcallback, showncallback, hiddencallback, callback, closecallback) {

			var container = $(content),
				backdrop = (typeof backdrop == "undefined") ? false : true;

			$('body').append(container);
			var newInstance = jQuery.extend(true, {}, container);
			var modalElement = newInstance.find('#' + id);

			modalElement.attr('data-sid',sid);

			if(backdrop) modalElement.modal({ backdrop : 'static'});
			else modalElement.modal();

			modalElement.on('show.bs.modal', function(e) {
				if(typeof showcallback == 'function') showcallback();
			});

			modalElement.on('shown.bs.modal', function(e) {
				var modal = document.querySelector('.modal');
				modal.style.position = 'absolute';
				setTimeout(function() {
					modal.style.position = 'fixed';
				},0);
				
				if(typeof showncallback == 'function') showncallback();
			});

			modalElement.on('hidden.bs.modal', function(e) {
				var flat_modal_id = $(this).attr('id');
				$('.editor-navbar').css('z-index','1040');
				var this_modal = $('#'+flat_modal_id).closest('.flat-modal');
				this_modal.next('.modal-backdrop').remove();
				this_modal.remove();

				if($('.modal-backdrop').length) {
					setTimeout(function() {
						$('body').addClass('modal-open');    
					},10);                
				}
				$('body').removeClass('no-fixed');

				if(typeof hiddencallback == "function") hiddencallback();
			});

			newInstance.find('.ok-button-dialog').bind('click', function () {
				if(typeof callback == 'function')
					callback();
			});

			newInstance.find('.close-button-dialog').bind('click', function () {
				if(typeof closecallback == 'function')
					closecallback();
			});

			return modalElement;
		},
		showJoinModal: function(sid,mode) {
			mode = (typeof mode != "undefined" && mode) ? '-' + mode : '';

			if($('#join-modal' + mode).length > 0) return false;
			if($('#login-modal').length > 0) $('#login-modal').delay(3000).modal('hide');

			$.post('/umember/getSiteUM/type/join', { sid : sid, field : '*' }, function(data) {
				if(typeof data.error != "undefined" && data.error) {
					alert(data.error);
					return false;
				}
				
				COLLECTION_REGEX = $.parseJSON(data['regExp']);

				var content = $.umember.makeJoinModalContent(sid,data,mode);
				$.umember.showMngModal(sid, content, 'join-modal' + mode, false,
										function() { $.umember.joinModalInit(mode); }, 
										function() { $.umember.joinModalKeyFunc(mode); }, '', '', '');
				
			}, 'json');
		},
		makeJoinConditionsStr: function(sid,data,key) {

			switch(key) {
				case 'captcha' : 
					var captcha_class = (data['captcha'] == '1') ? '' : 'hide',
						captcha =  '\
								<div class="kcaptcha-wrap clearfix '+ captcha_class +'">\
									<div class="col-xs-4 col-sm-4 col-md-4 no-padding kcaptcha-box">\
										<p id="write_option"><img src="" id="kcaptcha" alt=""/></p>\
									</div>\
									<div class="col-xs-8 col-sm-8 col-md-8 text-left kcaptcha-key-wrap">\
										<input type="text" id="wr_key" name="wr_key" class="col-xs-12 col-sm-12 col-md-12 ed" placeholder="'+ $.lang[LANG]['manager.join.cl.captcha-msg'] +'" />\
										<a id="kcaptcha" class="small">' + $.lang[LANG]['manager.join.cl.captcha-change'] + '</a>\
									</div>\
								</div>\
					';

					return captcha;
					break;

				case 'collections':
					var collections = '';
					$.each(data["collections"], function(field,o) {
						if(o['used']) {
							var org_field = (field == 'addr') ? field + '1' : field,
								optional = o["optional"],
								name = o["name"],
								optional_class = (optional) ? "optional" : "";

							collections += '\
											<span class="form-group '+ optional_class + '">\
												<input class="form-control" type="text" id="input-' + org_field + '" placeholder="' + name + '"/>\
												<label for="input-' + org_field + '">\
													<i class="fa fa-asterisk"></i>\
													<span>' + org_field + '</span>\
												</label>\
											</span>\
							';

							/*addr2
							if(org_field != field) {
								collections += '\
											<span class="form-group '+ optional_class + '">\
												<input class="form-control" type="text" id="input-' + field + '2" />\
												<label for="input-' + field + '2">\
													<i class="fa fa-asterisk"></i>\
													<span>' + field + '2</span>\
												</label>\
											</span>\
								';
							}
							*/
						}
					});
					return collections;
					break;

				default:
					return data[key];
					break;
			}

		},
		makeJoinModalContent: function(sid,data,mode) {
			var collections = $.umember.makeJoinConditionsStr(sid,data,"collections"),
				captcha = $.umember.makeJoinConditionsStr(sid,data,"captcha"),
				privacy_type = (LANG == 'ko') ? 'privacy-join' : 'privacy',
				approval = (typeof data.approval != "undefined" && data.approval) ? data.approval : 'hand';

			var joinModal_html = '\
				<div class="flat-modal mng-join-modal mng-siteUM-modal">\
					<div class="modal modal-default fade" id="join-modal' + mode + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
						<div class="modal-dialog" role="document">\
							<div class="modal-content">\
								<div class="modal-header">\
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">\
										<span aria-hidden="true"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-siteUM-modal.png" alt="close"/></span>\
									</button>\
									<h5 class="modal-title" id="exampleModalLabel">' + $.lang[LANG]['manager.site-um.join.3'] + '</h5>\
									<p class="pre">' + data.description + '</p>\
								</div>\
								<div class="modal-body">\
									<span class="form-group optional initial">\
										<input class="form-control" type="text" id="input-id" placeholder="' + $.lang[LANG]['siteum.login.id'] + '"/>\
										<label for="input-id"><i class="fa fa-asterisk"></i><span>id</span></label>\
									</span>\
									<span class="form-group optional initial">\
										<input class="form-control" type="password" id="input-password" placeholder="' + $.lang[LANG]['siteum.login.password'] + '"/>\
										<label for="input-password"><i class="fa fa-asterisk"></i><span>password</span></label>\
									</span>\
									<span class="form-group optional initial">\
										<input class="form-control" type="password" id="input-password-checked" placeholder="' + $.lang[LANG]['siteum.login.password-check'] + '"/>\
										<label for="input-password-checked"><i class="fa fa-asterisk"></i><span>password2</span></label>\
									</span>' + collections + '\
								</div>\
								<div class="modal-footer"> ' + captcha + '\
									<button type="button" class="btn btn-primary" id="uJoin" data-approval="' + approval + '">' + $.lang[LANG]['manager.site-um.join.2'] + '</button>\
									<p>' + $.lang[LANG]['manager.site-um.join.txt.1'] + ' \
									<u><span class="view-join-textarea" data-type="acces-terms">' + $.lang[LANG]['manager.site-um.join.txt.2-1'] + '</span></u>' + $.lang[LANG]['manager.site-um.join.txt.2-2'] + '\
									<u><span class="view-join-textarea" data-type="' + privacy_type + '">' + $.lang[LANG]['manager.site-um.join.txt.3'] + '</span></u>' + $.lang[LANG]['manager.site-um.join.txt.4'] + '</p>\
									<textarea name="join-textarea" id="join-textarea" cols="30" rows="10" style="display: none;" readonly></textarea>\
									<p class="modal-change-wrap siteUM">' + $.lang[LANG]['manager.site-um.login.txt'] + ' <span class="login hand">' + $.lang[LANG]['manager.site-um.login'] + '</span></p>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
				';
			return joinModal_html;
		},
		joinModalInit: function(mode) {
			mode = (mode) ? '-' + mode : '';
			var joinModal = $('#join-modal' + mode);

			joinModal.find('.form-group').each(function() {
				$(this).removeClass('focus');
				$(this).find('.error').remove();
				$(this).find('input.form-control').val('');
				$(this).find('#join-textarea').html('');
			});
			
			joinModal.find('#wr_key').val('');
		},
		joinModalKeyFunc: function(mode) {
			mode = (mode) ? '-' + mode : '';
			var joinModal = $('#join-modal' + mode);

			if(!joinModal.find('.kcaptcha-wrap').hasClass('hide')) {
				load_kcaptcha();
				joinModal.find('#wr_key').live({
					keyup: function() {
						if($(this).val().trim().length > 0) { $(this).next('.error').remove(); }
					}
				});
			}

			joinModal.find('input.form-control').live({
				focus: function() {
					$(this).closest('.form-group').addClass('focus').siblings().removeClass('focus');
				}, 
				blur: function() {
					$(this).closest('.form-group').removeClass('focus');
				},
				keydown: function(key) {
					if(key.keyCode == 13) $('#uJoin').click();
				},
				keyup: function() {
					var groupEl = $(this).closest('.form-group'),
						errorEL = $(this).next().next('.error'),
						field = $(this).attr('id').trim().replace(/input-/,''),
						reg_has = (typeof COLLECTION_REGEX[field] != 'undefined' && COLLECTION_REGEX[field]) ? true : false,
						reg_pattern = (reg_has) ? COLLECTION_REGEX[field]['pattern_j'] : '',
						reg_ex = (reg_has) ? COLLECTION_REGEX[field]['ex'] : '';

					if(field=='password' || field == 'password-checked') {
						var pwEl = joinModal.find('#input-password'),
							pw2El = joinModal.find('#input-password-checked'),
							error_str = $.lang[LANG]['siteum.regexp.pw.invalid'];

						if(pwEl.val() == pw2El.val()) { 
							pw2El.next().next('.error').remove();
						} else {
							if(pw2El.val().length > 0) {
								if(pw2El.next().next('.error').length > 0) pw2El.next().next('.error').removeClass('empty').text(error_str);
								else pw2El.closest('.form-group').append('<span class="error">'+ error_str + '</span>');
							}
						}	
					}

					if(reg_has && errorEL.length > 0) { 

						var reg = new RegExp(reg_pattern);
						if(reg.test($(this).val())) errorEL.remove();
						else {
							if(errorEL.hasClass('empty')) errorEL.removeClass('empty').text(reg_ex);
						}

					}

				}
			});
		},
		showLoginModal: function(sid) {
			if($('#join-modal').length > 0 ) $('#join-modal').delay(3000).modal('hide');
			if($('#forgotpw-modal').length > 0 ) $('#forgotpw-modal').delay(3000).modal('hide');

			var content = $.umember.makeLoginModalContent();
			$.umember.showMngModal(sid, content, 'login-modal', false,
									function() { $.umember.LoginModalInit(); }, 
									function() { $.umember.loginModalKeyFunc(); }, '', '', '');
		},
		makeLoginModalContent: function() {
			var s_um = (PAGE_MODE == 'c') ? SITEUM : property.SITEUM,
				join_btn = (s_um == 1) ? '' : '<div class="btn-join siteUM"><span class="join hand">' + $.lang[LANG]['manager.site-um.join.3'] + '</span></div>',
				privacy_type = (LANG == 'kr') ? 'privacy-join' : 'privacy';

// delete - before join link
// join_btn = (s_um == 1) ? '' : '<p class="modal-change-wrap siteUM"><span class="mobile-hidden">' + $.lang[LANG]["siteum.login.account-yet"] + '</span> <span class="join hand">' + $.lang[LANG]['manager.site-um.join.3'] + '</span></p>',
				
			var loginModal_html = '\
				<div class="flat-modal mng-login-modal mng-siteUM-modal">\
					<div class="modal modal-default fade" id="login-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
						<div class="modal-dialog" role="document">\
							<div class="modal-content">\
								<div class="modal-header">\
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">\
										<span aria-hidden="true"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-siteUM-modal.png" alt="close"></span>\
									</button>\
									<h5 class="modal-title" id="exampleModalLabel">' + $.lang[LANG]['header.login'] + '</h5>\
								</div>\
								<div class="modal-body">\
									<span class="form-group optional initial">\
										<input class="form-control" type="text" id="input-id" placeholder="' + $.lang[LANG]['siteum.login.id'] + '"/>\
										<label for="input-id">\
											<i class="fa fa-asterisk"></i>\
											<span>id</span>\
										</label>\
									</span>\
									<span class="form-group optional initial">\
										<input class="form-control" type="password" id="input-password" placeholder="' + $.lang[LANG]['siteum.login.password'] + '"/>\
										<label for="input-password">\
											<i class="fa fa-asterisk"></i>\
											<span>password</span>\
										</label>\
									</span>\
								</div>\
								<div class="modal-footer">\
									<button type="button" class="btn btn-primary" id="uLogin">' + $.lang[LANG]['manager.site-um.login'] + '</button>\
									' + join_btn + '\
									<p class="modal-change-wrap siteUM"><span class="forgot-pw hand">' + $.lang[LANG]['siteum.forgot.id-pw'] + '</span></p>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
				';


			return loginModal_html;
		},
		loginModalInit: function(mode) {
			mode = (mode) ? '-' + mode : '';
			var loginModal = $('#login-modal'+mode);

			loginModal.find('.form-group').each(function() {
				$(this).removeClass('focus');
				$(this).find('.error').remove();
				$(this).find('input.form-control').val('');
			});
		},
		loginModalKeyFunc: function(mode) {
			mode = (mode) ? '-' + mode : '';
			var loginModal = $('#login-modal'+mode);

			loginModal.find('input.form-control').live({
				focus:   function(e) { $(this).closest('.form-group').addClass('focus').siblings().removeClass('focus'); }, 
				blur: 	 function(e) { $(this).closest('.form-group').removeClass('focus'); },
				keydown: function(e) { if(e.keyCode == 13) $('#uLogin').click(); },
				keyup: function(e) {
					var groupEl = $(this).closest('.form-group'),
						errorEL = $(this).next().next('.error');
					if($(this).val().length > 0) errorEL.remove();
				}
			});
		},
		showForgotIDModal: function(sid) {
			if($('#forgotpw-modal').length > 0 ) $('#forgotpw-modal').delay(3000).modal('hide');

			var content = $.umember.makeForgotIDModalContent();
			$.umember.showMngModal(sid, content, 'forgotid-modal', false, function() {
					$('#forgotid-modal').find('.error').remove();
					$('#forgotid-modal').find('input.form-control').val('');
					$('#forgotid-modal .modal-body').children().removeAttr('style');
					$('#forgotid-modal .modal-footer').children('button').removeAttr('style');
					$('#forgotid-modal').find('.forgot-id-result').text('');
				}, function() {
					$('#forgotid-modal').find('input.form-control').live({
						keydown: function(key) { if(key.keyCode == 13) $('#uForgotID').click(); },
						keyup: function() {
							$('#forgotid-modal .modal-body').children().removeAttr('style');
							$('#forgotid-modal .modal-footer').children('button').removeAttr('style');
							$('#forgotid-modal').find('.forgot-id-result').text('');
							var regexp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
								errorEL = $(this).closest('.form-group').find('.error');

							if(!regexp.test($(this).val())) errorEL.text($.lang[LANG]['siteum.regexp.check.email']);
							else errorEL.remove();
						}
					});
				}, '', '', '');
		},
		makeForgotIDModalContent: function() {
			var forgotIDModal_html = '\
				<div class="flat-modal mng-forgotid-modal mng-siteUM-modal">\
					<div class="modal modal-default fade" id="forgotid-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
						<div class="modal-dialog" role="document">\
							<div class="modal-content">\
								<div class="modal-header">\
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">\
										<span aria-hidden="true"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-siteUM-modal.png" alt="close"></span>\
									</button>\
									<h5 class="modal-title" id="exampleModalLabel">' + $.lang[LANG]['siteum.forgot.id.link'] + '</h5>\
								</div>\
								<div class="modal-body">\
									<div>' + $.lang[LANG]['siteum.forgot.id.description'] + '</div>\
									<span class="form-group">\
										<input class="form-control" type="text" id="input-email" placeholder="' + $.lang[LANG]['siteum.forgot.pw.input-email'] + '"/>\
									</span>\
									<div class="forgot-id-result"></div>\
								</div>\
								<div class="modal-footer">\
									<button type="button" class="btn btn-primary" id="uForgotID">' + $.lang[LANG]['siteum.forgot.id.btn'] + '</button>\
									<p class="modal-change-wrap siteUM"> <span class="forgot-pw hand">' + $.lang[LANG]['siteum.forgot.pw.link'] + '</span></p>\
									<p class="modal-change-wrap siteUM"> <span class="login hand">' + $.lang[LANG]['manager.site-um.login'] + '</span></p>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
			';

			return forgotIDModal_html;
		},
		showForgotPWModal: function(sid) {
			if($('#login-modal').length > 0 ) $('#login-modal').delay(3000).modal('hide');
			if($('#forgotid-modal').length > 0 ) $('#forgotid-modal').delay(3000).modal('hide');

			var content = $.umember.makeForgotPWModalContent();
			$.umember.showMngModal(sid, content, 'forgotpw-modal', false, function() {
					$('#forgotpw-modal').find('.focus').removeClass('focus');
					$('#forgotpw-modal').find('.error').remove();
					$('#forgotpw-modal').find('input.form-control').val('');
				}, function() {
					$('#forgotpw-modal').find('input.form-control').live({
						foucs: function() { $(this).closest('.form-group').addClass('focus').siblings().removeClass('focus'); },
						blur: function() { $(this).closest('.form-group').removeClass('focus'); },
						keydown: function(key) { if(key.keyCode == 13) $('#uForgotPW').click(); },
						keyup: function() { 
							var regexp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
								field = $(this).attr('id').trim().replace(/input-/,''),
								errorEL = $(this).closest('.form-group').find('.error');

							if(field == 'email' && !regexp.test($(this).val())) errorEL.text($.lang[LANG]['siteum.regexp.check.email']);
							else errorEL.remove();
						}
					});
				}, '', '', '');
		},
		makeForgotPWModalContent: function() {
			var forgotPWModal_html = '\
				<div class="flat-modal mng-forgotpw-modal mng-siteUM-modal">\
					<div class="modal modal-default fade" id="forgotpw-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
						<div class="modal-dialog" role="document">\
							<div class="modal-content">\
								<div class="modal-header">\
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">\
										<span aria-hidden="true"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-siteUM-modal.png" alt="close"></span>\
									</button>\
									<h5 class="modal-title" id="exampleModalLabel">' + $.lang[LANG]['siteum.forgot.pw.title'] + '</h5>\
								</div>\
								<div class="modal-body">\
									<div>' + $.lang[LANG]['siteum.forgot.pw.description'] + '</div>\
									<span class="form-group">\
										<input class="form-control" type="text" id="input-id" placeholder="' + $.lang[LANG]['manager.list.info.id'] + '"/>\
									</span>\
									<span class="form-group">\
										<input class="form-control" type="text" id="input-email" placeholder="' + $.lang[LANG]['siteum.forgot.pw.input-email'] + '"/>\
									</span>\
								</div>\
								<div class="modal-footer">\
									<button type="button" class="btn btn-primary" id="uForgotPW">' + $.lang[LANG]['siteum.forgot.pw.btn'] + '</button>\
									<p class="modal-change-wrap siteUM"> <span class="forgot-id hand">' + $.lang[LANG]['siteum.forgot.id.link'] + '</span></p>\
									<p class="modal-change-wrap siteUM"> <span class="login hand">' + $.lang[LANG]['manager.site-um.login'] + '</span></p>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
			';

			return forgotPWModal_html;
		},
		showMypageModal: function(sid) {
			if($('.mng-siteUM-modal').length > 0 ) $('.mng-siteUM-modal').children().first().modal('hide');

			$.getJSON('/umember/getSiteUM/type/mypage', function(data) {
				if(typeof data.error != "undefined" && data.error) {
					alert(data.error);
					return false;
				}
				// COLLECTION_REGEX = $.parseJSON(data['regExp']);
				COLLECTION_REGEX = data['regExp'];

				var content = $.umember.makeMypageContent(sid,data);
				$('body').find('.dsgn-body').append('<link rel="stylesheet" href="/css/manager.css" type="text/css" class="manager_css">');
				$.umember.showMngModal(sid, content, 'mypage-modal', false,
										function() { }, 
										function() { }, 
										function() { $('body .dsgn-body').find('link.manager_css').remove(); }, '', '');
			});
		},
		makeMypageConditionsStr: function(sid,data) {
			var collections = '',
				uid = data['id']['value'],
				make_pass = ['sid', 'no', 'image', 'regExp'];

			$.each(data, function(field,o) {

				if($.inArray(field,make_pass) == -1) {
					var name = (o["name"]) ? o["name"] : $.lang[LANG]['manager.list.info.'+field],
						optional = (o["optional"]) ? o["optional"] : false,
						optional_class = (optional) ? "optional" : "";

					collections += '\
										<div class="mng-panel col-xs-12 col-sm-12 col-md-12 no-padding clearfix '+ optional_class + '" data-type="'+ field +'">\
											<label class="mng-panel-label col-xs-3 col-sm-3 col-md-3 no-padding">' + name + '</label>\
											<div class="mng-panel-body col-xs-9 col-sm-9 col-md-9 no-padding">\
					';
					if(typeof o['value'] == "object") {
						$.each(o['value'], function(i,v) {
							collections += '\
												<span class="my-data my-' + field + (i+1) +'">' + v + '</span>\
							';
						});
					} else {
					collections += '\
												<span class="my-data my-' + field + '">' + o["value"] + '</span>\
					';
					}
					collections += '\
											</div>\
										</div>\
					';
				}
			});
			return collections;
		},
		makeMypageContent: function(sid,data) {	
			var collections = $.umember.makeMypageConditionsStr(sid,data);

			var mypage_html = '\
				<div class="flat-modal mng-mypage-modal mng-siteUM-modal">\
					<div class="modal modal-default fade" id="mypage-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-uid="' + data['id']['value'] + '">\
						<div class="modal-dialog" role="document">\
							<div class="modal-content">\
								\
								<div class="modal-header">\
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">\
										<span aria-hidden="true"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-siteUM-modal.png" alt="close"></span>\
									</button>\
									<!--<h5 class="modal-title" id="exampleModalLabel">my page</h5>-->\
								</div>\
								\
								<div id="mypage-view">\
									<div class="mng-top mng-member">\
										<div class="container">\
											<div class="row multi-columns-row">\
												<div class="col-xs-12 col-sm-12 col-md-10 col-sm-offset-0 col-md-offset-1">\
													<div class="navbar-header">\
														<ul class="mng-nav nav tab-nav nav-pills">\
															<li class="active"><a href="javascript:;"><div>' + $.lang[LANG]['manager.site-um.mypage'] + '</div></a></li>\
															<!--<li><a href="javascript:;"><div>메시지</div></a></li>-->\
														</ul>\
													</div>\
												</div>\
											</div>\
										</div>\
									</div>\
									\
									<div class="mng-body mng-member">\
										<div class="container">\
											<div class="row multi-columns-row">\
												<div class="col-xs-12 col-sm-12 col-md-10 col-sm-offset-0 col-md-offset-1">\
													\
													<div class="mng-settings" data-type="profile">\
														<h5 class="mng-title col-xs-12 col-sm-3 col-md-3">' + $.lang[LANG]['manager.mypage.profile.title'] + '</h5>\
														<div class="mng-wrap col-xs-12 col-sm-9 col-md-9">\
															<div class="col-xs-12 col-sm-4 col-md-4 no-padding">\
																<div class="profile-image-wrap no-opacity">\
																	<div>\
																		<span class="top"></span>\
																		<span class="bottom"></span>\
																	</div>\
																	<img class="my-image img-responsive" src="' + data['image'] + '" alt="profile image"/>\
																</div>\
																<p><a class="my-image-edit hand">' + $.lang[LANG]['manager.mypage.profile.image.edit'] + '<i class="fa fa-caret-right"></i></a></p>\
															</div>\
															<div class="col-xs-12 col-sm-8 col-md-8 no-padding cl-wrap">\
																' + collections + '\
																<div class="mng-btn-wrap text-right">\
																	<button class="btn btn-sm btn-default my-cl-edit">' + $.lang[LANG]['config.edit'] + '</button>\
																	<button class="btn btn-sm btn-default my-cl-cancel" style="display: none;">' + $.lang[LANG]['config.cancel'] + '</button>\
																	<button class="btn btn-sm my-cl-save" style="display: none;">' + $.lang[LANG]['config.save'] + '</button>\
																</div>\
															</div>\
														</div>\
													</div>\
													\
													<div class="mng-settings" data-type="password-change">\
														<h5 class="mng-title col-xs-12 col-sm-6 col-md-6">' + $.lang[LANG]['manager.mypage.pw-change.title'] + '</h5>\
														<div class="mng-wrap col-xs-12 col-sm-6 col-md-6">\
																\
																<div class="mng-panel col-xs-12 col-sm-12 col-md-12 no-padding clearfix">\
																	<label class="mng-panel-label col-xs-3 col-sm-4 col-md-4 no-padding">' + $.lang[LANG]['manager.mypage.pw-change.current'] + '</label>\
																	<div class="mng-panel-body col-xs-9 col-sm-8 col-md-8 no-padding">\
																		<input class="form-control" type="password" id="input-password"/>\
																	</div>\
																</div>\
																<div class="mng-panel col-xs-12 col-sm-12 col-md-12 no-padding clearfix">\
																	<label class="mng-panel-label col-xs-3 col-sm-4 col-md-4 no-padding">' + $.lang[LANG]['manager.mypage.pw-change.new'] + '</label>\
																	<div class="mng-panel-body col-xs-9 col-sm-8 col-md-8 no-padding">\
																		<input class="form-control" type="password" id="input-new-password"/>\
																	</div>\
																</div>\
																<div class="mng-panel col-xs-12 col-sm-12 col-md-12 no-padding clearfix">\
																	<label class="mng-panel-label col-xs-3 col-sm-4 col-md-4 no-padding">' + $.lang[LANG]['manager.mypage.pw-change.check'] + '</label>\
																	<div class="mng-panel-body col-xs-9 col-sm-8 col-md-8 no-padding">\
																		<input class="form-control" type="password" id="input-new-password-checked"/>\
																	</div>\
																</div>\
																<div class="mng-btn-wrap">\
																	<button class="btn btn-sm my-password-save">' + $.lang[LANG]['config.save'] + '</button>\
																</div>\
																\
														</div>\
													</div>\
													\
													<div class="mng-bottom-description">\
														<a class="my-privacy-show" href="/siteinfo/privacy" target="_blank">' + $.lang[LANG]['manager.mypage.privacy-show'] + ' <i class="fa fa-caret-right"></i></a>\
														<a class="my-terms-show" href="/siteinfo/terms" target="_blank">' + $.lang[LANG]['manager.mypage.terms-show'] + ' <i class="fa fa-caret-right"></i></a>\
														<a class="my-account-remove"  href="javascript:;">' + $.lang[LANG]['manager.mypage.my-remove'] + ' <i class="fa fa-caret-right"></i></a>\
													</div>\
													\
												</div>\
											</div>\
										</div>\
									</div>\
								</div>\
								\
							</div>\
						</div>\
					</div>\
				</div>\
			';

			return mypage_html;
		},
		showMyImageUploadModal: function(sid,uid,src) {
			var content = '\
				<div class="flat-modal mng-mypage-modal">\
					<div class="modal modal-default fade" id="my-image-modal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true" data-uid="' + uid + '">\
						<div class="modal-dialog w385">\
							<div class="modal-content">\
								<button type="" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-modal.png" alt="close"></span></button>\
								<div class="modal-body">\
									<div class="profile-image-wrap">\
										<div>\
											<span class="top"></span>\
											<span class="bottom"></span>\
										</div>\
										<img class="my-image img-responsive" src="' + src + '" alt="profile image" />\
									</div>\
									<p>' + $.lang[LANG]['manager.mypage.profile.image.note'] + ' <strong>' + $.lang[LANG]['manager.mypage.profile.image.size'] + '</strong></p>\
								</div>\
								<div id="progress" class="progress">\
									<div class="progress-bar progress-bar-success"></div>\
								</div>\
								<div class="modal-footer">\
									<button type="button" class="btn btn-default" data-dismiss="modal">' + $.lang[LANG]['config.close'] + '</button>\
									<span class="btn btn-primary fileinput-button">\
										<span>' + $.lang[LANG]['manager.mypage.profile.image.apply'] + '</span>\
										<input id="fileupload" class="modal-upload-button my-image-upload" type="file" name="files[]" data-sid="' + sid + '" data-uid="' + uid + '" >\
									</span>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
			';

			$.umember.showMngModal(sid, content, 'my-image-modal', false, '', '', '', '', '');
		}
	} /*umember end*/





	/***********************************************************************************************************************************member-config page START*/
	$('#join-activate, #join-language, #join-approval, #join-display, #join-captcha').live('change', function () {
		var key = $(this).attr('id').replace(/join-/gi,''),
			val = ($(this).is('select')) ? $(this).val() : $(this).prop('checked');

		$.ajax({
			type: 'POST',
			url: '/umember/update/type/condition',
			data: { sid : SID, key : key, val : val },
			dataType: 'json',
			async: true,
			success: function(data) {
				if(typeof data.error != "undefined" && data.error) {
					alert(data.error);
					return false;
				}
			}
		});
	});


	$('.collection-item-used, .collection-item-optional').live('click', function() {
		if($(this).closest('.checkboxs').hasClass('disabled')) {
			var modal = $(this).showModalFlat('INFORMATION', $.lang[LANG]['manager.check.required.message'], true, false, '', 'ok');
			return false;
		}
		var key = 'collections',
			// cl_etc = (typeof $(this).closest('.collection-item').attr('data-etc') != 'undefined' && $(this).closest('.collection-item').attr('data-etc')) ? $(this).attr('data-etc') : '',
			cl_field = $(this).attr('id').slice($(this).attr('id').lastIndexOf('-')+1, $(this).attr('id').length),
			cl_key = $(this).attr('class').slice($(this).attr('class').lastIndexOf('-')+1, $(this).attr('class').length), 
			cl_val = $(this).prop('checked');

		var cl_data = {
			field : cl_field,
			key : cl_key,
			val : cl_val
		};

		$.ajax({
			type: 'POST',
			url: '/umember/update/type/condition',
			data: { sid: SID, key: key, val: JSON.stringify(cl_data) },
			dataType: 'json',
			async: true,
			success: function(data) {
				if(typeof data.error != "undefined" && data.error) {
					alert(data.error);
					return false;
				}
			}
		});
	});


	$('.collection-add').live('click',function() {
		if($('.collection-content').find('.collection-item.additem').length>0) return false;
		if($('.collection-content').find('.collection-update').length>0) {
			$('.collection-content .collection-update').find('input').focus();
			return false;
		}
		if($('.collection-content').find('.collection-item').length==15) $(this).hide();
		if($('.collection-content').find('.collection-item').length>16) {
			var modal = $(this).showModalFlat('DELETE FIELD', $.lang[LANG]['manager.join.cl.item.max-add'], true, false, '', 'ok');
			return false;
		}

		var cl_etc_arr = $('.collection-content .collection-item').map(function() { 
							var cl_type = $(this).attr('data-type');
							if(cl_type.match(/^etc/)) return cl_type.replace('etc','');
						}).get().sort(),
			cl_etc = $('.collection-content .collection-item').length-6;

		for (var i = 0; i < 10; i++) {
			if(typeof cl_etc_arr[i] == "undefined" || parseInt(cl_etc_arr[i]) != (i+1) ) {
				cl_etc = i+1; 
				break;
			}
		}

		var str = collectionItem('',cl_etc);

		$('.collection-content').append(str).find('.collection-item[data-etc="' + cl_etc + '"] .collection-edit').click();
		collectionSortable('.collection-item');
	});


	

	$('.collection-edit').live('click', function() {
		if($('.collection-content').find('.collection-update').length > 0 ) return false;
		collectionSortable('.collection-item');

		var selectCl = $(this).closest('.collection-item'),
			cl_name = selectCl.find('.collection-name').text(),
			input_text = addCollectionInput(cl_name);

		// $(input_text).prependTo(selectCl.find('.collection-info'));
		$(input_text).prependTo(selectCl);

		$('.collection-content').find('.collection-item').css('pointer-events','none');
		$('.collection-content').find('.collection-update-cancel, .collection-update-save, .collection-update-name').css('pointer-events','auto');

		$('.collection-update .collection-update-name').focus();
	});

	$('.collection-delete').live('click', function() {
		var selectCl = $(this).closest('.collection-item'),
			cl_etc = (typeof selectCl.attr('data-etc') != 'undefined' && selectCl.attr('data-etc')) ? selectCl.attr('data-etc') : '',
			cl_name = 'etc' + cl_etc;

		var del_modal = $(this).showModalFlat('DELETE COLLECTION ITEM', $.lang[LANG]['manager.join.cl.item.delete'], true, true, function() {

			$.post('/umember/delete/type/collection', { sid: SID, val : cl_name }, function(data) {
				$.processON();
				if(typeof data.error != "undefined" && data.error) {
					alert(data.error);
					return false;
				}

				$('.collection-content').find('.collection-item[data-etc="'+cl_etc+'"]').remove();
				if($('.collection-content').find('.collection-item').length<16) $('.collection-add').show();
				collectionSortable();
				del_modal.modal('hide');

				setTimeout(function() {
					$.processOFF();
				}, 600);

			}, 'json');

		}, 'cancel');
	});


	$('.collection-update-cancel').live('click', function() {
		if($('.collection-content').find('.collection-item').length<16) $('.collection-add').show();
		if(!$(this).closest('.collection-item').find('.collection-name').text()) {
			$(this).closest('.collection-item').remove();
		}
		$('.collection-content').find('.config-error').remove();
		$('.collection-content').find('.collection-item').removeAttr('style');
		$(this).closest('.collection-update').remove();
		collectionSortable();
	});

	$('.collection-update-save').live('click', function() {
		var selectCl = $(this).closest('.collection-item'),
			cl_etc = (typeof selectCl.attr('data-etc') != 'undefined' && selectCl.attr('data-etc')) ? selectCl.attr('data-etc') : '',
			cl_field = 'etc' + cl_etc,
			cl_type = selectCl.find('.collection-item-type-select').val(),
			cl_name = selectCl.find('.collection-update-name').val().trim(),
			cl_prev = selectCl.find('.collection-name').val().trim(),
			regexp = /^[ㄱ-ㅎ가-힣ㅏ-ㅣa-zA-Z0-9\# ]+$/i;

		$('.collection-content .config-error').remove();

		if(cl_prev == cl_name) {
			if(selectCl.hasClass('additem')) {

				selectCl.append('<div class="config-error collection-edit">' + $.lang[LANG]['manager.join.cl.item.name.enter'] + '</div>');
			} else {
				$('.collection-content').find('.collection-item').removeAttr('style');
				$('.collection-content').find('.collection-update').remove();
			}
			return false;
		}
		if(!regexp.test(cl_name)) {
			selectCl.append('<div class="config-error collection-edit">' + $.lang[LANG]['board.allowed-chars'] + '</div>');
			return false;
		}
		if(cl_name.length<1) {
			selectCl.append('<div class="config-error collection-edit">' + $.lang[LANG]['board.enter-group-name'] + '</div>');
			return false;
		}
		if(cl_name.length>20) {
			selectCl.append('<div class="config-error collection-edit">' + $.lang[LANG]['board.enter-max-chars'] + '</div>');
			return false;
		}
		var cl_name_list = $('.collection-content').find('.collection-name').map(function() { return $(this).text().trim(); }).get();
		if($.inArray(cl_name,cl_name_list) > -1) {
			selectCl.append('<div class="config-error collection-edit">' + $.lang[LANG]['manager.join.cl.item.name.inuse'] + '</div>');
			return false;
		}

		var collections = {};
		$('.collection-content').children('.collection-item').each(function() {
			var field = $(this).attr('data-type'),
				name = (field == cl_field) ? cl_name : $(this).find('.collection-name').text().trim(),
				type = (field == cl_field) ? cl_type : $(this).find('.collection-item-type-select').val(),
				used = $(this).find('.collection-item-used').prop('checked'),
				optional = $(this).find('.collection-item-optional').prop('checked');

			collections[field] = {
				'used'	: used,
				'optional'	: optional,
				'name'	: name,
				'type'	: type
			};
		});
		
		$.ajax({
			type: 'POST',
			url: '/umember/update/type/condition',
			data: { sid: SID, key: 'collections_all', val: JSON.stringify(collections) },
			dataType: 'json',
			async: true,
			success: function(data) {
				if(typeof data.error != "undefined" && data.error) {
					alert(data.error);
					return false;
				}

				if(selectCl.hasClass('additem')) {
					selectCl.removeClass('additem');
					selectCl.find('#collection-item-used-additem').removeAttr('id').attr('id','collection-item-used-'+cl_field);
					// selectCl.find('label[for="collection-item-used-additem"]').removeAttr('for').attr('for','collection-item-used-'+cl_field);
					selectCl.find('#collection-item-optional-additem').removeAttr('id').attr('id','collection-item-optional-'+cl_field);
					// selectCl.find('label[for="collection-item-optional-additem"]').removeAttr('for').attr('for','collection-item-optional-'+cl_field);
				}
				selectCl.find('.collection-name').text(cl_name);

				$('.collection-content').find('.config-error').remove();
				$('.collection-content').find('.collection-item').removeAttr('style');
				selectCl.find('.collection-update').remove();
				collectionSortable();

			}
		});
	});


	$('#join-acces-terms, #join-privacy, #join-privacy-join, #join-description').live('blur', function() {
		var key = $(this).attr('id').replace(/join-/gi,'').replace(/-/gi,'_'),
			val = $(this).val(),
			mng_settings_el = $(this).closest('.mng-settings');

		$.ajax({
			type: 'POST',
			url: '/umember/update/type/condition',
			data: { sid : SID, key : key, val : val },
			dataType: 'json',
			async: true,
			success: function(data) {
				if(typeof data.error != "undefined" && data.error) {
					alert(data.error);
					return false;
				}
				mngShowToast('check', '저장완료', mng_settings_el);
			}
		});

	});


	/*가입 수집 항목 : type 변경 기능(추후) 사용되는 부분.*/
	$('.collection-toggle').live('click', function() {
	    $(this).closest('.collection-item').toggleClass('item-content-open');
	    if($(this).closest('.collection-item').hasClass('item-content-open')) {
	        $(this).removeClass('fa-angle-down').addClass('fa-angle-up');
	        // $(this).closest('.collection-item').find('.collection-item-content').removeAttr('style');
	    } else {
	        $(this).removeClass('fa-angle-up').addClass('fa-angle-down');
	        // $(this).closest('.collection-item').find('.collection-item-content').css('display','none');
	    }
	});


	$('.profile-image-wrap').live({
		click: function() {
			if($(this).hasClass('no-opacity')) $('.my-image-edit').click();
			else $('.my-image-upload').click();
		}
	})

	$('.my-image-upload').live({
		click: function() {

			var sid = $('#my-image-modal').attr('data-sid'),
				uid = $('#my-image-modal').attr('data-uid');

			$(this).fileupload({
				url: '/umember/update/type/myimage/sid/'+sid+'/uid/'+uid,
				dataType: 'json',
				pasteZone: null,
				async: true,
				add: function(e, data) {
					$('#loading').css('left','-100%');
					$.processON();
					data.submit();
				}, 
				done: function(e, data) {
					if(typeof data.result.error != 'undefined' && data.result.error) {
						alert(data.result.error);
						$('.progress .progress-bar').css('width','0%');
						$.processOFF();
						return;
					}
					if(data.result.src) $('.my-image').prop('src',data.result.src);
					$.processOFF();
					$('#loading').css('left','50%');
				},
				progressall: function(e, data) {
					var progress = parseInt(data.loaded / data.total * 100, 10);
					$('.progress .progress-bar').css(
						'width',
						progress + '%'
					);
				},
			}).prop('disabled', !$.support.fileInput)
				.parent().addClass($.support.fileInput ? undefined : 'disabled');

		}
	});


	$('#uJoin').live('click', function() {
		var joinModal = $('#join-modal'),
			approval = $(this).attr('data-approval'),
			input_data = {};

		if($(this).closest('#join-modal-preview').length != 0) {
			$(this).showModalFlat('INFORMATION', $.lang[LANG]['manager.check.no-support.render-mode'], true, false, '', 'ok');
			return false; 
		}

		joinModal.find('.form-group').each(function(i) { 
			var inputEL = $(this).find('input.form-control'),
				errorEL = $(this).find('.error'),
				field 	= inputEL.attr('id').trim().replace(/input-/,''),
				val		= inputEL.val(), 
				optional = $(this).hasClass('optional'),
				empty_class = (optional && val.trim().length == 0) ? 'empty' : '',
				error_str =   (optional && val.trim().length == 0) ? $.lang[LANG]['manager.check.required.message'] : '';

			if(!error_str && val.trim().length > 0) {
				switch(field) {
					case 'password-checked': 
						if(joinModal.find('#input-password').val().trim() != val.trim()) {
							error_str = $.lang[LANG]['siteum.regexp.pw.invalid'];
						}
						break;

					default:
						if(typeof  COLLECTION_REGEX[field] != 'undefined' &&  COLLECTION_REGEX[field]) {
							var pattern = COLLECTION_REGEX[field]['pattern_j'],
								reg = new RegExp(pattern);
							if(!reg.test(val)) error_str = COLLECTION_REGEX[field]['error'];
						}
						break;
				}
			}


			if(error_str.length > 0) {
				if(errorEL.length > 0) errorEL.text(error_str);
				else $(this).append('<span class="error ' + empty_class + '">' + error_str + '</span>');

				if(joinModal.find('.focus').length == 0) inputEL.focus();
			} else {
				errorEL.remove();

				if(field == 'password') val = hex_md5(val);
				if(field != 'password-checked') input_data[field] = val;
			}

		});

		if(!joinModal.find('.kcaptcha-wrap').hasClass('hide')) {
			var captcha = joinModal.find('#wr_key'),
				val = captcha.val(),
				captcha_error = captcha.next('label.error'),
				error_str = '';

			if( val.trim().length == 0 ) {
				error_str = $.lang[LANG]['manager.join.regexp.captcha'];
			} else if( val && (Base64.encode(val.trim()) != md5_norobot_key)) {
				error_str = $.lang[LANG]['manager.join.regexp.captcha.wrong'];
			} 

			if( error_str.length > 0 ) {
				if(captcha_error.length > 0) captcha_error.text(error_str);
				else captcha.after('<label class="error">' +  error_str + '</label>');
				
				if(joinModal.find('.focus').length == 0) captcha.focus();
			} else {
				captcha_error.remove();
			}
		}


		if(joinModal.find('.error').length == 0) {

			var sid = joinModal.attr('data-sid');
			$.post('/umember/join/update', { sid : sid, data : JSON.stringify(input_data) }, function(data) {
				if(typeof data.error != 'undefined' && data.error) {
					$.each(data.error, function(key,str) {
						if(joinModal.find('#input-'+key).length > 0 ) {
							joinModal.find('#input-'+key).focus();
							joinModal.find('#input-'+key).closest('.form-group').append('<span class="error">' + str + '</span>');
						} else { alert(str,'/manager/member'); return false; }
					});
					if(joinModal.find('.error').length > 0) return false;
				}
				
				if(typeof userSiteJoinCallback == 'function')
			    			userSiteJoinCallback();
			    		
				var okModal = $(this).showModalFlat('INFORMATION', $.lang[LANG]['manager.join.success.'+approval], true, false, '', $.lang[LANG]['config.close']);
				$.umember.joinModalInit();
				joinModal.modal('hide');
			},'json');

		}


	});


	$('.view-join-textarea').live('click', function() {
		var sid = $(this).closest('.modal-default').attr('data-sid'),
			type = $(this).attr('data-type').replace(/-/gi,'_');

		$.post('/umember/getSiteUM/type/join', { sid : sid, field : type }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				alert(data.error);
				return false;
			}

			$('#join-textarea').html(data);
			if($('#join-textarea').css('display') == 'none') $('#join-textarea').fadeIn();

		}, 'json');

	});


	$('#uLogin').live('click', function() {
		var loginModal = $('#login-modal'),
			input_data = {};

		loginModal.find('.form-group').each(function(i) { 
			var inputEL = $(this).find('input.form-control'),
				errorEL = $(this).find('.error'),
				field 	= inputEL.attr('id').trim().replace(/input-/,''),
				val		= inputEL.val(),
				error_str = (val.trim().length == 0) ? $.lang[LANG]['siteum.regexp.'+field+'.input'] : '';

			if(error_str.length > 0 ) {
				if(errorEL.length > 0) errorEL.text(error_str);
				else $(this).append('<span class="error">' + error_str + '</span>');

				if(loginModal.find('.focus').length == 0) inputEL.focus();
			} else {
				errorEL.remove();
				if(field == 'password') val = hex_md5(val);
				input_data[field] = val;
			}
		});

		if(loginModal.find('.error').length == 0) {

			var sid = loginModal.attr('data-sid');
			$.post('/umember/login/in', { sid : sid, data : JSON.stringify(input_data) }, function(data) {
				if(typeof data.error != 'undefined' && data.error) {
					$.each(data.error, function(key,str) {
						if(loginModal.find('#input-'+key).length > 0 ) {
							loginModal.find('#input-'+key).closest('.form-group').append('<span class="error">' + str + '</span>');
						} else { alert(str,'/manager/member'); return false; }
					});
					if(loginModal.find('.error').length > 0) return false;
				}

				// if(data.member.check_login) {
				// 	if(typeof data.ss_url != "undefined" && data.ss_url) {
				// 		$.get(data.ss_url, function(data) {
				// 			console.log(data);
				// 		});
				// 	}
				// }

				$.umember.loginModalInit();
				$.umember.init();
				loginModal.modal('hide');

				if($('.menu-lock-block').length > 0 || $('.forum-view').length > 0) location.reload(); 
				if($('.element[data-type="forum"]').length > 0) {
					if( 
						$('.element[data-type="forum"]').find('.tpl-forum-list-title[data-option="S"]').length > 0 ||
						$('.element[data-type="forum"]').find('.container .table tr > td[colspan="10"]').length > 0 ||
						$('.element[data-type="forum"]').find('.tpl-forum-write:contains(login)').length > 0 
					) location.reload();
				}

			},'json');

		}

	});

	$('#uForgotID').live('click', function() {
		var forgotIDModal = $('#forgotid-modal'),
			input_data = '';

		var groupEL = forgotIDModal.find('.form-group'),
			errorEL = groupEL.find('.error'),
			val		= forgotIDModal.find('input.form-control').val(),
			regexp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
			error_str = (val.trim().length == 0) ? $.lang[LANG]['siteum.regexp.email.input'] : '';
		
		if(error_str.length == 0 &&  !regexp.test(val)) {
			error_str = $.lang[LANG]['siteum.regexp.check.email'];
		}

		if(error_str.length > 0 ) {
			if(errorEL.length > 0) errorEL.text(error_str);
			else groupEL.append('<span class="error">' + error_str + '</span>');
			
			groupEL.find('input').focus();
		} else {
			errorEL.remove();
			input_data = val;
		}

		if(forgotIDModal.find('.error').length == 0) {

			$.post('/umember/password/forgot', { email : input_data }, function(data) {
				if(typeof data.error != 'undefined' && data.error) {
					$.each(data.error, function(key,str) {
						if(forgotIDModal.find('#input-'+key).length > 0 ) {
							forgotIDModal.find('#input-'+key).closest('.form-group').append('<span class="error">' + str + '</span>');
							forgotIDModal.find('#input-'+key).focus();
						} else { return false; }
					});
					if(forgotIDModal.find('.error').length > 0) return false;
				}

				forgotIDModal.find('input.form-control').val('');
				var num = ((data.uid.length/3)*2).toFixed(0),
					uid = data.uid.substr(0,num);
				for(var i=0; i<(data.uid.length-num); i++) {
					uid += '*';
				}
				forgotIDModal.find('.modal-body').children(':not(.forgot-id-result)').css({'opacity':0.4});
				forgotIDModal.find('.modal-footer').children('button').css({'opacity':0.4, 'pointer-events':'none'});
				forgotIDModal.find('.modal-body').find('.forgot-id-result').text(uid);

			},'json');

		}

	});

	$('#uForgotPW').live('click', function() {
		var forgotPWModal = $('#forgotpw-modal'),
			input_data = {};

		forgotPWModal.find('.form-group').each(function(i) { 
			var inputEL = $(this).find('input.form-control'),
				errorEL = $(this).find('.error'),
				field 	= inputEL.attr('id').trim().replace(/input-/,''),
				val		= inputEL.val(),
				regexp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
				error_str = (val.trim().length == 0) ? $.lang[LANG]['siteum.regexp.'+field+'.input'] : '';
			
			if(error_str.length == 0 &&  field == 'email' && !regexp.test(val)) {
				error_str = $.lang[LANG]['siteum.regexp.check.email'];
			}

			if(error_str.length > 0 ) {
				if(errorEL.length > 0) errorEL.text(error_str);
				else $(this).append('<span class="error">' + error_str + '</span>');

				if(forgotPWModal.find('.focus').length == 0) inputEL.closest('.form-group').addClass('focus').find('input').focus();
			} else {
				errorEL.remove();
				input_data[field] = val;
			}
		});

		if(forgotPWModal.find('.error').length == 0) {

			$.post('/umember/password/forgot', { uid : input_data['id'], email : input_data['email'] }, function(data) {
				if(typeof data.error != 'undefined' && data.error) {
					$.each(data.error, function(key,str) {
						if(forgotPWModal.find('#input-'+key).length > 0 ) {
							forgotPWModal.find('#input-'+key).closest('.form-group').append('<span class="error">' + str + '</span>');
							forgotPWModal.find('#input-'+key).focus();
						} else { return false; }
					});
					if(forgotPWModal.find('.error').length > 0) return false;
				}
				forgotPWModal.find('input.form-control').val('');
				forgotPWModal.modal('hide');

				var modal = $(this).showModalFlat('INFORMATION', data.result, true, false, '', 'ok');
				// var modal = $(this).showModalFlat('INFORMATION', '<h3>이메일 발송 완료!</h3><p>비밀번호 재설정 링크 확인 및 변경을 위한 이메일을 확인하세요.</p>', true, false, '', 'ok');

			},'json');

		}

	});

	$('.siteCM .clogin').live({
		click: function(e) {
			e.preventDefault();
			var sid = (typeof SID != 'undefined' && SID) ? SID : property.SID;

			var possible_page = ['s', 'um'];
			if(typeof PAGE_MODE != 'undefined' && $.inArray(PAGE_MODE,possible_page) == -1) {
				var str = (PAGE_MODE == 'r') ? $.lang[LANG]['manager.check.no-support.render-mode'] : $.lang[LANG]['manager.check.no-support.config-mode'];
				$(this).showModalFlat('INFORMATION',str,true,false,'','ok');
				return false;
			} else {
					
				if($(this).hasClass('clogin')) {
					var loginModal = $.cmember.showLoginModal();
				}
			}
		}
	});


	$('.siteUM .join, .siteUM .login, .siteUM .forgot-id, .siteUM .forgot-pw, .siteUM .mypage, .siteUM .logout, .siteUM-dmenu-wrap .mypage, .siteUM-dmenu-wrap .logout').live({
		click: function(e) {
			e.preventDefault();
			var sid = (typeof SID != 'undefined' && SID) ? SID : property.SID;

			var possible_page = ['s', 'um'];
			if(typeof PAGE_MODE != 'undefined' && $.inArray(PAGE_MODE,possible_page) == -1) {
				var str = (PAGE_MODE == 'r') ? $.lang[LANG]['manager.check.no-support.render-mode'] : $.lang[LANG]['manager.check.no-support.config-mode'];
				$(this).showModalFlat('INFORMATION',str,true,false,'','ok');
				return false;
			} else {
				if($(this).hasClass('join')) {
					var mode = (typeof $(this).attr('data-preview') == "undefined") ? '' : 'preview';
					// if($('#join-modal-preview'))
					var joinModal = $.umember.showJoinModal(sid,mode);
				} else if($(this).hasClass('login')) {
					if($('header').hasClass('_admin')) { //goto url -> uadmin login page
						if($(this).closest('#join-modal-preview').length >0) {
				            $(this).showModalFlat('INFORMATION', $.lang[LANG]['manager.check.no-support.render-mode'], true, false, '', 'ok');
							return false;
						}
						if(location.pathname == '/_admin') $('.flat-modal[class*="mng-"] .modal').modal('hide');
						else location.replace('/_admin');
						return false;
					}

					if(PAGE_MODE == 'um') {
			            $(this).showModalFlat('INFORMATION', $.lang[LANG]['manager.check.no-support.render-mode'], true, false, '', 'ok');
						return false;
					}
					var s_um = (PAGE_MODE == 'c') ? SITEUM : property.SITEUM;
					if(typeof s_um != 'undefined' && s_um > 0)  var loginModal = $.umember.showLoginModal(sid);
					else return false;
				} else if($(this).hasClass('forgot-id')) {
					var forgotIDModal = $.umember.showForgotIDModal(sid);
				} else if($(this).hasClass('forgot-pw')) {
					var forgotPWModal = $.umember.showForgotPWModal(sid);
				} else if($(this).hasClass('logout')) {
					$.getJSON('/umember/login/out', function(r) {
						if($('header').hasClass('_admin')) location.replace('/');
						else location.reload();
					});
				} else if($(this).hasClass('mypage')) {
					var mypageModal = $.umember.showMypageModal(sid);
				}
			}

		}
	});


	/*************************************************************************************************************************************member-config page END*/



	/*************************************************************************************************************************************member-list page START*/
	$('.mng-settings[data-type="member-list"] .mng-search-box select.form-control').live('change',function() {
		// var sfl_type = $(this).attr('id').replace('sfl_',''),
		// 	val = $(this).val();

		var url_str = ($('header').hasClass('_admin')) ?  '/_admin/member/list' : '/manager/member/list',
			sfl_sort = $(this).closest('.mng-search-box').find('#sfl_sort').val(),
			sfl_view = $(this).closest('.mng-search-box').find('#sfl_view').val(),
			stx =  $(this).closest('.mng-search-box').find('#stx').val();

		// location.replace('/manager/member/list/page/1/'+sfl_type+'/'+val);
		location.replace(url_str+'/page/1/sort/'+sfl_sort+'/view/'+sfl_view+'/stx/'+stx);
	});

	$('.mng-settings[data-type="member-list"] .mng-search-box .search-btn').live('click',function() {
		var url_str = ($('header').hasClass('_admin')) ?  '/_admin/member/list' : '/manager/member/list',
			sfl_sort = $(this).closest('.mng-search-box').find('#sfl_sort').val(),
			sfl_view = $(this).closest('.mng-search-box').find('#sfl_view').val(),
			stx =  $(this).closest('.mng-search-box').find('#stx').val();

		location.replace(url_str+'/page/1/sort/'+sfl_sort+'/view/'+sfl_view+'/stx/'+stx);
	});

	$('.member-message-btn').live('click', function() {
		var check_data = getMemberListCheckData($(this)),
			mng_settings_el = $(this).closest('.mng-settings');

		if( typeof check_data.error != "undefined" && check_data.error) {
			$(this).showModalFlat('INFORMATION', check_data.error, true, false, '', 'ok');
			return false;
		}

		var first_name = (LANG == 'en' && check_data.count > 0) ? '' : '<span class="addressee-name">' + check_data.name + '</span> ' + ((check_data.count == 0) ? $.lang[LANG]['manager.list.member.str'] : ''),
			others_name = (LANG == 'en' || check_data.count < 1) ? '' :  $.lang[LANG]['manager.list.member.selected.multi.1'] + '\
						<span class="addressee-count point" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="' + check_data.names + '">\
						' + check_data.count + '</span>' + $.lang[LANG]['manager.list.member.selected.multi.2'],
			last_name = (LANG == 'en' && check_data.count > 0) ? $.lang[LANG]['manager.list.member.selected.multi.3'] : '',
			selected_str = $.lang[LANG]['manager.list.member.message.txt.1'] + first_name + others_name + last_name + $.lang[LANG]['manager.list.member.message.txt.2'];

		var modal_content = '\
			<div class="mng-modal-body message-modal">\
				<p class="desc">\
					' + selected_str + '\
				</p>\
				<div class="form-group">\
					<input type="text" class="form-control" id="message-title" placeholder="제목" />\
				</div>\
				<div class="form-group clearfix">\
					<textarea class="form-control" name="" id="message-content" cols="30" rows="2" placeholder="내용"></textarea>\
					<label for="message-content"><span class="write-count">0</span>/1000</label>\
				</div>\
				<div class="form-group">\
					<div class="btn-wrap">\
						<span class="btn btn-xs btn-white"><i class="fa fa-sticky-note-o" aria-hidden="true"></i>파일첨부</span>\
					</div>\
				</div>\
			</div>\
		';

		$('#message-title, #message-content').live('keyup', function() {
			var type = ($(this).attr('id').match(/title/) !== null) ? 'title' : 'content',
				str = $(this).val();

			if(str.length > 0) $(this).closest('.form-group').find('.mng-error').remove();
			$(this).next('label').find('.write-count').text(str.length);
			if(str.length > 1000 && type == 'content') {
				$(this).val($(this).val().substring(0, 1000));
			}
		});

		var message_modal = $(this).showModalFlat('SEND MESSAGE', modal_content, true, true, function() {
			var message_title = $('#message-title').val(),
				message_content = $('#message-content').val();

			if(message_title.length == 0) {
				$('#message-title').focus();
				$('#message-title').closest('.form-group').append('<div class="mng-error">제목을 입력하세요</div>');
				return false;
			}
			if(message_content.length == 0) {
				$('#message-content').focus();
				$('#message-content').closest('.form-group').append('<div class="mng-error">내용을 입력하세요</div>');
				return false;
			}
			//메시지 전송 기능 작업.

			message_modal.modal('hide');
			mngShowToast('check', '전송 완료', mng_settings_el);

		}, 'cancel', 'send', 'w480');
	});




	/*$('.member-sms-btn').live('click', function() {
		var check_data = getMemberListCheckData($(this)),
			mng_settings_el = $(this).closest('.mng-settings');

		if( typeof check_data.error != "undefined" && check_data.error) {
			$(this).showModalFlat('INFORMATION', check_data.error, true, false, '', 'ok');
			return false;
		}

		var others_str = (check_data.count<1) ? '' : ' 외 <span class="addressee-count point" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="' + check_data.names + '">' + check_data.count + '</span> 명';
		var modal_content = '\
			<div class="mng-modal-body sms-modal">\
				<p class="desc">\
					<span class="addressee-name">' + check_data.name + '</span> \
					' + others_str + ' 에게 SMS를 보냅니다.\
				</p>\
				<div class="sms-recharge-btn-wrap">\
					<div>잔여 SMS <span class="sms-count point">8</span>건 </div>\
					<span class="sms-recharge-btn btn btn-xs btn-white">충전하기</span>\
				</div>\
				<div class="form-group">\
					<input type="text" class="form-control" id="sms-title" placeholder="보내는 번호" />\
				</div>\
				<div class="form-group clearfix">\
					<textarea class="form-control" name="" id="sms-content" cols="30" rows="2" placeholder="내용"></textarea>\
					<label for="sms-content"><span class="write-count">0</span>/90 Byte</label>\
					<span class="info">90바이트가 초과될 경우 MS로 전환되어 3건의 SMS가 차감됩니다.</span>\
				</div>\
				<div class="form-group clearfix">\
					<div class="btn-wrap pull-left">\
						<span class="btn btn-xs btn-white"><i class="fa fa-sticky-note-o" aria-hidden="true"></i>파일첨부</span>\
					</div>\
					<div class="precautions pull-right">\
						<span data-toggle="tooltip" data-placement="right" data-html="true" data-original-title="' + $.lang[LANG]['manager.list.sms.precautions'] + '"><i class="fa fa-info-circle"></i> 광고성 SMS 전송 시 주의사항</span>\
					</div>\
				</div>\
			</div>\
		';

		$('#sms-title, #sms-content').live('keyup', function() {
			var type = ($(this).attr('id').match(/title/) !== null) ? 'title' : 'content',
				str = $(this).val(),
				str_len = $(this).val().length,
				cbyte = 0,
				clen = 0,
				maxInputByte = 90;

			if(str.length > 0) $(this).closest('.form-group').find('.mng-error').remove();

			if(type == 'content') {
				for(var i=0; i<str_len; i++) {
					var is_one_char = $(this).val().charAt(i);
					if(escape(is_one_char).length > 4) {
						cbyte += 2; //korean 1 char == 2byte
					} else {
						cbyte++;
					}

					if(cbyte <= maxInputByte) {
						clen = i + 1;
					}
				}
				$(this).next('label').find('.write-count').text(parseInt(cbyte));
				if(parseInt(cbyte) > parseInt(maxInputByte)) {
					$(this).val($(this).val().substring(0, clen));
					$(this).next('label').find('.write-count').text(parseInt(maxInputByte));
				}
			}
		});

		var sms_modal = $(this).showModalFlat('SEND SMS', modal_content, true, true, function() {
			var sms_title = $('#sms-title').val(),
				sms_content = $('#sms-content').val();

			if(sms_title.length == 0) {
				$('#sms-title').focus();
				$('#sms-title').closest('.form-group').append('<div class="mng-error">보내실 번호를 입력하세요</div>');
				return false;
			}
			if(sms_content.length == 0) {
				$('#sms-content').focus();
				$('#sms-content').closest('.form-group').append('<div class="mng-error">내용을 입력하세요</div>');
				return false;
			}
			//SMS 전송 기능 작업.


			sms_modal.modal('hide');
			mngShowToast('check', '전송 완료', mng_settings_el);

		}, 'cancel', 'send', 'w480');

		$('.sms-recharge-btn').click(function() {
			smsRechargeModal(SID);
		});

	});/*sms*/


	/*$('.member-level-btn .dropdown-item').live('click', function() {
		var level = parseInt($(this).text().trim()),
			check_data = getMemberListCheckData($(this)),
			mng_settings_el = $(this).closest('.mng-settings');

		if( typeof check_data.error != "undefined" && check_data.error) {
			$(this).showModalFlat('INFORMATION', check_data.error, true, false, '', 'ok');
			return false;
		}

		var others_str = (check_data.count<1) ? '' : ' 외 <span class="addressee-count point" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="' + check_data.names + '">' + check_data.count + '</span> 명';
		var modal_content = '\
			<div class="mng-modal-body level-modal">\
				<p class="addressee-wrap">\
					<span class="addressee-name">' + check_data.name + '</span> \
					' + others_str + ' 의 회원 레벨을 <br><span class="point">' + level + '</span> (으)로 적용하시겠습니까?\
				</p>\
			</div>\
		';

		var level_modal = $(this).showModalFlat('회원 등급 변경', modal_content, true, true, function() {
			var uids = check_data.ids;ㅈ

			$.ajax({
				type: 'POST',
				url: '/umember/update/type/level',
				data: { sid : SID, uids : uids, val : level },
				dataType: 'json',
				async: true,
				success: function(data) {
					if(typeof data.error != "undefined" && data.error) {
						// alert(data.error);
						if(level_modal.find('.error').length == 0) level_modal.find('.level-modal').append('<span class="error">' + data.error + '</span>');
						else level_modal.find('.level-modal').find('.error').text(data.error);
						return false;
					}

					$.each(uids, function(i,v) {
						$(mng_settings_el).find('.mng-list table tbody tr[data-uid="'+v+'"]').find('.level').text(level);
					});

					level_modal.modal('hide');
					mngShowToast('check', '저장완료', mng_settings_el);
				}
			});


		});

	});/*level-all*/


	$('#member-level-select').live('change', function() {
		var uid = $(this).closest('tr').attr('data-uid'),
			level = $(this).val();

		if(typeof uid == 'undefined' || !uid) {
			window.location.reload();
			return false;
		}

		$.ajax({
			type: 'POST',
			url: '/umember/update/type/level',
			data: { sid : SID, uids : uid, val : level },
			dataType: 'json',
			async: true,
			success: function(data) {
				if(typeof data.error != "undefined" && data.error) {
					alert(data.error);
					return false;
				}
			}
		});
		
	});


	$('.member-leave-btn').live('click', function() {
		var check_data = getMemberListCheckData($(this)),
			mng_settings_el = $(this).closest('.mng-settings');

		if( typeof check_data.error != "undefined" && check_data.error) {
			$(this).showModalFlat('INFORMATION', check_data.error, true, false, '', 'ok');
			return false;
		}

		var first_name = (LANG == 'en' && check_data.count > 0) ? '' : '<span class="addressee-name">' + check_data.name + '</span> ' + ((check_data.count == 0) ? $.lang[LANG]['manager.list.member.str'] : ''),
			others_name = (LANG == 'en' || check_data.count < 1) ? '' :  $.lang[LANG]['manager.list.member.selected.multi.1'] + '\
						<span class="addressee-count point" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="' + check_data.names + '">\
						' + check_data.count + '</span>' + $.lang[LANG]['manager.list.member.selected.multi.2'],
			last_name = (LANG == 'en' && check_data.count > 0) ? $.lang[LANG]['manager.list.member.selected.multi.3'] : '',
			selected_str = $.lang[LANG]['manager.list.member.leave.txt.1'] + first_name + others_name + last_name + $.lang[LANG]['manager.list.member.leave.txt.2'];

		var modal_content = '\
			<div class="mng-modal-body leave-modal">\
				<p class="addressee-wrap">\
					' + selected_str + '\
				</p>\
			</div>\
		';

		var level_modal = $(this).showModalFlat('MEMBER DELETE', modal_content, true, true, function() {
			var uids = check_data.ids;

			$.ajax({
				type: 'POST',
				url: '/umember/update/type/leave',
				data: { sid : SID, uids : uids, val : 'deny' },
				dataType: 'json',
				async: true,
				success: function(data) {
					if(typeof data.error != "undefined" && data.error) {
						// alert(data.error);
						if(level_modal.find('.error').length == 0) level_modal.find('.leave-modal').append('<span class="error">' + data.error + '</span>');
						else level_modal.find('.leave-modal').find('.error').text(data.error);
						return false;
					} else {
						level_modal.modal('hide');
						window.location.reload();
					}

				}
			});


		}, 'cancel');

	});


	$('.member-block-btn').live('click', function() {
		var check_data = getMemberListCheckData($(this)),
			mng_settings_el = $(this).closest('.mng-settings');

		if( typeof check_data.error != "undefined" && check_data.error) {
			$(this).showModalFlat('INFORMATION', check_data.error, true, false, '', 'ok');
			return false;
		}

		var first_name = (LANG == 'en' && check_data.count > 0) ? '' : '<span class="addressee-name">' + check_data.name + '</span> ' + ((check_data.count == 0) ? $.lang[LANG]['manager.list.member.str'] : ''),
			others_name = (LANG == 'en' || check_data.count < 1) ? '' :  $.lang[LANG]['manager.list.member.selected.multi.1'] + '\
						<span class="addressee-count point" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="' + check_data.names + '">\
						' + check_data.count + '</span>' + $.lang[LANG]['manager.list.member.selected.multi.2'],
			last_name = (LANG == 'en' && check_data.count > 0) ? $.lang[LANG]['manager.list.member.selected.multi.3'] : '',
			selected_str = $.lang[LANG]['manager.list.member.block.txt.1'] + first_name + others_name + last_name + $.lang[LANG]['manager.list.member.block.txt.2'];

		var modal_content = '\
			<div class="mng-modal-body block-modal">\
				<p class="addressee-wrap">\
					' + selected_str + '\
				</p>\
			</div>\
		';

		var block_modal = $(this).showModalFlat('BLOCK', modal_content, true, true, function() {
			var val = check_data.ids;

			$.ajax({
				type: 'POST',
				url: '/umember/set/type/block',
				data: { sid : SID, key : 'id', val : val },
				dataType: 'json',
				async: true,
				success: function(data) {
					if(typeof data.error != "undefined" && data.error) {
						// alert(data.error);
						if(block_modal.find('.error').length == 0) block_modal.find('.block-modal').append('<span class="error">' + data.error + '</span>');
						else block_modal.find('.block-modal').find('.error').text(data.error);
						return false;
					} else {
						block_modal.modal('hide');
						window.location.reload();
					}
				}
			});

		}, 'cancel');
	});

	$('.member-info').live('click', function() {
		var uid = $(this).closest('tr').attr('data-uid'),
			list_str = '',
			mng_settings_el = $(this).closest('.mng-settings'),
			list_type = mng_settings_el.attr('data-type');

		$.post('/umember/lists/type/memberinfo', { sid : SID, val : uid }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				alert(data.error);
				return false;
			}

			$.each(data, function(k,o) {
				var cl_name = (o['name']) ? o['name'] : $.lang[LANG]['manager.list.info.'+k],
					cl_type = (o['type']) ? o['type'] : 'text',
					cl_val = o['value'],
					pass_field = ['no','addr2'],
					disabled_field = ['id','approvaldate'];
					
				list_str += ($.inArray(k,pass_field) > -1) ? '' : '\
					<div class="form-group">\
						<label class="col-xs-2 col-sm-2 col-md-2 control-label">'+ cl_name + '</label>\
						<div class="col-xs-10 col-sm-10 col-md-10">\
				';

				switch(k) {
					case 'no':
						break;
					case 'addr2': 
						break;
					case 'memo':
						var m_count = cl_val.length;
						list_str += '\
							<textarea class="form-control" name="member-'+ k + '" id="member-'+ k+ '" rows="3">' + cl_val + '</textarea>\
							<label for="member-'+ k + '"><span class="write-count">' + m_count + '</span>/1000</label>\
						';
						break;
					default:
						var disabled = ($.inArray(k,disabled_field) > -1) ? 'disabled' : '';

						list_str += '\
							<input class="form-control" id="member-'+ k + '" type="text" value="' + cl_val + '" ' + disabled + '>\
							' + ((k == 'addr1') ? '<input class="form-control" id="member-addr2" type="text" value="' + data['addr2']['value'] + '">' : '') + '\
						';
						break;
				}

				list_str += ($.inArray(k,pass_field) > -1) ? '' : '\
						</div>\
					</div>\
				';
			});

			var modal_content = '\
			<div class="mng-modal-body info-modal" data-uid="' + uid + '" data-list-type="' + list_type + '">\
				<div class="form-horizontal">\
					' + list_str + '\
				</div>\
			</div>\
			';

			if(list_type == 'member-list') {
				var info_modal = $(this).showModalFlat('MEMBER DETAILS', modal_content, true, true, function() {
					
					var info_data = {},
						regExp_arr = ['name','nick','email','tel'],
						regexp = {
							name: /^[ㄱ-ㅎ가-힣ㅏ-ㅣa-zA-Z0-9\# ]+$/i,
							nick: /^[ㄱ-ㅎ가-힣ㅏ-ㅣa-zA-Z0-9\# ]+$/i,
							email: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
							tel: /^[0-9-+]*$/,
						},
						check_error = false;

					var recheck_regexp = function(input) {
						var type = $(input).attr('id').replace(/member-/i,''),
							val = $(input).val();

						if(regexp[type].test(val)) {
							$(input).closest('.form-group').removeClass('has-error').find('.mng-error').remove();
						}
					}

					$('.info-modal .form-control').live({
						keyup : function(e) { recheck_regexp($(this));	},
						blur  : function(e) { recheck_regexp($(this));	}
					});

					$('.info-modal').find('.form-control:not([disabled])').each(function(i) {
						var type = $(this).attr('id').replace(/member-/i,''),
							val = $(this).val();

						if((val.length == 0 && type != 'email') || regExp_arr.indexOf(type) == -1) {
							info_data[type] = val;
							return true;
						}

						if(!regexp[type].test(val)) {
							var this_group = $(this).closest('.form-group'),
								error_str = $.lang[LANG]['siteum.regexp.check.'+type];

							if(val.length == 0 && type == 'email') error_str = $.lang[LANG]['manager.check.required.message'];

							this_group.addClass('has-error');
							if(this_group.find('.mng-error').length > 0 ) this_group.find('.mng-error').text(error_str);
							else this_group.append('<span class="mng-error">' + error_str + '</span>');

							if($(this).closest('.form-horizontal').find('.has-error').length == 0) $(this).focus();
						} else {
							$(this).closest('.form-group').removeClass('has-error');
							$(this).parent().find('.mng-error').remove();

							info_data[type] = val;
						}
					}).promise().done(function() {
						check_error = ($('.info-modal').find('.has-error').length == 0) ? true : false;

						if(!check_error) {
							$('.info-modal').find('.has-error').first().find('input').focus();
							return false;
						} else {
							$.ajax({
								type: 'POST',
								url: '/umember/update/type/member',
								data: { sid : SID, val: JSON.stringify(info_data), uid : uid },
								dataType: 'json',
								async: true,
								success: function(data) {

									if(typeof data.error != 'undefined' && data.error) {
										$.each(data.error, function(key,str) {
											if(info_modal.find('#member-'+key).length > 0 ) {
												info_modal.find('#member-'+key).focus();
												info_modal.find('#member-'+key).closest('.form-group').append('<span class="mng-error">' + str + '</span>');
											} else { alert(str); return false; }
										});
										if(info_modal.find('.mng-error').length > 0) return false;
									}

									info_modal.find('.mng-error').remove();
									$.each(info_data, function(k, v) {
										$('.mng-list table tr[data-uid="' + uid + '"]').find('.'+k).text(v);
									});

									info_modal.modal('hide');
								}
							});
						}

					});

				}, 'cancel', 'save', 'w480');

				$('#member-memo').live('keyup', function() {
					var str = $(this).val();
					if(str.length > 0) $(this).closest('.form-group').find('.mng-error').remove();
					$(this).next('label').find('.write-count').text(str.length);
					if(str.length > 1000) {
						$(this).val($(this).val().substring(0, 1000));
					}
				});

			} else { // only show__
				var info_modal = $(this).showModalFlat('MEMBER DETAILS', modal_content, true, false, '', '', '', 'w480');
			}


		}, 'json');

	});

	/***************************************************************************************************************************************member-list page END*/





	/*********************************************************************************************************************************member-waitlist page START*/
	$('.approval-btn, .deny-btn').live('click', function() {
		var position = $(this).closest('td'),
			uno = $(this).closest('tr').attr('data-uno'),
			uid = $(this).closest('tr').attr('data-uid'),
			result = ($(this).hasClass('approval-btn')) ? 'hand' : 'deny',
			wait_cnt = parseInt($('.mng-settings[data-type="member-waitlist"]').find('.wait-count').text());

		$.post('/umember/update/type/approval', { sid : SID, val : result, uid : uid, uno : uno }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				alert(data.error);
				return false;
			}

			$('.mng-settings[data-type="member-waitlist"]').find('.wait-count').text(wait_cnt-1);
			position.html($.lang[LANG]['manager.wait-list.approval.'+result]);
		}, 'json');

	});
	/***********************************************************************************************************************************member-waitlist page END*/

	/********************************************************************************************************************************member-blocklist page START*/
	
	$('.block-add-btn').live('click', function() {
		var mng_settings_el = $(this).closest('.mng-settings'),
			add_content = '\
			<div class="form-row">\
				<div class="form-inline clearfix">\
					<div class="form-group col-sm-5">\
						<select id="block-type" class="form-control" name="block-type" placeholder="Search">\
							<option value="id">회원 아이디</option>\
							<option value="ip">IP</option>\
						</select>\
					</div>\
					<div class="form-group col-sm-7"><input class="form-control" type="text" id="block-data"/></div>\
				</div>\
			</div>\
		';

		var modal = $(this).showModalFlat('Block data add', add_content, true, true, function() {
			var key = modal.find('#block-type').val(),
				val = modal.find('#block-data').val().trim(),
				regExp_ip = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/gi;

			if(key === null) {
				modal.find('#block-type').click();
				return false;
			} else if(modal.find('.error').length > 0) {
				modal.find('#block-data').focus();
				return false;
			} else if (modal.find('#block-data').val().trim().length == 0) {
				modal.find('#block-data').focus();
				modal.find('#block-data').parent().append('<span class="error">내용을 입력하세요</span>');
				return false;
			} else if (key == 'ip' && !regExp_ip.test(val)) {
				modal.find('#block-data').focus();
				modal.find('#block-data').parent().append('<span class="error">ip 형식이 올바르지 않습니다.</span>');
				return false;
			}

				$.ajax({
					type: 'POST',
					url: '/umember/set/type/block',
					data: { sid : SID, key : key, val : val },
					dataType: 'json',
					async: true,
					success: function(data) {

						if(typeof data.error != "undefined" && data.error) {
							if(modal.find('.error').length == 0) modal.find('#block-data').focus().parent().append('<span class="error">' + data.error + '</span>');
							else modal.find('#block-data').focus().next('.error').text(data.error);
							return false;
						} else {
							modal.modal('hide');
							window.location.reload();
						}

					}
				});


		}, 'cancel','save', 'block-add-modal');

		$('#block-data').live({
			keyup: function() {
				$(this).parent().find('.error').remove();
			}
		});


	});

	$('.block-clear-btn').live('click', function() {
		var block_type = $(this).closest('tr').find('.type').attr('data-type'),
			block_val = $(this).closest('tr').find('.val').text().trim(),
			block_data = $(this).closest('tr').attr('data-id');

		if(block_data == 0) return false;
		else {
			var modal_content = '\
				<div class="mng-modal-body clear-modal">\
					<p class="addressee-wrap">\
						'  + $.lang[LANG]['manager.block-list.block.clear.txt.1'] + '\
						<span class="addressee-name">' + block_val + '</span> \
						' + $.lang[LANG]['manager.block-list.block.clear.txt.2'] + '\
					</p>\
				</div>\
				';	

			var modal = $(this).showModalFlat('BLOCK', modal_content, true, true, function() {

				$.ajax({
					type: 'POST',
					url: '/umember/delete/type/block',
					data: { sid : SID, val : block_data, block_type : block_type, block_val : block_val },
					async: true,
					success: function(data) {
						if(typeof data.error != 'undefined' && data.error) {
							alert(data.error);
							return false;
						} else {
							window.location.reload();
						}
					}
				});

			}, 'cancel');

		}

	});
	/*
	$('.blacklist-delete-btn').live('click', function() {
		var delete_data_key = $('.mng-settings[data-type="member-blocklist"]').find('table tbody tr.active').map(function() { return $(this).find('.type').attr('data-type'); }).get(),
			delete_data_val = $('.mng-settings[data-type="member-blocklist"]').find('table tbody tr.active').map(function() { return $(this).find('.val').text().trim(); }).get(),
			delete_data = $('.mng-settings[data-type="member-blocklist"]').find('table tbody tr.active').map(function() { return $(this).attr('data-id'); }).get();

		if(delete_data.length == 0) {
			return false;
		} else {

			$.ajax({
				type: 'POST',
				url: '/umember/delete/type/block',
				data: { sid : SID, val : delete_data, block_type : delete_data_key, block_val : delete_data_val},
				async: true,
				success: function(data) {
					if(typeof data.error != 'undefined' && data.error) {
						alert(data.error);
						return false;
					} else {
						window.location.reload();
					}
				}
			});

		}

	});
	/*block-delete-all-btn*/

	/**********************************************************************************************************************************member-blocklist page END*/




	/****************************************************************************************************************************************Mypage Modal START*/
	$('.my-cl-edit').live({
		click: function() {
			var cl = $('.mng-settings[data-type="profile"]').find('.cl-wrap'),
				sid = $('#mypage-modal').attr('data-sid'),
				uid = $('#mypage-modal').attr('data-uid');

			var clInput = function(type, value) {
				if(type == 'id') return;
				var str = '\
						<div class="input-group my-cl-update-wrap">\
				';
				$.each(value, function(i,v) {
					var field_name = (type == 'addr') ? type + i : type;
					str += '\
							<input type="text" id="my-input-'+field_name+'" class="my-cl-update form-control" placeholder="' + $.lang[LANG]['manager.join.cl.item.name.enter'] + '" value="' + v + '" data-type="' + type + '"/>\
					';
				});
				str += '\
						</div>\
				';
				return str;
			}
			$(this).hide();
			cl.find('.my-cl-cancel,.my-cl-save').show();
			cl.addClass('update-mode');
			cl.children().each(function() {
				var type = $(this).attr('data-type'),
					value = $(this).find('.my-data').map(function() { return $(this).text().trim(); }).get(),
					input_text = clInput(type,value);

				if(type != 'id') $(input_text).prependTo($(this).find('.mng-panel-body'));
				if(cl.children('.focus').length == 0) $(this).addClass('focus').find('input').focus();
			});



		}
	});

	$('.my-cl-cancel').live({
		click: function() {
			var cl = $('.mng-settings[data-type="profile"]').find('.cl-wrap');

			cl.find('.mng-error').remove();
			cl.find('.my-cl-cancel,.my-cl-save').hide();
			cl.find('.my-cl-edit').show();
			cl.removeClass('update-mode');
			cl.children().each(function() {
				$(this).find('.my-cl-update-wrap').remove();
			});
		}
	});

	$('.my-cl-save').live({
		click: function() {
			var cl = $('.mng-settings[data-type="profile"]').find('.cl-wrap'),
				sid = $('#mypage-modal').attr('data-sid'),
				uid = $('#mypage-modal').attr('data-uid'),
				cl_data = {},
				check_error = false;

			if(cl.find('.has-error').length > 0) cl.find('.has-error').addClass('foucs').find('.my-cl-update').first().focus();

			var recheck_regexp = function(input) {
				var field = input.attr('data-type'),
					val = input.val(),
					reg_has = (typeof COLLECTION_REGEX[field] != 'undefined' && COLLECTION_REGEX[field]) ? true : false,
					reg_pattern = (reg_has) ? COLLECTION_REGEX[field]['pattern_j'] : '',
					reg = new RegExp(reg_pattern),
					reg_ex = (reg_has) ? COLLECTION_REGEX[field]['ex'] : '';

				if(reg_has && !reg.test(val)) {
					input.closest('.mng-panel-body').find('.mng-error').text(reg_ex);
				} else {
					input.closest('.mng-panel').removeClass('has-error').find('.mng-error').remove();
				}
			}

			$('#mypage-modal .mng-settings[data-type="profile"] .my-cl-update').live({
				focus: function(e) { $(this).closest('.mng-panel').addClass('focus').siblings().removeClass('foucs'); },
				keyup : function(e) { recheck_regexp($(this)); },
				blur  : function(e) { $(this).closest('.mng-panel').removeClass('focus'); }
			});

			cl.children('.mng-panel:not([data-type="id"])').each(function() {
				var field = $(this).attr('data-type'),
					optional = $(this).hasClass('optional') ? true : false,
					value = $(this).find('.my-cl-update').map(function() { return $(this).val().trim(); }).get(),
					this_cl = $(this),
					// prev_value = $(this).find('.my-data').map(function() { return $(this).text().trim(); }).get(),
					error_str = '',
					reg_has = (typeof COLLECTION_REGEX[field] != 'undefined' && COLLECTION_REGEX[field]) ? true : false,
					reg_pattern = (reg_has) ? COLLECTION_REGEX[field]['pattern_j'] : '',
					reg = new RegExp(reg_pattern),
					reg_ex = (reg_has) ? COLLECTION_REGEX[field]['ex'] : '';

				$.each(value, function(i,v) {
					var field_name = (field == 'addr') ? field + (i+1) : field,
						this_wrap = this_cl.find('.mng-panel-body'); 

					if(optional && v.length==0 && i==0) error_str = $.lang[LANG]['manager.check.required.message'];
					else if(reg_has && !reg.test(v)) error_str = COLLECTION_REGEX[field]['error'];

					if(error_str.length > 0)  {
						this_cl.addClass('has-error');
						if(this_wrap.find('.mng-error').length > 0) this_wrap.find('.mng-error').text(error_str);
						else this_wrap.append('<span class="mng-error">' + error_str + '</span>');

						if(cl.find('.mng-panel.focus').length == 0) this_cl.find('.my-input-'+field_name).focus();
					} else {
						this_cl.removeClass('has-error');
						this_wrap.find('.mng-error').remove();

						cl_data[field_name] = v;
					}
				});
			}).promise().done(function() {
				var check_error = (cl.find('.has-error').length == 0) ? true : false;

				if(!check_error) {
					cl.find('.has-error').first().first('input').focus();
				} else {
					$.ajax({
						type: 'POST',
						url: '/umember/update/type/member',
						data: { sid : sid, val: JSON.stringify(cl_data), uid : uid },
						dataType: 'json',
						async: true,
						success: function(data) {
							// if(typeof data.error != "undefined" && data.error) {
							// 	alert(data.error);
							// 	return false;
							// }
							if(typeof data.error != 'undefined' && data.error) {
								$.each(data.error, function(key,str) {
									if(cl.find('#my-input-'+key).length > 0 ) {
										cl.find('#my-input-'+key).focus();
										cl.find('#my-input-'+key).closest('.mng-panel-body').append('<span class="mng-error">' + str + '</span>');
									} else { alert(str); return false; }
								});
								if(cl.find('.mng-error').length > 0) return false;
							}
							cl.find('.mng-error').remove();

							cl.find('.my-cl-cancel,.my-cl-save').hide();
							cl.find('.my-cl-edit').show();
							cl.removeClass('update-mode');
							$.each(cl_data,function(k,v) { cl.find('.my-'+k).text(v); });
							cl.find('.my-cl-update-wrap').remove();
						}
					});
				}

			});


		}
	});










	$('.my-image-edit').live({
		click: function() {
			var sid = $('#mypage-modal').attr('data-sid'),
				uid = $('#mypage-modal').attr('data-uid'),
				src = $('.mng-settings[data-type="profile"]').find('.my-image').attr('src');

			$.umember.showMyImageUploadModal(sid, uid, src);
		}
	});


	$('.my-password-save').live({
		click: function() {
			var mypageModal = $('#mypage-modal'),
				myPasswordWrap = mypageModal.find('.mng-settings[data-type="password-change"]'),
				mng_settings_el = $(this).closest('.mng-settings');

			myPasswordWrap.find('input.form-control').each(function() {
				var field = $(this).attr('id').trim().replace(/input-/,''),
					val = $(this).val(),
					errorEL = $(this).next('.mng-error'),
					error_str = '',
					reg_has = (field != 'new-password-checked') ? true : false,
					reg_pattern = (reg_has) ? COLLECTION_REGEX['password']['pattern_j'] : '',
					reg = new RegExp(reg_pattern),
					reg_error = (reg_has) ? COLLECTION_REGEX['password']['error'] : '';

				if(val.length == 0) error_str = $.lang[LANG]['siteum.regexp.password.input'];
				else {
					if(reg_has && !reg.test($(this).val()) ) error_str = reg_error;
					else if( field == 'new-password-checked' && ($(this).val() != myPasswordWrap.find('#input-new-password').val())) error_str = $.lang[LANG]['siteum.regexp.pw.invalid'];
				}

				if(error_str.length > 0) {
					if(errorEL.length > 0 ) errorEL.addClass('empty').text(error_str);
					else $(this).after('<span class="mng-error empty">'+ $.lang[LANG]['siteum.regexp.password.input'] + '</span>');

					if(myPasswordWrap.find('.mng-panel-body.focus').length == 0) $(this).focus();
					else { myPasswordWrap.find('.mng-panel-body.focus input').focus(); }
				} else {
					errorEL.remove();
					$(this).closest('.mng-panel-body').removeClass('focus');
				} 
			});


			if(myPasswordWrap.find('.mng-error').length == 0) {
				var uid = mypageModal.find('.my-id').text(),
					pw = hex_md5(myPasswordWrap.find('#input-password').val()),
					new_pw = hex_md5(myPasswordWrap.find('#input-new-password').val());

				$.post('/umember/password/change', { uid : uid, pw : pw, new_pw : new_pw }, function(data) {
					if(typeof data.error != "undefined" && data.error) {
						$.each(data.error, function(key,str) {
							if(mypageModal.find('#input-'+key).length > 0) {
								mypageModal.find('#input-'+key).closest('.mng-panel-body').append('<span class="mng-error">' + str + '</span>');
								mypageModal.find('#input-'+key).focus();
							} else { alert(str,'/manager/member'); return false; }
						});
						if(mypageModal.find('.mng-error').length > 0) return false;
					}
					mypageModal.find('input.form-control').val('');
					mngShowToast('check', $.lang[LANG]['siteum.forgot.pw.success'], mng_settings_el);

				}, 'json');
			}




		}
	});

	$('.mng-settings[data-type="password-change"] input.form-control').live({
		focus: function() {
			$(this).closest('.mng-panel-body').addClass('focus').siblings().removeClass('focus');
		}, 
		blur: function() {
			$(this).closest('.mng-panel-body').removeClass('focus');
		},
		keyup: function() {

			var field = $(this).attr('id').trim().replace(/input-/,''),
				groupEl = $(this).closest('.mng-panel-body'),
				errorEL = $(this).next('.mng-error'),
				reg_pw = (field == 'new-password-checked') ? field : 'password',
				reg_has = (typeof COLLECTION_REGEX[reg_pw] != 'undefined' && COLLECTION_REGEX[reg_pw]) ? true : false,
				reg_pattern = (reg_has) ? COLLECTION_REGEX[reg_pw]['pattern_j'] : '',
				reg_ex = (reg_has) ? COLLECTION_REGEX[reg_pw]['ex'] : '';

			if(field == 'new-password' || field == 'new-password-checked') {
				var pwEl = $('.mng-settings[data-type="password-change"]').find('#input-new-password'),
					pw2El = $('.mng-settings[data-type="password-change"]').find('#input-new-password-checked'),
					error_str = $.lang[LANG]['siteum.regexp.pw.invalid'];

				if(pwEl.val() == pw2El.val()) { 
					pw2El.next('.mng-error').remove();
				} else {
					if(pw2El.val().length > 0) {
						if(pw2El.next('.mng-error').length > 0) pw2El.next('.mng-error').removeClass('empty').text(error_str);
						else pw2El.closest('.mng-panel-body').append('<span class="mng-error">'+ error_str + '</span>');
					}
				}

			}

			if(reg_has && errorEL.length > 0) { 
				var reg = new RegExp(reg_pattern);
				if(reg.test($(this).val())) errorEL.remove();
				else { errorEL.removeClass('empty').text(reg_ex); }
			}

		}
	});

	$('.my-account-remove').live({
		click: function() {
			var sid = $('#mypage-modal').attr('data-sid'),
				uid = $('#mypage-modal').attr('data-uid');

			var content = '\
				<div class="mng-in-flat-modal-wrap">\
					<div class="my-account-remove-info text-left">\
						<strong>' + $.lang[LANG]['manager.mypage.my-remove.txt.1'] + '</strong>\
						<ol>\
							<li>' + $.lang[LANG]['manager.mypage.my-remove.txt.2'] + '</li>\
							<li>' + $.lang[LANG]['manager.mypage.my-remove.txt.3'] + '</li>\
							<li>' + $.lang[LANG]['manager.mypage.my-remove.txt.4'] + '</li>\
						</ol>\
					</div>\
					<div class="my-account-remove-check clearfix">\
						<div class="checkboxs hand">\
							<input type="checkbox" class="my-account-remove-agree" id="my-account-remove-agree">\
							<strong>' + $.lang[LANG]['manager.mypage.my-remove.agree.txt'] + '</strong>\
						</div>\
					</div>\
				</div>\
			';

			$('.my-account-remove-agree').live({
				click: function() {
					if($(this).prop('checked')) $(this).closest('.my-account-remove-check').find('.mng-error').remove();
				}
			});

			$('.my-account-remove-input-password').live({
				keyup: function() {
					if($(this).val().length > 0) $(this).closest('.form-group').find('.mng-error').remove();
				}
			});

			var agreeModal = $(this).showModalFlat('DELETE ACCOUNT', content, true, true, function() {
				var checked = agreeModal.find('#my-account-remove-agree').prop('checked'),
					errorEL = agreeModal.find('.my-account-remove-check').find('.mng-error'),
					error_str = (!checked) ? $.lang[LANG]['manager.mypage.my-remove.agree.check'] : '';

				if(!checked) {
					if(errorEL.length > 0) errorEL.text(error_str);
					else $('.my-account-remove-check').append('<span class="mng-error">' + error_str + '</span>');
					return false;
				}

				var udata_content = '\
					<div class="mng-in-flat-modal-wrap padding-top-0">\
						<p style="margin-bottom: 15px;">' + $.lang[LANG]['manager.mypage.my-remove.description'] + '</p>\
						<span class="form-group">\
							<input class="form-control" type="password" id="input-password" placeholder="' + $.lang[LANG]['siteum.regexp.password.input'] + '">\
						</span>\
					</div>\
				';

				var removeModal = $(this).showModalFlat('DELETE ACCOUNT', udata_content, true, true, function() {
					var pw = removeModal.find('#input-password').val();

					if(pw.length == 0) {
						if(removeModal.find('.mng-error').length > 0) removeModal.find('.mng-error').text($.lang[LANG]["siteum.regexp.password.input"]);
						else removeModal.find('.form-group').append('<span class="mng-error">' + $.lang[LANG]["siteum.regexp.password.input"] + '</span>');

						removeModal.find('#input-password').focus();
						return false;
					} else {
						$.processON('Deleting....');
						var remove_data = {
							'id' : uid,
							'password' : hex_md5(pw),
						};

						removeModal.find('.mng-error').remove();
						$.post('/umember/login/remove', { data : JSON.stringify(remove_data) }, function(data) {
							if(typeof data.error != 'undefined' && data.error) {
								$.processOFF();
								$.each(data.error, function(key,str) {
									if(removeModal.find('#input-'+key).length > 0 ) {
										removeModal.find('#input-'+key).closest('.form-group').append('<span class="mng-error">' + str + '</span>');
										removeModal.find('#input-'+key).focus();
									} else { alert(str); return false; }
								});
								if(removeModal.find('.mng-error').length > 0) return false;
							}

							removeModal.modal('hide');
							agreeModal.modal('hide');
							$('#mypage-modal').modal('hide');
							$.umember.init();
							setTimeout(function() {
								$.processOFF();
								var successModal = $(this).showModalFlat('INFORMATION', $.lang[LANG]['manager.mypage.my-remove.success'], true, false, '', 'ok');
							}, '1000');

						}, 'json');
					}

					
				}, 'cancel', 'manager.mypage.my-remove.last-btn', 'mng-mypage-modal'); /*removeModal:: END*/



			}, 'cancel', '', 'w480 mng-mypage-modal'); /*agreeModal:: END*/


		}
	});



	/******************************************************************************************************************************************Mypage Modal END*/

});





/***********************************************************************************************************************************member-config page START*/
var collectionSortable = function(cancel) {
	cancel = (cancel) ? cancel : '.collection-item-used, .collection-item-optional, button, .collection-edit, .collection-delete, label, .collection-item-type-select';

	$('#join-collections').sortable({
		items: ".collection-item",
		cancel: cancel,
		scroll: true,
		placeholder: "collection-item-placeholder",
		// start: function( event, ui ) {
		// 	console.log('#join-collections - [start] func');
		// },
		// stop: function(event, ui) {
		// 	console.log('#join-collections - [stop] func');
		// },
		// sort: function(event,ui) {
		// 	console.log('#join-collections - [sort] func');
		// },
		update: function(event,ui) {
			$.processON();
			var collections = {};
			$('#join-collections').children('.collection-item').each(function() {
				var field = $(this).attr('data-type'),
					name = $(this).find('.collection-name').text().trim(),
					type = $(this).find('.collection-item-type-select').val(),
					used = $(this).find('.collection-item-used').prop('checked'),
					optional = $(this).find('.collection-item-optional').prop('checked');

				collections[field] = {
					'used'	: used,
					'optional'	: optional,
					'name'	: name,
					'type'	: type
				};
			});

			$.ajax({
				type: 'POST',
				url: '/umember/update/type/condition',
				data: { sid: SID, key: 'collections_all', val: JSON.stringify(collections) },
				dataType: 'json',
				async: true,
				success: function(data) {
					if(typeof data.error != "undefined" && data.error) {
						alert(data.error);
						return false;
					}
					setTimeout(function() {
						$.processOFF();
					}, 200);

				}
			});


		}
	}).disableSelection();

}

var collectionItem = function(name,etc) {
	var types = '';
	$.each(COLLECTION_TYPES, function(k,v) {
		types = types + '<option value="' + k + '" '+((k == 'text') ? 'selected' : '')+'>' + v + '</option>';
	});

	var collectionAdd = (!name) ? "additem" : "",
		str = "\
		<div class='collection-item "+collectionAdd+"' data-type='etc"+ etc +"' data-etc='" + etc + "'>\
			<div class='collection-info'>\
				<span class='icons hand'><i class='fa fa-arrows'></i></span>\
				<span class='collection-name'>" + name +"</span>\
			</div>\
			<div class='collection-config'>\
				<div class='icons'>\
					<i class='fa fa-angle-down collection-toggle'></i>\
				</div>\
				<div class='icons hand'>\
					<i class='fa fa-pencil collection-edit'></i>\
				</div>\
				<div class='icons hand'>\
					<img class='fa collection-delete hand' src='https://storage.googleapis.com/i.addblock.net/icon/icon-menu-delete.png'></i>\
				</div>\
				<div class='checkboxs hand'>\
					<input type='checkbox' class='collection-item-used' id='collection-item-used-additem'/>\
					<!--<label for='collection-item-used-additem'></label>-->\
				</div>\
				<div class='checkboxs hand'>\
					<input type='checkbox' class='collection-item-optional' id='collection-item-optional-additem'/>\
					<!--<label for='collection-item-optional-additem'></label>-->\
				</div>\
			</div>\
			<div class='clear'></div>\
			<div class='collection-item-content'>\
				<div>\
					<label>유형</label>\
					<select class='form-control collection-item-type-select' data-type='etc" + etc + "'>\
					" + types + "\
					</select>\
				</div>\
			</div>\
		</div>\
	";
	return str;
}

var addCollectionInput = function(cl_name) {
	var cl_name = (typeof cl_name == "undefined" || !cl_name) ? "" : cl_name,
		str = "\
		<div class='collection-update'>\
			<div class='input-group'>\
				<input type='text' class='collection-update-name form-control' placeholder='" + $.lang[LANG]['manager.join.cl.item.name.enter'] + "' value='" + cl_name + "'/>\
				<span class='input-group-btn'>\
					<button class='collection-update-save btn btn-active'><i class='fa fa-check'></i></button>\
				</span>\
				<div class='collection-update-cancel'><i class='fa fa-times'></i></div>\
			</div>\
		</div>\
		";
	return str;
}

/*
var smsRechargeModal = function(sid) {
	var recharge_plan = {
		'plan-5000': { name : '5,000원', content: '250건', price: '20원'},
		'plan-10000': { name : '10,000원', content: '500건', price: '20원'},
		'plan-20000': { name : '20,000원', content: '1100건<span class="additional">(보너스 100건 포함)</span>', price: '18.2원'},
		'plan-30000': { name : '30,000원', content: '1800건<span class="additional">(보너스 300건 포함)</span>', price: '16.7원'},
		'plan-50000': { name : '50,000원', content: '3100건<span class="additional">(보너스 600건 포함)</span>', price: '16.1원'},
	}
	var modal_content = '\
		<div class="mng-modal-body recharge-modal">\
			<div class="row">\
				<div class="recharge-head clearfix">\
					<div class="col-xs-4 col-sm-4 col-md-4 plan">금액별(VAT별도)</div>\
					<div class="col-xs-4 col-sm-4 col-md-6 content">충전 SMS 건수</div>\
					<div class="col-xs-4 col-sm-4 col-md-2 price">단가</div>\
				</div>\
	';
	$.each(recharge_plan, function(i,v) {
		modal_content = modal_content + '\
				<div class="recharge-item clearfix">\
					<div class="col-xs-4 col-sm-4 col-md-4 plan">\
						<div class="radio-inline">\
							<input type="radio" id="recharge-'+ i + '" name="recharge-plan" value="'+ i +'">\
							<label for="recharge-' + i + '">' + v['name'] + '</label>\
						</div>\
					</div>\
					<div class="col-xs-4 col-sm-4 col-md-6 content">' + v['content'] + '</div>\
					<div class="col-xs-4 col-sm-4 col-md-2 price">' + v['price'] + '</div>\
				</div>\
		';
	});
	modal_content = modal_content + '\
				<div class="recharge-payment clearfix">\
					<div class="col-xs-4 col-sm-4 col-md-3">결제방법</div>\
					<div class="col-xs-4 col-sm-4 col-md-9">\
						<div class="radio-group">\
							<div class="radio-inline">\
								<input type="radio" class="payment-method-radio" id="payment-method-card" name="payment-method-radio" value="card">\
								<label for="payment-method-card">신용카드</label>\
							</div>\
							<div class="radio-inline">\
								<input type="radio" class="payment-method-radio" id="payment-method-vbank" name="payment-method-radio" value="vbank">\
								<label for="payment-method-vbank">가상계좌</label>\
							</div>\
						</div>\
					</div>\
				</div>\
			</div>\
		</div>\
	';

	var recharge_modal = $(this).showModalFlat('문자메시지(SMS) 충전', modal_content, true, true, function() {
		
		//문자메시지(SMS) 충전 기능 작업.


		recharge_modal.modal('hide');
	}, 'cancel', '충전하기', 'w480');

}
/*sms*/

















/*************************************************************************************************************************************member-config page END*/




/*************************************************************************************************************************************member-list page START*/
	
var getMemberListCheckData = function(el) {
	var select_count = el.closest('.mng-list').find('tr.active td.no input[type="checkbox"]:checked').length - 1,
		select_ids = el.closest('.mng-list').find('tr.active').map(function() {  return $(this).find('td.id').text().trim(); }).get(),
		select_name = '',
		select_names = '';

	if(select_count < 0) return { error: $.lang[LANG]['manager.list.member.selected.empty'] };
	el.closest('.mng-list').find('tr.active').map(function(i) { 
		if(i==0) select_name = $(this).find('td.id').text().trim();
		else select_names = select_names + ((select_names.length > 0) ? ', ' : '') + $(this).find('td.id').text().trim(); 
	});

	var result = {
		count	: select_count,
		ids 	: select_ids,
		name	: select_name,
		names	: select_names
	};

	return result;
}

/*************************************************************************************************************************************member-list page   END*/

var mngShowToast = function(icon,message,el,time) {
	if($('.mng-toast-wrap').length > 0 ) $('.mng-toast-wrap.remove').remove();
	if(typeof time == "undefined") time = 800;
	var icon = "fa fa-"+icon,
		toast = '\
		<div class="mng-toast-wrap">\
			<div class="mng-toast">\
				<span class="mng-toast-icon"><i class="' + icon + '"></i></span>\
				<span class="mng-toast-message">' + message + ' </span>\
			</div>\
		</div>\
	';

	el.find('.mng-title, .mng-wrap').addClass('mng-toast-showing').animate({
		'opacity': 0.3,
		'pointer-events': 'none'
	}, { 
		duration: '.5s', 
		easing: 'easeInOutCubic'
	},50).delay(time).fadeIn(100, function() { 
		$(this).animate({
			'opacity': 1, 
			'pointer-events': 'auto'
		}, {
			duration: '.5s', 
			easing: 'easeInOutCubic'
		}, 100).removeClass('mng-toast-showing'); 
	});

	$(toast).appendTo(el).css({
		'opacity': 0,
		'margin-top': '-10px'
	}).animate({
		'opacity': 1,
		'margin-top': '0px'
	}, {
		duration: '.7s',
		easing: 'easeInOutCubic'
	},50).delay(time).fadeOut(100, function() { $(this).addClass('remove'); });

}
