import { Metadata } from "next";
import CampaignPage from "@/components/campaigns/CampaignPage";
import { nainitalHolidayConfig, buildCampaignMetadata } from "@/data/campaignConfigs";

export async function generateMetadata(): Promise<Metadata> {
  return buildCampaignMetadata(nainitalHolidayConfig);
}

export default function NainitalHolidayPage() {
  return <CampaignPage config={nainitalHolidayConfig} />;
}
