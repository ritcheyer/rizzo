window.lp = {
  supports: {
    transform: {
      css: ""
    },
    localStorage: true
  },
  analytics: {
    api: {
      trackEvent: function() {}
    }
  },
  isMobile: false,
  getCookie: function() {},
};

require.config({
  paths: {
    picker: "vendor/assets/javascripts/pickadate/lib/picker"
  }
});
