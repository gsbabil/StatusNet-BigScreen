// ==UserScript==
// @name           StatusNet-BigScreen
// @namespace      status.inside.nicta.com.au/gsbabil
// @description    StatusNet Auto-refresh, QR-code and Infinite-scroll
// @require        http://code.jquery.com/jquery-1.8.3.min.js
// @include        http://status.inside.nicta.com.au/*
// @exclude        http://status.inside.nicta.com.au/notice/new*
// @exclude        http://status.inside.nicta.com.au/notice/delete/*
// @exclude        http://status.inside.nicta.com.au/main/login
// @exclude        http://status.inside.nicta.com.au/settings/profile
// @author         gsbabil <gsbabil@gmail.com>
// @version        0.0.23
// @updateURL      http://nicta.info/statusnet-bigscreen-js
// @downloadURL    http://nicta.info/statusnet-bigscreen-js
// @iconURL        http://gravatar.com/avatar/10f6c9d84191bcbe69ce41177087c4d7
// ==/UserScript==


var config = {
  'jquery_url' : 'http://code.jquery.com/jquery-latest.min.js',
  'hostname' : location.host,
  'login_url' : 'http://' + location.host + '/main/login',
  'logout_url' : 'http://' + location.host + '/main/logout',
  'settings_url' : 'http://' + location.host + '/settings/profile',
  'page_title' : 'Nicta StatusNet',
  'qrcode_blacklist' : [location.host, "^mailto:", "^javascript:", "geonames\.org", ],
  'qrcode_whitelist' : [location.host + "/url", ],
  'auto_refresh_interval' : 10000,
  'custom_font' : {'name' : 'Monda, Segoe Ui Symbol', 'size' : '1.1em'},
  'qrcode_enabled' : false,
  'thumbnail_enabled' : true,
  'infinite_scroll_enabled' : true,
  'auto_refresh_enabled' : true,
  'cleaner_css_enabled' : false,
  'notice_highlight_color' : '#FCF4B0',
  'help_key' : 'h',
  'public_timeline_key' : 'u',
  'reply_key' : 'r',
  'new_status_key' : 'R',
  'login_key' : 'l',
  'logout_key' : 'L',
  'settings_key' : 's',
  'next_mesg_highlight_key' : 'j',
  'prev_mesg_highlight_key' : 'k',
  'next_page_highlight_key' : 'n',
  'prev_page_highlight_key' : 'p',
  'toggle_qrcode_key' : 'q',
  'toggle_thumbnail_key' : 't',
  'toggle_infinite_scroll_key' : 'i',
  'toggle_auto_refresh_key' : 'a',
  'toggle_cleaner_css_key' : 'c',
  'expand_conversation_key' : 'e',
  'highlighted_notice_top_margin' : 120,
  'maximum_notice_length' : 240,
  'good_popup_color' : '#ADDD44',
  'bad_popup_color' : '#FF8400',
  'default_audience' : 'public:everyone',
}


/* Babil: this is *essential* when the script doesn't run with GreaseMonkey,
 * but through the bookmarklet. GreaseMonkey's @require parameter otherwise
 * takes care of it.
 */
loadJquery();

var DEBUG = false;


var spinner = 'data:image/gif;base64,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';
var auto_refresh_timeout = null;
var keypressTimeout = null;
var scrollTimeout = null;
var previousScrollTop = 0;
var now = new Date();
var before = new Date();
var last_popup_color = "";

$(document).ready(function() {
  loadWebfont();
  autoRefresh();
  mutation();
  handleKeyboard();
  setDefaultAudience();
  showPopup("Script loaded! Press 'h' to for help.", config.good_popup_color);
});

$(window).scroll(function() {
  infiniteScroll();
  mutation();
  handleScroll();
});

function handleScroll() {
  if ( scrollTimeout === null ) {
      scrollStarted();
  } else {
      clearTimeout(scrollTimeout);
  }
  scrollTimeout = setTimeout(scrollEnded, 500);
}

function scrollStarted() {
  previousScrollTop = $(window).scrollTop();
}

function scrollEnded() {
  if ($(window).scrollTop() - previousScrollTop > 0) {
    topAsCurrentHighlighted("down");
  } else {
    topAsCurrentHighlighted("up");
  }
  applyHighlightCss();
}

function mutation() {
  removeDuplicates();
  alwaysApplyCss();
  applyCleanerCss();
  addQrcode();
  addThumbnail();
}

function autoRefresh() {
  if (config.auto_refresh_enabled == false) {
    return;
  }

  now = new Date();
  var elapsedTime = (now.getTime() - before.getTime());
  document.title = "[" + (elapsedTime / 1000).toPrecision(4) + "] - " + config.page_title;
  logDebug('autoRefresh() --> ' + elapsedTime.toPrecision(4));
  if(elapsedTime > config.auto_refresh_interval) {
    before = new Date();
    if($("head").data("autoRefresh_inprogress") != 1 || $("head").data("key_event_inprogress") != 1) {
      $("head").data("autoRefresh_inprogress", 1);
      $.ajax({
        url: document.location.href,
        cache: false,
      }).done(function(html) {
        if ($("head").data("key_event_inprogress") != 1) {
          var new_content = $("div#content_inner", $(html));
          $("div#content_inner").first().replaceWith(new_content);
          $("div#content_inner").first().data("last_refreshed", new Date().getTime());

          var new_aside = $("div#aside_primary", $(html));
          $("div#aside_primary").first().replaceWith(new_aside);
          $("div#aside_primary").first().data("last_refreshed", new Date().getTime());


          var new_token = $("input#token", $(html)).first().attr("value");
          logDebug("autoRefresh() --> old token: " + $("input#token").attr("value") + " new token: " + new_token);
          $("input#token").each(function(){
            $(this).attr("value", new_token);
          });

          $("head").data("autoRefresh_inprogress", 0);
          mutation();
        }
      });
    }
  }
  infiniteScroll();
  auto_refresh_timeout = window.setTimeout(autoRefresh, 500);
}

function infiniteScroll() {
  if (config.infinite_scroll_enabled == false) {
    return;
  }

  if($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
    logDebug("infiniteScroll() --> bottom!");
    if($("head").data("infiniteScroll_inprogress") != 1) {
      $("head").data("infiniteScroll_inprogress", 1);
      next = $("a[rel=next]").last();
      if(next.length > 0) {
        clearTimeout(auto_refresh_timeout);
        var href = next[next.length - 1].href;
        logDebug("infiniteScroll() --> " + href);
        var id = "infiniteScroll_" + href.replace(new RegExp('.*?page=(\\d+)$', 'i'), '$1');
        $(next).prepend('<img id="spinner" style="height: 16px; width: 16px; margin:auto; margin-right:5px;" src=' + spinner + '></img>');
        $("div#content").last().append("<div id='" + id + "'></div>");
        $.ajax({
          url: href,
          cache: false,
        }).done(function(html) {
          if ($("head").data("key_event_inprogress") != 1) {
            var new_core = $("div#content_inner", $(html));
            $("div#" + id).first().replaceWith(new_core);
            $("head").data("infiniteScroll_inprogress", 0);
            $("img#spinner").remove();
            mutation();
          }
        });
        auto_refresh_timeout = window.setTimeout(autoRefresh, 500);
      }
    } else {
      logDebug("infiniteScroll() --> inprogress");
    }
  }
}

function logDebug(msg, ignore) {
  if(DEBUG == true || ignore == true) {
    console.debug(msg);
  }
}

function isOnScreen(elem, completely) {
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

function alwaysApplyCss() {
  currentHighlighted();
  applyHighlightCss();
  popupCss(last_popup_color);
  showHelpCss();

  /* Babil: hide "write a reply" input boxes */
  $(".notice-reply-placeholder").hide();

  $("a[href*='inreplyto']").each(function(i, a) {
    var in_reply_to = a.href.replace(new RegExp(".*inreplyto=(\\d+)$", "i"), "$1");
    $(a).click(function(){
      if (in_reply_to >= 0) {
        $("head").data("curr_highlighted_id", in_reply_to);
        applyHighlightCss();
      }
      showReplyForm(in_reply_to);
      return false;
    });
  });

  /* Babil: fixed position for the reply box */
  $("div#input_form_status").css({
    "padding": "1em",
    "margin": "0em",
    "position": "fixed",
    "z-index": "10000",
    "background-color": "#FFF",
    "border-radius" : "8px",
  });
  $("input#notice_action-submit").css("margin-top",
  $("input#notice_action-submit").height() - $("input#notice_action-submit").height());
  $("input#notice_action-submit").css("margin-left",
    $("div#input_form_status").width() - $("input#notice_action-submit").width());
  $("div#input_form_status, input#notice_action-submit").css("box-shadow", '8px 8px 5px #888');
}

function applyCleanerCss() {
  alwaysApplyCss();

  if (config.cleaner_css_enabled == false) {
    return;
  }

  if($("head").data("key_event_inprogress") == 1) {
    return;
  }

  logDebug("applyCleanerCss() --> adding ...");

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

function addQrcode(elem) {
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
        logDebug("Blacklist: " + links[k].href);
        break;
      }
    }

    /* Babil: Force whitelist filter now */
    if(add_qr == false) {
      for(var b = 0; b < config.qrcode_whitelist.length; b++) {
        var regex = new RegExp(config.qrcode_whitelist[b]);
        if(links[k].href.search(regex) >= 0) {
          add_qr = true;
          logDebug("Whitelist: " + links[k].href);
          break;
        }
      }
    }

    /* Babil: Add the QR code now */
    if(add_qr == true && isOnScreen(links[k]) && $(links[k]).data("qrcoded") != 1) {
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
    logDebug("qrcodify_link() --> " + link.href + " qrlinks:" + qrlinks.length);
  }
}

function loadJquery() {
  (function() {
    var script = document.createElement("SCRIPT");
    script.src = config.jquery_url;
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

function showReplyForm(in_reply_to) {
  /* Babil: sanity check if user not logged in */
  if ($("div#input_form_status").length == 0) {
    showPopup("You need to be logged in to post reply. <br /> Press '" + config.login_key + "' to login.", config.bad_popup_color);
    return;
  }

  $("head").data("key_event_inprogress", 1);

  var reply_to = currentHighlighted();
  if (typeof in_reply_to != 'undefined' && in_reply_to.match(new RegExp("\\d", "i"))) {
    reply_to = in_reply_to;
  }

  /* Babil: when the user want's to post a new message */
  if (in_reply_to == "new_status") {
    reply_to = "";
  }

  $("input#notice_in-reply-to-2").val(reply_to);
  $("input#notice_in-reply-to-2").text(reply_to);

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

  $("input#notice_private").parents("span.checkbox-wrapper").remove();

  if ($("input#notice_in-reply-to-2").length == 0) {
    $("div.to-selector").append("<span  style='margin-top:3px' class='checkbox-wrapper'><label>In-Reply-To: </label><input id='notice_in-reply-to-2' type='text' value='" +  reply_to + "' size='6'></input></span>");

    $("div#input_form_status form").submit(function() {
      $("div#input_form_status input#notice_in-reply-to").val($("div#input_form_status input#notice_in-reply-to-2").val());

      $("div#input_form_status form legend").append("<img style='margin-left: 10px' id='submit_spinner' src=" + spinner + "></img>");
      $.ajax({
         data: $(this).serialize(),
         url: this.action,
         type: this.method,
         error: function() {
          showPopup("Submit failed!", config.bad_popup_color);
          $("img#submit_spinner").remove();
         },
         success: function(results) {
          showPopup("Message posted!", config.good_popup_color);
          hideReplyForm();
          $("img#submit_spinner").remove();
         }
      });
      return false;
    });

    $('body').bind('click', function(e) {
        // if($(e.target).closest('div#input_form_status').length == 0) {
        if($("div#input_form_status").has(e.target).length == 0) {
          hideReplyForm();
        }
    });
  }

  var c = currentHighlighted();
  var l = $("li[id*='" + c + "']").children(".entry-title").first();

  /* Babil: the CSS below makes puts the reply box below the currently
   * highlighted message.
   */
  if (config.cleaner_css_enabled == true) {
    $("div#input_form_status").css({
    "position" : "absolute",
    "top" : $(l).offset().top + $(l).height(),
    "left" : $(l).offset().left + $(l).width() - $("div#input_form_status").width(),
    });
  }

  $("input#notice_in-reply-to-2").attr("value", reply_to);
  $("textarea.notice_data-text").focus();
  clearTimeout(auto_refresh_timeout);
}

function hideReplyForm() {
  $("head").data("key_event_inprogress", 0)
  $("div#input_form_status").fadeOut('slow');
  auto_refresh_timeout = window.setTimeout(autoRefresh, 500);
  if (config.cleaner_css_enabled == true) {
    $("div#input_form_status").css({
      "visibility" : "invisible",
      "position" : "fixed",
    });
  }
}

function handleKeyboard() {

  /* Babil: proper keyboard input detection across browser is broken.
   * keydown() is used to capture special keys in webkit browser e.g. Chrome
   */
    if(navigator.userAgent.search("Chrome") >= 0) {
    $(document).keydown(function(key) {
      logDebug("handleKeyboard() --> '" + String.fromCharCode(key.which) + "' pressed", true);

      if(key.keyCode == 27) {
        if($("div#input_form_status").is(":visible") == true) {
          hideReplyForm();
          return false;
        }
        if($("div#help_popup").is(":visible") == true) {
          hideHelp();
        }
      }

      if(key.ctrlKey && (key.keyCode == 10 || key.keyCode == 13)) {
        logDebug("submitting reply-form ... ");
        if($("div#input_form_status").is(":visible") == true) {
          var textarea = $("textarea[name='status_textarea']");
          $(textarea).val($(textarea).val().substring(0, config.maximum_notice_length));
          $("input#notice_action-submit").click();
        }
      }
    });
  }

  $(document).keypress(function(key) {
    logDebug("handleKeyboard() --> '" + String.fromCharCode(key.which) + "' pressed", true);

    var keyCode = key.keyCode || key.which;
    var arrow = {left: 37, up: 38, right: 39, down: 40};

    if (navigator.userAgent.search("Firefox") >= 0) {
      if(key.keyCode == 27) {
        if($("div#input_form_status").is(":visible") == true) {
          hideReplyForm();
          return false;
        }
        if($("div#help_popup").is(":visible") == true) {
          hideHelp();
        }
      }

      if(key.ctrlKey && (key.keyCode == 10 || key.keyCode == 13)) {
        logDebug("submitting reply-form ... ");
        if($("div#input_form_status").is(":visible") == true) {
          var textarea = $("textarea[name='status_textarea']");
          $(textarea).val($(textarea).val().substring(0, config.maximum_notice_length));
          $("input#notice_action-submit").click();
        }
      }
    }

    if(String.fromCharCode(keyCode) == config.help_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      showHelp();
    }

    if(String.fromCharCode(key.which) == config.toggle_qrcode_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      toggleQrcode();
    }

    if(String.fromCharCode(key.which) == config.toggle_thumbnail_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      toggleThumbnail();
    }

    if(String.fromCharCode(key.which) == config.toggle_infinite_scroll_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      toggleInfiniteScroll();
    }

    if(String.fromCharCode(key.which) == config.toggle_auto_refresh_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      toggleAutoRefresh();
    }

    if(String.fromCharCode(key.which) == config.toggle_cleaner_css_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      toggleCleanerCss();
    }

    if(String.fromCharCode(key.which) == config.expand_conversation_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      expandConversation();
    }

    if(String.fromCharCode(key.which) == config.next_mesg_highlight_key || keyCode == arrow.down) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      highlightNextNotice(+1);
    }

    if(String.fromCharCode(key.which) == config.prev_mesg_highlight_key || keyCode == arrow.up) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      highlightNextNotice(-1);
    }

    if(String.fromCharCode(key.which) == config.next_page_highlight_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      $(window).scrollTop($(window).scrollTop() + $(window).height());
    }

    if(String.fromCharCode(key.which) == config.prev_page_highlight_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      $(window).scrollTop($(window).scrollTop() - $(window).height());
    }

    if(String.fromCharCode(key.which) == config.reply_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }

      if($("div#input_form_status").is(":visible") == false) {
        showReplyForm($("head").data("curr_highlighted_id"));
        return false;
      }
    }

    if(String.fromCharCode(key.which) == config.new_status_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }

      if($("div#input_form_status").is(":visible") == false) {
        showReplyForm("new_status");
        return false;
      }
    }

    if(String.fromCharCode(key.which) == config.login_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      window.open(config.login_url, '_self');
      showPopup("Opening login page ...", config.good_popup_color);
    }

    if(String.fromCharCode(key.which) == config.public_timeline_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }

      showPopup("Reloading public page ...", config.good_popup_color);
      var spinner = showSpinner($('body'), new Date().getTime());
      clearTimeout(auto_refresh_timeout);
      $.ajax({
        url: "http://" + config.hostname,
        cache: false,
        success: function(html) {
          $("div#core").fadeOut("fast");
          var new_content = $("div#core", $(html));
          logDebug("reloading public page --> new_content.length: " + new_content.html().length, true);
          $("div#core").replaceWith(new_content);
          $("div#core").data("last_refreshed", new Date().getTime());
          $("div#core").fadeIn("fast");
        },
      }).done(function(){
          auto_refresh_timeout = window.setTimeout(autoRefresh, 500);
          mutation();
          $(spinner).remove();
          showPopup("Public page reloaded!", config.good_popup_color);
        });
    }

    if(String.fromCharCode(key.which) == config.settings_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      window.open(config.settings_url, '_self');
      showPopup("Opening settings page ...", config.good_popup_color);
    }

    if(String.fromCharCode(key.which) == config.logout_key) {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }

      var spinner = showSpinner($('body'), new Date().getTime());
      $.ajax({
        url: config.logout_url,
        cache: false,
        error: function(xhr) {
          showPopup(xhr.status + ' - ' + xhr.statusText, config.bad_popup_color);
          $(spinner).remove();
        }
      }).done(function(html){
          showPopup('You are logged out.', config.good_popup_color);
          $(spinner).remove();
          mutation();
      });
    }
  });
}

function addThumbnail() {
  var image_ext = ["\.gif", "\.jpg", "\.jpeg", "\.jpe", "\.bmp", "\.png", "\.tif", "\.tiff", "\.ico"];
  $("p.entry-content > a").each(function(i, a) {
    $(image_ext).each(function(i, ext) {
      if(a.href.match(new RegExp(ext, "i"))) {
        if($("img.thumbnail", $(a).parent()).length > 0 || $(a).data("thumbnail") > 0) {
          logDebug("addThumbnail() --> already thumbnailed");
        } else {
          $(a).parent().append("<img class='thumbnail' height='92px' width='128px' style='float:right;' src='" + a.href + "' onclick=javascript:window.open('" + a.href + "') ></img>");
          $(a).data("thumbnail", 1);
        }
      }
    });
  });
}

function spinnerCss() {
  $('div[id*="spinner_"]').css({
    'position': 'absolute',
    'top': $(window).scrollTop() + 5,
    'left': 5,
    'padding': '0.1em',
    'z-index': '10000',
  });
}

function showSpinner(element, id) {
  $('<div id=spinner_' + id + '><img src=' + spinner + '></img></div>').prependTo($(element));

  spinnerCss();
  return $('div#spinner_' + id);
}

function loadWebfont() {
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

function highlightNextNotice(offset) {
  removeDuplicates();
  var notices = $("li[id*='notice-']");
  var max_len = notices.length - 1;
  var curr_highlighted_id = currentHighlighted();

  logDebug("highlightNextNotice() --> curr_highlighted_id:" + curr_highlighted_id + " offset: " + offset);

  /* Babil: now given the curr_highlighted_id, find the next_notice_id */
  var i = notices.index($("li[id*=" + curr_highlighted_id + "]"));
  var k = i + offset;

  if (k >=0 && k <= max_len) {
    var next_highlighted_id = $(notices[k]).attr("id").replace(new RegExp(".*notice-(\\d+)$", "i"), "$1");
  }

  if (k < 0 ) {
    k = 0;
    next_highlighted_id = curr_highlighted_id;
  }
  if (k > max_len) {
    k = max_len;
    next_highlighted_id = curr_highlighted_id;
  }

  logDebug("highlightNextNotice() --> i: " + i +  " k: " + k +" length:" + notices.length);

  /* Babil: if next_highlighted_id is outside viewport, scroll to it */
  if (isOnScreen($(notices[k]), true) == false) {
    $('html, body').animate({
      scrollTop: $(notices[k]).offset().top - config.highlighted_notice_top_margin,
    }, 'fast');
  }

  /* Babil: save id and apply highlighting  */
  $("head").data("curr_highlighted_id", next_highlighted_id);
  applyHighlightCss();
  logDebug("highlightNextNotice() --> next_highlighted_id:" + next_highlighted_id);

}

function currentHighlighted() {
  removeDuplicates();
  var notices = $("li[id*='notice-']");
  var curr_highlighted_id;

  if (typeof $("head").data("curr_highlighted_id") == 'undefined') {
    notices.each(function(i, li) {
      if (isOnScreen(li) == true) {
        curr_highlighted_id = $(li).attr("id").replace(new RegExp(".*notice-(\\d+)$", "i"), "$1");
        $("head").data("curr_highlighted_id", curr_highlighted_id);
        return false;
      }
    });
  } else {
    curr_highlighted_id = $("head").data("curr_highlighted_id");
  }

  return curr_highlighted_id;
}

/* Babil: this function should only be called from the handleKeyboard().
 * currentHighlighted() should be called first to make sure tjat
 * current_highlighted_id is not unset.
 */
function topAsCurrentHighlighted(direction) {
  var curr_highlighted_id = currentHighlighted();
  var m = $("li[id*=" + curr_highlighted_id + "]");

  removeDuplicates();
  var notices = $("li[id*='notice-']");

  logDebug("topAsCurrentHighlighted() --> curr_highlighted_id: " + curr_highlighted_id + " isOnScreen: " + isOnScreen(m.children(".entry-title").first()));

  if(isOnScreen(m.children(".entry-title").last()) == false) {
    for (var i=0; i<notices.length; i++) {
      if (isOnScreen($(notices[i])) == true) {
        curr_highlighted_id = $(notices[i]).attr("id").replace(new RegExp(".*notice-(\\d+)$", "i"), "$1");
        $("head").data("curr_highlighted_id", curr_highlighted_id);

        logDebug("topAsCurrentHighlighted() --> new top curr_highlighted_id: " + curr_highlighted_id);

        /* Babil: if next_highlighted_id is outside viewport, scroll to it */
        $('html, body').animate({
          scrollTop: $(notices[i]).offset().top - config.highlighted_notice_top_margin,
        }, 'fast');

        return;
      }
    }
  }
}

function applyHighlightCss() {
  var notice = $("li[id*=" + $("head").data("curr_highlighted_id") + "]");
  logDebug("applyHighlightCss() --> notice");

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
    "border-width" : "1px",
    "border-style" : "solid"
  });
}

function toggleQrcode() {
  if (config.qrcode_enabled == true) {
    config.qrcode_enabled = false;
    $(".qrcode").fadeOut('slow');
    showPopup("QR-code disabled.", config.bad_popup_color);
  } else {
    config.qrcode_enabled = true;
    mutation();
    $(".qrcode").fadeIn('slow');
    showPopup("QR-code enabled.", config.good_popup_color);
  }
}

function toggleInfiniteScroll() {
  if (config.infinite_scroll_enabled == true) {
    config.infinite_scroll_enabled = false;
    showPopup("Infinite-scroll disabled.", config.bad_popup_color);
  } else {
    config.infinite_scroll_enabled = true;
    mutation();
    showPopup("Infinite-scroll enabled.", config.good_popup_color);
  }
}

function toggleAutoRefresh() {
  if (config.auto_refresh_enabled == true) {
    config.auto_refresh_enabled = false;
    showPopup("Auto-refresh disabled.", config.bad_popup_color);
  } else {
    config.auto_refresh_enabled = true;
    autoRefresh();
    mutation();
    showPopup("Auto-refresh enabled.", config.good_popup_color);
  }
}

function toggleCleanerCss() {
  var show_reply = false;
  if($("div#input_form_status").is(":visible") == true) {
    show_reply = true;
  }

  if (config.cleaner_css_enabled == true) {
    config.cleaner_css_enabled = false;
    $("*").removeAttr( 'style' );
    showPopup("Cleaner CSS disabled.", config.bad_popup_color);
    alwaysApplyCss();
  } else {
    config.cleaner_css_enabled = true;
    showPopup("Cleaner CSS enabled.", config.good_popup_color);
    alwaysApplyCss();
    applyCleanerCss();
  }
}

function toggleThumbnail() {
  if (config.thumbnail_enabled == true) {
    config.thumbnail_enabled = false;
    $("img.thumbnail").fadeOut('slow');
    $(".attachment-thumbnail").fadeOut('slow');
    showPopup("Thumbnail disabled.", config.bad_popup_color);
  } else {
    config.thumbnail_enabled = true;
    mutation();
    $("img.thumbnail").fadeIn('slow');
    $(".attachment-thumbnail").fadeIn('slow');
    showPopup("Thumbnail enabled.", config.good_popup_color);
  }
}

function removeDuplicates() {
  var notices = $("li[id*='notice-']");
  var uniq = {};
  notices.each(function(i, n) {
    var id = $(n).attr("id").replace(new RegExp(".*notice-(\\d+)$", "i"), "$1");
    if (uniq[id])
        $(n).remove();
    else
        uniq[id] = true;
  });
}

function expandConversation() {
  curr_highlighted_id = currentHighlighted();
  curr_highlighted_li = $("li[id*='" + curr_highlighted_id + "']");


  var parent = curr_highlighted_li.parents("li[id*='notice-']");
  if (parent.length == 0) {
      parent = curr_highlighted_li;
  }

  var a = $("a[href*='conversation']", parent);
  if (a.length > 0) {
    window.open(a[0].href, '_blank');
    logDebug("expandConversation() --> " + a[0].href);
  } else {
    showPopup("Conversation already expanded.", config.bad_popup_color);
  }
}

function popupCss(color) {
  last_popup_color = color;

  $('div.popup').css({
    'position': 'absolute',
    'top': $(window).scrollTop() + 5,
    'left': 5,
    'background-color': last_popup_color,
    'padding': '0.1em',
    'min-width': '10em',
    'border-color': '#000',
    'border-style': 'solid',
    'border-width': '1.5px',
    'text-align': 'center',
    'z-index': '10000',
  });
}

function showPopup(text, color){
  var id = "popup_" + new Date().getTime();
  $('<div class="popup" id=' + id + '>' + text + '</div>').prependTo('body');
  popupCss(color);

  window.setTimeout(function() {
    $("div#" + id).fadeOut('slow');
    $("div#" + id).remove();
  }, 3000);
}

function showHelpCss() {
  $("div#help_popup").css({
    "position" : "fixed",
    'top': 5,
    'left': 5,
    'text-align' : 'center',
    'z-index' : '9999',
    'font-weight' : 'bold',
  });

  $("#help_table td").css({
    "border" : "1px solid #000",
    "background-color" : "#cd5c5c",
    "text-align" : "left",
    'font-weight' : 'normal',
    'padding-left' : '1em',
    'padding-right' : '1em',
  });

  $("#help_table td[id*='key']").css({
    "text-align" : "center",
    "min-width" : "5em",
  });

  $("#help_table").css({
    'box-shadow' : '8px 8px 5px #888',
  });
}

function showHelp() {
  if ($("div#help_popup").length > 0) {
    return;
  }

  $("<div id='help_popup'></div>").prependTo("body");

  var table_html = '<table id="help_table">' +
  '<tr><td>Help</td><td id="help_key"></td></tr>' +
  '<tr><td>Public Timeline</td><td id="public_timeline_key"></td></tr>' +
  '<tr><td>New Status</td><td id="new_status_key"></td></tr>' +
  '<tr><td>Reply</td><td id="reply_key"></td></tr>' +
  '<tr><td>Login</td><td id="login_key"></td></tr>' +
  '<tr><td>Logout</td><td id="logout_key"></td></tr>' +
  '<tr><td>Settings Page</td><td id="settings_key"></td></tr>' +
  '<tr><td>Next Message</td><td id="next_mesg_highlight_key"></td></tr>' +
  '<tr><td>Previous Message</td><td id="prev_mesg_highlight_key"></td></tr>' +
  '<tr><td>Next Page</td><td id="next_page_highlight_key"></td></tr>' +
  '<tr><td>Previous page</td><td id="prev_page_highlight_key"></td></tr>' +
  '<tr><td>Expand Conversation</td><td id="expand_conversation_key"></td></tr>' +
  '<tr><td>Toggle QR-code</td><td id="toggle_qrcode_key"></td></tr>' +
  '<tr><td>Toggle Thumbnail</td><td id="toggle_thumbnail_key"></td></tr>' +
  '<tr><td>Toggle Infinite-scroll</td><td id="toggle_infinite_scroll_key"></td></tr>' +
  '<tr><td>Toggle Auto-refresh</td><td id="toggle_auto_refresh_key"></td></tr>' +
  '<tr><td>Toggle Cleaner CSS</td><td id="toggle_cleaner_css_key"></td></tr>' +
  '</table>';

  $(table_html).appendTo("div#help_popup");

  $("td#help_key").text(config.help_key);
  $("td#public_timeline_key").text(config.public_timeline_key);
  $("td#new_status_key").text(config.new_status_key);
  $("td#reply_key").text(config.reply_key);
  $("td#login_key").text(config.login_key);
  $("td#logout_key").text(config.logout_key);
  $("td#settings_key").text(config.settings_key);
  $("td#next_mesg_highlight_key").text(config.next_mesg_highlight_key);
  $("td#prev_mesg_highlight_key").text(config.prev_mesg_highlight_key);
  $("td#next_page_highlight_key").text(config.next_page_highlight_key);
  $("td#prev_page_highlight_key").text(config.prev_page_highlight_key);
  $("td#expand_conversation_key").text(config.expand_conversation_key);
  $("td#toggle_qrcode_key").text(config.toggle_qrcode_key);
  $("td#toggle_thumbnail_key").text(config.toggle_thumbnail_key);
  $("td#toggle_infinite_scroll_key").text(config.toggle_infinite_scroll_key);
  $("td#toggle_auto_refresh_key").text(config.toggle_auto_refresh_key);
  $("td#toggle_cleaner_css_key").text(config.toggle_cleaner_css_key);

  showHelpCss();
  $('body').bind('click', function(e) {
    // if($(e.target).closest('div#input_form_status').length == 0) {
    if($("div#help_popup").has(e.target).length == 0) {
      hideHelp();
    }
  });
}

function hideHelp() {
  $("div#help_popup").fadeOut('slow');
  $("div#help_popup").remove();
}

function setDefaultAudience() {
  $("select#notice_to").val(config.default_audience);
}

