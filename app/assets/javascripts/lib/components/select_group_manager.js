define([ "jquery" ], function($) {

  "use strict";

  var defaults = {
    listener: ".js-wrapper"
  };

  function SelectGroupManager(context) {
    this.$selectContainers = $(context || defaults.listener);
    this.$selectContainers.length && this.init();
  }

  SelectGroupManager.prototype.init = function() {
    var _this = this;

    this.$selectContainers
      .on("focus", ".js-select", function(e) {
        _this._getOverlay($(e.target)).addClass("is-selected");
      })
      .on("blur", ".js-select", function(e) {
        _this._getOverlay($(e.target)).removeClass("is-selected");
      })
      .on("keyup", ".js-select", function(e) {
        $(e.target).trigger("change");
      })
      .on("change", ".js-select", function(e) {
        var $target = $(e.target);

        e.preventDefault();

        _this._updateOverlay($target);

        if ($target.data("form-submit")) {
          _this._submit($target);
        }
      });
  };

  SelectGroupManager.prototype._getOverlay = function($target) {
    return $target.closest(".js-select-group-manager").find(".js-select-overlay");
  };

  SelectGroupManager.prototype._updateOverlay = function($target) {
    var $option = $target.find("option:selected");
    this._getOverlay($target).text($option.text());
  };

  SelectGroupManager.prototype._submit = function($target) {
    if ($target.val()) {
      $target.closest("form").submit();
    }
  };

  return SelectGroupManager;

});
