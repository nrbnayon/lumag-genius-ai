"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { Supplier } from "@/types/supplier";

interface SupplierCardProps {
  supplier: Supplier;
  onViewDetails?: (supplier: Supplier) => void;
}

export function SupplierCard({ supplier, onViewDetails }: SupplierCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_16px_0px_#A9A9A940] border-none flex flex-col gap-4 group hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground truncate">
          {supplier.name}
        </h3>
        {supplier.rating && (
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-sm font-bold text-foreground">
              {supplier.rating}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-secondary">
          <Phone className="w-4 h-4" />
          <span className="truncate">{supplier.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-secondary">
          <Mail className="w-4 h-4" />
          <span className="truncate">{supplier.email}</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-secondary">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="line-clamp-2">{supplier.address}</span>
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
