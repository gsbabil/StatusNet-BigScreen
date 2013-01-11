// ==UserScript==
// @name           StatusNet-BigScreen
// @namespace      status.inside.nicta.com.au/gsbabil
// @description    StatusNet Auto-refresh, QR-code and Infinite-scroll
// @require        http://code.jquery.com/jquery-latest.min.js
// @include        http://status.inside.nicta.com.au/*
// @exclude        http://status.inside.nicta.com.au/notice/new?*
// @exclude        http://status.inside.nicta.com.au/notice/delete/*
// @exclude        http://status.inside.nicta.com.au/main/login
// @author         gsbabil <gsbabil@gmail.com>
// @version        0.0.9
// @iconURL        http://gravatar.com/avatar/10f6c9d84191bcbe69ce41177087c4d7
// ==/UserScript==

loadjQuery();

var DEBUG = false;
var spinner = "data:image/gif;base64,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";

var hostname = "status.inside.nicta.com.au";
var login_url = "http://" + hostname + "/main/login";
var logout_url = "http://" + hostname + "/main/logout";
var title = "Nicta StatusNet";
var blacklist = [hostname, "^mailto:", "^javascript:", "geonames\.org", ];
var whitelist = [hostname + "/url", ];
var refreshInterval = 10000;
var refreshTimeout;
var now = new Date();
var before = new Date();

$(document).ready(function() {
  handleKeypress();
  mutation();
  refreshContent();
});

$(parent.document).scroll(function() {
  infiniteScroll();
  mutation();
});

function mutation() {
  addCustomCss();
  addQRcode();
}

function refreshContent() {
  now = new Date();
  var elapsedTime = (now.getTime() - before.getTime());
  document.title = "[" + (elapsedTime / 1000).toPrecision(4) + "] - " + title;
  debugLog('refreshContent() --> ' + elapsedTime.toPrecision(4));
  if(elapsedTime > refreshInterval) {
    before = new Date();
    $.ajaxSetup({
      cache: true,
      ifModified: true,
    });
    if($("head").data("refreshContent_inprogress") != 1) {
      $("head").data("refreshContent_inprogress", 1);
      $('div#core').first().load(document.location.href + " div#core > *", function() {
        $("head").data("refreshContent_inprogress", 0);
        debugLog("current token --> " + $("input#token").attr("value"), true);
        mutation();
      });
    }
  }
  refreshTimeout = window.setTimeout(refreshContent, 1000);
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
        $("div#" + id).load(href + " div#content_inner", function() {
          $("head").data("infiniteScroll_inprogress", 0);
          $("img#spinner").remove();
          mutation();
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

  if ($("head").data("keyEvent_inprogress") == 1) {
    return;
  }

  debugLog("addCustomCss()", true);

  var curr_notice_id = $("head").data("current_notice");
  $("#" + curr_notice_id).css("background", "#DDD");

  $("div#site_nav_local_views").hide();
  $("div#header").hide();
  $("div#footer").hide();
  $("div#tagcloud").hide();
  $("div#featured_users").hide();
  $("div#export_data").hide();
  $(".input_form_nav_tab").hide();

  /* Babil: remove all input fields */
  $("input").hide();
  $("[name*='favor-submit']").show();


  $(".input_form").css("float", "none");
  $("#input_form_status").css("margin-right", "2em");

  /*
  $("body").css("font-family", "Monospace");
  $(".notice_data-text").css("font-family", "Monospace");
  $(".notices").each(function(i, item){
    $(item).css("font-size", "17px");
  });
  */

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
    "width" : "23%",
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
    if (add_qr == false) {
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
    var css = "box-shadow: 3px 3px 4px grey; filter: progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#444444'); border-radius: 5px !important; margin: 5px";
    $(daddy).append('<img class="qrcode" align="center" style="' + css + '" src="http://chart.apis.google.com/chart?cht=qr&chs=' + size + '&choe=UTF-8&chl=' + link.href + '">');
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

function handleKeypress() {
  $(document).keypress(function(key){

    debugLog("handleKeypress() --> '" + String.fromCharCode(key.which) + "' pressed", true);

    /* Babil: if the textbox has focus, that
     * means user is typing a new message.
     */
    if ($("*:focus").is(".notice_data-text")) {
        return;
    }

    if ($("head").data("refreshContent_inprogress") == 1) {
      return;
    }

    if (key.which == ('r').charCodeAt(0)) {
      if ($("div#input_form_status").length > 0 ) {
        if ($("div#input_form_status").is(":visible") == false) {
          window.scrollTo(0, 0);
          $("head").data("keyEvent_inprogress", 1)
          $("div#input_form_status").show();
          $("div#input_form_status *").show();
          $("span.count").hide();
          clearTimeout(refreshTimeout);
        } else {
          $("head").data("keyEvent_inprogress", 0)
          $("div#input_form_status").hide();
          $("div#input_form_status *").hide();
          refreshTimeout = window.setTimeout(refreshContent, 1000);
        }
      }
    }

    if (key.which == ('l').charCodeAt(0)) {
      window.open(login_url, '_blank');
    }

    if (key.which == ('L').charCodeAt(0)) {
      window.open(logout_url, '_blank');
    }

  });
}
