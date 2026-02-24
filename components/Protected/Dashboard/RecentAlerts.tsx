"use client";

import { recentAlerts } from "@/data/dashboardData";
import { AlertCircle } from "lucide-react";

export function RecentAlerts() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)] border-none">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">Recent Alerts</h3>
        <p className="text-sm text-secondary">System notifications</p>
      </div>
      <div className="space-y-4">
        {recentAlerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-foreground text-sm font-medium">
                {alert.title}
              </span>
            </div>
            <span className="text-gray-400 text-xs whitespace-nowrap">
              {alert.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
