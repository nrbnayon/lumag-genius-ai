import { Metadata } from "next";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import NotificationsClient from "@/components/Notifications/NotificationsClient";

export const metadata: Metadata = {
  title: "Notifications | Lumag Genius AI",
  description: "Get all your notification from here",
};

export default function NotificationsPage() {
  return (
    <div className="pb-10 bg-[#F9FAFB] min-h-screen">
      <DashboardHeader
        title="Notifications"
        description="Get all your notification from here"
      />

      <main className="p-4 md:p-8 animate-in fade-in duration-500">
        <NotificationsClient />
      </main>
    </div>
  );
}
