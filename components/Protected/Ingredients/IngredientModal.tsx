"use client";

import { useEffect, useState } from "react";
import { X, UploadCloud } from "lucide-react";
import { Ingredient, IngredientFormData } from "@/types/ingredient";

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
  });

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
      });
    } else {
      setFormData({
        name: "",
        price: "",
        unit: "",
        category: "Other",
        currentStock: "",
        minimumStock: "",
      });
    }
    setErrors({});
  }, [ingredient, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Partial<IngredientFormData> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.price || isNaN(Number(formData.price)))
      newErrors.price = "Valid price is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.currentStock || isNaN(Number(formData.currentStock)))
      newErrors.currentStock = "Required";
    if (!formData.minimumStock || isNaN(Number(formData.minimumStock)))
      newErrors.minimumStock = "Required";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
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
              <label className="block text-sm font-medium text-foreground mb-1">
                Ingredient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.name ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Enter ingredient name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.unit ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="e.g. Kg, L, Unit"
                />
              </div>
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Price/Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.price ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="e.g. 20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Current Stock */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Current Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.currentStock}
                  onChange={(e) =>
                    setFormData({ ...formData, currentStock: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.currentStock ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter current stock amount"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Minimum Stock */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Minimum Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.minimumStock}
                  onChange={(e) =>
                    setFormData({ ...formData, minimumStock: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.minimumStock ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter minimum stock threshold"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Vegetable">Vegetable</option>
                <option value="Meat">Meat</option>
                <option value="Dairy">Dairy</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground">
              Upload Ingredients <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 bg-blue-50/50 flex flex-col items-center justify-center hover:bg-blue-50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                Click to upload or drag and drop
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-200 rounded-full text-foreground font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2 bg-[#0190FE] text-white rounded-full font-semibold hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"
            >
              {mode === "add" ? "+ Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
