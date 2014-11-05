define(function() {

  "use strict";

  function GoogleAnalytics(selectors) {
    for (var selector in selectors) {
      this[selector] = selectors[selector];
    }
  }

  GoogleAnalytics.prototype.track = function() {

    if (!(window.lp.analytics.api && window.lp.analytics.api.trackEvent)) {
      return;
    }

    window.lp.analytics.api.trackEvent({
      category: "car-rental",
      action:   "search-partner-click",
      params: {
        locationStart:     this.$locationStart.val(),
        locationEnd:       this.$locationEnd.val(),
        startDate:         this.$dateStart.val() + "," + this.$timeStart.val(),
        endDate:           this.$dateEnd.val() + "," + this.$timeEnd.val(),
        locationResidence: this.$locationResidence.val()
      }
    });

  };

  return GoogleAnalytics;

});
