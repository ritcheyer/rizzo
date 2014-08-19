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
    "lib/core/base",
    "flamsteed",
    "lib/components/toggle_active",
    "trackjs",
    "polyfills/function_bind",
    "polyfills/xdr"
  ], function(Base, Flamsteed, ToggleActive) {

    $(function() {

      var secure = window.location.protocol === "https:";

      new Base();
      new ToggleActive;
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
