"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { Ingredient, IngredientFormData } from "@/types/ingredient";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { read, utils as xlsxUtils } from "xlsx";

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: IngredientFormData) => void;
  ingredient?: Ingredient | null;
  mode: "add" | "edit";
}

export function IngredientModal({
  isOpen,
  onClose,
  onConfirm,
  ingredient,
  mode,
}: IngredientModalProps) {
  const [formData, setFormData] = useState<IngredientFormData>({
    name: "",
    price: "",
    unit: "",
    category: "Other",
    currentStock: "",
    minimumStock: "",
    image: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [excelFileName, setExcelFileName] = useState<string>("");

  const [errors, setErrors] = useState<Partial<IngredientFormData>>({});

  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        price: ingredient.price.toString(),
        unit: ingredient.unit,
        category: ingredient.category,
        currentStock: ingredient.currentStock.toString(),
        minimumStock: ingredient.minimumStock.toString(),
        image: null,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        unit: "",
        category: "Other",
        currentStock: "",
        minimumStock: "",
        image: null,
      });
      setExcelFileName("");
    }
    setErrors({});
  }, [ingredient, isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFileName(file.name);
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
            const row = data[0];
            const find = (...keys: string[]) => {
              const k = Object.keys(row).find((k) =>
                keys.some((pk) => k.toLowerCase().includes(pk.toLowerCase())),
              );
              return k ? String(row[k]) : "";
            };

            setFormData((prev) => ({
              ...prev,
              name: find("name", "ingredient", "item") || prev.name,
              price: find("price", "cost", "rate") || prev.price,
              unit: find("unit", "measurement") || prev.unit,
              category: (find("category", "type") as any) || prev.category,
              currentStock:
                find("stock", "current", "qty", "quantity") ||
                prev.currentStock,
              minimumStock:
                find("min", "threshold", "alert") || prev.minimumStock,
            }));

            toast.success("Form auto-filled from file successfully!");
          } else {
            toast.error("No data found in the file.");
          }
        } catch (error) {
          toast.error("Failed to process file.");
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Partial<IngredientFormData> = {};
    if (!formData.name) newErrors.name = "Name is required" as any;
    if (!formData.price || isNaN(Number(formData.price)))
      newErrors.price = "Valid price is required" as any;
    if (!formData.unit) newErrors.unit = "Unit is required" as any;
    if (!formData.currentStock || isNaN(Number(formData.currentStock)))
      newErrors.currentStock = "Required" as any;
    if (!formData.minimumStock || isNaN(Number(formData.minimumStock)))
      newErrors.minimumStock = "Required" as any;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onConfirm(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-foreground">
            {mode === "add" ? "Add Ingredient" : "Edit Ingredient"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">
                Ingredient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={cn(
                  "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-gray-300",
                  errors.name ? "border-red-500" : "border-gray-200",
                )}
                placeholder="Enter ingredient name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Unit */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-gray-300",
                    errors.unit ? "border-red-500" : "border-gray-200",
                  )}
                  placeholder="e.g. Kg, L, Unit"
                />
              </div>
              {/* Price */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Price/Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-gray-300",
                    errors.price ? "border-red-500" : "border-gray-200",
                  )}
                  placeholder="e.g. 20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Current Stock */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Current Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.currentStock}
                  onChange={(e) =>
                    setFormData({ ...formData, currentStock: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-gray-300",
                    errors.currentStock ? "border-red-500" : "border-gray-200",
                  )}
                  placeholder="Enter current stock amount"
                />
              </div>
              {/* Minimum Stock */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Minimum Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.minimumStock}
                  onChange={(e) =>
                    setFormData({ ...formData, minimumStock: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-gray-300",
                    errors.minimumStock ? "border-red-500" : "border-gray-200",
                  )}
                  placeholder="Enter minimum stock threshold"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white font-medium"
              >
                <option value="Vegetable">Vegetable</option>
                <option value="Meat">Meat</option>
                <option value="Dairy">Dairy</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100"></span>
            </div>
            <div className="relative flex justify-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span className="bg-white px-4">Or</span>
            </div>
          </div>

          {/* Excel Upload Area */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-foreground">
              Upload Ingredients <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-blue-50/10 hover:bg-blue-50/30 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-transparent flex items-center justify-center group-hover:scale-110 transition-transform">
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
                  {excelFileName || "Click to upload or drag and drop"}
                </p>
                <p className="text-xs font-medium text-secondary mt-1 uppercase tracking-wider">
                  Supports: XLSX, XLS, CSV (Max. 50MB)
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 sticky bottom-0 bg-white pt-2 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-gray-200 rounded-full text-foreground font-bold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"
            >
              {mode === "add" ? "+ Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
