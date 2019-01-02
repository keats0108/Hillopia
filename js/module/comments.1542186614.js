(function($) {
	var user = {
		'id' : '',
		'reply' : '',
		'name' : '',
		'pass' : '',
		'parent' : '',
		'content' : '',
		'key' : '',
		'secret' : ''
	}
	var PID = 0,
		CTYPE = "P";

	var resetUser = function(o) {
		$.each(o,function(k,v) {
			o[k] = '';
		});
		return o;
	}
	var uniqID = function() {
		return Math.round(new Date().getTime() + (Math.random() * 100));
	}

	var tplWrap = function(pageID) {
		var id = uniqID(),
			$str = $('<div class="page-comments" data-id="' + pageID + '"></div>');
		$str.css({
			'text-align' : 'center',
			'font-size' : '20px',
			"background-image" : "url(https://storage.googleapis.com/i.addblock.net/preloader2.gif)",
			'background-position' : 'center center',
			'background-repeat' : 'no-repeat',
			'min-height' : '50px'
		});
		return {
			id : id,
			tpl : $str
		}
	}

	var tplForm = function(sid, my_image) {
		var $form = $('.tpl-comment-form');
		$form.fadeOut('fast',function() {
			$(this).remove();
		});

		var str = '' +
			'<div class="tpl-comment-form">' +
				'<table class="comment-textarea">' +
					'<tbody>' +
						'<tr>' + 
							'<td rowspan="2" colspab="2" class="form-profile" valign="top">' +
								'<svg viewbox="0 0 40 40">' + 
									'<pattern id="comment-write-image" patternUnits="userSpaceOnUse" width="40" height="40">' +
										'<image xlink:href="' + my_image + '?_' + new Date().getTime() + '" x="-10" width="60" height="40" />' +
									'</pattern>' +
									'<polygon points="20 0 37 10 37 30 20 40 3 30 3 10" fill="url(#comment-write-image)"/>' +
								'</svg>' +
							'</td>' +
						'</tr>' +
						'<tr>' +
							'<td class="comm-area">' +
								'<textarea class="form-control" id="comm-content" data-autoresize placeholder="Write here..."></textarea>' + 
								'<div class="btn-mobile-wrap clear clearfix">' +
						 		'';
								if(sid==SID) str = str + '';
								else str = str + '<div class="checkbox"><label><input type="checkbox" id="comm-secret"><i class="fa fa-check-circle" id="comm-secret-icon" aria-hidden="true"></i>' +  $.lang[LANG]['config.secret-post'] + '</label></div>';
								str = str + '' +
									'<div class="btn-mobile comment-submit"><span class="btn btn-submit btn-round"><i class="fa fa-paper-plane" aria-hidden="true"></i> ' +  $.lang[LANG]['config.comment'] + '</span></div>' +
								'</div>' +
							'</td>' + 
							'<td class="form-submit comment-submit"><span class="btn btn-submit btn-round"><i class="fa fa-paper-plane" aria-hidden="true"></i> ' +  $.lang[LANG]['config.comment'] + '</span></td>' +
						'</tr>' +
					'</tbody>' +
				'</table>' +
			'</div>';
		return str;
	}

	var updateForm = function(content,input,id) {
		$('.tpl-comment-form.update-form').remove();
		var secret = (user.secret) ? "checked" : "";
		var str = '' +
			'<div class="tpl-comment-form update-form">' +
				'<div class="pull-right cm-cancel"><i class="fa fa-times"></i></div>' + 
				'<table class="comment-textarea">' +
					'<tbody>' +
						'<tr>' +
							'<td>' +
								'<textarea class="form-control" id="update-content" data-autoresize>' + content + '</textarea>' +
								'<div class="btn-group clear clearfix">' +
						 			'<div class="checkbox">' +
								    	'<label><input type="checkbox" id="update-secret" ' + secret + '><i class="fa fa-check-circle" id="update-secret-icon" aria-hidden="true"></i> ' +  $.lang[LANG]['config.secret-post'] + '</label>' +
								  	'</div>' +
								  	'<div class="btn-mobile update-submit"><span class="btn btn-submit btn-round"><i class="fa fa-paper-plane" aria-hidden="true"></i> ' +  $.lang[LANG]['config.comment'] + '</span></div>' +
							  	'</div>' +
							  	'<input type="hidden" id="update-passwd" value="' + input + '">' +
							  	'<input type="hidden" id="update-id" value="' + id + '">' +
							'</td>' + 
							'<td class="form-submit update-submit"><span class="btn btn-submit btn-round"><i class="fa fa-paper-plane" aria-hidden="true"></i> ' +  $.lang[LANG]['config.comment'] + '</span></td>' +
						'</tr>' +
					'</tbody>' +
				'</table>' +
			'</div>';
		return str;
	}

	var replyForm = function(id,name,option, myImage) {
		$('.tpl-comment-form.reply-form').remove();
		var str = '' +
			'<div class="tpl-comment-form reply-form">' +
				'<div class="pull-right cm-cancel"><i class="fa fa-times"></i></div>' + 
				'<table class="comment-textarea">' +
					'<tbody>' +
						'<tr><td rowspan="2" colspab="2" class="form-profile" valign="top"><svg viewbox="0 0 40 40"><pattern id="comment-reply-image' + id + '" patternUnits="userSpaceOnUse" width="40" height="40"><image xlink:href="' + myImage + '?_' + new Date().getTime() + '" x="-10" width="60" height="40" /></pattern><polygon points="20 0 37 10 37 30 20 40 3 30 3 10" fill="url(#comment-reply-image' + id + ')"/></svg></td></tr>' +
						'<tr>' +
							'<td>' +
								'<textarea class="form-control" id="reply-content" data-autoresize></textarea>' +
								'<div class="btn-group clear clearfix">' +
						 			'<div class="checkbox">';
			if(!option) str = str + '<label><input type="checkbox" id="reply-secret"><i class="fa fa-check-circle" id="reply-secret-icon" aria-hidden="true"></i> ' +  $.lang[LANG]['config.secret-post'] + '</label>';
			else str = str +  '<span data-toggle="tooltip" data-placement="top" data-html="true" data-original-title="' + $.lang[LANG]['config.secret-replies'] + '"><i class="fa fa-check-circle active" aria-hidden="true"></i> <span>' + $.lang[LANG]['config.secret-post'] + '</span></span>';
			str = str + '' +
								  	'</div>'+
								  	'<div class="btn-mobile reply-submit"><span class="btn btn-submit btn-round"><i class="fa fa-paper-plane" aria-hidden="true"></i> ' +  $.lang[LANG]['config.comment'] + '</span></div>' +
								'</div>' +
							  	'<input type="hidden" id="reply-id" value="' + id + '">' +
							  	'<input type="hidden" id="reply-name" value="' + name + '">' +
							'</td>' + 
							'<td class="form-submit reply-submit"><span class="btn btn-submit btn-round"><i class="fa fa-paper-plane" aria-hidden="true"></i> ' +  $.lang[LANG]['config.comment'] + '</span></td>' +
						'</tr>' +
					'</tbody>' +
				'</table>' +
			'</div>';
		return str;
	}
//***********************************************************************************************************************바꾸기 아래
		// live
			// isGabia = (F_SERVICE.indexOf('gabia') > -1) ? true : false;

		// gabia test
			// isGabia = (F_SERVICE.indexOf('gabia') == -1) ? true : false;

	var writeForm = function(token) {
		var F_SITEUM = (typeof SITEUM == "undefined") ? property.SITEUM : SITEUM,
			F_VALIDPLAN = (typeof VALIDPLAN == "undefined") ? property.VALIDPLAN : VALIDPLAN,
			F_VALIDTYPE = (typeof VALIDTYPE == "undefined") ? property.VALIDTYPE : VALIDTYPE,
			F_SERVICE = (typeof SERVICE == 'undefined') ? property.SERVICE : SERVICE,
			isGabia = (F_SERVICE.indexOf('gabia') > -1) ? true : false;

		if(F_VALIDTYPE != 'BN' && F_SITEUM > -1) F_SITEUM = -1;

        if(isGabia) { // gabia
			return '' + 
				'<div class="tab-content">' +
					'<div role="tabpanel" class="tab-pane" id="sitemember">' +
				        '<div class="login form-group">' +
				        	'<input type="text" id="um_cmt_id" name="um_id" class="form-control" placeholder="' +  $.lang[LANG]['siteum.login.id'] + '">' +
				        	'<input type="password" id="um_cmt_password" name="um_password" class="form-control" placeholder="' +  $.lang[LANG]['siteum.login.password'] + '">' +
				        '</div>' +
				        '<div class="btn-wrap" style="margin-bottom: 30px;">' +
				        	'<a href="#" class="btn btn-primary btn-lg btn-block comm-login" >' +  $.lang[LANG]['config.modal.login'] + '</a>' +
				        '</div>' +
					'</div>' +
					'<div role="tabpanel" class="tab-pane active" id="anonymous">' +
						'<div class="form-inline comment-addform">' +
							'<div class="form-group">' +
						    	'<label class="sr-only" for="comm-name">' +  $.lang[LANG]['config.modal.name'] + '</label>' +
						    	'<input type="text" class="form-control" id="comm-name" placeholder="' +  $.lang[LANG]['config.modal.name'] + '">' +
						    	'<p class="error-msg"></p>' +
						  	'</div>' +
						  	'<div class="form-group">' +
						    	'<label class="sr-only" for="comm-pass">' +  $.lang[LANG]['config.modal.password'] + '</label>' +
						    	'<input type="password" class="form-control" id="comm-pass" placeholder="' +  $.lang[LANG]['config.modal.password'] + '">' +
						  	'</div>' +
						'</div>' +
						'<div class="kcaptcha-box comment-addform">' +
							'<div class="col-md-6 no-padding text-left">' +
								'<p id="write_option">' +
									'<img src="" id="kcaptcha" alt="' +  $.lang[LANG]['config.captcha-alt'] + '"/>' +
								'</p>' +
								// '<div id="recaptcha" data-stoken="' + token + '" data-res=""></div>' + 							
							'</div>' +
							'<div class="col-md-6 no-padding text-left">' +
								'<input type="text" id="wr_key" name="wr_key" class="col-sm-12 form-control" placeholder="' +  $.lang[LANG]['config.enter-captcha'] + '"/>' +
								'<a style="float:left; margin-top: 5px; text-decoration: underline" id="kcaptcha" class="small">' +  $.lang[LANG]['config.change-captcha'] + '</a>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<ul class="comment-signForm nav nav-tabs nonmember-mode" role="tablist">' +
					'<li class="signType" role="presentation"><a href="#sitemember" aria-controls="sitemember" role="tab" data-toggle="tab"><i class="fa fa-user" aria-hidden="true"></i> ' + $.lang[LANG]['config.creatorlink.text-adm'] + '</a></li>' +
					'<li class="signType active" role="presentation"><a href="#anonymous" aria-controls="anonymous" role="tab" data-toggle="tab">' +  $.lang[LANG]['config.anonymous'] + '</a></li>' +
				'</ul>';
		} else if(F_SITEUM > 0) { // BN plan & used site member - um & anonymous
			return '' +
				'<ul class="comment-signForm nav nav-tabs" role="tablist">' +
					'<li class="signType active" role="presentation"><a href="#sitemember" aria-controls="sitemember" role="tab" data-toggle="tab">' +  $.lang[LANG]['siteum.login.member'] + '</a></li>' +
					'<li class="signType" role="presentation"><a href="#anonymous" aria-controls="anonymous" role="tab" data-toggle="tab">' +  $.lang[LANG]['config.anonymous'] + '</a></li>' +
				'</ul>' +
				'<div class="tab-content">' +
					'<div role="tabpanel" class="tab-pane active" id="sitemember">' +
				        '<div class="login form-group">' +
				        	'<input type="text" id="um_cmt_id" name="um_id" class="form-control" placeholder="' +  $.lang[LANG]['siteum.login.id'] + '">' +
				        	'<input type="password" id="um_cmt_password" name="um_password" class="form-control" placeholder="' +  $.lang[LANG]['siteum.login.password'] + '">' +
				        '</div>' +
				        '<div class="btn-wrap" style="margin-bottom: 30px;">' +
				        	'<a href="#" class="btn btn-primary btn-lg btn-block comm-login">' +  $.lang[LANG]['config.modal.login'] + '</a>' +
				        '</div>' +
					'</div>' +
					'<div role="tabpanel" class="tab-pane" id="anonymous">' +
						'<div class="form-inline comment-addform">' +
							'<div class="form-group">' +
						    	'<label class="sr-only" for="comm-name">' +  $.lang[LANG]['config.modal.name'] + '</label>' +
						    	'<input type="text" class="form-control" id="comm-name" placeholder="' +  $.lang[LANG]['config.modal.name'] + '">' +
						    	'<p class="error-msg"></p>' +
						  	'</div>' +
						  	'<div class="form-group">' +
						    	'<label class="sr-only" for="comm-pass">' +  $.lang[LANG]['config.modal.password'] + '</label>' +
						    	'<input type="password" class="form-control" id="comm-pass" placeholder="' +  $.lang[LANG]['config.modal.password'] + '">' +
						  	'</div>' +
						'</div>' +
						'<div class="kcaptcha-box comment-addform">' +
							'<div class="col-md-6 no-padding text-left">' +
								'<p id="write_option">' +
									'<img src="" id="kcaptcha" alt="' +  $.lang[LANG]['config.captcha-alt'] + '"/>' +
								'</p>' +						
							'</div>' +
							'<div class="col-md-6 no-padding text-left">' +
								'<input type="text" id="wr_key" name="wr_key" class="col-sm-12 form-control" placeholder="' +  $.lang[LANG]['config.enter-captcha'] + '"/>' +
								'<a style="float:left; margin-top: 5px; text-decoration: underline" id="kcaptcha" class="small">' +  $.lang[LANG]['config.change-captcha'] + '</a>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>';
		} else if(F_VALIDPLAN) { // is plan - only anonymous
			return '' + 
				'<ul class="comment-signForm nav nav-tabs" role="tablist">' +
					'<li class="signType active" role="presentation"><a href="#anonymous" aria-controls="anonymous" role="tab" data-toggle="tab"><img src="https://storage.googleapis.com/i.addblock.net/icon/icon-sign-anonymous.png"><br><br>' +  $.lang[LANG]['config.anonymous'] + '</a></li>' +
				'</ul>' +
				'<div class="tab-content">' +
					'<div role="tabpanel" class="tab-pane active" id="anonymous">' +
						'<div class="form-inline comment-addform">' +
							'<div class="form-group">' +
						    	'<label class="sr-only" for="comm-name">' +  $.lang[LANG]['config.modal.name'] + '</label>' +
						    	'<input type="text" class="form-control" id="comm-name" placeholder="' +  $.lang[LANG]['config.modal.name'] + '">' +
						    	'<p class="error-msg"></p>' +
						  	'</div>' +
						  	'<div class="form-group">' +
						    	'<label class="sr-only" for="comm-pass">' +  $.lang[LANG]['config.modal.password'] + '</label>' +
						    	'<input type="password" class="form-control" id="comm-pass" placeholder="' +  $.lang[LANG]['config.modal.password'] + '">' +
						  	'</div>' +
						'</div>' +
						'<div class="kcaptcha-box comment-addform">' +
							'<div class="col-md-6 no-padding text-left">' +
								'<p id="write_option">' +
									'<img src="" id="kcaptcha" alt="' +  $.lang[LANG]['config.captcha-alt'] + '"/>' +
								'</p>' +
								// '<div id="recaptcha" data-stoken="' + token + '" data-res=""></div>' + 							
							'</div>' +
							'<div class="col-md-6 no-padding text-left">' +
								'<input type="text" id="wr_key" name="wr_key" class="col-sm-12 form-control" placeholder="' +  $.lang[LANG]['config.enter-captcha'] + '"/>' +
								'<a style="float:left; margin-top: 5px; text-decoration: underline" id="kcaptcha" class="small">' +  $.lang[LANG]['config.change-captcha'] + '</a>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>';

		} else { // free - creatorlink & anonymous
			return '' + 
				'<ul class="comment-signForm nav nav-tabs" role="tablist">' +
					'<li class="signType active" role="presentation"><a href="#creatorlink" aria-controls="creatorlink" role="tab" data-toggle="tab"><img src="https://storage.googleapis.com/i.addblock.net/icon/icon-sign-creatorlink.png"><br><br>' +  $.lang[LANG]['config.creatorlink'] + '</a></li>' +
					'<li class="signType" role="presentation"><a href="#anonymous" aria-controls="anonymous" role="tab" data-toggle="tab"><img src="https://storage.googleapis.com/i.addblock.net/icon/icon-sign-anonymous.png"><br><br>' +  $.lang[LANG]['config.anonymous'] + '</a></li>' +
				'</ul>' +
				'<div class="tab-content">' +
					'<div role="tabpanel" class="tab-pane active" id="creatorlink">' +
				        '<div class="login form-group">' +
				        	'<input type="text" id="mb_cmt_id" name="mb_id" class="form-control" placeholder="' +  $.lang[LANG]['config.modal.emailaddress'] + '">' +
				        	'<input type="password" id="mb_cmt_password" name="mb_password" class="form-control" placeholder="' +  $.lang[LANG]['config.modal.password'] + '">' +
				        	'<div class="row">' +
				        		'<label class="remember col-md-6 col-sm-6 col-xs-6"></label>' +
					        	'<label class="forget col-md-6 col-sm-6 col-xs-6"><a href="//creatorlink.net/member/support/password_reset" data-lang="" target="_blank">' +  $.lang[LANG]['page.member.login-modal.password-reset'] + '</a></label>' +
				        	'</div>' +
				        '</div>' +
				        '<div class="btn-wrap">' +
				        	'<a href="#" class="btn btn-primary btn-lg btn-block comm-login">' +  $.lang[LANG]['config.modal.login'] + '</a>' +
				        '</div>' +
						'<div class="bottom-box">' +
							'<span>' +  $.lang[LANG]['page.member.login-modal.jointext'] + '</span> <a href="//creatorlink.net/member/join" target="_blank">' +  $.lang[LANG]['page.member.login-modal.join'] + '</a>' +
						'</div>' +
					'</div>' +
					'<div role="tabpanel" class="tab-pane" id="anonymous">' +
						'<div class="form-inline comment-addform">' +
							'<div class="form-group">' +
						    	'<label class="sr-only" for="comm-name">' +  $.lang[LANG]['config.modal.name'] + '</label>' +
						    	'<input type="text" class="form-control" id="comm-name" placeholder="' +  $.lang[LANG]['config.modal.name'] + '">' +
						    	'<p class="error-msg"></p>' +
						  	'</div>' +
						  	'<div class="form-group">' +
						    	'<label class="sr-only" for="comm-pass">' +  $.lang[LANG]['config.modal.password'] + '</label>' +
						    	'<input type="password" class="form-control" id="comm-pass" placeholder="' +  $.lang[LANG]['config.modal.password'] + '">' +
						  	'</div>' +
						'</div>' +
						'<div class="kcaptcha-box comment-addform">' +
							'<div class="col-md-6 no-padding text-left">' +
								'<p id="write_option">' +
									'<img src="" id="kcaptcha" alt="' +  $.lang[LANG]['config.captcha-alt'] + '"/>' +
								'</p>' +
								// '<div id="recaptcha" data-stoken="' + token + '" data-res=""></div>' + 							
							'</div>' +
							'<div class="col-md-6 no-padding text-left">' +
								'<input type="text" id="wr_key" name="wr_key" class="col-sm-12 form-control" placeholder="' +  $.lang[LANG]['config.enter-captcha'] + '"/>' +
								'<a style="float:left; margin-top: 5px; text-decoration: underline" id="kcaptcha" class="small">' +  $.lang[LANG]['config.change-captcha'] + '</a>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>';
		}
	}

	$('a[data-toggle="tab"]').live('click', function (e) {
		var tab = $(this).attr('aria-controls'),
			thisModal = $(this).closest('.flat-modal');
		
		switch(tab) {
			case "creatorlink":
			case "sitemember": thisModal.find('.modal-footer').hide(); break;
			default:  thisModal.find('.modal-footer').show(); break;
		}
	});

	var passwdForm = function() {
		return '' +
			'<div class="form-inline comment-addform password">' + 				
			  	'<div class="form-group">' +
			    	'<label class="sr-only" for="comm-pass">' +  $.lang[LANG]['config.modal.password'] + '</label>' +
			    	'<input type="password" class="form-control" id="comm-pass" placeholder="' +  $.lang[LANG]['config.modal.password'] + '">' +
			  	'</div>' +
			'</div>';
	}

//***********************************************************************************************************************바꾸기 아래
		// live
			// isGabia = (F_SERVICE.indexOf('gabia') > -1) ? true : false,

		// gabia test
			// isGabia = (F_SERVICE.indexOf('gabia') == -1) ? true : false,

	$('.comm-login').live('click',function(e) {
		$('.comment .error').remove();
		var commentLoginModal = $(this).closest('.modal'),
			F_SERVICE = (typeof SERVICE == "undefined") ? property.SERVICE : SERVICE,
			F_VALIDTYPE = (typeof VALIDTYPE == "undefined") ? property.VALIDTYPE : VALIDTYPE,
			F_SITEUM = (typeof SITEUM == "undefined") ? property.SITEUM : SITEUM,
			isGabia = (F_SERVICE.indexOf('gabia') > -1) ? true : false,
			login_type = (isGabia || (F_VALIDTYPE == 'BN' && F_SITEUM > 0)) ? 'um' : 'mb',
			$input_id = $('#'+login_type+'_cmt_id'),
			$input_password = $('#'+login_type+'_cmt_password'),
			isSubmit = true;

		if($input_id.val().length==0) {
			$input_id.after('<label class="error">! ' +  $.lang[LANG]['config.enter-id'] + '</label>').focus();
			isSubmit = false;
		}

		if($input_password.val().length==0) {
			$input_password.after('<label class="error">! ' +  $.lang[LANG]['config.enter-password'] + '</label>').focus();
			isSubmit = false;
		}

		if(isSubmit) {

			var sid = (typeof MODE == "undefined") ? '' : SID; //config outlogin limit

			if(login_type == 'mb') {
				$.post('/member/login/outlogin', { mb_id : $input_id.val(), mb_password : hex_md5($input_password.val()), sid : sid}, function(data) {
					if(typeof data.error != "undefined" && data.error) {
						$('.comment-signForm').after("<label class='error text-center'>" + data.error + "</label>");
						return false;
					}
					postComment(user);
					commentLoginModal.modal('hide');
				}, 'json');
			} else {

				var input_data = {
					'id' : $input_id.val(),
					'password' : hex_md5($input_password.val()),
				};

				$.post('/umember/login/in', { sid : sid, data : JSON.stringify(input_data) }, function(data) {
					if(typeof data.error != 'undefined' && data.error) {
						$.each(data.error, function(key,str) {
							if(commentLoginModal.find('#um_cmt_'+key).length > 0 ) {
								commentLoginModal.find('#um_cmt_'+key).after('<span class="error">' + str + '</span>');
							} else { 
								$('.comment-signForm').after("<label class='error text-center'>" + str + "</label>"); 
							}
						});
						if(commentLoginModal.find('.error').length > 0) return false;
					}

					// if(data.member.check_login) {
					// 	if(typeof data.ss_url != "undefined" && data.ss_url) {
					// 		$.get(data.ss_url, function(data) {
					// 			console.log(data);
					// 		});
					// 	}
					// }
					$.umember.init();
					postComment(user);
					commentLoginModal.modal('hide');

				},'json');

			}

		}
	});

	$('.comment-list .cm-delete').live('click', function(e) {
		var id = $(this).attr('data-id');
		$.comment.delete(id);
	});

	$('.comment-list .cm-update').live('click', function(e) {
		var id = $(this).attr('data-id'),
			cmt = $(this);

		$.post('/template/comment/info', {id:id}, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
				return false;
			}

			resetUser(user);
			if(data.sign == false) {
				var modal = $(this).showModalFlat('CONFIRM PASSWORD',passwdForm(),true,true,function() {
					var $pass = $('#comm-pass'),
						isSubmit = true,
						userInput = $pass.val();
					$('label.error').remove();
					if($pass.val().length<4) {
						$pass.after('<label class="error">' +  $.lang[LANG]['config.pass-min-length'] + '</label>').focus();
						isSubmit = false;
					}

					if(isSubmit) {
						$('.comment-addform.password').parent().find('.error').remove();
						$.post('/template/comment/password',{ id: id, passwd : hex_md5($pass.val()) }, function(data) {
							if(typeof data.error != "undefined" && data.error) {
								//$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
								$('.comment-addform.password').before("<label class='error'>" + data.error + "</label>");
								return false;
							}
							modal.modal('hide');
							cmt.closest('.cm-row').addClass('add-form');
							insertReplyForm(id,data,userInput);
						},'json');
					}
				},'cancel');
			} else {
				cmt.closest('.cm-row').addClass('add-form');
				insertReplyForm(id,data,'');
			}
		},'json');
	});

	var insertReplyForm = function(id, data, userInput) {
		activeControls(false);
		var $cm = $('.cm-content[data-id="' + id + '"]');
		$cm.empty();
		user.content = data.reply + data.content;
		user.secret = data.secret;
		$cm.html(updateForm(data.content,userInput,id));
	}
	
	$('.comment-list .cm-reply').live('click', function(e) {
		var id = $(this).attr('data-id'),
			name = $(this).attr('data-name'),
			option = $(this).attr('data-option'),
			myImage = $(this).attr('data-myImage'),
			$cm = $('.cm-content[data-id="' + id + '"]');
		$('.cm-controls').hide().addClass('cm-hide').removeClass('cm-controls');
		$(this).closest('.cm-row').addClass('add-form');
		$cm.append(replyForm(id,name,option, myImage));
	});

	$('.comment-list .cm-cancel').live('click', function(e) {
		$('.cm-hide').addClass('cm-controls').removeClass('cm-hide');
		$(this).closest('.cm-row').removeClass('add-form');
		$('.tpl-comment-form.reply-form').remove();
		if($('.tpl-comment-form.update-form').length) {
			$('.tpl-comment-form.update-form').parent().html(user.content.replace(/\r\n|\n|\r/g, '<br />'));
		}
	});

	$('textarea[data-autoresize]').live('keyup',function(e) {
		var offset = $(this).outerHeight() - $(this).height();
		$(this).css('height', 'auto').css('height', $(this).prop("scrollHeight") + offset);
	});

	$('.comment-submit').live('click',function(e) {
		$('.tpl-comment-form label.error').remove();
		var content = $('#comm-content').val(),
			secret = ($('#comm-secret').is(':checked')) ? "ON" : "";

		if(content.length < 3) {
			$('.tpl-comment-form .comm-area').append('<label class="error">' +  $.lang[LANG]['config.content-min-length'] + '</label>');
			return false;
		}
		resetUser(user);
		user.content = content;
		user.secret = secret;
		signCheckPost();
	});

	$('.update-submit').live('click',function(e) {
		$('.tpl-comment-form label.error').remove();
		var content = $('#update-content').val(),
			pass = $('#update-passwd').val(),
			id = $('#update-id').val(),
			secret = ($('#update-secret').is(':checked')) ? "ON" : "";

		if(content.length < 3) {
			$('.tpl-comment-form.update-form .checkbox').after('<label class="error">' +  $.lang[LANG]['config.content-min-length'] + '</label>');
			return false;
		}

		resetUser(user);
		user.id = id;
		user.pass = (pass) ? hex_md5(pass) : "" ;
		user.content = content;
		user.secret = secret;
		postComment(user);
	});

	$('.reply-submit').live('click',function(e) {
		$('.tpl-comment-form label.error').remove();
		var content = $('#reply-content').val(),
			id = $('#reply-id').val(),
			reply = $('#reply-name').val(),
			secret = "";

		if($('#reply-secret').length>0) {
			secret = ($('#reply-secret').is(':checked')) ? "ON" : "";
		} else {
			secret = ($('.cm-reply[data-id="' + id + '"]').attr('data-option')) ? "ON" : "";
		}

		if(content.length < 3) {
			$('.tpl-comment-form.reply-form .checkbox').after('<label class="error">' +  $.lang[LANG]['config.content-min-length'] + '</label>');
			return false;
		}

		resetUser(user);
		user.reply = reply;
		user.parent = id;
		user.content = content;
		user.secret = secret;
		signCheckPost();
	});

	$('.comment-list > li').live({
		mouseover : function() {
			$('.cm-controls').hide();
			$(this).find('.cm-controls').show();
		}
	});

	var activeControls = function(active) {
		(typeof active=="undefined" || active==true) ? 
			$('.cm-hide').addClass('cm-controls').removeClass('cm-hide') : 
			$('.cm-controls').hide().addClass('cm-hide').removeClass('cm-controls');
	}

	var signCheckPost = function() {
		$.post('/template/checkLogin', { comment : true }, function(data) {
			if(!data.user || typeof data.user == "undefined") {
				var modal = $(this).showModalFlat('POST COMMENT',writeForm(data.token),true,true,function() {
					var isSubmit = true;
					$('.comment-addform .error').remove();
					var $name = $('#comm-name'),
						$pass = $('#comm-pass'),
						$key = $('#wr_key'),
						nameLength = getBytes( $name.val() );

					if(nameLength==0) {
						$name.after('<label class="error">' +  $.lang[LANG]['config.enter-name'] + '</label>').focus();
						isSubmit = false;
					}
					else if(nameLength > 30) {
						$name.after('<label class="error">' +  $.lang[LANG]['config.guest-id-max-length'] + '</label>').focus();
						isSubmit = false;
					}

					if($pass.val().length<4) {
						$pass.after('<label class="error">' +  $.lang[LANG]['config.pass-min-length'] + '</label>').focus();
						isSubmit = false;
					}
					if($('#recaptcha').attr('data-res')=='') {
						$key.after('<label class="error">' +  $.lang[LANG]['config.enter-captcha'] + '</label>').focus();
						isSubmit = false;
					}

					if($key.val().length==0) {
						$key.after('<label class="error">' +  $.lang[LANG]['config.enter-captcha'] + '</label>').focus();
						isSubmit = false;
					}

					// if($key.val() && (hex_md5($key.val()) != md5_norobot_key)) {
					if($key.val() && (Base64.encode($key.val().trim()) != md5_norobot_key)) {
						$key.after('<label class="error">' +  $.lang[LANG]['config.wrong-captcha'] + '</label>').focus();
						isSubmit = false;
					}
					// var keyString = '';
					// if(isSubmit == true) {
					// 	var key = checkCaptcha(),
					// 		r = $.parseJSON(key.responseText);
					// 	keyString = (typeof r.success == "undefined") ? "" : r.success;

					// 	if(!keyString) {
					// 		$key.after('<label class="error">' +  $.lang[LANG]['config.wrong-captcha'] + '</label>').focus();
					// 		isSubmit = false;
					// 	}
					// }

					if(isSubmit==true) {
						user.name = $name.val();
						user.pass = hex_md5( $pass.val() );
						user.key = $key.val();
						user.nameLength = nameLength;
						postComment(user, function(data) {
							modal.modal('hide');
						});
					} 
				},'cancel','','w450',true,'',function() {
					// loadCaptcha();
					load_kcaptcha();
				});
				$('.flat-modal .modal-body').addClass('comment');

				var F_SITEUM = (typeof SITEUM == "undefined") ? property.SITEUM : SITEUM,
					F_VALIDPLAN = (typeof VALIDPLAN == "undefined") ? property.VALIDPLAN : VALIDPLAN,
					F_VALIDTYPE = (typeof VALIDTYPE == "undefined") ? property.VALIDTYPE : VALIDTYPE,
					F_SERVICE = (typeof SERVICE == "undefined") ? property.SERVICE : SERVICE,
					isGabia = (F_SERVICE.indexOf('gabia') > -1) ? true : false;
//***********************************************************************************************************************바꾸기 아래
		// live
				// if(F_SERVICE.indexOf('gabia') == -1 && (!F_VALIDPLAN || F_VALIDTYPE == 'BN' && F_SITEUM > 0)) $('.flat-modal .modal-footer').hide();

		// gabia test
				// if(F_SERVICE.indexOf('gabia') > -1 && (!F_VALIDPLAN || F_VALIDTYPE == 'BN' && F_SITEUM > 0)) $('.flat-modal .modal-footer').hide();

				if(F_SERVICE.indexOf('gabia') == -1 && (!F_VALIDPLAN || F_VALIDTYPE == 'BN' && F_SITEUM > 0)) $('.flat-modal .modal-footer').hide();
				// $('#kcaptcha').click();
			} else {
				postComment(user);
			}
		},'json');		
	}	

	var postComment = function(user, callback) {
		var data = true,
			type = CTYPE,
			pid = PID,
			forum_email = (PAGE_MODE == 's') ? $('#forum-email').val() : '';

		data = $.post('/template/comment/update', { user : JSON.stringify(user), type : type, pid : pid, sid : SID, forum_email : forum_email }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
				return false;
			}
			$.comment.init({
				pid : PID,
				type : CTYPE
			});
			return data;
		},'json');

		if(typeof callback === 'function') {
			callback(data);
		}
		setHeight(pageHeight());
	}

	var tplComment = function() {
		return '' +
			'<ul class="comment-list">' + 
			'</ul>';
	}

	var tplCommentRow = function(name,write_id,content,datetime,id,reply,cmb,csgn,own,adm,depth, option, reply_to, isreply, my_image, mb_image) {
		reply = (typeof reply != "undefined" && reply && depth>1 && name) ? '<span class="user-reply">@' + reply + '</span> ' : '';
		var line = (depth>0) ? "line" : "";
		var	userReply = "disabled";

		if (option) {
			userReply = ( (adm || own || isreply) && name ) ? "" : "disabled";
		} else {
			userReply  = (content=="") ? "disabled" : "";
		}

		var userUpdate = ( (!adm && !own) || (adm && !own) ||  !own || !name) ? "disabled" : "",
			userDelete = ( (!adm && !own || !name)  ) ? "disabled" : "";

		var empty = (name) ? "" : "disabled",
			username = (name) ? name : $.lang[LANG]['config.deleted-comment'],
			userid = (typeof write_id != "undefined" && write_id) ? '<span class="cm-write-id pull-left">( ' + write_id + ' )</span>' : '',
			replyClass = (!name && line) ? " deleted" : "";

		return '' +
			'<li class="cm-row ' + line + replyClass + '" id="' + id + '">' + 
				'<dl class="' + empty + '">' + 
				'<dt class="form-profile ' + ((name) ? '' : 'hide') + '"><svg viewbox="0 0 40 40"><pattern id="comment-list-image' + id + '" patternUnits="userSpaceOnUse" width="40" height="40"><image xlink:href="' + mb_image + '?_' + new Date().getTime() + '" x="-10" width="60" height="40" /></pattern><polygon points="20 0 37 10 37 30 20 40 3 30 3 10" fill="url(#comment-list-image' + id + ')"/></svg></dt>' +
				'<dt><span class="cm-name pull-left ' + empty + '">' + username + '</span> ' + userid + ' <span class="cm-time pull-left">' + datetime + 
				'</span><span class="pull-right cm-section">' + 
				'<span class="cm-reply cm-controls ' + userReply + '" data-id="' + id + '" data-name="' + name + '" data-option="' + option + '" data-myImage="' + my_image + '"><i class="fa fa-reply"></i> ' +  $.lang[LANG]['config.answer-comment'] + '</span> ' +
				'<span class="cm-update cm-controls ' + userUpdate + '" data-id="' + id + '"><i class="fa fa-pencil"></i> ' +  $.lang[LANG]['config.edit'] + '</span> ' +
				'<span class="cm-delete cm-controls ' + userDelete + '" data-id="' + id + '"><i class="fa fa-trash-o"></i> ' +  $.lang[LANG]['config.delete'] + '</span>' +
			'</dt>' +
				'<dd class="cm-content" data-id="' + id + '">' + reply + content + '</dd>' + 
			'</li>';
	}

	$.comment = {
		init : function(options) {
			var settings = $.extend({
				type : "P"
			}, options);

			cVIEW = (typeof settings.pid == "undefined") ? property.VIEW : settings.pid;
			SID = (typeof SID == "undefined") ? property.SID : SID;
			PID = cVIEW;
			CTYPE = settings.type;
			var pEl = (typeof PARENT == "undefined") ? property : PARENT;
			if(pEl.mode===null) return false;

			$('.page-comments').remove();
			var wrap = tplWrap(PID),
				$wrap = $(wrap.tpl),
				cmStyle = '';

			if(typeof SETTINGS == 'undefined') {
				cmStyle = (typeof property.SETTINGS.cmStyle == 'undefined' ) ? '' : property.SETTINGS.cmStyle;
			} else {
				cmStyle = (typeof SETTINGS.cmStyle =='undefined') ? '' : SETTINGS.cmStyle;
			}

			$wrap.addClass(cmStyle);
			$wrap.append("<div class='container'>");

			if(typeof property == "undefined") {
				$lastEl = ($('.el-footer_ctrl').length) ? $('.el-footer_ctrl') : $('.add-footer-information');
				if($('.page-bottomlist').length) $lastEl = $('.page-bottomlist');
				$lastEl.before($wrap);
			} else {
				if($('.el-footer').length) {
					$lastEl = ($('.page-bottomlist').length) ? $('.page-bottomlist') : $('.el-footer');
					$lastEl.before($wrap);
				} else {
					$('.dsgn-body').append($wrap);
				}
			}

			$.ajax({
				type : 'GET',
				url : '/template/comment/list/type/' + CTYPE + '/pid/'+PID+'/sid/'+SID,
				dataType : 'json',
				async : true,
				success : function(data) {
			    	var $tCmt = $(tplComment()),
			    		$tplForm = $(tplForm(data.sid,data.my_image));

			    	$.each(data.list, function(i,v) {
			    		$tCmt.append(tplCommentRow(v.name,v.write_id,v.content,v.datetime,v.seq,v.cm_reply,v.cmb,v.sgn,v.own,v.adm,v.depth, v.cm_option, v.reply_to,v.reply,data.my_image, v.mb_image));
			    	});

			    	setTimeout(function() {
						$wrap.css('background-image','none').find('.container').append($tplForm);
				    	$wrap.find('.container').append($tCmt);
						setHeight(pageHeight());
					}, 30);
				}
			});

		},
		delete : function(id) {
			if(typeof id == "undefined" || !id) {
				$(this).showModalFlat('ERROR', $.lang[LANG]['config.comment-not-found'], true, false, '', 'ok');
				return false;
			}

			var modal = $(this).showModalFlat('INFORMATION', $.lang[LANG]['config.confirm-delete-comment'], true,true, function() {

				$.post('/template/comment/info', {id:id}, function(data) {

					if(typeof data.error != "undefined" && data.error) {
						$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
						return false;
					}

					if(data.sign == false) {
						var modalPass = $(this).showModalFlat('CONFIRM PASSWORD',passwdForm(),true,true,function() {
							var $pass = $('#comm-pass'),
								userInput = $pass.val(),
								isSubmit = true;

							$('label.error').remove();
							if($pass.val().length<4) {
								$pass.after('<label class="error">' +  $.lang[LANG]['config.pass-min-length'] + '</label>').focus();
								isSubmit = false;
							}

							if(isSubmit) {
								$('.comment-addform.password').parent().find('.error').remove();
								$.post('/template/comment/password',{ id: id, passwd : hex_md5($pass.val()) }, function(data) {
									if(typeof data.error != "undefined" && data.error) {
										//$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
										$('.comment-addform.password').before("<label class='error'>" + data.error + "</label>");
										return false;
									}

									deletePost(hex_md5($pass.val()));
									modalPass.modal('hide');
								},'json');
							}
						},'cancel');					
					} else {
						deletePost();
					}
					return;
				},'json');
				setTimeout(function() {
					modal.modal('hide');
				}, 20);

			}, 'cancel');
			
			function deletePost(pass) {
				pass = (typeof pass == "undefined") ? "" : pass;
				$.post('/template/comment/delete/type/P/pid/' + PID, { id : id, sid : SID, pass : pass }, function(data) {
					if(typeof data.error != "undefined" && data.error) {
						$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
						return false;
					} else modal.modal('hide');
					$.comment.init({
						pid : PID,
						type : CTYPE
					});
				},'json');
			}

		},
		destory : function() {
			var $obj = $('.page-comments');
			$obj.fadeOut('slow',function() {
				$(this).remove();
			});
		}

	};
}(jQuery));