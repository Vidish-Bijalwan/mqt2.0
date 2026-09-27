import { Metadata } from "next";
import CampaignPage from "@/components/campaigns/CampaignPage";
import { chardhamYatraConfig, buildCampaignMetadata } from "@/data/campaignConfigs";

export async function generateMetadata(): Promise<Metadata> {
  return buildCampaignMetadata(chardhamYatraConfig);
}

export default function ChardhamYatraPage() {
  return <CampaignPage config={chardhamYatraConfig} />;
}
