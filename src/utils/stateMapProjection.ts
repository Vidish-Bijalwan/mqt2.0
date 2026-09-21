export interface StateProjection {
  west: number;
  north: number;
  scale: number;
  padding: number;
  standardParallel1: number;
  standardParallel2: number;
  centralMeridian: number;
  latitudeOfOrigin: number;
  falseEasting: number;
  falseNorthing: number;
}

/** WGS84 → SOI's ellipsoidal Lambert Conformal Conic → SVG coordinates. */
export function projectDestination(latitude: number, longitude: number, p: StateProjection) {
  const radians = Math.PI / 180;
  const a = 6378137;
  const eccentricity = Math.sqrt(2 / 298.257223563 - (1 / 298.257223563) ** 2);
  const m = (phi: number) => Math.cos(phi) / Math.sqrt(1 - (eccentricity * Math.sin(phi)) ** 2);
  const t = (phi: number) => Math.tan(Math.PI / 4 - phi / 2) / ((1 - eccentricity * Math.sin(phi)) / (1 + eccentricity * Math.sin(phi))) ** (eccentricity / 2);
  const phi1 = p.standardParallel1 * radians, phi2 = p.standardParallel2 * radians;
  const n = Math.log(m(phi1) / m(phi2)) / Math.log(t(phi1) / t(phi2));
  const f = m(phi1) / (n * t(phi1) ** n);
  const rho = a * f * t(latitude * radians) ** n;
  const rho0 = a * f * t(p.latitudeOfOrigin * radians) ** n;
  const theta = n * (longitude - p.centralMeridian) * radians;
  const x = p.falseEasting + rho * Math.sin(theta);
  const y = p.falseNorthing + rho0 - rho * Math.cos(theta);
  return { x: (x - p.west) * p.scale + p.padding, y: (p.north - y) * p.scale + p.padding };
}
