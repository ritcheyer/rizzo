// Protect legacy apps that already define jQuery from downloading it again
if (window.jQuery) {
  define("jquery", [], function() {
    "use strict";
    return window.jQuery;
  });
}

require([ "jquery" ], function($) {

  "use strict";

  require([
    "flamsteed",
    "lib/page/swipe",
    "lib/core/authenticator",
    "lib/core/shopping_cart",
    "lib/components/toggle_active",
    "lib/core/ad_manager",
    "lib/core/cookie_compliance",
    "lib/components/select_group_manager",
    "lib/core/nav_search",
    "lib/core/feature_detect",
    "trackjs",
    "polyfills/function_bind",
    "polyfills/xdr"
  ], function(Flamsteed) {

    $(document).ready(function() {

      var secure = window.location.protocol === "https:";

      if (!secure) {
        if (window.lp.getCookie) {
          window.lp.fs = new Flamsteed({
            events: window.lp.fs.buffer,
            u: window.lp.getCookie("lpUid")
          });
        }
      }

    });

  });
});
