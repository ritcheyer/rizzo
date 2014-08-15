require 'spec_helper'

describe CardsHelper do

  describe "#card_classes" do

    it "returns an array of structural class names for the given properties" do
      result = helper.card_classes(
        double?: true,
        cover?: true,
        kind: "article"
      )

      result.should include("card--double")
      result.should include("card--cover")
      result.should include("card--article")

      result = helper.card_classes(
        short?: true,
        cover?: true,
        fixed?: true
      )

      result.should include("card--single")
      result.should include("card--short")
      result.should include("card--fixed")
    end

    it "returns an array of content class names for the given properties" do
      result = helper.card_classes(
        image_url: "path/to/image",
        meta_description: "Meta content"
      )

      result.should include("card--has-img")
      result.should include("card--has-meta")
    end

  end

end
