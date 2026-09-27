import { Metadata } from "next";
import CampaignPage from "@/components/campaigns/CampaignPage";
import { shimlaHoneymoonConfig, buildCampaignMetadata } from "@/data/campaignConfigs";

export async function generateMetadata(): Promise<Metadata> {
  return buildCampaignMetadata(shimlaHoneymoonConfig);
}

export default function ShimlaHoneymoonPage() {
  return <CampaignPage config={shimlaHoneymoonConfig} />;
}
