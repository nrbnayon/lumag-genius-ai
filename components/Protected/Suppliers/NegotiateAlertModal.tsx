"use client";

import { useState } from "react";
import { X, MessageSquare, Mail, Phone } from "lucide-react";
import { PriceAlert } from "@/types/supplier";
import { cn } from "@/lib/utils";

interface NegotiateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    alert: PriceAlert,
    proposedPrice: string,
    message: string,
    method: string,
  ) => void;
  alert: PriceAlert | null;
}

export function NegotiateAlertModal({
  isOpen,
  onClose,
  onConfirm,
  alert,
}: NegotiateAlertModalProps) {
  const [proposedPrice, setProposedPrice] = useState("");
  const [message, setMessage] = useState("");
  const [contactMethod, setContactMethod] = useState<"Email" | "Phone">(
    "Email",
  );

  if (!isOpen || !alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Negotiate Price
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Info Card */}
          <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {alert.productName}
              </h3>
              <p className="text-sm text-secondary font-medium">
                Supplier: {alert.supplierName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
                  Current Price
                </p>
                <div className="text-lg font-bold text-foreground">
                  {alert.currentPrice}
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border-2 border-red-100 shadow-sm focus-within:border-primary transition-colors">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
                  Proposed Price
                </p>
                <input
                  type="text"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  placeholder={alert.currentPrice}
                  className="w-full bg-transparent border-none outline-none text-lg font-bold text-red-600 placeholder:text-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              Negotiation Message (Optional)
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add context for your counter offer (e.g., market rates, volume commitment, etc.)"
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium resize-none"
            />
          </div>

          {/* Contact Method */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground">
              Preferred Contact Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setContactMethod("Email")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group cursor-pointer",
                  contactMethod === "Email"
                    ? "border-primary bg-blue-50/50"
                    : "border-gray-100 hover:border-blue-200",
                )}
              >
                <Mail
                  className={cn(
                    "w-5 h-5",
                    contactMethod === "Email"
                      ? "text-primary"
                      : "text-gray-400",
                  )}
                />
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">Email</p>
                  <p className="text-[10px] font-medium text-secondary">
                    Send now
                  </p>
                </div>
              </button>
              <button
                onClick={() => setContactMethod("Phone")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group cursor-pointer",
                  contactMethod === "Phone"
                    ? "border-primary bg-blue-50/50"
                    : "border-gray-100 hover:border-blue-200",
                )}
              >
                <Phone
                  className={cn(
                    "w-5 h-5",
                    contactMethod === "Phone"
                      ? "text-emerald-500"
                      : "text-gray-400",
                  )}
                />
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">
                    Phone Call
                  </p>
                  <p className="text-[10px] font-medium text-secondary">
                    Call supplier
                  </p>
                </div>
              </button>
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
            onClick={() =>
              onConfirm(alert, proposedPrice, message, contactMethod)
            }
            className="flex-1 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Negotiation Request
          </button>
        </div>
      </div>
    </div>
  );
}
