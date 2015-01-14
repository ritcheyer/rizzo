require([ "public/assets/javascripts/lib/utils/throttle.js" ], function(throttle) {

  describe("Throttle", function() {

    var interval;

    afterEach(function() {
      clearInterval(interval);
    });

    it("Should return a function", function() {
      var result = throttle(new Function, 200)
      expect(typeof result).toBe("function");
    });

    it("Should execute callback only once per wait time", function() {
      var instance,
          bounceInc = 0,
          callbackInc = 0;

      runs(function() {
        instance = throttle(function() {
          callbackInc++;
        }, 20);

        function bounce() {
          bounceInc++;
          instance();
        };

        interval = setInterval(bounce, 10);
      });

      waitsFor(function() {
        return bounceInc === 6;
      }, "Callback should be bounced", 100);

      runs(function() {
        expect(callbackInc).toBe(2);
      });

    });

    it("Should apply callback with arguments", function() {
      var instance, callback;

      runs(function() {
        callback = jasmine.createSpy();
        instance = throttle(callback, 10);
        instance("foo", "bar");
      });

      waitsFor(function() {
        return callback.wasCalled;
      }, "Callback should be executed", 20);

      runs(function() {
        expect(callback).toHaveBeenCalledWith("foo", "bar");
      });

    });

    it("Should apply callback with a given scope", function() {
      var instance, callback, scope,
          callbackInc = 0,
          callbackProp = false;

      runs(function() {
        scope = {
          prop: "change me"
        };

        callback = function(changeTo) {
          callbackInc++;
          callbackProp = true;
          this.prop = changeTo;
        }

        instance = throttle(callback, 10, scope);

        instance("changed");
      });

      waitsFor(function() {
        return callbackInc === 1;
      }, "Callback should be executed", 20);

      runs(function() {
        expect(callbackProp).toBe(true);
        expect(scope.prop).toBe("changed");
      });
    });

  });

});
