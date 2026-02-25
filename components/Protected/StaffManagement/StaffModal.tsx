"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Staff, StaffPosition, StaffShift } from "@/types/staff";
import { cn } from "@/lib/utils";

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Partial<Staff>) => void;
  staff?: Staff | null;
  mode: "add" | "edit";
}

const POSITIONS: StaffPosition[] = [
  "Bar Chef",
  "Restaurant Chef",
  "Junior Chef",
  "Head Chef",
];
const SHIFTS: StaffShift[] = [
  "7.00AM-3.00PM (Morning)",
  "3.00PM-11.00PM (Evening)",
  "11.00PM-7.00AM (Night)",
];

export function StaffModal({
  isOpen,
  onClose,
  onConfirm,
  staff,
  mode,
}: StaffModalProps) {
  const [formData, setFormData] = useState<Partial<Staff>>({
    name: "",
    position: "Bar Chef",
    shift: "7.00AM-3.00PM (Morning)",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Staff, string>>>(
    {},
  );

  useEffect(() => {
    if (staff) {
      setFormData({ ...staff });
    } else {
      setFormData({
        name: "",
        position: "Bar Chef",
        shift: "7.00AM-3.00PM (Morning)",
        phone: "",
        email: "",
      });
    }
  }, [staff, isOpen]);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Required";
    if (!formData.phone) newErrors.phone = "Required";
    if (!formData.email) newErrors.email = "Required";
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
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-foreground">
            {mode === "add" ? "Add New Staff" : "Edit Staff"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={cn(
                "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium",
                errors.name && "border-red-500",
              )}
              placeholder="e.g. Mark Ethan"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">
              Position
            </label>
            <select
              value={formData.position}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  position: e.target.value as StaffPosition,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium bg-white"
            >
              {POSITIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">
              Shift
            </label>
            <select
              value={formData.shift}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shift: e.target.value as StaffShift,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium bg-white"
            >
              {SHIFTS.map((shift) => (
                <option key={shift} value={shift}>
                  {shift}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">
              Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className={cn(
                "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium",
                errors.phone && "border-red-500",
              )}
              placeholder="+88017572"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={cn(
                "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium",
                errors.email && "border-red-500",
              )}
              placeholder="mark@gmail.com"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-foreground font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {mode === "add" ? "+ Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
