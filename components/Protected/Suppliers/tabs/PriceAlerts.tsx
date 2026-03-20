"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { 
  useGetPriceAlertsQuery, 
  useHandlePriceAlertActionMutation 
} from "@/redux/services/suppliersApi";
import { PriceAlertItem } from "@/types/supplier";
import { AcceptAlertModal } from "../AcceptAlertModal";
import { NegotiateAlertModal } from "../NegotiateAlertModal";
import { toast } from "sonner";

export function PriceAlerts() {
  const { data, isLoading } = useGetPriceAlertsQuery();
  const [handleAction] = useHandlePriceAlertActionMutation();
  const [selectedAlert, setSelectedAlert] = useState<PriceAlertItem | null>(null);
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [isNegotiateOpen, setIsNegotiateOpen] = useState(false);

  const alerts = data?.data ?? [];

  const handleAcceptClick = (alert: PriceAlertItem) => {
    setSelectedAlert(alert);
    setIsAcceptOpen(true);
  };

  const handleNegotiateClick = (alert: PriceAlertItem) => {
    setSelectedAlert(alert);
    setIsNegotiateOpen(true);
  };

  const onConfirmAccept = async (alert: PriceAlertItem) => {
    try {
      await handleAction({
        purchase_id: alert.purchase_id,
        action_type: "accept",
      }).unwrap();
      toast.success(`Price change for ${alert.product_name} accepted`);
      setIsAcceptOpen(false);
      setSelectedAlert(null);
    } catch (err) {
      toast.error("Failed to accept price alert");
    }
  };

  const onConfirmNegotiate = async (
    alert: PriceAlertItem,
    proposed: string,
    msg: string,
  ) => {
    try {
      await handleAction({
        purchase_id: alert.purchase_id,
        action_type: "negotiate",
        proposed_price: parseFloat(proposed),
        message: msg,
      }).unwrap();
      toast.success(`Negotiation request sent to ${alert.supplier_name}`);
      setIsNegotiateOpen(false);
      setSelectedAlert(null);
    } catch (err) {
      toast.error("Failed to send negotiation request");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-50 shadow-xs animate-pulse"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-5 w-56 bg-gray-100 rounded" />
                <div className="h-3 w-40 bg-gray-100 rounded" />
              </div>
              <div className="flex items-center gap-6">
                <div className="h-10 w-16 bg-gray-100 rounded" />
                <div className="space-y-2">
                  <div className="h-8 w-28 bg-gray-100 rounded-lg" />
                  <div className="h-8 w-28 bg-gray-100 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <TrendingUp className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No price alerts</h3>
        <p className="text-secondary">All prices are stable. No alerts at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => {
        const isIncrease = alert.alert_type === "increase";
        const changePercent = parseFloat(alert.change_percentage);

        return (
          <div
            key={`${alert.supplier_id}-${alert.product_name}-${index}`}
            className="bg-white p-6 rounded-2xl border border-gray-50 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-primary/20 transition-all"
          >
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-foreground">
                {alert.product_name} — Price{" "}
                <span className={cn(isIncrease ? "text-red-500" : "text-emerald-500")}>
                  {isIncrease ? "Increase" : "Decrease"}
                </span>
              </h4>
              <p className="text-sm text-gray-400 font-medium">
                Supplier: {alert.supplier_name} &bull; Category: {alert.category_name}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-secondary">
                Previous: ${parseFloat(alert.previous_price).toFixed(2)}
                {isIncrease ? (
                  <TrendingUp className="w-3 h-3 text-red-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-emerald-500" />
                )}
                Current: ${parseFloat(alert.current_price).toFixed(2)}
                <span className="text-gray-400">/ {alert.unit}</span>
              </div>
              <p className="text-xs text-secondary">
                Purchase date: {new Date(alert.purchase_date).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto">
              <div className="text-right">
                <div
                  className={cn(
                    "text-2xl font-bold",
                    isIncrease ? "text-primary" : "text-emerald-500",
                  )}
                >
                  {isIncrease ? "+" : ""}
                  {changePercent.toFixed(1)}%
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase">
                  {isIncrease ? "Increase" : "Decrease"}
                </div>
                <div className="text-xs text-secondary mt-0.5">
                  {isIncrease ? "+" : ""}${parseFloat(alert.change_amount).toFixed(2)}
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
        );
      })}

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
