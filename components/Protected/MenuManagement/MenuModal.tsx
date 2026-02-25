"use client";

import { useEffect, useState, useRef } from "react";
import { X, Trash2, Check, ChevronDown } from "lucide-react";
import { Menu, MenuFormData, MenuType } from "@/types/menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { read, utils as xlsxUtils } from "xlsx";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: MenuFormData) => void;
  menu?: Menu | null;
  mode: "add" | "edit";
}

const MENU_TYPES: MenuType[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Seasonal",
  "Special",
];
const AVAILABLE_DISHES = [
  "Bread Pakora",
  "Beef",
  "Chicken fry",
  "Grilled Salmon Fillet",
  "Chicken burger",
  "Garden Salad",
  "Mashed Potatoes",
];

export function MenuModal({
  isOpen,
  onClose,
  onConfirm,
  menu,
  mode,
}: MenuModalProps) {
  const [formData, setFormData] = useState<MenuFormData>({
    name: "",
    type: "Lunch",
    dishes: [],
    cost: "",
    image: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [excelFileName, setExcelFileName] = useState<string>("");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isDishesOpen, setIsDishesOpen] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof MenuFormData, string>>
  >({});

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name,
        type: menu.type,
        dishes: menu.dishes,
        cost: menu.cost,
        image: null,
      });
    } else {
      setFormData({
        name: "",
        type: "Lunch",
        dishes: [],
        cost: "",
        image: null,
      });
      setExcelFileName("");
    }
    setErrors({});
  }, [menu, isOpen]);

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

            const dishesStr = find("dishes", "items", "food");
            const extractedDishes = dishesStr
              ? dishesStr.split(",").map((d) => d.trim())
              : [];

            setFormData((prev) => ({
              ...prev,
              name: find("name", "menu", "title") || prev.name,
              type: (find("type", "category") as MenuType) || prev.type,
              cost: find("cost", "price", "total") || prev.cost,
              dishes:
                extractedDishes.length > 0 ? extractedDishes : prev.dishes,
            }));

            toast.success("Menu auto-filled successfully!");
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

  const toggleDish = (dish: string) => {
    setFormData((prev) => {
      const exists = prev.dishes.includes(dish);
      if (exists) {
        return { ...prev, dishes: prev.dishes.filter((d) => d !== dish) };
      }
      return { ...prev, dishes: [...prev.dishes, dish] };
    });
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Required";
    if (!formData.cost) newErrors.cost = "Required";
    if (formData.dishes.length === 0)
      newErrors.dishes = "Select at least one dish";

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
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-foreground">
            {mode === "add" ? "Add Menu" : "Edit Menu"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Menu Name */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">
                Menu Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={cn(
                  "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium placeholder:text-gray-300",
                  errors.name ? "border-red-500" : "border-gray-200",
                )}
                placeholder="Enter menu name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Types Dropdown */}
              <div className="relative">
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Types <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsTypeOpen(!isTypeOpen)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl flex items-center justify-between hover:border-primary transition-all text-sm font-medium bg-white"
                >
                  <span>{formData.type}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform text-secondary",
                      isTypeOpen && "rotate-180",
                    )}
                  />
                </button>
                {isTypeOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                    {MENU_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, type });
                          setIsTypeOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors font-medium"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Total Cost */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Total Cost <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium placeholder:text-gray-300",
                    errors.cost ? "border-red-500" : "border-gray-200",
                  )}
                  placeholder="e.g. $20"
                />
              </div>
            </div>

            {/* Select Dishes Multi-select */}
            <div className="relative">
              <label className="block text-sm font-bold text-foreground mb-1.5">
                Select Dishes <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsDishesOpen(!isDishesOpen)}
                className={cn(
                  "w-full px-4 py-2 border border-gray-200 rounded-xl flex items-center justify-between hover:border-primary transition-all text-sm font-medium bg-white",
                  errors.dishes && "border-red-500",
                )}
              >
                <span className="truncate">
                  {formData.dishes.length > 0
                    ? formData.dishes.join(", ")
                    : "Select dishes"}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform text-secondary",
                    isDishesOpen && "rotate-180",
                  )}
                />
              </button>
              {isDishesOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden py-1 max-h-48 overflow-y-auto custom-scrollbar">
                  {AVAILABLE_DISHES.map((dish) => (
                    <button
                      key={dish}
                      type="button"
                      onClick={() => toggleDish(dish)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors flex items-center justify-between font-medium"
                    >
                      <span>{dish}</span>
                      {formData.dishes.includes(dish) && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="bg-white px-4">Or</span>
              </div>
            </div>

            {/* Excel Upload Area */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-foreground">
                Upload Menu <span className="text-red-500">*</span>
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
