require([ "jquery", "public/assets/javascripts/lib/components/navigation_arrows.js" ], function($, NavigationArrows) {

  "use strict";

  describe("NavigationArrows", function() {

    var stub = {
          callback: jasmine.createSpy("callback"),
          previous: {
            title: "Foo",
            content: "Some bar",
            url: "/foo",
            imageUrl: "/bar.jpg"
          },
          next: {
            title: "Baz",
            content: "Other qoo",
            url: "/baz",
            imageUrl: "/qoo.jpg"
          }
        },
        noTooltipStub = {
          next: {
            url: "/qux"
          }
        };

    beforeEach(function() {
      loadFixtures("navigation_arrows.html");
      window.NavigationArrows = new NavigationArrows(stub);
    });

    describe("Initialisation", function() {

      it("is defined", function() {
        expect(NavigationArrows).toBeDefined();
      });

      it("appends the arrows to the given controls container", function() {
        expect($(".js-navigation-controls .js-navigation-arrow").length).toBe(2);
      });

      it("appends the tooltips", function() {
        expect($(".js-navigation-arrow-tooltip").length).toBe(2);
      });

    });

    describe("Events", function() {

      it("handles clicking on the arrows", function() {
        $(".js-navigation-arrow-next").trigger("click");
        expect(stub.callback).toHaveBeenCalled();
      });

    });

    describe("Tooltips", function() {

      it("didn't add the tooltip if not applicable", function() {
        window.NavigationArrows.update(noTooltipStub);
        expect($(".js-navigation-arrow-tooltip").length).toBe(0);
      });

      it("added the tooltip when there's a title", function() {
        window.NavigationArrows.update($.extend({}, noTooltipStub.next, { title: "Foo" }));
        expect($(".js-navigation-arrow-tooltip").length).toBe(1);
        expect($(".js-navigation-arrow-tooltip").html()).toContain("Foo");
      });

      it("added the tooltip when there's content", function() {
        window.NavigationArrows.update($.extend({}, noTooltipStub.next, { content: "Some bar" }));
        expect($(".js-navigation-arrow-tooltip").length).toBe(1);
        expect($(".js-navigation-arrow-tooltip").html()).toContain("Some bar");
      });

      it("added the tooltip when there's an image", function() {
        window.NavigationArrows.update($.extend({}, noTooltipStub.next, { imageUrl: "/bar.jpg" }));
        expect($(".js-navigation-arrow-tooltip").length).toBe(1);
        expect($(".js-navigation-arrow-tooltip").html()).toContain("src=\"/bar.jpg\"");
      });

    });

    describe("Updating", function() {

      it("updates the urls", function() {
        window.NavigationArrows.update(stub);
        expect($(".js-navigation-arrow-next").attr("href")).toBe(stub.next.url);
        expect($(".js-navigation-arrow-previous").attr("href")).toBe(stub.previous.url);
      });

      it("hides the arrow when necessary", function() {
        window.NavigationArrows.update({ next: stub.next });
        expect($(".js-navigation-arrow-previous")).toHaveClass("is-hidden");
      });

    });
  });
});
