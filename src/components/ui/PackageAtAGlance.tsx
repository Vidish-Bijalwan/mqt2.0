import { Clock, MapPin, Route, Tag } from "lucide-react";

interface PackageAtAGlanceProps {
  duration?: string;
  routeDisplay?: string;
  startPoint?: string;
  endPoint?: string;
  category?: string;
}

// The reference site (Namaste India) opens every package with a compact
// "Tour Gallery / At a Glance" fact table: Duration, Route, Start/End points,
// category. Missing fields render as "On request" — we never invent data.
export default function PackageAtAGlance({
  duration,
  routeDisplay,
  startPoint,
  endPoint,
  category,
}: PackageAtAGlanceProps) {
  const hasRoute = !!routeDisplay;

  const rows: { icon: React.ReactNode; label: string; value: string }[] = [
    ...(duration && duration.toLowerCase() !== "on request" ? [{
      icon: <Clock className="w-4 h-4 text-legacy-orange" />,
      label: "Tour Duration",
      value: duration,
    }] : []),
    ...(hasRoute && startPoint && startPoint.toLowerCase() !== "on request" ? [{
      icon: <MapPin className="w-4 h-4 text-legacy-orange" />,
      label: "Starting Point",
      value: startPoint,
    }] : []),
    ...(hasRoute && endPoint && endPoint.toLowerCase() !== "on request" ? [{
      icon: <MapPin className="w-4 h-4 text-legacy-orange" />,
      label: "Ending Point",
      value: endPoint,
    }] : []),
    ...(hasRoute && routeDisplay.toLowerCase() !== "on request" ? [{
      icon: <Route className="w-4 h-4 text-legacy-orange" />,
      label: "Places Covered",
      value: routeDisplay,
    }] : []),
    ...(category ? [{
      icon: <Tag className="w-4 h-4 text-legacy-orange" />,
      label: "Tour Category",
      value: category,
    }] : []),
  ];

  if (rows.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden my-6">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
          Tour at a Glance
        </h3>
      </div>
      <dl className="divide-y divide-gray-100">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-6 px-5 py-3"
          >
            <dt className="flex items-center gap-2 text-[13px] text-gray-500 shrink-0">
              {row.icon}
              {row.label}
            </dt>
            <dd
              className={`text-[13px] font-semibold text-right capitalize ${
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
