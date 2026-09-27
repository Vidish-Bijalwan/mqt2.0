import { Metadata } from "next";
import CampaignPage from "@/components/campaigns/CampaignPage";
import { buddhistToursConfig, buildCampaignMetadata } from "@/data/campaignConfigs";

export async function generateMetadata(): Promise<Metadata> {
  return buildCampaignMetadata(buddhistToursConfig);
}

export default function BuddhistToursIndiaPage() {
  return <CampaignPage config={buddhistToursConfig} />;
}
