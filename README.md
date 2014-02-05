StatusNet-BigScreen
-------------------

StatusNet-BigScreen is Javascript plugin originally written for StatusNet public
stream to be displayed on large display screens in public areas. Over the time,
I have also added features to make it usable on desktop browsers for convenient 
navigation through the status update streams. It can be used as a Javascript
plugin to StatusNet or as a [Firefox - GreaseMonkey][1], [Chrome - TamperMonkey][2]
and [Opera user Javascript][3].

Currently it supports the following features:
 
  - Display of QR code for all external links
    - When the StatusNet public stream is displayed on a large screen in a 
    public display area, the idea is to enable visitors to follow a URL from a 
    status update on their phone by scanning the QR code
  - Automatic AJAX based page refresh to reload the latest status updates
  - Infinite scrolling e.g. if the user reaches the bottom of page 1, page 2 is
    automatically loaded and added to the bottom of page 1
  - Vim like key navigation
    - `j/k` to navigate through status updates
    - `n/p` to navigate through pages
    - `r` to reply to a specific status
    - `R` to reply publicly
    - `l` to login
    - `L` to logout
    - `s` to navigate to settings page
    - `e` to expand a folded conversation
    - `q` to toggle display of QR codes
    - `t` to toggle display of thumbnail of posted images
    - `i` to toggle infinite scrolling
    - `a` to toggle auto-refresh for latest status updates
    - `c` to toggle to a cleaner CSS

[1]: http://mzl.la/1c1Tooj
[2]: http://bit.ly/1n9nMCx  
[3]: http://www.opera.com/docs/userjs
