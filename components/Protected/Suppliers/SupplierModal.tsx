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
} from "lucide-react";
import { Supplier } from "@/types/supplier";
import { cn } from "@/lib/utils";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Partial<Supplier>) => void;
  supplier?: Supplier | null;
  mode: "add" | "edit";
}

export function SupplierModal({
  isOpen,
  onClose,
  onConfirm,
  supplier,
  mode,
}: SupplierModalProps) {
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: "",
    phone: "",
    email: "",
    address: "",
    contractStart: "",
    contractEnd: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Supplier, string>>>(
    {},
  );

  useEffect(() => {
    if (supplier) {
      setFormData({
        ...supplier,
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        contractStart: "",
        contractEnd: "",
        notes: "",
      });
    }
    setErrors({});
  }, [supplier, isOpen]);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Required";
    if (!formData.phone) newErrors.phone = "Required";
    if (!formData.email) newErrors.email = "Required";
    if (!formData.address) newErrors.address = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onConfirm(formData);
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium",
                    errors.name && "border-red-500 bg-red-50/10",
                  )}
                  placeholder="Ocean Fresh Ltd."
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={cn(
                      "w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium",
                      errors.phone && "border-red-500 bg-red-50/10",
                    )}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={cn(
                      "w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium",
                      errors.email && "border-red-500 bg-red-50/10",
                    )}
                    placeholder="orders@oceanfresh.com"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className={cn(
                    "w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium",
                    errors.address && "border-red-500 bg-red-50/10",
                  )}
                  placeholder="123 Harbor Way, Boston, MA"
                />
              </div>
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
                    value={formData.contractStart}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contractStart: e.target.value,
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
                    value={formData.contractEnd}
                    onChange={(e) =>
                      setFormData({ ...formData, contractEnd: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>
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
                  value={formData.notes}
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
              className="flex-1 px-6 py-3 border border-gray-200 rounded-full text-foreground font-bold hover:bg-gray-50 transition-colors text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-shadow shadow-md hover:shadow-lg text-sm cursor-pointer"
            >
              {mode === "add" ? "+ Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
