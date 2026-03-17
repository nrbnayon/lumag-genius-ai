"use client";

import { X, Building2, Phone, Mail, MapPin, Calendar, Star, Tag } from "lucide-react";
import { SupplierDetail } from "@/types/supplier";
import { cn } from "@/lib/utils";

interface SupplierDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: SupplierDetail | null;
  onEdit: (supplier: SupplierDetail) => void;
  onRemove: (supplier: SupplierDetail) => void;
}

export function SupplierDetailsModal({
  isOpen,
  onClose,
  supplier,
  onEdit,
  onRemove,
}: SupplierDetailsModalProps) {
  if (!isOpen || !supplier) return null;

  const statusColors = {
    approved: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-primary p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{supplier.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full capitalize",
                    statusColors[supplier.approval_status],
                  )}
                >
                  {supplier.approval_status}
                </span>
                <span className="text-white/70 text-xs capitalize">{supplier.outlet_type}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Rating & Active Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-100">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="text-sm font-bold text-foreground">{supplier.rating}</span>
            </div>
            <span
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-bold",
                supplier.is_active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-gray-100 text-gray-500 border border-gray-200",
              )}
            >
              {supplier.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-secondary" />
                <p className="text-xs font-bold text-secondary uppercase tracking-wider">Phone</p>
              </div>
              <p className="text-foreground font-bold">
                {supplier.phone || <span className="text-gray-400 font-normal italic">Not provided</span>}
              </p>
            </div>
            <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-secondary" />
                <p className="text-xs font-bold text-secondary uppercase tracking-wider">Email</p>
              </div>
              <p className="text-foreground font-bold break-all">
                {supplier.email || <span className="text-gray-400 font-normal italic">Not provided</span>}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-secondary" />
              <p className="text-xs font-bold text-secondary uppercase tracking-wider">Address</p>
            </div>
            <p className="text-foreground font-bold">
              {supplier.address || <span className="text-gray-400 font-normal italic">Not provided</span>}
            </p>
          </div>

          {/* Contracts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Contract Start
                </p>
              </div>
              <p className="text-emerald-800 text-lg font-bold">
                {supplier.contract_start_date
                  ? new Date(supplier.contract_start_date).toLocaleDateString()
                  : <span className="text-gray-400 font-normal italic text-base">Not set</span>}
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Contract End
                </p>
              </div>
              <p className="text-blue-800 text-lg font-bold">
                {supplier.contract_end_date
                  ? new Date(supplier.contract_end_date).toLocaleDateString()
                  : <span className="text-gray-400 font-normal italic text-base">Not set</span>}
              </p>
            </div>
          </div>

          {/* Notes */}
          {supplier.notes && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Notes</p>
              <p className="text-foreground text-sm leading-relaxed">{supplier.notes}</p>
            </div>
          )}

          {/* Approval info */}
          {supplier.approved_by_name && (
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Approved By</p>
              <p className="text-foreground font-bold text-sm">{supplier.approved_by_name}</p>
              {supplier.approved_at && (
                <p className="text-xs text-secondary mt-0.5">
                  {new Date(supplier.approved_at).toLocaleString()}
                </p>
              )}
            </div>
          )}

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
