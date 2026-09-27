import { Metadata } from "next";
import CampaignPage from "@/components/campaigns/CampaignPage";
import { helicopterToursConfig, buildCampaignMetadata } from "@/data/campaignConfigs";

export async function generateMetadata(): Promise<Metadata> {
  return buildCampaignMetadata(helicopterToursConfig);
}

export default function HelicopterToursIndiaPage() {
  return <CampaignPage config={helicopterToursConfig} />;
}
