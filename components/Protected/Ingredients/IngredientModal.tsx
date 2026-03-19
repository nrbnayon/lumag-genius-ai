"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { readExcel } from "@/lib/excel";
import { useGetAllCategoriesQuery } from "@/redux/services/categoriesApi";
import { 
  useCreateIngredientsMutation, 
  useUpdateIngredientsBulkMutation 
} from "@/redux/services/ingredientsApi";
import type { 
  Ingredient, 
  CreateIngredientPayload, 
  UpdateIngredientPayload 
} from "@/types/ingredients.types";

interface IngredientFormData {
  name: string;
  price: string;
  unit: string;
  categoryId: string; // Storing as string in form for the <select> element
  outletType: string;
  currentStock: string;
  minimumStock: string;
  isSpecial: boolean;
}

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ingredient?: Ingredient | null;
  mode: "add" | "edit";
}

export function IngredientModal({
  isOpen,
  onClose,
  onSuccess,
  ingredient,
  mode,
}: IngredientModalProps) {
  const [formData, setFormData] = useState<IngredientFormData>({
    name: "",
    price: "",
    unit: "",
    categoryId: "",
    outletType: "restaurant",
    currentStock: "",
    minimumStock: "",
    isSpecial: false,
  });

  const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetAllCategoriesQuery();
  const categories = categoriesResponse?.data || [];

  const [createIngredients, { isLoading: isCreating }] = useCreateIngredientsMutation();
  const [updateIngredients, { isLoading: isUpdating }] = useUpdateIngredientsBulkMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [excelFileName, setExcelFileName] = useState<string>("");
  const [pendingCreateData, setPendingCreateData] = useState<CreateIngredientPayload[]>([]);
  const [pendingUpdateData, setPendingUpdateData] = useState<UpdateIngredientPayload[]>([]);

  const [errors, setErrors] = useState<Partial<IngredientFormData>>({});

  const resolveCategoryId = useCallback(
    (category: Ingredient["category"]) => {
      if (typeof category === "number") return category.toString();
      if (typeof category === "string" && category.trim()) {
        const byName = categories.find(
          (c) => c.name.toLowerCase() === category.toLowerCase(),
        );
        if (byName) return byName.id.toString();
      }
      return categories.length > 0 ? categories[0].id.toString() : "";
    },
    [categories],
  );

  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        price: ingredient.price_per_unit || "0",
        unit: ingredient.unit,
        categoryId: resolveCategoryId(ingredient.category),
        outletType: ingredient.outlet_type || "restaurant",
        currentStock: ingredient.current_stock.toString(),
        minimumStock: ingredient.minimum_stock.toString(),
        isSpecial: ingredient.is_special,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        unit: "",
        categoryId: categories.length > 0 ? categories[0].id.toString() : "",
        outletType: "restaurant",
        currentStock: "",
        minimumStock: "",
        isSpecial: false,
      });
      setExcelFileName("");
      setPendingCreateData([]);
      setPendingUpdateData([]);
    }
    setErrors({});
  }, [ingredient, isOpen, categories, resolveCategoryId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFileName(file.name);
      toast.info(`Extracting data from ${file.name}...`);

      try {
        const data = await readExcel(file);

        if (data && data.length > 0) {
          // Process ALL rows for bulk insert/update
          const createPayloads: CreateIngredientPayload[] = [];
          const updatePayloads: UpdateIngredientPayload[] = [];
          
          for (const row of data) {
             const find = (...keys: string[]) => {
               const k = Object.keys(row).find((k) =>
                 keys.some((pk) => k.toLowerCase().includes(pk.toLowerCase())),
               );
               return k ? String(row[k]) : "";
             };

             const rowId = find("id", "ID", "identifier");
             const rawCategory = find("category", "type");
             let matchedCategoryId = categories.length > 0 ? categories[0].id : 1; 
             
             if (rawCategory) {
               const catMatch = categories.find(c => c.name.toLowerCase() === rawCategory.toLowerCase());
               if (catMatch) matchedCategoryId = catMatch.id;
             }
             
             const rawOutlet = find("outlet", "place");
             const outletMatch = rawOutlet.toLowerCase().includes("bar") ? "bar" : "restaurant";

             const parsedPrice = parseFloat(find("price", "cost", "rate")) || 0;
             const parsedCurrentStock = parseFloat(find("stock", "current", "qty", "quantity")) || 0;
             const parsedMinStock = parseFloat(find("min", "threshold", "alert")) || 0;

             if (rowId) {
                updatePayloads.push({
                  id: parseInt(rowId, 10),
                  name: find("name", "ingredient", "item") || "Updated Item",
                  category_id: matchedCategoryId,
                  unit: find("unit", "measurement") || "unit",
                  price_per_unit: parsedPrice.toFixed(2),
                  current_stock: parsedCurrentStock,
                  minimum_stock: parsedMinStock,
                  outlet_type: outletMatch,
                  is_special: find("special", "featured").toLowerCase() === "yes"
                });
             } else {
                createPayloads.push({
                  name: find("name", "ingredient", "item") || "New Item",
                  category_id: matchedCategoryId,
                  unit: find("unit", "measurement") || "unit",
                  price_per_unit: parsedPrice.toFixed(2),
                  current_stock: parsedCurrentStock,
                  minimum_stock: parsedMinStock,
                  outlet_type: outletMatch,
                  is_special: find("special", "featured").toLowerCase() === "yes"
                });
             }
          }

          setPendingCreateData(createPayloads);
          setPendingUpdateData(updatePayloads);

          const totalRows = createPayloads.length + updatePayloads.length;

          // Populate the form with the FIRST row visually so the user can see an example
          if (totalRows > 0) {
            const first = createPayloads[0] || updatePayloads[0];
            setFormData({
              name: first.name,
              price: first.price_per_unit,
              unit: first.unit,
              categoryId: (first as any).category_id.toString(),
              outletType: first.outlet_type,
              currentStock: first.current_stock.toString(),
              minimumStock: first.minimum_stock.toString(),
              isSpecial: first.is_special,
            });
            toast.success(`Loaded ${totalRows} rows from file (${createPayloads.length} new, ${updatePayloads.length} updates)`);
          }
        } else {
          toast.error("No data found in the file.");
        }
      } catch (error) {
        console.error("Excel Read Error:", error);
        toast.error("Failed to process file.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  if (!isOpen) return null;

  const validate = () => {
    // If we have bulk data, skip visual form validation
    if (pendingCreateData.length > 0 || pendingUpdateData.length > 0) return true;

    const newErrors: Partial<IngredientFormData> = {};
    if (!formData.name) newErrors.name = "Name is required" as any;
    if (!formData.price || isNaN(Number(formData.price))) newErrors.price = "Valid price is required" as any;
    if (!formData.unit) newErrors.unit = "Unit is required" as any;
    if (!formData.currentStock || isNaN(Number(formData.currentStock))) newErrors.currentStock = "Required" as any;
    if (!formData.minimumStock || isNaN(Number(formData.minimumStock))) newErrors.minimumStock = "Required" as any;
    if (!formData.categoryId) newErrors.categoryId = "Category is required" as any;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const executeChunkedRequests = async (payloads: CreateIngredientPayload[]) => {
    const CHUNK_SIZE = 500;
    for (let i = 0; i < payloads.length; i += CHUNK_SIZE) {
      const chunk = payloads.slice(i, i + CHUNK_SIZE);
      await createIngredients(chunk).unwrap();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (pendingCreateData.length > 0 || pendingUpdateData.length > 0) {
         // Handle Excel Upload Logic
         if (pendingCreateData.length > 0) {
            await executeChunkedRequests(pendingCreateData);
         }
         if (pendingUpdateData.length > 0) {
            const CHUNK_SIZE = 500;
            for (let i = 0; i < pendingUpdateData.length; i += CHUNK_SIZE) {
               const chunk = pendingUpdateData.slice(i, i + CHUNK_SIZE);
               await updateIngredients(chunk).unwrap();
            }
         }
         toast.success(`Excel Action: ${pendingCreateData.length} Created, ${pendingUpdateData.length} Updated!`);
      }
      else if (mode === "add") {
         // Single insert from form
         const singlePayload: CreateIngredientPayload = {
           name: formData.name,
           price_per_unit: parseFloat(formData.price).toFixed(2),
           unit: formData.unit,
           category_id: parseInt(formData.categoryId, 10),
           outlet_type: formData.outletType,
           current_stock: parseFloat(formData.currentStock),
           minimum_stock: parseFloat(formData.minimumStock),
           is_special: formData.isSpecial
         };
         await createIngredients([singlePayload]).unwrap();
         toast.success("Ingredient added successfully!");
      } 
      else if (mode === "edit" && ingredient) {
         // Edit single item from form
         const updatePayload: UpdateIngredientPayload = {
             id: ingredient.id,
             name: formData.name,
             price_per_unit: parseFloat(formData.price).toFixed(2),
             unit: formData.unit,
             category_id: parseInt(formData.categoryId, 10),
             outlet_type: formData.outletType,
             current_stock: parseFloat(formData.currentStock),
             minimum_stock: parseFloat(formData.minimumStock),
             is_special: formData.isSpecial
         };
         await updateIngredients([updatePayload]).unwrap();
         toast.success("Ingredient updated successfully!");
      }
      
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${mode} ingredient(s).`);
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!isSubmitting ? onClose : undefined} />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-white rounded-[24px] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-foreground">
            {pendingCreateData.length > 0 || pendingUpdateData.length > 0 
               ? "Bulk Import Ingredients" 
               : (mode === "add" ? "Add Ingredient" : "Edit Ingredient")}
          </h2>
          <button
            onClick={!isSubmitting ? onClose : undefined}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className={cn("space-y-4", (pendingCreateData.length > 0 || pendingUpdateData.length > 0) && "opacity-60 pointer-events-none")}>
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">
                Ingredient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={cn(
                  "w-full px-4 py-2 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all font-medium placeholder:text-gray-400",
                  errors.name ? "border-red-500" : "border-gray-200"
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
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all font-medium placeholder:text-gray-400",
                    errors.unit ? "border-red-500" : "border-gray-200"
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
                  type="number"
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all font-medium placeholder:text-gray-400",
                    errors.price ? "border-red-500" : "border-gray-200"
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
                  type="number"
                  min={0}
                  step="0.01"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all font-medium placeholder:text-gray-400",
                    errors.currentStock ? "border-red-500" : "border-gray-200"
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
                  type="number"
                  min={0}
                  step="0.01"
                  value={formData.minimumStock}
                  onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all font-medium placeholder:text-gray-400",
                    errors.minimumStock ? "border-red-500" : "border-gray-200"
                  )}
                  placeholder="Enter minimum stock threshold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  disabled={isLoadingCategories}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none font-medium disabled:opacity-50"
                >
                  {isLoadingCategories ? (
                    <option value="">Loading categories...</option>
                  ) : categories.length === 0 ? (
                    <option value="">No categories available</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
                {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
              </div>

              {/* Outlet Type */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Outlet Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.outletType}
                  onChange={(e) => setFormData({ ...formData, outletType: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none font-medium capitalize"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="bar">Bar</option>
                </select>
              </div>
            </div>

            {/* Is Special Toggle */}
            <div className="flex items-center gap-3 p-4 bg-blue-50/30 rounded-xl border border-blue-100/50">
              <input
                type="checkbox"
                id="isSpecial"
                checked={formData.isSpecial}
                onChange={(e) => setFormData({ ...formData, isSpecial: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="isSpecial" className="text-sm font-bold text-foreground cursor-pointer select-none">
                Mark as Special Ingredient
                <span className="block font-normal text-xs text-secondary mt-0.5">
                  Featured items appear prominently in lists and reports.
                </span>
              </label>
            </div>
          </div>

          {/* Excel Upload Area */}
          <div className="space-y-4 mt-8 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-foreground">
                Excel Sync / Bulk Manage
              </label>
              <button
                type="button"
                onClick={() => {
                  const templateData = [
                    {
                      ID: "",
                      "Ingredient Name": "Sample Chicken",
                      Price: "15.00",
                      Unit: "KG",
                      Category: "Meats",
                      "Outlet Type": "Restaurant",
                      "Current Stock": "100",
                      "Minimum Stock": "20",
                      IsFeatured: "No"
                    }
                  ];
                  import("@/lib/excel").then(m => m.exportToExcel(templateData, "ingredient_template.xlsx", "Template"));
                }}
                className="text-[10px] text-primary font-bold bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
              >
                DOWNLOAD TEMPLATE
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              disabled={isSubmitting}
            />

            <div
              onClick={() => !isSubmitting && fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-blue-50/10 hover:bg-blue-50/50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-transparent flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image
                  src="/icons/excel.png"
                  alt="Excel/CSV"
                  width={40}
                  height={40}
                  onError={(e) => {
                    (e.target as any).src = "https://cdn-icons-png.flaticon.com/512/732/732220.png";
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">
                  {excelFileName || "Upload Excel for Add or Update"}
                </p>
                <p className="text-xs font-medium text-secondary mt-1 uppercase tracking-wider">
                  Includes ID? System will Update. No ID? System will Create.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 sticky bottom-0 bg-white pt-2 pb-2 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-full text-foreground font-bold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
             {isSubmitting ? (
                 <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                pendingCreateData.length > 0 || pendingUpdateData.length > 0 
                  ? `Sync ${pendingCreateData.length + pendingUpdateData.length} records` 
                  : (mode === "add" ? "+ Add" : "Save")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
