(function($) {
	$doc = $(document);
	var fmID = 0,
		files = [],
		pY = 0,
		RELOAD = false, isOff = false,
		upTYPE = 'image';
	var user = {
			'name' : '',
			'pass' : '',
			'key' : ''
		},
		groups = [],
		select_group = 0;

	var postUser = {
		'name' : '',
		'img' : '',
		'option' : '',
		'secret_display' : '',
		'replied' : '',
		'writeable'	: false,
		'sid' : false
	}

	/* ie attach upload */
	window.onload = function(){
		setLanguage(LANG);
	    document.getElementById("uploadForm").onsubmit = function() {
	        document.getElementById("uploadForm").target = "uploadIFrame";
	    }
	    document.getElementById("uploadIFrame").onload = function() {
	        $('#forum-attach').modal('hide');
	        var res = $.parseJSON($("#uploadIFrame").contents().find('body').text());
	        if(typeof res.error != "undefined" || res.error) {
	            alert(res.error);
	            $.processOFF();
	            return;
	        }
	    	$.processOFF();
	        $.forum.setfile(res.file, res.uploaded.file_name, res.uploaded.orig_name);
	    }
	    document.getElementById("uploadFile").onchange = function() {
	    	$.processON();
	        document.getElementById("uploadForm").submit();
	    }
	}
    $(function () { LANG = getLanguage(); });

	var resetObject = function(o) {
		$.each(o,function(k,v) {
			o[k] = '';
		});
		return o;
	}
	var uniqID = function() {
		return Math.round(new Date().getTime() + (Math.random() * 100));
	}

	function insertHtmlAtCursor(html) {
	    var sel, range, html;
	    if (window.getSelection) {
	        sel = window.getSelection();
	        if (sel.getRangeAt && sel.rangeCount) {
	            range = sel.getRangeAt(0);
	            range.deleteContents();
			    var htmlNode = document.createElement('p');
			    htmlNode.innerHTML = html
	            range.insertNode(htmlNode);
	            sel.removeAllRanges();
	            range = range.cloneRange();
	            range.selectNode(htmlNode);
	            range.collapse(false);
	            sel.addRange(range);
	        }
	    } else if (document.selection && document.selection.createRange) {
	        range = document.selection.createRange();
	        range.pasteHTML(htmlNode);
	        range.select();
	    }
	}

	var setWriteUser = function(data, callback) {
		if(data.writeable == false && data.access=='G') {
			$(this).showModalFlat('INFORMATION', $.lang[LANG]['board.group-can-write'],true,false,'','ok');
			return false;
		}
		if(data.writeable == false && data.access=='ADM') {
			$(this).showModalFlat('INFORMATION', $.lang[LANG]['board.admin-can-write'],true,false,'','ok');
			return false;
		}

		resetObject(postUser);
		postUser.name = data.name;
		postUser.img = data.myimg;
		postUser.option = data.option;
		postUser.secret_display = data.settings.secret_display;
		postUser.mgr = data.mgr;
		postUser.replied = data.replied;
		postUser.writeable = data.writeable;
		$.post('/fm/guest/login', { user : postUser, guest : user }, function(data) {
			if(typeof callback == 'function') {
				callback();
			}
		});
		return false;
	}

	var forumWriteform = function(id, pid, reply) {
		var title 			= (id) ? $('.tpl-forum-title').text() : "",
			content 		= (id) ? $('.tpl-forum-content .fr-view').html() : "<p><br></p>",
			name 			= postUser.name,
			date 			= (id) ? $('.tpl-forum-date').text() : "now",
			myimage 		= postUser.img,
			option 			= postUser.option,
			secret 			= (option == "S") ? "S" : "",
			notice 			= (option == "N") ? "N" : "",
			secret_display 	= postUser.secret_display,
			mgr 			= postUser.mgr;

		title = title.replace(/'/g,'&#39;');
		var square_secret = (secret=="S") ? "fa-check-square-o" : "fa-square-o",
			square_notice = (option=="N") ? "fa-check-square-o" : "fa-square-o",
			secretClass = "",
			noticeClass = "";

		switch(secret_display) {
			case "N" : secretClass = "hide"; break;
			case "A" : 
				secretClass = "hide";
				secret = "S";
				break;
			default : secretClass = "always"; break;
		}
		noticeClass = (mgr==true) ? "always" : "hide";
		if(postUser.replied || reply) noticeClass = "hide";
		if(secret=="S" && secret_display!="A") secretClass = "";
		if(option=="N") noticeClass = "";

		var str = "" + 
		"<div class='forum-write'>" + 
		"	<ul class='forum-user-info'>" + 
		"		<li class='user-image tpl-forum-myimage'><svg viewbox='0 0 40 40'><pattern id='forum-write-image' patternUnits='userSpaceOnUse' width='40' height='40'><image xlink:href='" + myimage + '?_' + new Date().getTime() + "' x='-10' width='60' height='40' /></pattern><polygon points='20 0 37 10 37 30 20 40 3 30 3 10' fill='url(#forum-write-image)'/></svg></li>"+
		"		<li class='user-info'><div class='tpl-forum-name'>" + name + "</div><div class='tpl-forum-date date'>" + date + "</div></li>"+
		"		<li class='user-ctrl navbar-right'>" +
		"			<span id='fm-notice' class='" + noticeClass + "' data-notice='" + notice + "'><i class='fa " + square_notice + "'></i>" + $.lang[LANG]['board.public'] + "</span>" + 
		"			<span id='fm-secret' class='" + secretClass + "' data-secret='" + secret + "'><i class='fa " + square_secret + "'></i>" + $.lang[LANG]['board.private'] + "</span>" + 
		"		</li>"+
		"	</ul>" +
		"	<input type='hidden' id='fm-id' value='" + id + "'>" +
		"	<input type='hidden' id='fm-pid' value='" + pid + "'>" +
		"	<input type='hidden' id='fm-reply' value='" + reply + "'>" + 
		"	<input type='hidden' id='hash' value='" + (($.cookie('hash')) ? $.cookie('hash') : "") + "'>" +
		"	<input class='form-control tpl-forum-title' id='fm-title' value='" + title + "' placeholder='" + $.lang[LANG]['board.enter-title'] + "'>" + 
		"	<div class='fm-body fm-content fm-editor' id='fm-editor' data-placeholder='" + $.lang[LANG]['board.enter-content'] + "'>" + content + "</div>" +
		"</div>" + 
		"<div class='upload-files'></div>";
		// $.removeCookie('hash', { path: '/' });
		return str;
	}

	$doc.on('keypress','.modal[id*=flat-modal] #mb_id', function(e) {
		if(e.keyCode == 13) {
			$('.forum-login').click();
		}
	});

	$doc.on('keypress','.modal[id*=flat-modal] #mb_password', function(e) {
		if(e.keyCode == 13) {
			$('.forum-login').click();
		}
	});

	$doc.on('focus','#fm-title',function(e) {
		$('.note-toolbar > .btn-group > button').addClass('disabled');
	}).on('focus','.note-editable',function(e) {
		$('.note-toolbar > .btn-group > button').removeClass('disabled');
	});

	$doc.on('click','.note-toolbar > .btn-group > button', function(e) {
		if($(this).hasClass('disabled')) e.preventDefault();
	});

//***********************************************************************************************************************바꾸기 아래
			// live
			// write_level 	: (PLAN || SERVICE.indexOf('gabia') > -1) ? "NM" : "M",
			// reply_level		: (PLAN || SERVICE.indexOf('gabia') > -1) ? "NM" : "A",

			// gabia test
			// write_level 	: (PLAN || SERVICE.indexOf('gabia') == -1) ? "NM" : "M",
			// reply_level		: (PLAN || SERVICE.indexOf('gabia') == -1) ? "NM" : "A",

	var setDefaultConfig = function(config) {
		var defaultConfig = {
			group 			: "",
			write_level 	: (PLAN || SERVICE.indexOf('gabia') > -1) ? "NM" : "M",
			reply_level		: (PLAN || SERVICE.indexOf('gabia') > -1) ? "NM" : "A",
			view_level		: "A",
			list_level		: "A",
			modify			: 0,
			delete 			: 0,
			page_row		: 10,
			secret_display	: "U",
			comment_display : "OFF",
			sns_share_display	: "OFF",
			bottomlist_display	: "OFF",
			forum_count		: 0,
			comment_count	: 0,
			field_lang		: "en",
			field_disable	: [],
			searchbox_display : "ON"
		}
		if(config==null) config = defaultConfig;
		$.each(defaultConfig, function(k,v) {
			if(typeof config[k] == "undefined") config[k] = v;
		});
		return config;
	}

	var forumRow = function(row,num,page_num,pid,loop,config,type) {
		var $loop = $(loop).removeClass('active');
		var url = forumUrl();
		var href = url + "/forum/view/" + row.id,
			icon_secret = (row.option == "S") ? "<i class='fa fa-lock'></i> " : "",
			icon_new = (row.new) ? "<img src='//storage.googleapis.com/i.addblock.net/icon/icon_new_forum.png' title='new' alt='new'>" : "";

		var sbold = (row.option=="N") ? "<b>" : "",
			ebold = (row.option=="N") ? "</b>" : "",
			empty = (row.title == "" && row.content == "") ? true : false,
			title_href = (empty) ? "<a href='javascript:;' class='deleted'>" + $.lang[LANG]['board.post.deleted'] + "</a>" : "<a href='" + href + "'>" + sbold + row.title + ebold + "</a> " + icon_new;

		if(row.option == "N") {
			if($loop.find('.tpl-forum-list-num .fa').length == 0) $loop.find('.tpl-forum-list-num').text('');
		} else {
			if(type=='faq') $loop.find('.tpl-forum-list-num').text('Q');
			else $loop.find('.tpl-forum-list-num').text(num);
		}

		if($loop.find('.tpl-forum-list-myimg').hasClass('hexagon')) {
			var hexagon = "<svg viewbox='0 0 40 40'><pattern id='forum-list-image-" + row.id + "' patternUnits='userSpaceOnUse' width='40' height='40'><image xlink:href='" + row.myimg + '?_' + new Date().getTime() + "' x='-10' width='60' height='40' /></pattern><polygon points='20 0 37 10 37 30 20 40 3 30 3 10' fill='url(#forum-list-image-" + row.id + ")'/></svg>";
			$loop.find('.tpl-forum-list-myimg').html(hexagon);
		} else {
			$loop.find('.tpl-forum-list-myimg').html('<img src="' + row.myimg + '?_' + new Date().getTime() + '">');	
		}

		if($loop.find('.tpl-forum-list-category').length > 0) {
			var cate_class = (row.category_seq) ? '': 'empty',
				cate_name = (row.category_name) ? row.category_name : '';
			$loop.find('.tpl-forum-list-category').text(cate_name).attr('data-cate',row.category_seq).addClass(cate_class);
		}

		$loop.find('.tpl-forum-list-name').text(row.name);
		if($loop.find('.tpl-forum-list-name').hasClass('tpl-sync-reply') && row.depth>0 && row.option!="N") {
			$loop.find('.tpl-forum-list-name').addClass('reply');
		}

		if($loop.find('.tpl-forum-list-title .fa').length > 0 && row.option=="N") {			
			var icon_notice = $loop.find('.tpl-forum-list-title .fa').outerHTML();
			$loop.find('.tpl-forum-list-title').html(icon_notice + icon_secret + title_href).attr('data-option',row.option).attr('data-id',row.id).removeClass('reply');
		} else {
			$loop.find('.tpl-forum-list-title').html(icon_secret + title_href).attr('data-option',row.option).attr('data-id',row.id);
			if(row.depth>0 && row.option!="N") {
				$loop.find('.tpl-forum-list-title').addClass('reply');
				$loop.find('.tpl-forum-list-title').prepend('<span class="tpl-forum-list-reply-name">' + row.reply_name + '</span>');
			}
		}

		if($loop.find('.tpl-forum-list-cont').length > 0) {
			var max_len = (typeof $loop.find('.tpl-forum-list-cont').attr('data-cont-max') == "undefined") ? 650 : parseInt($loop.find('.tpl-forum-list-cont').attr('data-cont-max')),
				cont_str = (row.content == "") ? "" : row.content.replace(/(<([^>]+)>)/ig," "),
				r_cont_str = (cont_str.length < max_len) ? cont_str : cont_str.substring(0,max_len) + '...',
				cont_href = (r_cont_str == "") ? "<a href='javascript:;' class='deleted'></a>" : "<a href='" + href + "'>" + r_cont_str + "</a>";

			$loop.find('.tpl-forum-list-cont').html(cont_href).attr('data-option',row.option).attr('data-id',row.id);
		}

		if(type == 'thumb') {
			if($loop.find('.tpl-forum-list-thumb').length > 0) {
				var ffolder = $('.element[data-id="' + pid + '"]').attr('data-width'),
					thumb_empty = (row.thumb == "" || row.title == "") ? true : false,
					thumb_src = (thumb_empty) ? "//storage.googleapis.com/i.addblock.net/icon/noimage_" + ffolder +".png" : row.thumb.replace('\/60\/','\/' + ffolder + '\/'),
					thumb_href = (row.content == "") ? "<a href='javascript:;' class='deleted'></a>" : "<a href='" + href + "'></a>";

				$loop.find('.tpl-forum-list-thumb img').attr('src',thumb_src).wrap(thumb_href);

				if(thumb_empty) $loop.find('.tpl-forum-list-thumb').addClass('empty').attr('data-option',row.option).attr('data-id',row.id);
				else $loop.find('.tpl-forum-list-thumb').removeClass('empty').attr('data-option',row.option).attr('data-id',row.id);
			} 
		}

		if($loop.find('.tpl-forum-list-more').length > 0) {
			var more_str = $loop.find('.tpl-forum-list-more').html();
			$loop.find('.tpl-forum-list-more').html("<a href='" + href + "'>" + more_str + "</a>" ).attr('data-option',row.option).attr('data-id',row.id);
		}

		if(typeof config.comment_display != "undefined" && config.comment_display == "ON") {
			var comment_str = (row.comment > 0) ? row.comment : '';
			$loop.find('.tpl-forum-list-comment').html(comment_str);
			if(!comment_str) $loop.find('.tpl-forum-list-comment-icon').remove();
		} else {
			$loop.find('.tpl-forum-list-comment').remove();
			$loop.find('.tpl-forum-list-comment-icon').remove();
		}

		$loop.find('.tpl-forum-list-date').text(row.datetime);
		$loop.find('.tpl-forum-list-hit').text(row.hit);

		if(type == 'faq') {
			var colspan = $loop.find('th').length,
				settings = (typeof row.settings == "undefined") ? {} : row.settings,
				wrap = (typeof settings.wrap != 'undefined') ? 'w' + settings.wrap : '',
				align = (typeof settings.align != 'undefined') ? settings.align : '',
				align_class = (align != '') ? 'text-'+align : '';

			colspan = colspan + $loop.find('td').length;
			
			var $answer = $('<tr>');
			$answer.append('<th scope="row" class="tpl-forum-list-num">A</th>');
			$answer.append('<td conspan="' + (colspan-1) + '"><div class="fr-view ' + align_class + '"><div class="forum-write ' + wrap + '">' + row.content + '</div></div></td>');
			$answer.hide();
		}
		return (type == 'faq') ? $loop[0].outerHTML + $answer.outerHTML() : $loop[0].outerHTML;
	}
	var forumUrl = function() {
		if(PAGE_MODE != "c") {
			var url = (PAGE_MODE=='s') ? "" : "/render";
		} else {
			var url = "/config/page";
		}
		return url;		
	}
	var forumView = function(id) {
		files = [];
        $.ajax({
            url: '/fm/view',
            dataType: 'json',
            type: 'POST',
            data:  { id : id, sid : F_SID },
            async: false,
            cache: false,
            success: function (data) {
				if(typeof data.error != "undefined" && data.error) {
					$.cookie('gallery','.' + F_PARENT.element, { path: '/' });
					alert(data.error);
					if(PAGE_MODE != "c") {
						var url = (PAGE_MODE=='s') ? "/" : "/render/";
						(F_ONE) ? location.replace(url + '#' + F_PARENT.page) : location.replace(url + F_PARENT.page);	
					} else {
						(F_ONE) ? location.replace('/config/page/index#' + F_PARENT.page) : location.replace('/config/page/' + F_PARENT.page);
						return false;
					}
				}
				if(typeof data.error != "undefined" && data.error) return false;
				if(typeof data.f_c_fonts != "undefined" && data.f_c_fonts && PAGE_MODE!="c") {
					$.each(data.fonts, function(i,v) {
						if(property.ELFONTS.indexOf(i) < 0) {
							property.ELFONTS.push(i);
							$('#loadfonts').append(v);
						}
					});
				}
				var settings = (typeof data.fm_settings == "undefined") ? {} : JSON.parse(data.fm_settings),
					p_settings = (typeof F_PARENT.settings == "undefined") ? {} : JSON.parse(F_PARENT.settings),
					wrap = (typeof settings.wrap == "undefined") ? '' : 'w' + settings.wrap,
					align = (typeof settings.align == "undefined") ? 'left' : settings.align,
					category = (typeof data.category_seq == "undefined") ? '' : "<div class='tpl-forum-category' data-cate='" + data.category_seq + "'>" + data.category_name + "</div>";

				// Category Display none case
				// if(category && typeof p_settings.field_disable != "undefined") {
				// 	if($.inArray('category',p_settings.field_disable) > -1)  category = '';
				// }

				files = data.files;

				var f_color = (typeof p_settings.forum_color == "undefined") ? "black" : p_settings.forum_color,
					forum_email = (typeof p_settings.forum_email == "undefined") ? "" : p_settings.forum_email,
					write_admin_id = (typeof data.write_id != "undefined") ? "<span class='tpl-forum-admin-id write-id'>(" + data.write_id + ")</span>" : "";

				var str = "" +
				"<div class='forum-view " + wrap + "' data-fcolor='" + f_color + "' >" +
				"	 <input type='hidden' id='fm-id' value='" + data.id + "'>" +
				"	 <input type='hidden' id='fm-pid' value='" + data.pid + "'>" +
				"	 <input type='hidden' id='forum-email' value='" + forum_email + "'>" +
				"    <div class='container'>" +
				"		<div class='forum-write " + wrap + "'>" + 
				"        <div class='row'>" +
				"            <div class='col-md-12 col-sm-12 col-xs-12'>" +
				"				<ul class='forum-user-info'>" + 
				"					<li class='user-image tpl-forum-myimage'><svg viewbox='0 0 40 40'><pattern id='forum-view-image' patternUnits='userSpaceOnUse' width='40' height='40'><image xlink:href='" + data.myimg + '?_' + new Date().getTime() + "' x='-10' width='60' height='40' /></pattern><polygon points='20 0 37 10 37 30 20 40 3 30 3 10' fill='url(#forum-view-image)'/></svg></li>"+
				"					<li class='user-info'><div class='tpl-forum-name'>" + data.name + "</div>" + write_admin_id + "<div class='tpl-forum-date date'>" + data.date + "</div><div class='tpl-forum-hit hit'> " + data.hit + "</div></li>"+
				"					<li class='user-ctrl navbar-right'><img src='//storage.googleapis.com/i.addblock.net/icon/icon-user-ctrl_" + f_color + ".png' id='forum-ctrl' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>" +
				"					" + postDropMenu(data) + "</li>"+
				"				</ul>" +
				"				" + category +
				"				<div class='tpl-forum-title'>" + data.title + "</div>" +
				"				<div class='tpl-forum-content fm-body fm-content fm-editor fr-box " + align + "'><div class='fr-wrapper' dir='auto'><div class='fr-element fr-view' dir='auto'>" + data.content + "</div></div></div>" +
				"				<div class='tpl-forum-list-footer'>" +
				"					<div class='tpl-forum-control-wrap' style='float:right'>" + 
				"						<button type='button' class='btn btn-default btn-round btn-modal btn-list tpl-forum-list'><i class='fa fa-bars'></i> &nbsp;" + $.lang[LANG]['board.button.list'] + "</button>" +
				"						" + replyPostbutton(data) + 
				"					</div>" + 
				"				</div>" +
				"            </div>" +
				"        </div>" +
				"		</div>" +
				"    </div>" +
				"</div>";
				$('.header.el-menu').after(str);
				$('.fmcss').remove();

				if(typeof data.fm_bg != "undefined") $('#dsgn-body').after('<style class="fmcss"> html, body, body > .dsgn-body { ' + data.fm_bg.trim() + '}</style>')
				else { $('.forum-view[data-fcolor="black"]').addClass('default-forum-view'); }

				displayPageToolbar(data.option);
				// $.removeCookie('hash', { path: '/' });
			}
		},'json');
	}

	// $(document).on('click', '.tpl-forum-list-footer',function() {
	// 	$('.fmcss').remove();
	// });
	
	$(document).on('click','.tpl-forum-toolbar-button.share', function() {
		var option = $(this).closest('.tpl-page-toolbar').attr('data-page-option');
		if(option == "S") {
			$(this).showModalFlat('INFORMATION',$.lang[LANG]['config.gallery.share.cannot.secret-post'],true,false,'','ok');
			return false;
		}
		if(typeof MODE == "undefined" && property.PUBLISH) shareModal();
		else $(this).showModalFlat('INFORMATION',$.lang[LANG]['config.gallery.share.publish'],true,false,'','ok')
	});

	var replyPostbutton = function(data) {
		var str = "<button type='button' class='btn btn-default btn-round btn-modal btn-list tpl-forum-write' data-pid='" + data.pid + "' data-reply='" + data.id + "'><i class='fa fa-reply'></i> &nbsp;" + $.lang[LANG]['board.button.reply'] + "</button>";
		return (data.reply && data.option != 'N') ? str : "";
	}

	var postDropMenu = function(data) {
		var drop = false;
		var str = "" + 
		"<ul class='dropdown-menu' aria-labelledby='forum-ctrl'>";
		if((data.own || (data.sign == false && data.fmid == false)) && data.writeable == true) {
			str = str + "	<li><a href='#' class='tpl-forum-write' data-id='" + data.id + "' data-pid='" + data.pid + "'>" + $.lang[LANG]['board.button.modify'] + "</a></li>";
			drop = true;
		}

		if(data.own || (data.sign == false && data.fmid == false) || data.mgr) {
			str = str + "	<li><a href='#' class='tpl-forum-delete' data-id='" + data.id + "' data-pid='" + data.pid + "'>" + $.lang[LANG]['board.button.delete'] + "</a></li>";
			drop = true;
		}
		if(drop==false) {
			str = str + "<li><a href='#'>" + $.lang[LANG]['board.not-allowed'] + "</a></li>";
		}
		str = str + "</ul>";
		return str;
	}

//***********************************************************************************************************************바꾸기 아래
			// live
			// isGabia = (F_SERVICE.indexOf('gabia') > -1) ? true : false,

			// gabia test
			// isGabia = (F_SERVICE.indexOf('gabia') == -1) ? true : false,


	var signForm = function(id,pid,access,token) {
		var mode = (access=='NM') ? 'nonmem' : 'default',
			F_VALIDPLAN = (typeof VALIDPLAN == "undefined") ? property.VALIDPLAN : VALIDPLAN,
			F_VALIDTYPE = (typeof VALIDTYPE == "undefined") ? property.VALIDTYPE : VALIDTYPE,
			F_SITEUM = (typeof SITEUM == "undefined") ? property.SITEUM : SITEUM,
			F_SERVICE = (typeof SERVICE == "undefined") ? property.SERVICE : SERVICE,
			isGabia = (F_SERVICE.indexOf('gabia') > -1) ? true : false,
			host_url = (isGabia) ? 'http://creatorlink-gabia.com' : 'http://creatorlink.net',
			classSet = {
				'default': ['default-mode','active', '', '', '', ''],
				'sitemember': ['sitemember-mode', '', 'active', '', '', 'hidden'],
				'nonmem' : ['nonmember-mode', '', '', 'active', '.nonmem', 'hidden'],
			};

		var signForm_str_nonmember = '',
			signForm_str_defult  = '';

		if(F_VALIDTYPE != 'BN' && F_SITEUM > -1) F_SITEUM = -1;


		if(F_VALIDTYPE == 'BN' && F_SITEUM > 0 && access != 'NM') {
			mode = 'sitemember';
		}


		if(isGabia) {
			if(access == 'ADM') {
				mode = 'sitemember';
			} else if(access == 'NM') {
				//
			} else {
				if(F_VALIDTYPE != 'BN' || (F_VALIDTYPE == 'BN' && F_SITEUM < 1)) {
					mode = 'nonmem';
					access = 'NM';
				}
			}
		}

		if (access=='NM') {
			signForm_str_nonmember = '' + 
			'<ul class="comment-signForm nav nav-tabs ' + classSet[mode][0] + '" role="tablist">';

				if(isGabia || (!isGabia && F_SITEUM > 0)) {
					signForm_str_nonmember += '' + 
					'<li class="signType ' + classSet[mode][2] + '" role="presentation"><a href="#sitemember" aria-controls="sitemember" role="tab" data-toggle="tab"><i class="fa fa-user" aria-hidden="true"></i> ' + $.lang[LANG]['config.creatorlink.text-adm'] + '</a></li>';
					
				} else {
					signForm_str_nonmember += '' +
					'<li class="signType ' + classSet[mode][1] + '" role="presentation"><a href="#creatorlink" aria-controls="creatorlink" role="tab" data-toggle="tab"><i class="fa fa-user" aria-hidden="true"></i> ' + $.lang[LANG]['config.creatorlink.text-adm'] + '</a></li>';
				}
				signForm_str_nonmember += '' + 
				'<li class="signType ' + classSet[mode][3] + '" role="presentation"><a href="#anonymous" aria-controls="anonymous" role="tab" data-toggle="tab">' +  $.lang[LANG]['config.anonymous'] + '</a></li>' +
			'</ul>';
		} else {
			signForm_str_defult = '' + 
				'<ul class="comment-signForm nav nav-tabs ' + classSet[mode][0] + '" role="tablist">';
			if(mode == 'sitemember') {
				signForm_str_defult += '' + 
				'<li class="signType ' + classSet[mode][2] + '" role="presentation"><a href="#sitemember" aria-controls="sitemember" role="tab" data-toggle="tab"><br>' + $.lang[LANG]['siteum.login.member'] + '</a></li>';
			} else {
				var tab_str = (isGabia) ? '<br>' + $.lang[LANG]['siteum.login.member'] : '<img src="//storage.googleapis.com/i.addblock.net/icon/icon-sign-creatorlink.png"><br><br>' +  $.lang[LANG]['config.creatorlink'];
				if(F_VALIDTYPE == 'BN' && access == 'ADM' ) {
					tab_str = '<br>' + $.lang[LANG]['config.creatorlink.text-adm2'];
					classSet[mode][5] = 'hidden';
				}
				signForm_str_defult += '' + 
					'<li class="signType ' + classSet[mode][1] + '" role="presentation"><a href="#creatorlink" aria-controls="creatorlink" role="tab" data-toggle="tab">' + tab_str + '</a></li>';
			}
			if(access=='A') {
				var icon_str = (mode == 'sitemember') ? '' : '<img src="//storage.googleapis.com/i.addblock.net/icon/icon-sign-anonymous.png"><br><br>';
				signForm_str_defult += '' + 
				'<li class="signType ' + classSet[mode][3] + '" role="presentation"><a href="#anonymous" aria-controls="anonymous" role="tab" data-toggle="tab">' + icon_str +  $.lang[LANG]['config.anonymous'] + '</a></li>';
			}
			signForm_str_defult += '' + 
			'</ul>';
		}




		var str = signForm_str_defult +  
			'<div class="tab-content">' +
				'<div role="tabpanel" class="tab-pane ' + classSet[mode][1] + '" id="creatorlink">' +
			        '<div class="login form-group">' +
			        	'<input type="text" id="mb_forum_id" name="mb_id" class="form-control" placeholder="' +  $.lang[LANG]['config.modal.emailaddress'] + '">' +
			        	'<input type="password" id="mb_forum_password" name="mb_password" class="form-control" placeholder="' +  $.lang[LANG]['config.modal.password'] + '">' +
			        	'<!--<div class="row">' +
			        		'<label class="remember col-md-6 col-sm-6 col-xs-6"></label>' +
				        	'<label class="forget col-md-6 col-sm-6 col-xs-6"><a href="//creatorlink.net/member/support/password_reset" data-lang="" target="_blank">' +  $.lang[LANG]['page.member.login-modal.password-reset'] + '</a></label>' +
			        	'</div>-->' +
			        '</div>' +
			        '<div class="btn-wrap">' +
			        	'<a href="#" class="btn btn-primary btn-lg btn-block forum-login" data-id="' + id + '" data-pid="' + pid + '">' +  $.lang[LANG]['config.modal.login'] + '</a>' +
			        '</div>' +
					'<div class="bottom-box text-right ' + LANG + ' ' + classSet[mode][5] + '">' +
						'<span>' +  $.lang[LANG]['page.member.login-modal.jointext2'] + '</span>&nbsp;&nbsp;&nbsp;<a href="//creatorlink.net/member/join" target="_blank"><u><b>' +  $.lang[LANG]['page.member.login-modal.join2'] + '</b></u></a>' +
					'</div>' +
				'</div>' +
				'<div role="tabpanel" class="tab-pane ' + classSet[mode][2] + '" id="sitemember">' +
			        '<div class="login form-group">' +
			        	'<input type="text" id="um_forum_id" name="um_id" class="form-control" placeholder="' +  $.lang[LANG]['siteum.login.id'] + '">' +
			        	'<input type="password" id="um_forum_password" name="um_password" class="form-control" placeholder="' +  $.lang[LANG]['siteum.login.password'] + '">' +
			        	'<!--<div class="row">' +
			        		'<label class="remember col-md-6 col-sm-6 col-xs-6"></label>' +
				        	'<label class="forget col-md-6 col-sm-6 col-xs-6"><a href="//creatorlink.net/member/support/password_reset" data-lang="" target="_blank">' +  $.lang[LANG]['page.member.login-modal.password-reset'] + '</a></label>' +
			        	'</div>-->' +
			        '</div>' +
			        '<div class="btn-wrap">' +
			        	'<a href="#" class="btn btn-primary btn-lg btn-block forum-login" data-id="' + id + '" data-pid="' + pid + '">' +  $.lang[LANG]['config.modal.login'] + '</a>' +
			        '</div>' +
					'<div class="bottom-box text-right ' + LANG + ' ' + classSet[mode][5] + '">' +
						'<span>' +  $.lang[LANG]['page.member.login-modal.jointext2'] + '</span>&nbsp;&nbsp;&nbsp;<a href="//creatorlink.net/member/join" target="_blank"><u><b>' +  $.lang[LANG]['page.member.login-modal.join2'] + '</b></u></a>' +
					'</div>' +
					'<br>' +
				'</div>' +
				'<div role="tabpanel" class="tab-pane ' + classSet[mode][3] + '" id="anonymous">' +
					'<div class="form-inline comment-addform">' +
						'<div class="form-group">' +
					    	'<label class="sr-only" for="comm-name">' +  $.lang[LANG]['config.modal.name'+classSet[mode][4]] + '</label>' +
					    	'<input type="text" class="form-control" id="comm-name" placeholder="' +  $.lang[LANG]['config.modal.name'+classSet[mode][4]] + '">' +
					  	'</div>' +
					  	'<div class="form-group">' +
					    	'<label class="sr-only" for="comm-pass">' +  $.lang[LANG]['config.modal.password'+classSet[mode][4]] + '</label>' +
					    	'<input type="password" class="form-control" id="comm-pass" placeholder="' +  $.lang[LANG]['config.modal.password'+classSet[mode][4]] + '">' +
					  	'</div>' +
					'</div>' +
					'<div class="kcaptcha-box comment-addform">' +
						'<div class="col-xs-12 col-sm-5 col-md-5 no-padding text-left">' +
							'<p id="write_option">' +
								'<img src="" id="kcaptcha" alt="' +  $.lang[LANG]['config.captcha-alt'] + '"/>' +
							'</p>' +
							// '<div id="recaptcha" data-stoken="' + token + '" data-res=""></div>' + 
						'</div>' +
						'<div class="col-xs-12 col-sm-7 col-md-7 no-padding text-left">' +
							'<input type="text" id="wr_key" name="wr_key" class="col-sm-12 form-control" placeholder="' +  $.lang[LANG]['config.enter-captcha'] + '"/>' +
							'<a style="float:left; margin-top: 5px; text-decoration: underline" id="kcaptcha" class="small">' +  $.lang[LANG]['config.change-captcha'] + '</a>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
			signForm_str_nonmember;


		return str;
	}
	var forumWrite = function(id,pid,reply) {
		reply = (typeof reply == "undefined") ? "" : reply;
		// var form = forumWriteform(id,pid,reply);
		// scrollPos = 0, scrollTop = 0;
		// var modal = $(this).forumModal('WRITE',form,true,true,function() {
		// 	var $title = $('#fm-title');
		// 		$content = $('#fm-editor'),
		// 		$id = $('#fm-id'),
		// 		$hash = $('#hash'),
		// 		$pid = $('#fm-pid'),
		// 		secret = ($('#fm-secret').attr('data-secret')) ? "S" : "",
		// 		notice = ($('#fm-notice').attr('data-notice')) ? "N" : "",
		// 		files = $('.result-file').map(function() {
		// 			return $(this).attr('data-file-name');
		// 		}).get().join(",");

		// 	$('.fm-error').remove();
		// 	$.processON();

		// 	if(secret && notice) {
		// 		$.processOFF();
		// 		alert( $.lang[LANG]['board.no-secret-post'] );
		// 		return false;
		// 	}

		// 	if(!$title.val() || $('#fm-title').val().replace(/ /g,"").length==0) {
		// 		$.processOFF();
		// 		$title.val('');
		// 		$title.focus();
		// 		return false;
		// 	}


		// 	if($content.find('.fr-view').text().length<5) {
		// 		$.processOFF();
		// 		$title.after('<p class="fm-error">' + $.lang[LANG]['board.post-min-length'] + '</p>');
		// 		$content.find('.fr-view').focus();
		// 		return false;
		// 	}

		// 	var getHtml = $content.froalaEditor('html.get', true).replace(/fr-active/,'');

		// 	$.post('/fm/post', { 
		// 		sid : F_SID, 
		// 		pid : $pid.val(), 
		// 		id : (reply) ? "" : $id.val(), 
		// 		reply : reply,
		// 		title : $title.val(), 
		// 		content : getHtml,
		// 		user : JSON.stringify(user), 
		// 		hash : $hash.val(),
		// 		files : files,
		// 		secret : secret,
		// 		notice : notice
		// 	}, function(data) {
		// 		if(typeof data.error != 'undefined' && data.error) {
		// 			if(data.error=='login') {
		// 				userLogin();
		// 			} else {
		// 				alert(data.error);
		// 			}
		// 			$.processOFF();
		// 			return false;
		// 		}
		// 		if($id.val()) {
		// 			$('.forum-view').remove();
		// 			$.forum.view(data.id);
		// 			//if(reply) {
		// 				var url = forumUrl();
		// 				location.replace(url + '/forum/view/' + data.id);
		// 			//}
		// 			//modal.modal('hide');
		// 		} else { 
		// 			var url = forumUrl();
		// 			location.replace(url + '/forum/view/' + data.id);
		// 		}
		// 	},'json');
		// });
		// setTimeout(function(e) {
		// 	$('.forum-modal').addClass('in');
		// },100);
		// $('.modal-backdrop').addClass('write-modal');
		// if(!reply) {
		// 	$.each(files,function(i,v) {
		// 		$.forum.setfile(v.file_path + v.file_name, v.file_name, v.orig_name);
		// 	});
		// }
		// var efonts = style.getUserFontsArr('font-family-body',''),
	 //        $toolbar = $('.fr-toolbar');

	 //    $('#fm-editor').on('froalaEditor.initialized', function (e, editor) {
	 //    	lastLineEmpty();
		// 	editor.events.bindClick($('#forum-modal'), '.fr-video', function () {});
		// })
	 //    .froalaEditor({
  // 	        // height: $('#fm-editor').height(),
	 //        toolbarInline: true,
	 //        toolbarButtons: ['fontFamily','fontSize','color','insertLink','bold','italic','underline','strikeThrough'],
	 //        toolbarButtonsMD: ['fontFamily','fontSize','color','insertLink','bold','italic','underline','strikeThrough'],
	 //        toolbarButtonsSM: ['fontFamily','fontSize','color','insertLink','bold','italic','underline','strikeThrough'],
	 //        toolbarButtonsXS: ['fontFamily','fontSize','color','insertLink','bold','italic','underline','strikeThrough'],
	 //        pluginsEnabled: ['align', 'codeBeautifier', 'codeView', 'colors', 'draggable', 'entities', 'file', 'fontFamily', 'fontSize', 'image', 'inlineStyle', 'lineBreaker', 'link', 'lists', 'quote', 'save', 'table', 'url', 'video'],
	 //        linkEditButtons: ['linkEdit', 'linkRemove'],
	 //        imageInsertButtons: ['imageBack', '|', 'imageUpload'],
	 //        enter: $.FroalaEditor.ENTER_P,
	 //        imageDefaultWidth: 0,
	 //        fontFamily: efonts,
	 //        fontFamilySelection: true,
	 //        fontSizeSelection: true,
	 //        placeholderText: '',
	 //        zIndex: 1040,
	 //        linkAlwaysBlank: true,
	 //        linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
	 //        linkAlwaysNoFollow: true,
	 //        // lineBreakerTags: ['table', 'hr', 'span.fr-video', 'img', 'span.edt-type-file'],
	 //        // lineBreakerOffset: 20,
	 //        videoEditButtons: ['videoAlign','video-enter','videoRemove'],
	 //        keepFormatOnDelete: true,
	 //        imageEditButtons: ['image-replace','img-align-full','img-align-wide','img-align-original','img-align-left-470','img-align-right-470','img-align-left','img-align-right','imageLink','imageAlign','editor-enter'],
		// 	imageUploadParam: 'files',
		// 	imageUploadParams: { replace : true },
		//     imageUploadURL: '/fm/attach',
		//     imageUploadMethod: 'POST',
		//     imageMaxSize: 10 * 1024 * 1024,
		// }).on('froalaEditor.image.uploaded', function (e, editor, response) {
	 //    	var res = JSON.parse(response);
		// }).on('froalaEditor.image.inserted', function (e, editor, $img, response) {
		// 	$img.wrap('<span class="no-select"></span>');
		//     imageSetClass($img);
		// }).on('froalaEditor.toolbar.show', function (e, editor) {
		// 	var $toolbar = $('.fr-toolbar'), $editor = $('#fm-editor');
	 //    	$toolbar.css('visibility','hidden');
	 //    	sRect = selectionRect();

	 //    	setTimeout(function() {
	 //            var top = sRect.top - 45;
	 //            if(frAbove) {
	 //                $toolbar.css('top',top+'px');
	 //                $toolbar.addClass('fr-above');
	 //            }

	 //            if(frAbove) {
	 //                $('.fr-toolbar .fr-dropdown-menu').addClass('dropup');
	 //            } else {
	 //            	$('.fr-toolbar .fr-dropdown-menu').removeClass('dropup');
	 //            }
	 //    		var tWidth = $toolbar.width()/2,
	 //    			sLeft = sRect.left,
	 //    			sWidth = sRect.width/2,
	 //    			nLeft = sLeft - tWidth + sWidth,
	 //    			editorRight = ($editor.offset().left + $editor.outerWidth()),
	 //    			oLeft = $toolbar.css('left').replace('px','');

	 //    		nLeft = sLeft;
	 //    		if(nLeft + $toolbar.width() > editorRight) {
	 //    			nLeft = editorRight - $toolbar.width();
	 //    		}

	 //    		var s = $('#fm-editor').froalaEditor('selection.element');
	 //    		if(s.style.fontFamily != '') {
	 //    			$toolbar.find('button[data-cmd="fontFamily"] span').css('font-family',s.style.fontFamily);
	 //    		}
	 //    		$toolbar.css('left', nLeft+'px').css('visibility','visible');
	 //    		toolPos = $toolbar.css('top').replace('px','');
	 //    	},100);
	 //    }).on('froalaEditor.focus', function (e, editor) {

	 //    }).on('froalaEditor.blur', function (e, editor) {
	 //    	lastLineEmpty();
		// });

	 //    $('#fm-editor').on('froalaEditor.buttons.refresh', function (e, editor) {
	 //        scrollPos = $('#forum-modal').scrollTop();
	 //        if(frAbove) {
	 //        	scrollPos2 = $('#forum-modal').scrollTop();
	 //            $('.fr-popup').css('visibility','hidden');
	 //            setTimeout(function() {
	 //                var top = $('.fr-toolbar').css('top').replace('px','') -170;
	 //                if($('.fr-popup.fr-active .fr-link-insert-layer').length) top = $('.fr-toolbar').css('top').replace('px','')-180;
	 //                if($('.fr-popup.fr-active').prev().hasClass('fr-image-overlay')) ;
	 //                else $('.fr-popup').addClass('fr-above').css('top',top+'px');
	 //                $('.fr-popup').css('visibility','visible');
	 //                if($('.fr-popup.fr-active').length) {
		//         		popPos = $('.fr-popup.fr-active').css('top').replace('px','');
		//         	}
	 //            },'100');
	 //        } else {
	 //            setTimeout(function() {
		//             $('.fr-popup').css('visibility','hidden');
	 //                if($('.fr-popup.fr-active').length) {
		//         		popPos = $('.fr-popup.fr-active').css('top').replace('px','');
		//         	}
	 //                $('.fr-popup').css('visibility','visible');
	 //            },100);
	 //        }
	 //        $('.fr-btn.fr-btn-image').removeClass('active');
  //   		lastLineEmpty();

	 //        var $img = $('#fm-editor').froalaEditor('image.get');
	 //        if($img != null && typeof $img != null && $img.length) {
	 //        	var cls = $img.attr('class'),
	 //        		align = cls.match(/f-align-(left|right|full|wide|original)(-470)*/g);

		//         if(align != null) {
		// 	        align[0] = align[0].replace('f-','img-');
		// 	        $('.fr-btn.fr-btn-image[data-cmd="' + align[0] + '"]').addClass('active');
		//         } else {
  //  		        	($img.width()<720) ? hideLargeImagebtn() : showLargeImagebtn();
		//         }
	 //        }
	 //    });

		// $('#fm-editor').on('froalaEditor.keydown', function (e, editor, keypressEvent) {
		// 	var sel;
		// 	if (window.getSelection) {
		// 		sel = window.getSelection();
		// 	}
		// 	if(keypressEvent.keyCode == 13) {
		// 		var defHeight = 300,
		// 			curPos = sel.anchorNode.offsetTop,
		// 			wHeight = $('#forum-modal').height(),
		// 			scTop = $('#forum-modal').scrollTop(),
		// 			cursor = defHeight + curPos,
		// 			scroll = wHeight + scTop;

		// 		if(cursor > scroll) {
		// 			$('#forum-modal').scrollTop(scTop + 40);
		// 		}
		// 	}
		// });
		// $('#fm-editor').on('froalaEditor.file.inserted', function (e, editor, $file, response) {
		// 	var href = $file.attr('href');
		// 	$file.replaceWith('<span class="edt-type-file fr-delete" contenteditable="false" data-href="' + href + '"><span class="fr-file">' + $file.text() + '</span></span>');
		// });
		
		// setPlaceholder($('#fm-editor'));
		// setForumWrap();
	}
	$doc.on('mousedown, mouseup','#forum-modal .fr-view[contenteditable="true"]',function(e) {
		frAbove = ($(window).height() < e.pageY+320) ? 'fr-above' : '';
		var range = document.createRange(),
			sel = window.getSelection();

		// if(sel.focusNode != null && sel.focusNode.parentElement.nodeName == 'A') {
		// 	getCursorPos($(sel.focusNode.parentElement));
		// }
		$('#fm-editor').froalaEditor('selection.save');
	});


	$(document).on('click','.tb-attach-file',function(e) {
		// $('#forum-attach').modal('show');
      	isReplace = false;
		upTYPE = 'image';
		$('#file_type').val(upTYPE);
		$('#uploadFile').val('');
		$('#uploadFile').trigger('click');
		// $('.modal-backdrop').last().removeClass('fade');
	});
	$(document).on('click','.tb-file-insert', function(e) {
		// $('#forum-attach').modal('show');
		upTYPE = 'file';
		$('#file_type').val(upTYPE);
		$('#uploadFile').val('');
		$('#uploadFile').trigger('click');
		// $('.modal-backdrop').last().removeClass('fade');
	});
	$(document).on('click','.tb-video-insert', function(e) {
		$('#fm-editor').froalaEditor('selection.save');
		var modal = $(this).showModalFlat('INSERT VIDEO',videoForm(),true,true,function() {
			$('.error').remove();
			var url = $('#video-url').val();
			if(!url) {
				$('#video-url').after('<label class="error">' +  $.lang[LANG]['config.link-to-go'] + '</label>').focus();
				return;
			}
			var video = insertVideo(url,'src'),
				frVideo = '<span class="fr-video fr-dvb fr-draggable" contenteditable="false" draggable="true">' +
						'<iframe width="720" height="405" src="' + video + '" frameborder="0" allowfullscreen="true"></iframe>' +
						'</span>';

			$('#fm-editor').froalaEditor('selection.restore');
			$('#fm-editor').froalaEditor('html.insert', frVideo , true);
			modal.modal('hide');

		},'cancel','','w480 video-modal');
		$('.flat-modal').css({
			'position' : 'absolute',
			'z-index' : '1051'
		});
		$('.flat-modal').next().css('z-index','1050');
	});

	$doc.on('click','#insert-forum-attach', function(e) {
		var file = $('#uploadFile').val();
		if(file=="") {
			alert('파일을 입력/선택하세요');
			$.processOFF();
			return false;
		}
		$('#forum-attach').modal('hide');
	});
	
	$doc.on('click','#fm-secret', function(e) {
		$target = $(this).find('.fa');
		if($target.hasClass('fa-square-o')) {
			$target.removeClass('fa-square-o').addClass('fa-check-square-o');
			$(this).attr('data-secret','S');

			$('#fm-notice').find('.fa').removeClass('fa-check-square-o').addClass('fa-square-o');
			$('#fm-notice').attr('data-notice','');
		} else {
			$target.removeClass('fa-check-square-o').addClass('fa-square-o');
			$(this).attr('data-secret','');
		}
	});

	$doc.on('click','#fm-notice', function(e) {
		$target = $(this).find('.fa');
		if($target.hasClass('fa-square-o')) {
			$target.removeClass('fa-square-o').addClass('fa-check-square-o');
			$(this).attr('data-notice','N');

			$('#fm-secret').find('.fa').removeClass('fa-check-square-o').addClass('fa-square-o');
			$('#fm-secret').attr('data-secret','');
		} else {
			$target.removeClass('fa-check-square-o').addClass('fa-square-o');
			$(this).attr('data-notice','');
		}
	});

	$doc.on('click','.tpl-forum-list-arrow', function(e) {
		$(this).closest('tr').find('.tpl-forum-list-title').click();
	});

	$doc.on('click','*[class*=tpl-forum-list-] a.deleted', function(e) {
		e.preventDefault();
		$(this).showModalFlat('INFORMATION', $.lang[LANG]['board.post.deleted'], true, false, '', 'close');
		return false;
	});

	$doc.on('click','.tpl-forum-list-title, .tpl-forum-list-cont, .tpl-forum-list-thumb, .tpl-forum-list-more', function(e) {
		e.preventDefault();
		if($(this).closest('#element-display').length > 0) return false;
		if($(this).closest('[data-loop="true"]').hasClass('sample-table')) return false;
		if($(this).closest('tr.active').length > 0 && $(this).closest('.element.page-bottomlist').length > 0) return false;
		
		var option = $(this).attr('data-option'),
			id = $(this).attr('data-id'),
			forum_el = $(this).closest('.element'),
			type = $(forum_el).attr('data-forum-type'),
			pid = $(forum_el).attr('data-id'),
			page_num = $(forum_el).find('.tpl-forum-page.active').attr('data-page-num'),
			stx = $(forum_el).find('#stx').val(),
			sfl = $(forum_el).find('#sfl').val(),
			scate = $(forum_el).find('#scate').val();

		if(type=='faq' && typeof MODE == "undefined") {
			e.preventDefault();
			$(this).closest('tr').addClass('this');
			$(this).closest('[data-loop="true"]').find('tr').each(function() {
				var checkClick = $(this).hasClass('this'),
					checkClose = (!checkClick && $(this).find('.toggle').hasClass('open')) ? true : false;

				if(checkClick || checkClose) {
					$(this).find('.toggle').toggleClass('open');
					$(this).next().toggle();
				}
			});

			$(this).closest('[data-loop="true"]').find('tr.this').removeClass('this');
		} else {
			if(option=="S") {
				e.preventDefault();
				$.post('/fm/access',{id:id, sid : F_SID}, function(data) {
					if(data.access == false) {
						if((data.sign == false && data.fmid == true) || (data.sign == true && data.fmid == true) || (data.sign == true && data.fmid == false)) {
							$(this).showModalFlat('INFORMATION', $.lang[LANG]['board.read-not-allowed'], true,false,'','ok');
						} else {
							$(this).showModalFlat('PASSWORD',passwdForm(),true,true,function() {
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
									$.post('/fm/password', { id: id, passwd : hex_md5($pass.val()) }, function(data) {
										if(typeof data.error != "undefined" && data.error) {
											$('.comment-addform.password').before("<label class='error'>" + data.error + "</label>");
											return false;
										}
										var date = new Date(),
											cookietime = 20 * 60 * 1000;
							            date.setTime(date.getTime() + cookietime);

										$.cookie('hash', data.hash, { path: '/' , expires: date});
										$('.modal[id*=flat-modal]').modal('hide');
										setForumCookie(pid,page_num,stx,sfl,scate);
										var url = forumUrl(),
											href = url + "/forum/view/" + id;

										if(typeof MODE == 'undefined') RENDER.history.pushState(null,property.TITLE,href);											
										else location.href = href;
									},'json');
								}								
							},'cancel');
						}
					} else {
						setForumCookie(pid,page_num,stx,sfl,scate);

						var url = forumUrl();
						var href = url + "/forum/view/" + id;
						if(typeof MODE == 'undefined') RENDER.history.pushState(null,property.TITLE,href);
						else location.href = href;
					}
				}, 'json');
			} else {
				setForumCookie(pid,page_num,stx,sfl,scate);

				var url = forumUrl();
				var href = url + "/forum/view/" + id;
				if(typeof MODE == 'undefined') RENDER.history.pushState(null,property.TITLE,href);
				else location.href = href;
			}
		}

	});

    $(document).on('paste','.note-editable',function(event) {
        event.preventDefault();
        if(window.clipboardData) {
            var text = window.clipboardData.getData('Text');
            if (window.getSelection) { // IE11
                window.getSelection().getRangeAt(0).insertNode(document.createTextNode(text));
            } else if (document.selection && document.selection.createRange) { // old IE
                text = text.replace(/\n/g, "<br />");
                document.selection.createRange().pasteHTML(text);
            }
        } else {
            var text = (event.originalEvent || event).clipboardData.getData('text/plain') || prompt('Paste something..');
            text = text.replace(/\n/g, "<br />");
            window.document.execCommand('insertHtml', false, text);
        }
    });

	$(document).on('mousedown mouseup keydown keyup','.fr-view',function(e) {
		selRange = saveSelection();
	});
	$(document).on('mousedown mouseup keydown keyup','.fr-dib',function(e) {
		scrollPos = $('#forum-modal').scrollTop();
		scrollPos2 = $('#forum-modal').scrollTop();
	});
	$(document).on('click','button[data-event="showLinkDialog"]', function(e) {
		restoreSelection(selRange);
	});

	$(document).on('click','.set-image', function(e) {
		var src = $(this).closest('.result-file').attr('data-file');
		$('.fr-view').focus();
		if(!$('.fr-view').is(':focus')) {
			// placeCaretAtEnd($('.fr-view').get(0));
		}

		if(upTYPE == 'image') $('#fm-editor').froalaEditor('image.insert', 'http:' + file, true);
		else $('#fm-editor').froalaEditor('file.insert', 'http:' + file, orig_name, { 'link' : 'http:' + file, 'target': '_blank' });
	});

	$(document).on('click','.file-delete', function(e){
		var select_file = $(this).parent().attr('data-file-name'),
			click_file = $(this).parent().attr('data-file'),
			user_file = $('.result-file').map(function() {
							return $(this).attr('data-file-name');
						}).get().join(",");
			$file = $(this).parent();

		var modal = $(this).showModalFlat('INFORMATION',$.lang[LANG]['board.ask-delete-attached-file'], true, true, function() {
			$.post('/fm/attach_delete',{ select_file : select_file, user_file : user_file }, function(data){
				$('.flat-modal').next().remove();
				$('.flat-modal').remove();
				$file.fadeOut().remove();
				$('img[src="' + click_file + '"]').fadeOut('fast',function() { $(this).remove(); });
			}, 'json');
		}, 'cancel');
	});

	$(document).on('focus','#fm-editor',function(e) {
		$(this).removeClass('content-empty');
		// placeCaretAtEnd($('.fr-view').get(0));
	}).on('focusout','#fm-editor', function(e) {
		setPlaceholder($(this));
	});

	var setPlaceholder = function($editor) {
		var empty = ($editor.find('.fr-view').html()=="<p><br></p>") ? true : false;
		(empty) ? $editor.addClass('content-empty') : $editor.removeClass('content-empty');
	}

	var updateForumPost = function(id,pid) {

		var idstr = (id) ? '/m/u/id/' + id : '';
		$.post('/fm/info', { id : id, sid : F_SID }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
				return false;
			}
			var post_data = data;
			if(data.fmid && data.sign == false) {
				userLogin();
				return false;
			}

			if(data.sign == false) {
				$(this).showModalFlat('PASSWORD',passwdForm(),true,true,function() {
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
						$.post('/fm/password',{ id: id, passwd : hex_md5($pass.val()) }, function(data) {
							if(typeof data.error != "undefined" && data.error) {
								//$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
								$('.comment-addform.password').before("<label class='error'>" + data.error + "</label>");
								return false;
							}
							var date = new Date(),
								cookietime = 20 * 60 * 1000;
				            date.setTime(date.getTime() + cookietime);

							$.cookie('hash', data.hash, { path: '/' , expires: date});
							$('.modal[id*=flat-modal]').modal('hide');
							setWriteUser(post_data, function() {
								location.href = '/post/t/' + PAGE_MODE + idstr + '/pid/' + pid;
								// forumWrite(id,pid);
							});
						},'json');
					}
				},'cancel');
			} else if(data.own == true) {				
				setWriteUser(data, function() {
					location.href = '/post/t/' + PAGE_MODE + idstr + '/pid/' + pid;
					// forumWrite(id,pid);
				});
			} else alert($.lang[LANG]['board.not-own-no-edit']);

		}, 'json');
	}

	var userLogin = function() {
		var id = $('#fm-id').val(),
			pid = $('#fm-pid').val(),
			info = $.lang[LANG]['re-login.info'];

		$.post('/fm/checkUser', { pid : pid }, function(data) {
			if(!data.user || typeof data.user == "undefined") {
				if(typeof data.error != "undefined" && data.error) {
					$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
					return false;
				}
				var modal = $(this).showModalFlat($.lang[LANG]['config.postforum'], info + signForm(id,pid,data.access,data.stoken),true,true,function() {
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

					if($key.val().length==0) {
						$key.after('<label class="error">' +  $.lang[LANG]['config.enter-captcha'] + '</label>').focus();
						isSubmit = false;
					}

					if($key.val() && (Base64.encode($key.val().trim()) != md5_norobot_key)) {
						$key.after('<label class="error">' +  $.lang[LANG]['config.wrong-captcha'] + '</label>').focus();
						isSubmit = false;
					}

					// var key = '';
					// if(isSubmit == true) {
					// 	key = checkCaptcha();
					// 	if(!key.success) {
					// 		$key.after('<label class="error">' +  $.lang[LANG]['config.wrong-captcha'] + '</label>').focus();
					// 		isSubmit = false;
					// 	}
					// }

					resetObject(user);
					if(isSubmit==true) {
						modal.modal('hide');
						user.name = data.name = $name.val();
						user.nameLength = nameLength;
						user.pass = hex_md5( $pass.val() );
						user.key = $key.val().trim();
						setWriteUser(data);
					}
				},'cancel','','w450',true,'',function() {
					// loadCaptcha();
					load_kcaptcha();
				});
				$('.flat-modal .modal-body').addClass('comment');
				$('.flat-modal .modal-footer').hide();
				$('.modal[id*=flat-modal]').css('z-index','1041');
				$('.flat-modal').next('.modal-backdrop').css('z-index','1040');
				if(!user.pass) $('.flat-modal .signType').last().hide();
				// $('#kcaptcha').click();
			} else {
				// resetObject(user);
				setWriteUser(data);
			}
		},'json');
	}

	var passwdForm = function() {
		return '' +
			'<div class="form-inline comment-addform password">' + 				
			  	'<div class="form-group">' +
			    	'<label class="sr-only" for="comm-pass">' +  $.lang[LANG]['config.modal.password'] + '</label>' +
			    	'<input type="password" class="form-control" id="comm-pass" placeholder="' +  $.lang[LANG]['config.modal.password'] + '">' +
			  	'</div>' +
			'</div>';
	}
	var videoForm = function() {
		return '' +
			'<div class="form-inline comment-addform video">' + 
			  	'<div class="form-group">' +
			  		'<p><b>Video URL?</b> (YouTube, Vimeo, SoundCloud, Metacafe or DailyMotion)</p>' + 
			    	'<label class="sr-only" for="label-video">' +  $.lang[LANG]['config.modal.password'] + '</label>' +
			    	'<input type="text" class="form-control" id="video-url" placeholder="http://">' +
			  	'</div>' +
			'</div>';
	}

	$(document).on('click','.tpl-forum-write',function(e) {
		var id = $(this).attr('data-id'),
			pid = $(this).attr('data-pid'),
			reply = $(this).attr('data-reply');
		
		id = (typeof id == "undefined") ? "" : id;
		reply = (typeof reply == "undefined") ? "" :reply;

		var idstr = (id) ? '/m/u/id/' + id : '',
			replystr = (reply) ? '/reply/' + reply : '';

		// location.href = '/post/t/' + F_MODE + idstr + '/pid/' + pid + replystr;
		if(id) {
			updateForumPost(id,pid);
			return false;
		}

		$.post('/fm/checkUser', { pid : pid, reply : reply, id : id }, function(data) {
			if(!data.user || typeof data.user == "undefined") {
				if(typeof data.error != "undefined" && data.error) {
					$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
					return false;
				}

				var modal_str = signForm(id,pid,data.access,data.stoken);
				if(typeof modal_str != "string") return false;
				var modal = $(this).showModalFlat($.lang[LANG]['config.postforum'],modal_str,true,true,function() {

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
					// if($('#recaptcha').attr('data-res')=='') {
					// 	$key.after('<label class="error">' +  $.lang[LANG]['config.enter-captcha'] + '</label>').focus();
					// 	isSubmit = false;
					// }

					if($key.val().length==0) {
						$key.after('<label class="error">' +  $.lang[LANG]['config.enter-captcha'] + '</label>').focus();
						isSubmit = false;
					}

					if($key.val() && (Base64.encode($key.val().trim()) != md5_norobot_key)) {
						$key.after('<label class="error">' +  $.lang[LANG]['config.wrong-captcha'] + '</label>').focus();
						// console.log('input value :' + $key.val());
						// console.log('hex_md5 : ' + Base64.encode($key.val().trim()));
						// console.log('key : ' + md5_norobot_key);
						isSubmit = false;
					}

					// var key = '';
					// if(isSubmit == true) {
					// 	key = checkCaptcha();
					// 	if(!key.success) {
					// 		$key.after('<label class="error">' +  $.lang[LANG]['config.wrong-captcha'] + '</label>').focus();
					// 		isSubmit = false;
					// 	}
					// }

					resetObject(user);
					if(isSubmit==true) {
						$('.modal[id*=flat-modal]').modal('hide');
						user.name = data.name = $name.val();
						user.nameLength = nameLength;
						user.pass = hex_md5( $pass.val() );
						user.key = $key.val().trim();
						setWriteUser(data,function() {
							location.href = '/post/t/' + PAGE_MODE + idstr + '/pid/' + pid + replystr;
							// forumWrite(id,pid,reply);
						});
					}
				},'cancel','','w450','','',function() {
					// loadCaptcha();
					load_kcaptcha();
				});
				$('.flat-modal .modal-body').addClass('comment');
				$('body').addClass('no-fixed');
				if($('.flat-modal .modal-body .comment-signForm').hasClass('default-mode') || $('.flat-modal .modal-body .comment-signForm').hasClass('sitemember-mode')) 
					$('.flat-modal .modal-footer').hide();
				// $('#kcaptcha').click();
			} else {
				// resetObject(user);

				setWriteUser(data, function() {
					location.href = '/post/t/' + PAGE_MODE + idstr + '/pid/' + pid + replystr;
					// forumWrite(id,pid,reply);
				});
			}
		},'json');
	});

	$(document).on('click','.tpl-forum-list',function(e) {
		// $.cookie('gallery','.' + F_PARENT.element, { path: '/' });
		$.cookie('forum-item',F_PARENT.pid, { path: '/' });
		if(PAGE_MODE != 'c') {
			var url = (PAGE_MODE=='s') ? "/" : "/render/",
				uri = (F_ONE) ? url + 'index#' + F_PARENT.page : url + F_PARENT.page;

			var hash = uri.split('#');
			if(hash.length>1) {
				RENDER.history.pushState(null,property.TITLE,hash[0]);
				history.pushState('', '', hash[0] + '#' + hash[1]);
			} else {
				RENDER.history.pushState(null,property.TITLE,uri);
			}
			// (F_ONE) ? location.replace(url + '#' + F_PARENT.page) : location.replace(url + F_PARENT.page);	
			// (F_ONE) ? location.replace('/' + url + '/index#') + F_PARENT.page : location.replace('/' + url + '/' + F_PARENT.page);	
		} else {
			(F_ONE) ? location.replace('/config/page/index#') + F_PARENT.page : location.replace('/config/page/' + F_PARENT.page);
		}
	});

	$(document).on('click','.tpl-forum-delete',function(e) {
		var id = $(this).attr('data-id');
		var modal = $(this).showModalFlat('POST DELETE', $.lang[LANG]['board.ask-permanent-delete'], true, true, function() {
			modal.modal('hide');
			$.forum.delete(id);
		},'cancel');
	});

	$(document).on('click','.tpl-forum-page', function(e) {
		e.preventDefault();
		if($(this).closest('.element').find('[data-loop="true"]').hasClass('sample-table')) return false;
		var id = $(this).attr('data-id'),
			page = $(this).attr('data-page'),
			page_num = $(this).attr('data-page-num'),
			view = $(this).attr('data-view'),
			forum_el = $(this).closest('.element'),
			sfl = $(forum_el).find('.search-box #sfl').val(),
			stx = $(forum_el).find('.search-box #stx').val(),
			scate = $(forum_el).find('.search-box #scate').val();

		setForumCookie(id,page_num,stx,sfl,scate);
		$.forum.init(id,page,view,page_num,sfl,stx,scate);
		activeEL('userEL'+id);
	});

	$(document).on('click','.forum-login',function(e) {

//***********************************************************************************************************************바꾸기 아래
		// live
			// isGabia = (F_SERVICE.indexOf('gabia') > -1) ? true : false,

		// gabia test
			// isGabia = (F_SERVICE.indexOf('gabia') == -1) ? true : false,

		var forumLoginModal = $(this).closest('.modal'),
			id = $(this).attr('data-id'),
			pid = $(this).attr('data-pid'),
			F_SERVICE = (typeof SERVICE == "undefined") ? property.SERVICE : SERVICE,
			F_VALIDTYPE = (typeof VALIDTYPE == "undefined") ? property.VALIDTYPE : VALIDTYPE,
			F_SITEUM = (typeof SITEUM == "undefined") ? property.SITEUM : SITEUM,
			isGabia = (F_SERVICE.indexOf('gabia') > -1) ? true : false,
			login_type = (isGabia || (F_VALIDTYPE=='BN' && F_SITEUM > 0)) ? 'um' : 'mb';

		$('.comment .error').remove();
		var $input_id = $('#'+login_type+'_forum_id'),
			$input_password = $('#'+login_type+'_forum_password'),
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
			var login_success_fnc = function() {
				$('button.close').click();
				if(RELOAD) {
					// $.cookie('gallery','.' + F_PARENT.element, { path: '/' });
					location.reload();
				}
				if(typeof MODE == "undefined") RENDER.setLoginout(property.LOGINOUT, property.SID, 1, property.PROFILEIMG);
				//forumWrite(id,pid);
			}

			if(login_type == 'mb') {
				$.post('/member/login/outlogin', { mb_id : $input_id.val(), mb_password : hex_md5($input_password.val()), sid : sid}, function(data) {
					if(typeof data.error != "undefined" && data.error) {
						$('.comment-signForm').after("<label class='error text-center'>" + data.error + "</label>");
						return false;
					}
					login_success_fnc();
				}, 'json');

			} else {

				var input_data = {
					'id' : $input_id.val(),
					'password' : hex_md5($input_password.val()),
				};

				$.post('/umember/login/in', { sid : sid, data : JSON.stringify(input_data) }, function(data) {
					if(typeof data.error != 'undefined' && data.error) {
						$.each(data.error, function(key,str) {
							if(forumLoginModal.find('#um_forum_'+key).length > 0 ) {
								forumLoginModal.find('#um_forum_'+key).after('<span class="error">' + str + '</span>');
							} else { 
								$('.comment-signForm').after("<label class='error text-center'>" + str + "</label>"); 
							}
						});
						if(forumLoginModal.find('.error').length > 0) return false;
					}

					// if(data.member.check_login) {
					// 	if(typeof data.ss_url != "undefined" && data.ss_url) {
					// 		$.get(data.ss_url, function(data) {
					// 			console.log(data);
					// 		});
					// 	}
					// }
					$.umember.init();
					login_success_fnc();

				},'json');

			}
		}
	});	

	$.forum = {
		init : function(id, page, view, page_num, sfl, stx, scate) {
			F_PARENT = (typeof PARENT == "undefined") ? property.PARENT : PARENT;
			F_ONE = (typeof ONE == "undefined") ? property.ONE : ONE;
			F_SID = (typeof SID == "undefined") ? property.SID : SID;
			F_PAGE = (typeof PAGE == "undefined") ? property.PAGE : PAGE;

			var page_num = (typeof page_num == "undefined" || page_num == "NaN") ? 1 : page_num,
				sfl = (typeof sfl == "undefined") ? 'all' : sfl, 
				stx = (typeof stx == "undefined") ? '' : stx,
				scate = (typeof scate == "undefined") ? '' : scate;

			if(page_num==1 && typeof $.cookie('forum_'+id) != "undefined") page_num = $.cookie('forum_'+id);
			if(!stx && typeof $.cookie('forum_'+id+'_stx') != "undefined") stx = $.cookie('forum_'+id+'_stx');
			if(sfl=='all' && typeof $.cookie('forum_'+id+'_sfl') != "undefined") sfl = $.cookie('forum_'+id+'_sfl');
			if(!scate && typeof $.cookie('forum_'+id+'_scate') != "undefined") scate = $.cookie('forum_'+id+'_scate');
			setForumCookie(id,page_num,stx,sfl,scate);
			
			fmID = id;
            $.ajax({
                url: '/fm/lists/pid/' + id + '/sid/' + F_SID + '/page/' + F_PAGE + '/view/' + view + '/page_num/' + page_num,
                dataType: 'json',
                type: 'POST',
                data: { sfl: sfl, stx: stx, scate: scate },
                async: false,
                cache: false,
                success: function (data) {
                	$.forum.update(id,page_num,view,F_PAGE,sfl,stx,scate,data);
                }
            });
		},
		update : function(id,page_num,view,page,sfl,stx,scate,data) {
        	var source = (typeof data.source == "undefined") ? "" : data.source;
        	var $source = $(htmlspecialchars_decode(source)),
        		$first = $source.find('[data-loop="true"]').children().eq(0).clone(),
        		loop = $first.prop('outerHTML'),
        		$bbs = $('.element[data-id="' + id + '"]');

        	var elsetting = (typeof data.elsettings != "undefined" && data.elsettings) ? $.parseJSON(data.elsettings) : {},
        		field_lang = (typeof elsetting.field_lang != "undefined") ? elsetting.field_lang : 'en',
        		field_disable = (typeof elsetting.field_disable != 'undefined' && !$.isEmptyObject(elsetting.field_disable)) ? elsetting.field_disable : [],
        		field_listSet = ($('.element[data-id="' + id + '"]').attr('data-type2') == 'thumb') ? ["num", "category", "title", "cont", "name", "date", "hit"] : ["num", "category", "title", "name", "date", "hit"],
        		forum_color = (typeof elsetting.forum_color != 'undefined') ? elsetting.forum_color : '';

        	var d = document.createElement('div');
        	$(d).html(loop);

			if(field_lang != 'en') {
				$source.find('thead tr th').each(function() {
					var field_text = (typeof $(this).attr('class') != 'undefined') ? $(this).attr('class') : 'tpl-forum-title';
					if(field_text.indexOf('title') > -1 || field_text.indexOf('content') > -1) $(this).text($.lang[field_lang.toLowerCase()]['forum.field.tpl-forum-title']);
					else $(this).text($.lang[field_lang.toLowerCase()]['forum.field.' + field_text]);
				});
				$source.find('.tpl-forum-write').text($.lang[field_lang.toLowerCase()]['forum.field.tpl-forum-write']);
			}
			
			$.each(field_listSet, function(i,v) {
				if($.inArray(v,field_disable) > -1) {
					if(v == 'category') $source.find('#scate').addClass('hidden');
					$source.find('.tpl-forum-'+v).each(function() {  $(this).addClass('hidden'); });
					$(d).find('.tpl-forum-list-'+v).each(function() { $(this).addClass('hidden'); });

				} else {
					if(v == 'category') $source.find('#scate').removeClass('hidden');
					$source.find('.tpl-forum-'+v).each(function() { $(this).removeAttr('style'); $(this).removeClass('hidden'); });
					$(d).find('.tpl-forum-list-'+v).each(function() { $(this).removeAttr('style'); $(this).removeClass('hidden'); });
				}
			});

    		loop = $(d).html();
    		$(d).remove();

        	$bbs.html($source.html());
        	var	$row = $bbs.find('[data-loop="true"]'),
        		$pagination = $bbs.find('.tpl-forum-pagination'),
        		$write = $bbs.find('.tpl-forum-write').attr('data-pid',id),
        		css_id = $bbs.attr('data-el');

        	// $.removeCookie('forum-'+id, {path:'/'});
        	var type = (typeof $source.attr('data-forum-type') == "undefined" || !$source.attr('data-forum-type')) ? "" : $source.attr('data-forum-type');

        	if(forum_color) { $bbs.attr('data-fcolor',forum_color); }
        	if(type) $bbs.attr('data-forum-type',type);
        	else {
        		type == "";
        		$bbs.removeAttr('data-forum-type');
        	}

        	if($bbs.find('#scate').length > 0 && $bbs.find('#scate').css('display') !== 'none') $.forum.drawSelboxCategory($bbs,id);

        	var data_el = $bbs.attr('data-el');
        	
        	$('#' + data_el + 'css').text(data.css);

        	if(typeof data.css != 'undefined' && data.css) {
        		$bbs.removeClass('hidden');
        		$('#' + data_el + 'css').text(data.css);
        	} else {
        		if(typeof data.msg == 'undefined') $bbs.addClass('hidden');
        	}

        	$bbs.find('.search-box #sfl').val(sfl);
        	$bbs.find('.search-box #stx').val(stx);
        	$bbs.find('.search-box #sfl option').map( function() {
        		var sfl = $(this).attr('value');
        		$(this).text($.lang[LANG]['board.sfl.'+sfl]);
        	});


        	if(!stx || stx.length==0) {
	        	$bbs.find('.search-box #sfl').val($('.search-box #sfl').children().first().attr('value'));
	        }

        	$bbs.find('.search-box #scate').val(scate);
        	if(!scate || scate.length==0) {
	        	$bbs.find('.search-box #scate').val('');
	        }

        	setForumCookie(id,page_num,stx,sfl,scate);
        	if(typeof MODE == "undefined" && type=="faq") $bbs.find('.tpl-forum-write').remove();

        	if(data.total == 0) {
        		if(data.msg) {
        			RELOAD = true;
        			if(data.sign == false) $bbs.find('.tpl-forum-write').text('login');
        		}
        		var msg = (data.msg) ? data.msg : $.lang[LANG]['board.no-posts'];

        		if(data.demo==false && typeof MODE == "undefined" || typeof $.cookie('forum_'+id+'_stx') != "undefined" || typeof $.cookie('forum_'+id+'_scate') != "undefined" ) {
               		var checkTableLayout = ($row.find('tr').length > 0) ? true  : false;
               		
               		$row.html('');
               		if(checkTableLayout) $row.append("<tr><td colspan='10' class='text-center'>" + msg + "</td></tr>");
               		else $row.append("<div class='text-center'>" + msg + "</div>");
            		$pagination.empty();
            		$pagination.attr({'data-page':page, 'data-view':view});
        		} else {
					$bbs.find('[data-loop="true"]').addClass('sample-table');
					$.each(field_disable, function(i,v) {
						if(v == 'category') $bbs.find('#scate').addClass('hidden');
						$bbs.find('[data-loop="true"] .tpl-forum-'+v).addClass('hidden');
						$bbs.find('[data-loop="true"] .tpl-forum-list-'+v).addClass('hidden');
					});
        		}
        	} else {
				$bbs.find('[data-loop="true"]').removeClass('sample-table');
           		$row.html('');
				if(data.total<=((view*page_num)-view)) {
					page_num = page_num-1;
					if(page_num==0) page_num=1;
				}

				var isMasonry = ($bbs.attr('data-msny') == 'true') ? true : false,
					forum_item = '';
        		$.each(data.list, function(i,v) {
        			var num = data.total - (view * (page_num-1)) - i;
        			if(isMasonry) {
        				forum_item = forum_item + forumRow(v, num, page_num, id, loop, data.config, type);
        			} else {
	        			$row.append(forumRow(v, num, page_num, id, loop, data.config, type));
        			}

        		});

        		if(isMasonry) {
					var $forum_items = $(forum_item);
					$forum_items.hide();

					var process_index = 0, items = data.list.length;
					$forum_items.imagesLoaded().progress(function(imgload, image) {
						process_index++;
						var $item = $(image.img).parents('.grid');
						$item.show();
						if(items == process_index) {
							reloadMasonry($row,$forum_items);
						}
					});

        		}

        		if(stx.length > 0 && $row.find('.tpl-forum-list-title a:contains("' + stx + '")').length > 0) {
        			$row.find('.tpl-forum-list-title a:contains("' + stx + '")').each(function() {
        				var title_txt = $(this).text(),
        					regex = new RegExp(stx,'gi'),
        					new_title_txt = title_txt.replace(regex,  '<strong class="search-txt">' + stx + '</strong>');

        				$(this).html(new_title_txt);

        			});
    			}

    			setPagination($pagination,data.total,view,page_num,id,page);

				if(data.total <= view) $pagination.addClass('hidden');
				else $pagination.removeClass('hidden');
        	}

        	if(!sfl) $bbs.find('.search-box select').children().first().attr('selected','selected');
			if(typeof elsetting.searchbox_display != 'undefined') {
				if(elsetting.searchbox_display == "ON") {
					$bbs.find('.search-box').removeClass('hidden');
				} else {
					$bbs.find('.search-box').addClass('hidden');
				}
			}


        	if(typeof MODE == "undefined") $bbs.find('.tpl-forum-write[data-disabled="true"]').remove();

        	$bbs.removeClass('preloading');
		},
		view : function(id) {
		    var deferred = $.Deferred();
			F_PARENT = (typeof PARENT == "undefined") ? property.PARENT : PARENT;
			F_ONE = (typeof ONE == "undefined") ? property.ONE : ONE;
			F_SID = (typeof SID == "undefined") ? property.SID : SID;
			F_PAGE = (typeof PAGE == "undefined") ? property.PAGE : PAGE;
			F_VIEW = id;

			forumView(id);
			setForumWrap();
			deferred.resolve();
		    return deferred.promise();
		},
		delete : function(id) {
			$.post('/fm/info', { id : id, sid : F_SID }, function(data) {
				if(typeof data.error != "undefined" && data.error) {
					$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
					return false;
				}
				if(data.fmid && data.sign == false) {
					userLogin();
					return false;
				}

				if(data.sign == false) {
					var passwordModal = $(this).showModalFlat('PASSWORD',passwdForm(),true,true,function() {
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
							$.post('/fm/password',{ id: id, passwd : hex_md5($pass.val()) }, function(data) {
								if(typeof data.error != "undefined" && data.error) {
									$('.comment-addform.password').before("<label class='error'>" + data.error + "</label>");
									return false;
								}
								var date = new Date(),
									cookietime = 20 * 60 * 1000;
					            date.setTime(date.getTime() + cookietime);

								$.cookie('hash', data.hash, { path: '/' , expires: date});
								$('.modal[id*=flat-modal]').modal('hide');
								resetObject(user);
								user.pass = hex_md5($pass.val());
								deleteForumPost(id);
							},'json');
							passwordModal.modal('hide');
						}
					}, 'cancel');
				} else if(data.own == true || data.mgr == true) {
					deleteForumPost(id);
				} else {
					 alert( $.lang[LANG]['board.not-own-no-delete'] );
				}
			}, 'json');
		},
		panelconfig : function(id) {
			var str = '';
			$.post('/fm/config', { id: id }, function(data) {
				if(typeof data.error != "undefined" && data.error) {
					$(this).showModalFlat('ERROR',data.error,true,false,'','ok'); 
					return false;
				}
				if(data.config.fmholder) {
					data.config.fmholder = (data.config.fmholder).replace(/[<]br [/][>]/gi, '\n');
				}
				
				str = panelConfigForum(data.config,id,data.group);

			}, 'json');
			return str;
		},
		groupconfig : function(id) {
			$('.config-modal').remove();
			$.post('/fm/config', { id : id }, function(data) {
				if(typeof data.error != "undefined" && data.error) {
					$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
					return false;
				}
				var modal = $(this).showModalFlat($.lang[LANG]['board.manage-groups'],groupConfigForum(data.config,id,data.group),true,false,'','','','w575 gc-modal').attr({'data-fid':id, 'id':''}).closest('.flat-modal').removeAttr('class').addClass('flat-gc-modal'); 
			},'json');
		},
		getgroupdata : function(id) {
			$.post('/fm/config', { id : id }, function(data) {
				if(typeof data.error != "undefined" && data.error) {
					return false;
				}
				str = '', groups = data.group;
				for(var i=0; i<groups.length; i++) {
					str = str + getGroupList(groups[i].id, groups[i].name, groups[i].member_count);
				}
				$('#group-accordion').html(str);
			},'json');
		},
		getGroupNameList : function(fid) {
			var str = "";
			$.post('/fm/config', { id : fid }, function(data) {
				if(typeof data.error != "undefined" && data.error) {
					return false;
				}				
				groups = data.group;
				for(var i=0; i<groups.length; i++) {
					str = str + "<option value='"+groups[i].name+"' data-id='" + groups[i].id +"' data-member-count='" + groups[i].member_count + "'>"+groups[i].name+"</option>"
				}
			}, 'json');
			return str;
		},
		setfile : function (file,file_name,orig_name) {
			var $file = $('<div class="result-file" data-file="' + file + '" data-file-name="' + file_name + '">'),
				$result = $('<span><i class="fa fa-paperclip"></i></span> <span class="set-image hand"><i class="fa fa-arrow-circle-up"></i></span> <span>'+ orig_name + '</span>');
				$del = $('<span class="file-delete hand"><i class="fa fa-times"></i></span>');

			$file.append($result).append($del);
			$file.appendTo('.upload-files');
			
			$('#fm-editor').froalaEditor('selection.restore');

			if(upTYPE == 'image') {
				if(isReplace == true) editorImageReplace('http:' + file);
				else $('#fm-editor').froalaEditor('image.insert', 'http:' + file, true);
			} else $('#fm-editor').froalaEditor('file.insert', 'http:' + file, orig_name, { 'link' : 'http:' + file, 'target': '_blank' });
		},
		drawSelboxCategory : function(sel_replace,pid) {
			var str = '';
			F_SID = (typeof SID == "undefined") ? property.SID : SID;

			$.post('/fm/category/list', { pid: pid, sid: F_SID }, function(list_data) {
				if(typeof list_data.error != "undefined" && list_data.error) {
					$(this).showModalFlat('ERROR',list_data.error,true,false,'','ok');
					return false;
				}

				str = "\
						<select id='scate' class='form-control' name='scate' placeholder='" + $.lang[LANG]['board.scate'] +"'>\
							<option value=''>" + $.lang[LANG]['board.scate'] +"</option>\
					";
				$.each(list_data, function(i,v) {
					var scate = '';
					var check_cate = (scate == v['seq']) ? 'selected' : '';
					str = str + "\
							<option value='" + v['seq'] +"' " + check_cate + ">" + v['fca_name'] + "</option>\
					";
					if(list_data.length == (i+1)) {
						str = str +  "\
			                </select>\
						";

						$(sel_replace).find('#scate').replaceWith(str);
					}
				});

				if(list_data.length == 0) {
					str = str +  "\
					</select>\
					";
					$(sel_replace).find('#scate').replaceWith(str);
				}
				
			}, 'json');
		},

	};


	var reloadMasonry = function(container,items) {
		container.masonry().append(items);
		container.masonry('appended',items).masonry();
		if(container.closest('.container').length > 0) container.closest('.container').removeAttr('style').css('position','relative');
		if(container.hasClass('container')) container.removeAttr('style').css('position','relative');
	}

	var getConfigChecked = function (value,select,valstr) {
		valstr = (typeof valstr == "undefined") ? 'selected' : valstr;
		var check = [];
		$.each(select, function(i,v) {
			check.push((value.toUpperCase()==v) ? valstr : "");
		});
		return check;
	}




	var panelConfigForum = function (config,id,group) {
		config = setDefaultConfig(config);

		var forum_type = $('.element[data-id="' + id + '"]').attr('data-type2');
		var field_config = (forum_type == 'thumb') ? {
			'tpl-forum-list-num' : '',
			'tpl-forum-list-category' : '',
			'tpl-forum-list-title' : 'ON',
			'tpl-forum-list-cont' : '',
			'tpl-forum-list-name' : '',
			'tpl-forum-list-date' : '', 
			'tpl-forum-list-hit' : '',
		} : {
			'tpl-forum-list-num' : '',
			'tpl-forum-list-category' : '',
			'tpl-forum-list-title' : 'ON',
			'tpl-forum-list-name' : '',
			'tpl-forum-list-date' : '', 
			'tpl-forum-list-hit' : '',
		}, forum_colorSet = ["black", "white"],
		   forum_color = (typeof $('.element[data-id="'+id +'"]').attr('data-fcolor') == "string") ? $('.element[data-id="'+id +'"]').attr('data-fcolor') : "-1";

		$.each(field_config, function(k,v) {
			var type = k.replace(/tpl-forum-list-/gi,''),
				el_field = $('.element[data-id="'+id+'"]').find('.'+k).first();

			if(el_field.length > 0) field_config[k] = (el_field.hasClass('hidden') || $.inArray(type,config.field_disable)>-1 ) ? 'OFF' : 'ON';
        });

        if(forum_color != "-1" && typeof config.forum_color != 'undefined') forum_color = config.forum_color; //block setting value > block html tag value
        if(typeof config.date == "undefined") config.date = "DEF";
		$.each(forum_colorSet, function(i, v) {
			forum_colorSet[i] = (v == forum_color) ? 'active' : '';	
		});
		
		var tpUser = ["ADM","A","M","NM","G"],
			tpOnoff = ["ON","OFF"],
			tpSecret = ["N","U","A"],
			tpFieldLang = ["EN","KO"],
			tpDate = ["DEF","DATE","DATE2"],
			group_member = 0,
			groups = group,
			select_group = config.group,
			select_group_str = '';

		var isFAQblock = false,
			block_disabled = '';
			tooltip_str = new Array();
		if($('.userEL'+id).attr('data-forum-type') == 'faq') {
			isFAQblock = true;
			block_disabled = 'disabled';
			config.write_level = "ADM";
			config.reply_level = "ADM";
			tooltip_str['faq_write'] = "data-toggle='tooltip' data-placement='left' data-html='true' data-original-title='" + $.lang[LANG]['forum.faq.chmod.write-disabled'] + "'";
			tooltip_str['faq_reply'] = "data-toggle='tooltip' data-placement='left' data-html='true' data-original-title='" + $.lang[LANG]['forum.faq.chmod.reply-disabled'] + "'";
		}

		var isSearchBox = ($('.element[data-id="' + id + '"]').find('.search-box').length > 0) ? true : false;

		var preference = { group : "", write : [], view : [], reply : [], list : [], modify : config.modify, delete : config.delete, row : config.page_row, secret : [], sns : [], comment : [], bottomlist : [], fieldlang : [], searchbox : []}
		preference.write 	= getConfigChecked(config.write_level,tpUser);
		preference.view 	= getConfigChecked(config.view_level,tpUser);
		preference.reply 	= getConfigChecked(config.reply_level,tpUser);
		preference.list 	= getConfigChecked(config.list_level,tpUser);
		// preference.secret 	= getConfigChecked(config.secret_display,tpSecret,'checked');
		preference.secret 	= getConfigChecked(config.secret_display,tpSecret);
		preference.comment 	= getConfigChecked(config.comment_display,tpOnoff,'checked'); 
		preference.sns 		= getConfigChecked(config.sns_share_display,tpOnoff,'checked');
		preference.bottomlist 	= getConfigChecked(config.bottomlist_display,tpOnoff,'checked'); 
		preference.fieldlang 	= getConfigChecked(config.field_lang,tpFieldLang); 
		preference.searchbox 	= getConfigChecked(config.searchbox_display,tpOnoff,'checked'); 
		preference.date = getConfigChecked(config.date,tpDate); 


		var prev_version = (typeof $('.element[data-id="' + id + '"]').attr('data-fcolor') == 'undefined') ? true : false,
			field_lang_str = '',
			field_str = '',
			fbtn_str = '',
			fcolor_str = '',
			str = '';
		
		if(!prev_version) {
			var forum_config_str = ($('.element[data-id="' + id + '"]').attr('data-type2') == 'faq') ? $.lang[LANG]['forum.lang-cate-color.title.faq'] : $.lang[LANG]['forum.lang-cate-color.title'];
			str = "\
				<div class='panel panel-default'>\
					<div class='panel-heading'>\
						<h4 class='panel-title'>\
                            <a class='accordion-toggle collapsed display-block' data-toggle='collapse' data-parent='#prop-accordion' href='#prop-forum-config'>" + forum_config_str + "</a>\
                        </h4>\
                    </div>\
                    <div id='prop-forum-config' class='panel-collapse collapse'>\
                        <div class='panel-body'>\
            ";


            //항목 언어 (field_lang_str)
			// if($('.element[data-id="' + id + '"]').find('thead tr th').length > 0) {
				field_lang_str = "\
							<p>\
								<label class='sm'>" + $.lang[LANG]['forum.lang.title'] + "</label>\
									<span class='property-form-wrap'>\
										<select id='forum-config-fieldlang' class='form-control property-form' data-id='" + id + "' data-mode='fieldlang'>\
											<option value='EN' " + preference.fieldlang[0] + ">" + $.lang[LANG]['editor.languages-en'] + "</option>\
											<option value='KO' " + preference.fieldlang[1] + ">" + $.lang[LANG]['editor.languages-ko'] + "</option>\
										</select>\
									</span>\
								</label>\
							</p>\
					";
			// }

			//항목 (field_str)
			var config_field_type = ['normal', 'thumb'];
			if($.inArray($('.element[data-id="' + id + '"]').attr('data-type2'), config_field_type) > -1) {

				field_str = "\
							<p class='clearfix'>\
								<label class='sm'>" + $.lang[LANG]['forum.cate.title'] + "</label>\
								<span class='field-box'>\
				";

				$.each(field_config, function(k,v) {
					var limited_field = ['title'],
						type = k.replace(/tpl-forum-list-/,'');

					if(v) {
						var field_display = (v == 'ON') ? 'checked' : '',
							limited_check = ($.inArray(type,limited_field)>-1) ? false : true,
							checkbox = (limited_check) ? "<input type='checkbox' class='forum-config-field' data-id='"+id+"' data-type='"+type+"' " + field_display + "/>" : "<img src='//storage.googleapis.com/i.addblock.net/icon/fm_category_check.jpg' />",
							btn = "";

						if(type == 'category') {
							btn = "<span id='btn-config-forum-category' class='hand "+field_display +"' data-type='forum' data-id='" + id + "'><i class='fa fa-pencil'></i></span>";
						}

						field_str = field_str + "\
									<span class='field-wrap' data-field-type='" + type + "'>\
										<span class='field_name'>" + $.lang[LANG]['forum.field.config.'+type] + "</span>\
										" + checkbox + "\
										" + btn + "\
									</span>\
						";
					} 
				});

				field_str = field_str + "\
								</span>\
							</p>\
							";
			}

			//button (fbtn_str)
			if(forum_type != 'faq') {
				var fbtn = $('.element[data-id="' + id + '"]').find('.tpl-forum-write').attr('data-disabled'),
					check_fbtn = (typeof fbtn != "undefined" && fbtn=='true') ? '' : 'checked';

				fbtn_str = "\
							<p>\
								<label class='sm'>" + $.lang[LANG]['forum.button.title'] + " \
									<span class='tooltip-wrap'><i class='fa fa-info-circle' data-toggle='tooltip' data-placement='top' data-html='true' data-original-title='" + $.lang[LANG]['forum.button.info'] + "'></i></span>\
								</label>\
								<span class='fbtn-box'>\
									<label class='switch prop-wrap etc'>\
										<input type='checkbox' class='switch-input' id='forum-config-fbtn' data-id='" + id + "' data-mode='fbtn' " + check_fbtn + "/>\
										<span class='switch-label' data-on='ON' data-off='OFF'></span>\
										<span class='switch-handle'></span>\
									</label>\
								</span>\
							</p>\
				";
			}

			//컬러셋 (fcolor_str)
			if(forum_color != "-1") {
				fcolor_str ="\
							<p>\
								<label class='sm'>" + $.lang[LANG]['forum.color.title'] + "</label>\
								<span class='fcolor-box'>\
									<span class='btn-group btn-group-sm'>\
										<span  class='btn-color-mode " + forum_colorSet[0] + "'>\
											<button type='button' class='ctrl-field-color' data-type='black' data-id='"+ id +"'></button>\
										</span>\
										<span  class='btn-color-mode " + forum_colorSet[1] + "'>\
											<button type='button' class='ctrl-field-color' data-type='white' data-id='"+ id +"'></button>\
										</span>\
									</span>\
								</span>\
							</p>\
				";
			}

			str = str + "\
					" + field_lang_str + "\
					" + field_str + "\
					" + fbtn_str + "\
					" + fcolor_str + "\
						</div>\
					</div>\
				</div>\
			";
		}



//***********************************************************************************************************************바꾸기 아래
		// live
		// var isGabia = (SERVICE.indexOf('gabia') > -1) ? true : false,

		// gabia test
		// var isGabia = (SERVICE.indexOf('gabia') == -1) ? true : false,

		var isGabia = (SERVICE.indexOf('gabia') > -1) ? true : false,
			checkFree = (typeof VALIDPLAN != "undefined" && VALIDPLAN) ? false : true,
			checkBN = (!checkFree && typeof VALIDTYPE != "undefined" && VALIDTYPE == "BN") ? true : false,
			checkUM = (typeof SITEUM != "undefined") ? SITEUM : -1,
			checkBNnUM = (checkBN && checkUM > 0) ? true : false;


		var faq_write_tooltip = (!isFAQblock) ? "" : "\
							<span class='fm-tooltip'><i class='fa fa-question-circle' " + tooltip_str['faq_write'] + "></i></span>\
		",	faq_reply_tooltip = (!isFAQblock) ? "" : "\
							<span class='fm-tooltip'><i class='fa fa-question-circle' " + tooltip_str['faq_reply'] + "></i></span>\
		";
		
		str = str + "\
				<div class='panel panel-default'>\
					<div class='panel-heading'>\
						<h4 class='panel-title'>\
							<a class='accordion-toggle collapsed display-block' data-toggle='collapse' data-parent='#prop-accordion' href='#prop-forum-chmod'>" + $.lang[LANG]['config.forum.group.chmod'] + "</a>\
						</h4>\
					</div>\
					<div id='prop-forum-chmod' class='panel-collapse collapse'>\
						<div class='panel-body'>\
							<p>\
								<label class='sm'>" + $.lang[LANG]['board.group'] + "</label>\
								<span class='property-form-wrap'>\
		";

		if(isGabia && !checkBNnUM) {
			str = str + "\
									<span id='forum-settings-select' class='form-control property-form' data-id='NULL' data-mode='group'>\
										<span>" + groups[0].name + "</span>\
									</span>\
			";
		} else {

			str = str + "\
									<select id='forum-settings-select' class='form-control property-form' data-id='" + id + "' data-mode='group'>\
			";
			for(var i=0; i<groups.length; i++) {
				if(select_group == groups[i].id) {
					selected = 'selected';
					group_member = groups[i].member_count;
					select_group_str = ' - ' + groups[i].name;
				} else {
					selected = '';
				}
				str = str + "				<option value='" + groups[i].name + "' data-id='" + groups[i].id + "' " + selected + " data-member-count='" + groups[i].member_count + "'>" + groups[i].name + "</option>";
			}

			str = str + "\
									</select>\
								</span>\
								<span id='btn-config-group' class='btn btn-default btn-sm' data-type='forum' data-id='" + id + "'><i class='fa fa-cog'></i></span>\
							</p>\
			";
		}

		var chmod = { "write":"", "view":"", "reply":"", "list":"" },
			chmod_val = ['ADM','A','M','NM','G'],
			chmod_val_name = {
				"ADM": $.lang[LANG]['board.access-only-admin'], 
				"A": $.lang[LANG]['board.access-all-label'], 
				"M": (isGabia || (!isGabia && checkBNnUM) ) ? $.lang[LANG]['board.access-members-label'] : $.lang[LANG]['board.access-members-cr-label'],
				"NM": $.lang[LANG]['board.access-nonmembers-label'], 
				"G": $.lang[LANG]['board.access-group-label'] + select_group_str,
			},
			option_str = { "write":"", "view":"", "reply":"", "list":"" },
			check_disabled = ((isGabia && !checkBNnUM) || (!isGabia && checkFree)) ? true : false,
			disabled_obj = new Array();

		if(check_disabled) {
			disabled_obj = (isGabia) ? {
				"write" : ["A", "M", "G"],
				"reply" : ["A", "M", "G"],
				"view" : ["M","G"],
				"list" : ["M","G"],
			} : {
				"write" : [ "NM" ], 
				"reply" : [ "NM" ]
			};
		}

		$.each(chmod, function(k,v) {
			if(typeof disabled_obj[k] != "undefined") {
				$.each(disabled_obj[k], function(d_i,d_mode) {
					if(preference[k][chmod_val.indexOf(d_mode)].length > 0) {

						var default_i = (k == "write" || k == "reply") ? 3 : 1;
						if(!isGabia && default_i == 3 && checkFree) default_i = 2; 

						preference[k][default_i] = preference[k][chmod_val.indexOf(d_mode)];
						preference[k][chmod_val.indexOf(d_mode)] = '';
					}
				});
			}
		});


		$.each(chmod, function(k,v) {
			var obj = { "ADM":"", "A":"", "M":"", "NM":"", "G":"" };

			for(var idx=0; idx < 5; idx++) {
				
				var mode = chmod_val[idx],
					mode_str = (check_disabled && (typeof disabled_obj[k] != "undefined" && $.inArray(mode,disabled_obj[k]) > -1)) ? "NULL" : mode;

				obj[mode] = "<option value='" + mode_str + "' " + preference[k][idx] + ">" + chmod_val_name[mode] + "</option>";
				
				if(idx == 4) option_str[k] = obj;
			}
		});



		str = str + "\
							<p>\
								<label class='sm'>" + $.lang[LANG]['board.access-write-label'] + "</label>\
								<span class='property-form-wrap'>\
									<select id='forum-config-write' class='form-control property-form' data-id='" + id + "' data-mode='write' " + block_disabled + ">\
										" + option_str["write"]["ADM"]  + "\
										" + option_str["write"]["A"]  + "\
										" + option_str["write"]["M"]  + "\
										" + option_str["write"]["NM"]  + "\
										" + option_str["write"]["G"]  + "\
									</select>\
								</span>\
								" + faq_write_tooltip + "\
							</p>\
							<p>\
								<label class='sm'>" + $.lang[LANG]['board.access-read-label'] + "</label>\
								<span class='property-form-wrap'>\
									<select id='forum-config-view' class='form-control property-form' data-id='" + id + "' data-mode='view'>\
										" + option_str["view"]["ADM"]  + "\
										" + option_str["view"]["A"]  + "\
										" + option_str["view"]["M"]  + "\
										" + option_str["view"]["G"]  + "\
									</select>\
								</span>\
							</p>\
							<p>\
								<label class='sm'>" + $.lang[LANG]['board.access-reply-label'] + "</label>\
								<span class='property-form-wrap'>\
									<select id='forum-config-reply' class='form-control property-form' data-id='" + id + "' data-mode='reply' " + block_disabled + ">\
										" + option_str["reply"]["ADM"]  + "\
										" + option_str["reply"]["A"]  + "\
										" + option_str["reply"]["M"]  + "\
										" + option_str["reply"]["NM"]  + "\
										" + option_str["reply"]["G"]  + "\
									</select>\
								</span>\
								" + faq_reply_tooltip + "\
							</p>\
							<p>\
								<label class='sm'>" + $.lang[LANG]['board.access-posts-list-label'] + "</label>\
								<span class='property-form-wrap'>\
									<select id='forum-config-list' class='form-control property-form' data-id='" + id + "' data-mode='list'>\
										" + option_str["list"]["ADM"]  + "\
										" + option_str["list"]["A"]  + "\
										" + option_str["list"]["M"]  + "\
										" + option_str["list"]["G"]  + "\
									</select>\
								</span>\
							</p>\
						</div>\
					</div>\
				</div>\
		";


		str = str + "\
				<div class='panel panel-default'>\
					<div class='panel-heading'>\
						<h4 class='panel-title'>\
							<a class='accordion-toggle collapsed display-block' data-toggle='collapse' data-parent='#prop-accordion' href='#prop-forum-etcmod'>" + $.lang[LANG]['config.forum.group.etcmod'] + "</a>\
						</h4>\
					</div>\
					<div id='prop-forum-etcmod' class='panel-collapse collapse'>\
						<div class='panel-body'>\
							<p>\
								<label class='sm'>" + $.lang[LANG]['board.private-post'] + "</label>\
								<span class='property-form-wrap'>\
									<select id='forum-config-private' class='form-control property-form' data-id='" + id + "' data-mode='secret'>\
										<option value='N' " + preference.secret[0] + ">" + $.lang[LANG]['board.not-use'] + "</option>\
										<option value='U' " + preference.secret[1] + ">" + $.lang[LANG]['board.use'] + "</option>\
										<option value='A' " + preference.secret[2] + ">" + $.lang[LANG]['board.always-use'] + "</option>\
									</select>\
								</span>\
							</p>\
							<p>\
								<label class='sm'>" + $.lang[LANG]['board.comments'] + "</label>\
								<span >\
									<label class='switch prop-wrap'>\
										<input type='checkbox' class='switch-input' id='forum-config-comment' data-id='" + id + "' data-mode='comment' " + preference.comment[0] + "/>\
										<span class='switch-label' data-on='On' data-off='Off'></span>\
										<span class='switch-handle'></span>\
									</label>\
								</span>\
							</p>\
							<p>\
								<label class='sm'>" + $.lang[LANG]['config.sns-share-display'] + "</label>\
								<span >\
									<label class='switch prop-wrap'>\
										<input type='checkbox' class='switch-input' id='forum-config-sns' data-id='" + id + "' data-mode='sns' " + preference.sns[0] + "/>\
										<span class='switch-label' data-on='On' data-off='Off'></span>\
										<span class='switch-handle'></span>\
									</label>\
								</span>\
							</p>\
							<p>\
								<label class='sm'> " + $.lang[LANG]['config.bottomlist'] + " </label>\
								<span>\
									<label class='switch prop-wrap'>\
										<input type='checkbox' class='switch-input' id='forum-config-bottomlist' data-id='" + id + "' data-mode='bottomlist' " + preference.bottomlist[0] + "/>\
										<span class='switch-label' data-on='On' data-off='Off'></span>\
										<span class='switch-handle'></span>\
									</label>\
								</span>\
							</p>\
		";
		if(isSearchBox) {
		str = str + "\
							<p>\
								<label class='sm'> " + $.lang[LANG]['config.searchbox'] + " </label>\
								<span>\
									<label class='switch prop-wrap'>\
										<input type='checkbox' class='switch-input' id='forum-config-searchbox' data-id='" + id + "' data-mode='searchbox' " + preference.searchbox[0] + "/>\
										<span class='switch-label' data-on='On' data-off='Off'></span>\
										<span class='switch-handle'></span>\
									</label>\
								</span>\
							</p>\
		";
		}
		str = str + "\
							<p>\
								<label class='sm'> " + $.lang[LANG]['config.date.option'] + " </label>\
								<span class='property-form-wrap'>\
									<select id='forum-config-date' class='form-control property-form' data-id='" + id + "' data-mode='date'>\
										<option value='DEF' " + preference.date[0] + ">" + $.lang[LANG]['config.date.option.default'] + "</option>\
										<option value='DATE' " + preference.date[1] + ">" + $.lang[LANG]['config.date.option.date'] + "</option>\
										<option value='DATE2' " + preference.date[2] + ">" + $.lang[LANG]['config.date.option.datetime'] + "</option>\
									</select>\
								</span>\
							</p>\
		";

		str = str + "\
						</div>\
					</div>\
				</div>\
		";

		if(!isFAQblock) {
			//글양식 (fmholder)
			var fmholder_empty = (typeof config.fmholder == "undefined" || !config.fmholder) ? "empty" : "",
				fmholder_str = (fmholder_empty == "empty") ? $.lang[LANG]['board.description-field.textarea'] : config.fmholder.replace(/''/gi, "");
			str = str + "\
				<div class='panel panel-default panel-line'>\
					<div class='panel-heading'>\
						<h4 class='panel-title'>\
							<a class='accordion-toggle no-toggle' data-toggle='collapse'>\
								<span data-lang='config.forum.group.description-field'></span>\
							</a>\
							<span class='pull-right hand descrip-field' data-type='forum' data-id='" + id + "'>&nbsp;&nbsp;<i class='fa fa-pencil'></i></span>\
	                        <span class='description-fd'>"+fmholder_str+"</span>\
						</h4>\
					</div>\
				</div>\
			";

			//안내 메일 (forum_email)
			var forum_settings_email = (typeof config.forum_email == "undefined") ? "" : config.forum_email,
				isFree = (typeof VALIDPLAN != "undefined" && VALIDPLAN) ? false : true,
				non_used = (isFree) ? "nonused-color" : "",
				forum_email_edit_class = (isFree || VALIDTYPE == 'FR' || VALIDTYPE == 'PK') ? "upgrade-plan" : "forum-email-title-edit";			

			str = str + "\
			<div class='panel panel-default panel-line'>\
				<div class='panel-heading'>\
				  <h4 class='panel-title'>\
				    <a class='accordion-toggle no-toggle' data-toggle='collapse'><span>" + $.lang[LANG]['config.forum.new.email'] + "</span></a>\
				    <span class='pull-right hand " + forum_email_edit_class + "'>&nbsp;&nbsp;<i class='fa fa-cog'></i></span>\
				    <span class='forum-email-title " + forum_email_edit_class + "'>" + forum_settings_email + "</span>\
				  </h4>\
				</div>\
			</div>\
			";

		}


		return str;
	}


	var groupConfigForum = function(config,id,group) {
		config = setDefaultConfig(config);

//************************************************************************************************************************************************************아래 바꾸기
			// live 
			// mtype = (SERVICE.indexOf('gabia') > -1 || (VALIDTYPE == 'BN' && SITEUM > 0)) ? 'um' : 'creatorlink',
			
			// gabia test
			// mtype = (SERVICE.indexOf('gabia') == -1 || (VALIDTYPE == 'BN' && SITEUM > 0)) ? 'um' : 'creatorlink',

		var tpUser = ["ADM","A","M","N","G"],
			tpOnoff = ["ON","OFF"],
			tpSecret = ["N","U","A"],
			mtype = (SERVICE.indexOf('gabia') > -1 || (VALIDTYPE == 'BN' && SITEUM > 0)) ? 'um' : 'creatorlink',
			group_member = 0,
			groups = group,
			select_group = config.group,
			select_group_str = '';

		var preference = { group : "", write : [], view : [], reply : [], list : [], modify : config.modify, delete : config.delete, row : config.page_row, secret : [], sns : [], comment : [] }
		preference.write 	= getConfigChecked(config.write_level,tpUser);
		preference.view 	= getConfigChecked(config.view_level,tpUser);
		preference.reply 	= getConfigChecked(config.reply_level,tpUser);
		preference.list 	= getConfigChecked(config.list_level,tpUser);
		preference.secret 	= getConfigChecked(config.secret_display,tpSecret,'checked');
		preference.comment 	= getConfigChecked(config.comment_display,tpOnoff,'checked');

		var namelist_str = $.forum.getGroupNameList(id);

		var str = "\
		<div class='clearwrap'>\
			<div class='forum-member-search'>\
				<div class='select-wrap'>\
					<select id='g-sfl' name='g-sfl' placeholder='" + $.lang[LANG]['board.g-sfl.all'] + "'>\
						<option value='all' data-id='all' selected>" + $.lang[LANG]['board.g-sfl.all'] + "</option>\
						" + namelist_str + "\
					</select>\
				</div>\
				<div>\
					<input id='g-stx' name='g-stx' class='config-input member-search' placeholder='" + $.lang[LANG]['board.search.userid.'+mtype] + "'>\
					<span class='btn btn-xs btn-forum-config btn-forum-group-search' data-toggle='tooltip' data-placement='top' title='SEARCH' data-id='" + SID + "'><i class='fa fa-search'></i></span>\
				</div>\
			</div>\
			<div class='froum-group-add'>\
				<span class='btn btn-group-add'><img src='//storage.googleapis.com/i.addblock.net/icon/fa_plus_icon.png' alt='add group' />" + $.lang[LANG]['board.add-group'] + "</span>\
			</div>\
		</div>\
		<div class='config-wrap'>";
		if(groups.length == 0) {
			str = str + "<div class='forum-settings group empty'><p> "+ "그룹이 없습니다" + "</p></div>";
		} else {
			str = str + "\
			<div class='panel-group forum-settings group' id='group-accordion'>\
			";
			for(var i=0; i<groups.length; i++) {
				if(select_group == groups[i].id) {
					selected = 'selected';
					group_member = groups[i].member_count;
					select_group_str = ' - ' + groups[i].name;
				} else {
					selected = '';
				}
				
				str = str + getGroupList(groups[i].id, groups[i].name, groups[i].member_count);
			}

			str = str + "\
			</div>\
		";
		}
		str = str + "\
		</div>\
		";
		return str;
	}


	var getGroupList = function (gid, gname, gmcount) {
		var str =  "\
				<div class='panel'>\
					<div class='panel-heading'>\
						<div class='panel-title'>\
							<a class='accordion-toggle collapsed group-item' data-toggle='collapse' data-parent='#group-accordion' href='#group-list-" + gid + "' data-id='" + gid + "' data-member-count='" + gmcount + "'>\
								<label class='group-name'>" + gname + "</label>\
								<span class='group-member-count'>" + gmcount + "</span>\
								<span class='caret'></span>\
							</a>\
							<div class='content'>\
								<span><img class='group-user-add hand' src='//storage.googleapis.com/i.addblock.net/icon/user_plus_icon.png' alt='add group user' /></span>\
								<span><i class='group-name-edit fa fa-pencil hand'></i></span>\
								<span><img class='group-delete hand' src='//storage.googleapis.com/i.addblock.net/icon/icon-menu-delete.png' alt='group user delete' /></span>\
							</div>\
						</div>\
					</div>\
					<div id='group-list-" + gid + "' class='panel-collapse collapse'>\
						<div class='panel-body'>\
						" + getGroupMemberList(gid) + "\
						</div>\
					</div>\
				</div>\
				";
		return str;
	}
	var getGroupMemberList = function (id,userid) {

//************************************************************************************************************************************************************아래 바꾸기
			// live 
			// mtype = (SERVICE.indexOf('gabia') > -1 || (VALIDTYPE == 'BN' && SITEUM > 0)) ? 'um' : 'creatorlink',
			
			// gabia test
			// mtype = (SERVICE.indexOf('gabia') == -1 || (VALIDTYPE == 'BN' && SITEUM > 0)) ? 'um' : 'creatorlink',

		var userid = (typeof userid == 'undefined' || !userid) ? '' : userid, 
			mtype = (SERVICE.indexOf('gabia') > -1 || (VALIDTYPE == 'BN' && SITEUM > 0)) ? 'um' : 'creatorlink',
			str = '';

		$.post('/fm/group/member', { id : id, page : 1, userid : userid, mtype:mtype }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				return false;
			}

			if(data.total>0) {
				str = "		<ul class='group-member-list'>";
				$.each(data.list, function(i,v) {
					str = str + "\
								<li class='gm-item'>\
									<div>\
										<div class='gmi-img'>\
											<span class='hexagon'>\
												<svg viewBox='0 0 28 28'>\
													<pattern id='forum-list-image-"+id+"-"+i+"' patternUnits='userSpaceOnUse' width='28' height='28'>\
														<image xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='" + v.img + "' x='-14' width='56' height='28'></image>\
													</pattern>\
													<polygon points='14 0 26 7 26 22 14 28 2 22 2 7' fill='url(#forum-list-image-"+id+"-"+i+")'></polygon>\
												</svg>\
											</span>\
										</div>\
										<div class='gmi-info'>\
									";
					if(v.name != v.id) {
						str = str + "\
											<span class='gmi-name'>" + v.name + "</span>\
						";
					}
						str = str + "\
											<span class='gmi-id'>" + v.id + "</span>\
										</div>\
										<div class='gmi-btn'>\
											<img class='gmi-del hand' data-userid='" + v.id + "' data-id='" + v.fg_id + "' src='//storage.googleapis.com/i.addblock.net/icon/icon-menu-delete.png' alt='group member delete' />\
										</div>\
									</div>\
								</li>";
				});
				str = str + "</ul>";
			} else {
				str = "		<div class='empty'>" + $.lang[LANG]['board.group-no-members'] + "</div>";
			}

		}, 'json');
		return str;
	}

	var settingEditMode = function(mode) {
		if(mode) {
			$('#group-accordion, .forum-member-search, .froum-group-add').css('pointer-events','none');
			$('#group-accordion').find('.forum-group-update').css('pointer-events','auto').find('input').focus();
			$('#group-accordion').find('.forum-group-user-add').css('pointer-events','auto').find('input').focus();
		} else {
			$('#group-accordion, .forum-member-search, .froum-group-add').css('pointer-events','auto');
			$('#group-accordion').find('.config-error').remove();
		}
	}

	var addForumGroupUpdateInput = function(gid, gname) {
		var gid = (typeof gid=="undefined" || !gid) ? "" : gid,
			gname = (typeof gname=="undefined" || !gname) ? "" : gname,
			str = "\
			<div class='forum-group-update'>\
				<div class='input-group'>\
					<input type='text' class='forum-group-name forum-control' placeholder='" + $.lang[LANG]['board.enter-group-name'] + "' value='" + gname + "'/>\
					<span class='input-group-btn'>\
						<button class='ga-save btn btn-active' data-id='" + gid  +"'><i class='fa fa-check'></i></button>\
					</span>\
					<div class='ga-cancel'><i class='fa fa-times'></i></div>\
				</div>\
			</div>\
		";
		return str;
	}


	$doc.on('hidden.bs.modal','.flat-gc-modal .modal', function (e) {
		var gid = $('#forum-settings-select option:selected').attr('data-id'),
			str = $.forum.getGroupNameList(selectID);
		settingEditMode(false);
		$('#forum-settings-select').html(str);

		var selectGroup = ($('#forum-settings-select').find('option[data-id="' + gid + '"]').length > 0) ? $('#forum-settings-select').find('option[data-id="' + gid + '"]') : $('#forum-settings-select option:first-child');
		selectGroup.attr('selected',true);

		$group_option = $('#prop-forum-chmod select.property-form option[value="G"]');
		$.each($group_option,function(i,v) {
			$(this).text($.lang[LANG]['board.access-group-label'] + ' - ' + selectGroup.val());
		});
		$('.flat-gc-modal').remove();
	});


	$doc.on('click','.btn-group-add', function (e) {
		if($('#group-accordion').find('.forum-group-update').length > 0) return false;

		$('#g-stx').val('');
		$('#g-sfl option:first-child').attr('selected',true);
		$.forum.getgroupdata($('.flat-gc-modal .modal').attr('data-fid'));

		var input_text = addForumGroupUpdateInput();
		$(input_text).appendTo($('#group-accordion'));
		settingEditMode(true);
	});

	$doc.on('click','.ga-cancel',function (e) {
		settingEditMode(false);
		$('#group-accordion').find('.forum-group-update').remove();
	});	


	$doc.on('click','.ga-save', function (e) {
		var group_name = $('.forum-group-name').val(),
			id = $(this).attr('data-id'),
			regexp = /^[ㄱ-ㅎ가-힣ㅏ-ㅣa-zA-Z0-9\# ]+$/i,
			editgroupname = (id) ? 'g-edit' : '';
		$position = (id) ? $('.group-item[data-id="'+id+'"]') : $('#group-accordion');

		$('.config-error').remove();

		if($('.group-item[data-id="'+id+'"] .group-name').text() == group_name) {
			settingEditMode(false);
			$('#group-accordion').find('.forum-group-update').remove();
			return false;
		}
		if(!regexp.test(group_name)) {
			$position.append('<div class="config-error '+editgroupname+'">' + $.lang[LANG]['board.allowed-chars'] + '</div>');
			return false;
		}
		if(group_name.length<1) {
			$position.append('<div class="config-error '+editgroupname+'">' + $.lang[LANG]['board.enter-group-name'] + '</div>');
			return false;
		}
		if(group_name.length>60) {
			$position.append('<div class="config-error '+editgroupname+'">' + $.lang[LANG]['board.enter-max-chars.60'] + '</div>');
			return false;
		}

		$.post('/fm/group/update', { sid : F_SID, id : id, name : encodeURIComponent(group_name) }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				$position.append('<div class="config-error '+editgroupname+'">' + data.error + '</div>');
				return false;
			}

			$('#group-accordion').find('.forum-group-update').remove();
			settingEditMode(false);
			if(id) {
				var str = "\
					<label class='group-name'>" + data.name + "</label>\
					<span class='group-member-count'>" + $('#group-accordion .group-item[data-id="' + data.id + '"]').attr('data-member-count') + "</span>\
					<span class='caret'></span>\
				";
				$('#group-accordion .group-item[data-id="' + data.id + '"]').html(str);
				$('.flat-gc-modal #g-sfl option[data-id="' + data.id + '"]').attr('value',data.name).text(data.name);
			} else {
				var newgroup = getGroupList(data.id, data.name, 0);
				$('#group-accordion').append(newgroup);
				$('#group-accordion .group-item[data-id="' + data.id + '"]').click();
				$('.flat-gc-modal #g-sfl').append('<option value="'+data.name+'" data-id="'+data.id+'" data-member-count="'+data.member_count+'">'+data.name+'</option>');
			}

			groups = getForumGroupObject();

		}, 'json');
	});


	$doc.on('click','.group-user-add', function (e) {
		if($('#group-accordion').find('.forum-group-user-add').length > 0) return false;
		$select_group = $(this).parents('.content').prev('.group-item');

//************************************************************************************************************************************************************아래 바꾸기
			// live 
			// mtype = (SERVICE.indexOf('gabia') > -1 || (VALIDTYPE == 'BN' && SITEUM > 0)) ? 'um' : 'creatorlink';
			
			// gabia test
			// mtype = (SERVICE.indexOf('gabia') == -1 || (VALIDTYPE == 'BN' && SITEUM > 0)) ? 'um' : 'creatorlink';

		var gid = $select_group.attr('data-id'),
			mtype = (SERVICE.indexOf('gabia') > -1 || (VALIDTYPE == 'BN' && SITEUM > 0)) ? 'um' : 'creatorlink';

		var input_text = "\
			<div class='forum-group-user-add'>\
				<div class='input-group'>\
					<input type='text' class='gua-userid forum-control' placeholder='" + $.lang[LANG]['board.enter-member-email.'+mtype] + "'/>\
					<span class='input-group-btn'>\
						<button class='gua-save btn btn-active' data-id='" + gid + "' data-mtype='" + mtype + "'><i class='fa fa-check'></i></button>\
					</span>\
					<div class='gua-cancel'><i class='fa fa-times'></i></div>\
				</div>\
			</div>\
		";

		$(input_text).appendTo($(this).closest('span'));
		settingEditMode(true);
	});

	$doc.on('click','.gua-cancel',function (e) {
		settingEditMode(false);
		$('#group-accordion').find('.forum-group-user-add').remove();
	});

	$doc.on('click','.gua-save',function (e) {
		var $select_group = $(this).parents('.content').prev('.group-item'),
			$userid = $('.gua-userid'),
			id = $(this).attr('data-id'),
			mtype = $(this).attr('data-mtype');

		$('.config-error').remove();

		if(!$userid.val()) {
			$select_group.append('<div class="config-error">' + $.lang[LANG]['board.enter-member-email'] + '</div>');
			return false;
		}
		if(typeof id == "undefined" || id==null || !id) {
			$select_group.append('<div class="config-error">Invalid variable</div>');
			return false;
		}
		$.post('/fm/group/useradd', { id:id, userid : $userid.val(), mtype:mtype }, function(data) {
			if(typeof data.error != "undefined" || data.error) {
				$select_group.append('<div class="config-error">' + data.error + '</div>');
				return false;
			}
			if($('.member-search').val()) {
				$('#g-stx').val('');
				$('#g-sfl option:first-child').attr('selected',true);
				$.forum.getgroupdata($('.flat-gc-modal .modal').attr('data-fid'));
			}
			$select_group.attr('data-member-count',data.count);
			$select_group.find('.group-member-count').text(data.count);

			settingEditMode(false);
			$('#group-accordion').find('.forum-group-user-add').remove();

			groups = getForumGroupObject();

			getGroupMembers(id);
		},'json');
	});

	$doc.on('click','.group-name-edit',function (e) {
		$select_group = $(this).parents('.content').prev('.group-item');
		var gid = $select_group.attr('data-id'),
			gname = $select_group.find('.group-name').text();
		if($('#group-accordion').find('.forum-group-update').length > 0) return false;

		var input_text = addForumGroupUpdateInput(gid, gname);
		$(input_text).appendTo($select_group.closest('.panel-title'));
		settingEditMode(true);
	});

	$doc.on('click','.group-delete',function (e) {
		$select_group = $(this).parents('.content').prev('.group-item');
		var gid =  $select_group.attr('data-id'),
			gname = $select_group.find('.group-name').text();

		if($('#group-accordion .group-item').length==1) {
			if($('#group-accordion .group-item').find('.config-error').length==0)
				$select_group.append('<div class="config-error">' + $.lang[LANG]['board.min-num-groups'] + '</div>');
			return false;
		}
		var str = $.lang[LANG]['board.ask-delete-group-1'] + "<b>'<span id='delete-group-name'>" + $.lang[LANG]['board.group-name'] + "</span>'</b>\
					" + $.lang[LANG]['board.ask-delete-group-2'] + "\
		";
		var gd_modal = $(this).showModalFlat('INFORMATION', str, true, true, function() {
			$.post('/fm/group/delete', { id : gid }, function(data) {
				if(typeof data.error != "undefined" || data.error) {
					$('.forum-group-delete .content').append('<div class="config-error">' + data.error + '</div>');
					return false;
				}
				$('#group-accordion .group-item[data-id="' + data.id + '"]').parents('.panel').remove();
				$('.flat-gc-modal #g-sfl option[data-id="' + data.id + '"]').remove();
				groups = getForumGroupObject();
				gd_modal.modal('hide');
			},'json');

		}, 'cancel');
		$('#delete-group-name').text(gname);
	});

	$doc.on('click','.gmi-del', function (e) {
		var userid = $(this).attr('data-userid'),
			id = $(this).attr('data-id');
			$select_group = $('.group-item[data-id="'+id+'"]'),
			gmcount = parseInt($select_group.find('.group-member-count').text()),
			str = userid + $.lang[LANG]['board.ask-delete-member-from-group'];

		var gmid_modal = $(this).showModalFlat('INFORMATION', str, true, true, function() {
			$.post('/fm/group/userdel', { id : id, userid : userid }, function(data) {
				if(typeof data.error != "undefined" && data.error) {
					$select_group.append('<div class="config-error">' + data.error + '</div>');
					return false;
				}

				$select_group.attr('data-member-count',gmcount-1);
				$select_group.find('.group-member-count').text(gmcount-1);

				getGroupMembers(id);
				gmid_modal.modal('hide');
			},'json');
		}, 'cancel');
	});

	$doc.on('change','#forum-settings-select', function(e) {
		select_group = $('#forum-settings-select option:selected').attr('data-id'),
		select_group_str = $('#forum-settings-select option:selected').text();

		$group_option = $('#prop-forum-chmod select.property-form option[value="G"]');
		$.each($group_option,function(i,v) {
			$(this).text($.lang[LANG]['board.access-group-label'] + ' - ' + select_group_str);
		});
	});





	$doc.on('click','#btn-config-group', function(e) {
		var id = $(this).attr('data-id');

		$.forum.groupconfig(id);
	});

	$doc.on('focus','.property-form-wrap select', function(e) {
		$(this).data({ choice : $(this).val() });
	});

	$doc.on('click', '.property-form-wrap .property-form[data-id="NULL"][data-mode="group"]', function(e) {
			e.preventDefault();
//************************************************************************************************************************************************************아래 바꾸기
			// live 
			// var upgrade_text = (SERVICE.indexOf('gabia') > -1) ? ((VALIDPLAN && VALIDTYPE == 'BN') ? $.lang[LANG]['board.chmod.upgrade-plan.gabia-bn'] : $.lang[LANG]['board.chmod.upgrade-plan.gabia']) : $.lang[LANG]['board.chmod.upgrade-plan'];
			
			// gabia test
			// var upgrade_text = (SERVICE.indexOf('gabia') == -1) ? ((VALIDPLAN && VALIDTYPE == 'BN') ? $.lang[LANG]['board.chmod.upgrade-plan.gabia-bn'] : $.lang[LANG]['board.chmod.upgrade-plan.gabia']) : $.lang[LANG]['board.chmod.upgrade-plan'];
			
			var upgrade_text = (SERVICE.indexOf('gabia') > -1) ? ((VALIDPLAN && VALIDTYPE == 'BN') ? $.lang[LANG]['board.chmod.upgrade-plan.gabia-bn'] : $.lang[LANG]['board.chmod.upgrade-plan.gabia']) : $.lang[LANG]['board.chmod.upgrade-plan'];
			$(this).showModalFlat('INFORMATION', upgrade_text, true, false, '', 'close');
			$(this).val( $(this).data('choice') );
			return false;
	});


	$doc.on('change','.property-form-wrap select, #prop-forum-etcmod .switch-input', function(e) {
		var id =  $(this).attr('data-id'),
			mode = $(this).attr('data-mode'),
			value = (mode == 'group') ? $(this).find('option:selected').attr('data-id') : $(this).val();

		if(typeof id == "undefined" || id==null || id=="") {
			$(this).showModalFlat('ERROR', $.lang[LANG]['board.error-setting-value'], true, false, '', 'ok');
			return false;
		}

		if(value != 'undefined' && value == 'NULL') {
			e.preventDefault();
//************************************************************************************************************************************************************아래 바꾸기
			// live
			// var upgrade_text = (SERVICE.indexOf('gabia') > -1) ? ((VALIDPLAN && VALIDTYPE == 'BN') ? $.lang[LANG]['board.chmod.upgrade-plan.gabia-bn'] : $.lang[LANG]['board.chmod.upgrade-plan.gabia']) : $.lang[LANG]['board.chmod.upgrade-plan'];
			
			// gabia test
			// var upgrade_text = (SERVICE.indexOf('gabia') == -1) ? ((VALIDPLAN && VALIDTYPE == 'BN') ? $.lang[LANG]['board.chmod.upgrade-plan.gabia-bn'] : $.lang[LANG]['board.chmod.upgrade-plan.gabia']) : $.lang[LANG]['board.chmod.upgrade-plan'];
			
            var upgrade_text = (SERVICE.indexOf('gabia') > -1) ? ((VALIDPLAN && VALIDTYPE == 'BN') ? $.lang[LANG]['board.chmod.upgrade-plan.gabia-bn'] : $.lang[LANG]['board.chmod.upgrade-plan.gabia']) : $.lang[LANG]['board.chmod.upgrade-plan'];
			$(this).showModalFlat('INFORMATION', upgrade_text, true, false, '', 'close');
            $(this).val( $(this).data('choice') );
			return false;
		}

		if(mode == "comment") value = ($(this).prop('checked')) ? 'ON' : 'OFF';
		if(mode == "sns") 	  value = ($(this).prop('checked')) ? 'ON' : 'OFF';
		if(mode == "bottomlist") value = ($(this).prop('checked')) ? 'ON' : 'OFF';
		if(mode == "searchbox") value = ($(this).prop('checked')) ? 'ON' : 'OFF';

		var modetype = {
			'group' : 'group',
			'write'	: 'write_level',
			'view'	: 'view_level',
			'reply'	: 'reply_level',
			'list'	: 'list_level',
			'secret' : 'secret_display',
			'comment': 'comment_display',
			'sns'	: 'sns_share_display',
			'bottomlist': 'bottomlist_display',
			'fieldlang' : 'field_lang',
			'searchbox': 'searchbox_display',
			'date' : 'date',
		}, settings = {};

		settings[modetype[mode]] = value;
		$.post('/template/settings', { sid : F_SID, settings : JSON.stringify(settings), el : id }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
				return false;
			}

			if(mode == "fieldlang") {
				$('.element[data-id="' + id + '"]').attr('data-fieldlang',value.toLowerCase());
				$('.element[data-id="' + id + '"] thead tr th').each(function() {
					var field_text = (typeof $(this).attr('class') != 'undefined') ? $(this).attr('class') : 'tpl-forum-title';
					if(field_text.indexOf('title') > -1 || field_text.indexOf('content') > -1) $(this).text($.lang[value.toLowerCase()]['forum.field.tpl-forum-title']);
					else $(this).text($.lang[value.toLowerCase()]['forum.field.' + field_text]);
				});
				$('.element[data-id="' + id + '"]').find('.tpl-forum-write').text($.lang[value.toLowerCase()]['forum.field.tpl-forum-write']);
			}
			if(mode == "searchbox") {
				if(value == "ON") { $('.element[data-id="' + id + '"]').find('.search-box').removeClass('hidden'); } 
				else { $('.element[data-id="' + id + '"]').find('.search-box').addClass('hidden'); }
			}
			if(mode == "date") {
				var page = F_PAGE,
					page_num = 1,
					view = $('.element.active').find('.tpl-forum-pagination li').first().attr('data-view'),
					sfl = '',
					stx = '',
					scate = '';

				setForumCookie(id,page_num,stx,sfl,scate);
				$.forum.init(id,page,view,page_num,sfl,stx,scate);
				activeEL('userEL'+id);
			}

		}, 'json');
	});

	var getForumGroupObject = function() {
		var $select = $('#group-accordion .group-item');
		groups = [];
		$.each($select,function(i,v) {
			groups[i] = {
				"id" : $(this).attr('data-id'),
				"name" : $(this).find('.group-name').text(),
				"member_count" : $(this).attr('data-member-count')
			}
		});
		return groups;
	}

	var deleteForumPost = function(id) {
		$.post('/fm/delete', { id : id, user : user }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				$('.flat-modal .modal').modal('hide');
				var modal = $(this).showModalFlat('ERROR', data.error, true, false, '', 'close');
				return false;
			}
			$('.tpl-forum-list').click();
		},'json');
	}

	var setPagination = function($obj, total, view, page_num, id, page) {
		var page_view = 5,
		    start = Math.floor((page_num-1) / page_view) * page_view,
		    pages = Math.ceil(total/view),
		    end = (Math.floor((page_num-1) / page_view) + 1) * page_view,
		    end = (end>pages) ? pages : end,
		    prev = (start > 0) ? start : 1,
		    next = ((end+1) > pages) ? pages : end+1;
		$obj.find('li').addClass('tpl-forum-page');

		var $first = $obj.children().first().clone(),
			$prev = $obj.children().first().clone(),
			$next = $obj.children().last().clone(),
			$last = $obj.children().last().clone();
			
		$obj.empty();
		$first.attr('data-page',page).attr('data-id',id).attr('data-view',view).attr('data-page-num',"1").find('i').removeClass('fa-angle-left').addClass('fa-angle-double-left');
		$prev.attr('data-page',page).attr('data-id',id).attr('data-view',view).attr('data-page-num',prev);
		$next.attr('data-page',page).attr('data-id',id).attr('data-view',view).attr('data-page-num',next);
		$last.attr('data-page',page).attr('data-id',id).attr('data-view',view).attr('data-page-num',pages).find('i').removeClass('fa-angle-right').addClass('fa-angle-double-right');
		$obj.append($prev).append($next);
		for(i=start;i<end;i++) {
			var active = ((i+1) == page_num) ? "active" : "";
			$obj.children().last().before($("<li class='tpl-forum-page " + active + "' data-id='" + id + "' data-page='" + page + "' data-view='" + view + "' data-page-num='" + (i+1) + "' data-pid='" + id + "'><a href='#'>" + (i+1) + "</a></li>"));
		}
		if(pages>1 && pages>=page_num && pages>page_view)
			$obj.prepend($first).append($last);
	}


	var getGroupMembers = function(id, userid) {
		userid = (typeof userid == 'undefined' || !userid) ? "" : userid;
		var $grouplist = $('#group-list-'+id+' .panel-body');
		$grouplist.find('.empty').remove();
		$grouplist.find('.group-member-list').remove();

		$grouplist.append(getGroupMemberList(id,userid));
	}

	var setMemberPagination = function($obj,total,page_num,id) {
		var page_view = 10, view = 10,
		    start = Math.floor((page_num-1) / page_view) * page_view,
		    pages = Math.ceil(total/view),
		    end = (Math.floor((page_num-1) / page_view) + 1) * page_view,
		    end = (end>pages) ? pages : end,
		    prev = (start > 0) ? start : 1,
		    next = ((end+1) > pages) ? pages : end+1;

		var $prev = $("<li class='forum-group-member-pagination' data-id='" + id + "' data-view='" + page_view + "' data-page-num='" + prev + "'><a href='#'><i class='fa fa-angle-left'></i></a></li>"),
			$next = $("<li class='forum-group-member-pagination' data-id='" + id + "' data-view='" + page_view + "' data-page-num='" + next + "'><a href='#'><i class='fa fa-angle-right'></i></a></li>");
			
		$obj.empty();
		$obj.append($prev);
		for(i=start;i<end;i++) {
			var active = ((i+1) == page_num) ? "active" : "";
			$obj.append($("<li class='forum-group-member-pagination " + active + "' data-id='" + id + "' data-view='" + page_view + "' data-page-num='" + (i+1) + "'><a href='#'>" + (i+1) + "</a></li>"));
		}
		if(end==0) { 
			$obj.append($("<li class='forum-group-member-pagination' data-id='" + id + "' data-view='" + page_view + "' data-page-num='0'><a href='#'>1</a></li>"));
		}
		$obj.append($next);
	}

	$doc.on('click','.forum-group-member-pagination', function(e) {
		var id = $(this).attr('data-id'),
			page = $(this).attr('data-page-num');
		if(page==0) return false;
	});

	var tplmemberSearch = function(id) {
		var str = "" + 
		"<div class='forum-member-search'><input class='config-input member-search' placeholder='" + $.lang[LANG]['board.enter-member-id'] + "'>" +
		"<span class='btn btn-forum-config btn-forum-group-search' data-toggle='tooltip' data-placement='top' title='SEARCH' data-id='" + id + "' style='margin-top:-3px;height:39px;'><i class='fa fa-check'></i></span>" +
		"</div>";
		return str;
	}

	$doc.on('change','#g-sfl',function(e) {
		$('.btn-forum-group-search').click();
	});

	$doc.on('click','.btn-forum-group-search',function(e) {
//************************************************************************************************************************************************************아래 바꾸기
			// live 
			// mtype = (SERVICE.indexOf('gabia') > -1 || (VALIDTYPE == 'BN' && SITEUM > 0)) ? 'um' : 'creatorlink',
			
			// gabia test
			// mtype = (SERVICE.indexOf('gabia') == -1 || (VALIDTYPE == 'BN' && SITEUM > 0)) ? 'um' : 'creatorlink',

		var id = $(this).attr('data-id'),
			gsfl = $('#g-sfl option:selected').attr('data-id'),
			gstx = $('#g-stx').val(),
			mtype = (SERVICE.indexOf('gabia') > -1 || (VALIDTYPE == 'BN' && SITEUM > 0)) ? 'um' : 'creatorlink',
			str = '';

		$.post('/fm/group/membersearch', { id : id, gsfl : gsfl, gstx : gstx, mtype:mtype }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				$('#group-accordion').html("<div class='empty'>" + data.error + "</div>");
				return false;
			}
			if(!$.isNumeric(gsfl) && !gstx) {
				$('#g-stx').val('');
				$('#g-sfl option:first-child').attr('selected',true);
				$.forum.getgroupdata($('.flat-gc-modal .modal').attr('data-fid'));
				return false;
			}

			if(data.total>0) {
				var group = "";
				$.each(data.list, function(i,v) {
					if(group != v.fg_id) {
						group = v.fg_id;
						str = (group=="") ? "" : str + "\
									</ul>\
								</div>\
							</div>\
						</div>\
						";
						str = str + "\
						<div class='panel'>\
							<div class='panel-heading'>\
								<div class='panel-title'>\
									<a class='accordion-toggle collapsed group-item' data-toggle='collapse' data-parent='#group-accordion' href='#group-list-" + group + "' data-id='" + group + "' data-member-count='" + v.fg_member_count + "'>\
										<label class='group-name'>" + v.fg_name + "</label>\
										<span class='group-member-count'>" + v.fg_member_count + "</span>\
										<span class='caret'></span>\
									</a>\
									<div class='content'>\
										<span><img class='group-user-add hand' src='//storage.googleapis.com/i.addblock.net/icon/user_plus_icon.png' alt='add group user' /></span>\
										<span><i class='group-name-edit fa fa-pencil hand'></i></span>\
										<span><img class='group-delete hand' src='//storage.googleapis.com/i.addblock.net/icon/icon-menu-delete.png' alt='group user delete' /></span>\
									</div>\
								</div>\
							</div>\
							<div id='group-list-" + group + "' class='panel-collapse collapse'>\
								<div class='panel-body'>\
									<ul class='group-member-list'>\
						";
					}
					if(v.fg_member_count!=0) {
						str += "\
										<li class='gm-item'>\
											<div>\
												<div class='gmi-img'>\
						                            <span class='hexagon'>\
						                            	<svg viewBox='0 0 28 28'>\
						                            		<pattern id='forum-list-image-"+v.fg_id+'-'+i+"' patternUnits='userSpaceOnUse' width='28' height='28'>\
						                            			<image xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='" + v.img + "' x='-14' width='56' height='28'></image>\
						                        			</pattern>\
						                        			<polygon points='14 0 26 7 26 22 14 28 2 22 2 7' fill='url(#forum-list-image-"+v.fg_id+'-'+i+")'></polygon>\
						                    			</svg>\
						                			</span>\
					                			</div>\
					                			<div class='gmi-info'>\
					    ";
					    if(v.name != v.id) {
						    str += "\
						                			<span class='gmi-name'>" + v.name + "</span>\
							";
						}
						str += "\
						                			<span class='gmi-id'>" + v.id + "</span>\
					                			</div>\
					                			<div class='gmi-btn'>\
					                				<img class='gmi-del' data-userid='" + v.id + "' data-id='" + v.fg_id + "' src='//storage.googleapis.com/i.addblock.net/icon/icon-menu-delete.png' alt='group member delete' />\
					                			</div>\
											</div>\
										</li>\
										";
					} else {
						str = str + "<div class='empty'>" + $.lang[LANG]['board.group-no-members'] + "</div>";
					}
				});
				str = str + "\
									</ul>\
								</div>\
							</div>\
						</div>\
				";
			}
			//  else {
			// 	str = "<div class='empty'>" + $.lang[LANG]['board.empty-member-in-group'] + "</div>";
			// }
			$('#group-accordion').html(str);

		}, 'json');
	});

	var displayMember = function(mb) {
		var str = "<li>" + 
		"<span class='userimg'><img src='" + mb.img + "'></span>" +
		"<span class='user-info'><div class='user-name'>" + mb.name + "</div><div class='user-id'>" + mb.id + "</div></span>" +
		"<div class='userdel' data-userid='" + mb.id + "' data-id='" + mb.fg_id + "'><i class='fa fa-trash-o'></i></div>" + 
		"</li>";
		return str;
	}

	$doc.on('click','.member .userdel', function(e) {
		var userid = $(this).attr('data-userid'),
			id = $(this).attr('data-id');
		initControlForm();
		$('.delete-member-userid').text(userid);
		$('.btn-forum-group-delete-member-ok').attr('data-userid',userid).attr('data-id',id);
		$('.forum-group-delete-member-confirm').show();
	});

	$doc.on('click','.btn-forum-group-delete-member-ok',function(e) {
		var userid = $(this).attr('data-userid'),
			id = $(this).attr('data-id');

		$.post('/fm/group/userdel', { id : id, userid : userid }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				$('.forum-group-delete-member-confirm .content').append('<div class="config-error">' + data.error + '</div>')
				return false;
			}
		},'json');
	});


	$doc.on('change','#scate', function(e) {
		var dataCheck =  ($(this).parents('.element').find('.tpl-forum-pagination').children().length > 0) ? true :  false;
		
		$this_pagination = $(this).parents('.element').find('.tpl-forum-pagination li.active');
		var sfl = $(this).parents('.search-box').find('#sfl').val(),
			stx = $(this).parents('.search-box').find('#stx').val(),
			scate = $(this).find('option:selected').val(),
			id = (dataCheck) ? $this_pagination.attr('data-id') : $(this).parents('.element').attr('data-id'),
			page = (dataCheck) ? $this_pagination.attr('data-page') : $(this).parents('.element').find('.tpl-forum-pagination').attr('data-page'),
			page_num = (dataCheck) ? $this_pagination.attr('data-page-num') : 1,
			view = (dataCheck) ? $this_pagination.attr('data-view') : $(this).parents('.element').find('.tpl-forum-pagination').attr('data-view');

    	setForumCookie(id,page_num,stx,sfl,scate);
		$.forum.init(id,page,view,page_num,sfl,stx,scate);
		activeEL('userEL'+id);
	});

	$('.search-btn').live('click', function(e) {
		if($(this).parents('.element').attr('data-type') != "forum") return false;
		e.preventDefault();
		var dataCheck =  ($(this).parents('.element').find('.tpl-forum-pagination').children().length > 0) ? true :  false;
		
		$this_pagination = $(this).parents('.element').find('.tpl-forum-pagination li.active');
		var sfl = $(this).parents('.search-box').find('#sfl').val(),
			stx = $(this).parents('.search-box').find('#stx').val(),
			scate = ($(this).find('option:selected').length > 0 ) ? $(this).find('option:selected').val() : '',
			id = (dataCheck) ? $this_pagination.attr('data-id') : $(this).parents('.element').attr('data-id'),
			page = (dataCheck) ? $this_pagination.attr('data-page') : $(this).parents('.element').find('.tpl-forum-pagination').attr('data-page'),
			page_num = (dataCheck) ? $this_pagination.attr('data-page-num') : 1,
			view = (dataCheck) ? $this_pagination.attr('data-view') : $(this).parents('.element').find('.tpl-forum-pagination').attr('data-view');

    	setForumCookie(id,page_num,stx,sfl,scate);
		$.forum.init(id,page,view,page_num,sfl,stx,scate);
		activeEL('userEL'+id);
	});

	$doc.on('keypress','input#stx', function (e) {
		if(e.which == 13 && $(this).val().length>0) $(this).closest('.search-box').find('.search-btn').click();
	});

	$(document).on('mouseenter','#forum-modal .edt-type-file',function(e) {
		$(this).addClass('active');
		var left = $(this).find('.fr-file').width() + 50;
		$(this).append('<span class="edt-file-delete" style="left:' + (left+5) + 'px"><i class="fa fa-trash-o"></i></span>');
		$(this).append('<span class="edt-enter" style="left:' + (left+15) + 'px"><img src="//storage.googleapis.com/i.addblock.net/icon/editor-enter.png"></span>');
	}).on('mouseleave','#forum-modal .edt-type-file',function(e) {
		$(this).removeClass('active');
		$('.edt-file-delete').remove();
		$('.edt-enter').remove();
	}).on('click','#forum-modal .edt-type-file, #forum-modal .fr-file',function(e) {
		e.stopPropagation();
		e.preventDefault();
		if($(this).parents('p').next().length == 0) {
			$(this).parents('p').after('<p class="last-line-empty"><br></p>');
			$(('#forum-modal')).scrollTop($('#forum-modal').height());
		}
	});
	$(document).on('click','#forum-modal .edt-file-delete', function(e) {
		$('#fm-editor').froalaEditor('undo.saveStep');
		$(this).parents('.edt-type-file').remove().focus();
	});

	$(document).on('click','#forum-modal .edt-enter', function(e) {
		$('#fm-editor').froalaEditor('undo.saveStep');
		$(this).parents('p').after('<p><br></p>');
	});

	$(document).on('mousedown','.fr-file',function(e) {
		if(PAGE_MODE!='c') {
			var url = new getLocation($(this).parent().attr('data-href')),
				file_name = encodeURIComponent($(this).text().trim());
			
			var go = '/down/' + file_name + '/' + (url.pathname).replace('/cr-resource/forum/','');
			window.open(go,'_blank');
		}
	});

	$doc.on('click','#forum-modal .fr-view a[rel="nofollow"], #forum-modal .fr-view a.fr-file, #forum-modal .edt-type-file',function(e) {
		var tTop = $(this).offset().top;
		frAbove = '';
		scrollPos = $('#forum-modal').scrollTop();
		scrollPos2 = $('#forum-modal').scrollTop();

		if($(this).hasClass('fr-file') || $(this).hasClass('edt-type-file')) {
			popPos =  tTop + 37;
		} else {
			popPos = tTop + 20;
		}

		var wHeight = $('#forum-modal').height();
		if(tTop + 80 > wHeight) {
			popPos = ($(this).hasClass('.fr-file') || $(this).hasClass('edt-type-file')) ? popPos - 58 : popPos - 40;
		}
		e.stopPropagation();
		e.preventDefault();
	});

	function hideToolbar() {
		isOff = true;
		$('#fm-editor').froalaEditor('selection.clear');
		$('#fm-editor').froalaEditor('edit.off');
		$('.fr-toolbar').css('visibility','hidden');
		$('.fr-popup').remove();
		$('.fr-image-resizer').remove();
	}
	function showTollbar() {
		isOff = false;
		$('#fm-editor').froalaEditor('edit.on');
		$('.fr-toolbar').css('visibility','visible');
	}

	function getCursorPos($obj) {
		var tTop = $obj.offset().top;
		frAbove = '';
		scrollPos = $('#forum-modal').scrollTop();
		scrollPos2 = $('#forum-modal').scrollTop();

		popPos = tTop + 20;

		var wHeight = $('#forum-modal').height();
		if(tTop + 80 > wHeight) {
			popPos = popPos - 60;
		}
	}





	//20170912 forum field 
	$doc.on('click','.forum-config-field', function(e) {
		var ch = $(this).prop('checked'),
			id = $(this).attr('data-id'),
			type = $(this).attr('data-type');
		
		switch(type) {
			case 'title' :
				e.preventDefault();
				return false;
				break;
			case 'category' :
				$('#btn-config-forum-category').toggleClass('checked');
				break;
			default: 
				break;
		}

		var field_disable = [];
		$('.forum-config-field').each(function() {
			if(!$(this).prop('checked')) field_disable.push($(this).attr('data-type'));
		});

		var settings = {
			field_disable : field_disable
		}
		$.post('/template/settings', { sid : F_SID, settings : JSON.stringify(settings), el : id }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
				return false;
			}

			$('.'+selectEL+'[data-type="forum"] .tpl-forum-'+type).removeAttr('style');
			$('.'+selectEL+'[data-type="forum"] .tpl-forum-list-'+type).removeAttr('style');
			if(ch) {
                if(type=='category') {
                    $.forum.drawSelboxCategory($('.element[data-id="'+id+'"]'),id);
                    setTimeout(function() {
                    	$('#btn-config-forum-category').click();
                    },30);

                }

				$('.'+selectEL+'[data-type="forum"] .tpl-forum-'+type).removeClass('hidden');
				$('.'+selectEL+'[data-type="forum"] .tpl-forum-list-'+type).each(function() { $(this).removeClass('hidden'); });
			} else {
                if(type=='category') {
                    $('.element[data-id="'+id+'"] #scate').addClass('hidden');
                }

				// if(type=='category' && $('.element[data-id="'+id+'"]').find('#scate').length > 0) $('.element[data-id="'+id+'"] #scate').addClass('hidden');

				$('.'+selectEL+'[data-type="forum"] .tpl-forum-'+type).addClass('hidden');
				$('.'+selectEL+'[data-type="forum"] .tpl-forum-list-'+type).each(function(){ $(this).addClass('hidden'); });				
			}

			if(typeof $('.'+selectEL).attr('data-msny') != "undefined" && $('.'+selectEL).attr('data-msny')=="true")
				$('.'+selectEL).find('.container').masonry();

		}, 'json');


	});

	$doc.on('hidden.bs.modal', '.flat-forum-category-modal', function() {
		var pid = $(this).find('.modal[id*=flat-modal]').attr('data-pid');
		if($('.element[data-id="' + pid + '"]').find('#scate').length>0 && $('.element[data-id="' + pid + '"]').find('#scate').css('display') !== 'none') {
			$.forum.drawSelboxCategory($('.element[data-id="' + pid + '"]'),pid);
		}

	});

	$doc.on('click','#btn-config-forum-category',function(e) {
		var str = '',
			id = $(this).attr('data-id');

		$.post('/fm/category/list', { pid: id, sid: F_SID }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
				return false;
			}
			var forum_cate_modal = $(this).showModalFlat('EDIT FORUM CATEGORY', categoryConfigForum(data,id),true, false, '', 'close', '', 'w480 forum-category-modal').attr({'data-pid':id}).closest('.flat-modal').removeClass('flat-modal').addClass('flat-forum-category-modal');
		}, 'json');


        $('.forum-category-content:not(".empty")').sortable({  
            items: '.forum-category-item',
            cancel: '.forum-category-update-cancel, button, .forum-category-update-name',
            init: function(event,ui) {
                var start_idx = -1,
                	pid = '';
            },
            start: function(event,ui) {
                start_idx = ui.item.index();
                pid = $('.'+selectEL).attr('data-id');
            },
            update: function (event, ui) { 
                $(this).children().each(function(i,o) {
            		$(this).attr('id','forumCateSort'+i).attr('data-idx',i);
					$(this).find('[data-idx]').each(function() { $(this).attr('data-idx',i); });
					$.post('/fm/category/replace', { sid : F_SID, pid : pid, cate : $(this).attr('data-cate'), code : i+1 }, function(data) {
            			if(typeof data.error != "undefined" && data.error) {
							$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
							return false;
						}
					},'json');
                });
            }
        }).disableSelection();

	});

        

	//forum category Config (Add.Edit.Remove)
	var categoryConfigForum = function (data,id) {
		var empty = (data.length > 0) ? '' : 'empty',
			forum_category_list = '',
			str = '';

		$.each(data, function(i,v) {
			if(v) forum_category_list = forum_category_list + forumCategoryItem(v.fca_name.trim(), i,v.seq);
		});

		forum_category_list = (empty) ? "<p>" + $.lang[LANG]['editor.gallery.category.empty.str'] + "</p>" : forum_category_list;

		str = "\
        <div class='forum-category-header'>\
            <p>" + $.lang[LANG]['editor.gallery.category.config.title'] + "</p>\
        </div>\
        <div class='forum-category-content " +empty+ "'>\
            " + forum_category_list + "\
        </div>\
        <div class='btn-wrap'>\
            <span class='btn forum-category-add'><img src='//storage.googleapis.com/i.addblock.net/icon/fa_plus_icon.png' alt='' />&nbsp;\
                " + $.lang[LANG]['config.gallery.add'] + "\
            </span>\
        </div>\
        ";

		return str;
	}

	var forumCategoryItem = function(name,idx,seq) {
		var categoryAdd = (!name) ? "additem" : "",
			cate_seq = (!seq) ? "" : seq;

		var str = "\
			<div class='forum-category-item "+categoryAdd+"' id='forumCateSort" + idx + "' data-idx='" + idx + "' data-cate='" + cate_seq + "'>\
				<div class='forum-category-info'>\
					<span class='icons hand'><i class='fa fa-arrows'></i></span>\
					<span class='forum-category-name'>" + name +"</span>\
				</div>\
				<div class='forum-config-icons'>\
					<div class='icons hand'>\
						<i class='fa fa-pencil forum-category-edit' data-idx='"+idx+"' ></i>\
					</div>\
					<div class='icons hand'>\
						<img class='fa forum-category-delete hand' src='//storage.googleapis.com/i.addblock.net/icon/icon-menu-delete.png' data-idx='"+idx+"' ></i>\
					</div>\
				</div>\
			</div>\
		";
		return str;
	}

	var forumCategoryItemEmptyCheck = function() {
		if($('.forum-category-content').find('.forum-category-item').length == 0) {
			$('.forum-category-content').addClass('empty').html('<p>' + $.lang[LANG]['editor.gallery.category.empty.str'] + '</p>');
		} else {
			$('.forum-category-content').removeClass('empty').find('p').remove();

			$('.forum-category-content:not(".empty")').sortable({  
				items: '.forum-category-item',
				cancel: '.forum-category-update-cancel, button, .forum-category-update-name',
				update: function (event, ui) {
				}
			}).disableSelection();
		}
	}

	var addForumCategoryInput = function(cateidx, catename, cateseq) {
		var cateidx = (typeof cateidx == "undefined" || !cateidx) ? $('.forum-category-content .forum-category-item').length : cateidx,
			cateseq = (typeof cateseq == "undefined" || !cateseq) ? "" : cateseq,
			catename = (typeof catename == "undefined" || !catename) ? "" : catename,
		// catecode = (typeof catecode == "undefined" || !catecode) ? Number($('.forum-category-content .forum-category-item').last().attr('data-code')) + 1 : catecode,
			str = "\
				<div class='forum-category-update'>\
					<div class='input-group'>\
						<input type='text' class='forum-category-update-name forum-control' placeholder='" + $.lang[LANG]['editor.gallery.category.enter-name'] + "' value='" + catename + "'/>\
						<span class='input-group-btn'>\
							<button class='forum-category-update-save btn btn-active' data-id='" + selectID  +"' data-idx='"+cateidx+"' data-cate='"+cateseq+"'><i class='fa fa-check'></i></button>\
						</span>\
						<div class='forum-category-update-cancel'><i class='fa fa-times'></i></div>\
					</div>\
				</div>\
			";
		return str;
	}

	$doc.on('click', '.forum-category-delete', function(e) {
        var idx = $(this).attr('data-idx'),
        	cate = $('.forum-category-content #forumCateSort'+idx).attr('data-cate');
        
        var category_del_modal = $(this).showModalFlat('DELETE FORUM CATEGORY', $.lang[LANG]['editor.gallery.category.delete'], true, true, function() {

			$.post('/fm/category/delete', {  sid : F_SID, pid : selectID, cate: cate}, function(data) {
				if(typeof data.error != "undefined" && data.error) {
					return false;
				}
	            $('.forum-category-content #forumCateSort'+idx).remove();
	            $('.'+selectEL).find('#scate option[value="' + data.seq + '"]').remove();
				$('.'+selectEL).find('.tpl-forum-list-category[data-cate='+cate+']').text('');

				$('.forum-category-content .forum-category-item').each(function(i) {
					$(this).attr('id','forumCateSort'+i).attr('data-idx',i);
					$(this).find('[data-idx]').each(function() { $(this).attr('data-idx',i); });
				});

				forumCategoryItemEmptyCheck();
				category_del_modal.modal('hide');
			},'json');

        }, 'cancel');

	});

	$doc.on('click', '.forum-category-add', function(e) {
		if($('.forum-category-content').find('.forum-category-update').length > 0 ) {
			$('.forum-category-content').find('.forum-category-update-name').focus();
			return false;
		}
		
        var idx = $('.forum-category-content .forum-category-item').length,
            str = forumCategoryItem('',idx,'');
        	// code = (idx > 0) ? Number($('.forum-category-content .forum-category-item').last().attr('data-code')) + 1 : 1,

        $('.forum-category-content').append(str);

        forumCategoryItemEmptyCheck();
        $('.forum-category-edit[data-idx=' +idx +']').click();
	});

	$doc.on('click', '.forum-category-edit', function(e) {
        if($('.forum-category-content').find('.forum-category-update').length>0) return false;

        var cate_idx = $(this).attr('data-idx'),
			cate_seq = $('.forum-category-content').find('#forumCateSort'+cate_idx).attr('data-cate'),
			cate_name = $('.forum-category-content').find('#forumCateSort'+cate_idx).find('.forum-category-name').text();

        var input_text = addForumCategoryInput(cate_idx,cate_name,cate_seq);

        $(input_text).appendTo($('.forum-category-content').find('#forumCateSort'+cate_idx).find('.forum-category-info'));
        
        $('.forum-category-content').find('.forum-category-item').css('pointer-events','none');
        $('.forum-category-content').find('.forum-category-update-cancel, .forum-category-update-save, .forum-category-update-name').css('pointer-events','auto');
        $('.forum-category-update .forum-category-update-name').focus();
	});

	$doc.on('click', '.forum-category-update-cancel', function(e) {
		if(!$(this).closest('.forum-category-info').find('.forum-category-name').text()) {
			$(this).closest('.forum-category-item').remove();
			forumCategoryItemEmptyCheck();
		}
		$('.forum-category-content').find('.config-error').remove();
		$('.forum-category-content').find('.forum-category-item').removeAttr('style');
		$('.forum-category-content').find('.forum-category-update').remove();
	});

	$doc.on('click', '.forum-category-update-save', function(e) {
        var pid = $(this).attr('data-id'),
            idx = $(this).attr('data-idx'),
            cate_seq = $('.forum-category-content').find('#forumCateSort'+idx).attr('data-cate'),
            position = $('.forum-category-content'),
            category_name = $('.forum-category-update-name').val().trim(),
            category_prev = position.find('#forumCateSort'+idx+' .forum-category-name').text().trim(),
            regexp = /^[ㄱ-ㅎ가-힣ㅏ-ㅣa-zA-Z0-9\# ]+$/i,
            editcategoryname = (position.find('.forum-category-item').length > idx ) ? 'forum-category-edit' : '';

        $position = (editcategoryname) ? position.find('#forumCateSort'+idx) : position;

        $('.config-error').remove();

        if(category_prev == category_name) {
            if($('.forum-category-content #forumCateSort'+idx).hasClass('additem')) {
                $position.append('<div class="config-error '+editcategoryname+'">' + $.lang[LANG]['editor.gallery.category.enter-name'] + '</div>');
            } else {
                $('.forum-category-content').find('.forum-category-item').removeAttr('style');
                $('.forum-category-content').find('.forum-category-update').remove();
            }
            return false;
        }
        if(!regexp.test(category_name)) {
            $position.append('<div class="config-error '+editcategoryname+'">' + $.lang[LANG]['board.allowed-chars'] + '</div>');
            return false;
        }
        if(category_name.length<1) {
            $position.append('<div class="config-error '+editcategoryname+'">' + $.lang[LANG]['board.enter-group-name'] + '</div>');
            return false;
        }
        if(category_name.length>15) {
            $position.append('<div class="config-error '+editcategoryname+'">' + $.lang[LANG]['board.enter-max-chars.15'] + '</div>');
            return false;
        }
        var list =  position.find('.forum-category-item .forum-category-name').map(function() { return $(this).text().trim(); }).get();
        if($.inArray(category_name,list) > -1 ) {
            $position.append('<div class="config-error '+editcategoryname+'">' + $.lang[LANG]["editor.gallery.category.inuse-name"] + '</div>');
            return false;
        }


		$.post('/fm/category/update', {  sid : F_SID, pid : pid, cate: cate_seq, name : encodeURIComponent(category_name) }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				$position.append('<div class="config-error">' + data.error + '</div>');
				return false;
			}

			if($('#forumCateSort'+idx).hasClass('additem')) $('#forumCateSort'+idx).removeClass('additem');
			$('#forumCateSort'+idx).attr('data-cate',data.seq);
			$('#forumCateSort'+idx).find('.forum-category-name').text(category_name);

			position.find('.forum-category-item').removeAttr('style');
			position.find('.forum-category-update').remove();

			if($('.'+selectEL).find('#scate option[value="' + data.seq + '"]').length > 0 ) $('.'+selectEL).find('#scate option[value="' + data.seq + '"]').text(category_name);
			else $('.'+selectEL).find('#scate').append('<option value="'+data.seq+'">'+category_name+'</option>');

			$('.'+selectEL).find('.tpl-forum-list-category[data-cate='+data.seq+']').text(category_name);

		},'json');
	});


	$doc.on('change','#forum-config-fbtn',function(e) {
		var id = $(this).attr('data-id'),
			value = (!$(this).prop('checked')) ? true : false;

		$.getJSON('/template/element/type/get/seq/' + selectID, { sid : SID }, function(data) {
			checkError(data);
			var tag = htmlspecialchars_decode(data[0]['eltag']),
				el = $(tag)[0];
			$(el).find('.tpl-forum-write').attr('data-disabled',value);
			var tpl_return = $(el).outerHTML();
		    $.post('/template/element/type/update-text/seq/' + selectID, { tag: tpl_return, sid: SID }, function (update_data) {
		    	checkError(update_data);
		    	$('.'+selectEL).find('.tpl-forum-write').attr('data-disabled',value);
		    },'json');

		});
	});


	$doc.on('click','.ctrl-field-color',function(e) {
		var id = $(this).attr('data-id'),
			fcolor = $(this).attr('data-type');

		$(this).closest('.fcolor-box').find('.btn-color-mode').removeClass('active');
        $(this).parent('.btn-color-mode').addClass('active');

		var settings = {
			'forum_color' : fcolor
		}
		$.post('/template/settings', { sid : F_SID, settings : JSON.stringify(settings), el : id }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
				return false;
			}
			$('.element[data-id="' + id + '"]').attr('data-fcolor',fcolor);
		}, 'json');
	});

	var setForumCookie = function(id,page_num,stx,sfl,scate) {
		// Recent  forum only
		// var cookies = $.cookie();
		// for(var cookie in cookies) {
		// 	if( cookie.indexOf($.cookie('forum')) == -1 && cookie.indexOf('forum') > -1) {
		// 		$.removeCookie(cookie);
		// 	}
		// }

		$.cookie('forum',id,{path:'/'});
		$.cookie('forum_'+id, page_num,{path:'/'});
		if(typeof stx != 'undefined' && stx) {
			$.cookie('forum_'+id+'_sfl',sfl,{path:'/'});
			$.cookie('forum_'+id+'_stx',stx,{path:'/'});
		} else {
			$.removeCookie('forum_'+id+'_stx',{path:'/'});
		}

		if(typeof scate != 'undefined' && scate) {
			$.cookie('forum_'+id+'_scate',scate,{path:'/'});
		} else {
			$.removeCookie('forum_'+id+'_scate',{path:'/'});
		}

	}



	$doc.on('click','.descrip-field', function(e) {
		var id = $(this).attr('data-id');
		$.post('/fm/config', { id : id }, function(data) {
			if(typeof data.error != "undefined" && data.error) {
				$(this).showModalFlat('ERROR',data.error,true,false,'','ok');
				return false;
			}

			var fmholder_str = (typeof data.config.fmholder == "undefined") ? "" : data.config.fmholder.replace(/[<]br [/][>]/gi,'\n'),
				content = "\
					<div class='forum-description-field'>\
						<textarea class='form-control descript-field-box flat-desFd-modal' placeholder='" + $.lang[LANG]["board.description-field.textarea"] + "'>"+fmholder_str+"</textarea>\
					</div>\
				";

			var modal = $(this).showModalFlat($.lang[LANG]['board.description-field'],content,true,true,function(){

				var fmholder = $('.descript-field-box').val();

				if(fmholder_str == fmholder) {
					modal.modal('hide');
					return false;
				}
				$.post('/fm/setDescripField', { 'sid' : SID, 'fmpid' : selectID, 'fmholder' : fmholder}, function(r) { 
					$('.description-fd').text(fmholder);
					modal.modal('hide');
	            },'json');

			});
		},'json');
	});



	$doc.on('click','.upgrade-plan', function(e) {
//***********************************************************************************************************************바꾸기 아래
			// live
		// var upgrade_text = (SERVICE.indexOf('gabia') > -1) ? $.lang[LANG]['config.forum.new.email.upgrade.gabia'] : $.lang[LANG]['config.forum.new.email.upgrade'];

			// gabia test
		// var upgrade_text = (SERVICE.indexOf('gabia') == -1) ? $.lang[LANG]['config.forum.new.email.upgrade.gabia'] : $.lang[LANG]['config.forum.new.email.upgrade'];

		var upgrade_text = (SERVICE.indexOf('gabia') > -1) ? $.lang[LANG]['config.forum.new.email.upgrade.gabia'] : $.lang[LANG]['config.forum.new.email.upgrade'];
		$(this).showModalFlat('INFORMATION', upgrade_text, true, false, '', 'close');
	});

	//forum_email
	$doc.on('click', '.forum-email-title-edit', function(e) {
		var email = ($(this).hasClass('forum-email-title')) ? $(this).text() : $(this).next('.forum-email-title').text(),
			str = emailAddConfig(email,'forum');

		$(this).showModalFlat($.lang[LANG]['config.contact.email.add.upgrade-title'], str, true, false, '', 'close', '', 'w480').addClass('flat-emailadd-modal');
	});






}(jQuery));
