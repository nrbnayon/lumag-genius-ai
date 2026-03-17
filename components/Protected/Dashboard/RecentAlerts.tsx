"use client";

import type { RecentAlert } from "@/types/dashboard";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Package,
  ChefHat,
  Users,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentAlertsProps {
  data: RecentAlert[];
}

const severityConfig = {
  success: {
    icon: CheckCircle2,
    className: "text-green-500",
    bg: "bg-green-50",
  },
  warning: {
    icon: AlertTriangle,
    className: "text-amber-500",
    bg: "bg-amber-50",
  },
  error: {
    icon: XCircle,
    className: "text-red-500",
    bg: "bg-red-50",
  },
  info: {
    icon: Info,
    className: "text-blue-500",
    bg: "bg-blue-50",
  },
};

const typeIcon: Record<string, React.ElementType> = {
  supplier: Users,
  ingredient_stock: Package,
  menu: Utensils,
  recipe: ChefHat,
};

function formatRelativeTime(isoString: string): string {
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return "";
  }
}

export function RecentAlerts({ data }: RecentAlertsProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)] border-none">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">Recent Alerts</h3>
        <p className="text-sm text-secondary">System notifications</p>
      </div>
      <div className="space-y-3">
        {data.map((alert, index) => {
          const sev = severityConfig[alert.severity] ?? severityConfig.info;
          const SevIcon = sev.icon;
          const TypeIcon = typeIcon[alert.type] ?? Info;

          return (
            <div
              key={`${alert.type}-${alert.reference_id}-${index}`}
              className="flex items-start justify-between gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Severity icon */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                    sev.bg
                  )}
                >
                  <SevIcon className={cn("w-4 h-4", sev.className)} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium leading-snug line-clamp-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <TypeIcon className="w-3 h-3 text-secondary flex-shrink-0" />
                    <span className="capitalize text-xs text-secondary">
                      {alert.type.replace(/_/g, " ")}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium capitalize px-1.5 py-0.5 rounded-full",
                        alert.severity === "success"
                          ? "bg-green-50 text-green-600"
                          : "bg-amber-50 text-amber-600"
                      )}
                    >
                      {alert.status}
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-gray-400 text-xs whitespace-nowrap mt-1 flex-shrink-0">
                {formatRelativeTime(alert.time)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
