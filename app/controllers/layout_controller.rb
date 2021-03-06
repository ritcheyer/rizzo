class LayoutController < ActionController::Base

  layout nil

  include LayoutSupport

  def snippet
    render "layouts/custom/_#{params[:snippet]}", locals: get_layout_config(params[:route])
  end

  def preview
    @fixed_width_layout = true if params[:route] == "fixed-width"

    layout_details = get_layout(params[:route])
    render layout_details[:template], layout: layout_details[:layout], locals: get_layout_config(params[:route])
  end

end
