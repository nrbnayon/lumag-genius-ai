"use client";

import { useEffect, useState, useRef } from "react";
import { X, UploadCloud, Trash2, Camera, Plus } from "lucide-react";
import { Recipe, RecipeFormData, RecipeIngredient } from "@/types/recipe";
import { cn } from "@/lib/utils";

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: RecipeFormData) => void;
  recipe?: Recipe | null;
  mode: "add" | "edit";
}

export function RecipeModal({
  isOpen,
  onClose,
  onConfirm,
  recipe,
  mode,
}: RecipeModalProps) {
  const [formData, setFormData] = useState<RecipeFormData>({
    name: "",
    cookingTime: "",
    sellingPrice: "",
    instruction: "",
    ingredients: [{ name: "", quantity: "", unit: "", cost: "" }],
    image: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RecipeFormData | "ingredients", string>>
  >({});

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        cookingTime: recipe.cookingTime,
        sellingPrice: recipe.sellingPrice,
        instruction: recipe.instruction,
        ingredients:
          recipe.ingredients.length > 0
            ? [...recipe.ingredients]
            : [{ name: "", quantity: "", unit: "", cost: "" }],
        image: null,
      });
      setPreview(recipe.image || null);
    } else {
      setFormData({
        name: "",
        cookingTime: "",
        sellingPrice: "",
        instruction: "",
        ingredients: [{ name: "", quantity: "", unit: "", cost: "" }],
        image: null,
      });
      setPreview(null);
    }
    setErrors({});
  }, [recipe, isOpen]);

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

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name: "", quantity: "", unit: "", cost: "" },
      ],
    }));
  };

  const updateIngredient = (
    index: number,
    field: keyof RecipeIngredient,
    value: string,
  ) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index),
      }));
    }
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Required";
    if (!formData.cookingTime) newErrors.cookingTime = "Required";
    if (!formData.sellingPrice) newErrors.sellingPrice = "Required";
    if (!formData.instruction) newErrors.instruction = "Required";

    const validIngredients = formData.ingredients.every(
      (i) => i.name && i.quantity && i.unit && i.cost,
    );
    if (!validIngredients)
      newErrors.ingredients = "All ingredient fields are required";

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

  const totalIngredientsCost = formData.ingredients.reduce((acc, curr) => {
    const cost = parseFloat(curr.cost.replace(/[^0-9.-]+/g, ""));
    return acc + (isNaN(cost) ? 0 : cost);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-foreground">
            {mode === "add" ? "Add Recipe" : "Edit Recipe"}
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
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Recipe Name
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
                placeholder="Enter recipe name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Avg. Time
                </label>
                <input
                  type="text"
                  value={formData.cookingTime}
                  onChange={(e) =>
                    setFormData({ ...formData, cookingTime: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                    errors.cookingTime ? "border-red-500" : "border-gray-200",
                  )}
                  placeholder="e.g. 20min"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Selling Cost
                </label>
                <input
                  type="text"
                  value={formData.sellingPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, sellingPrice: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                    errors.sellingPrice ? "border-red-500" : "border-gray-200",
                  )}
                  placeholder="e.g. $45"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Instruction
              </label>
              <textarea
                value={formData.instruction}
                onChange={(e) =>
                  setFormData({ ...formData, instruction: e.target.value })
                }
                rows={3}
                className={cn(
                  "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none",
                  errors.instruction ? "border-red-500" : "border-gray-200",
                )}
                placeholder="Enter recipe instructions"
              />
            </div>

            {/* Ingredients Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Add Ingredients
                </label>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="flex items-center gap-1 text-sm font-bold text-[#0EA5E9] hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs uppercase font-bold text-secondary px-1">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-3 text-center">Unit</div>
                  <div className="col-span-2 text-center">Cost</div>
                  <div className="col-span-1"></div>
                </div>

                {formData.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <input
                      type="text"
                      value={ing.name}
                      placeholder="Tomato"
                      onChange={(e) =>
                        updateIngredient(idx, "name", e.target.value)
                      }
                      className="col-span-4 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      value={ing.quantity}
                      placeholder="100"
                      onChange={(e) =>
                        updateIngredient(idx, "quantity", e.target.value)
                      }
                      className="col-span-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none text-center"
                    />
                    <input
                      type="text"
                      value={ing.unit}
                      placeholder="gm"
                      onChange={(e) =>
                        updateIngredient(idx, "unit", e.target.value)
                      }
                      className="col-span-3 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none text-center"
                    />
                    <input
                      type="text"
                      value={ing.cost}
                      placeholder="$10"
                      onChange={(e) =>
                        updateIngredient(idx, "cost", e.target.value)
                      }
                      className="col-span-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none text-center"
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(idx)}
                      disabled={formData.ingredients.length === 1}
                      className="col-span-1 flex justify-center text-gray-400 hover:text-red-500 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="flex justify-end pt-1 pr-12 gap-4">
                  <span className="text-xs font-bold text-secondary">
                    Total
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    ${totalIngredientsCost}
                  </span>
                </div>
              </div>
              {errors.ingredients && (
                <p className="text-xs text-red-500">{errors.ingredients}</p>
              )}
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-secondary">Or</span>
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
                  ? "border-primary bg-blue-50"
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
                  <p className="text-sm font-medium text-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-secondary">Max. File Size: 50MB</p>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-gray-200 rounded-xl text-foreground font-bold hover:bg-gray-50 transition-colors"
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
