module ComponentsHelper

  def property_passed(key)
    @properties.has_key? key and @property[key]
  end

  def mustache_section(key: nil, content: '', prefix: '#')
    "{{#{prefix}#{key}}}#{content}{{/#{key}}}"
  end

  def build_mustache_sections(key: nil, content: '', invert_content: '', no_invert: false)
    mustache_section(key: key, content: content) +
      (no_invert ? '' : mustache_section(key: key, content: invert_content, prefix: '^'))
  end

  # &block will return just content or
  # a hash with content for if and content for else
  def get_content(content, if_or_else)
    if content.is_a? String and if_or_else == :if
      content
    elsif content.is_a? Hash and content.has_key? if_or_else
      content[if_or_else]
    end
  end

  # this would probably all be a lot more sensible if controller passed a
  # mustache local, why would i write such wizardry as this?
  def property_predicate(check: nil, set: check, no_invert: false, &block)
    if @properties[check]
      if @properties.has_key? check
        result = yield
        content = get_content(result, :if)
        invert_content = no_invert ? "" : get_content(result, :else)
        @properties[set] = content
      elsif set == false
        # set == false non-obviously means do_not_set
        build_mustache_sections(key: check, content: capture_haml(&block), no_invert: no_invert)
      else
        result = yield
        content = get_content(result, :if)
        invert_content = no_invert ? "" : get_content(result, :else)
        @properties[set] = build_mustache_sections(key: check, content: content, invert_content: invert_content, no_invert: no_invert)
      end
    elsif @properties.has_key? check
      # we are here because the property was explicitly set to non-true
      result = yield
      content = get_content(result, :else)
      @properties[set] = content
    elsif set == false

    end
  end

  def property_each(key)
  end

end
