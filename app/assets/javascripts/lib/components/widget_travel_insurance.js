define([
  "jquery",
  "autocomplete",
  "pickadate/lib/picker",
  "pickadate/lib/picker.date",
  "pickadate/lib/legacy"
], function($) {

  "use strict";

  function InsuranceWidget() {
    this.$startDate = $("#js-start-date");
    this.$startDateContainer = $("#js-start-date-container");
    this.$submitButton = $("#js-submit-booking");
    this.$residenceSelect = $("#country-residence");
    this.$canadaSelect = $("#qp-province");
    this.$coverageSelect = $("#qp-coverage");
    this.$durationSelect = $("#qp3_duration");
    this.$startDateInput = $("#js-start-date");
    this.$canadaProvinces = this.$canadaSelect.parent();
    this.$coverDisplay = $("#cover-region");

    this.whereAreYouGoing = "Where are you going?";
    this.errorVisible = false;
  }

  InsuranceWidget.prototype.init = function() {
    this.initDatePickers();
    this.initHandlers();

    this.updateDurationLength();
    this.updateWhereAreYouGoing();

    $("#qp3_typeofpolicy_single").prop("checked", true);

    window.initWN_QQ || // jshint ignore:line
      $.getScript("//www.worldnomads.com/turnstile/qp/common/scripts/qq.min.js", function() {
        initWN_QQ("js-travel-widget"); // jshint ignore:line
      });

  };

  InsuranceWidget.prototype.initDatePickers = function() {
    var today = new Date();

    this.$startDate.pickadate({
      editable: false,
      min: today,
      format: "d mmm yyyy"
    });

  };

  InsuranceWidget.prototype.updateWhereAreYouGoing = function() {
    // Update the label of "Where you are going?" as World Nomads doesnt do this
    var coverageLabel = this.$coverDisplay.find(".js-select-overlay");
    coverageLabel.text(this.whereAreYouGoing);
  };

  InsuranceWidget.prototype.updateDurationLength = function() {
    var self = this;

    /*
     *   :::HACK ALERT:::
     *   Because the Rizzo utility puts an overlay on top of each <select> element, and then
     *   listens for the change() event on the underlying <select> element, and on change
     *   updates the text of the overlay element, I need to duplicate this functionality
     *   here.  The reason for the incredibly ugly hack is because the Travel Insurance form
     *   is driven completely by an external script loaded from the World Nomads site (qq.min).
     *   That script changes the <option> elements when a country of origin is selected, meaning,
     *   it deletes all available <option> elements, and adds new ones.
     */
    window.setTimeout(function() {
      self.$durationSelect.attr("selectedIndex", 0);
      $(self.$durationSelect).closest(".js-select-group-manager").find(".js-select-overlay").text(self.$durationSelect.find("option:selected").text());
    }, 100);
  };

  InsuranceWidget.prototype.flagError = function(elem, errorId, type) {
    switch (type) {
      case "datepicker":
        elem.closest(".date-group").addClass("form--error");
        break;
      case "select":
        elem.closest(".js-select-group-manager").find(".js-select-overlay").addClass("form--error");
    }
  };

  InsuranceWidget.prototype.validate = function() {
    var self = this,
        errors = false;

    this.updateDurationLength();

    if (this.$residenceSelect.siblings("label").text().indexOf("Country of residence") >= 0) {
      this.flagError(this.$residenceSelect, "residenceError", "select");
      errors = true;
    }

    if (this.$durationSelect.prop("selectedIndex") === -1) {
      this.flagError(this.$durationSelect, "durationError", "select");
      errors = true;
    }

    if (this.$startDate.val() === "") {
      this.flagError(this.$startDate, "startDateError", "datepicker");
      errors = true;
    }

    if (this.$coverDisplay.is(":visible")) {
      if (this.$coverageSelect.closest(".js-select-group-manager").find(".js-select-overlay").text() == this.whereAreYouGoing) {
        this.flagError(this.$coverageSelect, "coverSelectError", "select");
        errors = true;
      }
    }

    if (this.$canadaProvinces.is(":visible")) {
      if (this.$canadaSelect.closest(".js-select-group-manager").find(".js-select-overlay").text() === "Province") {
        this.flagError(this.$canadaSelect, "canadaProvincesError", "select");
        errors = true;
      }
    }

    // If there are errors, show an alerting div over the submit button
    // which will fade away after 2 seconds.
    if (errors && !this.errorVisible) {

      $(".alert--error").show();
      this.errorVisible = true;

      setTimeout(function() {
        $(".alert--error").hide();
        self.errorVisible = false;
      }, 2000);
    }

    return !errors;
  };

  InsuranceWidget.prototype.initHandlers = function() {
    var self = this;

    this.$residenceSelect.on("change", function() {
      // If the field was highlighted by validation, clear error style
      self.$residenceSelect.closest(".js-select-group-manager").find(".js-select-overlay").removeClass("form--error");

      // When the user selects the country of origin, ensure that the
      // duration and destination fields update correctly.
      self.updateDurationLength();
      self.updateWhereAreYouGoing();
    });

    this.$canadaProvinces.on("change", function() {
      // If the field was highlighted by validation, clear error style
      self.$canadaProvinces.closest(".js-select-group-manager").find(".js-select-overlay").removeClass("form--error");
    });

    this.$coverageSelect.on("change", function(event) {
      // If the field was highlighted by validation, clear error style
      self.$coverageSelect.closest(".js-select-group-manager").find(".js-select-overlay").removeClass("form--error");

      // Stopping propagation of the event to the selectGroupManager code
      // so that the overlay text can be constrained to 55 characters in length
      event.stopPropagation();

      var controlTextMaxLength = 35,
          selectedText = $("#qp-coverage option:selected").text().substring(0, controlTextMaxLength);

      if (selectedText.length >= controlTextMaxLength) {
        selectedText += "...";
      }
      self.$coverageSelect.closest(".js-select-group-manager").find(".js-select-overlay").text(selectedText);
    });

    this.$startDate.change(function() {
      var chosenDate = new Date(self.$startDate.val());

      // Clear the polyfill text in IE8
      $(".polyfill--placeholder").text("");

      // Remove form validation border (if exists)
      self.$startDateContainer.removeClass("form--error");

      // Update hidden field values which are needed to pass to World Nomads
      $("#qp3_startday").val(chosenDate.getDate());
      $("#qp3_startmonth").val(chosenDate.getMonth() + 1);
      $("#qp3_startyear").val(chosenDate.getFullYear());
    });

    this.$submitButton.click(function(event) {
      if (!self.validate()) {
        event.preventDefault();
        return;
      } else {
        $.ajax({
          type: "GET",
          url: "/tracker/insurancetravelclaims",
        });
      }
    });
  };

  return InsuranceWidget;
});
