require "rizzo/version"
require "rizzo/url_encryptor"

module Rizzo::Assets

  def self.precompile
    [
      'common_core.css',
      'common_core_ie.css',
      'common_core_no_font.css',
      'common_core_no_font_ie.css',
      'common_core_overrides.css',
      'common_core_overrides_ie.css',
      'omniture/s_code.js',
      'prism.js',
      'prism.css',
      'icons/active.css',
      'icons/critical.css',
      'fonts.css',
      'styleguide.css',
      'requirejs/require.js',
      'd3/d3.js',
      'nvd3/nv.d3.js',
      'nvd3/nv.d3.min.css'
    ]
  end

  def self.precompile_as_engine
    [
      'common_core_no_font.css',
      'common_core_no_font_ie.css',
      'omniture/s_code.js',
      'requirejs/require.js',
      'icons/active.css',
      'icons/critical.css',
      "fonts.css",
      "fonts_woff2.css"
    ]
  end

end
