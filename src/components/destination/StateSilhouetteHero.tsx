import Link from "next/link";
import type { CSSProperties } from "react";
import type { ExplorerProfile, ExplorerMapMarker } from "@/data/destinationExplorer";
import { projectDestination } from "@/utils/stateMapProjection";
import { isFullStateArtwork } from "@/data/stateArtwork";
import ConvertedPrice from "@/components/currency/ConvertedPrice";
import StateMotif from "./StateMotif";

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
  // Identity-only artworks have no validated boundary geometry: the map hero
  // is omitted entirely and the page falls back to the discovery canvas.
  if (!artwork || !isFullStateArtwork(artwork)) return null;

  const { geometry } = artwork;
  const identity = artwork.identity;
  const responsiveMapVars = {
    "--state-tablet-hero-height": `${artwork.layout?.tabletHeroHeight ?? 760}px`,
    "--state-tablet-map-top": `${artwork.layout?.tabletMapTop ?? 152}px`,
    "--state-accent": identity.accent,
    "--state-accent-ink": identity.ink,
  } as CSSProperties;
  const mapId = `${artwork.id}-boundary`;
  const hasDistrictMosaic = Boolean(artwork.districts?.length);
  const projectedMarkers = markers.map((marker) => ({ ...marker, point: projectDestination(marker.latitude, marker.longitude, geometry.projection) }));

  return <section className="overflow-hidden border-b border-[#d7e0da] bg-[#f6f5ee] text-[#103a33]">
    <div className="mx-auto max-w-[1440px] px-4 pb-5 pt-4 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-2 text-xs text-[#587069]"><Link href="/" className="hover:text-[#164b40]">Home</Link><span>›</span><Link href="/destinations" className="hover:text-[#164b40]">Destinations</Link><span>›</span><strong className="text-[#164b40]">{title}</strong></div>
      <div className="relative isolate overflow-hidden rounded-[28px] bg-[#082f2a] shadow-[0_24px_56px_rgba(8,47,42,.20)]">
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: `linear-gradient(115deg, rgba(1,27,24,.94), rgba(4,58,50,.50)), url(${artwork.background})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        {artwork.motif && <StateMotif motif={artwork.motif} className="absolute inset-0 z-[5] h-full w-full text-[color-mix(in_srgb,var(--state-accent)_24%,transparent)] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />}
        <div className="relative min-h-[610px] px-5 pb-5 pt-6 sm:min-h-[var(--state-tablet-hero-height)] sm:px-9 sm:pt-9 lg:min-h-[670px]" style={responsiveMapVars}>
          <div className="relative z-20 max-w-[390px] text-white"><p className="text-[10px] font-black uppercase tracking-[.28em] text-[var(--state-accent)]">{profile.eyebrow}</p><h1 className="font-display mt-2 text-4xl font-bold tracking-[-.055em] sm:text-6xl">{title}</h1><p className="mt-2 text-sm font-semibold text-white/88">{artwork.themes}</p><p className="mt-2 text-xs text-white/70">{packageCount} packages · {profile.geography?.districtCount || profile.places.length} districts · {startingPrice ? <>From ₹{startingPrice.toLocaleString("en-IN")}{" "}{/* Indicative conversion for non-INR display currency; renders nothing while INR is selected (PR #55 pattern). */}<ConvertedPrice amountInr={startingPrice} className="font-semibold text-white/60" /></> : "Tailored prices"}</p></div>
          <div className="absolute inset-x-0 bottom-[46px] top-[118px] z-10 sm:bottom-[48px] sm:top-[var(--state-tablet-map-top)] lg:bottom-[45px] lg:left-[18%] lg:right-[3%] lg:top-[24px]" aria-label={`Tourism imagery inside the accurate ${title} boundary`}>
            <div className="relative mx-auto h-full max-w-full" style={{ aspectRatio: `${geometry.width} / ${geometry.height}` }}>
            <svg className="h-full w-full overflow-visible drop-shadow-[0_26px_28px_rgba(0,0,0,.42)]" viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`${title} tourism map`}>
              <defs>
                <clipPath id={mapId}><path d={geometry.boundaryPath} /></clipPath>
                <linearGradient id={`${mapId}-wash`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#075449" stopOpacity=".14"/><stop offset=".55" stopColor="#082f58" stopOpacity=".05"/><stop offset="1" stopColor="#e19943" stopOpacity=".12"/></linearGradient>
                {artwork.districts?.map((district) => <clipPath key={district.lgdCode} id={`${mapId}-district-${district.lgdCode}`}><path d={district.path} /></clipPath>)}
                {!hasDistrictMosaic && artwork.zones.map((zone) => {
                  const x = (zone.x / 100) * geometry.width;
                  const y = (zone.y / 100) * geometry.height;
                  const width = (zone.width / 100) * geometry.width;
                  const height = (zone.height / 100) * geometry.height;
                  const fadeId = `${mapId}-${zone.id}-fade`;
                  return <mask key={fadeId} id={fadeId} maskUnits="userSpaceOnUse" x={x} y={y} width={width} height={height}><radialGradient id={`${fadeId}-gradient`} gradientUnits="userSpaceOnUse" cx={x + width / 2} cy={y + height / 2} r={Math.max(width, height) * .7}><stop offset="0" stopColor="white" stopOpacity=".96"/><stop offset=".54" stopColor="white" stopOpacity=".72"/><stop offset="1" stopColor="white" stopOpacity="0"/></radialGradient><rect x={x} y={y} width={width} height={height} fill={`url(#${fadeId}-gradient)`}/></mask>;
                })}
              </defs>
              <g clipPath={`url(#${mapId})`}>
                <rect width={geometry.width} height={geometry.height} fill="#1f6257" />
                {hasDistrictMosaic
                  ? artwork.districts?.map((district) => <g key={district.lgdCode} clipPath={`url(#${mapId}-district-${district.lgdCode})`}><image href={district.image} x={district.bounds.x} y={district.bounds.y} width={Math.max(district.bounds.width, 1)} height={Math.max(district.bounds.height, 1)} preserveAspectRatio="xMidYMid slice" /><rect x={district.bounds.x} y={district.bounds.y} width={Math.max(district.bounds.width, 1)} height={Math.max(district.bounds.height, 1)} fill="#062d29" opacity=".08" /></g>)
                  : <><image href={artwork.baseImage} width={geometry.width} height={geometry.height} preserveAspectRatio="xMidYMid slice" opacity=".82" />
                    {artwork.zones.map((zone) => <image key={zone.id} href={zone.image} x={(zone.x / 100) * geometry.width} y={(zone.y / 100) * geometry.height} width={(zone.width / 100) * geometry.width} height={(zone.height / 100) * geometry.height} preserveAspectRatio={zone.focus || "xMidYMid slice"} opacity={zone.feather || .6} mask={`url(#${mapId}-${zone.id}-fade)`} style={{ mixBlendMode: "soft-light" }} />)}</>}
                <rect width={geometry.width} height={geometry.height} fill={`url(#${mapId}-wash)`} />
              </g>
              <path d={geometry.boundaryPath} fill="none" stroke="rgba(255,255,255,.98)" strokeWidth="7" vectorEffect="non-scaling-stroke" />
              <path d={geometry.boundaryPath} fill="none" stroke="var(--state-accent)" strokeOpacity=".88" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
            {projectedMarkers.map((marker) => {
              const priority = marker.mobilePriority ?? marker.priority;
              const direction = marker.labelDirection ?? "right";
              const labelClass = direction === "left" ? "right-full top-1/2 mr-2 -translate-y-1/2 text-right" : direction === "above" ? "bottom-full left-1/2 mb-1.5 -translate-x-1/2" : direction === "below" ? "left-1/2 top-full mt-1.5 -translate-x-1/2" : "left-full top-1/2 ml-2 -translate-y-1/2";
              return <Link key={marker.slug} href={marker.href} aria-label={`Explore ${marker.name}: ${marker.packageCount} matching packages`} className={`group absolute z-20 -translate-x-1/2 -translate-y-full ${priority > 5 ? "hidden sm:block" : ""}`} style={{ left: `${(marker.point.x / geometry.width) * 100}%`, top: `${(marker.point.y / geometry.height) * 100}%` }}><span className="relative flex h-8 w-8 -rotate-45 items-center justify-center rounded-[50%_50%_50%_0] border-2 border-white bg-[var(--state-accent)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--state-accent)_22%,transparent)] transition group-hover:scale-110"><i className="h-2.5 w-2.5 rounded-full bg-[var(--state-accent-ink)] ring-2 ring-white/90" /></span><span className={`pointer-events-none absolute min-w-max rounded-md bg-[#062a25]/92 px-2 py-1 text-[10px] font-bold leading-3 text-white shadow backdrop-blur-sm transition ${priority > 5 ? "opacity-0 group-hover:opacity-100 group-focus:opacity-100" : "opacity-100"} ${labelClass}`}><b className="block">{marker.name}</b><small className="block text-[8px] font-medium text-white/72">{marker.tagline || `${marker.packageCount} packages`}</small></span></Link>;
            })}
            </div>
          </div>
          <div className="pointer-events-none absolute right-7 top-7 z-20 hidden h-12 w-12 items-center justify-center rounded-full border border-white/35 text-[9px] font-black text-white/80 sm:flex"><span className="absolute top-1">N</span><span className="absolute bottom-1">S</span><span className="absolute left-1">W</span><span className="absolute right-1">E</span><i className="h-5 w-5 rotate-45 border-l border-t border-[var(--state-accent)]" /></div>
          <p className="pointer-events-none absolute bottom-14 left-5 z-20 hidden rounded-r-full border-l-2 border-[var(--state-accent)] bg-[#062a25]/86 px-4 py-2 text-xs font-bold text-white shadow sm:block">{title} <span className="font-medium text-white/65">— more than a destination</span></p>
          {activeFilters.length > 0 && <div className="relative z-30 mt-3 flex max-w-md flex-wrap gap-2">{activeFilters.map((filter) => <Link key={filter.label} href={filter.href} className="rounded-full border border-[color-mix(in_srgb,var(--state-accent)_55%,transparent)] bg-[#062b26]/80 px-3 py-1 text-[11px] font-bold text-[color-mix(in_srgb,var(--state-accent)_70%,white)]">{filter.label} ×</Link>)}</div>}
          <nav aria-label="Trip styles" className="absolute inset-x-5 bottom-4 z-30 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:inset-x-9">{experienceLinks.map((item) => <Link key={item.label} href={item.href} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${item.active ? "border-[var(--state-accent)] bg-[var(--state-accent)] text-[var(--state-accent-ink)]" : "border-white/25 bg-[#082f2a]/65 text-white hover:bg-white/15"}`}>{item.label}</Link>)}</nav>
        </div>
      </div>
    </div>
  </section>;
}
