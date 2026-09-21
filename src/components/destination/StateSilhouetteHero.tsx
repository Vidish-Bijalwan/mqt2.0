import Link from "next/link";
import type { ExplorerProfile, ExplorerMapMarker } from "@/data/destinationExplorer";
import { projectDestination } from "@/utils/stateMapProjection";

interface StateSilhouetteHeroProps {
  title: string;
  profile: ExplorerProfile;
  packageCount: number;
  startingPrice?: number;
  markers: Array<ExplorerMapMarker & { href: string; packageCount: number }>;
  experienceLinks: Array<{ label: string; href: string; active: boolean }>;
  activeFilters: Array<{ label: string; href: string }>;
}

export default function StateSilhouetteHero({ title, profile, packageCount, startingPrice, markers, experienceLinks, activeFilters }: StateSilhouetteHeroProps) {
  const artwork = profile.artwork;
  if (!artwork) return null;

  const { geometry } = artwork;
  const mapId = `${artwork.id}-boundary`;
  const projectedMarkers = markers.map((marker) => ({ ...marker, point: projectDestination(marker.latitude, marker.longitude, geometry.projection) }));

  return <section className="overflow-hidden border-b border-[#d7e0da] bg-[#f6f5ee] text-[#103a33]">
    <div className="mx-auto max-w-[1440px] px-4 pb-5 pt-4 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-2 text-xs text-[#587069]"><Link href="/" className="hover:text-[#164b40]">Home</Link><span>›</span><Link href="/packages" className="hover:text-[#164b40]">India</Link><span>›</span><strong className="text-[#164b40]">{title}</strong></div>
      <div className="relative isolate overflow-hidden rounded-[28px] bg-[#082f2a] shadow-[0_24px_56px_rgba(8,47,42,.20)]">
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: `linear-gradient(115deg, rgba(1,27,24,.94), rgba(4,58,50,.50)), url(${artwork.background})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_15%_20%,#d4eadf_0_1px,transparent_1px)] [background-size:30px_30px]" />
        <div className="relative min-h-[610px] px-5 pb-5 pt-6 sm:min-h-[690px] sm:px-9 sm:pt-9 lg:min-h-[670px]">
          <div className="relative z-20 max-w-[390px] text-white"><p className="text-[10px] font-black uppercase tracking-[.28em] text-[#f2ae55]">{profile.eyebrow}</p><h1 className="font-display mt-2 text-4xl font-bold tracking-[-.055em] sm:text-6xl">{title}</h1><p className="mt-2 text-sm font-semibold text-white/88">{artwork.themes}</p><p className="mt-2 text-xs text-white/70">{packageCount} packages · {profile.geography?.districtCount || profile.places.length} districts · {startingPrice ? `From ₹${startingPrice.toLocaleString("en-IN")}` : "Tailored prices"}</p></div>
          <div className="absolute inset-x-0 bottom-[46px] top-[118px] z-10 sm:bottom-[48px] sm:top-[86px] lg:bottom-[45px] lg:left-[18%] lg:right-[3%] lg:top-[24px]" aria-label={`Tourism imagery inside the accurate ${title} boundary`}>
            <div className="relative mx-auto h-full max-w-full aspect-[1000/913.22]">
            <svg className="h-full w-full overflow-visible drop-shadow-[0_26px_28px_rgba(0,0,0,.42)]" viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`${title} tourism map`}>
              <defs><clipPath id={mapId}><path d={geometry.boundaryPath} /></clipPath><filter id={`${mapId}-soft`}><feGaussianBlur stdDeviation="18" /></filter><linearGradient id={`${mapId}-wash`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#075449" stopOpacity=".24"/><stop offset=".55" stopColor="#082f58" stopOpacity=".10"/><stop offset="1" stopColor="#e19943" stopOpacity=".22"/></linearGradient></defs>
              <g clipPath={`url(#${mapId})`}>
                <rect width={geometry.width} height={geometry.height} fill="#1f6257" />
                <image href={artwork.baseImage} width={geometry.width} height={geometry.height} preserveAspectRatio="xMidYMid slice" opacity=".82" />
                {artwork.zones.map((zone) => <image key={zone.id} href={zone.image} x={(zone.x / 100) * geometry.width} y={(zone.y / 100) * geometry.height} width={(zone.width / 100) * geometry.width} height={(zone.height / 100) * geometry.height} preserveAspectRatio={zone.focus || "xMidYMid slice"} opacity={zone.feather || .65} filter={`url(#${mapId}-soft)`} />)}
                <rect width={geometry.width} height={geometry.height} fill={`url(#${mapId}-wash)`} />
              </g>
              <path d={geometry.boundaryPath} fill="none" stroke="rgba(255,255,255,.98)" strokeWidth="7" vectorEffect="non-scaling-stroke" />
              <path d={geometry.boundaryPath} fill="none" stroke="#f4b35c" strokeOpacity=".88" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
            {projectedMarkers.map((marker) => {
              const priority = marker.mobilePriority ?? marker.priority;
              const direction = marker.labelDirection ?? "right";
              const labelClass = direction === "left" ? "right-[13px] top-1/2 -translate-y-1/2 -translate-x-2 text-right" : direction === "above" ? "bottom-[18px] left-1/2 -translate-x-1/2" : direction === "below" ? "left-1/2 top-[18px] -translate-x-1/2" : "left-[13px] top-1/2 -translate-y-1/2 translate-x-2";
              return <Link key={marker.slug} href={marker.href} aria-label={`Explore ${marker.name}: ${marker.packageCount} matching packages`} className={`group absolute z-20 -translate-x-1/2 -translate-y-1/2 ${priority > 6 ? "hidden sm:block" : ""}`} style={{ left: `${(marker.point.x / geometry.width) * 100}%`, top: `${(marker.point.y / geometry.height) * 100}%` }}><span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#ec9d3f] shadow-[0_0_0_6px_rgba(236,157,63,.22)] transition group-hover:scale-110"><i className="h-2 w-2 rounded-full bg-[#09342d]" /></span><span className={`pointer-events-none absolute whitespace-nowrap rounded-md bg-[#062a25]/90 px-2 py-1 text-[10px] font-bold text-white shadow backdrop-blur-sm transition ${labelClass} ${priority > 4 ? "opacity-0 group-hover:opacity-100 group-focus:opacity-100" : "opacity-100"}`}>{marker.name}</span></Link>;
            })}
            </div>
          </div>
          {activeFilters.length > 0 && <div className="relative z-30 mt-3 flex max-w-md flex-wrap gap-2">{activeFilters.map((filter) => <Link key={filter.label} href={filter.href} className="rounded-full border border-[#f0ae57]/55 bg-[#062b26]/80 px-3 py-1 text-[11px] font-bold text-[#ffe2bb]">{filter.label} ×</Link>)}</div>}
          <nav aria-label="Trip styles" className="absolute inset-x-5 bottom-4 z-30 flex gap-2 overflow-x-auto pb-1 sm:inset-x-9">{experienceLinks.map((item) => <Link key={item.label} href={item.href} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${item.active ? "border-[#f2ae55] bg-[#f2ae55] text-[#09342d]" : "border-white/25 bg-[#082f2a]/65 text-white hover:bg-white/15"}`}>{item.label}</Link>)}</nav>
        </div>
      </div>
    </div>
  </section>;
}
