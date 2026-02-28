"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronDown, ImageUp, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Purchase, PurchaseCategory } from "@/types/supplier";
import { SUPPLIER_NAMES, PURCHASE_CATEGORIES } from "@/data/purchaseData";
import { readExcel } from "@/lib/excel";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Partial<Purchase>) => void;
  purchase?: Purchase | null;
  mode: "add" | "edit";
  /** "purchase" renders "+ Add"; "other" renders "+ Add Others" label */
  type?: "purchase" | "other";
}

const emptyForm: Partial<Purchase> = {
  productName: "",
  price: "",
  quantity: 0,
  unit: "",
  supplierName: SUPPLIER_NAMES[0],
  category: "Vegetable",
  purchaseDate: "",
  fileUrl: "",
  reportUrl: "",
};

export function PurchaseModal({
  isOpen,
  onClose,
  onConfirm,
  purchase,
  mode,
  type = "purchase",
}: PurchaseModalProps) {
  const excelRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<Purchase>>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof Purchase, string>>>(
    {},
  );
  const [excelFileName, setExcelFileName] = useState<string>("");
  const [reportFileName, setReportFileName] = useState<string>("");

  useEffect(() => {
    if (purchase) {
      setForm({ ...purchase });
    } else {
      setForm(emptyForm);
      setExcelFileName("");
      setReportFileName("");
    }
    setErrors({});
  }, [purchase, isOpen]);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.productName?.trim()) e.productName = "Required";
    if (!form.price?.trim()) e.price = "Required";
    if (!form.unit?.trim()) e.unit = "Required";
    if (!form.supplierName) e.supplierName = "Required";
    if (!form.purchaseDate) e.purchaseDate = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onConfirm(form);
  };

  // Excel upload → auto-fill form
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFileName(file.name);
    toast.info(`Reading ${file.name}…`);

    try {
      const data = await readExcel(file);
      if (!data.length) {
        toast.error("No data found.");
        return;
      }
      const row = data[0];
      const find = (...keys: string[]) => {
        const k = Object.keys(row).find((k) =>
          keys.some((pk) => k.toLowerCase().includes(pk.toLowerCase())),
        );
        return k ? String(row[k]) : "";
      };
      setForm((prev) => ({
        ...prev,
        productName: find("product", "name", "item") || prev.productName,
        price: find("price", "cost") || prev.price,
        unit: find("unit") || prev.unit,
        quantity: Number(find("quantity", "qty")) || prev.quantity,
        supplierName: find("supplier") || prev.supplierName,
        category: (find("category") as PurchaseCategory) || prev.category,
        purchaseDate: find("date", "purchase") || prev.purchaseDate,
      }));
      toast.success("Form auto-filled from Excel!");
    } catch {
      toast.error("Failed to read file.");
    } finally {
      if (excelRef.current) excelRef.current.value = "";
    }
  };

  // Report image upload
  const handleReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    setReportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      setForm((prev) => ({ ...prev, reportUrl: dataUrl }));
      toast.success(`Report "${file.name}" attached.`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReportFileName("");
    setForm((prev) => ({ ...prev, reportUrl: "" }));
    if (reportRef.current) reportRef.current.value = "";
    toast.success("Report removed.");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-foreground">
            {mode === "add"
              ? type === "other"
                ? "Add Other Product"
                : "Add Purchase"
              : "Edit Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Product Name
            </label>
            <input
              type="text"
              value={form.productName ?? ""}
              onChange={(e) =>
                setForm({ ...form, productName: e.target.value })
              }
              className={cn(
                "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder:text-gray-300",
                errors.productName && "border-red-400",
              )}
              placeholder="e.g. Tomatoes"
            />
            {errors.productName && (
              <p className="text-xs text-red-500 mt-1">{errors.productName}</p>
            )}
          </div>

          {/* Price / Quantity / Unit */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Price
              </label>
              <input
                type="text"
                value={form.price ?? ""}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={cn(
                  "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder:text-gray-300",
                  errors.price && "border-red-400",
                )}
                placeholder="$20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                min={0}
                value={form.quantity ?? ""}
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder:text-gray-300"
                placeholder="23"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Unit
              </label>
              <input
                type="text"
                value={form.unit ?? ""}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className={cn(
                  "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder:text-gray-300",
                  errors.unit && "border-red-400",
                )}
                placeholder="kg"
              />
            </div>
          </div>

          {/* Supplier Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Supplier Name
            </label>
            <div className="relative">
              <select
                value={form.supplierName ?? ""}
                onChange={(e) =>
                  setForm({ ...form, supplierName: e.target.value })
                }
                className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white text-foreground"
              >
                {SUPPLIER_NAMES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Category
            </label>
            <div className="relative">
              <select
                value={form.category ?? "Vegetable"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as PurchaseCategory,
                  })
                }
                className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white text-foreground"
              >
                {PURCHASE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Purchase Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={form.purchaseDate ?? ""}
                onChange={(e) =>
                  setForm({ ...form, purchaseDate: e.target.value })
                }
                className={cn(
                  "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm",
                  errors.purchaseDate && "border-red-400",
                )}
              />
            </div>
          </div>

          {/* Divider "Or" */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span className="bg-white px-4">Or</span>
            </div>
          </div>

          {/* Excel Upload */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Upload Product
            </label>
            <div
              onClick={() => excelRef.current?.click()}
              className="border-2 border-dashed border-blue-200 bg-[#F0F8FF] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-blue-50/60 transition-all cursor-pointer group"
            >
              <input
                ref={excelRef}
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelUpload}
              />
              <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image
                  src="/icons/excel.png"
                  alt="Excel"
                  width={40}
                  height={40}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://cdn-icons-png.flaticon.com/512/732/732220.png";
                  }}
                />
              </div>
              <p className="text-sm font-semibold text-foreground text-center">
                {excelFileName || "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-secondary">Max. File Size: 50MB</p>
            </div>
          </div>

          {/* Report Upload */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Report{" "}
              <span className="text-secondary">
                (If find any problem with the product)
              </span>
            </label>
            <div
              onClick={() => reportRef.current?.click()}
              className="border-2 border-dashed border-blue-200 bg-[#F0F8FF] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-blue-50/60 transition-all cursor-pointer group min-h-[160px] relative overflow-hidden"
            >
              <input
                ref={reportRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleReportUpload}
              />
              {form.reportUrl ? (
                <div className="absolute inset-0 w-full h-full group/preview">
                  <Image
                    src={form.reportUrl}
                    alt="Report Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleRemoveReport}
                      className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform scale-90 group-hover/preview:scale-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform text-gray-400">
                    <ImageUp className="w-10 h-10" />
                  </div>
                  <p className="text-sm font-semibold text-foreground text-center">
                    {reportFileName || "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-secondary">Max. File Size: 50MB</p>
                </>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-4 pt-2 pb-4 sticky bottom-0 bg-white">
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
