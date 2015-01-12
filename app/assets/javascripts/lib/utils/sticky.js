define([
  "jquery",
  "lib/utils/debounce",
  "lib/utils/throttle",
  "polyfills/function_bind"
], function($, debounce, throttle) {

  "use strict";

  function Sticky($target, options) {
    var defaults = {
      minWidth: 1024,
      threshold: 60
    };

    this.$target = $target;
    this.$parent = $target.offsetParent();
    this.options = $.extend({}, defaults, options);
  }

  Sticky.prototype.init = function() {
    this.reset();
    this.isActive = true;
  };

  Sticky.prototype.teardown = function() {
    $(window).off(".sticky");
    this.unstick();

    this.isActive = false;
  };

  Sticky.prototype.stick = function() {
    this.isSticky = true;

    this.$target
      .addClass("is-sticky")
      .removeClass("at-bottom")
      .css({ position: "fixed", left: this._leftOffset() });

    $(window).on("resize.stickyResize orientationchange.stickyResize", debounce(this._onResize.bind(this), 100));
  };

  Sticky.prototype.unstick = function(bottom) {
    this.isSticky = false;

    this.$target
      .removeClass("is-sticky")
      .css({ position: "", left: "" })
      .addClass(bottom ? "at-bottom" : null);

    $(window).off(".stickyResize");
  };

  Sticky.prototype.refresh = function() {
    var wasSticky = this.isSticky;

    this._onScroll();

    if (wasSticky && this.isSticky) {
      this.$target.css("left", this._leftOffset());
    }
  };

  Sticky.prototype.reset = function() {
    $(window).on("scroll.sticky.stickyPending", this._onScrollStart.bind(this));
  };

  Sticky.prototype._onScroll = function() {
    if (this.isSticky) {
      if (this._limitBottom()) {
        this.unstick(true);
      } else if (this._limitTop()) {
        this.unstick();
      }
    } else if (!this._limitTop() && !this._limitBottom()) {
      this.stick();
    }
  };

  Sticky.prototype._onScrollStart = function() {
    if (!this._minHeight() || !this._minWidth()) return;

    $(window)
      .off(".stickyPending")
      .on("scroll.sticky.stickyScroll", throttle(this._onScroll.bind(this), 10))
      .on("scroll.sticky.stickyScroll", debounce(this._onScrollEnd.bind(this), 200));
  };

  Sticky.prototype._onScrollEnd = function() {
    $(window).off(".stickyScroll");
    this.reset();
  };

  Sticky.prototype._onResize = function() {
    if (this.isActive) {
      if (!this._minWidth() || !this._minHeight()) {
        this.teardown();
      } else if (this.isSticky) {
        this.refresh();
      }
    } else {
      if (this._minWidth() && this._minHeight()) {
        this.init();
      }
    }
  };

  Sticky.prototype._widths = function() {
    return {
      parent: this.$parent.width(),
      target: this.$target.outerHeight(true)
    };
  };

  Sticky.prototype._heights = function() {
    return {
      parent: this.$parent.height(),
      target: this.$target.outerHeight(true)
    };
  };

  Sticky.prototype._offsets = function() {
    return {
      parent: this.$parent.offset(),
      target: this.$target.offset()
    };
  };

  Sticky.prototype._leftOffset = function() {
    var widths = this._widths();
    return this._offsets().parent.left + widths.parent - widths.target;
  };

  Sticky.prototype._minWidth = function() {
    return window.innerWidth > this.options.minWidth;
  };

  Sticky.prototype._minHeight = function() {
    var heights = this._heights(),
        totalHeight = heights.target + this.options.threshold;

    return totalHeight < window.innerHeight && totalHeight < heights.parent;
  };

  Sticky.prototype._limitTop = function() {
    return window.scrollY < this._offsets().parent.top;
  };

  Sticky.prototype._limitBottom = function() {
    var heights = this._heights(),
        offsets = this._offsets();

    return (window.scrollY + heights.target) >= (offsets.parent.top + heights.parent);
  };

  return Sticky;

});
