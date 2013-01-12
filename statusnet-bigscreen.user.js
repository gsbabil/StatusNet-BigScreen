// ==UserScript==
// @name           StatusNet-BigScreen
// @namespace      status.inside.nicta.com.au/gsbabil
// @description    StatusNet Auto-refresh, QR-code and Infinite-scroll
// @require        http://code.jquery.com/jquery-latest.min.js
// @include        http://status.inside.nicta.com.au/*
// @exclude        http://status.inside.nicta.com.au/notice/new*
// @exclude        http://status.inside.nicta.com.au/notice/delete/*
// @exclude        http://status.inside.nicta.com.au/main/login
// @author         gsbabil <gsbabil@gmail.com>
// @version        0.0.13
// @updateURL      http://nicta.info/statusnet-bigscreen-js
// @iconURL        http://gravatar.com/avatar/10f6c9d84191bcbe69ce41177087c4d7
// ==/UserScript==


/* Babil: this is *essential* when the script doesn't run with GreaseMonkey,
 * but through the bookmarklet. GreaseMonkey's @require parameter otherwise
 * takes care of it.
 */
loadjQuery();

var DEBUG = false;
var spinner = "data:image/gif;base64,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";

var hostname = "status.inside.nicta.com.au";
var login_url = "http://" + hostname + "/main/login";
var logout_url = "http://" + hostname + "/main/logout";
var title = "Nicta StatusNet";
var blacklist = [hostname, "^mailto:", "^javascript:", "geonames\.org", ];
var whitelist = [hostname + "/url", ];
var refreshInterval = 9999;
var refreshTimeout;
var now = new Date();
var before = new Date();
var monospace_font = false;

$(document).ready(function() {
  handleKeypress();
  mutation();
  refreshContent();
});

$(window).scroll(function() {
  infiniteScroll();
  mutation();
});

function mutation() {
  addCustomCss();
  addQRcode();
  addThumbnail();
}

function refreshContent() {
  now = new Date();
  var elapsedTime = (now.getTime() - before.getTime());
  document.title = "[" + (elapsedTime / 1000).toPrecision(4) + "] - " + title;
  debugLog('refreshContent() --> ' + elapsedTime.toPrecision(4));
  if(elapsedTime > refreshInterval) {
    before = new Date();
    if($("head").data("refreshContent_inprogress") != 1 || $("head").data("keyEvent_inprogress") != 1) {
      $("head").data("refreshContent_inprogress", 1);
      $.ajax({
        url: document.location.href,
        ifModified: true,
        cache: false,
      }).done(function(html) {
        if ($("head").data("keyEvent_inprogress") != 1) {
          var new_core = $("div#core", $(html));
          $("div#core").first().replaceWith(new_core);
          $("div#core").data("last_refreshed", new Date().getTime());
          $("head").data("refreshContent_inprogress", 0);
          debugLog("refreshContent() --> current token: " + $("input#token").attr("value"), true);
          mutation();
        }
      });
    }
  }
  infiniteScroll();
  refreshTimeout = window.setTimeout(refreshContent, 500);
}

function infiniteScroll() {
  if($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
    debugLog("infiniteScroll() --> bottom!");
    if($("head").data("infiniteScroll_inprogress") != 1) {
      $("head").data("infiniteScroll_inprogress", 1);
      next = $("a[rel=next]").last();
      if(next.length > 0) {
        clearTimeout(refreshTimeout);
        var href = next[next.length - 1].href;
        debugLog("infiniteScroll() --> " + href);
        var id = "infiniteScroll_" + href.replace(new RegExp('.*?page=(\\d+)$', 'i'), '$1');
        $(next).prepend('<img id="spinner" style="height: 16px; width: 16px; margin:auto; margin-right:5px;" src=' + spinner + '></img>');
        $("div#content").last().append("<div id='" + id + "'></div>");
        $.ajax({
          url: href,
          ifModified: true,
          cache: false,
        }).done(function(html) {
          if ($("head").data("keyEvent_inprogress") != 1) {
            var new_core = $("div#content_inner", $(html));
            $("div#" + id).first().replaceWith(new_core);
            $("head").data("infiniteScroll_inprogress", 0);
            $("img#spinner").remove();
            mutation();
          }
        });
        refreshTimeout = window.setTimeout(refreshContent, 1000);
      }
    } else {
      debugLog("infiniteScroll() --> inprogress");
    }
  }
}

function debugLog(msg, ignore) {
  if(DEBUG == true || ignore == true) {
    console.debug(msg);
  }
}

function isOnScreen(elem) {
  var $window = $(window);
  var viewport_top = $window.scrollTop();
  var viewport_height = $window.height();
  var viewport_bottom = viewport_top + viewport_height;
  var $elem = $(elem);
  var top = $elem.offset().top;
  var height = $elem.height();
  var bottom = top + height;
  return(top >= viewport_top && top < viewport_bottom) || (bottom > viewport_top && bottom <= viewport_bottom) || (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom);
}

function addCustomCss() {

  if($("head").data("keyEvent_inprogress") == 1) {
    return;
  }

  debugLog("addCustomCss()", true);

  $("a[href*='inreplyto']").each(function(i, a) {
    var in_reply_to = a.href.replace(new RegExp(".*inreplyto=(\\d+)$", "i"), "$1");
    $(a).click(function(){showReplyDialog(in_reply_to); return false;});
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

  if(monospace_font == true) {
    $("body").css("font-family", "Monospace");
    $(".notice_data-text").css("font-family", "Monospace");
    $(".notices").each(function(i, item) {
      $(item).css("font-size", "16px");
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

function addQRcode(elem) {
  if(typeof(elem) != "undefined") {
    links = $("a", $(elem));
  } else {
    links = $("a");
  }
  for(var k = 0; k < links.length; k++) {
    var add_qr = true;

    /* Babil: Apply blacklist filter */
    for(var b = 0; b < blacklist.length; b++) {
      var regex = new RegExp(blacklist[b]);
      if(links[k].href.search(regex) >= 0) {
        add_qr = false;
        debugLog("Blacklist: " + links[k].href);
        break;
      }
    }

    /* Babil: Force whitelist filter now */
    if(add_qr == false) {
      for(var b = 0; b < whitelist.length; b++) {
        var regex = new RegExp(whitelist[b]);
        if(links[k].href.search(regex) >= 0) {
          add_qr = true;
          debugLog("Whitelist: " + links[k].href);
          break;
        }
      }
    }

    /* Babil: Add the QR code now */
    if(add_qr == true && isOnScreen(links[k]) && $(links[k]).data("qrcoded") != 1) {
      qrcodifyLink(links[k]);
    }
  }
}

function qrcodifyLink(link) {
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
    debugLog("qrcodifyLink() --> " + link.href + " qrlinks:" + qrlinks.length, true);
  }
}

function loadjQuery() {
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

function showReplyDialog(in_reply_to) {
  $("head").data("keyEvent_inprogress", 1)

  var reply_to = "";
  if (in_reply_to.match(new RegExp("\\d", "i"))) {
    reply_to = in_reply_to;
  }

  $("div#input_form_status").fadeIn('fast');
  $("div#input_form_status *").show();
  $("span.count").hide();
  $("select#notice_to").attr("value", "public:site");
  $("input#notice_private").attr("checked", "checked");

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
          showPopup("Submit failed!", "#FA6F7C");
          $("img#submit_spinner").remove();
         },
         success: function(results) {
          showPopup("Message posted!", "#ADDD44");
          hideReplyDialog();
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

function hideReplyDialog() {
  $("head").data("keyEvent_inprogress", 0)
  $("div#input_form_status").fadeOut('slow');
  $("div#input_form_status *").hide();
  refreshTimeout = window.setTimeout(refreshContent, 1000);
}

function handleKeypress() {
  $(document).keypress(function(key) {

    debugLog("handleKeypress() --> '" + String.fromCharCode(key.which) + "' pressed", true);

    if(String.fromCharCode(key.which) == 'r') {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }

      if($("div#input_form_status").is(":visible") == false) {
        showReplyDialog("");
      }
    }

    if(key.keyCode == 27) {
      if($("div#input_form_status").is(":visible") == true) {
        hideReplyDialog();
      }
    }

    if(String.fromCharCode(key.which) == 'l') {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      window.open(login_url, '_blank');
    }

    if(String.fromCharCode(key.which) == 'L') {
      if($("*:focus").is(".notice_data-text") && $("div#input_form_status").is(":visible") == true) {
        return;
      }
      window.open(logout_url, '_blank');
    }

    if(key.ctrlKey && (key.keyCode == 10 || key.keyCode == 13)) {
      debugLog("submitting ... ", true);
      if($("div#input_form_status").is(":visible") == true) {
        $("input#notice_action-submit").click();
      }
    }
  });
}

function addThumbnail() {
  var image_ext = ["\.gif", "\.jpg", "\.jpeg", "\.jpe", "\.bmp", "\.png", "\.tif", "\.tiff", "\.ico"];
  $("p.entry-content > a").each(function(i, a) {
    $(image_ext).each(function(i, ext) {
      if(a.href.match(new RegExp(ext, "i"))) {
        if($("img.thumbnail", $(a).parent()).length > 0 || $(a).data("thumbnail") > 0) {
          debugLog("addThumbnail() --> already thumbnailed", true);
        } else {
          $(a).parent().append("<img class='thumbnail' height='92px' width='128px' style='float:right;' src='" + a.href + "' onclick=javascript:window.open('" + a.href + "') ></img>");
          $(a).data("thumbnail", 1);
        }
      }
    });
  });
}

function showPopup(text, color){
  var id = "popup_" + new Date().getTime();
  var popup_color = '#FCFFD1';

  if (color != 'undefined') {
    popup_color = color;
  }

  $('<div class="popup" id=' + id + '>' + text + '</div>').appendTo('body');
  $('div.popup').css({
    'position': 'absolute',
    'top': $(window).scrollTop() + 9,
    'left': 10,
    'background-color': popup_color,
    'border-radius': '5px',
    'padding': '0.1em',
    'min-width': '10em',
    'border-color': '#CCC',
    'border-style': 'solid',
    'border-width': '1px',
    'text-align': 'center',
  });
  setTimeout(function(){$(".popup").fadeOut('slow'); $(".popup").remove();}, 3000);
}
