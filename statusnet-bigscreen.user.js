// ==UserScript==
// @name           StatusNet-BigScreen
// @namespace      status.inside.nicta.com.au/gsbabil
// @description    StatusNet Auto-refresh, QR-code and Infinite-scroll
// @require        http://code.jquery.com/jquery-latest.min.js
// @include        http://status.inside.nicta.com.au/*
// @exclude        http://status.inside.nicta.com.au/notice/new?*
// @author         gsbabil <gsbabil@gmail.com>
// @version        0.0.8
// @iconURL        http://gravatar.com/avatar/10f6c9d84191bcbe69ce41177087c4d7
// ==/UserScript==

loadjQuery();

var DEBUG = false;
var spinner_mozilla = "data:image/gif;base64,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";
var spinner_chrome = "data:image/png;base64,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";

var spinner = "";
var hostname = "status.inside.nicta.com.au";
var title = "Nicta StatusNet";
var blacklist = [hostname, "^mailto:", "^javascript:", "geonames\.org", ];
var whitelist = [hostname + "/url", ];
var refreshInterval = 10000;
var refreshTimeout;
var now = new Date();
var before = new Date();

$(document).ready(function() {
  if($.browser.mozilla) {
    spinner = spinner_mozilla;
  } else if($.browser.webkit) {
    spinner = spinner_chrome;
  }
  mutation();
  refreshContent();
});

$(parent.document).scroll(function() {
  infiniteScroll();
  mutation();
});

function mutation() {
  fancify_page();
  add_qrcode();
}

function refreshContent() {
  now = new Date();
  var elapsedTime = (now.getTime() - before.getTime());
  document.title = "[" + (elapsedTime / 1000) + "] - " + title;
  debugLog('refreshContent() --> ' + elapsedTime);
  if(elapsedTime > refreshInterval) {
    before = new Date();
    $.ajaxSetup({
      cache: true,
      ifModified: true,
    });
    if($("head").data("refreshContent_progress") != 1) {
      $("head").data("refreshContent_progress", 1);
      $('div#content_inner').first().load(document.location.href + " div#content_inner", function() {
        $("head").data("refreshContent_progress", 0);
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

function fancify_page() {
  debugLog("fancify_page()");

  $("div#site_nav_local_views").remove();
  $("div#header").remove();
  $("div#footer").remove();
  $("div#tagcloud").remove();
  $("div#featured_users").remove();
  $("div#export_data").remove();
  $(".input_form_nav_tab").remove();

  /* Babil: remove all input fields */
  $("input").remove();

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

  /* Babil: bigger font for the status messages */
  $(".notices").each(function(i, item){
    $(item).css("font-size", "18px");
  });
}

function add_qrcode(elem) {
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
    var css = "box-shadow: 3px 3px 4px grey; filter: progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#444444'); border-radius: 5px !important; margin: 5px";
    $(daddy).append('<img class="qrcode" align="center" style="' + css + '" src="http://chart.apis.google.com/chart?cht=qr&chs=' + size + '&choe=UTF-8&chl=' + link.href + '">');
    debugLog("qrcodify_link() --> " + link.href + " qrlinks:" + qrlinks.length, true);
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