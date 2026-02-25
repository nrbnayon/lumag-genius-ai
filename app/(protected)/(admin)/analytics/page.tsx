import { Metadata } from "next";
import AnalyticsClient from "@/components/Protected/Analytics/AnalyticsClient";

export const metadata: Metadata = {
  title: "Analytics | LumaG Genius AI",
  description: "Financial and operational insights for data-driven decisions",
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
