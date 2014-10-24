require([ "public/assets/javascripts/lib/core/ad_manager" ], function(AdManager) {

  describe("Ad Manager", function() {

    var instance;

    beforeEach(function() {
      loadFixtures("ad_iframe.html");

      window.lp.getCookie = function() {
        return [];
      };
      window.Krux = {
        user: "foo",
        segments: []
      };

      instance = new AdManager({
        networkID: "xxxx",
        template: "overview",
        theme: "family-holiday",
        layers: [ "lonelyplanet", "destinations" ]
      });
    });

    afterEach(function() {
      $(".adunit").removeData("googleAdUnit adUnit");
      window.lp.getCookie = undefined;
    });

    describe("._init()", function() {

      it("Loads and instantiates jQuery DFP", function() {

        spyOn(instance, "_adCallback").andReturn(null);
        spyOn(instance, "load").andReturn(null);

        runs(function() {
          instance._init();
        });

        waitsFor(function() {
          return $.hasOwnProperty("dfp");
        }, "DFP should be loaded", 1000);

        runs(function() {
          expect(instance.load).toHaveBeenCalled();
          expect(instance.pluginConfig).toBeDefined();
        });

      });

    });

    describe(".formatKeywords()", function() {
      var config = {
        adThm: "honeymoons,world-food",
        adTnm: "overview,poi-list",
        layers: [],
        keyValues: {
          foo: "bar"
        }
      }, result;

      beforeEach(function() {
        result = instance.formatKeywords(config);
      });

      it("Should return a correctly formatted config for jQuery.dfp targeting", function() {
        expect(result.thm).toEqual(config.adThm);
        expect(result.tnm).toEqual(config.adTnm.split(","));
        expect(result.foo).toEqual(config.keyValues.foo);
      });

      it("supports krux targeting", function() {
        expect(result.ksg).toEqual(Krux.segments);
        expect(result.kuid).toEqual(Krux.user);
      });

    });

    describe(".getNetworkID()", function() {

      it("Should return the default network ID if no cookie and no URL parameter are set", function() {
        spyOn(instance, "_networkCookie").andReturn(null);
        spyOn(instance, "_networkParam").andReturn(null);
        expect(instance.getNetworkID()).toBe(9885583);
      });

      it("Should return the network ID specified in a cookie", function() {
        spyOn(instance, "_networkCookie").andReturn(123456);
        spyOn(instance, "_networkParam").andReturn(null);
        expect(instance.getNetworkID()).toBe(123456);
      });

      it("Should return the network ID specified in the URL", function() {
        spyOn(instance, "_networkCookie").andReturn(null);
        spyOn(instance, "_networkParam").andReturn(78910);
        expect(instance.getNetworkID()).toBe(78910);
      });

    });

    describe(".load()", function() {

      it("Should load all ads", function() {

        runs(function() {
          spyOn(instance, "load").andCallThrough();
        });

        waitsFor(function() {
          return instance.load.callCount > 0;
        }, "DFP should instantiate ads", 250);

        runs(function() {
          expect($(".adunit").hasClass("display-none")).toBe(true);
        });

      });

      it("Should not reload already loaded ads", function() {

        runs(function() {
          $(".adunit").data("adUnit", true);
          spyOn(instance, "_adCallback").andReturn(null);
          spyOn(instance, "load").andCallThrough();
        });

        waitsFor(function() {
          return instance.load.callCount > 0;
        }, "DFP should instantiate ads", 250);

        runs(function() {
          expect(instance._adCallback).not.toHaveBeenCalled();
        });

      });

    });

    describe(".refresh()", function() {

      it("With object parameter, should call the refresh method on ad units filtered by type", function() {
        var unit;

        function MockAdUnit(type) {
          this.type = type;
        }
        MockAdUnit.prototype.getType = function() {
          return this.type;
        };

        instance.$adunits = $([]);

        [ "leaderboard", "adSense", "mpu" ].forEach(function(type) {
          var mock = new MockAdUnit(type);
          mock.refresh = jasmine.createSpy("refresh");
          var $unit = $("<div>").data("adUnit", mock);
          instance.$adunits = instance.$adunits.add($unit);
        });

        instance.refresh({
          type: "leaderboard"
        });
        expect(instance.$adunits.eq(0).data("adUnit").refresh).toHaveBeenCalled();

        instance.refresh({
          type: "adSense"
        });
        expect(instance.$adunits.eq(1).data("adUnit").refresh).toHaveBeenCalled();

        instance.refresh({
          type: "mpu"
        });
        expect(instance.$adunits.eq(2).data("adUnit").refresh).toHaveBeenCalled();

        instance.refresh({
          type: "mpu",
          ads: { param: "new" }
        });
        expect(instance.$adunits.eq(2).data("adUnit").refresh).toHaveBeenCalledWith({ param: "new" });

        expect(instance.$adunits.eq(0).data("adUnit").refresh.callCount).toEqual(1);
        expect(instance.$adunits.eq(1).data("adUnit").refresh.callCount).toEqual(1);
        expect(instance.$adunits.eq(2).data("adUnit").refresh.callCount).toEqual(2);

      });

    });

  });

});
