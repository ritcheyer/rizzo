// ------------------------------------------------------------------------------
//
// NavigationArrows
//
// ------------------------------------------------------------------------------

define([ "jquery" ], function($) {

  "use strict";

  var defaults = {
    arrows: ".js-navigation-arrow",
    el: ".js-navigation-controls",
    listener: "#js-row--content"
  };

  // @args = {}
  // el: {string} selector for parent element
  // listener: {string} selector for the listener
  function NavigationArrows(args) {
    this.config = $.extend({}, defaults, args);

    this.$listener = $(this.config.listener);
    this.$el = $(this.config.el);
    this.$el.length && this.init();
  }

  NavigationArrows.prototype.init = function() {
    this.$next = $("<a class='js-navigation-arrow js-navigation-arrow-next navigation-arrow--right is-hidden icon--chevron-right--after icon--white--after' />");
    this.$previous = $("<a class='js-navigation-arrow js-navigation-arrow-previous navigation-arrow--left is-hidden icon--chevron-left--after icon--white--after' />");
    this.tooltipTemplate = "<span class='js-navigation-arrow-tooltip'></span>";

    this.$next.append($(this.tooltipTemplate));
    this.$previous.append($(this.tooltipTemplate));
    this.$el.append(this.$next, this.$previous);

    this.update(this.config);

    this.listen();
  };

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  NavigationArrows.prototype.listen = function() {
    var callback = this.config.callback;

    if (callback) {
      this.$listener.on("click", ".js-navigation-arrow", callback);
    }

  };

  // -------------------------------------------------------------------------
  // Public Functions
  // -------------------------------------------------------------------------

  NavigationArrows.prototype.update = function(config) {
    this._setupArrow(this.$next, config.next);
    this._setupArrow(this.$previous, config.previous);
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  NavigationArrows.prototype._setupArrow = function($el, config) {
    if (config && (config.url || config.slug)) {
      $el.removeClass("is-hidden");
      $el.attr("href", (config.url || config.slug));
    } else {
      $el.addClass("is-hidden");
    }
  };

  return NavigationArrows;

});
