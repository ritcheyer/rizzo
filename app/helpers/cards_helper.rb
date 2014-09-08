module CardsHelper

  def card_classes(props)
    [
      "card",
      "js-card",
      "card--#{props[:kind]}",
      "card--#{props[:short?] ? 'short' : 'tall'}",
      "card--#{props[:fixed?] ? 'fixed' : 'flexible'}",
      "card--#{props[:cover?] ? 'cover' : 'standard'}",
      "card--#{props[:double?] ? 'double' : 'single'}",
      "card--#{props[:tags] && !props[:tags].empty? ? 'has-tags' : 'no-tags'}",
      "card--#{props[:image_url] && !props[:image_url].empty? ? 'has-img' : 'no-img'}",
      "card--#{props[:button_text] || props[:author_name] || props[:post_date] ? 'has-footer' : 'no-footer'}"
    ]
  end

  def card_tracking_data(props)
    if props[:tracking] && props[:tracking][:label]
      HashWithIndifferentAccess.new(
        lpa_category: props[:tracking][:category],
        lpa_action: props[:tracking][:action],
        lpa_label: props[:tracking][:label]
      )
    end
  end

  def card_icon(props)
    case props[:kind]
    when 'need-to-know'
      return 'information'
    end

    props[:kind]
  end

  def card_link_if(condition, *props)
    if condition
      haml_tag(:a, *props){ yield }
    else
      yield
    end
  end

  def card_datetime(date_str)
    date_str.to_date.strftime("%d %B %Y")
  end

end
