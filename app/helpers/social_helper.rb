module SocialHelper
  def tweetify(args = {})
    max_length = args[:max_length] || 140
    short_url_length = args[:short_url_length] || 25

    title = args[:title] || ''
    emission = '...'
    url = args[:url] || 'http://www.lonelyplanet.com'
    suffix = args[:suffix] || 'via @lonelyplanet'

    title = truncate(title, length: max_length - short_url_length - suffix.length - emission.length - 2, separator: ' ', emission: emission)

    out = "#{title} #{url} #{suffix}"

    if (hashtags = args[:hashtags]).is_a?(Array) && hashtags.any?
      out += "&hashtags=#{hashtags.join(',')}"
    end
    out.strip
  end
end
