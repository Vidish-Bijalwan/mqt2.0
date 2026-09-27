import { Metadata } from "next";
import CampaignPage from "@/components/campaigns/CampaignPage";
import { himachalTourPackagesConfig, buildCampaignMetadata } from "@/data/campaignConfigs";

export async function generateMetadata(): Promise<Metadata> {
  return buildCampaignMetadata(himachalTourPackagesConfig);
}

export default function HimachalTourPackagesPage() {
  return <CampaignPage config={himachalTourPackagesConfig} />;
}
