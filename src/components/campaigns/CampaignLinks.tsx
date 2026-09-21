import Link from "next/link";

const campaigns = [
  {
    name: "Himachal Tour Packages",
    slug: "himachal-tour-packages",
    description: "Shimla, Manali, Dharamshala tours",
    icon: "🏔️",
    color: "green"
  },
  {
    name: "Chardham Yatra",
    slug: "chardham-yatra", 
    description: "Sacred pilgrimage to 4 holy sites",
    icon: "🙏",
    color: "orange"
  },
  {
    name: "Dubai Tour Packages",
    slug: "dubai-tour-packages",
    description: "Luxury Dubai travel experiences",
    icon: "🏙️",
    color: "blue"
  },
  {
    name: "Nainital Holiday",
    slug: "nainital-holiday",
    description: "Lake district hill station tours",
    icon: "🌅",
    color: "teal"
  },
  {
    name: "Buddhist Tours India",
    slug: "buddhist-tours-india",
    description: "Buddhist pilgrimage circuits",
    icon: "🕉️",
    color: "amber"
  },
  {
    name: "Helicopter Tours India",
    slug: "helicopter-tours-india",
    description: "Helicopter pilgrimage & adventure",
    icon: "🚁",
    color: "sky"
  },
  {
    name: "Shimla Honeymoon",
    slug: "shimla-honeymoon",
    description: "Romantic honeymoon packages",
    icon: "❤️",
    color: "pink"
  },
  {
    name: "Dehradun Adventure",
    slug: "dehradun-adventure",
    description: "Adventure sports & activities",
    icon: "🎯",
    color: "orange"
  }
];

const colorClasses = {
  green: "hover:bg-green-50 border-green-200",
  orange: "hover:bg-orange-50 border-orange-200", 
  blue: "hover:bg-blue-50 border-blue-200",
  teal: "hover:bg-teal-50 border-teal-200",
  amber: "hover:bg-amber-50 border-amber-200",
  sky: "hover:bg-sky-50 border-sky-200",
  pink: "hover:bg-pink-50 border-pink-200",
};

interface CampaignLinksProps {
  layout?: "grid" | "list" | "compact";
  limit?: number;
  title?: string;
  showDescription?: boolean;
}

export default function CampaignLinks({ 
  layout = "grid", 
  limit = campaigns.length,
  title = "Popular Campaigns",
  showDescription = true 
}: CampaignLinksProps) {
  const displayCampaigns = campaigns.slice(0, limit);

  if (layout === "list") {
    return (
      <div className="campaign-links-list">
        {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
        <ul className="space-y-2">
          {displayCampaigns.map((campaign) => (
            <li key={campaign.slug}>
              <Link 
                href={`/campaigns/${campaign.slug}`}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${colorClasses[campaign.color as keyof typeof colorClasses]}`}
              >
                <span className="text-2xl">{campaign.icon}</span>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900">{campaign.name}</span>
                  {showDescription && (
                    <p className="text-sm text-gray-600">{campaign.description}</p>
                  )}
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (layout === "compact") {
    return (
      <div className="campaign-links-compact">
        {title && <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-gray-500">{title}</h3>}
        <div className="flex flex-wrap gap-2">
          {displayCampaigns.map((campaign) => (
            <Link 
              key={campaign.slug}
              href={`/campaigns/${campaign.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
            >
              <span>{campaign.icon}</span>
              <span>{campaign.name}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Default grid layout
  return (
    <div className="campaign-links-grid">
      {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {displayCampaigns.map((campaign) => (
          <Link 
            key={campaign.slug}
            href={`/campaigns/${campaign.slug}`}
            className={`p-4 rounded-lg border text-center transition-all hover:shadow-md ${colorClasses[campaign.color as keyof typeof colorClasses]}`}
          >
            <span className="text-3xl block mb-2">{campaign.icon}</span>
            <span className="font-semibold text-gray-900 text-sm block">{campaign.name}</span>
            {showDescription && (
              <p className="text-xs text-gray-600 mt-1">{campaign.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}