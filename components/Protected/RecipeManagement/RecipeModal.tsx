"use client";

import { useEffect, useState, useRef } from "react";
import { X, Trash2, Plus } from "lucide-react";
import { Recipe, RecipeFormData, RecipeIngredient } from "@/types/recipe";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { read, utils as xlsxUtils } from "xlsx";

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [excelFileName, setExcelFileName] = useState<string>("");
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
    } else {
      setFormData({
        name: "",
        cookingTime: "",
        sellingPrice: "",
        instruction: "",
        ingredients: [{ name: "", quantity: "", unit: "", cost: "" }],
        image: null,
      });
      setExcelFileName("");
    }
    setErrors({});
  }, [recipe, isOpen]);

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
            const firstRow = data[0];
            const find = (row: any, ...keys: string[]) => {
              if (!row) return "";
              const k = Object.keys(row).find((k) =>
                keys.some((pk) => k.toLowerCase().includes(pk.toLowerCase())),
              );
              return k ? String(row[k]) : "";
            };

            // Main recipe details from first row
            const newName =
              find(firstRow, "recipe", "name", "dish") || formData.name;
            const newTime =
              find(firstRow, "time", "duration") || formData.cookingTime;
            const newPrice =
              find(firstRow, "price", "selling", "cost") ||
              formData.sellingPrice;
            const newInstruction =
              find(firstRow, "instruction", "method", "steps") ||
              formData.instruction;

            // Ingredients could be multiple rows
            const extractedIngredients: RecipeIngredient[] = [];
            data.forEach((row) => {
              const ingName = find(row, "ingredient", "item");
              if (ingName) {
                extractedIngredients.push({
                  name: ingName,
                  quantity: find(row, "quantity", "qty", "amt"),
                  unit: find(row, "unit", "meas"),
                  cost: find(row, "ingredient cost", "cost", "price"),
                });
              }
            });

            setFormData((prev) => ({
              ...prev,
              name: newName,
              cookingTime: newTime,
              sellingPrice: newPrice,
              instruction: newInstruction,
              ingredients:
                extractedIngredients.length > 0
                  ? extractedIngredients
                  : prev.ingredients,
            }));

            toast.success("Recipe auto-filled successfully!");
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
    const costStr = curr.cost
      ? String(curr.cost).replace(/[^0-9.-]+/g, "")
      : "0";
    const cost = parseFloat(costStr);
    return acc + (isNaN(cost) ? 0 : cost);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
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
              <label className="block text-sm font-bold text-foreground mb-1.5">
                Recipe Name <span className="text-red-500">*</span>
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
                placeholder="Enter recipe name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Avg. Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.cookingTime}
                  onChange={(e) =>
                    setFormData({ ...formData, cookingTime: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium placeholder:text-gray-300",
                    errors.cookingTime ? "border-red-500" : "border-gray-200",
                  )}
                  placeholder="e.g. 20min"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Selling Cost <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sellingPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, sellingPrice: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium placeholder:text-gray-300",
                    errors.sellingPrice ? "border-red-500" : "border-gray-200",
                  )}
                  placeholder="e.g. $45"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">
                Instruction <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.instruction}
                onChange={(e) =>
                  setFormData({ ...formData, instruction: e.target.value })
                }
                rows={3}
                className={cn(
                  "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium placeholder:text-gray-300 resize-none",
                  errors.instruction ? "border-red-500" : "border-gray-200",
                )}
                placeholder="Enter recipe instructions"
              />
            </div>

            {/* Ingredients Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-foreground">
                  Add Ingredients
                </label>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="flex items-center gap-1 text-sm font-bold text-primary hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold text-secondary px-1 tracking-wider">
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
                      className="col-span-4 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none font-medium"
                    />
                    <input
                      type="text"
                      value={ing.quantity}
                      placeholder="100"
                      onChange={(e) =>
                        updateIngredient(idx, "quantity", e.target.value)
                      }
                      className="col-span-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none text-center font-medium"
                    />
                    <input
                      type="text"
                      value={ing.unit}
                      placeholder="gm"
                      onChange={(e) =>
                        updateIngredient(idx, "unit", e.target.value)
                      }
                      className="col-span-3 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none text-center font-medium"
                    />
                    <input
                      type="text"
                      value={ing.cost}
                      placeholder="$10"
                      onChange={(e) =>
                        updateIngredient(idx, "cost", e.target.value)
                      }
                      className="col-span-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none text-center font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(idx)}
                      disabled={formData.ingredients.length === 1}
                      className="col-span-1 flex justify-center text-gray-400 hover:text-red-500 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="flex justify-end pt-2 pr-12 gap-4">
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                    Total
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    ${totalIngredientsCost}
                  </span>
                </div>
              </div>
              {errors.ingredients && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.ingredients}
                </p>
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
                Upload Recipe <span className="text-red-500">*</span>
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
              className="flex-1 px-6 py-2.5 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-colors cursor-pointer shadow-sm"
            >
              {mode === "add" ? "+ Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
