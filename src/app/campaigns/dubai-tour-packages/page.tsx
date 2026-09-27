import { Metadata } from "next";
import CampaignPage from "@/components/campaigns/CampaignPage";
import { dubaiTourPackagesConfig, buildCampaignMetadata } from "@/data/campaignConfigs";

export async function generateMetadata(): Promise<Metadata> {
  return buildCampaignMetadata(dubaiTourPackagesConfig);
}

export default function DubaiTourPackagesPage() {
  return <CampaignPage config={dubaiTourPackagesConfig} />;
}
