import { Metadata } from "next";
import CampaignPage from "@/components/campaigns/CampaignPage";
import { dehradunAdventureConfig, buildCampaignMetadata } from "@/data/campaignConfigs";

export async function generateMetadata(): Promise<Metadata> {
  return buildCampaignMetadata(dehradunAdventureConfig);
}

export default function DehradunAdventurePage() {
  return <CampaignPage config={dehradunAdventureConfig} />;
}
