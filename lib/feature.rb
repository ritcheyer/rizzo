module Feature

  def self.active?(name)
    ENV["FEATURE_#{name.upcase}"].to_s == 'true'
  end
end
