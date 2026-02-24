"use client";

import { useEffect, useState, useRef } from "react";
import { X, UploadCloud, Camera, Check, ChevronDown } from "lucide-react";
import { Menu, MenuFormData, MenuType } from "@/types/menu";
import { cn } from "@/lib/utils";

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

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
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
      setPreview(menu.image || null);
    } else {
      setFormData({
        name: "",
        type: "Lunch",
        dishes: [],
        cost: "",
        image: null,
      });
      setPreview(null);
    }
    setErrors({});
  }, [menu, isOpen]);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setFormData((prev) => ({ ...prev, image: file }));
      };
      reader.readAsDataURL(file);
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
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === "add" ? "Add Menu" : "Edit Menu"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-600 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Menu Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Menu Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={cn(
                  "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                  errors.name ? "border-red-500" : "border-gray-200",
                )}
                placeholder="Enter menu name"
              />
            </div>

            {/* Types Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-1">
                Types
              </label>
              <button
                type="button"
                onClick={() => setIsTypeOpen(!isTypeOpen)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg flex items-center justify-between hover:border-blue-500 transition-all text-sm"
              >
                <span>{formData.type}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isTypeOpen && "rotate-180",
                  )}
                />
              </button>
              {isTypeOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                  {MENU_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, type });
                        setIsTypeOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Select Dishes Multi-select */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-1">
                Select Dishes
              </label>
              <button
                type="button"
                onClick={() => setIsDishesOpen(!isDishesOpen)}
                className={cn(
                  "w-full px-4 py-2 border border-gray-200 rounded-lg flex items-center justify-between hover:border-blue-500 transition-all text-sm",
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
                    "w-4 h-4 transition-transform",
                    isDishesOpen && "rotate-180",
                  )}
                />
              </button>
              {isDishesOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                  {AVAILABLE_DISHES.map((dish) => (
                    <button
                      key={dish}
                      type="button"
                      onClick={() => toggleDish(dish)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors flex items-center justify-between"
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

            {/* Total Cost */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Total Cost
              </label>
              <input
                type="text"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
                className={cn(
                  "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                  errors.cost ? "border-red-500" : "border-gray-200",
                )}
                placeholder="e.g. $20"
              />
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            {/* Image Upload */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFileChange(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
                isDragging
                  ? "border-[#0190FE] bg-blue-50"
                  : "border-blue-200 bg-blue-50/50 hover:bg-blue-50",
                preview ? "p-0 h-40" : "p-8 h-32",
              )}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(file);
                }}
              />
              {preview ? (
                <div className="relative w-full h-full group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                    <Camera className="w-6 h-6" />{" "}
                    <span className="font-bold">Change</span>
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-[#0EA5E9] mb-2" />
                  <p className="text-sm font-medium text-gray-900">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Max. File Size: 50MB
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
            >
              {mode === "add" ? "+ Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
