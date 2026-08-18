import { Clock, Package, IndianRupee } from "lucide-react";

interface DestinationAtAGlanceProps {
  totalPackages: number;
  durationRange?: string | null;
  priceFrom?: string | null;
}

// Reference-style fact strip for destination/category pages: what this
// destination offers at a glance. Values are derived from the real catalog —
// never invented (nulls render as "On request").
export default function DestinationAtAGlance({
  totalPackages,
  durationRange,
  priceFrom,
}: DestinationAtAGlanceProps) {
  const rows: { icon: React.ReactNode; label: string; value: string }[] = [
    {
      icon: <Package className="w-4 h-4 text-legacy-orange" />,
      label: "Curated Tour Packages",
      value: `${totalPackages}`,
    },
    {
      icon: <Clock className="w-4 h-4 text-legacy-orange" />,
      label: "Tour Duration",
      value: durationRange || "On request",
    },
    {
      icon: <IndianRupee className="w-4 h-4 text-legacy-orange" />,
      label: "Starting Price",
      value: priceFrom ? `From ${priceFrom}` : "On request",
    },
  ];

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
          Destination at a Glance
        </h2>
      </div>
      <dl className="divide-y divide-gray-100">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-6 px-5 py-3">
            <dt className="flex items-center gap-2 text-[13px] text-gray-500 shrink-0">
              {row.icon}
              {row.label}
            </dt>
            <dd
              className={`text-[13px] font-semibold text-right ${
                row.value === "On request"
                  ? "text-gray-400 italic font-normal"
                  : "text-gray-800"
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
