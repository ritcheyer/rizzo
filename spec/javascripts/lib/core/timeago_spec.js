define([ "jquery", "lib/core/timeago" ], function($, TimeAgo) {

  "use strict";

  describe("TimeAgo", function() {

    var timeago,
        convertToRegExp,
        fullStrings,
        shortStrings,
        MONTH_NAMES = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

    convertToRegExp = function(hash, array) {
      var arrayOfValues = [],
          value;

      for (var key in hash) {
        value = hash[key];
        if ((typeof value === "string") && (value.length > 0)) {
          arrayOfValues.push(value.replace("%d", "").trim());
        }
      }
      if (array) { arrayOfValues = arrayOfValues.concat(array); }

      return new RegExp(arrayOfValues.join("|"));
    };

    timeago = new TimeAgo();

    fullStrings = convertToRegExp(timeago.strings.full);
    shortStrings = convertToRegExp(timeago.strings.short, MONTH_NAMES);

    beforeEach(function() {
      loadFixtures("timeago.html");
      timeago = new TimeAgo();
    });

    describe("Initialisation", function() {

      it("should be defined", function() {
        expect(timeago).toBeDefined();
      });

      it("should find all elements", function() {
        expect(timeago.$fullTimeagos.length).toEqual(1);
        expect(timeago.$responsiveTimeagos.length).toEqual(1);
      });
    });

    describe("Screen width > breakpoint", function() {

      beforeEach(function() {
        spyOn(timeago, "_isAboveBreakpoint").and.returnValue(true);
        timeago.updateAll();
      });

      it("each occurence should have full strings", function() {
        expect($(".js-timeago").text()).toMatch(fullStrings);
        expect($(".js-timeago-full").text()).toMatch(fullStrings);
      });
    });

    describe("Screen width < breakpoint", function() {

      beforeEach(function() {
        spyOn(timeago, "_isAboveBreakpoint").and.returnValue(false);
        timeago.updateAll();
      });

      it("should have full strings if selector is '.js-timeago-full'", function() {
        expect($(".js-timeago-full").text()).toMatch(fullStrings);
      });

      it("should have short strings if selector is '.js-timeago'", function() {
        // shortStrings regexp matches full strings AND short strings
        // cause (beside month names) it contains single characters only.
        // These two tests make sure the match is right.
        expect($(".js-timeago").text()).not.toMatch(fullStrings);
        expect($(".js-timeago").text()).toMatch(shortStrings);
      });

      describe("Timestamp is older than 1 month", function() {

        beforeEach(function() {
          spyOn(Date, "now").and.returnValue(1423954800000); // 2015.02.15 00:00
        });

        it("should return correct month name", function() {
          var monthName = timeago._getMonthName(null, 3024000000); // 35 days
          expect(monthName).toBe("Jan");
        });

        it("should return correct year", function() {
          var fullYear = timeago._getFullYear(null, 31968000000); // 370 days
          expect(fullYear).toBe("2014");
        });

      });
    });
  });
});
