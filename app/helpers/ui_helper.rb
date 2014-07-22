module UiHelper

  def ui_alert_classes(properties, classes = [])
    classes.push(properties[:lined] ? "alert--lined" : "alert--block")
    classes.push("icon--#{alert_class_mapping[:"#{properties[:type].downcase}"]}--before")
    classes.push("alert--#{properties[:type].downcase}").join(" ")
  end

  private

  def alert_class_mapping
    {
      success: "tick",
      error: "cross",
      warning: "caution",
      announcement: "loudspeaker"
    }
  end

end
