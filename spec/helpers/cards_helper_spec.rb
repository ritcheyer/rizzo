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
          author_name: "Joe Bloggs"
        )

        result.should include("card--has-img")
        result.should include("card--has-footer")
      end

      it "should add 'no' class names when given no content" do
        result = helper.card_classes(
          image_url: nil,
          meta_description: nil
        )

        result.should include("card--no-img")
        result.should include("card--no-footer")
      end

    end

  end

  describe "#card_tracking_data" do

    it "should return properties for given tracking hash" do
      result = helper.card_tracking_data(
        tracking: {
          category: "lodgings",
          action: "view",
          label: "/path/to/lodging"
        }
      )

      result.should eq(
        'lpa_category' => "lodgings",
        'lpa_action' => "view",
        'lpa_label' => "/path/to/lodging"
      )
    end

  end

end
