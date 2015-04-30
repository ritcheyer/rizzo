require(["http://c.amazon-adsystem.com/aax2/amzn_ads.js"], function (amzn) {

  "use strict";

  try {
    var amazon_ads = amznads.getAds('3231');
  } catch(e) {
    console.log(e);
  }
});
