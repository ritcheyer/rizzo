require 'browser_support'
require 'host_support'

module GlobalResourcesHelper
  include BrowserSupport, HostSupport, IpSupport

  def primary_navigation_items
    [
      {style:'home', title:'Home', uri: www_url},
      {style:'destinations', title:'Destinations', uri: www_url("destinations")},
      {style:'themes', title:'Themes', uri: www_url("themes")},
      {style:'forum', title:'Thorn Tree forum', uri: www_url("thorntree")},
      {style:'shop', title:'Shop', uri: shop_url},
      {style:'hotels', title:'Hotels', uri: www_url("hotels")},
      {style:'flights', title:'Flights', uri: www_url("bookings/flights.do")},
      {style:'insurance', title:'Insurance', uri: www_url("bookings/insurance.do")}
    ]
  end

  def core_navigation_items
    [
      {
        title:'Search',
        slug: "http://www.lonelyplanet.com/search",
        icon_class: "icon--search--before icon--white--before",
        extra_class: "wv--hidden"
      },
      {title:'Destinations',
        slug: "http://www.lonelyplanet.com/destinations",
        icon_class: "icon--place--pin--line--before icon--white--before",
        submenu: [
          {title:'Africa', slug:'http://www.lonelyplanet.com/africa'},
          {title:'Antarctica', slug:'http://www.lonelyplanet.com/antarctica'},
          {title:'Asia', slug:'http://www.lonelyplanet.com/asia'},
          {title:'Caribbean', slug:'http://www.lonelyplanet.com/caribbean'},
          {title:'Central America', slug:'http://www.lonelyplanet.com/central-america'},
          {title:'Europe', slug:'http://www.lonelyplanet.com/europe'},
          {title:'Middle East', slug:'http://www.lonelyplanet.com/middle-east'},
          {title:'North America', slug:'http://www.lonelyplanet.com/north-america'},
          {title:'Pacific', slug:'http://www.lonelyplanet.com/pacific'},
          {title:'South America', slug:'http://www.lonelyplanet.com/south-america'}
        ]
      },
      {title:'Interests',
        slug: 'http://www.lonelyplanet.com/interests',
        icon_class: 'icon--adventure-travel--before icon--white--before',
        submenu: [
          {title:'Adventure travel', slug:'http://www.lonelyplanet.com/adventure-travel', style:'adventure-travel', icon_class: 'icon--adventure-travel--before'},
          {title:'Beaches', slug:'http://www.lonelyplanet.com/beaches', style:'beaches', icon_class: 'icon--beaches--before'},
          {title:'Budget travel', slug:'http://www.lonelyplanet.com/budget-travel', style:'budget-travel', icon_class: 'icon--budget-travel--before'},
          {title:'Coasts and islands', slug:'http://www.lonelyplanet.com/coasts-and-islands', style:'coasts-and-islands', icon_class: 'icon--coasts-and-islands--before'},
          {title:'Family travel', slug:'http://www.lonelyplanet.com/family-travel', style:'family-travel', icon_class: 'icon--family-travel--before'},
          {title:'Festivals and events', slug:'http://www.lonelyplanet.com/festivals-and-events', style:'festivals-and-events', icon_class: 'icon--festivals-and-events--before'},
          {title:'Food and drink', slug:'http://www.lonelyplanet.com/food-and-drink', style:'food-and-drink', icon_class: 'icon--food-and-drink--before'},
          {title:'Honeymoons and romance', slug:'http://www.lonelyplanet.com/honeymoons-and-romance', style:'honeymoons-and-romance', icon_class: 'icon--honeymoons-and-romance--before'},
          {title:'Luxury travel', slug:'http://www.lonelyplanet.com/luxury-travel', style:'luxury-travel', icon_class: 'icon--luxury-travel--before'},
          {title:'Round the world travel', slug:'http://www.lonelyplanet.com/round-the-world-travel', style:'round-the-world-travel', icon_class: 'icon--round-the-world-travel--before'},
          {title:'Wildlife and nature', slug:'http://www.lonelyplanet.com/wildlife-and-nature', style:'wildlife-and-nature', icon_class: 'icon--wildlife-and-nature--before'}
        ]
      },
      {title:'Shop', slug: "http://shop.lonelyplanet.com", icon_class: "icon--shop-basket--line--before icon--white--before"},
      {title:'Thorn Tree Forum', slug: "http://www.lonelyplanet.com/thorntree", icon_class: "icon--comment--line--before icon--white--before"},
      {title:'Bookings',
        slug: 'http://www.lonelyplanet.com/hotels/',
        icon_class: 'icon--flights--line--before icon--white--before',
        submenu: [
          {title:'Hotels', slug:'http://www.lonelyplanet.com/hotels', style:'hotels', icon_class: 'icon--hotel--before'},
          {title:'Flights', slug:'http://www.lonelyplanet.com/flights/', style:'flights', icon_class: 'icon--flights--before'},
          {title:'Car rental', slug:'http://www.lonelyplanet.com/car-rental/', style:'car-rental', icon_class: 'icon--car--before'},
          {title:'Adventure tours', slug:'http://www.lonelyplanet.com/adventure-tours/', style:'adventure-tours', icon_class: 'icon--tour--before'},
          {title:'Sightseeing tours', slug:'http://www.lonelyplanet.com/sightseeing-tours/', style:'sightseeing-tours', icon_class: 'icon--activity--before'},
        ]
      },
      {title:'Insurance', slug: "http://www.lonelyplanet.com/travel-insurance", icon_class: 'icon--insurance--line--before icon--white--before'}
    ]
  end

  def user_navigation_items
    {
      my_account: {
        title:'My account',
        slug: "https://www.lonelyplanet.com/thorntree/my_account",
        icon_class: "icon--user--line--before icon--white--before"
      },

      signed_in_links: [
        {
          title: "My profile",
          slug: "https://www.lonelyplanet.com/thorntree/profiles/{{profileSlug}}",
          icon_class: "icon--user--before icon--white--before"
        },
        {
          title: "Settings",
          slug: "https://www.lonelyplanet.com/thorntree/forums/settings",
          icon_class: "icon--settings--before icon--white--before"
        },
        {
          title: "My profile",
          slug: "https://www.lonelyplanet.com/thorntree/profiles/{{profileSlug}}/messages",
          icon_class: "icon--envelope--before icon--white--before"
        },
        {
          title: "My profile",
          slug: "https://www.lonelyplanet.com/thorntree/profiles/{{profileSlug}}/activities",
          icon_class: "icon--comment--before icon--white--before"
        },
        {
          title: "Sign out",
          slug: "https://auth.lonelyplanet.com/users/sign_out",
          icon_class: "icon--sign-out--before icon--white--before"
        }
      ],
      signed_out_links: [
        {
          title: "Sign in",
          slug: "https://auth.lonelyplanet.com/users/sign_in",
          icon_class: "icon--user--before icon--white--before",
          analytics: {
            category: "account",
            action: "sign-in"
          }
        },
        {
          title: "Join",
          slug: "https://auth.lonelyplanet.com/users/sign_up",
          icon_class: "icon--sign-in--before icon--white--before",
          analytics: {
            category: "account",
            action: "join"
          }
        }
      ]
    }
  end

  def default_breadcrumbs
    [
      {:place=>"South America", :slug=>"south-america"},
      {:place=>"Argentina", :slug=>"argentina"},
      {:place=>"Buenos Aires", :slug=>"buneos-aires"},
      {:place=>"Buenos Aires Hotels", "slug"=>nil}
    ]
  end

  def cart_item_element
    capture_haml do
      haml_tag(:a, 'Cart: 0', class: 'nav__item--cart js-user-cart', href: 'http://shop.lonelyplanet.com/cart/view')
    end
  end

  def membership_item_element
    capture_haml do
      haml_tag(:div, class: 'nav__item--user js-user--nav')
    end
  end

  def show_arrow(style)
    if style=='destinations' ||  style=='destinations current'
      capture_haml do
        haml_tag(:span, class: 'arrow')
      end
    end
  end

  def place_heading(title, section_name, slug, parent, parent_slug, no_place_link = false)

    capture_haml do
      haml_tag(:div, class: 'place-title icon--destination-flag--before') do
        if no_place_link == true
          haml_tag(:span, class: 'place-title-heading') do
            haml_concat(title)
          end
        else
          haml_tag(:a, class: 'place-title-heading', href: "/#{slug}") do
            haml_concat(title)
          end
        end
        unless section_name.nil?
          haml_tag(:span, class: 'accessibility') do
            haml_concat(" " + section_name)
          end
        end
        unless parent.nil?
          haml_tag(:a, class: 'place-title__parent', href: "/#{parent_slug}") do
            haml_concat(", " + parent)
          end
        end
      end
    end
  end

  def dns_prefetch_for(links)
    capture_haml do
      links.each do |link|
        haml_tag(:link, rel: "dns-prefetch", href: "//#{link}")
      end
    end
  end
end
