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
    picker: "vendor/assets/javascripts/pickadate/lib/picker",
    pickerDate: "vendor/assets/javascripts/pickadate/lib/picker.date",
    pickerLegacy: "vendor/assets/javascripts/pickadate/lib/legacy"
  }
});
