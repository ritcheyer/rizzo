class ResrcIt

  attr_reader :original_height, :original_width

  def service_url
    '//images-resrc.staticlp.com/'
  end

  def generated_url
    "#{service_url}#{self.operations_to_resrc_string}/#{@src}"
  end

  def initialize(opts={}, src)
    @src = src
    @operations = opts[:operations]
    operations << {op: :optimize, quality: opts[:quality]} if opts[:quality]
  end

  def operations
    @operations ||= []
  end

  def crop(opts)
    new_format = self.dup
    new_format.operations << default_crop.merge(opts).merge(op: :crop)
    new_format
  end

  def default_crop
    { x_offset: 0, y_offset: 0 }
  end

  def optimize(opts)
    new_format = self.dup
    new_format.operations << opts.merge(op: :optimize)
    new_format
  end

  def resize(opts)
    new_format = self.dup
    new_format.operations << opts.merge(op: :resize)
    new_format
  end

  def square_crop
    new_format = self.dup
    new_format.operations << {op: :square_crop}
    new_format
  end

  def aspect_ratio(opts)
    new_format = self.dup
    new_format.operations << opts.merge(op: :aspect_ratio)
    new_format
  end

  def valid?
    errors.blank?
  end

  def errors
    errors = operations.inject([]) do |result, operation|
      if operation[:op] == :crop && ( operation[:width].to_i < 1 || operation[:height] < 1 )
        message = ['Crop']
        message << 'cannot have a width or height of zero.'
        result << message.join(' ')
      end
      result
    end
    errors.join(' ')
  end

  def operations_to_resrc_string
    operations.map do |op|
      case op[:op]
        when :crop
          "C=W#{op[:width]},H#{op[:height]},X#{op[:x_offset]},Y#{op[:y_offset]}"
        when :resize
          params = []
          params << "W#{op[:width]}" if op[:width]
          params << "H#{op[:height]}" if op[:height]
          params << "U" if op[:upscale]
          "S=#{params.join(',')}"
        when :optimize
          "O=#{op[:quality]}"
        when :square_crop
          "C=SQ"
        when :aspect_ratio
          "C=AR#{op[:ratio]}"
      end
    end.join('/')
  end
  alias_method :to_resrc, :operations_to_resrc_string

end
