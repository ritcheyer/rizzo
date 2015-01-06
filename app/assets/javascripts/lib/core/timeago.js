// ------------------------------------------------------------------------------
//
// Timeago config with responsive strings
//
// ------------------------------------------------------------------------------

define([ "jquery", "lib/utils/debounce", "jtimeago" ], function($, debounce) {

  "use strict";

  var defaults = {
    context: "#js-row--content",
    breakpoint: 600,
    refreshMillis: 3000,
    selectors: {
      full: ".js-timeago-full",
      responsive: ".js-timeago",
    }
  },

  MONTH_NAMES = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

  function TimeAgo(args) {
    this.config = $.extend({}, defaults, args);
    this.strings = {
      full: {
        suffixAgo: null,
        seconds: "just now",
        minute: "a minute ago",
        minutes: "%d minutes ago",
        hour: "an hour ago",
        hours: "%d hours ago",
        day: "a day ago",
        days: "%d days ago",
        month: "a month ago",
        months: "%d months ago",
        year: "a year ago",
        years: "%d years ago"
      },
      short: {
        suffixAgo: null,
        seconds: "%ds",
        minute: "%dm",
        minutes: "%dm",
        hour: "%dh",
        hours: "%dh",
        day: "%dd",
        days: "%dd",
        month: this._getMonthName.bind(this),
        months: this._getMonthName.bind(this),
        year: this._getFullYear.bind(this),
        years: this._getFullYear.bind(this)
      }
    };

    this.$fullTimeagos = $(this.config.selectors.full, this.config.context);
    this.$responsiveTimeagos = $(this.config.selectors.responsive, this.config.context);

    (this.$fullTimeagos.length || this.$responsiveTimeagos.length) && this.init();
  }

  TimeAgo.prototype.init = function() {
    // Disable original refresh function in order to use selector-based strings.
    $.timeago.settings.refreshMillis = 0;

    this.updateAll();
    this.setCustomRefresh();
  };

  TimeAgo.prototype.updateAll = function() {
    this.$fullTimeagos.length && this.updateFull();
    this.$responsiveTimeagos.length && this.updateResponsive();
  };

  TimeAgo.prototype.updateFull = function() {
    $.timeago.settings.strings = this.strings.full;
    this.$fullTimeagos.timeago("updateFromDOM");
  };

  TimeAgo.prototype.updateResponsive = function() {
    $.timeago.settings.strings = this._isAboveBreakpoint() ? this.strings.full : this.strings.short;
    this.$responsiveTimeagos.timeago("updateFromDOM");
  };

  TimeAgo.prototype.setCustomRefresh = function() {
    // Refresh all on interval
    setInterval(this.updateAll.bind(this), this.config.refreshMillis);
    // Refresh responsive strings on window resize
    this.$responsiveTimeagos.length && $(window).resize(debounce(this.updateResponsive.bind(this), 300));
  };

  // -------------------------------------------------------------------------
  // Private
  // -------------------------------------------------------------------------

  TimeAgo.prototype._getMonthName = function(number, distanceMillis) {
    return MONTH_NAMES[new Date(Date.now() - distanceMillis).getMonth()];
  };

  TimeAgo.prototype._getFullYear = function(number, distanceMillis) {
    return new Date(Date.now() - distanceMillis).getFullYear().toString();
  };

  TimeAgo.prototype._isAboveBreakpoint = function() {
    return document.documentElement.clientWidth >= this.config.breakpoint;
  };

  return TimeAgo;
});
