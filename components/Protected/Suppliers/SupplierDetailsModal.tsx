"use client";

import { X, Building2 } from "lucide-react";
import { Supplier } from "@/types/supplier";
import { cn } from "@/lib/utils";

interface SupplierDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  onEdit: (supplier: Supplier) => void;
  onRemove: (supplier: Supplier) => void;
}

export function SupplierDetailsModal({
  isOpen,
  onClose,
  supplier,
  onEdit,
  onRemove,
}: SupplierDetailsModalProps) {
  if (!isOpen || !supplier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-primary p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Building2 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold">{supplier.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
              <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                Phone
              </p>
              <p className="text-foreground font-bold">{supplier.phone}</p>
            </div>
            <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
              <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                Email
              </p>
              <p className="text-foreground font-bold">{supplier.email}</p>
            </div>
          </div>

          {/* Address */}
          <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
              Address
            </p>
            <p className="text-foreground font-bold">{supplier.address}</p>
          </div>

          {/* Contracts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
                Contract Start
              </p>
              <p className="text-emerald-800 text-lg font-bold">
                {supplier.contractStart || "Jan 15, 2024"}
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                Contract End
              </p>
              <p className="text-blue-800 text-lg font-bold">
                {supplier.contractEnd || "Jan 14, 2027"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <button
              onClick={() => onRemove(supplier)}
              className="px-6 py-3 border border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors cursor-pointer text-sm"
            >
              Remove Supplier
            </button>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-8 py-3 border border-gray-200 text-foreground rounded-full font-bold hover:bg-gray-50 transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => onEdit(supplier)}
                className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-blue-600 shadow-md hover:shadow-lg transition-all cursor-pointer text-sm"
              >
                Edit Supplier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
