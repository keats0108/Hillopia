(function (jQuery) {
    jQuery.modalON = function (text) {
        var msg = (text) ? text : "";
        if ($('.ModalPlugin').length < 1) {
            $('body').prepend('<div class="ModalPlugin"><svg version="1.1" xmlns="http://www.w3.org/svg/2000" viewBox="0 0 30 30" width="60"><circle cy="15" cx="15" r="14" /></svg><p>' + msg + '</p></div>');
        }

        $('.ModalPlugin').css({
            "pointer-events":"none",
            "display": "inherit",
            "position": "fixed",
            "z-index": "99999999",
            "top": "0",
            "left": "0",
            "right": "0",
            "bottom": "0",
            "background": "#fff",
            "width": "100%",
            "text-align": "center",
            "height": "100%"
        });

        $('.ModalPlugin').show();
    }

    jQuery.modalOFF = function () {
        $('.ModalPlugin').remove();
    }

    jQuery.uploadON = function (text) {
        var msg = (text) ? text : "";
        if ($('.uploadModal').length < 1) {
            $('body').prepend('<div class="uploadModal"></div>');
            $('.uploadModal').append("<h1></h1>");
            $('.uploadModal').append('<div class="uploadModal-message"><i class="fa fa-spinner fa-pulse fa-fw margin-bottom" aria-hidden="true"></i> Uploading images...</div>');
        }
        /*
        if(msg) {
            $('.uploadModal h1').html(msg);
        }
        */

        $('.uploadModal').css({
            "display": "inherit",
            "position": "absolute",
            "z-index": "99999999",
            "top": "0",
            "left": "0",
            "width": "100%",
            "text-align": "center",
            "height": "100%",
            "background-color" : "rgba(0,0,0,0.75)"
        });

        $('.uploadModal h1').css({
            "position": "relative",
            "top": "20%",
            "color": "#666",
            "font-size": "20px",
            "text-transform": "uppercase",
            "max-width" : "700px",
            "margin": "0 auto",
        });
        $progress = $("<div id='file-upload-progress' class='file-upload-progress'></div>");
        $bar = $("<div class='progress-bar progress-bar-success'></div>");
        $progress.css({
            'height': '20px',
            'background-color':'#f5f5f5',
            'overflow' : 'hidden',
        });
        $progress.append($bar);
        if($('.uploadModal #file-upload-progress').length==0)
            $('.uploadModal h1').append($progress);

        $('.uploadModal').show();
    }

    jQuery.uploadOFF = function () {
        $('.uploadModal').fadeOut().remove();
    }

    jQuery.progressON = function(text) {
        var msg = (text) ? text : "";
        if ($('.progressModal').length < 1) {
            $('body').prepend('<div class="progressModal"></div>');
            $('.progressModal').append("<h1></h1>");
        }

        $('.progressModal').css({
            "display": "inherit",
            "position": "absolute",
            "z-index": "99999999",
            "top": "0",
            "left": "0",
            "width": "100%",
            "text-align": "center",
            "height": "100%",
            "background-color" : "rgba(0,0,0,0.75)"
        });

        $('.progressModal h1').css({
            "position": "relative",
            "top": "20%",
            "color": "#fff",
            "font-size": "13px",
            "max-width" : "700px",
            "margin": "20px auto",
        });

        $progress = $("<div id='file-upload-progress' class='file-upload-progress'></div>");
        $bar = $("<div class='progress-bar progress-bar-success'></div>");
        $progress.css({
            'height': '5px',
            'background-color':'#f5f5f5',
            'overflow' : 'hidden',
        });
        $progress.append($bar);
        if($('.progressModal #file-upload-progress').length==0)
            $('.progressModal h1').append($progress);

        if($('.progressModal h1 .progressModal-message').length==0)
            $('.progressModal h1').append('<div class="progressModal-message" style="padding-top:10px;"><i class="fa fa-spinner fa-pulse fa-fw margin-bottom" aria-hidden="true"></i> <span>' + text + '</span></div>');
        if(msg) {
            $('.progressModal .progressModal-message span').html(msg);
        }
        $('body').addClass('overflow-hidden');
        $('.progressModal').show();
    }

    jQuery.progressOFF = function() {
        $('body').removeClass('overflow-hidden');
        $('.progressModal').fadeOut().remove();
    }

    jQuery.processON = function(text,bg) {
        var msg = (text) ? text : "";
        bg = (bg) ? bg : "rgba(0,0,0,0.75)";
        if ($('.processModal').length < 1) {
            if($('.reorderModal').length) {
                $('.reorderModal').after('<div class="processModal"><svg version="1.1" xmlns="http://www.w3.org/svg/2000" viewBox="0 0 30 30" width="60"><circle cy="15" cx="15" r="14" /></svg><p>' + msg + '</p></div>');
            } else {
                $('body').prepend('<div class="processModal"><svg version="1.1" xmlns="http://www.w3.org/svg/2000" viewBox="0 0 30 30" width="60"><circle cy="15" cx="15" r="14" /></svg><p>' + msg + '</p></div>');
            }
        } else {
            $('.processModal').find('p').html(text);
        }

        $('.processModal').css({
            "display": "inherit",
            "position": "fixed",
            "z-index": "9999999999",
            "top": "0",
            "left": "0",
            "width": "100%",
            "text-align": "center",
            "height": "100%",
            "background-color" : bg
        });
        $('.processModal').fadeIn();
    }

    jQuery.processOFF = function() {
        $('.processModal').fadeOut().remove();
    }

    jQuery.guideON = function(step) {
        hideElementListPanel();
        var $guide = $('<div class="guideModal"></div>');

        if ($('.guideModal').length < 1) {
            $('body').prepend($guide);
            $('.guideModal').append('<div class="content"></div>')
            $('.guideModal').css({
                display: "inherit",
                position: "fixed",
                "z-index": "99999999",
                top: "0",
                left: "0",
                width: "100%",
                "text-align": "center",
                "background-color" : "transparent",
                height: "100%",
            });
            $('.guideModal .content').css({
                "width" : "100%",
                "height" : "100%",
                "background-color" : "rgba(0,0,0,0.6)",
                "margin-top" : "35px"
            });
            $('.guideModal').fadeIn();
        }

        $('.guideModal').find(".popover").fadeOut().remove();
        $('.menu-config.edit-menu').removeClass('active');
        $('.menu-config.edit-site').removeClass('active');
        $('.el_0_ctrl .config-element').css('z-index','4');
        $('.addElementButton').css('z-index','1');
        $('.config-image-edit').hide();
        $('.config-element').removeClass('disabled');
        $('.add-block').removeClass('disabled');

        switch(step) {
            case 1 : 
                $('.menu-config.edit-menu').addClass('active');
                var str = '\
                <div class="popover bottom">\
                    <div class="arrow"></div>\
                    <div class="popover-content" style="padding:15px 15px 10px;font-weight:600;">\
                        <p>' + $.lang[LANG]["editor.guide.steps.1"] + '</p>\
                    </div>\
                    <h3 style="padding:5px;overflow:auto;" class="popover-title" id="popover-bottom">\
                        <div class="pull-left"><span class="btn btn-default btn-sm" onclick="$.guideON();">' + $.lang[LANG]['config.close'] + '</span></div>\
                        <div class="pull-right"><span style="padding-right:5px;"> <b>1</b> / 7 </span><span class="btn btn-primary btn-sm" onclick="$.guideON(2);">' + $.lang[LANG]['editor.guide.next'] + '</span></div>\
                    </h3>\
                </div>\
                ';
                $step1 = $(str);
                $('.guideModal').find('.content').append($step1);
                $step1.css({
                    "top" : $('.editor-navbar').outerHeight()+2,
                    "left" : "0px"
                });

                $('.dsgn-body').scrollTop(0);
                $step1.fadeIn();
                break;

            case 2 :
                $('.menu-config.edit-site').addClass('active');
                var str = '\
                <div class="popover bottom">\
                    <div class="arrow"></div>\
                    <div class="popover-content" style="padding:15px 15px 10px;font-weight:600;">\
                        <p>' + $.lang[LANG]["editor.guide.steps.2"] + '</p>\
                    </div>\
                    <h3 style="padding:5px;overflow:auto;" class="popover-title" id="popover-bottom">\
                        <div class="pull-left"><button class="btn btn-default btn-sm" onclick="$.guideON()">' + $.lang[LANG]['config.close'] + '</button></div>\
                        <div class="pull-right"><span style="padding-right:5px;"> <b>2</b> / 7 </span><span class="btn btn-primary btn-sm" onclick="$.guideON(3);">' + $.lang[LANG]['editor.guide.next'] + '</span></div>\
                    </h3>\
                </div>\
                ';
                $step2 = $(str);
                $('.guideModal').find('.content').append($step2);
                $step2.css({
                    "top" : $('.editor-navbar').outerHeight()+2,
                    "left" : "268px"
                });
                $step2.fadeIn();
                break;

            case 3:
                $('.menu-config.edit-site').removeClass('active');
                $('.element').removeClass('active');
                if($('.el_0').length<1) {
                    $.guideON(13);
                    return false;
                }
                $('.el_0_ctrl').hide();
                $('.config-element-section').first().show().addClass('active');
                //$('.el_0_ctrl').show();

                var popover_direction = ($('header').hasClass('sidebar')) ? 'right' : 'left',
                    arrow_style = (popover_direction == 'right') ? 'style="left:-8px; margin-top: -8px; border-right: none;"' : '';
                var str = '\
                <div class="popover '+popover_direction+'">\
                    <div class="arrow" '+arrow_style+'></div>\
                    <div class="popover-content" style="padding:15px 15px 10px;font-weight:600;">\
                        <p>' + $.lang[LANG]["editor.guide.steps.3"] + '</p>\
                    </div>\
                    <h3 style="padding:5px;overflow:auto;" class="popover-title" id="popover-bottom">\
                        <div class="pull-left"><button class="btn btn-default btn-sm" onclick="$.guideON()">' + $.lang[LANG]['config.close'] + '</button></div>\
                        <div class="pull-right"><span style="padding-right:5px;"> <b>3</b> / 7 </span><span class="btn btn-primary btn-sm" onclick="$.guideON(4);">' + $.lang[LANG]['editor.guide.next'] + '</span></div>\
                    </h3>\
                </div>\
                ';
                $step3 = $(str);
                $('.guideModal').find('.content').append($step3);
                var right = ($('header').hasClass('sidebar')) ? 'inherit' : '80px',
                    left = ($('header').hasClass('sidebar')) ?  '270px' : 'inherit';
                $step3.css({
                    "left" : left,
                    "top"  : 0,
                    "right" : right
                });
                $step3.fadeIn();
                $('.el-menu_ctrl').show().css('z-index','99999999');
                addElementButtonDisplay('el_0');
                break;

            case 4:
                $('.el-menu_ctrl').hide();
                var winHeight = $('.dsgn-body').height(),
                    elOffsetTop = $('.addel_0').offset().top;

                var arrow = (winHeight>elOffsetTop) ? "bottom" : "top";
                $('.addElementButton').css('z-index','99999999');
                $('.add-block').removeClass('disabled').css('z-index','99999999');
                $('.addel_0 li .add-block').show().css('z-index','99999999');

                var str = '\
                <div class="popover ' + arrow + '">\
                    <div class="arrow"></div>\
                    <div class="popover-content" style="padding:15px 15px 10px;font-weight:600;">\
                        <p>' + $.lang[LANG]["editor.guide.steps.4"] + '</p>\
                    </div>\
                    <h3 style="padding:5px;overflow:auto;" class="popover-title" id="popover-bottom">\
                        <div class="pull-left"><button class="btn btn-default btn-sm" onclick="$.guideON()">' + $.lang[LANG]['config.close'] + '</button></div>\
                        <div class="pull-right"><span style="padding-right:5px;"> <b>4</b> / 7 </span><span class="btn btn-primary btn-sm" onclick="$.guideON(5);">' + $.lang[LANG]['editor.guide.next'] + '</span></div>\
                    </h3>\
                </div>\
                ';
                $step4 = $(str);
                $('.guideModal').find('.content').append($step4);

                var left = ($('.dsgn-body').width()/2) - ($step4.width()/2) - 10;
                if($('header').hasClass('sidebar')) left = left + 260;

                if(elOffsetTop>winHeight) {
                    $('.dsgn-body').animate({scrollTop:elOffsetTop-($('.dsgn-body').height()/2)},'500','swing', function() {
                        var top = $('.addel_0').offset().top - 150;
                        $step4.css({
                            "top" : top + "px",
                            "left" : left + "px"
                        });
                        $step4.fadeIn();
                    });
                } else {
                    if(winHeight/2 > elOffsetTop) {
                        $step4.removeClass(arrow).addClass('bottom');
                        var top = elOffsetTop + 40;
                        $step4.css({
                            "top" : top + "px",
                            "left" : left + "px"
                        });
                        $step4.fadeIn();
                    } else {
                        $step4.removeClass(arrow).addClass('top');
                        var top = elOffsetTop -150;
                        $step4.css({
                            "top" : top + "px",
                            "left" : left + "px"
                        });
                        $step4.fadeIn();
                    }
                }
                break;

            case 5: 
                showElList();

                var str = '\
                <div class="popover right">\
                    <div class="arrow" style="left:-8px; margin-top: -8px; border-right: none;"></div>\
                    <div class="popover-content" style="padding:15px 15px 10px;font-weight:600;">\
                        <p>' + $.lang[LANG]["editor.guide.steps.5"] + '</p>\
                    </div>\
                    <h3 style="padding:5px;overflow:auto;" class="popover-title" id="popover-bottom">\
                        <div class="pull-left"><button class="btn btn-default btn-sm" onclick="$.guideON()">' + $.lang[LANG]['config.close'] + '</button></div>\
                        <div class="pull-right"><span style="padding-right:5px;"> <b>5</b> / 7 </span><span class="btn btn-primary btn-sm" onclick="$.guideON(6);">' + $.lang[LANG]['editor.guide.next'] + '</span></div>\
                    </h3>\
                </div>\
                ';
                $step5 = $(str);
                $('.guideModal').find('.content').append($step5);
                var top = ($('.dsgn-body').height()/2) - ($step5.height()/2);
                $step5.css({
                    "top" : top + "px",
                    "left" : "320px"
                });
                $step5.fadeIn(function() {
                    $('.guideModal .content').css('margin-left','315px');
                });
                break;

            case 6:
                $('.guideModal .content').css('margin-left','0px');
                hideElementListPanel();
                var str = '\
                <div class="popover bottom">\
                    <div class="arrow"></div>\
                    <div class="popover-content" style="padding:15px 15px 10px;font-weight:600;">\
                        <p>' + $.lang[LANG]["editor.guide.steps.6"] + '</p>\
                    </div>\
                    <h3 style="padding:5px;overflow:auto;" class="popover-title" id="popover-bottom">\
                        <div class="pull-left"><button class="btn btn-default btn-sm" onclick="$.guideON();">' + $.lang[LANG]['config.close'] + '</button></div>\
                        <div class="pull-right"><span style="padding-right:5px;"> <b>6</b> / 7 </span><span class="btn btn-primary btn-sm" onclick="$.guideON(7);">' + $.lang[LANG]['editor.guide.next'] + '</span></div>\
                    </h3>\
                </div>\
                ';
                $step6 = $(str);
                $('.guideModal').find('.content').append($step6);
                var left = $('#change-mode').offset().left - ($step6.width()/2) + ($('#change-mode').width()/2);
                $step6.css({
                    "top" : $('.editor-navbar').outerHeight()+2,
                    "left" : left + "px"
                });
                $step6.fadeIn();

                break;

            case 7:
                $('.guideModal .content').css('margin-left','0px');
                hideElementListPanel();
                var str = '\
                <div class="popover bottom">\
                    <div class="arrow"></div>\
                    <div class="popover-content" style="padding:15px 15px 10px;font-weight:600;">\
                        <p>' + $.lang[LANG]["editor.guide.steps.7"] + '</p>\
                    </div>\
                    <h3 style="padding:5px;text-align:right;" class="popover-title" id="popover-bottom"><span style="padding-right:5px;"> <b>7</b> / 7 </span><span class="btn btn-primary btn-sm" onclick="$.guideON();">' + $.lang[LANG]['editor.guide.start'] + '</span></h3>\
                </div>\
                ';
                $step7 = $(str);
                $('.guideModal').find('.content').append($step7);
                var left = $('#config-publishing').offset().left - ($step7.width()/2) + ($('#config-publishing').width()/2);
                $step7.css({
                    "top" : $('.editor-navbar').outerHeight()+2,
                    "left" : left + "px"
                });
                $step7.fadeIn();

                break;
            case 13:
                $('.el-menu').addClass('active');
                $('.config-element-section').hide();
                $('.el-menu_ctrl').show();

                var str = '\
                <div class="popover left">\
                    <div class="arrow"></div>\
                    <div class="popover-content" style="padding:15px 15px 10px;font-weight:600;">\
                        <p>메뉴변경, 이미지 업로드, 배경색, 여백 조절 등 블럭의 세부사항을 설정할 수 있습니다.</p>\
                    </div>\
                    <h3 style="padding:5px;overflow:auto;" class="popover-title" id="popover-bottom">\
                        <div class="pull-left"><button class="btn btn-default btn-sm" onclick="$.guideON()">' + $.lang[LANG]['config.close'] + '</button></div>\
                        <div class="pull-right"><span style="padding-right:5px;"> <b>3</b> / 7 </span><span class="btn btn-primary btn-sm" onclick="$.guideON(14);">' + $.lang[LANG]['editor.guide.next'] + '</span></div>\
                    </h3>\
                </div>\
                ';
                $step3 = $(str);
                $('.guideModal').find('.content').append($step3);
                var top = $('.el-menu_ctrl').offset().top - ($step3.height()/2)+27;
                $step3.css({
                    "top" : top + "px",
                    "left" : "inherit",
                    "right" : "80px"
                });
                $step3.fadeIn();
                $('.config-element').addClass('disabled');
                $('.el-menu_ctrl .config-element').css('z-index','99999999');
                //addElementButtonDisplay('el_0');

                break;

            case 14:
                $('.el-menu_ctrl .config-element').hide();
                var str = '\
                <div class="popover right">\
                    <div class="arrow"></div>\
                    <div class="popover-content" style="padding:15px 15px 10px;font-weight:600;">\
                        <p>현재 선택된 위치에 블럭을 추가하여 사이트를 만들 수 있습니다.</p>\
                    </div>\
                    <h3 style="padding:5px;overflow:auto;" class="popover-title" id="popover-bottom">\
                        <div class="pull-left"><button class="btn btn-default btn-sm" onclick="$.guideON()">' + $.lang[LANG]['config.close'] + '</button></div>\
                        <div class="pull-right"><span style="padding-right:5px;"> <b>4</b> / 7 </span><span class="btn btn-primary btn-sm" onclick="$.guideON(5);">' + $.lang[LANG]['editor.guide.next'] + '</span></div>\
                    </h3>\
                </div>\
                ';
                $step4 = $(str);
                var top = $('.addEL-wrap').offset().top + ($('.addEL-wrap').height()/2) - 90;
                $step4.css({
                    'top' : top + 'px',
                    'left': '50%',
                    'margin-left' : '100px'
                });
                $('.guideModal').find('.content').append($step4);
                $step4.fadeIn();
                break;
            default : 
                var settings = {
                    showGuide : 'none'
                }

                $.post('/template/settings',{ sid : SID, settings : JSON.stringify(settings) }, function(data) {
                    checkError(data);
                },'json');

                $('.guideModal').find(".popover").fadeOut().remove();
                $('.menu-config.edit-menu').removeClass('active');
                $('.menu-config.edit-site').removeClass('active');
                $('.el_0_ctrl .config-element').css('z-index','4');
                $('.addElementButton').css('z-index','1').hide();
                $('.config-image-edit').hide();
                $('.config-element').removeClass('disabled');
                $('.add-block').removeClass('disabled');
                $('.config-element-section.active').removeClass('active').fadeOut();
                $('.guideModal').fadeOut().remove();
                //$.quickON(0);
                $.guideVideoON();
                break;
        }
    }

    jQuery.quickON = function(menu) {
        hideElementListPanel();
        var $quick = $('<div class="quickModal"></div>'),
            $content = $('<div class="content"></div>');

        if ($('.quickModal').length < 1) {
            $('body').prepend($quick);
            /*$content.on('click',function() {
                $.quickOFF();
            });*/
            $content.css({
                "width" : "100%",
                "height" : "100%",
                "background-color" : "rgba(0,0,0,0.6)",
                "display" : "none"
            });

            $quick.append($content);
            $quick.css({
                "display": "inherit",
                "position": "fixed",
                "z-index": "99999999",
                "top": "0",
                "left": "0",
                "width": "100%",
                "height": "100%",
                "text-align": "center",
                "background-color" : "transparent"
            });
            $quick.fadeIn();

            var $guide = $('<div class="guide">'),
                $close = $('<div class="close"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-modal.png" alt="close" /></div>'),
                $header = $('<div class="header"><h2>' + $.lang[LANG]["editor.guide-title"] + '</h2></div>'),
                $linksWrap = $('<div class="links-wrap"></div>'),
                $mainguide = $('<span class="mainguide"><i class="fa fa-plus-circle"></i>' + $.lang[LANG]["editor.guide.walkthrough"] + '</sort-page-linen>'),
                $supportLink = $('</div><span class="support-link-wrap"><a class="support-link" href="/support" target="_blank"><i class="fa fa-plus-circle"></i>' + $.lang[LANG]["editor.guide.support-center"] + '</a></span>'),
                $body = $('<div class="body"></div>'),
                $sidebar = $('<div class="sidebar"></div>'),
                nav = new Array( $.lang[LANG]["editor.guide.tutorial-video"], $.lang[LANG]["editor.menu-config"], $.lang[LANG]["editor.site-config"], $.lang[LANG]["config.element-config"], $.lang[LANG]["editor.guide.add-blocks"], $.lang[LANG]["editor.image.add-change"], $.lang[LANG]["editor.guide.edit-text"], $.lang[LANG]["editor.guide.gallery"], $.lang[LANG]["editor.guide.preview-publish"]),
                $nav = $('<ul class="nav"></ul>'),
                $bottom = $('<div class="bottom"></div>');

            $mainguide.on('click', function() {
                $.quickOFF();
                $.guideON(1);
            });

            $close.on('click',function() { $.quickOFF(); });

            // 임시 - 한국어 동영상이 완료될 때까지 만 
            if (LANG != 'en') {
               nav.shift();
            }

            $.each(nav, function(i,v){
                $li = $('<li class="'+i+'">'+v+'<img src="https://storage.googleapis.com/i.addblock.net/config/fa_thin_right_w.png" alt="" /></li>');
                $nav.append($li);
            });
            $navli = $nav.children();
            $navli.on('click',function() {
                var classtext = $(this).attr('class');
                $.quickON(Number(classtext.substring(0,1)));
            });
            $sidebar.append($nav).append($bottom);

            var $contentbox = $('<div class="contentbox"></div>');

            $body.append($sidebar).append($contentbox);
            $linksWrap.append($mainguide, $supportLink);
            $header.append($linksWrap);
            $guide.append($header).append($close).append($body);
            $content.append($guide);
            $content.fadeIn();

        }

        var $thisContent = $('.quickModal .contentbox'),
            $thisMenu = $('.quickModal .sidebar .nav li');
        $thisMenu.removeClass('active');
        $thisMenu.eq(menu).addClass('active');

        var lang;

        if (LANG == 'en') {
            lang = '_' + LANG;

            // 제임스: 임시로 여기로 옮겼음 (나중에 한 switch으로 할 예정)
            switch(menu) {
                case 0 :  /* 가이드 동영상 */

                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["editor.guide.tutorial-video"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.tutorial-video.text"] + '</p></li>\
                    </ul>\
                    ';

                    var $quickVideoWrap = $('<li></li>'),
                        $tutorialVideo = $('<div class="tutorial-video"></div>'),
                        $videoWrap = $('<div class="video-wrap guideVideo-stopPlay"><div id="quick-guide-video-overlay"></div></div>');

                    $menu0 = $(str);
                    $tutorialVideo.append( $videoWrap ); 
                    $quickVideoWrap.append( $tutorialVideo );
                    $menu0.append( $quickVideoWrap );

                    $thisContent.empty();
                    $thisContent.append($menu0);
                    $menu0.fadeIn();

                    $videoWrap.on('click', function() {

                        $(this).toggleClass('guideVideo-stopPlay');

                        if(!$(this).hasClass('guideVideo-stopPlay')) {
                            if ( LANG == 'en' )
                                var link = "https://www.youtube.com/embed/p6fyIMl2BcI";

                            var html = '<iframe class="video embed-responsive-item" width="765" height="380" src="' + link + '?enablejsapi=1&rel=0&vq=large&wmode=opaque&showinfo=0&controls=1&autoplay=0&loop=0;playlist=Fn0Mpyh3xto;" frameborder="0" allowfullscreen></iframe>';
                            $(this).html(html);
                        }
                    });   

                    break;
                case 1 :  /*메뉴 설정*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["editor.menu-config"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.menu-config.text.1"] + '</p></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_0_1' + lang + '.png " alt="" /></li>\
                    </ul>\
                    ';
                    $menu1 = $(str);

                    $thisContent.empty();
                    $thisContent.append($menu1);
                    $menu1.fadeIn();
                    break;
                case 2 :  /*사이트 설정*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["editor.site-config"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.site-config.text.1"] + '</p></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_1_1' + lang + '.png" alt="" /></li>\
                    </ul>\
                    ';
                    $menu2 = $(str);
                    $thisContent.empty();
                    $thisContent.append($menu2);
                    $menu2.fadeIn();
                    break;
                case 3 :  /*블럭 설정*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["config.element-config"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.element-config.text.1"] + '</p></li>\
                        <li><h6><img src="https://storage.googleapis.com/i.addblock.net/config/fa_exclamation.png" alt="" class="fa"/> ' + $.lang[LANG]["editor.guide.element-config.text.note"] + '</h6></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_2_1' + lang + '.png" alt="" /></li>\
                    </ul>\
                    ';
                    $menu3 = $(str);
                    $thisContent.empty();
                    $thisContent.append($menu3);
                    $menu3.fadeIn();
                    break;
                case 4 :  /*블럭 추가*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["editor.guide.add-blocks"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.add-block.text.1"] + '</p></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_3_1' + lang + '.png" alt="" /></li>\
                    </ul>\
                    ';
                    $menu4 = $(str);
                    $thisContent.empty();
                    $thisContent.append($menu4);
                    $menu4.fadeIn();
                    break;
                case 5 :  /*이미지 추가/변경*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["editor.image.add-change"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.add-change-images.text.1"] + '</p></li>\
                        <li><h6><img src="https://storage.googleapis.com/i.addblock.net/config/fa_exclamation.png" alt="" class="fa"/>' + $.lang[LANG]["editor.guide.add-change-images.text.note"] + '</h6></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_4_1.png" alt="" /></li>\
                    </ul>\
                    ';
                    $menu5 = $(str);
                    $thisContent.empty();
                    $thisContent.append($menu5);
                    $menu5.fadeIn();
                    break;
                case 6 :  /*텍스트*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["config.text"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.edit-text.text.1"] + '</p></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_5_1' + lang + '.png" alt="" /></li>\
                    </ul>\
                    ';
                    $menu6 = $(str);
                    $thisContent.empty();
                    $thisContent.append($menu6);
                    $menu6.fadeIn();
                    break;
                case 7 :  /*갤러리*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["editor.block.gallery"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.gallery.text.1"] + '</p></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_6_1.png" alt="" /></li>\
                        <li><hr /></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.gallery.text.2"] + '</p></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_6_2' + lang + '.png" alt="" /></li>\
                        <li><h6><img src="https://storage.googleapis.com/i.addblock.net/config/fa_exclamation.png" alt="" class="fa"/> ' + $.lang[LANG]["editor.guide.gallery.text.note"] + '</h6></li>\
                    </ul>\
                    ';
                    $menu7 = $(str);
                    $thisContent.empty();
                    $thisContent.append($menu7);
                    $menu7.fadeIn();
                    break;
                case 8 :  /*저장/게시*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["editor.guide.preview-publish"] + '</h4></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_7_1' + lang + '.png" alt="" style="margin-top: 0"/></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.preview-publish.text.1"] + '</p></li>\
                        <li><h6><img src="https://storage.googleapis.com/i.addblock.net/config/fa_exclamation.png" alt="" class="fa"/> ' + $.lang[LANG]["editor.guide.preview-publish.text.note"] + '</h6></li>\
                    </ul>\
                    ';
                    $menu8 = $(str);
                    $thisContent.empty();
                    $thisContent.append($menu8);
                    $menu8.fadeIn();
                    break;
                default : 
                    $.quickOFF();
                    break;
            }
        }
        else {
            lang = '';

            // 제임스: 임시로 여기로 옮겼음 (나중에 한 switch으로 할 예정)
            switch(menu) {
                case 0 :  /*메뉴 설정*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["editor.menu-config"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.menu-config.text.1"] + '</p></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_0_1' + lang + '.png " alt="" /></li>\
                    </ul>\
                    ';
                    $menu0 = $(str);

                    $thisContent.empty();
                    $thisContent.append($menu0);
                    $menu0.fadeIn();
                    break;
                case 1 :  /*사이트 설정*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["editor.site-config"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.site-config.text.1"] + '</p></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_1_1' + lang + '.png" alt="" /></li>\
                    </ul>\
                    ';
                    $menu1 = $(str);
                    $thisContent.empty();
                    $thisContent.append($menu1);
                    $menu1.fadeIn();
                    break;
                case 2 :  /*블럭 설정*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["config.element-config"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.element-config.text.1"] + '</p></li>\
                        <li><h6><img src="https://storage.googleapis.com/i.addblock.net/config/fa_exclamation.png" alt="" class="fa"/> ' + $.lang[LANG]["editor.guide.element-config.text.note"] + '</h6></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_2_1' + lang + '.png" alt="" /></li>\
                    </ul>\
                    ';
                    $menu2 = $(str);
                    $thisContent.empty();
                    $thisContent.append($menu2);
                    $menu2.fadeIn();
                    break;
                case 3 :  /*블럭 추가*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["editor.guide.add-blocks"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.add-block.text.1"] + '</p></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_3_1' + lang + '.png" alt="" /></li>\
                    </ul>\
                    ';
                    $menu3 = $(str);
                    $thisContent.empty();
                    $thisContent.append($menu3);
                    $menu3.fadeIn();
                    break;
                case 4 :  /*이미지 추가/변경*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["editor.image.add-change"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.add-change-images.text.1"] + '</p></li>\
                        <li><h6><img src="https://storage.googleapis.com/i.addblock.net/config/fa_exclamation.png" alt="" class="fa"/>' + $.lang[LANG]["editor.guide.add-change-images.text.note"] + '</h6></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_4_1.png" alt="" /></li>\
                    </ul>\
                    ';
                    $menu4 = $(str);
                    $thisContent.empty();
                    $thisContent.append($menu4);
                    $menu4.fadeIn();
                    break;
                case 5 :  /*텍스트*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["config.text"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.edit-text.text.1"] + '</p></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_5_1' + lang + '.png" alt="" /></li>\
                    </ul>\
                    ';
                    $menu5 = $(str);
                    $thisContent.empty();
                    $thisContent.append($menu5);
                    $menu5.fadeIn();
                    break;
                case 6 :  /*갤러리*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["editor.block.gallery"] + '</h4></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.gallery.text.1"] + '</p></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_6_1.png" alt="" /></li>\
                        <li><hr /></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.gallery.text.2"] + '</p></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_6_2' + lang + '.png" alt="" /></li>\
                        <li><h6><img src="https://storage.googleapis.com/i.addblock.net/config/fa_exclamation.png" alt="" class="fa"/> ' + $.lang[LANG]["editor.guide.gallery.text.note"] + '</h6></li>\
                    </ul>\
                    ';
                    $menu6 = $(str);
                    $thisContent.empty();
                    $thisContent.append($menu6);
                    $menu6.fadeIn();
                    break;
                case 7 :  /*저장/게시*/
                    var str = '\
                    <ul>\
                        <li><h4>' + $.lang[LANG]["editor.guide.preview-publish"] + '</h4></li>\
                        <li><img src="https://storage.googleapis.com/i.addblock.net/config/quickguid_7_1' + lang + '.png" alt="" style="margin-top: 0"/></li>\
                        <li><p>' + $.lang[LANG]["editor.guide.preview-publish.text.1"] + '</p></li>\
                        <li><h6><img src="https://storage.googleapis.com/i.addblock.net/config/fa_exclamation.png" alt="" class="fa"/> ' + $.lang[LANG]["editor.guide.preview-publish.text.note"] + '</h6></li>\
                    </ul>\
                    ';
                    $menu7 = $(str);
                    $thisContent.empty();
                    $thisContent.append($menu7);
                    $menu7.fadeIn();
                    break;
                default : 
                    $.quickOFF();
                    break;
            }
        }

    }

    jQuery.quickOFF = function() {
        $('.quickModal').fadeOut(function() {
            $(this).remove();  
        });
    }

    jQuery.reorderON = function() {
        var enable = true;
        if($('.ctrl-reorder').hasClass('disabled')) return;
        if(VIEW && COUNT<2) {
            alert('순서 변경을 위해서는 최소한 2개 이상의 블럭이 필요합니다');
            return false;
        }
        /*
        $.getJSON('/template/contents/sid/' + SID + '/page/' + PAGE, function(data) {
            checkError(data);
            if(data.length<2) {
                alert('순서 변경을 위해서는 최소한 2개 이상의 블럭이 필요합니다');
                enable = false; 
            }
        });
        if(!enable) return false;
        */

        var el = [], idx = 0;
        var toolbar = ($('.editor-navbar').css('display')=="none") ? 0 : 35;
        var sidebar = ($('header').hasClass('sidebar')) ? true : false;

        $.each($('.element'),function(i,v) {
            if($(v).data('el')=='el-menu' || $(v).data('el')=='el-footer' || $(v).hasClass('add-footer-information')) return;
            el[idx] = $(v).attr('data-el') + '|' + ($(v).offset().top - toolbar) + '-' + $(v).outerHeight();    
            idx++;
        });
        eloffSet = el.toString();

        var $reorder = $('<div class="reorderModal"></div>');

        if($('.reorderModal').length < 1) {
            $reorder.css({
                "position" : "fixed",
                "width" : "100%",
                "height" : "100%",
                "background" : "rgba(0,0,0,1)",
                "z-index" : "10000000000",
                "display" : "none",
                "overflow" : "auto"
            });
            $('body').prepend($reorder);
            var $content = $('<div class="content" style="min-height:900px;"></div>'),
                $scale = $('<div class="scale"></div>'),
                $h1 = $("<h1 class='fixed-btn-wrap'><span class='title'>" + $.lang[LANG]['editor.reorder-blocks.title'] + "</title></h1>").css({
                    'position' : 'fixed',
                    'width' : '100%',
                    'right' : '15px',
                    'margin' : '0',
                    'padding-top' : '30px',
                    'padding-right' : '40px',
                    'overflow' : 'auto',
                    'padding-bottom' : '20px',
                    'padding-left' : '30px',
                    'font-size' : '18px',
                    'letter-spacing' : '2px',
                    'color' : '#fff',
                    'background-color' : 'transparent',
                    'font-family' : 'Raleway,"Nanum gothic"',
                    'top': '0',
                    'z-index': '1'
                });
                $sub = $("<span class='sub'>" + $.lang[LANG]['editor.reorder-blocks.text.1'] + "</span>").css({
                    'font-family' : 'Raleway,"Nanum gothic"',
                    'color' : '#a5a5a5',
                    'font-size' : '13px',
                    'padding-left' : '20px',
                    'line-height' : '20px',
                    'letter-spacing' : '0px',
                });
                $h1.append($sub);
            $save = $("<span class='btn btn-primary btn-flat btn-sm pull-right'>" + $.lang[LANG]['config.save'] + "</span>"),
            $close = $("<span class='btn btn-default btn-flat btn-sm pull-right'>" + $.lang[LANG]['config.close'] + "</span>").css('margin-right','10px');

            $close.on('click',function() {
                $.processON($.lang[LANG]["config.reorder.loading"]);
                if(!prevONE && !VIEW) {
                    var check = 'false';
                    $.ajax({
                        type: 'POST',
                        url: '/template/update/type/onepage',
                        data: { id : SID, s : check },
                        dataType: 'json',                    
                        async: true,
                        success: function(data) {
                            internalLink = true;
                            var refer = prevPAGE.replace(",","/view/");
                            location.replace('/config/page/' + refer);
                            $.processOFF();
                            $.reorderOFF();
                        }
                    });                      
                } else {
                    $.processOFF();
                    $.reorderOFF();
                }
            });

            $save.on('click',function() {
                $.processON($.lang[LANG]["config.reorder.loading"]);

                var rPage = '';
                $.each($('.el-sortable').children(), function(i,v) {
                    var page_name = $(v).attr('data-result-page');
                    if(typeof page_name !='undefined' && page_name && $(v).hasClass('sort-empty')) {
                        rPage = $(v).attr('data-result-page');
                        return true;
                    }

                    $(v).attr('data-reorder-page',rPage);
                });
                var r = [];
                $.each($('.reorderBlock'), function(i,v) {
                    tmp = $(this).attr('data-reorder-page') + ':' + $(this).attr('data-id');
                    r.push(tmp);
                });

                $.ajax({
                    type: 'POST',
                    url: '/template/update/type/block-reorder',
                    data: { s: JSON.stringify(r), id: SID, page: PAGE, onepage : ONE},
                    async:false,
                    cache: false,
                    success: function (data) {
                        var type = getElementType();
                        setLogs(type,"block.reorder","block-sort","");
                        $('.element').removeClass('active').removeClass('el-active');
                        $('#el-property').hide();

                        if(!prevONE) {
                            var check = 'false';
                            $.ajax({
                                type: 'POST',
                                url: '/template/update/type/onepage',
                                data: { id : SID, s : check },
                                dataType: 'json',                    
                                async: true,
                                success: function(r) {
                                    internalLink = true;
                                    var refer = prevPAGE.replace(",","/view/");
                                    location.replace('/config/page/' + refer);
                                    $('.el-sortable').empty();
                                    $.processOFF();
                                    $.reorderOFF();
                                }
                            });                      
                        } else {
                            $('.el-sortable').empty();
                            $.processOFF();
                            $.reorderOFF();
                            checkError(data);
                            showPageCallback(showPage);
                        }
                    }
                });
                /*
                var ids = [];
                $.each($('.render'), function(i,v) {
                    if(typeof $(v).attr('data-id') != 'undefined') ids.push($(v).attr('data-id').trim());
                });

                $.post('/template/update/type/block-reorder',{ id : SID, page : PAGE, s:ids.join(",")}, function(data) {
                    checkError(data);
                },'json');
                return false;
                */
            });

            $content.append($h1);
            $h1.append($save);
            $h1.append($close);
            $content.append($scale);
            $reorder.append($content);
            $reorder.fadeIn();

            //var $scale = $("<div class='scale'></div>");
            //$scale.css('color',$('.dsgn-body').css('color'));
            var pages = -1, pageIndex = 0, pageEL = [];
            var pageList = [];

            
            $.each($('.element'),function(i,v) {
                if($(v).hasClass('el-menu') || $(v).hasClass('el-footer') || $(v).hasClass('add-footer-information')) return true;
                var classes = $(v).attr('class').split(/\s+/);
                if(ONE) {
                    $.each(classes,function(index,item) {
                        if(item.match(/link-to-\S+/g)) {
                            var name_check = item.replace('link-to-','');
                            if($.inArray(name_check,MENULINK) > -1) {
                                pages++;
                                pageIndex=0;
                                pageList[pages] = [];
                            }
                        }
                    });
                } else {
                    if(i==1) {
                        pages++;
                        pageList[pages] = [];
                    }
                }
                pageList[pages][pageIndex] = $(v).attr('data-el').replace(/ /g,"-");
                pageIndex++;
            });

            var elIndex = 0;
            var $sort = $("<div class='el-sortable'></div>");
            $sort.css('color',$('.dsgn-body').css('color'));

            var pageMenu = [];

            //$.each(SMENU,function(i,v) {
            $.each(MENULINK,function(i,v) {
                pageMenu.push(v.replace(/ /g,"-"));
                //if(v.display == 'on') pageMenu.push(v.name);
            });
            if(PAGE!='index') {
                pageMenu = new Array()  ;
                pageMenu[0] = PAGE;
                pageList = pageList.filter(function(){return true;});
            }

            $.each(pageMenu, function(index,val) {

                var $empty = $("<div class='render sort-empty' data-result-page='" + val + "'>&nbsp;</div>"),
                    $pageLine = $("<div class='sort-page-line'></div>"),
                    pageName = val.replace(/,/,"/"),
                    menulist_index = $.inArray(pageName,MENULIST),
                    pageNameOrg = (index==0 && pageName=='INTRO') ? pageName : $('#nestable').find('.dd-item').eq(menulist_index-1).attr('data-id'),
                    $pageInfo = $("<div class='sort-page-info'>" + pageNameOrg + "</div>"),
                    isLink = (index==0 && pageName=='INTRO' || menulist_index == -1) ? false : $('#nestable').find('.dd-item').eq(menulist_index-1).find('.menu-link').first().hasClass('active');
                
                if(pageName.indexOf("/")>-1) $pageInfo.addClass('hide');

                if($('#nestable *[data-id="' + pageNameOrg + '"]').length) {

                    var pMenu = $('#nestable *[data-id="' + pageNameOrg + '"]').parents('.dd-item').attr('data-id');
                    if(typeof pMenu != 'undefined') $empty.append("<div class='sort-page-menu'>" + pMenu + "</div>");
                }
                if(index==0) $empty.removeClass('render');
                $empty.append($pageLine);
                $empty.append($pageInfo);

                $empty = (isLink) ? $empty.addClass('use-link') : $empty;
                if(!isLink) $sort.append($empty);

                $.each(pageList[index], function(i,v) {
                    var $el = $('.'+v).clone();
                    // var isLink = $('#nestable .dd-item[data-id="'+pageNameOrg+'"] > span > .menu-link').hasClass('active');
                    if($el.attr('data-parallax')=='true') {
                        $el.css('background-attachment','fixed');
                    }
                    $el.removeClass('element').removeClass('el-active').removeClass('active').addClass('render').removeAttr('data-parallax').removeClass('emptyGallery').addClass('reorderBlock').attr('data-reorder-page',val);
                    if(elIndex==0) {
                        $el.css('margin','0px');
                        if(VIEW && $el.attr('data-type')=='project') $el.addClass('unsort');
                    }
                    if($el.attr('data-msny')=='true' && $el.find('.container').hasClass('full-width')) {
                        $el.css('padding-left',$('header.sidebar').width()+'px');
                    }
                    if($('.'+v).css('background-color')=='rgba(0, 0, 0, 0)' || $('.'+v).css('background-color')=='transparent') {
                        $el.css('background-color',$('.dsgn-body').css('background-color'));
                    }

                    $el.find('[data-edit="true"]').removeAttr('data-edit');
                    $el.css('position','relative');
                    $el.css('min-height','0px');
                    $el.css('margin-bottom','120px');
                    
                    if(!isLink) $sort.append($el);
                    elIndex++;
                });
            });
            var $last = $("<div class='render sort-empty'></div>");
            $sort.append($last);
            $scale.append($sort);

            $scale.css('height',(($scale.height()*0.22)+($('.sort-empty').length*50))+'px');

            $.each($('.sort-empty'),function(i,v) {
                if($(this).next().hasClass('sort-empty') && !$(this).next().hasClass('page')) {
                    var $empty = $("<div class='sort-empty page'>PAGE EMPTY</div>");
                    //var $empty = ($(this).hasClass('use-link')) ?  $("<div class='sort-empty page'>PAGE LINKED</div>") :  $("<div class='sort-empty page'>PAGE EMPTY</div>");
                    if(!$(this).hasClass('page')) $(this).after($empty);
                }
            });

            $('.reorderModal').scrollTo('.reorderBlock[data-id="' + selectID + '"]',{offset:-200});
            $('.reorderBlock[data-id="' + selectID + '"]').addClass('active');
            blockSortable();
        }
    }

    jQuery.reorderOFF = function() {
        $('.reorderModal').fadeOut(function() {
            $(this).remove();  
        });
    }

    jQuery.viewON = function() {
        var $view = $('<div class="viewModal"></div>');

        if ($('.viewModal').length < 1) {
            $view.css({
                "position" : "fixed",
                "width" : "100%",
                "height" : "100%",
                "background" : "#FFF url(https://storage.googleapis.com/i.addblock.net/preloader2.gif) center center no-repeat",
                "z-index" : "10000000000",
                "display" : "none",
                "overflow" : "auto"
            });
            $('body').prepend($view);
            var $content = $('<div class="content"></div>'),
                $h1 = $("<h1></h1>").css({
                    'position' : 'absolute',
                    'z-index' : '100001',
                    'right' : '0px'
                }),
                $close = $("<div class='pull-right'><i class='fa fa-times'></i></div>").css({
                    'margin-right' : '18px',
                    'margin-top' : '-16px',
                    'background-color': '#556273',
                    'color': '#fff',
                    'font-size': '18px',
                    'padding': '6px 9px',
                    'cursor': 'pointer',
                    'border-radius' : '20px'
                }),
                $iframe = $("<iframe src='http://" + SID + "." + HOST + "/render/" + PAGE + "'></iframe");

            $iframe.css({
                'position' : 'absolute',
                'top' : '0',
                'left' : '0',
                'width' : '100%',
                'height' : '100%',
                'z-index' : '100000',
                'border' : 'none'
            });


            $close.on('click',function() {
                $.viewOFF();
            });
            $content.append($h1).append($iframe);
            $h1.append($close);
            $view.append($content);
            $view.fadeIn();
        }
    }

    jQuery.viewOFF = function() {
        $('.viewModal').fadeOut(function() {
            $(this).remove();  
        });
    }

    jQuery.historyON = function() {
        viewmode('view');
    }

    $.fn.showModal = function (header, content, footer, confirm, callback) {
        $('.editor-navbar').css('z-index','1030');
        var HTML = '<div class="modal modal-default fade" id="generic-modal">' +
            '   <div class="modal-dialog" style="padding-top:5%;">' +
            '       <div class="modal-content">' +
            '           <button type="" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-modal.png" alt="close"></span></button>' +
            '           <div class="modal-body">' +
            '               <h3 class="modal-title">' + header +
            '               </h3>' + content +
            '           </div>';
            if(footer==true) {
                HTML = HTML +            
                '       <div class="modal-footer">' +
                '           <button type="button" class="btn btn-default btn-sm" data-dismiss="modal">취소</button>';
                if(confirm == true) {
                    HTML = HTML + '<button type="button" class="btn btn-primary btn-sm ok-button-dialog">확인</button>';
                }
                HTML = HTML +
                '       </div>';
            }
            HTML = HTML +
            '       </div>' +
            '   </div>' +
            '</div>';

        var container = $('<div class="generic-modal"></div>').html(HTML);
        $('body').append(container);
        var newInstance = jQuery.extend(true, {}, container);
        newInstance.find('.ok-button-dialog').bind('click', function () {
            callback();
        });
        var modalElement = newInstance.find('#generic-modal');
        modalElement.modal();

        modalElement.on('hidden.bs.modal', function(e) {
            $('.editor-navbar').css('z-index','1040');
            $('.generic-modal').remove();
            $('.modal-backdrop').remove();
        });

        return modalElement;
    }

    $.fn.showModalFlat = function (header, content, footer, confirm, callback, closetext, oktext, size, backdrop, closecallback, showcallback, hidecallback) {
        // if($('#flat-modal.event').length) return;
        size = (typeof size == "undefined") ? '' : size;
        backdrop = (typeof backdrop == "undefined") ? false : true;
        $('.editor-navbar').css('z-index','1030');

        var close_btn = $.lang[LANG]['config.close'],
            close_btn_class = 'btn-default',
            ok_btn = $.lang[LANG]['config.ok'],
            ok_btn_class = 'btn-primary';

        if( closetext == 'cancel') {
            close_btn = $.lang[LANG]['config.cancel'];
        } else if( closetext == 'close' ) {
            close_btn = $.lang[LANG]['config.close'];
        } else if( closetext == 'ok' ) {
            close_btn = $.lang[LANG]['config.ok'];
            close_btn_class = 'btn-primary ok-button-dialog';
        } else if ( typeof closetext != 'undefined') {
            if( closetext.match(/\./g) !== null ) close_btn = $.lang[LANG][closetext];
            else if(closetext.length > 0) close_btn = closetext;
        }
        
        if( oktext == 'save' ) {
            ok_btn = $.lang[LANG]['config.save'];
        } else if( oktext == 'send' ) {
            ok_btn = $.lang[LANG]['config.send'];
        } else if( oktext == 'ok' ) {
            ok_btn = $.lang[LANG]['config.ok'];
        } else if ( typeof oktext != 'undefined') {
            if( oktext.match(/\./g) !== null ) ok_btn = $.lang[LANG][oktext];
            else if(oktext.length > 0) ok_btn = oktext;
        }

        var flat_modal_id = ($('.modal-default').length == 0) ? 'flat-modal': 'flat-modal'+$('.modal-default').length;

        var HTML = '<div class="modal modal-default fade" id="'+flat_modal_id+'">' +
            '   <div class="modal-dialog '+size+'">' +
            '       <div class="modal-content">' +
            '           <button type="" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-modal.png" alt="close"></span></button>' +
            '           <div class="modal-body">' +
            '               <h3 class="modal-title">' + header +
            '               </h3>' + content +
            '           </div>';
            if(footer==true) {
                HTML = HTML + 
                '      <div class="modal-footer">';
                HTML = HTML + 
                '        <button type="button" class="btn '+ close_btn_class +' btn-sm close-button-dialog" data-dismiss="modal">' + close_btn + '</button>';
                if(confirm == true) {
                    HTML = HTML + 
                '        <button type="button" class="btn '+ ok_btn_class +' btn-sm ok-button-dialog">' + ok_btn + '</button>';
                }
                HTML = HTML +
                '      </div>';
            }
            HTML = HTML +
            '       </div>' +
            '   </div>' +
            '</div>';
        var time = new Date().getTime();
        var container = $('<div class="flat-modal"></div>').html(HTML);
        $('body').append(container);
        var newInstance = jQuery.extend(true, {}, container);
        var modalElement = newInstance.find('#'+flat_modal_id);
        if(backdrop) modalElement.modal({ backdrop : 'static'});
        else modalElement.modal();

        newInstance.find('.ok-button-dialog').bind('click', function () {
            if(typeof callback == 'function')
                callback();
        });

        newInstance.find('.close-button-dialog').bind('click', function () {
            if(typeof closecallback == 'function')
                closecallback();
        });

        modalElement.on('shown.bs.modal', function(e) {
            var modal = document.querySelector('.modal');
            modal.style.position = 'absolute';
            setTimeout(function() {
                modal.style.position = 'fixed';
            },0);
            if(typeof showcallback == 'function') showcallback();
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
            if(typeof hidecallback == 'function') hidecallback();
        });

        return modalElement;
    }    


    $.fn.showPopupModal = function (data,sid,vpOption,vpmode_onoff) {
        var img_count = data.length,
            img_w = new Array(), 
            img_h = new Array(), 
            counter = 0,
            sid = (typeof sid != 'undefined') ? sid : SID,
            popup_data = new Array();

        $('#el-empty').html('');
        $.each(data,function(i,v) {
            var $img = $('<img/>').attr('src',v.popupimg);
            $('#el-empty').append($img);
        });

        var $imgs = $('#el-empty img');
        $.each($imgs,function(i,v) {
            $(this).one('load',function() {
                counter++;
                img_w[i] = this.width;
                img_h[i] = this.height;
                if(counter == img_count) getPopupFunction();
            });
            if(this.complete) $(this).load();
        });

        function getPopupFunction() {
            $('#el-empty').html('');
            var html = '',
                display = new Array();

            $.each(data, function(i,o) {
                var isCookie = ($.cookie(sid + 'Popup' + i)) ? 'style= display:none;' : '';
                display.push(isCookie);

                var plink = (typeof o.popuplink != "undefined" && o.popuplink != "javascript:;" && o.popuplink.length > 0) ? o.popuplink : "javascript:;",
                    plink_target = (typeof o.popuplink_target != "undefined" && o.popuplink_target === true) ? 'target="_blank"' : '',
                    link_option = '';

                if(typeof o.popuplink == "undefined") o.popuplink = '';
                if(typeof o.popuplink_target == "undefined") o.popuplink_target = '';
                if(typeof o.popuptime == "undefined") o.popuptime = '';

                if(plink != '' && plink != "javascript:;") {
                    if(checkBase64Encode(plink)) plink = Base64.decode(plink);

                    var _menuList = (PAGE_MODE == 'c') ? MENULIST : property.MENULIST;
                    if(_menuList.indexOf(plink.replace(/^\//g,"").replace(/ /g,"-")) > -1) { // link-type: link-menu     ==> a[data-user-link]
                        link_option = 'data-user-link="' + plink + '"';
                    } else { // link-type: link-out      ==> a[attr-link]
                        link_option = 'attr-link="' + plink + '"';
                    }

                    plink = (PAGE_MODE == 'c') ? makeLinkUrl(plink, ONE, VIEW) : makeLinkUrl(plink, property.ONE, property.VIEW);
                }

                html = html + '<div class="modal-popup" id="' + sid + 'Popup' + i + '" data-link="' + plink + '" data-target="' + o.popuplink_target + '" data-time="' + o.popuptime + '" data-idx="' + i + '" ' + display[i] + '>' + 
                '   <div class="popup-content">' +
                '       <div class="popup-header">' +
                '           <button type="button" class="close popup-close"><span aria-hidden="true"><img src="https://storage.googleapis.com/i.addblock.net/icon/fa_gframe_close.png" alt="close"></span></button>' +
                '       </div>' +
                '       <div class="popup-body">' +
                '          <a href="' + plink + '" ' + plink_target  + ' ' + link_option + '>' +
                '             <div class="img-wrap">' +
                '               <img src="' + o.popupimg + '" alt="" class="img-responsive img-popup" />' +
                '             </div>' +
                '          </a>' +
                '       </div>' +
                '       <div class="popup-footer">' +
                '           <div class="checkbox-wrap text-right">' +
                '               <span>' +
                '                   <div class="checkbox">' +
                '                       <input type="checkbox" value="" class="sitePopupTodayHide">' +
                '                       <label for="sitePopupTodayClose"></label>' +
                '                   </div>' +
                '                   <div class="checkbox-text"> ' + $.lang[LANG]['editor.popup.close-24hours'] + ' </div>' +
                '               </span>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</div>';
                if(data.length == (i+1) )  setPopupFunction(html, display,vpOption,vpmode_onoff);
            });

        }

        function setPopupFunction(html, display,vpOption,vpmode_onoff) {
            var container = $('<div class="popup"></div>').html('<div class="popup-modal">' + html + '</div>');
            if($('.dsgn-body').find('.popup').length > 0 )  { 
                $('.dsgn-body').find('.popup').replaceWith(container);
            } else { 
                $('.dsgn-body').append(container); 
            }

            var newInstance = jQuery.extend(true, {}, container);
            var sitePopupElement  = newInstance.find('.popup-modal');

            var total_w = 0,
                add_w = 0, 
                d_top = $('.header.el-menu').outerHeight() + 15, 
                d_left = 0,
                x = 0, y = 0,
                dsgnbodyWidth = (vpmode_onoff === true && vpOption=="mobile_pc") ? 1024 : $('.dsgn-body').width();

            for(i=0; i<img_w.length; i++) {
                if(parseInt(img_w[i]) > dsgnbodyWidth-30 ) {
                    img_w[i] = dsgnbodyWidth-30;
                }
                if(display[i]) { 
                    continue;
                } else {
                    total_w = total_w + parseInt(img_w[i]) + 30;
                }
            }
           

            var isOverflow = (dsgnbodyWidth < total_w) ? true : false;
            $.each(img_w, function(i,v) {
                if(display[i]) return true;

                if(isOverflow) {
                    sitePopupElement.addClass('popupimg-overflow-y');
                    x = (i==0) ? d_top : d_top + (i*30);
                    y = d_left + (i*30);

                    v = (dsgnbodyWidth < v + ((i+1)*30)+y) ? dsgnbodyWidth-((i+1)*30)-y : v;
                    img_w[i] = (i == 0) ? v-30 : v;
                } else {
                    d_left = (dsgnbodyWidth - total_w)/2;

                    x = d_top;
                    y = d_left + add_w + (i*15);
                }
                add_w = add_w + v;

                var css_val = (isOverflow) ? {'top': x +'px', 'left': y+'px', 'margin-left': '30px', 'width': img_w[i]} : {'top': x +'px', 'left': y+'px' , 'width': img_w[i]};
                sitePopupElement.find('#'+sid +'Popup'+ i).css(css_val);
            });
            return sitePopupElement;
        }
    }


    $.fn.forumModal = function (header, content, footer, confirm, callback, closetext) {
        $('.editor-navbar').css('z-index','1030');
        var confirm_btntext = '',
            confirm_btn_class = 'btn-default';
        if( closetext == 'cancel' ) {
            confirm_btn = $.lang[LANG]['config.cancel'];
        } else if( closetext == 'ok') {
            confirm_btn = $.lang[LANG]['config.ok'];
            confirm_btn_class = 'btn-primary';
        } else {
            confirm_btn = $.lang[LANG]['config.close'];
        }
        var HTML = '<div class="modal modal-default fade" class="forum-modal" id="forum-modal">' +
            '   <div class="container">' +
            '       <div class="modal-content">' +
            '           <div class="modal-body">' +
            '               ' + content +
            '           </div>';
            HTML = HTML +
            '       </div>' +
            '   </div>' +
            '</div>';
                HTML = HTML +
                "<ul class='sideToolbar'>" + 
                "   <li><img src='https://storage.googleapis.com/i.addblock.net/icon/stbImage.png' class='tb-attach-file'></li>" +
                "   <li><img src='https://storage.googleapis.com/i.addblock.net/icon/stbVideo.png' class='tb-video-insert'></li>" +
                "   <li><img src='https://storage.googleapis.com/i.addblock.net/icon/stbAttach.png' class='tb-file-insert'></li>" +
                "   <li><img src='https://storage.googleapis.com/i.addblock.net/icon/stbMap.png' class='test'></li>" +
                // "   <li><img src='https://storage.googleapis.com/i.addblock.net/icon/stbDivider.png'></li>" +
                "</ul>";
            if(footer==true) {
                HTML = HTML + 
                '      <div class="modal-footer">';
                if(confirm == true) {
                    HTML = HTML + 
                '        <div class="pull-right"><button type="button" class="btn btn-default btn-xs btn-modal ok-button-dialog">' + $.lang[LANG]['config.ok'] + '</button></div>';
                }
                HTML = HTML + 
                '        <div class="pull-right"><button type="button" class="btn '+ confirm_btn_class +' btn-xs btn-modal no-border" data-dismiss="modal">' + confirm_btn + '</button></div>';
                HTML = HTML +
                '      </div>';
            }
        var time = new Date().getTime();
        var container = $('<div class="forum-modal fade"></div>').html(HTML);
        $('body').append(container);
        var newInstance = jQuery.extend(true, {}, container);
        var modalElement = newInstance.find('#forum-modal');
        modalElement.modal({
            keyboard: false,
            backdrop: 'static'
        });

        newInstance.find('.ok-button-dialog').bind('click', function () {
            callback();
        });

        newInstance.find('button[data-dismiss="modal"]').bind('click', function () {
            modalElement.modal('hide');
        });

        modalElement.on('scroll', function() {
            $('.fr-line-breaker').css('left','-100%');
            var thisPos = $(this).scrollTop(),
                newPos = (scrollPos > thisPos) ? (scrollPos - thisPos) :  (scrollPos - thisPos),
                newPos2 = (scrollPos2 > thisPos) ? (scrollPos2 - thisPos) :  (scrollPos2 - thisPos),
                caPos = Number(toolPos) + Number(newPos),
                caPos2 = Number(popPos) + Number(newPos);

            $('.fr-toolbar').css('top', caPos + 'px');

            if(frAbove) {
                var caPos2 = caPos -170;
                if($('.fr-popup.fr-active .fr-link-insert-layer.fr-active').length) caPos2 = caPos-180;
                if($('.fr-popup.fr-active button[data-cmd="linkOpen"]').length) caPos2 = caPos + 170;
           }

            if($('.fr-active').prev().hasClass('fr-image-overlay')) {
                $('.fr-popup.fr-active').css('top', (Number(popPos) + Number(newPos)) + 'px');  
            } else {
                if($('.fr-popup').hasClass('fr-above')) caPos2 = caPos2 - 20;
                $('.fr-popup').css('top', caPos2 + 'px');  
            }
            // console.log(caPos2);
            // console.log('caPos : ' + caPos + ', caPos2 : ' + caPos2);
        });
        modalElement.on('hide.bs.modal', function(e) {
            $('.forum-modal').removeClass('in');
        });
        modalElement.on('hidden.bs.modal', function(e) {
            $('.editor-navbar').css('z-index','1040');
            $('.tmp-user').remove();
            $('.note-dialog').remove();
            $('.forum-modal').remove();
            $('.modal-backdrop').remove();
            $('#fm-editor').froalaEditor('destroy');
        });

        return modalElement;
    }           

    jQuery.guideVideoON = function() {
        // 편집 모드를 처음으로 보는 경우가 아니면 ( 주요기능을 이미 둘려봤으면 )
        if( LANG == 'ko' || typeof SETTINGS.showGuide != 'undefined')
            return false;

        hideElementListPanel();
        var $guideVideoModal = $('<div class="guideVideoModal config-modal"></div>'),
            $content = $('<div class="content"></div>');

        if ($('.guideVideoModal').length < 1) {
            $('body').prepend($guideVideoModal);
            $content.css({
                "width" : "100%",
                "height" : "100%",
                "background-color" : "rgba(0,0,0,0.6)",
                "display" : "none"
            });

            $guideVideoModal.append($content);
            $guideVideoModal.css({
                "display": "inherit",
                "position": "fixed",
                "z-index": "99999999",
                "top": "0",
                "left": "0",
                "width": "100%",
                "height": "100%",
                "text-align": "center",
                "background-color" : "transparent"
            });
            $guideVideoModal.fadeIn();

            var $guideVideo = $('<div class="guideVideo">'),
                $close = $('<div class="close"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-modal.png" alt="close" /></div>'),
                $close2 = $('<button type="button" class="btn btn-primary btn-sm ok-button-dialog">' + $.lang[LANG]['config.ok'] + '</button>');
                $header = $('<div class="header"><h2>' + $.lang[LANG]["editor.guide.tutorial-video"] + '</h2></div>'),
                $body = $('<div class="body"></div>'),
                $contentbox = $('<div class="contentbox"></div>'),
                $tutorialVideo = $('<div class="tutorial-video"></div>'),
                $videoWrap = $('<div class="video-wrap guideVideo-stopPlay"><div id="guide-video-modal-video-overlay"></div></div>'),
                $watchAgainNote = $('<span class="watch-again-note">' + $.lang[LANG]['tutorial-video.watch-again-note'] + '</span>'),
                $bottom = $('<div class="bottom"></div>');

            $close.on('click',function() { $.guideVideoOFF(); });
            $close2.on('click',function() { $.guideVideoOFF(); });

            $videoWrap.on('click', function() {

                $(this).toggleClass('guideVideo-stopPlay');

                if(!$(this).hasClass('guideVideo-stopPlay')) {
                    if ( LANG == 'en' )
                        var link = "https://www.youtube.com/embed/p6fyIMl2BcI";

                    var html = '<iframe class="video embed-responsive-item" width="765" height="380" src="' + link + '?enablejsapi=1&rel=0&vq=large&wmode=opaque&showinfo=0&controls=1&autoplay=0&loop=0;playlist=Fn0Mpyh3xto;" frameborder="0" allowfullscreen></iframe>';

                    $(this).html(html);

                }
            });

            $tutorialVideo.append( $videoWrap );
            $contentbox.append( $tutorialVideo );

            $bottom.append($close2).append($watchAgainNote);
            $body.append($contentbox).append($bottom);
            $guideVideo.append($header).append($close).append($body);
            $content.append($guideVideo);
            $content.fadeIn();

        }

        var $thisContent = $('.guideVideoModal .contentbox');
        
    }

    jQuery.guideVideoOFF = function() {
        $('.guideVideoModal').fadeOut(function() {
            $(this).remove();  
        });
    }

    jQuery.siteCopy = function(sid, dest_sid, check, code) {
        var deferred = jQuery.Deferred();
        $.ajax({
            type: 'POST',
            url: '/template/siteCopy/1',
            data: { sid : sid, dest : dest_sid, check : check, code : code },
            dataType: 'json',                    
            async: true,
            success: function(data) {
                deferred.resolve(data);
            }
        });
        return deferred.promise();
    }

    jQuery.siteDelete = function(sid,code) {
        var deferred = jQuery.Deferred();
        $.ajax({
            url: '/template/deleteSiteLanguage/1',
            data : { sid : sid, code : code },
            type: 'POST',
            dataType: 'json',
            async: true,
            cache: false,
            success: function (data) {
                deferred.resolve(data);
            }
        });
        return deferred.promise();
    }    

    $.musicON = function() {
        var tpl = '\
            <div id="cl-music-player" class="cl-mplayer"></div>\
            <div id="cl-music-container" class="jp-audio" role="application" aria-label="media player">\
                <div class="jp-type-playlist">\
                    <div class="jp-gui jp-interface">\
                        <div class="jp-controls-holder">\
                            <div class="jp-controls">\
                                <div class="music-player-controls">\
                                    <span class="jp-backward" role="button" tabindex="0"><i class="fa fa-backward" aria-hidden="true"></i></span>\
                                    <span class="jp-play" role="button" tabindex="0"><i class="fa fa-pause" aria-hidden="true"></i></span>\
                                    <span class="jp-forward" role="button" tabindex="0"><i class="fa fa-forward" aria-hidden="true"></i></span>\
                                </div>\
                                <div class="music-player-progress">\
                                    <div class="jp-progress">\
                                        <div class="jp-seek-bar">\
                                            <div class="jp-play-bar"></div>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="jp-lists">\
                                    <span class="music-lists" role="button" tabindex="0">LIST</span>\
                                </div>\
                                <div class="music-playlist-wrap">\
                                    <div class="jp-playlist"><ul class="music-playlist"><li></li></li></div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="jp-no-solution">\
                        <span>Update Required</span>\
                        To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.\
                    </div>\
                </div>\
            </div>\
            ',
            equalizer_img = ($('body').width() < 769) ? "https://storage.googleapis.com/i.addblock.net/equal_stop.gif" : "https://storage.googleapis.com/i.addblock.net/equal.gif",
            checkFree = (!property.VALIDPLAN || property.VALIDTYPE == 'FR' || property.VALIDPLAN == 'PK') ? true : false,
            move_position = (checkFree) ? "class='moved'" : "",
            vpModeOnoff = (property.SETTINGS.vpMode_onoff === true) ? true : false,
            vpOption = (property.SETTINGS.viewportMode) ? property.SETTINGS.viewportMode : '',
            $music_icon = $("<div id='cl-music-player-icon' "+move_position+"><img src='" + equalizer_img + "' class='hand'></div>");

        if($('.fnav').length > 0) {
            if(window.innerWidth <= 480) { //mobile
                if(vpModeOnoff && vpOption == 'mobile_web') {
                    $('#goto-top').removeClass('moved movepc').addClass('moveMpc');
                    $music_icon.removeClass('moved movepc').addClass('moveMpc');
                } else {
                    $('#goto-top').addClass('moved');
                    $music_icon.addClass('moved');
                }                
            } else { //pc
                if(vpModeOnoff && vpOption == 'mobile_pc') {
                    $('#goto-top').removeClass('moved moveMpc').addClass('movepc');
                    $music_icon.removeClass('moved moveMpc').addClass('movepc');
                } else {
                    $('#goto-top').removeClass('moved moveMpc movepc');
                    $music_icon.removeClass('moved moveMpc movepc');
                }
            }
        }

        $('#goto-top').after($music_icon);
        $('#cl-music-player-icon').after(tpl);
        ($('body').width() < 769) ? $('.jp-play i').removeClass('fa-pause').addClass('fa-play').parent().addClass('pause') : "";
        var music = (typeof property == "undefined") ? [] : property.MUSIC;

        if(music.length==0) {
            $music_icon.addClass('hide');
        }
        var myPlaylist = new jPlayerPlaylist({
            jPlayer: "#cl-music-player",
                cssSelectorAncestor: "#cl-music-container"
            }, music, {
            playlistOptions: {
                loop: true,
                autoPlay: true,
                loopOnPrevious: true,
                enableRemoveControls: false
            },
            ended: function() { 
                // var $item = $('.music-playlist li'),
                //     idx = $item.parent().find('.active').index(),
                //     active = (idx+1 > $item.length) ? 0 : idx+1;

                // $item.removeClass('active');
                // $item.eq(active).addClass('active');
            },            
            swfPath: '/js',
            solution: 'html, flash',
            supplied: 'mp3',
            preload: 'metadata',
            volume: 1,
            loop: true,
            muted: false,
            backgroundColor: '#000000',

            smoothPlayBar: true,
            keyEnabled: true,
            audioFullScreen: false // Allows the audio poster to go full screen via keyboard
        });

        $music_icon.click(function() {
            $(this).toggleClass('show');
            if($(this).hasClass('show')) {
                $('#cl-music-container').css('display','block');
            } else {
                $('#cl-music-container').css('display','none');
            }
        });

        var $play = $('.jp-play'),
            $next = $('.jp-forward'),
            $prev = $('.jp-backward'),
            $list = $('.music-lists'),
            $playlist_wrap = $('.music-playlist-wrap'),
            $playlist = $('.music-playlist'),
            $item = $('.music-playlist li');

        $playlist.empty();
        if(myPlaylist.playlist.length) {
            var index = myPlaylist.current;
            $.each(myPlaylist.playlist, function(i,v) {
                var active = (i == index) ? "jp-playlist-current" : "",
                    item = "<li class='" + active + "' data-music-index='" + i + "'><span class='hand'>" + v.title + "</span></li>";
                $playlist.append(item);
            });
        }

        $list.click(function() {
            $playlist_wrap.toggle();
            if($playlist_wrap.css('display') == 'block') {
                $list.text('CLOSE');
            } else {
                $list.text('LIST');
            }
        });

        $('body').on( 'click', '.music-playlist li a', function(e) {
            var $pause_icon = "<i class='fa fa-pause'></i>";
                $equalizer = $("#cl-music-player-icon"),
                src = "https://storage.googleapis.com/i.addblock.net/equalizer.gif",
            $equalizer.find('img').attr('src',src);
            $('.jp-play').removeClass('pause');
            $('.jp-play').html($pause_icon);
        });

        $('.music-playlist li span').click(function() {
            var idx = $(this).parent().attr('data-music-index');
            if(typeof idx == "undefined") return;
            myPlaylist.play(idx);
            myPlaylist.current = idx;
            $('.music-playlist li').removeClass('jp-playlist-current');
            $('.music-playlist li').eq(idx).addClass('jp-playlist-current');
            // $.musicPlay();
        });

        $play.click(function() {
            if($(this).hasClass('pause')) {
                $.musicPlay();
            } else {
                $.musicPause();
            }
        });
        $next.click(function() {
            $.musicNext(myPlaylist);

        });
        $prev.click(function() {
            $.musicPrev(myPlaylist);
        })

        document.onkeydown = function(evt) {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
                $.musicPause();
            }
        };
        // myPlaylist.play();
        // $('#cl-music-player').jPlayer('play');
    }
    $.musicPause = function() {
        var $play_icon = "<i class='fa fa-play'></i>",
            $equalizer = $("#cl-music-player-icon"),
            src = "https://storage.googleapis.com/i.addblock.net/equal_stop.gif";
        $equalizer.find('img').attr('src',src);
        $('.jp-play').addClass('pause');
        $('.jp-play').html($play_icon);
        $('#cl-music-player').jPlayer('pause');
    }
    $.musicPlay = function() {
        var $pause_icon = "<i class='fa fa-pause'></i>";
            $equalizer = $("#cl-music-player-icon"),
            src = "https://storage.googleapis.com/i.addblock.net/equalizer.gif",
        $equalizer.find('img').attr('src',src);
        $('.jp-play').removeClass('pause');
        $('.jp-play').html($pause_icon);
        $('#cl-music-player').jPlayer('play');
    }
    $.musicStop = function() {
        $('#cl-music-player').jPlayer('stop');
    }
    $.musicRepeat = function() {

    }
    $.musicOFF = function() {

    }
    $.musicNext = function(player) {
        player.next();
        var index = player.current;
        $.musicPlay();
    }
    $.musicPrev = function(player) {
        player.previous();
        var index = player.current;
        $.musicPlay();
    }


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
            var slang_data = (PAGE_MODE == 'c') ? SLANG['lists'] : property.SLANG['lists'],
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
                    <a href="javascript:;" class="dropdown-toggle"><span class="slang-active">' + slang_str + '</span> <i class="fa fa-caret-down fa-1" aria-hidden="true"></i></a>\
                    <ul class="dropdown-menu">\
                        ' + slang_list + '\
                    </ul>\
                </li>\
            ';

            if($('#tpl-menu').find('.siteLANG').length > 0) $('#tpl-menu').find('.siteLANG').replaceWith(content);
            else $('#tpl-menu').append(content);
        }
    }


    $.fnav = {
        getFnav: function() {
            var data = (PAGE_MODE == 'c') ? SETTINGS.fnav : property.SETTINGS.fnav;
            if(typeof data == "undefined" || $.isEmptyObject(data)) data = new Array();
            
            return data;
        },
        getFnavBg: function() {
            var bg = (PAGE_MODE == 'c') ? SETTINGS.fnavBg : property.SETTINGS.fnavBg;
            if(typeof bg == "undefined" || !bg) bg = '000000';
            else {
                if(bg.indexOf('rgb') > -1) bg = style.getHex(bg).substring(1);
            }

            return bg;
        },
        checkFnavON: function(data) {
            var result = false,
                fnav_data = (typeof data != "undefined") ? data : $.fnav.getFnav();

            $.each(fnav_data, function(i,obj) {
                if(obj['display'] == 'on') result = true;
            });

            return result;
        },
        draw: function(data) {
            var fnav_data = (typeof data != "undefined") ? data : $.fnav.getFnav(),
                hasON = $.fnav.checkFnavON(fnav_data);

            if(!hasON) {
                $('.fnav.fnav-mobile-fnav').remove();
            } else {
                var fnav_html = $.fnav.listHTML(fnav_data,hasON);
                if(fnav_html.length > 0) {
                    if($('.dsgn-body').find('.fnav.fnav-mobile-fnav').length > 0) $('.dsgn-body .fnav.fnav-mobile-fnav').replaceWith(fnav_html);
                    else $('.dsgn-body').find('.el-footer').before(fnav_html);
                } else {
                    $('.dsgn-body').find('.fnav.fnav-mobile-fnav').remove();
                }
            }
        },
        listHTML: function(fnav_data,hasON) {
            if(typeof fnav_data == "undefined") fnav_data = $.fnav.getFnav();
            if(typeof hasON == "undefined") hasON = $.fnav.checkFnavON(fnav_data);

            var fnav_bg = $.fnav.getFnavBg(),
                str = '';
                
            if(hasON) {
                $.each(fnav_data, function(i,v) {
                    str += $.fnav.itemHTML(v.idx, v.name, v.type, v.value, v.target, v.icon, v.display); 
                });
            }

            return '\
                            <div class="fnav fnav-mobile-fnav" style="background-color: #'+fnav_bg+';">\
                            ' + str + '\
                            </div>\
            ';
        },
        itemHTML: function(idx,name,type,value,target,icon,display) {
            var href = '#', 
                attr_target = (type == "tel") ? ' target=""' : ' target="' + target + '"',
                attr_link = '';

            if(icon == 'empty') icon = '';

            if(value) {
                if(type == "tel") {
                    href = (value.match(/^tel:/)) ? value : 'tel:' + value;
                } else { //link
                    value = (checkBase64Encode(value)) ? Base64.decode(value) : value;
                    
                    var menulist = (PAGE_MODE == 'c') ? MENULIST : property.MENULIST,
                        one = (PAGE_MODE == 'c') ? ONE : property.ONE,
                        view = (PAGE_MODE == 'c') ? VIEW : property.VIEW;

                    href = makeLinkUrl(value,one,view);
                    if(menulist.indexOf(value.replace(/ /g,'-'))>-1) {
                        attr_link = 'data-user-link="' + href + '"';
                    } else if(value.match(/^\@/g)) {
                        attr_link = 'attr-bookmark="' + value.replace(/^\@/g,'') + '"';
                    } else {
                        attr_link = 'attr-link="' + value + '"';
                    }
                }

            }

            if(display != 'on') return '';
            else return '\
                                <div class="fnav-item" data-idx="' + idx + '" data-type="' + type + '">\
                                    <a href="' + href + '" ' + attr_target + ' ' + attr_link + '>\
                                        <i class="' + icon + '" aria-hidden="true"></i>\
                                        <span class="fnav-name">' + name + '</span>\
                                    </a>\
                                </div>\
            ';
        },

    }

    $.mpcWeb = {
        init: function(vpOption,contents,WebType) {   
            var device_w = (vpOption=="mobile_pc") ? 1024 : 'device-width',
                scale = (vpOption=="mobile_pc") ? (window.screen.width / 1024) : 1.0,
                mpc_icon = (vpOption == "mobile_pc") ? '<i class="fa fa-mobile mpc_icon" aria-hidden="true"></i>' : '<i class="fa fa-desktop mpc_icon" aria-hidden="true"></i>',
                checkFnav = ($('.fnav').length > 0 && vpOption=="mobile_web") ? true : false;

            $.mpcWeb.mpcWebShowcase(vpOption,contents);

            $('.dsgn-body .mobilepc_ch .mpc_icon').remove();
            $('.dsgn-body .mobilepc_ch').prepend(mpc_icon);
            
            var viewport = document.querySelector('meta[name="viewport"]');
            if(viewport) viewport.setAttribute('content','width='+device_w+', initial-scale='+scale+'');

            $.mpcWeb.mpcMusicandGoTop(checkFnav,vpOption);     

            if(checkFnav && WebType == 'MOBILE') $('.fnav.fnav-mobile-fnav').css('margin-bottom','53px');
            else $('.mobilepc_ch').css('margin-bottom','0px');
        },


        mpcWebhtml: function(vpOption,contents) {
            var vpChangeText = (vpOption=="mobile_pc") ? $.lang[LANG]['editor.mobile.changePc.mobileWeb'] : $.lang[LANG]['editor.mobile.changePc.mobilePc'],     
                mpc_html = "\
                <div class='mobilepc_ch' data-desktop-option='"+vpOption+"'>\
                    <p class='hand'>\
                        <span class='mpc-name'>" + vpChangeText + "</span>\
                    </p>\
                </div>\
            ",
                WebType = $.mpcWeb.mpcCheckWebType();

            if(WebType == 'MOBILE') {
                $('.dsgn-body').find('.mobilepc_ch').remove();
                $('.dsgn-body').find('.el-footer').before(mpc_html);
                $.mpcWeb.init(vpOption,contents,WebType);
                $.mpcWeb.mpcChangeVal(vpOption,contents,WebType);
            }
        },   

        mpcWebShowcase : function(vpOption,contents) {
            $.each(contents,function(i,v) {
                if((vpOption == "mobile_pc") && (v.element.type == 'showcase')) $("."+v.element.elname).addClass('mobilePc_height');
                else $("."+v.element.elname).removeClass('mobilePc_height');
            });
        },

        mpcChangeVal : function(vpOption,contents,WebType) {
            $('.mobilepc_ch').on('click', function() {
                vpOption = (vpOption=="mobile_pc") ? 'mobile_web' : 'mobile_pc';
                var vpChangeText = (vpOption=="mobile_pc") ? $.lang[LANG]['editor.mobile.changePc.mobileWeb'] : $.lang[LANG]['editor.mobile.changePc.mobilePc'];
                 
                $.mpcWeb.init(vpOption,contents,WebType);
                
                $(this).find('.mpc-name').text(vpChangeText);
                $(this).attr('data-desktop-option',vpOption);

                if(property.ONE && !property.VIEW || property.PAGE == property.MENULINK[0] && !property.VIEW) setSitePopup();
            });
        },

        mpcCheckWebType : function(){
            var filter = "win16|win32|win64|mac",
                WebType = "";

            if (navigator.platform) {
                if (filter.indexOf(navigator.platform.toLowerCase()) < 0) WebType = "MOBILE";
                else WebType = "PC";
            }

            return WebType;
        },

        mpcMusicandGoTop : function(checkFnav,vpOption) {
            var checkmpc = ($('.mobilepc_ch').length > 0) ? true : false;

            if(checkmpc && vpOption == 'mobile_pc') $('#goto-top,#cl-music-player-icon').removeClass('moved moveMp').addClass('movepc');
            else {
                if(checkFnav) $('#goto-top,#cl-music-player-icon').removeClass('moved movepc').addClass('moveMpc');
                else $('#goto-top,#cl-music-player-icon').removeClass('moveMpc movepc').addClass('moved');
            }
        },
    }

    $.resource = {
        init : function() {
            var $modal = $('#el-fileupload'),
                fSearch = {'type' : '', 'page' : 1, 'text' : '', 'total' : 0},
                fileDrag = false,
                isEdit = false,
                depfolderClick = false,
                isFEdit = false;


            $('#nestableFolder').nestable({
                maxDepth: 1
            }).on('change', function(el) {
                var prevFolder = $('#nestableFolder-output').val();
                updateOutputFolder($('#nestableFolder').data('output', $('#nestableFolder-output')));
            });

            $modal.on('show.bs.modal', function (e) {
                ADD = false;
                UPLOAD = 0;
                UPLOADED = 0;
                UPLOADSIZE = 0;
                cPage = 1;
                initResource();
                resourceGetPage(1,SFOLDER_ACTIVE);

                $('.resource-selectAll').show();
                
                if($('.fli.active').length == 0 ) {
                    $('.fli[data-id="all"]').click();
                } 
                $('.resource-useit').removeClass('active');

                $('.progress .progress-bar').css({
                    'width' : '0%',
                    'padding-right' : '0px'
                }).text('');
            });

            $modal.on('hide.bs.modal', function (e) {
                if($('.fli.active[data-id="clEmptyFolder"]').length > 0 ) {//new folder name_input open
                    $('.fli.active[data-id="clEmptyFolder"]').remove();
                    isFEdit = false;
                }
                if($('#nestableFolder .fli.active .dd-fln').find('input').length > 0 ) { //edit folder name_input open
                    $('#nestableFolder .fli.active .dd-fln').find('input').val('').remove();
                    isFEdit = false;
                }

                if($('#el-property [data-loop-type="matrix"] .attach-thumb[data-toggle="modal"]').length > 0 ) { //clear matrix loop item - modal toggle
                    var idx =  $('#el-property [data-loop-type="matrix"] .attach-thumb[data-toggle="modal"]').attr('idx');
                    $('#el-property [data-loop-type="matrix"] .attach-thumb[data-toggle="modal"]').removeAttr('data-toggle');

                    if(!$('#el-property [data-loop-type="matrix"] .ui-sortable').children().first().hasClass('active')) 
                        $('#el-property [data-loop-type="matrix"] .ui-sortable').children().first().click();
                }

                if(typeof selectEL != 'undefined' && typeof $('.'+selectEL).attr('data-parallax') != "undefined" && $('.'+selectEL).attr('data-parallax')) {
                    $('#prop-method-background').attr('data-target','');
                }

                $('.add-folder').attr('data-content','').popover('hide');
                $('.resource-useit').show();
                selectCount=0;
            });

            $("#resource-files").selectable({
                filter: ".fitem",
                cancel: "i,.ui-selected",
                selected: function(event, ui) {
                    var files = [], files_path = [], files_size=[], files_seq=[], file ='', file_path = '', file_size =0, file_seq='';  

                    if($(ui.selected).is(".fitem")) {
                        file = $(ui.selected).closest('.fitem').find(".resource-file-name").attr("data-source");
                        file_path = RPATH + "60/" + file;
                        file_size = $(ui.selected).closest('.fitem').find('.resource-file-size').text();
                        file_seq =  $(ui.selected).closest('.fitem').find(".resource-file-name").attr("data-seq");

                        var ffloder = $("#resource-files ul[data-source='"+ file +"']").attr('data-ffolder');
                        if($(".selected-files").find("li[data-source='"+file+"']").length==0) {
                            $(".selected-files").append("<li data-source='" + file + "' data-ffolder='" + ffloder + "' data-seq='"+file_seq+"' data-size='"+file_size+"'><img src='" + file_path + "'><div class='selected-hover'>&times;<p class='selected-file-name'>" + file + "</p><p class='selected-file-size'>"+file_size+"</p></div></li>");
                        }
                    }
                    resetFileSelectedStr();
                },
                unselected: function(event, ui) {
                    if($(ui.unselected).is('.fitem')) {
                        if(!event.ctrlKey && !event.shiftKey) {
                            $(".selected-files").empty();
                        }
                    }
                    resetFileSelectedStr();
                },
                stop: function(event, ui) {
                    if($('.selected-files').children().length != $('#resource-files').children('.fitem').length ) {
                        if($('#selectAll').prop('checked')) $('#selectAll').removeAttr('checked');
                    }
                }
            });  

            $('a[href="#mystorage"]').click(function(e) {
                resetFileSelectedStr();
            });    

            $('a[href="#freestorage"]').click(function(e) {
                $('.listprogress').remove();
                resetFileSelectedFr();

                if($('.fr-storage').length == 0) {
                    fSearch.type = 'new';
                    fSearch.page = 1,
                    fSearch.total = -1;

                    storageInit();

                    var $ul = $('<ul class="fr-storage-list"></ul>'),
                        $latest = $('<li class="latest"><i class="fa fa-check" aria-hidden="true"></i> ' + $.lang[LANG]['free.storage.new'] + '</li>'),
                        $favor = $('<li class="favor"><i class="fa fa-star"></i> ' + $.lang[LANG]['free.storage.favor'] + '</li>'),
                        $used = $('<li class="used"><i class="fa fa-thumb-tack" aria-hidden="true"></i> ' + $.lang[LANG]['free.storage.used'] + '</li>');
                    if($('.fr-storage-list').length==0) {
                        $ul.append($latest).append($favor).append($used);
                        $('.fr-strg.resource-filelist').append($ul);

                        $ul.find('li').click(function(e) {
                            if($(this).hasClass('latest')) {
                                if(!$('.fr-storage').hasClass('new')) {
                                    fSearch.type = 'new';
                                    fSearch.page = 1,
                                    fSearch.total = -1;

                                    storageInit();
                                    getFreeImage(fSearch.page,fSearch.type);
                                }

                                $('.fr-storage').removeClass('favor used').addClass('new');
                            } else if($(this).hasClass('favor')) {
                                if(!$('.fr-storage').hasClass('favor')) {
                                    fSearch.type = 'favor';
                                    fSearch.page = 1;
                                    fSearch.total = -1;
                                    storageInit();
                                    getFreeImage(fSearch.page,fSearch.type);
                                }
                                $('.fr-storage').removeClass('new used').addClass('favor');
                                var items = $('.fr-storage .imgs').length;
                                if(fSearch.total == items) return;
                            } else if($(this).hasClass('used')) {
                                if(!$('.fr-storage').hasClass('used')) {
                                    fSearch.type = 'used';
                                    fSearch.page = 1;
                                    fSearch.total = -1;
                                    storageInit();
                                    getFreeImage(fSearch.page,fSearch.type);
                                }
                                $('.fr-storage').removeClass('new favor').addClass('used');
                                var items = $('.fr-storage .imgs').length;
                            }

                            $ul.find('li').removeClass('active');
                            $(this).addClass('active');
                            $(".fr-selected-files").empty();
                            resetFileSelectedFr();
                        });
                        $('.fr-storage-list .latest').addClass('active');
                        fSearch.type = 'new';
                        fSearch.page = 1,
                        fSearch.total = -1;
                        getFreeImage(fSearch.page,fSearch.type);                
                    }
                }
            });

            $('.free-search').keyup(function(e) {
                var keyCode = e.keyCode,
                    search = $(this).val().trim();
                if(keyCode == 13) {
                    if(search=='') {
                        alert('Please enter search text...');
                        $(this).focus();
                        return false;
                    }

                    fSearch.type = 'search';
                    fSearch.page = 1;
                    fSearch.text = search;
                    fSearch.total = 0;

                    $('.free-search').val('');
                    $('.free-search-result').text('');
                    $('.fr-storage-list li').removeClass('active');

                    $('.fr-storage').remove();
                    $('.fr-strg.resource-container').prepend('<div class="fr-storage"></div>');
                    $('.fr-storage').prepend('<div class="listprogress" style="width: 100%; min-height: 40px; text-align:center; padding-top:50px;"><svg version="1.1" xmlns="http://www.w3.org/svg/2000" viewBox="0 0 30 30" width="60" style="width:30px; height: 30px;"><circle cy="15" cx="15" r="14" style="stroke:#00baff;"></circle></svg></div>');
                    var $frstorage = $('.fr-strg.resource-container .fr-storage');
                    for(var i=0; i < 4; i++) {
                        $frstorage.append('<div class="fr-row"></div>');
                    }

                    $.getJSON('/template/translate/' + encodeURIComponent(search), function(data) {
                        search = data.data.translations[0].translatedText;
                        fSearch.text = search;
                        $('.free-search').val(search);
                        getFreeImage(fSearch.page,fSearch.type,search);
                    });
                }
            });

            var storageInit = function() {
                $('.free-search').val('');
                $('.free-search-result').text('');
                $('.fr-storage').remove();
                $('.fr-strg.resource-container').prepend('<div class="fr-storage"></div>');
                $('.fr-storage').prepend('<div class="listprogress" style="width: 100%; min-height: 40px; text-align:center; padding-top:50px;"><svg version="1.1" xmlns="http://www.w3.org/svg/2000" viewBox="0 0 30 30" width="60" style="width:30px; height: 30px;"><circle cy="15" cx="15" r="14" style="stroke:#00baff;"></circle></svg></div>');
                var $frstorage = $('.fr-strg.resource-container .fr-storage');
                for(var i=0; i < 4; i++) {
                    $frstorage.append('<div class="fr-row"></div>');
                }
            }

            var rePaintFavor = function() {
                var $org = $('.fr-storage .imgs'),
                    $items = {};

                for(var i=0; i<$org.length; i++) {
                    var $i = $('.fr-storage .imgs[data-idx="' + i + '"]');
                    $items[i] = $i.clone();
                    $i.remove();
                }

                var idx = 0, 
                    $fHeight = $('.fr-storage .fr-row'),
                    height = [
                        $fHeight.eq(0).height(),
                        $fHeight.eq(1).height(),
                        $fHeight.eq(2).height(),
                        $fHeight.eq(3).height(),
                    ];

                $.each($items, function(i,v) {
                    var set = (i < 4) ? i : height.indexOf(Math.min.apply(null,height)),
                        w = $(this).find('.control-area').attr('data-width'),
                        h = $(this).find('.control-area').attr('data-height'),
                        r = Math.round(h*1080/w);

                    height[set] = height[set] + r;
                    $('.fr-storage .fr-row').eq(set).append($(this));
                });
            }

            var getFreeImage = function(page,type,stx,collection) {
                type = (typeof type == 'undefined') ? 'new' : type;
                stx = (typeof stx == 'undefined') ? '' : stx;
                page = (typeof page == 'undefined') ? 1 : page;
                collection = (typeof collection == 'undefined') ? '' : collection;
                if(type == 'new') {
                    dest = '/template/free/new/photos';
                } else if(type == 'favor') {
                    dest = '/template/favorite/list/type/F';
                } else if(type == 'search') {
                    dest = '/template/free/search/' + encodeURIComponent(stx);
                } else if(type == 'used') {
                    dest = '/template/favorite/list/type/U';
                }

                if(page>1) dest = dest + '/page/' + page;

                $.ajax({
                    type: 'GET',
                    url: dest,
                    dataType: 'json',
                    async:true,
                    success : function(data) {
                        var photos;
                        if(fSearch.type == 'new') {
                            if(data.photos != null) {
                                photos = data.photos;    
                            } else photos = {};
                        } else {
                            photos = (data.photos == null) ? {} : data.photos.results;
                        }

                        if(photos) {
                            $('.listprogress').remove();
                            if(photos.length==0 || photos == null) {
                                $('.fr-storage').append('<div class="result-none">No results found</div>');
                            } else {
                                var idx = 0, 
                                    $fHeight = $('.fr-storage .fr-row'),
                                    height = [
                                        $fHeight.eq(0).height(),
                                        $fHeight.eq(1).height(),
                                        $fHeight.eq(2).height(),
                                        $fHeight.eq(3).height(),
                                    ];

                                $.each(photos, function(i,v) {
                                    var set = (i < 4) ? i : height.indexOf(Math.min.apply(null,height)),
                                        r = Math.round(v.height*1080/v.width);

                                    var tpl = tplPhoto(v.urls.small, v.user.profile_image.small, v.user.username, v.user.links.html, v.color, v.urls.full, v.urls.raw,v.links.download, v.width, v.height, v.id, fSearch.type, i);
                                    height[set] = height[set] + r;
                                    $('.fr-storage .fr-row').eq(set).append(tpl);
                                });

                                $('.fr-storage').selectable({ 
                                    filter: " .imgs",
                                    cancel: "i,.ui-selected, .user-name",
                                    selected: function(event, ui) {
                                        var files = [], files_path = [], files_size=[], files_seq=[], file ='', file_path = '', file_size =0, file_seq='';  

                                        if($(ui.selected).is(".imgs")) {
                                            file = $(ui.selected).find('.control-area').attr("data-small");
                                            id = $(ui.selected).find('.control-area').attr("data-id");
                                            urls = new getLocation(file);
                                            file = (urls.pathname).replace("/","");
                                            file_path = 'https://' + urls.host + urls.pathname + '?ixlib=rb-0.3.5&q=80&fm=jpg&crop=face&cs=tinysrgb&w=60&h=60&fit=crop';
                                            tmp_image = 'https://' + urls.host + urls.pathname + '?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb';
                                            file_size = $(ui.selected).closest('.imgs').find('.resource-file-size').text();
                                            file_seq =  $(ui.selected).closest('.imgs').find(".resource-file-name").attr("data-seq");
                                            var ffloder = $("#resource-files ul[data-source='"+ file +"']").attr('data-ffolder');
                                            if($(".fr-selected-files").find("li[data-source='"+file+"']").length==0) {
                                                $(".fr-selected-files").append("<li data-source='" + file + "' data-id='" + id + "' data-ffolder='" + ffloder + "' data-seq='"+file_seq+"' data-size='"+file_size+"'><img src='" + file_path + "'><div class='selected-hover'>&times;<p class='selected-file-name'>" + file + "</p><p class='selected-file-size'>"+file_size+"</p><p class='tmp-image'>" + tmp_image + "</p></div></li>");
                                            }
                                        }
                                        resetFileSelectedFr();
                                    },
                                    unselected: function(event, ui) {
                                        if($(ui.unselected).is('.imgs')) {
                                            if(!event.ctrlKey && !event.shiftKey) {
                                                $(".fr-selected-files").empty();
                                            }
                                        }
                                        resetFileSelectedFr();
                                    },
                                    stop: function(event, ui) {
                                        if($('.selected-files').children().length != $('#resource-files').children('.fitem').length ) {
                                            if($('#selectAll').prop('checked')) $('#selectAll').removeAttr('checked');
                                        }
                                    }                        
                                });
                                if(fSearch.type == 'search' || fSearch.type == 'favor' || fSearch.type == 'used') fSearch.total = data.photos.total;
                                fSearch.page = fSearch.page + 1;

                                if(typeof data.photos.total != 'undefined' && fSearch.type == 'search') {
                                    if(data.photos.total > 0) $('.free-search-result').text(Number(data.photos.total).format());
                                    else $('.free-search-result').text('');
                                }
                            }                
                        } else {
                            $('.listprogress').remove();
                            $('.fr-storage').append('<div class="result-none text-center">Error get photo lists</div>');
                        }

                    }
                });

            }

            var tplPhoto = function(src,profile,name,link,color,full,raw,down,width,height,id,type,i) {
                var str = '';
                str = '\
                    <div class="imgs" data-idx="' + i + '">\
                        <div class="fitem">\
                            <img src="' + src + '">\
                            <div class="control-area" data-color="' + color + '" data-full="' + full + '" data-username="' + name + '" data-raw="' + raw + '" data-full="' + full + '" data-small="' + src + '" data-down="' + down + '" data-userlink="' + link + '" data-width="' + width + '" data-height="' + height + '" data-id="' + id + '" data-color="' + color + '">\
                                <ul>\
                                    <li class="fr-search"><i class="fa fa-search"></i></li>\
                ';
                if(type != 'used') {
                    str = str + '\
                                    <li class="fr-star"><i class="fa fa-star' + ((type=='favor') ? '' : '-o') + '"></i></li>\
                    ';
                }
                str = str + '\
                                </ul>\
                            </div>\
                        </div>\
                        <div class="user-name">Photo by <a href="' + link + '?utm_source=creatorlink&utm_medium=referral&utm_campaign=api-credit" target="_blank">' + name + '</a></div>\
                    </div>\
                ';
                return str;
            }

            $('.fr-storage .imgs .control-area .fr-search').live('click', function(e) {
                var $popup = $('<div class="photo-popup"></div>'),
                    $close = $('<div class="photo-close"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-modal-white.png"></div>'),
                    color = $(this).parents('.control-area').attr('data-color'),
                    full = $(this).parents('.control-area').attr('data-full');

                $popup.append('<img src="' + full + '">');
                $('.photo-popup').css('background-color',color);
                if($('.photo-popup').length==0) {
                    $('body').append($popup).append($close);
                    $('.photo-popup').css('background-color',color);
                }
                $popup.hover(function() {
                    $('.photo-close').show();
                });
                resetFileSelectedFr();
            });

            $('.fr-storage .imgs .control-area .fr-star').live('click', function(e) {
                var $i = $(this).parents('.control-area'),
                    image = {
                        'id' : $i.attr('data-id'),
                        'width' : $i.attr('data-width'),
                        'height' : $i.attr('data-height'),
                        'username' : $i.attr('data-username'),
                        'userlink' : $i.attr('data-userlink'),
                        'raw' : $i.attr('data-raw'),
                        'full' : $i.attr('data-full'),
                        'small' : $i.attr('data-small'),
                        'down' : $i.attr('data-down'),
                        'color' : $i.attr('data-color')
                    },
                    $star = $(this).find('i'),
                    $item = $(this).parents('.imgs');

                $.post('/template/favorite/image', { image : image },  function(data) {
                    if(data.type == 'insert') {
                        $star.removeClass('fa-star-o').addClass('fa-star');    
                    } else if(data.type == 'delete') {
                        $star.removeClass('fa-star').addClass('fa-star-o');
                        if(fSearch.type == 'favor') {
                            var idx = $item.attr('data-idx');
                            $.each($('.fr-storage .imgs'),function(i,v) {
                                var cidx = $(this).attr('data-idx');
                                if(cidx == idx) $(this).remove();
                                if(idx < cidx) $(this).attr('data-idx',Number(cidx)-1);
                            });
                            fSearch.total = fSearch.total -1;
                            rePaintFavor();
                        }
                    }
                },'json');
            });

            $('.fr-storage .imgs .control-area .fr-download').live('click', function(e) {
                var $i = $(this).parents('.control-area'),
                    down = $i.attr('data-down');
                window.open(down + '?force=true', '_blank'); 
            });

            $('.photo-popup, .photo-close').live('click', function(e) {
                $(this).addClass('down');
                setTimeout(function() {
                    $('.photo-close').remove();
                    $('.photo-popup').remove();
                },400);
            });

            $('.fr-storage').live({
                mousemove : function() {
                    $(this).scroll( function() {

                        var listScroll = $('.fr-storage').scrollTop();
                        if((this.scrollTop+this.clientHeight) > (this.scrollHeight-100)){
                            if((fSearch.type == 'search' || fSearch.type == 'favor' || fSearch.type == 'used') && fSearch.total != 0) {
                                var items = $('.fr-storage .imgs').length;
                                if(fSearch.total == items) {
                                    return false;
                                }
                            }

                            if($('.fr-storage').find('.listprogress').length == 0 ) {
                                $('.fr-storage').append('<div class="listprogress" style="width: 100%; min-height: 40px; text-align:center; padding-top:10px;"><svg version="1.1" xmlns="http://www.w3.org/svg/2000" viewBox="0 0 30 30" width="60" style="width:30px; height: 30px;"><circle cy="15" cx="15" r="14" style="stroke:#00baff;"></circle></svg></div>');  
                                getFreeImage(fSearch.page,fSearch.type,fSearch.text);
                            }
                        }
                    });
                }
            });

            $('.modal-upload-button-resource').live({
                click: function() {
                    var ffolder = (SFOLDER_ACTIVE) ? SFOLDER_ACTIVE : 'all';
                    $(this).fileupload({
                        url: '/template/resource/upload/ffolder/'+ffolder,
                        dataType: 'json',
                        pasteZone: null,
                        async: true,
                        add: function(e,data) {
                            var filesize = data.files[0].size;
                            if( filesize > 1e+7) { //10MB == 10485760Byte == 1e+7
                                filesize = filesize/1024/1024;
                                $(this).showModalFlat('INFORMATION',$.lang[LANG]['editor.upload.max.1'] + $.lang[LANG]['editor.upload.max.2'] + '<br>file : ' + data.files[0].name + '<br>size : ' + filesize.toFixed(1) + 'Mb', true, false, '', 'ok');
                                return;
                            }

                            var filename = data.files[0].name;
                            var search = /%/g,
                                match = filename.match(search);

                            if(match===null) {

                                var uploadErrors = [];
                                var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
                                if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
                                    $(this).showModalFlat('INFORMATION', $.lang[LANG]['editor.upload.error.ext'], true, false, '', 'ok');
                                    return;
                                } else {
                                    UPLOAD++;
                                    UPLOADSIZE += parseInt(data.files[0].size/1024);
                                    data.submit();
                                }

                            } else {
                                $(this).showModalFlat('INFORMATION',$.lang[LANG]['editor.upload.filename'], true, false, '', 'ok');
                                return;
                            }
                        },
                        done: function (e, data) {
                            $('.uploadModal .uploadModal-message').html('<i class="fa fa-spinner fa-pulse fa-fw margin-bottom" aria-hidden="true"></i> ' + data.result.client_name + ' images creating...');
                            progress1 = parseInt(UPLOADED / UPLOAD * 50,10);
                            PROGRESS = progress1 + progress2;
                            $('.file-upload-progress .progress-bar').css({
                                'width' : PROGRESS + '%',
                                'text-align' : 'right',
                                'padding-right' : '5px'
                            }).text(PROGRESS + '% ');

                            UPLOADED++;
                            if(UPLOADED) {
                                //$.uploadON(UPLOADED + " / " + UPLOAD + "<br>images creating...");
                                if(UPLOAD==UPLOADED) {
                                    setTimeout(function() {
                                        if(SFOLDER_ACTIVE != '') resetFolderInfo(UPLOAD, UPLOADSIZE, 'all', 'upload');
                                        UPLOAD = 0;
                                        UPLOADED = 0;
                                        UPLOADSIZE = 0;
                                        PROGRESS = 0;
                                        $.uploadOFF();
                                        resourceGetPage(1,SFOLDER_ACTIVE);
                                        updateOutputFolder($('#nestableFolder').data('output', $('#nestableFolder-output')));
                                    },500);

                                    $('.file-upload-progress .progress-bar').css({
                                        'width' :  PROGRESS + '%',
                                        'padding-right' : '0px'
                                    }).text('');

                                }
                            }
                            if (data.result.error === undefined) {
                                $("li.resource-none").remove();
                                if(ADD) {
                                    addGalleryfile(data.result.file_name, SID, PAGE);
                                }
                            } else {
                                checkError(data.result);
                            }
                        },
                        progressall: function (e, data) {
                            $.uploadON();
                            // console.log("PROCESSALL", data);
                            progress2 = parseInt(data.loaded / data.total * 50, 10);
                            PROGRESS = progress1 + progress2;
                            $('.file-upload-progress .progress-bar').css({
                                'width' : PROGRESS + '%',
                                'text-align' : 'right',
                                'padding-right' : '5px'
                            }).text(PROGRESS + '% ');
                        },
                        start : function(e, data) {
                            progress1 = 0; progress2 = 0; PROGRESS = 0;
                        },
                        dragover : function(e, data) {
                            e.preventDefault();
                        }
                    }).prop('disabled', !$.support.fileInput)
                        .parent().addClass($.support.fileInput ? undefined : 'disabled');
                }
            });

            // Moves the "item count" tooltip
            var mouseX, mouseY;
            $('#el-fileupload').mousemove( function(e) {
               mouseX = e.pageX; 
               mouseY = e.pageY;
               $('.resource-tooltip').css({'top': mouseY-20,'left':mouseX-20 });
            });
            
            $('#selectAll').click(function () {
                var check = $(this);
                var selected = $('.selected-files li').map(function (i, n) {
                    return $(this).find("p.selected-file-name").text();
                }).get();

                $('#resource-files li').each(function () {
                    var file = $(this).find('.resource-file-name').attr('data-source'),
                        file_path = RPATH + '60/' + file,
                        ffloder = $("#resource-files ul[data-source='"+ file +"']").attr('data-ffolder'),
                        file_size = $("#resource-files .resource-file-name[data-source='"+ file +"']").next('.resource-file-size').text(),
                        file_seq = $(this).find('.resource-file-name').attr('data-seq');

                    if (check.prop('checked')) {
                        $(this).find('.fitem').addClass('ui-selected');
                        exist = $('p.resource-file-name[data-source="' + file + '"]').attr('data-source');
                        isAppend = ($.inArray(exist,selected)>-1) ? false : true;
                        if(exist && isAppend) {
                            $('.selected-files').append("<li data-source='"+ file +"' data-ffolder='" + ffloder + "' data-seq='"+file_seq+"'><img src='" + file_path + "'><div class='selected-hover'>&times;<p class='selected-file-name'>" + file + "</p><p class='selected-file-size'>"+file_size+"</p></div></li>");
                            $('.selected-files-count').text(selected.length);
                        }
                    } else {
                        $('.selected-files p:contains("' + file + '")').parents('li').remove();
                        $(this).find('.resource-image').removeClass('ui-selected');
                        $('.resource-selected-str').hide();
                    }
                });
                resetFileSelectedStr();
            });

            $('#resource-delete').click(function () {
                if($('.selected-files').children().length==0) {
                    return;
                }

                var r_pages = Number($('.resource-paging .pagination').attr('data-pages')),
                    r_page = Number($('.resource-paging .pagination li.active').text()),
                    r_file_cnt = $('#resource-files li.fitem').length;

                var modal = $(this).showModalFlat('DELETE IMAGE',$.lang[LANG]['config.common.resource.delete'], true, true, function() {
                    $.processON('Deleting the image(s)...');
                    modal.modal('hide');
                    var files = [], 
                        seqs = [],
                        sizes = [],
                        ffolders = [];
                    $('.selected-files li').each(function () {
                        files.push($(this).attr('data-source'));
                        seqs.push($(this).attr('data-seq'));
                        sizes.push($(this).find('.selected-file-size').text());
                        ffolders.push($(this).attr('data-ffolder'));
                    });
                    $('.selected-files').empty();
                    $('.resource-useit').removeClass('active');

                    resourceFileDelete(files,seqs,function() {
                        files.forEach(function(v,i) {
                            if(SFOLDER_ACTIVE!='') {
                                resetFolderInfo(-1, -sizes[i], 'all', 'delete');
                            } else {
                                resetFolderInfo(-1, -sizes[i], ffolders[i], 'delete');
                            }
                        });

                        r_page = ((r_file_cnt-files.length) == 0 && r_pages<=r_page) ? r_page-1 : r_page;
                        r_page = 1;
                        resourceGetPage(r_page,SFOLDER_ACTIVE);

                        updateOutputFolder($('#nestableFolder').data('output', $('#nestableFolder-output')));
                        $.processOFF();
                    });
                    
                },'cancel');
            });

            var resourceFileFolderUpdate = function(prevText,newText) {
                $.ajax({
                    type: 'POST',
                    url: '/template/resource/update-ffolder',
                    data: { sid: SID, prevffolder: prevText, newffolder: newText },
                    async: true,
                    success: function(data) {
                        checkError(data);
                    }
                });
            }
            var resourceFileDelete = function(file,seq,callback) {
                $.ajax({
                    type: 'POST',
                    url: '/template/resource/delete',
                    data: { s: file, sid: SID, seq: seq},
                    async: true,
                    success: function(data) {
                        checkError(data);
                        if(typeof callback == 'function') {
                            callback();
                        }
                    }
                });
            }

            $('.resource-file-delete').live({
                click : function(e) {
                    var file    = $(this).closest('ul').attr('data-source'),
                        seq     = $(this).closest('ul').attr('data-seq'),
                        size    = $(this).closest('ul').attr('data-fsize'),
                        ffolder = $(this).closest('ul').attr('data-ffolder'),
                        page    = $(this).closest('ul').attr('data-page'),
                        $parent = $(this).parent(),
                        files =  $('.selected-files li').map(function (i, n) {
                            return $(this).find("p.selected-file-name").text();
                        }).get();


                    var modal = $(this).showModalFlat('DELETE IMAGE',$.lang[LANG]['config.common.resource.delete'], true, true, function() {
                        $('.selected-files p:contains("' + file + '")').parents('li').remove();
                        $.processON('Deleting the image(s)...');
                        modal.modal('hide');
                        $('.resource-image p[data-seq="' + seq + '"]').remove();
                        $('.resource-useit').removeClass('active');

                        resourceFileDelete(file,seq,function() {
                            if(SFOLDER_ACTIVE!='') {
                                resetFolderInfo(-1, -size, 'all', 'delete');
                            } else {
                                resetFolderInfo(-1, -size, ffolder, 'delete');
                            }

                            // page = (page) ? page : 1;
                            page = 1;
                            resourceGetPage(page,SFOLDER_ACTIVE);
                            updateOutputFolder($('#nestableFolder').data('output', $('#nestableFolder-output')));
                            $.processOFF();   
                        });

                    },'cancel');
                }
            });

            $('.resource-file-search').live({
                click: function(e) {
                    $('#resourceImgView .img-wrapper > .img-responsive').attr('src',$(this).closest("ul").children(3).find("a").attr("href"));
                    $('#resourceImgView').modal('show');
                }
            });

            $('#resource-files').live('mousedown',function(e) {
                if(event.shiftKey) {
                    $('.selected-files').children('li').each(function () {
                        var s_file = $(this).attr('data-source'),
                            s_file_seq = $(this).attr('data-seq'),
                            s_file_size = $(this).attr('data-size');
                        if($("#resource-files .ui-selected ul[data-source='"+ s_file +"']").length == 0) {
                            $("#resource-files ul[data-source='"+ s_file +"']").closest('.fitem').find('.resource-image').addClass('ui-selected');
                        }
                    });
                }
            });
            $('.resource-image img').live('mousedown',function(e) {
                if($(this).closest('.fitem').hasClass('ui-selected')) {
                    fileDrag = true;
                }
                if(e.ctrlKey || e.shiftKey) {
                    if($(this).closest('.fitem').hasClass('ui-selected')) {
                        $(this).closest('.fitem').removeClass('ui-selected');
                        $('.selected-files').find('li[data-source="'+$(this).attr('alt')+'"]').remove();
                    }

                    if($('.selected-files').children().length != $('#resource-files').children('.fitem').length ) {
                        if($('#selectAll').prop('checked')) $('#selectAll').removeAttr('checked');
                    }
                    resetFileSelectedStr();
                }
            }).live('mouseup',function(e) {
                $('.fli').removeClass('drag-selected');
                fileDrag = false;
            }).live('mousemove', function(e) {
                if(fileDrag) {
                    var classstr = ($('.ui-selected').length > 1) ? 'multiple' : '';
                    $('.resource-tooltip').fadeIn().addClass(classstr)
                     .find('img').attr('src',$('.selected-files').children().last().find('img').attr('src'))
                     .next('.count').text($('.selected-files').children().length);
                }
            }).live('dragstart', function(e) {
                e.preventDefault();
            });

            $('.fli').live('mouseup',function(e) {
                if(fileDrag) {
                    $('li.fitem .resource-image').removeClass('ui-selected');
                    $('.fli').removeClass('drag-selected');

                    // selected-files 파일을 $.post로 보내고 리스트 페이지 갱신
                    var prevffolder = [], fsize = [],
                        targetffolder = $(this).attr('data-id'),
                        fselected = $('.selected-files li').map(function (i, n) {
                            prevffolder.push($(this).attr('data-ffolder')); 
                            fsize.push(parseInt($(this).find('p.selected-file-size').text()));
                            return $(this).find("p.selected-file-name").text();
                        }).get();

                    if(SID) {
                        var activeffolder = $('#nestableFolder').find('.fli.active').attr('data-id'),
                            r_pages = Number($('.resource-paging .pagination').attr('data-pages')),
                            r_page = Number($('.resource-paging .pagination li.active').text()),
                            r_file_cnt = $('#resource-files li.fitem').length;

                        $.post('/template/resource/update-fmove', { sid: SID, fselected: fselected, prevffolder: prevffolder, targetffolder: targetffolder }, function (data) {
                            checkError(data);
                            $.each(fselected, function(i,v) {
                                if(activeffolder[i] != prevffolder) {
                                    resetFolderInfo(-1, -fsize[i], prevffolder[i], 'move');
                                }
                                resetFolderInfo(1, fsize[i], targetffolder, 'move');
                            });

                            r_page = ((r_file_cnt-fselected.length) == 0 && r_pages<=r_page && SFOLDER_ACTIVE) ? r_page-1 : r_page;
                            r_page = 1;
                            cPage = 1;
                            resourceGetPage(r_page,SFOLDER_ACTIVE);
                            updateOutputFolder($('#nestableFolder').data('output', $('#nestableFolder-output')));
                            $('#resource-files').find('li.fitem .resource-image.ui-selected').removeClass('ui-selected');
                            $(".selected-files").empty();
                            resetFileSelectedStr();
                        }, 'json');
                    }
                }
            }).live('mouseenter',function(e) {
                $('.fli').removeClass('drag-selected');
                if(fileDrag) {
                    $(this).addClass('drag-selected');
                }
            }).live('mouseleave',function(e) {
                $('.fli').removeClass('drag-selected');
            });

            $('.resource-files-content').live('mouseup',function(e) {
                $('.resource-tooltip').fadeOut();
                fileDrag = false;
            });

            $('.add-folder').live({
                click: function(e) {
                    if(isFEdit) { 
                        if($('.fln-input').length > 0 ) $('.fln-input').focus();
                        return; 
                    } else {
                        $('.add-folder').attr('data-content','').popover('hide');
                    }

                    if($('#nestableFolder .fli').length >= 51) {
                        $(this).showModalFlat('INFORMATION', $.lang[LANG]['editor.resource.folder.maximum'], true, false, '', 'close');
                        return;
                    } else {
                        $('#nestableFolder .fli.active').removeClass('active').find('.fa-fl').attr('src','https://storage.googleapis.com/i.addblock.net/icon/fa_folder.png');
                        var add_folder = '\
                            <li class="dd-item fli active" data-id="clEmptyFolder">\
                                <img src="https://storage.googleapis.com/i.addblock.net/icon/fa_folder_open.png" alt="folder icon" class="fa-fl dd-handle" />\
                                <span class="dd-fln"></span>\
                                <span class="dd-flc" attr-count="0">0</span>\
                                <span class="dd-fls" attr-size="0" attr-size-unit="KB">0</span>\
                                <span class="dd-fld" attr-id="clEmptyFolder"><img src="https://storage.googleapis.com/i.addblock.net/icon/icon-menu-delete-w.png" class="fa"></span>\
                            </li>\
                        ';
                        
                        if($('#nestableFolder .fli[data-id="clclEmptyFolder"]').length == 0) {
                            $('#nestableFolder .fll').append(add_folder);
                        } else {
                            $('#nestableFolder .fli[data-id="clEmptyFolder"]').find('.dd-fln').val('');
                        }

                        $('<input type="text" />').appendTo($('#nestableFolder .fli[data-id="clEmptyFolder"] .dd-fln')).dblclick();
                        if($('.dd-list.fll').children().length > 10) {
                            $('#nestableFolder .fli[data-id="clEmptyFolder"] .dd-fln').find('input').css('max-width','153px');
                            $('#nestableFolder').scrollTop(2000);
                        }
                    }
                }
            });

            $('#nestableFolder .fll > .fli').live({
                click: function(e) {
                    if(isFEdit) { return; }
                    if($(this).parents('.fll').length == 2) {
                         depfolderClick = true;
                    }
                    if($(this).parents('.fll').length == 1 && depfolderClick) {
                        depfolderClick = false;
                        return;
                    } else {
                        if($(this).hasClass('active')) return;
                        $('#nestableFolder .fli.active').removeClass('active').find('.fa-fl').first().attr('src','https://storage.googleapis.com/i.addblock.net/icon/fa_folder.png');
                        $(this).addClass('active').find('.fa-fl').first().attr('src','https://storage.googleapis.com/i.addblock.net/icon/fa_folder_open.png');
                        SFOLDER_ACTIVE = ($(this).attr('data-id')!='all') ? $(this).attr('data-id') : '';

                        cPage = 1;
                        resourceGetPage(1,SFOLDER_ACTIVE);
                    }
                }
            });

            $('#nestableFolder .fli .dd-fln').live({
                dblclick: function(e) {
                    if(isFEdit) { return; }
                    if($(this).parent().closest('.fli').index() > 0) {
                        isFEdit = true;
                        editFolder($(this));
                    }
                }
            });

            $('#nestableFolder .fli .dd-fld').live({
                click: function(e) {
                    if(isFEdit) { return; }
                    if($(this).prev().attr('attr-size') > 0) {
                        $(this).showModalFlat('INFORMATION', $.lang[LANG]['editor.resource.regExp.delete'], true, false, '', 'close');
                    } else {
                        if($(this).parent().parent().parent('.dd-list').children().length == 1 ) {
                            $(this).parent().parent().parent('.dd-list').parent('.fli').first().click();
                            $(this).parent().parent().parent('.dd-list').parent('.fli').find('button[data-action="collapse"]').remove();
                            $(this).parent().parent().parent('.dd-list').parent('.fli').find('button[data-action="expand"]').remove();
                            $(this).parent().parent().parent('.dd-list').remove();
                        } else {
                            $(this).closest('li').remove();
                        }
                        updateOutputFolder($('#nestableFolder').data('output', $('#nestableFolder-output')));
                        $('#nestableFolder').find('.fll').children().first().click();
                    }
                }
            });

            var editFolder = function(ddfl) {
                $this = ddfl;
                var text = ( $this.closest('li.fli').attr('data-id') != 'clEmptyFolder') ? trim($this.text()).replace(/ /g,'-') : 'clEmptyFolder';

                var input_css = ($('.dd-list.fll').children().length > 10) ? "height: 36px; max-width: 153px;" : "height: 36px;";
                $('<input type="text" class="fln-input"/>').appendTo($this).val((text == 'clEmptyFolder')? "" : text.replace(/-/g,' ')).focusout(function(e) {

                    var regExp = /[\{\}\[\]\/!?.,;:|\)*~`^\-_+<>@\#$%&\\\=\(\'\"]/gi,
                        newText = (trim($(this).val())) ? trim($(this).val()) : (text =='clEmptyFolder') ? '' : text,
                        err_str = '';

                    if(regExp.test(newText)) {
                        $('#nestableFolder').css('pointer-events','none');
                        err_str = $.lang[LANG]['editor.resource.regExp.specialchar'];
                    } else if($('#nestableFolder .fli[data-id="'+newText.replace(/ /g,'-')+'"]:not(.active)').length > 0) {
                        $('#nestableFolder').css('pointer-events','none');
                        err_str = $.lang[LANG]['editor.resource.regExp.overlap'];
                    } else if(newText.length > 20) {
                        $('#nestableFolder').css('pointer-events','none');
                        err_str = $.lang[LANG]['editor.resource.regExp.maximum'];
                    } else { 
                        $('#nestableFolder').css('pointer-events','auto');
                        err_str = '';
                    }
                    
                    newText = newText.replace(/ /g,'-');

                    if(err_str!=''){ 
                        $(this).focus();
                        $('.add-folder').attr('data-content',err_str).popover("show");
                        if($(this).closest('.fli').index() > 9) $('.popover.in').css('top',$(this).offset().top-($('.dd-list').offset().top+5)-$('#nestableFolder').scrollTop());
                        else $('.popover.in').css('top',$(this).offset().top-$('.dd-list').offset().top-5);
                        
                    } else { 
                        $('.add-folder').popover("hide");
                        if(!newText && text =='clEmptyFolder') {
                            $(this).parent().closest('.fli[data-id="clEmptyFolder"]').remove();
                            var last_class = $('#nestableFolder .fli').last().attr('data-id');
                            $('#nestableFolder .fli').last().addClass('active').find('.fa-fl').first().attr('src','https://storage.googleapis.com/i.addblock.net/icon/fa_folder_open.png');
                            SFOLDER_ACTIVE = last_class;
                            resourceGetPage(1,SFOLDER_ACTIVE);
                        } else {
                            $(this).parent().closest('.fli').attr('data-id',newText);
                            $(this).parent().closest('.fli').find('.dd-fld').attr('attr-id',newText);
                            $(this).parent().text(newText.replace(/-/g,' ')).find('input').remove();
                            updateOutputFolder($('#nestableFolder').data('output', $('#nestableFolder-output')));
                            resourceFileFolderUpdate(text,newText);
                            SFOLDER_ACTIVE = newText;
                            if(text == 'clEmptyFolder') resourceGetPage(1,SFOLDER_ACTIVE);
                            else {
                                $('#resource-files .fitem').each(function() {
                                    $(this).find('.control-area ul[data-ffolder="'+text+'"]').attr('data-ffolder',newText);
                                });
                            }
                        }
                        $('.add-folder').attr('data-content','').popover('hide');
                        isFEdit = false;
                    }
                }).attr('style',input_css);
            }

            $('.selected-files li').live({
                mouseenter : function() {
                    $(this).find('.selected-hover').show();
                },
                mouseleave : function() {
                    $(this).find('.selected-hover').hide();
                }
            });

            $('.fr-selected-files li').live({
                mouseenter : function() {
                    $(this).find('.selected-hover').show();
                },
                mouseleave : function() {
                    $(this).find('.selected-hover').hide();
                }
            });

            $(document).on({
                click : function() { 
                    var file = $(this).find('p.selected-file-name').text();
                    $(this).parent().fadeOut(300,function() {
                        $(this).remove();
                        if(myStorageActive()) {
                            $('#resource-files li .ui-selected').find('p.resource-file-name[data-source="' + file + '"]').closest('.fitem').removeClass('ui-selected');
                            displaySelectedFilesStr();
                        } else {
                            var id = $(this).attr('data-id');
                            $('.fr-storage .imgs.ui-selected').find('.control-area[data-id="' + id + '"]').parents('.imgs').removeClass('ui-selected');
                        }
                    });
                    if($('.selected-files li').length==1) {
                        $('.resource-useit').removeClass('active');
                        $('#selectAll').prop('checked',false);
                    }
                }
            },'.selected-hover');

        },
        open: function() {
            var $modal = $('#el-fileupload');
            $modal.modal('show');
        },
        close: function() {
            var $modal = $('#el-fileupload');
            $modal.modal('hide');
        },
        selected: function() {
            var selected = $('.selected-files li').map(function (i, n) {
                return $(this).find("p.selected-file-name").text();
            }).get();
            return selected;
        }
    }

})(jQuery);
var SFOLDER_ACTIVE = '';
var updateOutputFolder = function (e) {
    var list = e.length ? e : $(e.target),
        output = list.data('output');

    if (window.JSON && list.attr('class') == 'dd') {
        output.val(window.JSON.stringify(list.nestable('serialize')));
    } else {
        if (typeof output != "undefined") output.val('JSON browser support required');
    }

    if (SID) {
        $.post('/template/update/type/folder', { s: $('#nestableFolder-output').val(), id: SID }, function (data) {
            checkError(data);
        }, 'json');
    }

}

var displaySelectedFilesStr = function() {
    if($('.selected-files').children().length) {
        $('.selected-files-count').text($('.selected-files').children().length);
        $('.resource-selected-str').show();    
    } else {
        $('.resource-selected-str').hide();
    }
}

var resetFileSelectedStr = function() {
    if($('.selected-files').children().length>0) {
        $('.resource-useit').addClass('active');
        $('.resource-selected-str').show();
        $('.selected-files-count').text($('.selected-files').children().length);
    } else {
        $('.resource-useit').removeClass('active');
        $('.resource-selected-str').hide();
        $('.selected-files-count').text('0');
    }
}

var resetFileSelectedFr = function() {
    if($('.fr-selected-files').children().length>0) {
        $('.resource-useit').addClass('active');
        $('.resource-selected-str').show();
        $('.selected-files-count').text($('.selected-files').children().length);
    } else {
        $(".fr-selected-files").empty();
        $('.resource-useit').removeClass('active');
        $('.resource-selected-str').hide();
        $('.selected-files-count').text('0');
    }
}

var resourceGetPage = function(page,ffolder,keep) {
    if(page == 1) {
        $('#resource-files').empty();
        for(var i=0; i<6; i++) {
            $('#resource-files').append('<li class="f-wrap">');
        }
    }

    $('#resource-files').removeClass('empty');
    $('#selectAll').prop('checked',false);
    var selectedAll = true;
    ffolder = (typeof ffolder == 'undefined') ? SFOLDER_ACTIVE : ffolder;
    $.getJSON('/template/resource/files/page/' + page + '/ffolder/' + ffolder , function (data) {
        if (typeof(data.error) == "undefined") {
            cTotal = data.total;
            var path = data.path;

            var selected = $('.selected-files li').map(function (i, n) {
                return $(this).find("p.selected-file-name").text();
            }).get();
            
            resourceNoticeTextTop = $.lang[LANG]['editor.resource.notice.text.top'];
            resourceNoticeTextBottom = $.lang[LANG]['editor.resource.notice.text.bottom'];

            page = (data.file.length <2) ? page-1 : page;
            page = (page) ? page : 1;

            var $fHeight = $('#resource-files .f-wrap');
            var fi = 0, 
                height = [
                    $fHeight.eq(0).height(),
                    $fHeight.eq(1).height(),
                    $fHeight.eq(2).height(),
                    $fHeight.eq(3).height(),
                    $fHeight.eq(4).height(),
                    $fHeight.eq(5).height()
                ];
            $.each(data.file, function (idx, val) {
                fi = idx%6;
                var set = (idx < 3 && page==1) ? idx : height.indexOf(Math.min.apply(null,height));

                var tag = resourceFileTag(val.filename, val.seq, path, selected, val.ffolder, page, val.origname, parseInt(val.filesize));
                if($.inArray(val,selected)<0) selectedAll = false;

                var r = Math.round(val.h*800/val.w);
                height[set] = height[set] + r;
                $('#resource-files .f-wrap').eq(set).append(tag);
            });
            $('#resource-files').selectable({ filter: " .fitem"});

            var folder_size = (parseInt(data.fsize_total/1024)>0) ? parseInt(data.fsize_total/1024) : parseInt(data.fsize_total),
                folder_size_unit = (parseInt(data.fsize_total/1024)>0) ? 'MB' : 'KB' ;

            $('.fli.active > .dd-flc').attr('attr-count',data.total).text(data.total);
            $('.fli.active > .dd-fls').attr({'attr-size': parseInt(data.fsize_total), 'attr-size-unit':folder_size_unit}).text(folder_size);

            if(data.total==0) {
                selectedAll = false;
                $('#resource-files').addClass('empty');
                var str = ""
                    +"<li class='resource-empty-area'>"
                    + " <div class='resource-empty'>"
                    + " <div class='img-wrap'><img src='https://storage.googleapis.com/i.addblock.net/config/fa_resource_img_icon.png' alt='image storage' /></div>"
                    + " <p>" + resourceNoticeTextTop + "<br>"
                    + "" + resourceNoticeTextBottom + "</p>"
                    + "</div>"
                    + "</li>"
                ;
                $('#resource-files').append(str);
            } else {
                var upgrade_link = (HOST.indexOf('gabia') > -1) ? "https://www.gabia.com/mygabia/service" : "/upgrade/site/" + SID,
                    load_btn = '\
                            <img src="https://storage.googleapis.com/i.addblock.net/image-upload.gif">&nbsp;&nbsp;\
                            <span class="resource-info"><span>' + $.lang[LANG]["config.file.browse"] + '</span></span>\
                            <input id="fileupload-resource" class="modal-upload-button-resource" type="file" name="files[]" multiple>\
                    ',
                    upgrade_btn = '\
                        <a href="' + upgrade_link + '" style="color: #fff; text-decoration:none;">\
                            <i class="fa fa-level-up" aria-hidden="true" style="margin-right: 5px;"></i>\
                            <span class="resource-info">' + $.lang[LANG]["plan.upgrade"] + '</span>\
                        </a>\
                    ';

                var str = (data.is_limit) ? upgrade_btn : load_btn,
                    css_str = (data.is_limit) ? {'background-color':'#4889e7', 'margin-left':'5px'} : {}, 
                    max_str = (data.is_limit) ? '<span class="error">' + $.lang[LANG]['plan.disk-space.limit.info'] + '</span> ' : '';

                $('#el-fileupload .fileinput-button').attr('data-limit',data.is_limit).html(str).css(css_str);
                $('.upload-max-size').html(max_str);
            }

        } else {
            checkError(data);
            $('<li class="text-center resource-none"/>').text('No files uploaded').appendTo('#resource-files');
        }
        $('.listprogress').remove();
    });
    if(selectedAll) $('#selectAll').prop('checked',true);
    displaySelectedFilesStr();
}

var resourcePaging = function(page,total,ffolder) {
    view = RVIEW;
    $('.resource-paging').empty();

    page_view = 10;
    start = Math.floor((page-1) / page_view) * page_view;
    pages = Math.ceil(total/view);
    end = (Math.floor((page-1) / page_view) + 1) * page_view;
    end = (end>pages) ? pages : end;

    prev = (start > 0) ? start : 1;
    next = ((end+1) > pages) ? pages : end+1;

    ffolder = (ffolder) ? 'ffolder' : 'all';

    var str = '\
    <ul class="pagination pagination-sm" data-pages="'+pages+'">\
        <li><a href="javascript:;" onclick="resourceGetPage(' + prev + ')">&laquo;</a></li>\
    ';
    for(i=start;i<end;i++) {
        active = ((i+1)==page) ? "active" : "";
        str = str + '\
        <li class="' + active + '"><a href="javascript:;" onclick="resourceGetPage(' + (i+1) + ')">' + (i+1) + '</a></li>\
        ';
    }
    str = str + '\
        <li><a href="javascript:;" onclick="resourceGetPage(' + next+ ')">&raquo;</a></li>\
    </ul>\
    ';
    if(total) $('.resource-paging').append(str);
}

var initResource = function () {
    $('#progress .progress-bar').css('width', '0%');
    $('.selected-files').empty();
    //$('#resource-files').html('');
    $('.resource-useit').removeClass('active');
    $('.fr-selected-files').empty();
    $('.fr-storage .imgs').removeClass('ui-selected');
}
var resourceFileTag = function (source, seq, path, selected, ffolder, page, origname, filesize) {
    active = ($.inArray(source,selected)>-1) ? " ui-selected" : "";
    var control_box = '<ul data-ffolder="'+ffolder+'" data-page="'+page+'" data-source="'+source+'" data-seq="'+seq+'" data-fsize="'+filesize+'">\
        <li><i class="fa fa-search resource-file-search" aria-hidden="true"></i></li>\
        <li><a href="' + path + '/' + source + '" target="_blank" alt="' + source + '" download="'+origname+'"><i class="fa fa-download" aria-hidden="true"></i></a></li>\
        <li><i class="fa fa-trash-o resource-file-delete" aria-hidden="true"></i></li>\
    </ul>\
    ';
    // <span class="resource-file-delete" data-page="' + page + '">&times;</span> //20160908
    var $item = $("<div class='fitem" + active + "'></div>"),
        $img = $('<div class="resource-image"><img src="' + path + '/800/' + source + '" alt="' + source + '"></div><div class="control-area">'+control_box+'</div>');

    $item.append($img);
    $item.append('<p class="resource-file-name" data-seq="' + seq + '" data-source="' + source + '">' + origname + '</p><p class="resource-file-size">'+filesize+'</p>');
    // $li.append('<p class="resource-file-name" data-seq="' + seq + '" data-source="' + source + '">' + origname + '</p><span class="resource-file-delete" data-page="' + page + '">&times;</span>'); //20160908
    return $item;
}

var resetFolderInfo = function(count, size, ffolder, state) {
    if(ffolder!='all' ||  ffolder=='all' && state!='move' ) {
        var flc = $('#nestableFolder .fli[data-id="'+ ffolder +'"]').find('.dd-flc').attr('attr-count'),
            fls = $('#nestableFolder .fli[data-id="'+ ffolder +'"]').find('.dd-fls').attr('attr-size'),
            fls_u = $('#nestableFolder .fli[data-id="'+ ffolder +'"]').find('.dd-fls').attr('attr-size-unit');

        fls = parseInt(fls);
        fls_v = (parseInt((fls+size)/1024) > 0 ) ? (fls+size)/1024 : fls+size;
        fls_u = (parseInt((fls+size)/1024) > 0 ) ? "MB" : "KB";

        $('#nestableFolder .fli[data-id="'+ ffolder +'"]').find('.dd-flc').attr('attr-count', parseInt(flc)+count ).text(parseInt(flc)+count);
        $('#nestableFolder .fli[data-id="'+ ffolder +'"]').find('.dd-fls').attr({'attr-size':fls+size, 'attr-size-unit':fls_u}).text(parseInt(fls_v));
    }
}
var myStorageActive = function() {
    return ($('#mystorage').hasClass('active')) ? true : false;
}
