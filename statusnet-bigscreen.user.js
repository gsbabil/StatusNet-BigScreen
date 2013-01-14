// ==UserScript==
// @name           StatusNet-BigScreen
// @namespace      status.inside.nicta.com.au/gsbabil
// @description    StatusNet Auto-refresh, QR-code and Infinite-scroll
// @require        http://code.jquery.com/jquery-latest.min.js
// @include        http://status.inside.nicta.com.au/*
// @exclude        http://status.inside.nicta.com.au/notice/new*
// @exclude        http://status.inside.nicta.com.au/notice/delete/*
// @exclude        http://status.inside.nicta.com.au/main/login
// @exclude        http://status.inside.nicta.com.au/settings/profile
// @author         gsbabil <gsbabil@gmail.com>
// @version        0.0.14
// @updateURL      http://nicta.info/statusnet-bigscreen-js
// @iconURL        http://gravatar.com/avatar/10f6c9d84191bcbe69ce41177087c4d7
// ==/UserScript==


var config = {
  'hostname' : location.host,
  'login_url' : 'http://' + location.host + '/main/login',
  'logout_url' : 'http://' + location.host + '/main/logout',
  'page_title' : 'Nicta StatusNet',
  'qrcode_blacklist' : [location.host, "^mailto:", "^javascript:", "geonames\.org", ],
  'qrcode_whitelist' : [location.host + "/url", ],
  'auto_refresh_interval' : 9999,
  'custom_font' : {'name' : 'Monda, Segoe Ui Symbol', 'size' : '17px'},
  'qrcode_enabled' : false,
  'custom_css_enabled' : true,
  'notice_highlight_color' : '#FCF4B0',
  'reply_key' : 'r',
  'login_key' : 'l',
  'logout_key' : 'L',
  'settings_key' : 's',
  'next_highlight_key' : 'j',
  'prev_highlight_key' : 'k',
  'toggle_qrcode_key' : 'q',
  'highlighted_notice_top_margin' : 100,
  'maximum_notice_length' : 240,
}


/* Babil: this is *essential* when the script doesn't run with GreaseMonkey,
 * but through the bookmarklet. GreaseMonkey's @require parameter otherwise
 * takes care of it.
 */
load_jquery();

var DEBUG = false;
var spinner = "data:image/gif;base64,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";



var refreshTimeout;
var keypressTimeout;
var now = new Date();
var before = new Date();
var time_last_key_pressed = new Date();


$(document).ready(function() {
  load_webfont();
  refresh_page();
  mutation();
  handle_keypress();
});

$(window).scroll(function() {
  infinite_scroll();
  mutation();
});

function mutation() {
  add_custom_css();
  add_qrcode();
  add_thumbnail();
}

function refresh_page() {
  now = new Date();
  var elapsedTime = (now.getTime() - before.getTime());
  document.title = "[" + (elapsedTime / 1000).toPrecision(4) + "] - " + config.page_title;
  debug_log('refresh_page() --> ' + elapsedTime.toPrecision(4));
  if(elapsedTime > config.auto_refresh_interval) {
    before = new Date();
    if($("head").data("refresh_page_inprogress") != 1
        || $("head").data("key_event_inprogress") != 1) {
      $("head").data("refresh_page_inprogress", 1);
      $.ajax({
        url: document.location.href,
        ifModified: true,
        cache: false,
      }).done(function(html) {
        if ($("head").data("key_event_inprogress") != 1) {
          var new_content = $("div#content_inner", $(html));
          $("div#content_inner").first().replaceWith(new_content);
          $("div#content_inner").data("last_refreshed", new Date().getTime());

          var new_token = $("input#token", $(html)).first().attr("value");
          debug_log("refresh_page() --> old token: " + $("input#token").attr("value") + " new token: " + new_token, true);
          $("input#token").each(function(){
            $(this).attr("value", new_token);
          });

          $("head").data("refresh_page_inprogress", 0);
          mutation();
        }
      });
    }
  }
  infinite_scroll();
  refreshTimeout = window.setTimeout(refresh_page, 500);
}

function infinite_scroll() {
  if($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
    debug_log("infinite_scroll() --> bottom!");
    if($("head").data("infinite_scroll_inprogress") != 1) {
      $("head").data("infinite_scroll_inprogress", 1);
      next = $("a[rel=next]").last();
      if(next.length > 0) {
        clearTimeout(refreshTimeout);
        var href = next[next.length - 1].href;
        debug_log("infinite_scroll() --> " + href);
        var id = "infinite_scroll_" + href.replace(new RegExp('.*?page=(\\d+)$', 'i'), '$1');
        $(next).prepend('<img id="spinner" style="height: 16px; width: 16px; margin:auto; margin-right:5px;" src=' + spinner + '></img>');
        $("div#content").last().append("<div id='" + id + "'></div>");
        $.ajax({
          url: href,
          ifModified: true,
          cache: false,
        }).done(function(html) {
          if ($("head").data("key_event_inprogress") != 1) {
            var new_core = $("div#content_inner", $(html));
            $("div#" + id).first().replaceWith(new_core);
            $("head").data("infinite_scroll_inprogress", 0);
            $("img#spinner").remove();
            mutation();
          }
        });
        refreshTimeout = window.setTimeout(refresh_page, 1000);
      }
    } else {
      debug_log("infinite_scroll() --> inprogress");
    }
  }
}

function debug_log(msg, ignore) {
  if(DEBUG == true || ignore == true) {
    console.debug(msg);
  }
}

function is_on_screen(elem, completely) {
  var $window = $(window);
  var viewport_top = $window.scrollTop();
  var viewport_height = $window.height();
  var viewport_bottom = viewport_top + viewport_height;
  var $elem = $(elem);
  var top = $elem.offset().top;
  var height = $elem.height();
  var bottom = top + height;

  if(completely == true) {
    return(top >= viewport_top && top < viewport_bottom) && (bottom > viewport_top && bottom <= viewport_bottom) && (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom);
  } else {
    return(top >= viewport_top && top < viewport_bottom) || (bottom > viewport_top && bottom <= viewport_bottom) || (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom);
  }
}

function add_custom_css() {
  if (config.custom_css_enabled == false) {
    return;
  }

  if($("head").data("key_event_inprogress") == 1) {
    return;
  }

  debug_log("add_custom_css() --> adding ...");

  add_highlight_css();

  $("a[href*='inreplyto']").each(function(i, a) {
    var in_reply_to = a.href.replace(new RegExp(".*inreplyto=(\\d+)$", "i"), "$1");
    $(a).click(function(){show_reply_form(in_reply_to); return false;});
  });

  $("div#input_form_status").css({
    "padding": "1em",
    "margin": "0em",
    "position": "fixed",
    "z-index": "10000",
    "background-color": "#FFF",
  });

  $("input#notice_action-submit").css("margin-top",
    $("input#notice_action-submit").height() - $("input#notice_action-submit").height());
  $("input#notice_action-submit").css("margin-left",
    $("div#input_form_status").width() - $("input#notice_action-submit").width());

  $("div#site_nav_local_views").hide();
  $("div#header").hide();
  $("div#footer").hide();
  $("div#tagcloud").hide();
  $("div#featured_users").hide();
  $("div#export_data").hide();
  $(".input_form_nav_tab").hide();

  /* Babil: remove all input fields by default */
  $("input").hide();

  /* Babil: selectively choose the input fields to display */
  $("[name*='favor-submit']").show();
  $("input[title*='this user']").show();
  $("input[title*='Flag profile']").show();

  /* Babil: right align QR-codes */
  $("img.qrcode").css("float", "right");

  $(".input_form").css("float", "none");

  if(config.custom_font.name.length > 0) {
    $("body").css("font-family", config.custom_font.name);
    $(".notice_data-text").css("font-family", config.custom_font.name);
    $(".notices").each(function(i, item) {
      $(item).css("font-size", config.custom_font.size);
    });
  }

  /* Olivier: Embigen everything */
  $("div#wrap").css({
    "width": "99%"
  });
  $("div#core").css({
    "width": "100%"
  });
  $("div#aside_primary_wrapper").css({
    "width": "100%"
  });
  $("div#site_nav_local_views_wrapper").css({
    "width": "100%",
    "left": 0
  });
  $("div#content_wrapper").css({
    "width": "100%",
    "left": 0
  });
  $("div#content").css({
    "width": "70%",
    "left": 0
  });
  // Olivier: XXX 83% is to align QRCodes on my screen...
  $(".threaded-replies").css({
    "width": "83%"
  });
  $(".notice").css({
    "width": "100%"
  });
  $("div#aside_primary").css({
    "left": "auto",
    "right": 0,
    "float": "right",
    "width": "23%",
    "max-width": "25%"
  });

}

function add_qrcode(elem) {
  if (config.qrcode_enabled == false) {
    return;
  }

  links = $("a");
  for(var k = 0; k < links.length; k++) {
    var add_qr = true;

    /* Babil: Apply blacklist filter */
    for(var b = 0; b < config.qrcode_blacklist.length; b++) {
      var regex = new RegExp(config.qrcode_blacklist[b]);
      if(links[k].href.search(regex) >= 0) {
        add_qr = false;
        debug_log("Blacklist: " + links[k].href);
        break;
      }
    }

    /* Babil: Force whitelist filter now */
    if(add_qr == false) {
      for(var b = 0; b < config.qrcode_whitelist.length; b++) {
        var regex = new RegExp(config.qrcode_whitelist[b]);
        if(links[k].href.search(regex) >= 0) {
          add_qr = true;
          debug_log("Whitelist: " + links[k].href);
          break;
        }
      }
    }

    /* Babil: Add the QR code now */
    if(add_qr == true && is_on_screen(links[k]) && $(links[k]).data("qrcoded") != 1) {
      qrcodify_link(links[k]);
    }
  }
}

function qrcodify_link(link) {
  if(link.href.length < 50) {
    size = "100x100";
  } else if(link.href.length < 120) {
    size = "120x120";
  } else {
    size = "150x150";
  }

  var daddy = $(link).parents("div.entry-title");
  var qrdiv = daddy.children("div.qrcode");
  var qrlinks = $(link).parent().children("a");

  if(qrdiv.length < qrlinks.length && $(link).data("qrcoded") != 1) {
    $(link).data("qrcoded", 1);
    $(daddy).append('<div class="qrcode" style="float: right; max-width: 175px"></div>');
    var css = "float: right; box-shadow: 3px 3px 4px grey; border-radius: 5px !important; margin: 5px";
    $(daddy).append('<img class="qrcode" align="center" style="' + css + '" src="http://chart.apis.google.com/chart?cht=qr&chs=' + size + '&choe=UTF-8&chl=' + link.href + '" onclick=javascript:window.open("' + link.href + '")>');
    debug_log("qrcodify_link() --> " + link.href + " qrlinks:" + qrlinks.length);
  }
}

function load_jquery() {
  (function() {
    var script = document.createElement("SCRIPT");
    script.src = 'http://code.jquery.com/jquery-latest.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);

    var checkReady = function(callback) {
        if(window.jQuery) {
          callback(jQuery);
        } else {
          window.setTimeout(function() {
            checkReady(callback);
          }, 100);
        }
      };
    checkReady(function($) {});
  })();
}

function show_reply_form(in_reply_to) {
  /* Babil: sanity check if user not logged in */
  if ($("div#input_form_status").length == 0) {
    show_popup("Form not found. Are your logged in? <br /> Press '" + config.login_key + "' to login.", "#FFFF00");
    return;
  }

  $("head").data("key_event_inprogress", 1);

  var reply_to = "";
  if (typeof in_reply_to != 'undefined' && in_reply_to.match(new RegExp("\\d", "i"))) {
    reply_to = in_reply_to;
  }

  $("div#input_form_status").fadeIn(100);
  $("div#input_form_status *").show();

  $("span.count").text("");
  $("textarea[name='status_textarea']").keypress(function() {
    var count = $(this).val().length;
    $("span.count").text(count + "/" + config.maximum_notice_length);
    if (count >= config.maximum_notice_length) {
      $("span.count").css("color", "red");
      $(this).val($(this).val().substring(0, config.maximum_notice_length - 1));
    } else {
      $("span.count").css("color", "");
    }
  });

  $("select#notice_to").attr("value", "public:site");
  $("input#notice_private").parents("span.checkbox-wrapper").remove();

  if ($("input#notice_in-reply-to-2").length == 0) {
    $("div.to-selector").append("<span  style='margin-top:3px' class='checkbox-wrapper'><label>In-Reply-To: </label><input id='notice_in-reply-to-2' type='text' value='" +  reply_to + "' size='6'></input></span>");

    $("div#input_form_status form").submit(function() {
      $("div#input_form_status input#notice_in-reply-to").attr("value",
          $("div#input_form_status input#notice_in-reply-to-2").attr("value"));

      $("div#input_form_status form legend").append("<img style='margin-left: 10px' id='submit_spinner' src=" + spinner + "></img>");
      $.ajax({
         data: $(this).serialize(),
         url: this.action,
         type: this.method,
         error: function() {
          show_popup("Submit failed!", "#FFFF00");
          $("img#submit_spinner").remove();
         },
         success: function(results) {
          show_popup("Message posted!", "#ADDD44");
          hide_reply_form();
          $("img#submit_spinner").remove();
         }
      });
      return false;
    });
  }

  $("input#notice_in-reply-to-2").attr("value", reply_to);
  $("textarea.notice_data-text").focus();
  clearTimeout(refreshTimeout);
}

function hide_reply_form() {
  $("head").data("key_event_inprogress", 0)
  $("div#input_form_status").fadeOut('slow');
  $("div#input_form_status *").hide();
  refreshTimeout = window.setTimeout(refresh_page, 1000);
}

function handle_keypress() {
  $(document).keypress(function(key) {

    debug_log("handle_keypress() --> '" + String.fromCharCode(key.which) + "' pressed", true);

    if(String.fromCharCode(key.which) == config.toggle_qrcode_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      toggle_qrcode();
    }

    if(String.fromCharCode(key.which) == config.next_highlight_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      highlight_notice(+1);
    }

    if(String.fromCharCode(key.which) == config.prev_highlight_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      time_last_key_pressed = new Date().getTime();
      highlight_notice(-1);
    }

    if(String.fromCharCode(key.which) == config.reply_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }

      if($("div#input_form_status").is(":visible") == false) {
        show_reply_form($("head").data("curr_highlighted_id"));
      }
    }

    if(key.keyCode == 27) {
      if($("div#input_form_status").is(":visible") == true) {
        hide_reply_form();
      }
    }

    if(String.fromCharCode(key.which) == config.login_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      window.open(config.login_url, '_self');
    }

    if(String.fromCharCode(key.which) == config.logout_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }

      var spinner = show_spinner($('body'), new Date().getTime());
      $.ajax({
        url: config.logout_url,
        ifModified: true,
        cache: false,
        error: function(xhr) {
          show_popup(xhr.status + ' - ' + xhr.statusText, '#FFFF00');
          $(spinner).remove();
        }
      }).done(function(html){
          show_popup('You are logged out', '#ADDD44');
          $(spinner).remove();
          mutation();
      });
    }

    if(key.ctrlKey && (key.keyCode == 10 || key.keyCode == 13)) {
      debug_log("submitting ... ", true);
      if($("div#input_form_status").is(":visible") == true) {
        var textarea = $("textarea[name='status_textarea']");
        $(textarea).val($(textarea).val().substring(0, config.maximum_notice_length));
        $("input#notice_action-submit").click();
      }
    }

  });
}

function add_thumbnail() {
  var image_ext = ["\.gif", "\.jpg", "\.jpeg", "\.jpe", "\.bmp", "\.png", "\.tif", "\.tiff", "\.ico"];
  $("p.entry-content > a").each(function(i, a) {
    $(image_ext).each(function(i, ext) {
      if(a.href.match(new RegExp(ext, "i"))) {
        if($("img.thumbnail", $(a).parent()).length > 0 || $(a).data("thumbnail") > 0) {
          debug_log("add_thumbnail() --> already thumbnailed");
        } else {
          $(a).parent().append("<img class='thumbnail' height='92px' width='128px' style='float:right;' src='" + a.href + "' onclick=javascript:window.open('" + a.href + "') ></img>");
          $(a).data("thumbnail", 1);
        }
      }
    });
  });
}

function show_spinner(element, id) {
  $('<div id=spinner_' + id + '><img src=' + spinner + '></img></div>').prependTo($(element));
  $('div.popup').css({
    'position': 'absolute',
    'top': $(window).scrollTop() + 5,
    'left': 5,
    'padding': '0.1em',
  });

  return $('div#spinner_' + id);
}

function show_popup(text, color){
  var id = "popup_" + new Date().getTime();
  var popup_color = '#FCFFD1';

  if (typeof color != 'undefined') {
    popup_color = color;
  }

  $('<div class="popup" id=' + id + '>' + text + '</div>').prependTo('body');
  $('div.popup').css({
    'position': 'absolute',
    'top': $(window).scrollTop() + 5,
    'left': 5,
    'background-color': popup_color,
    'padding': '0.1em',
    'min-width': '10em',
    'border-color': '#000',
    'border-style': 'solid',
    'border-width': '1.5px',
    'text-align': 'center',
    'z-index': '10000',
  });

  window.setTimeout(function(){
    $("div#" + id).fadeOut('slow');
    $("div#" + id).remove();
  }, 3000);

}

function load_webfont() {
 $("<link href='http://fonts.googleapis.com/css?family=Monda&subset=latin,latin-ext' rel='stylesheet' type='text/css'>").appendTo("head");

 WebFontConfig = {
   google: { families: [ 'Monda:400,700:latin,latin-ext' ] }
 };
 (function() {
   var wf = document.createElement('script');
   wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
     '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
   wf.type = 'text/javascript';
   wf.async = 'true';
   var s = document.getElementsByTagName('script')[0];
   s.parentNode.insertBefore(wf, s);
 })();
}

function highlight_notice(direction) {
  var notices = $("li[id*='notice-']");
  var curr_highlighted_id = select_first_highlight();

  debug_log("highlight_notice() --> curr_highlighted_id:" + curr_highlighted_id, true);

  /* Babil: now given the curr_highlighted_id, find the next_notice_id */
  var i = notices.index($("li[id*=" + curr_highlighted_id + "]"));

  /* Babil: to avoid loop, check if next_highlighted_id is different from curr_highlighted_id */
  var next_highlighted_id = "";
  for (var k=i+direction; k < notices.length && k >= 0; k=k+direction) {
    var next_highlighted_id = $(notices[k]).attr("id").replace(new RegExp(".*notice-(\\d+)$", "i"), "$1");
    if (next_highlighted_id != curr_highlighted_id) {
      break;
    }
  }

  if (k < 0 ) {k = 0; next_highlighted_id = curr_highlighted_id;}
  if (k > notices.length - 1) {k = notices.length - 1; next_highlighted_id = curr_highlighted_id;}

  debug_log("highlight_notice() --> i: " + i +  " k: " + k +" length:" + notices.length, true);

  if (i >= 0) {
    $("head").data("curr_highlighted_id", next_highlighted_id);
    add_highlight_css();
    debug_log("highlight_notice() --> next_highlighted_id:" + next_highlighted_id, true);

    /* Babil: if next_highlighted_id is outside viewport, scroll to it */
    if (is_on_screen($(notices[k]), true) == false) {
      $('html, body').animate({
        scrollTop: $(notices[k]).offset().top - config.highlighted_notice_top_margin,
      }, 10);
    }
  }
}

function select_first_highlight() {
  if (typeof $("head").data("curr_highlighted_id") == 'undefined') {
    var notices = $("li[id*='notice-']");
    var uniq = {};
    notices.each(function(i, n) {
      var id = $(n).attr("id").replace(new RegExp(".*notice-(\\d+)$", "i"), "$1");
      if (uniq[id])
          $(n).remove();
      else
          uniq[id] = true;
    });

    notices.each(function(i, li) {
      if (is_on_screen(li) == true) {
        curr_highlighted_id = $(li).attr("id").replace(new RegExp(".*notice-(\\d+)$", "i"), "$1");
        $("head").data("curr_highlighted_id", curr_highlighted_id);
        return false;
      }
    });

    return curr_highlighted_id;
  } else {
    return $("head").data("curr_highlighted_id");
  }
}

function add_highlight_css() {
  select_first_highlight();

  var notice = $("li[id*=" + $("head").data("curr_highlighted_id") + "]");
  debug_log("add_highlight_css() --> notice");

  /* Babil: remove previous highlights */
  $("li[id*='notice-']").each(function(i, li){
    $(li).children(".entry-title").css({
      "background-color": "",
      "padding" : "",
      "border-color" : "",
      "border-width" : "",
      "border-style" : ""
    });
  });

  /* Babil: now apply highlights */
  $(notice).children(".entry-title").first().css({
    "background-color": config.notice_highlight_color,
    "padding" : "1.5em",
    "border-color" : "black",
    "border-width" : "1.5px",
    "border-style" : "solid"
  });
}

function toggle_qrcode() {
  if (config.qrcode_enabled == true) {
    config.qrcode_enabled = false;
    $(".qrcode").fadeOut('slow');
    show_popup("QR-code disabled.", "#FFFF00");
  } else {
    config.qrcode_enabled = true;
    $(".qrcode").fadeIn('slow');
    show_popup("QR-code enabled.", "#ADDD44");
  }
}
