import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { allPackages } from "@/data/allPackages";
import { siteConfig } from "@/data/siteConfig";

export const runtime = "nodejs";

const EXTENSIONS = [".jpg", ".jpeg", ".webp", ".png"];

// Resolve the package cover on disk. Satori (next/og) only supports jpeg/png,
// so webp/gif covers are converted to PNG via sharp and passed as a data URL.
function resolvePackageImagePath(slug: string): string | null {
  for (const ext of EXTENSIONS) {
    const abs = path.join(process.cwd(), `public/images/packages/${slug}${ext}`);
    if (fs.existsSync(abs)) return abs;
  }
  return null;
}

async function imageSrc(absPath: string, origin: string): Promise<string | null> {
  const ext = path.extname(absPath).toLowerCase();
  if (ext === ".webp" || ext === ".gif") {
    try {
      const png = await sharp(absPath).png().toBuffer();
      return `data:image/png;base64,${png.toString("base64")}`;
    } catch {
      return null;
    }
  }
  return `${origin}/images/packages/${path.basename(absPath)}`;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Fast path: serve pre-generated OG image if it exists
  const preGenerated = path.join(process.cwd(), `public/images/og/${slug}.webp`);
  if (fs.existsSync(preGenerated)) {
    const buf = fs.readFileSync(preGenerated);
    return new Response(buf, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  }

  const pkg = allPackages.find((p) => p.slug === slug);
  const title = pkg ? pkg.title : slug.replace(/-/g, " ");

  const origin = new URL(req.url).origin;
  const absPath = resolvePackageImagePath(slug);
  const imgSrc = absPath ? await imageSrc(absPath, origin) : null;

  const subtitle = pkg
    ? `${pkg.duration || "Customized Tour"} · ${pkg.category || "Tour Package"} · ${siteConfig.domain.replace("https://", "")}`
    : `My Quick Trippers · ${siteConfig.domain.replace("https://", "")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #0a1c2a 0%, #12354f 100%)",
          color: "white",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt="Package cover photo"
            width={1200}
            height={630}
            style={{ objectFit: "cover", opacity: 0.4 }}
          />
        ) : null}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                background: "#fb4d00",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 900,
                color: "white",
              }}
            >
              M
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#ffb38a",
              }}
            >
              MY QUICK TRIPPERS
            </div>
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              lineHeight: 1.15,
              maxWidth: 900,
              textAlign: "center",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 600,
              color: "#ffb38a",
              marginTop: 18,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
