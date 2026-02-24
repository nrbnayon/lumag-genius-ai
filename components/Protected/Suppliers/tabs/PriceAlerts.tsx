"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import { PriceAlert } from "@/types/supplier";
import { AcceptAlertModal } from "../AcceptAlertModal";
import { NegotiateAlertModal } from "../NegotiateAlertModal";
import { toast } from "sonner";

interface PriceAlertsProps {
  alerts: PriceAlert[];
}

export function PriceAlerts({ alerts: initialAlerts }: PriceAlertsProps) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedAlert, setSelectedAlert] = useState<PriceAlert | null>(null);
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [isNegotiateOpen, setIsNegotiateOpen] = useState(false);

  const handleAcceptClick = (alert: PriceAlert) => {
    setSelectedAlert(alert);
    setIsAcceptOpen(true);
  };

  const handleNegotiateClick = (alert: PriceAlert) => {
    setSelectedAlert(alert);
    setIsNegotiateOpen(true);
  };

  const onConfirmAccept = (alert: PriceAlert) => {
    toast.success(`Price change for ${alert.productName} accepted`);
    setAlerts(alerts.filter((a) => a.id !== alert.id));
    setIsAcceptOpen(false);
  };

  const onConfirmNegotiate = (
    alert: PriceAlert,
    proposed: string,
    msg: string,
    method: string,
  ) => {
    toast.success(`Negotiation request sent to ${alert.supplierName}`);
    setIsNegotiateOpen(false);
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-white p-6 rounded-2xl border border-gray-50 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-primary/20 transition-all"
        >
          <div className="space-y-2">
            {alert.isSuddenChange && (
              <span className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                Sudden Change is visible
              </span>
            )}
            <h4 className="text-lg font-bold text-foreground">
              {alert.productName} - Price {alert.type}
            </h4>
            <p className="text-sm text-gray-400 font-medium">
              Supplier: {alert.supplierName}
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-secondary">
              Previous: {alert.previousPrice}
              <TrendingUp
                className={cn(
                  "w-3 h-3 transition-transform",
                  alert.type === "Increase"
                    ? "text-red-500 rotate-0"
                    : "text-emerald-500 rotate-180",
                )}
              />
              Current: {alert.currentPrice}
            </div>
          </div>

          <div className="flex items-center gap-8 w-full md:w-auto">
            <div className="text-right">
              <div
                className={cn(
                  "text-2xl font-bold",
                  alert.type === "Increase"
                    ? "text-primary"
                    : "text-emerald-500",
                )}
              >
                {alert.type === "Increase" ? "+" : "-"}
                {alert.percentageChange}%
              </div>
              <div className="text-xs font-bold text-gray-400 uppercase">
                {alert.type === "Increase" ? "Increase" : "Decrease"}
              </div>
            </div>
            <div className="flex flex-col gap-2 min-w-[120px]">
              <button
                onClick={() => handleAcceptClick(alert)}
                className="w-full py-2 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer outline-none"
              >
                Accept Price
              </button>
              <button
                onClick={() => handleNegotiateClick(alert)}
                className="w-full py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors cursor-pointer outline-none"
              >
                Negotiate
              </button>
            </div>
          </div>
        </div>
      ))}

      <AcceptAlertModal
        isOpen={isAcceptOpen}
        onClose={() => setIsAcceptOpen(false)}
        onConfirm={onConfirmAccept}
        alert={selectedAlert}
      />

      <NegotiateAlertModal
        isOpen={isNegotiateOpen}
        onClose={() => setIsNegotiateOpen(false)}
        onConfirm={onConfirmNegotiate}
        alert={selectedAlert}
      />
    </div>
  );
}
