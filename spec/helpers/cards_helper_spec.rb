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

    describe "returns an array of content class names for the given properties" do

      it "should add 'has' class names when given content" do
        result = helper.card_classes(
          image_url: "path/to/image",
          meta_description: "Meta content",
          image_attribution: "This photo was taken by Joe Bloggs"
        )

        result.should include("card--has-img")
        result.should include("card--has-meta")
        result.should include("card--has-attribution")
      end

      it "should add 'no' class names when given no content" do
        result = helper.card_classes(
          image_url: nil,
          meta_description: nil,
          image_attribution: nil
        )

        result.should include("card--no-img")
        result.should include("card--no-meta")
        result.should include("card--no-attribution")
      end

    end

  end

end
