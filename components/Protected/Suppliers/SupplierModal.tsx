"use client";

import { useEffect, useState } from "react";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Building2,
  Loader2,
} from "lucide-react";
import { SupplierDetail, SupplierPayload } from "@/types/supplier";
import { cn } from "@/lib/utils";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Partial<SupplierPayload>) => void;
  supplier?: SupplierDetail | null;
  mode: "add" | "edit";
  isLoading?: boolean;
}

const emptyForm: Partial<SupplierPayload> = {
  name: "",
  phone: "",
  email: "",
  address: "",
  contract_start_date: "",
  contract_end_date: "",
  notes: "",
  rating: 4.5,
  is_active: true,
  outlet_type: "restaurant",
};

export function SupplierModal({
  isOpen,
  onClose,
  onConfirm,
  supplier,
  mode,
  isLoading = false,
}: SupplierModalProps) {
  const [formData, setFormData] = useState<Partial<SupplierPayload>>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof SupplierPayload, string>>>({});

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        phone: supplier.phone ?? "",
        email: supplier.email ?? "",
        address: supplier.address ?? "",
        contract_start_date: supplier.contract_start_date ?? "",
        contract_end_date: supplier.contract_end_date ?? "",
        notes: supplier.notes ?? "",
        rating: parseFloat(supplier.rating) || 4.5,
        is_active: supplier.is_active,
        outlet_type: supplier.outlet_type,
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
  }, [supplier, isOpen]);

  const validate = () => {
    const newErrors: Partial<Record<keyof SupplierPayload, string>> = {};
    if (!formData.name?.trim()) newErrors.name = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Clean up empty strings -> undefined for optional fields
      const payload: Partial<SupplierPayload> = {
        ...formData,
        phone: formData.phone?.trim() || undefined,
        email: formData.email?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        contract_start_date: formData.contract_start_date?.trim() || undefined,
        contract_end_date: formData.contract_end_date?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
      };
      onConfirm(payload);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-primary p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">
              {mode === "add" ? "Add Supplier" : "Edit Supplier"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <div className="space-y-4">
            {/* Supplier Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1">
                Supplier Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium",
                    errors.name && "border-red-500 bg-red-50/10",
                  )}
                  placeholder="Ocean Fresh Ltd."
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Phone
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.phone ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={formData.email ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                    placeholder="orders@oceanfresh.com"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.address ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                  placeholder="123 Harbor Way, Boston, MA"
                />
              </div>
            </div>

            {/* Outlet Type */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Outlet Type
              </label>
              <select
                value={formData.outlet_type ?? "restaurant"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    outlet_type: e.target.value as "bar" | "restaurant",
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium bg-white"
              >
                <option value="restaurant">Restaurant</option>
                <option value="bar">Bar</option>
              </select>
            </div>

            {/* Contracts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Contract Start
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={formData.contract_start_date ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contract_start_date: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Contract End
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={formData.contract_end_date ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, contract_end_date: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Rating (0–5)
              </label>
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={formData.rating ?? 4.5}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                placeholder="4.5"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Notes & Comments
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <textarea
                  value={formData.notes ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium resize-none"
                  placeholder="Add any additional notes or comments about this supplier..."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-full text-foreground font-bold hover:bg-gray-50 transition-colors text-sm cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-shadow shadow-md hover:shadow-lg text-sm cursor-pointer disabled:opacity-70"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "add" ? "+ Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
