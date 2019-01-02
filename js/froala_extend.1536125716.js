var isReplace,upTYPE;
$.FroalaEditor.ICON_TEMPLATES = {
  font_awesome: '<i class="fa fa-[NAME]"></i>',
  text: '<span style="text-align: center;">[NAME]</span>',
  image: '<img src=[SRC] alt=[ALT] />'
}
$.FroalaEditor.DefineIcon('imageRemove', {NAME: 'trash-o'});
$.FroalaEditor.DefineIcon('image-replace-icon', { NAME: 'picture-o fa-flip-horizontal'});
$.FroalaEditor.RegisterCommand('image-replace', {
  title: 'Replace image',
  icon: 'image-replace-icon',
  undo: true,
  focus: true,
  showOnMobile: true,
  refreshAfterCallback: true,
  callback: function () {
      this.selection.save();
      isReplace = true;
      upTYPE = 'image';
      $('#file_type').val(upTYPE);
      $('#uploadFile').val('');
      $('#uploadFile').trigger('click');
  },
  refresh: function ($btn) { }
});
$.FroalaEditor.DefineIcon('image-align-full', { SRC: 'https://storage.googleapis.com/i.addblock.net/icon/image-align-full.png', ALT: 'Image full width', template: 'image'});
$.FroalaEditor.RegisterCommand('img-align-full', {
  title: 'Image full width',
  icon: 'image-align-full',
  undo: true,
  focus: true,
  showOnMobile: true,
  refreshAfterCallback: true,
  callback: function () {
    this.image.get().removeClass(function (index, css) {
      return (css.match (/f-align-(left|right|full|wide|original)(-470)*/g) || []).join(' ');
    }).addClass('f-align-full');
    setForumWrap();
    this.image.back();
    $('.fr-btn.fr-btn-image').removeClass('active');
    $('.fr-btn.fr-btn-image[data-cmd="img-align-full"]').addClass('active');
  },
  refresh: function ($btn) { 
    setImageToolbarPosition($btn,this.image.get());
    refreshImagebtn(this.image.get());
  }
});

$.FroalaEditor.DefineIcon('image-align-wide', { SRC: 'https://storage.googleapis.com/i.addblock.net/icon/image-align-wide.png', ALT: 'Image wide width', template: 'image'});
$.FroalaEditor.RegisterCommand('img-align-wide', {
  title: 'Image wide width',
  icon: 'image-align-wide',
  undo: true,
  focus: true,
  showOnMobile: true,
  refreshAfterCallback: true,
  callback: function () {
    this.image.get().removeClass(function (index, css) {
      return (css.match (/f-align-(left|right|full|wide|original)(-470)*/g) || []).join(' ');
    }).addClass('f-align-wide');
    setForumWrap();
    this.image.back();
    $('.fr-btn.fr-btn-image').removeClass('active');
    $('.fr-btn.fr-btn-image[data-cmd="img-align-wide"]').addClass('active');
  },
  refresh: function ($btn) { 
    setImageToolbarPosition($btn,this.image.get());
    refreshImagebtn(this.image.get());
  }
});

$.FroalaEditor.DefineIcon('image-align-original', { SRC: 'https://storage.googleapis.com/i.addblock.net/icon/image-align-original.png', ALT: 'Image wide original', template: 'image'});
$.FroalaEditor.RegisterCommand('img-align-original', {
  title: 'Image wide original',
  icon: 'image-align-original',
  undo: true,
  focus: true,
  showOnMobile: true,
  refreshAfterCallback: true,
  callback: function () {
    this.image.get().removeClass(function (index, css) {
      return (css.match (/f-align-(left|right|full|wide|original)(-470)*/g) || []).join(' ');
    }).addClass('f-align-original').removeAttr('style');
    this.image.back();
    $('.fr-btn.fr-btn-image').removeClass('active');
    $('.fr-btn.fr-btn-image[data-cmd="img-align-original"]').addClass('active');
  },
  refresh: function ($btn) {
    setImageToolbarPosition($btn,this.image.get());
    refreshImagebtn(this.image.get());
  }
});

$.FroalaEditor.DefineIcon('image-align-left-470', { SRC: 'https://storage.googleapis.com/i.addblock.net/icon/image-align-left-470.png', ALT: 'Image left width 470px', template: 'image'});
$.FroalaEditor.RegisterCommand('img-align-left-470', {
  title: 'Image left width 470px',
  icon: 'image-align-left-470',
  undo: true,
  focus: true,
  showOnMobile: true,
  refreshAfterCallback: true,
  callback: function () {
    this.image.get().removeClass(function (index, css) {
      return (css.match (/f-align-(left|right|full|wide|original)(-470)*/g) || []).join(' ');
    }).addClass('f-align-left-470');
    this.image.back();
    $('.fr-btn.fr-btn-image').removeClass('active');
    $('.fr-btn.fr-btn-image[data-cmd="img-align-left-470"]').addClass('active');
  },
  refresh: function ($btn) {
    setImageToolbarPosition($btn,this.image.get());
    refreshImagebtn(this.image.get());
  }
});

$.FroalaEditor.DefineIcon('image-align-right-470', { SRC: 'https://storage.googleapis.com/i.addblock.net/icon/image-align-right-470.png', ALT: 'Image right width 470px', template: 'image'});
$.FroalaEditor.RegisterCommand('img-align-right-470', {
  title: 'Image right width 470px',
  icon: 'image-align-right-470',
  undo: true,
  focus: true,
  showOnMobile: true,
  refreshAfterCallback: true,
  callback: function () {
    this.image.get().removeClass(function (index, css) {
      return (css.match (/f-align-(left|right|full|wide|original)(-470)*/g) || []).join(' ');
    }).addClass('f-align-right-470');
    this.image.back();
    $('.fr-btn.fr-btn-image').removeClass('active');
    $('.fr-btn.fr-btn-image[data-cmd="img-align-right-470"]').addClass('active');
  },
  refresh: function ($btn) {
    setImageToolbarPosition($btn,this.image.get());
    refreshImagebtn(this.image.get());
  }
});

$.FroalaEditor.DefineIcon('image-align-left', { SRC: 'https://storage.googleapis.com/i.addblock.net/icon/image-align-left.png', ALT: 'Image left width 350px', template: 'image'});
$.FroalaEditor.RegisterCommand('img-align-left', {
  title: 'Image left width 350px',
  icon: 'image-align-left',
  undo: true,
  focus: true,
  showOnMobile: true,
  refreshAfterCallback: true,
  callback: function () {
    this.image.get().removeClass(function (index, css) {
      return (css.match (/f-align-(left|right|full|wide|original)(-470)*/g) || []).join(' ');
    }).addClass('f-align-left');
    this.image.back();
    $('.fr-btn.fr-btn-image').removeClass('active');
    $('.fr-btn.fr-btn-image[data-cmd="img-align-left"]').addClass('active');
  },
  refresh: function ($btn) {
    setImageToolbarPosition($btn,this.image.get());
    refreshImagebtn(this.image.get());
  }
});

$.FroalaEditor.DefineIcon('image-align-right', { SRC: 'https://storage.googleapis.com/i.addblock.net/icon/image-align-right.png', ALT: 'Image right width 350px', template: 'image'});
$.FroalaEditor.RegisterCommand('img-align-right', {
  title: 'Image right width 350px',
  icon: 'image-align-right',
  undo: true,
  focus: true,
  showOnMobile: true,
  refreshAfterCallback: true,
  callback: function () {
    this.image.get().removeClass(function (index, css) {
      return (css.match (/f-align-(left|right|full|wide|original)(-470)*/g) || []).join(' ');
    }).addClass('f-align-right');
    this.image.back();
    $('.fr-btn.fr-btn-image').removeClass('active');
    $('.fr-btn.fr-btn-image[data-cmd="img-align-right"]').addClass('active');
  },
  refresh: function ($btn) {
    setImageToolbarPosition($btn,this.image.get());
    refreshImagebtn(this.image.get());
  }
});

$.FroalaEditor.DefineIcon('editor-enter-icon', { SRC: 'https://storage.googleapis.com/i.addblock.net/icon/enter-icon.png', ALT: 'Enter', template: 'image'});
$.FroalaEditor.RegisterCommand('editor-enter', {
  title: 'Enter',
  icon: 'editor-enter-icon',
  undo: true,
  focus: true,
  showOnMobile: true,
  refreshAfterCallback: true,
  callback: function () {
    this.image.get().parents('p').after('<p><br></p>');
  }
});
$.FroalaEditor.RegisterCommand('video-enter', {
  title: 'Enter',
  icon: 'editor-enter-icon',
  undo: true,
  focus: true,
  showOnMobile: true,
  refreshAfterCallback: true,
  callback: function () {
    this.video.get().parents('p').after('<p><br></p>');
  },
  refresh: function ($btn) {
    setVideoToolbarPosition($btn,this.video.get());
    refreshVideobtn(this.video.get());
  }
});

function hideLargeImagebtn() {
  if($('body').width()>768) {
    $('.fr-btn.fr-btn-image[data-cmd="img-align-full"], .fr-btn.fr-btn-image[data-cmd="img-align-wide"]').hide();
  }
}

function showLargeImagebtn() {
  if($('body').width()>768) {
    $('.fr-btn.fr-btn-image[data-cmd="img-align-full"], .fr-btn.fr-btn-image[data-cmd="img-align-wide"]').show();
    $('.fr-btn.fr-command[data-cmd="imageAlign"]').hide();
  }
}

function refreshImagebtn($obj) {
  if($('body').width() < 768) $('.fr-btn.fr-command[data-cmd="imageAlign"]').hide();

  if($obj.hasClass('image-width-small')) {
    hideLargeImagebtn();
    if($obj.hasClass('f-align-original')) $('.fr-btn.fr-command[data-cmd="imageAlign"]').show();
    else $('.fr-btn.fr-command[data-cmd="imageAlign"]').hide();
  } else showLargeImagebtn();

  // $obj.removeClass(function (index, css) {
  //   return (css.match (/f-align-(left|right|full|wide|original)(-470)*/g) || []).join(' ');
  // });
  
  var imgClass = $obj.attr('class').match(/f-align-(left|right|full|wide|original)(-470)*/g), 
      align = (imgClass==null) ? '' : imgClass[0],
      align = (align) ? align.replace('f-','img-') : '';
  $('button[data-cmd="' + align + '"]').addClass('active');
}

function refreshVideobtn($obj) {
  if($obj.find('iframe').width()<720 && $('body').width() > 767) {
    $('.fr-btn.fr-command[data-cmd="videoAlign"]').show();
  } else {
    $('.fr-btn.fr-command[data-cmd="videoAlign"]').hide();
  }
  $('.fr-video-resizer').css({
    width: ($obj.find('iframe').width() + 2) + 'px',
    height: ($obj.find('iframe').height() +2) + 'px',
  });
}

function setImageToolbarPosition($btn,$img) {
    var $toolbar = $btn.parents('.fr-popup'),
        $resizer = $('.fr-image-resizer');

    $toolbar.css('visibility','hidden');
    $resizer.css('visibility','hidden');
    setTimeout(function() {
      $resizer.width($img.width()+'px');
      $resizer.height($img.height()+'px');
      $resizer.css('top', ($img.offset().top - $('#fm-editor').offset().top -1) + 'px');
      $resizer.css('left', ($img.offset().left - $('#fm-editor').offset().left -1) + 'px');
      var top = $resizer.offset().top + ($img.height()/2-28),
          left = $img.offset().left + ($img.width() - $toolbar.width()) / 2;
      if($toolbar.hasClass('fr-above')) top = top + 10;
      $toolbar.css('top', top + 'px');
      $toolbar.css('left', left + 'px');

      $toolbar.css('visibility','visible');
      $resizer.css('visibility','visible');

      // $toolbar.find('[data-cmd="img-align-full"], [data-cmd="img-align-wide"], [data-cmd="img-align-original"], [data-cmd="img-align-left-470"], [data-cmd="img-align-right-470"], [data-cmd="img-align-left"], [data-cmd="img-align-right"]').show();
    },100);
}
function setVideoToolbarPosition($btn,$img) {
    var $toolbar = $btn.parents('.fr-popup'),
        $resizer = $('.fr-video-resizer');
    $toolbar.css('visibility','hidden');
    setTimeout(function() {
      var top = $resizer.offset().top + ($img.height()/2-28);
      if($toolbar.hasClass('fr-above')) top = top + 10;
      $toolbar.css('top',top + 'px');
      $toolbar.css('visibility','visible');
    },100);
}

function lastLineEmpty() {
  // if($('#forum-modal .fr-view p:last-child').text() == '' && $('#forum-modal .fr-view p:last-child').find('*').length < 2 &&
  //    $('#forum-modal .fr-view p:last-child').find('img').length == 0 &&
  //    $('#forum-modal .fr-view p:last-child').find('iframe').length == 0 ) {
  //   $('#forum-modal .fr-view p:last-child').addClass('last-line-empty');
  // } else {
  //   if($('#forum-modal .fr-view p:last-child').text().charCodeAt(0) == '8203' && 
  //      $('#forum-modal .fr-view p:last-child').find('img').length == 0 &&
  //      $('#forum-modal .fr-view p:last-child').find('iframe').length == 0) $('#forum-modal .fr-view p:last-child').addClass('last-line-empty');
  //   else $('#forum-modal .fr-view p:last-child').removeClass('last-line-empty');
  // }
}

$(document).on('click','#forum-modal .fr-view p', function(e) {
  // if($(this).hasClass('last-line-empty')) $(this).removeClass('last-line-empty');
  // else lastLineEmpty();
});

function editorImageReplace(src) {
  var $img = $('#fm-editor').froalaEditor('image.get'),
      $btn = $('.fr-popup.fr-active').find('button[data-cmd="image-replace"]'),
      tmpImg = new Image();
  tmpImg.src = src;
  tmpImg.onload = function() {
    $img.attr('src',src);
    $img.removeClass('image-width-small');
    if(this.width < 720) $img.addClass('image-width-small');
    setImageToolbarPosition($btn,$img);
    refreshImagebtn($img);
    $.processOFF();
  };
}

function imageSetClass($obj) {
  var width = $('.forum-write').hasClass('w740') ? 720 : 1140;
  if($obj.width()< width) $obj.addClass('image-width-small').addClass('f-align-original');
}

$(function() {
  $(document).on('mouseenter','.forum-view.post .edt-type-file',function(e) {
      $(this).addClass('active');
      var offleft = $(this).find('.fr-file').offset().left - $(this).offset().left,
          align = $('.sideToolbar .tb-text-align').attr('data-align'),
          pos = 50;
      if(align == 'right') pos = -($(this).find('.fr-file').width() + 100);

      var left = $(this).find('.fr-file').width() + offleft + pos;
      $(this).append('<span class="edt-file-delete" style="left:' + (left+5) + 'px;width:41px;"><i class="fa fa-trash-o"></i></span>');
      $(this).append('<span class="edt-enter" style="left:' + (left+46) + 'px;width:41px;"><img src="https://storage.googleapis.com/i.addblock.net/icon/enter-icon.png"></span>');
  }).on('mouseleave','.forum-view.post .edt-type-file',function(e) {
      $(this).removeClass('active');
      $('.edt-file-delete').remove();
      $('.edt-enter').remove();
  }).on('click','.forum-view.post .edt-type-file, #forum-modal .fr-file',function(e) {
      e.stopPropagation();
      e.preventDefault();
      // if($(this).parents('p').next().length == 0) {
      //     $(this).parents('p').after('<p class="last-line-empty"><br></p>');
      //     $(('#forum-modal')).scrollTop($('#forum-modal').height());
      // }
  });
  $(document).on('click','.forum-view.post .edt-file-delete', function(e) {
      $('#fm-editor').froalaEditor('undo.saveStep');
      $(this).parents('.edt-type-file').remove().focus();
  });

  $(document).on('click','.forum-view.post .edt-enter', function(e) {
      $('#fm-editor').froalaEditor('undo.saveStep');
      $(this).parents('p').after('<p><br></p>');
  });


  $(document).on('click','.fm-thumb-img',function(e) {
    $('#fm-editor').froalaEditor('selection.save');
    isReplace = false;
    upTYPE = 'thumb';
    $('#file_type').val(upTYPE);
    $('#uploadFile').val('');
    $('#uploadFile').trigger('click');
  });

  $(document).on('click','.tb-attach-file',function(e) {
    $('#fm-editor').froalaEditor('selection.save');
    isReplace = false;
    upTYPE = 'image';
    $('#file_type').val(upTYPE);
    $('#uploadFile').val('');
    $('#uploadFile').trigger('click');
  });

  $(document).on('click','.tb-file-insert', function(e) {
    upTYPE = 'file';
    $('#file_type').val(upTYPE);
    $('#uploadFile').val('');
    $('#uploadFile').trigger('click');
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

      // video url patterns(youtube, instagram, vimeo, dailymotion)
      var ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var ytMatch = url.match(ytRegExp);

      var igRegExp = /\/\/instagram.com\/p\/(.[a-zA-Z0-9]*)/;
      var igMatch = url.match(igRegExp);

      var vRegExp = /\/\/vine.co\/v\/(.[a-zA-Z0-9]*)/;
      var vMatch = url.match(vRegExp);

      var vimRegExp = /\/\/(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/;
      var vimMatch = url.match(vimRegExp);

      var dmRegExp = /.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
      var dmMatch = url.match(dmRegExp);

      var sound = url.search("soundcloud.com");

      var $video;
      if (ytMatch && ytMatch[2].length === 11) {
      } else if (igMatch && igMatch[0].length > 0) {
      } else if (vMatch && vMatch[0].length > 0) {
      } else if (vimMatch && vimMatch[3].length > 0) {
      } else if (dmMatch && dmMatch[2].length > 0) {
      } else if (sound>-1) {
      } else {
        $('#video-url').after('<label class="error">' +  $.lang[LANG]['editor.video.url.error'] + '</label>').focus();
        return;
      }

      if ($video) {
        $video.attr('frameborder', 0).attr('class','tpl-video');
        range.create().insertNode($video[0]);
        //$('.note-editable').fitVids();
      }
      var video = insertVideo(url,'src'),
        frVideo = '<span class="fr-video fr-dvb fr-draggable" contenteditable="false" draggable="true">' +
            '<iframe width="720" height="405" src="' + video + '" frameborder="0" allowfullscreen="true"></iframe>' +
            '</span>';

      $('#fm-editor').froalaEditor('selection.restore');
      $('#fm-editor').froalaEditor('html.insert', frVideo , true);
      modal.modal('hide');

    }, 'cancel', '', 'w480 video-modal');
    $('.flat-modal').css({
      'position' : 'absolute',
      'z-index' : '1051'
    });
    $('.flat-modal').next().css('z-index','1050');
  });
  
  $(document).on('click','.tb-divider-insert', function(e) {
    var mode = ($(this).hasClass('pc')) ? ".pc" : ".mobile";
    if($('.sub-divider'+mode).css('display') == "block") $('.sub-divider'+mode).hide();
    else $('.sub-divider'+mode).show();
    $('#fm-editor').froalaEditor('selection.save');
    // $('#fm-editor').froalaEditor('image.insert','http://storage.googleapis.com/cr-resource/forum/958ee630c0ff8b9f857b9002f937e808/811d09af2cd93ce62080d8ccfaed37ce.png',true);
  });

  $(document).on('click','.tb-insert-hr', function(e) {
    var type = $(this).attr('data-type');
    $('#fm-editor').froalaEditor('selection.restore');
    switch(type) {
      case "h1": $('#fm-editor').froalaEditor('html.insert','<hr class="forum-hr1"><p><br></p>',true); break;
      case "h2": $('#fm-editor').froalaEditor('html.insert','<hr class="forum-hr2"><p><br></p>',true); break;
      case "h3": $('#fm-editor').froalaEditor('html.insert','<hr class="forum-hr3"><p><br></p>',true); break;
      case "h4": $('#fm-editor').froalaEditor('html.insert','<hr class="forum-hr4"><p><br></p>',true); break;
      case "h5": $('#fm-editor').froalaEditor('html.insert','<hr class="forum-hr5"><p><br></p>',true); break;
      default: return; break;
    }
    $('.sub-divider').hide();
  });
});

var videoForm = function() {
  return '' +
    '<div class="form-inline comment-addform video">' + 
        '<div class="form-group">' +
          '<p>' + $.lang[LANG]['editor.video.info'] + '</p>' + 
          '<label class="sr-only" for="label-video">' +  $.lang[LANG]['config.modal.password'] + '</label>' +
          '<input type="text" class="form-control" id="video-url" placeholder="http://">' +
        '</div>' +
    '</div>';
}

window.onload = function(){
  // setLanguage(LANG);
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

      // $.processOFF();
        if(res.file_type == 'thumb') {
          $('#fm-thumb').removeClass('empty');
          $('#fm-thumb').find('img.fm-thumb-img').attr('src',res.file);

          var thumb_history_idx = $('#fm-thumb').find('input[type="hidden"]').length;
          $('#fm-thumb').append('<input type="hidden" id="thumb-history-' + thumb_history_idx + '" value="' + res.file + '" data-file-name="' + res.uploaded.file_name + '"/>')

          $.processOFF();
        } else {
          setfile(res.file, res.uploaded.file_name, res.uploaded.orig_name);
        }
    }
    document.getElementById("uploadFile").onchange = function() {
      $.processON('Uploading...');
      document.getElementById("uploadForm").submit();
    }
}

function setfile(file,file_name,orig_name) {
    var $file = $('<div class="result-file" data-file="' + file + '" data-file-name="' + file_name + '">'),
        $result = $('<span><i class="fa fa-paperclip"></i></span> <span class="set-image hand"><i class="fa fa-arrow-circle-up"></i></span> <span>'+ orig_name + '</span>');
        $del = $('<span class="file-delete hand"><i class="fa fa-times"></i></span>');

    $file.append($result).append($del);
    $file.appendTo('.upload-files');
    
    $('#fm-editor').froalaEditor('selection.restore');

    if(upTYPE == 'image') {
        var tmpImg = new Image();
        $.processON('Image loading...');
        if(isReplace == true) {
          editorImageReplace('http:' + file);
        } else {
          tmpImg.src = file;
          tmpImg.onload = function() {
            $('#fm-editor').froalaEditor('image.insert', 'http:' + file, true);
            $.processOFF();
          };
        }
    } else {
      $('#fm-editor').froalaEditor('file.insert', 'http:' + file, orig_name, { 'link' : 'http:' + file, 'target': '_blank' });
      $.processOFF();
    }
}
var removeColpick = function() {
    // $('.fr-toolbar.fr-inline').removeClass('always');
    // $('button[data-cmd="text-color"]').removeClass('active').colpickHide();
}
