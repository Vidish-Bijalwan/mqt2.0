import { Metadata } from "next";
import CampaignPage from "@/components/campaigns/CampaignPage";
import { dubaiTourPackagesConfig, buildCampaignMetadata } from "@/data/campaignConfigs";
import { siteConfig } from "@/data/siteConfig";

export async function generateMetadata(): Promise<Metadata> {
  const meta = buildCampaignMetadata(dubaiTourPackagesConfig);
  // The campaign config title already carries "| My Quick Trippers", and the
  // root layout title template appends it again — strip the duplicate here.
  const suffix = ` | ${siteConfig.name}`;
  const title =
    typeof meta.title === "string" && meta.title.endsWith(suffix)
      ? meta.title.slice(0, -suffix.length)
      : meta.title;
  return { ...meta, title };
}

export default function DubaiTourPackagesPage() {
  return <CampaignPage config={dubaiTourPackagesConfig} />;
}
