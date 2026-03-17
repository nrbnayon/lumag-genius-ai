"use client";

import { Phone, Mail, MapPin, Star } from "lucide-react";
import { SupplierDetail } from "@/types/supplier";
import { cn } from "@/lib/utils";

interface SupplierCardProps {
  supplier: SupplierDetail;
  onViewDetails?: (supplier: SupplierDetail) => void;
}

export function SupplierCard({ supplier, onViewDetails }: SupplierCardProps) {
  const statusColors = {
    approved: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_16px_0px_#A9A9A940] border-none flex flex-col gap-4 group hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground truncate">
            {supplier.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={cn(
                "text-xs font-bold px-2 py-0.5 rounded-full capitalize",
                statusColors[supplier.approval_status],
              )}
            >
              {supplier.approval_status}
            </span>
            <span className="text-xs text-secondary capitalize">{supplier.outlet_type}</span>
          </div>
        </div>
        {supplier.rating && (
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-foreground">
              {supplier.rating}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-secondary">
          <Phone className="w-4 h-4 shrink-0" />
          <span className="truncate">
            {supplier.phone ?? <span className="italic text-gray-400">No phone</span>}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-secondary">
          <Mail className="w-4 h-4 shrink-0" />
          <span className="truncate">
            {supplier.email ?? <span className="italic text-gray-400">No email</span>}
          </span>
        </div>
        <div className="flex items-start gap-3 text-sm text-secondary">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="line-clamp-2">
            {supplier.address ?? <span className="italic text-gray-400">No address</span>}
          </span>
        </div>
      </div>

      <button
        onClick={() => onViewDetails?.(supplier)}
        className="mt-2 w-full py-2.5 bg-blue-50 text-primary rounded-lg font-bold hover:bg-blue-100 transition-colors cursor-pointer text-sm"
      >
        View Details
      </button>
    </div>
  );
}
