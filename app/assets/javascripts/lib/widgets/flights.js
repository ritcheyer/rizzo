// ------------------------------------------------------------------------------
//
// FlightsWidget
//
// ------------------------------------------------------------------------------

define([
  "jquery",
  "data/currencies",
  "picker",
  "pickerDate",
  "pickerLegacy",
  "lib/widgets/flights_autocomplete",
  "lib/analytics/flights_omniture",
  "lib/analytics/flights",
  "lib/utils/local_store"
], function($, currencies, picker, DatePicker, legacy, FlightsAutocomplete, Omniture, GoogleAnalytics, LocalStore) {

  "use strict";

  var autocomplete, countryCode, errorVisible, googleAnalytics, localStore, omniture, returnDatePicker, userCurrency,
      $el;

  function FlightsWidget() {
    autocomplete = new FlightsAutocomplete();
    googleAnalytics = new GoogleAnalytics("#js-flights-form");
    omniture = new Omniture("#js-flights-submit");
    localStore = new LocalStore();

    $.ajax({
      type: "GET",
      url: "http://www.lonelyplanet.com",
      success: function(data, textStatus, request) {
        countryCode = request.getResponseHeader("X-GeoIP-CountryCode");
      }
    });
  }

  FlightsWidget.prototype.init = function() {
    autocomplete.init();
    omniture.init();

    $el = $(".js-flights-widget");
    userCurrency = localStore.getCookie("lpCurrency");

    $(document).ready(function() {
      this.$currency = $(".js-currency-select .js-select");
      this.$departDate = $(".js-av-start");
      this.$fromAirport = $(".js-from-airport");
      this.$fromCity = $(".js-from-city");
      this.$returnDate = $(".js-av-end");
      this.$toAirport = $(".js-to-airport");
      this.$toCity = $(".js-to-city");

      this.initDatePickers();
      this.initCurrenySelect();
      this.listen();
    }.bind(this));
  };

  FlightsWidget.prototype.buildUrl = function() {
    var departDate = this.formatDate(this.$departDate.val()),
        returnDate = "",
        url = "http://flights.lonelyplanet.com/Flights?",
        currency = this.$currency.val();

    if (!this.$returnDate.prop("disabled")) {
      returnDate = this.formatDate(this.$returnDate.val());
    }

    url += "&outboundDate=" + departDate;
    url += "&inboundDate=" + returnDate;
    url += "&originPlace=" + (this.$fromAirport.val() === "" ? this.$fromCity.val() : this.$fromAirport.val());
    url += "&destinationPlace=" + (this.$toAirport.val() === "" ? this.$toCity.val() : this.$toAirport.val());
    url += "&adults=" + $(".js-adult-num .js-select").val();
    url += "&children=" + $(".js-child-num .js-select").val();
    url += "&infants=" + $(".js-baby-num .js-select").val();
    url += "&locationSchema=" + "sky";
    url += "&cabinClass=" + "economy";
    url += "&country=" + countryCode;
    url += "&currency=" + currency;
    url += "&searchcontrols=true";

    return url;
  };

  FlightsWidget.prototype.formatDate = function(date) {
    var month, day, year;

    date = new Date(Date.parse(date));

    day = this._zeroise(date.getDate()),
    month = this._zeroise(date.getMonth() + 1),
    year = date.getFullYear();

    return year + "-" + month + "-" + day;
  };

  FlightsWidget.prototype.initCurrenySelect = function() {
    var opts = "", currency;

    for (var j = 0; j < currencies.length; j++) {
      currency = currencies[j].code;
      opts += "<option value='" + currency + "'" + (currency == userCurrency ? "selected" : "") + ">" + currency + "</option>";
    }

    this.$currency
      .removeProp("disabled")
      .html(opts)
      .trigger("change")
      .closest(".js-currency-select")
        .removeClass("is-disabled");
  };

  FlightsWidget.prototype.initDatePickers = function() {
    // Initialize the two date fields as Pickadate controls
    var today = new Date(),
        tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000); // add 24 hours

    this.$returnDate.pickadate({
      editable: false,
      min: today,
      format: "d mmm yyyy",
      onStart: function() {
        this.set({ select: tomorrow });
      }
    });

    this.$departDate.pickadate({
      editable: false,
      min: today,
      format: "d mmm yyyy",
      onStart: function() {
        this.set({ select: today });
      }
    });
  };

  FlightsWidget.prototype.checkErrors = function(e) {
    var $errorMsg = $("#js-flights-submit .js-btn-error"),
        errors = false,
        valid = this.validateForm();

    e.preventDefault();

    // If there are errors, show an alerting div over the submit button
    // which will fade away after 2 seconds.
    if (!valid && !errorVisible) {
      $errorMsg.show();
      errorVisible = true;

      setTimeout(function() {
        $errorMsg.hide();
        errorVisible = false;
      }, 2000);
    } else {
      googleAnalytics.track();
      window.open(this.buildUrl());
    }

    return !errors;
  };

  FlightsWidget.prototype.validateForm = function() {
    var isValid = true;

    $el.find(".input--text").each(function() {
      var $this = $(this);

      if (!$.trim($this.val())) {
        isValid = false;
        if ($this.hasClass("js-city-input")) {
          $this.addClass("form--error");
        } else {
          $this.closest(".input--regular--dark").addClass("form--error");
        }
      }
    });

    return isValid;
  };

  FlightsWidget.prototype.selectTripType = function() {
    var departDate;

    if ($(".js-oneway-btn").prop("checked")) {
      this.$returnDate.prop("disabled", true).val("One Way");
    } else {
      departDate = new Date(this.$departDate.pickadate("picker").get());

      this.$returnDate.removeProp("disabled").val("");
      this.$returnDate.pickadate("picker").set({ min: departDate, select: departDate });
    }
  };

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  FlightsWidget.prototype.listen = function() {

    $(".js-city-input").on("click", function() {
      this.select();
    });

    $("#js-flights-form").submit(this.checkErrors.bind(this));

    $el.find("[type=radio]").on("change", this.selectTripType.bind(this));

    $el.find(".input--text").on("focus", function() {
      var $input = $(this);
      if ($input.hasClass("form--error")) {
        $input.removeClass("form--error");
      }
    });

    $el.find(".js-datepicker").on("click", function() {
      var $input = $(this).closest(".input--regular--dark");
      if ($input.hasClass("form--error")) {
        $input.removeClass("form--error");
      }
    });

    this.$departDate.on("change", function() {
      var departDate = new Date(this.$departDate.val()),
          returnDate = new Date(this.$returnDate.val());

      if (returnDatePicker.val() !== "One Way" && departDate.getTime() > returnDate.getTime()) {
        returnDatePicker.pickadate("picker").set({ min: departDate, select: departDate });
      }
    });

  };

  // -------------------------------------------------------------------------
  // Private
  // -------------------------------------------------------------------------

  FlightsWidget.prototype._zeroise = function(num) {
    return (num < 10) ? "0" + num : num;
  };

  return FlightsWidget;

});
