// ==UserScript==
// @name           StatusNet
// @namespace      status.inside.nicta.com.au/gsbabil
// @description    StatusNet Auto Refresh and QR Code
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @include        http://status.inside.nicta.com.au/*
// ==/UserScript==

function refresh_content()
{
  $(document).ready(function(){$('div#content_inner').load(document.location.href + " div#content_inner" );});
  console.log('blah');
  setInterval(refresh_content, 30000);
}

function add_qrcode(link)
{
    if (link.href.length < 50)
	    size = "75x75";
    else if (link.href.length < 120)
	    size = "120x120";
    else
	    size = "150x150";
    css = "box-shadow: 3px 3px 4px grey; filter: progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#444444'); border-radius: 5px !important; margin: 5px";
    //$(link).after('<br><img class="qrcode" align="center" style="' + css + '" src="http://chart.apis.google.com/chart?cht=qr&chs=' + size + '&choe=UTF-8&chl=' + link.href + '"><br>');
    daddy = $(link).parents("div.entry-title");
    qrdiv = daddy.children("div.qrcodes");
    if (qrdiv.length == 0)
	   qrdiv = daddy.prepend('<div class="qrcodes" style="float: right; max-width: 175px"></div>');
    qrdiv = daddy.children("div.qrcodes");
    qrdiv.append('<img class="qrcode" align="center" style="' + css + '" src="http://chart.apis.google.com/chart?cht=qr&chs=' + size + '&choe=UTF-8&chl=' + link.href + '">');
    console.log(link.href);
}

/* Babil: Remove left-hand-side local navigation column */
$("div#site_nav_local_views").remove();

/* Babil: Remove the header and the footer*/
$("div#header").remove();
$("div#footer").remove();
$("div#tagcloud").remove();
$("div#featured_users").remove();
$("div#export_data").remove();
/* Embigen everything */
$("div#wrap").css({"width": "99%"});
$("div#core").css({"width": "100%"});
$("div#aside_primary_wrapper").css({"width": "100%"});
$("div#site_nav_local_views_wrapper").css({"width": "100%", "left": 0});
$("div#content_wrapper").css({"width": "100%", "left": 0});
$("div#content").css({"width": "70%", "left": 0});
// XXX 83% is to align QRCodes on my screen...
$(".threaded-replies").css({"width": "83%"});
$(".notice").css({"width": "100%"});
// Right sidebar
$("div#aside_primary").css({"left": "auto", "right": 0,"float": "right", "max-width": "25%"});


links = $("a");

hostname = "status.inside.nicta.com.au";
blacklist = [  
            hostname,
            "mailto",
	    "javascript",
            ];

whitelist = [ 
            hostname + "/url", 
            ];


for (var k=0; k<links.length; k++)
{
  var add_qr = true;
  
  /* Babil: Apply blacklist filter */
  for (var b=0; b<blacklist.length; b++)
  {
    if (links[k].href.indexOf(blacklist[b]) >= 0)
    {
        add_qr = false;
        console.log("Blacklist:" + links[k].href);
        break;
    }
  }
  
  /* Babil: Force whitelist filter now */
  for (var b=0; b<whitelist.length; b++)
  {
    if (links[k].href.indexOf(whitelist[b]) >= 0)
    {
        add_qr = true;
        console.log("Whitelist:" + links[k].href);
        break;
    }
  }
  
  /* Babil: Add the QR code now */
  if (add_qr)
  {
    add_qrcode(links[k]);
  }
}
refresh_content();
