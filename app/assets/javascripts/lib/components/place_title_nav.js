define([
  "jquery",
  "lib/utils/template"
], function($, Template) {

  "use strict";
  function PlaceTitleNav() {
    this.$el = $(".js-place-title");

    if (!this.navItemTemplate) {
      var $template = $("#tmpl-nav-item").text();
      if (!$template) return;
      this.navItemTemplate = $template;
    }

    this.$el.length && this.navItemTemplate && this.init();
  }

  PlaceTitleNav.prototype.init = function() {
    $.each(this.$el.find(".js-place-title-nav"), function(i, el) {
      this.fetchNavItems(el);
    }.bind(this));
  };

  PlaceTitleNav.prototype.getUrl = function(menuItem) {
    return $(menuItem).attr("data-slug") + "/navitems";
  };

  PlaceTitleNav.prototype.fetchNavItems = function(menuItem) {
    $.ajax({
      url: this.getUrl(menuItem),
      dataType: "json",
      success: function(data) {
        this.renderSubMenu(menuItem, data);
      }.bind(this)
    });

  };

  PlaceTitleNav.prototype.renderSubMenu = function(menuItem, data) {
    if (data && data.length ) {
      var html = "";
      for (var i = 0; i < data.length; i++) {
        html += Template.render(this.navItemTemplate, data[i]);
      }
      $(menuItem).parent().addClass("nav__submenu__trigger")
        .find(".nav__submenu__content").prepend(html);
    }

  };

  $(document).ready(function() {
    new PlaceTitleNav;
  });

});
