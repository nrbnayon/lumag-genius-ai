"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { Staff, StaffPosition, StaffShift } from "@/types/staff";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

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

import { read, utils as xlsxUtils } from "xlsx";

export function StaffModal({
  isOpen,
  onClose,
  onConfirm,
  staff,
  mode,
}: StaffModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.info(`Extracting data from ${file.name}...`);

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = xlsxUtils.sheet_to_json(ws) as any[];

          if (data && data.length > 0) {
            const firstRow = data[0];
            // Intelligent mapping: try to find keys that match or start with field names
            const findValue = (possibleKeys: string[]) => {
              const key = Object.keys(firstRow).find((k) =>
                possibleKeys.some((pk) =>
                  k.toLowerCase().includes(pk.toLowerCase()),
                ),
              );
              return key ? String(firstRow[key]) : "";
            };

            setFormData((prev) => ({
              ...prev,
              name: findValue(["name", "full name", "stuff name", "employee"]),
              phone: findValue(["phone", "tel", "contact", "mobile"]),
              email: findValue(["email", "mail"]),
              position:
                (findValue(["position", "role", "job"]) as StaffPosition) ||
                prev.position,
              shift:
                (findValue(["shift", "timing"]) as StaffShift) || prev.shift,
            }));

            toast.success("Form auto-filled from file successfully!");
          } else {
            toast.error("No data found in the file.");
          }
        } catch (error) {
          console.error("File processing error:", error);
          toast.error(
            "Failed to process file. Please ensure it's a valid Excel or CSV.",
          );
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-xl animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-3 border-b border-gray-100/50">
          <h2 className="text-xl font-bold text-foreground">
            {mode === "add" ? "Add New Staff" : "Edit Staff"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-2 space-y-2">
          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={cn(
                "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium placeholder:text-gray-300",
                errors.name && "border-red-500",
              )}
              placeholder="Full Name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">
              Position <span className="text-red-500">*</span>
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
              Shift <span className="text-red-500">*</span>
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
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className={cn(
                "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium placeholder:text-gray-300",
                errors.phone && "border-red-500",
              )}
              placeholder="Phone"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={cn(
                "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium placeholder:text-gray-300",
                errors.email && "border-red-500",
              )}
              placeholder="Email"
            />
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100"></span>
            </div>
            <div className="relative flex justify-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span className="bg-white px-4">Or</span>
            </div>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-blue-50/10 hover:bg-blue-50/30 transition-all cursor-pointer group"
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
            />
            <div className="w-10 h-10 bg-transparent flex items-center justify-center group-hover:scale-110 transition-transform">
              <Image
                src="/icons/excel.png"
                alt="Excel/CSV"
                width={40}
                height={40}
                onError={(e) => {
                  (e.target as any).src =
                    "https://cdn-icons-png.flaticon.com/512/732/732220.png";
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-[10px] font-medium text-secondary mt-1 uppercase tracking-wider">
                Supports: XLSX, XLS, CSV (Max. 50MB)
              </p>
            </div>
          </div>

          <div className="flex gap-4 py-4 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-gray-200 rounded-full text-foreground font-bold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-colors cursor-pointer"
            >
              {mode === "add" ? "+ Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
