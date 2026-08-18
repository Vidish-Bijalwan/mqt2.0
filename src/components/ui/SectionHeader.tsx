/**
 * Section heading matching the reference site's `.top-head-box`:
 * centered 24px bold h2 with dotted underline + 80px orange bar,
 * optional centered subtitle below.
 */
interface SectionHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  /** Add 25px top margin (reference uses this for non-first sections) */
  marginTop?: boolean;
}

export default function SectionHeader({ title, subtitle, marginTop }: SectionHeaderProps) {
  return (
    <div className="nit-head" style={marginTop ? { marginTop: 25 } : undefined}>
      <h2>{title}</h2>
      <div className="nit-middle-hr"></div>
      {subtitle ? <p className="nit-head-sub">{subtitle}</p> : null}
    </div>
  );
}
