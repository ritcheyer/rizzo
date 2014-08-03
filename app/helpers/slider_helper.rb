module SliderHelper

  def lazyloadify(images)
    images[0][:slide_class] = 'is-loaded is-current'
    images[1..-1].map! do |image|
      image[:slide_class] = 'is_hidden'
      image[:image_data] = {
        class: 'slider__img',
        src: image[:src],
        alt: image[:alt]
      }
    end
 end

end
