module Sass::Script::Functions
  def shopify_asset_url(string)
    assert_type string, :String
    Sass::Script::String.new("{{'#{string.value}' | asset_url}}")
  end

  def shopify_exp(string)
  	 assert_type string, :String
  	 Sass::Script::String.new("{{#{string.value}}}")
  end
end