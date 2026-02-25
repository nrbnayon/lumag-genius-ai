import { Metadata } from "next";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import AiAssistantClient from "@/components/Protected/AiAssistant/AiAssistantClient";

export const metadata: Metadata = {
  title: "AI Assistant | Lumag Genius AI",
  description:
    "Get intelligent recommendations for menu planning, cost optimization, and operations",
};

export default function AiAssistantPage() {
  return (
    <div className="pb-10 bg-white min-h-screen">
      <DashboardHeader
        title="AI Assistant"
        description="Get intelligent recommendations for menu planning, cost optimization, and operations"
      />

      <main className="px-4 md:px-8 animate-in fade-in duration-500 max-w-full mx-auto">
        <AiAssistantClient />
      </main>
    </div>
  );
}
