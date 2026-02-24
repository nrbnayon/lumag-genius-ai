"use client";

import { X, Check, TrendingUp, TrendingDown } from "lucide-react";
import { PriceAlert } from "@/types/supplier";
import { cn } from "@/lib/utils";

interface AcceptAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (alert: PriceAlert) => void;
  alert: PriceAlert | null;
}

export function AcceptAlertModal({
  isOpen,
  onClose,
  onConfirm,
  alert,
}: AcceptAlertModalProps) {
  if (!isOpen || !alert) return null;

  const isIncrease = alert.type === "Increase";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Check className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Accept Price {alert.type}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="border border-gray-100 rounded-2xl p-6 shadow-sm space-y-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">
                {alert.productName}
              </h3>
              <p className="text-sm text-secondary font-medium">
                Supplier: {alert.supplierName}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Previous Price
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {alert.previousPrice}
                </p>
              </div>

              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-transform",
                  isIncrease ? "text-red-500" : "text-emerald-500",
                )}
              >
                {isIncrease ? (
                  <TrendingUp className="w-8 h-8" />
                ) : (
                  <TrendingDown className="w-8 h-8" />
                )}
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                  New Price
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    isIncrease ? "text-red-600" : "text-emerald-600",
                  )}
                >
                  {alert.currentPrice}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 text-center">
              <div
                className={cn(
                  "text-3xl font-black mb-1",
                  isIncrease ? "text-red-600" : "text-emerald-600",
                )}
              >
                {isIncrease ? "+" : "-"}
                {alert.percentageChange}%
              </div>
              <p className="text-xs font-bold text-secondary uppercase tracking-widest">
                Price {isIncrease ? "Increase" : "Decrease"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-6 border-t border-gray-100 bg-gray-50/30">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-200 text-foreground rounded-full font-bold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(alert)}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Accept Price
          </button>
        </div>
      </div>
    </div>
  );
}
