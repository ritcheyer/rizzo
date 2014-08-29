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
      "card--#{props[:image_url] ? 'has-img' : 'no-img'}",
      "card--#{props[:button_text] || props[:author_name] || props[:post_date] ? 'has-footer' : 'no-footer'}"
    ]
  end

end
