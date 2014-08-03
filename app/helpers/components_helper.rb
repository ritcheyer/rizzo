module ComponentsHelper

  def property(key)
    @properties.has_key? key and @properties[key]
  end

  def mustache_section(key: key, content: '', prefix: '#', invert: false)
    # prefix = invert ? '^' : '#'
    "{{#{prefix}#{key}}}#{content}{{/#{key}}}"
  end

  def build_mustache_sections(key: nil, content: nil, invert_content: nil)
    (content ? mustache_section(key: key, content: content) : '') +
      (invert_content ? mustache_section(key: key, content: invert_content, prefix: '^') : '')
  end

  # instead of the ugly lambda based then: -> do end, else: do end system
  # perhaps it would be preferable to define if_property and else_property
  # functions. wouldn't that make the code simpler all over?
  # could get rid of build_mustache_sections too and just set invert on
  # the mustache_section method.
  def if_property(key, branch={then: nil, else: nil}, &then_block)
    if branch[:then]
      then_block = branch[:then]
      else_block = branch[:else]
    end

    if @properties[key] and @properties.has_key? key
      then_block and capture_haml{then_block.call @properties[key]}
    elsif @properties[key]
      content = capture_haml(&then_block) if then_block
      invert_content = capture_haml(&else_block) if else_block
      build_mustache_sections(key: key, content: content, invert_content: invert_content)
    else
      capture_haml(&else_block) if else_block
    end
  end

  def each_over_property(key, &block)
    if @properties[key] and @properties.has_key? key
      @properties[key].each(&block)
      return
    elsif @properties[key]
      content = capture_haml{block.call mustache_hash}
      build_mustache_sections(key: key, content: content)
    end
  end

  # this is unused.
  # it would mean changing the data hash to an array of key, value hashes.
  # a choice between less handsome code and less powerful mustache, or
  # mustache data and server data not being the same
  def data_property
    if @properties[:data] and @properties.has_key? :data
      {
        data: @properties[:data]
      }
    elsif @properties[key]
      content = "{{#{key}}}='{{#{value}}}'"
      build_mustache_sections(key: key, content: content)
    end
  end
end
