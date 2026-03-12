// "use client";

// import { useEffect, useState, useRef } from "react";
// import { X, Trash2, Plus, Check } from "lucide-react";
// import {
//   Recipe,
//   CreateRecipePayload,
//   UpdateRecipePayload,
// } from "@/types/recipes.types";
// import { cn } from "@/lib/utils";
// import Image from "next/image";
// import { toast } from "sonner";
// import { readExcel } from "@/lib/excel";
// import {
//   useCreateRecipesMutation,
//   useUpdateRecipesBulkMutation,
// } from "@/redux/services/recipesApi";

// interface RecipeFormData {
//   name: string;
//   cookingTime: string;
//   sellingPrice: string;
//   instruction: string;
//   description?: string;
//   outletType: string;
//   ingredients: {
//     id?: number;
//     ingredient: string;
//     quantity: string;
//     unit: string;
//     cost: string;
//   }[];
//   image: File | null;
// }

// interface RecipeModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   recipe?: Recipe | null;
//   mode: "add" | "edit";
// }

// export function RecipeModal({
//   isOpen,
//   onClose,
//   onSuccess,
//   recipe,
//   mode,
// }: RecipeModalProps) {
//   const [formData, setFormData] = useState<RecipeFormData>({
//     name: "",
//     cookingTime: "",
//     sellingPrice: "",
//     instruction: "",
//     description: "",
//     outletType: "restaurant",
//     ingredients: [{ ingredient: "", quantity: "", unit: "", cost: "" }],
//     image: null,
//   });

//   const [createRecipes, { isLoading: isCreating }] = useCreateRecipesMutation();
//   const [updateRecipes, { isLoading: isUpdating }] =
//     useUpdateRecipesBulkMutation();

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [excelFileName, setExcelFileName] = useState<string>("");
//   const [pendingCreateData, setPendingCreateData] = useState<
//     CreateRecipePayload[]
//   >([]);
//   const [pendingUpdateData, setPendingUpdateData] = useState<
//     UpdateRecipePayload[]
//   >([]);

//   const [errors, setErrors] = useState<
//     Partial<Record<keyof RecipeFormData | "ingredients", string>>
//   >({});

//   useEffect(() => {
//     if (recipe) {
//       setFormData({
//         name: recipe.name,
//         cookingTime: recipe.avg_time.toString(),
//         sellingPrice: recipe.selling_cost,
//         instruction: recipe.instruction,
//         description: recipe.description || "",
//         outletType: recipe.outlet_type || "restaurant",
//         ingredients:
//           recipe.ingredients.length > 0
//             ? recipe.ingredients.map((i) => ({
//                 id: i.id,
//                 ingredient: i.ingredient,
//                 quantity: i.quantity.toString(),
//                 unit: i.unit,
//                 cost: i.cost.toString(),
//               }))
//             : [{ ingredient: "", quantity: "", unit: "", cost: "" }],
//         image: null,
//       });
//     } else {
//       setFormData({
//         name: "",
//         cookingTime: "",
//         sellingPrice: "",
//         instruction: "",
//         description: "",
//         outletType: "restaurant",
//         ingredients: [{ ingredient: "", quantity: "", unit: "", cost: "" }],
//         image: null,
//       });
//       setExcelFileName("");
//       setPendingCreateData([]);
//       setPendingUpdateData([]);
//     }
//     setErrors({});
//   }, [recipe, isOpen]);

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setExcelFileName(file.name);
//       toast.info(`Extracting data from ${file.name}...`);

//       try {
//         const data = await readExcel(file);

//         if (data && data.length > 0) {
//           const allRecipes: (CreateRecipePayload | UpdateRecipePayload)[] = [];
//           let currentRecipe: any = null;

//           const find = (r: any, ...keys: string[]) => {
//             const k = Object.keys(r).find((k) =>
//               keys.some((pk) => k.toLowerCase().includes(pk.toLowerCase())),
//             );
//             return k ? String(r[k]) : "";
//           };

//           data.forEach((row: any) => {
//             const id = find(row, "id");
//             const name = find(row, "recipe name", "name", "dish");
//             const ingredientName = find(row, "ingredient name", "ingredient");

//             if (id || name) {
//               const avg_time = parseInt(
//                 find(row, "avg time", "cooking time", "time") || "0",
//               );
//               const instruction = find(row, "instruction", "method");
//               const description = find(row, "description");
//               const selling_cost = parseFloat(
//                 find(row, "selling cost", "selling price", "price") || "0",
//               );
//               const outlet_type =
//                 find(row, "outlet type", "outlet_type").toLowerCase() ||
//                 "restaurant";

//               currentRecipe = {
//                 ...(id ? { id: parseInt(id) } : {}),
//                 name: name || "",
//                 avg_time: isNaN(avg_time) ? 0 : avg_time,
//                 instruction: instruction || "",
//                 description: description || "",
//                 selling_cost: isNaN(selling_cost) ? 0 : selling_cost,
//                 outlet_type: outlet_type || "restaurant",
//                 ingredients: [],
//               };
//               allRecipes.push(currentRecipe);
//             }

//             if (currentRecipe && ingredientName) {
//               const qty = parseFloat(find(row, "quantity", "qty") || "0");
//               const unit = find(row, "unit");
//               const cost = parseFloat(find(row, "cost") || "0");

//               currentRecipe.ingredients.push({
//                 ingredient: ingredientName,
//                 quantity: isNaN(qty) ? 0 : qty,
//                 unit: unit || "",
//                 cost: isNaN(cost) ? 0 : cost,
//               });
//             }
//           });

//           const createData = allRecipes.filter(
//             (r) => !("id" in r),
//           ) as CreateRecipePayload[];
//           const updateData = allRecipes.filter(
//             (r) => "id" in r,
//           ) as UpdateRecipePayload[];

//           if (allRecipes.length > 0) {
//             setPendingCreateData(createData);
//             setPendingUpdateData(updateData);

//             const first = allRecipes[0];
//             const firstIngredients = first.ingredients || [];

//             setFormData({
//               name: first.name || "",
//               cookingTime: first.avg_time?.toString() || "",
//               sellingPrice: first.selling_cost?.toString() || "",
//               instruction: first.instruction || "",
//               description: first.description || "",
//               outletType: first.outlet_type || "restaurant",
//               ingredients:
//                 firstIngredients.length > 0
//                   ? firstIngredients.map((i) => ({
//                       ingredient: i.ingredient || "",
//                       quantity: i.quantity.toString() || "",
//                       unit: i.unit || "",
//                       cost: i.cost.toString() || "",
//                     }))
//                   : [{ ingredient: "", quantity: "", unit: "", cost: "" }],
//               image: null,
//             });

//             toast.success(`Staged ${allRecipes.length} recipes from Excel!`);
//           }
//         } else {
//           toast.error("No data found in the file.");
//         }
//       } catch (error) {
//         console.error("Excel Read Error:", error);
//         toast.error("Failed to process file.");
//       } finally {
//         if (fileInputRef.current) fileInputRef.current.value = "";
//       }
//     }
//   };

//   const addIngredient = () => {
//     setFormData((prev) => ({
//       ...prev,
//       ingredients: [
//         ...prev.ingredients,
//         { ingredient: "", quantity: "", unit: "", cost: "" },
//       ],
//     }));
//   };

//   const updateIngredient = (
//     index: number,
//     field: "ingredient" | "quantity" | "unit" | "cost",
//     value: string,
//   ) => {
//     const newIngredients = [...formData.ingredients];
//     newIngredients[index] = { ...newIngredients[index], [field]: value };
//     setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
//   };

//   const removeIngredient = (index: number) => {
//     if (formData.ingredients.length > 1) {
//       setFormData((prev) => ({
//         ...prev,
//         ingredients: prev.ingredients.filter((_, i) => i !== index),
//       }));
//     }
//   };

//   const validate = () => {
//     const newErrors: any = {};
//     if (!formData.name) newErrors.name = "Required";
//     if (!formData.cookingTime) newErrors.cookingTime = "Required";
//     if (!formData.sellingPrice) newErrors.sellingPrice = "Required";
//     if (!formData.instruction) newErrors.instruction = "Required";

//     const validIngredients = formData.ingredients.every(
//       (i) => i.ingredient && i.quantity && i.unit && i.cost,
//     );
//     if (!validIngredients)
//       newErrors.ingredients = "All ingredient fields are required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const executeBulkRequests = async (data: CreateRecipePayload[]) => {
//     const CHUNK_SIZE = 500;
//     for (let i = 0; i < data.length; i += CHUNK_SIZE) {
//       const chunk = data.slice(i, i + CHUNK_SIZE);
//       await createRecipes(chunk).unwrap();
//     }
//   };

//   const executeBulkUpdates = async (data: UpdateRecipePayload[]) => {
//     const CHUNK_SIZE = 500;
//     for (let i = 0; i < data.length; i += CHUNK_SIZE) {
//       const chunk = data.slice(i, i + CHUNK_SIZE);
//       await updateRecipes(chunk).unwrap();
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       if (pendingCreateData.length > 0 || pendingUpdateData.length > 0) {
//         if (pendingCreateData.length > 0)
//           await executeBulkRequests(pendingCreateData);
//         if (pendingUpdateData.length > 0)
//           await executeBulkUpdates(pendingUpdateData);
//         toast.success("Excel synchronization complete!");
//       } else {
//         const payload = {
//           name: formData.name,
//           avg_time: parseInt(formData.cookingTime),
//           selling_cost: parseFloat(formData.sellingPrice),
//           instruction: formData.instruction,
//           description: formData.description,
//           outlet_type: formData.outletType,
//           ingredients: formData.ingredients.map((i) => ({
//             id: i.id,
//             ingredient: i.ingredient,
//             quantity: parseFloat(i.quantity),
//             unit: i.unit,
//             cost: parseFloat(i.cost),
//           })),
//         };

//         if (mode === "add") {
//           await createRecipes([payload]).unwrap();
//           toast.success("Recipe added successfully!");
//         } else if (recipe) {
//           await updateRecipes([{ ...payload, id: recipe.id }]).unwrap();
//           toast.success("Recipe updated successfully!");
//         }
//       }
//       onSuccess();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to save recipe.");
//     }
//   };

//   if (!isOpen) return null;

//   const totalIngredientsCost = formData.ingredients.reduce((acc, curr) => {
//     const costStr = curr.cost
//       ? String(curr.cost).replace(/[^0-9.-]+/g, "")
//       : "0";
//     const cost = parseFloat(costStr);
//     return acc + (isNaN(cost) ? 0 : cost);
//   }, 0);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//         onClick={onClose}
//       />
//       <div className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[95vh] flex flex-col border-none">
//         <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
//           <div className="flex flex-col">
//             <h2 className="text-2xl font-bold text-foreground leading-none">
//               {pendingCreateData.length > 0 || pendingUpdateData.length > 0
//                 ? `Syncing ${pendingCreateData.length + pendingUpdateData.length} Recipes`
//                 : mode === "add"
//                   ? "Create New Recipe"
//                   : "Update Recipe Settings"}
//             </h2>
//             <p className="text-xs text-secondary mt-2 font-medium">
//               Complete the information below or sync with Excel
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all cursor-pointer group"
//           >
//             <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
//           </button>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="flex-1 flex flex-col overflow-hidden"
//         >
//           <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
//                 <div className="space-y-2">
//                   <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-1">
//                     Recipe Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, name: e.target.value })
//                     }
//                     className={cn(
//                       "w-full px-5 py-3 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold placeholder:text-gray-300 shadow-sm bg-white",
//                       errors.name ? "border-red-500" : "border-gray-200",
//                     )}
//                     placeholder="Enter recipe name"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-1">
//                     Outlet Type <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex gap-2 p-1.5 bg-white border border-gray-200 rounded-2xl shadow-sm">
//                     {[
//                       { id: "restaurant", label: "Restaurant" },
//                       { id: "bar", label: "The Bar" },
//                     ].map((type) => (
//                       <button
//                         key={type.id}
//                         type="button"
//                         onClick={() =>
//                           setFormData({ ...formData, outletType: type.id })
//                         }
//                         className={cn(
//                           "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
//                           formData.outletType === type.id
//                             ? "bg-primary text-white shadow-md shadow-primary/20"
//                             : "text-secondary hover:bg-gray-50 hover:text-primary",
//                         )}
//                       >
//                         {type.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
//                 <div className="space-y-2">
//                   <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-1">
//                     Avg. Time (min) <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.cookingTime}
//                     onChange={(e) =>
//                       setFormData({ ...formData, cookingTime: e.target.value })
//                     }
//                     className={cn(
//                       "w-full px-5 py-3 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold placeholder:text-gray-300 shadow-sm bg-white",
//                       errors.cookingTime ? "border-red-500" : "border-gray-200",
//                     )}
//                     placeholder="e.g. 20"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-1">
//                     Selling Cost ($) <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative group">
//                     <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
//                       $
//                     </span>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={formData.sellingPrice}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           sellingPrice: e.target.value,
//                         })
//                       }
//                       className={cn(
//                         "w-full pl-9 pr-5 py-3 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold placeholder:text-gray-300 shadow-sm bg-white",
//                         errors.sellingPrice
//                           ? "border-red-500"
//                           : "border-gray-200",
//                       )}
//                       placeholder="e.g. 45"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
//                 <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
//                   Instruction <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={formData.instruction}
//                   onChange={(e) =>
//                     setFormData({ ...formData, instruction: e.target.value })
//                   }
//                   rows={3}
//                   className={cn(
//                     "w-full px-5 py-3 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold placeholder:text-gray-300 shadow-sm bg-white resize-none",
//                     errors.instruction ? "border-red-500" : "border-gray-200",
//                   )}
//                   placeholder="Enter recipe instructions"
//                 />
//               </div>
//
//               <div className="bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
//                 <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData({ ...formData, description: e.target.value })
//                   }
//                   rows={3}
//                   className={cn(
//                     "w-full px-5 py-3 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold placeholder:text-gray-300 shadow-sm bg-white resize-none",
//                     "border-gray-200",
//                   )}
//                   placeholder="Enter recipe description"
//                 />
//               </div>

//               {/* Ingredients Section */}
//               <div className="bg-gray-50/50 p-5 rounded-3xl border border-gray-100 space-y-4">
//                 <div className="flex items-center justify-between">
//                   <label className="text-sm font-bold text-foreground">
//                     Recipe Ingredients
//                   </label>
//                   <button
//                     type="button"
//                     onClick={addIngredient}
//                     className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-primary bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100"
//                   >
//                     <Plus className="w-3.5 h-3.5" /> Add Ingredient
//                   </button>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="grid grid-cols-12 gap-3 text-[10px] uppercase font-black text-secondary/50 px-4 tracking-widest">
//                     <div className="col-span-4">Ingredient</div>
//                     <div className="col-span-2 text-center">Qty</div>
//                     <div className="col-span-3 text-center">Unit</div>
//                     <div className="col-span-2 text-center">Cost</div>
//                     <div className="col-span-1"></div>
//                   </div>

//                   <div className="space-y-2">
//                     {formData.ingredients.map((ing, idx) => (
//                       <div
//                         key={idx}
//                         className="grid grid-cols-12 gap-3 items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm hover:border-primary/30 transition-all"
//                       >
//                         <input
//                           type="text"
//                           value={ing.ingredient}
//                           placeholder="Tomato"
//                           onChange={(e) =>
//                             updateIngredient(idx, "ingredient", e.target.value)
//                           }
//                           className="col-span-4 px-4 py-2.5 text-sm border-none bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none font-bold"
//                         />
//                         <input
//                           type="number"
//                           min={0}
//                           value={ing.quantity}
//                           placeholder="100"
//                           onChange={(e) =>
//                             updateIngredient(idx, "quantity", e.target.value)
//                           }
//                           className="col-span-2 px-3 py-2.5 text-sm border-none bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-center font-bold"
//                         />
//                         <input
//                           type="text"
//                           value={ing.unit}
//                           placeholder="gm"
//                           onChange={(e) =>
//                             updateIngredient(idx, "unit", e.target.value)
//                           }
//                           className="col-span-3 px-3 py-2.5 text-sm border-none bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-center font-bold"
//                         />
//                         <input
//                           type="number"
//                           min={0}
//                           value={ing.cost}
//                           placeholder="10"
//                           onChange={(e) =>
//                             updateIngredient(idx, "cost", e.target.value)
//                           }
//                           className="col-span-2 px-3 py-2.5 text-sm border-none bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-center font-bold"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeIngredient(idx)}
//                           disabled={formData.ingredients.length === 1}
//                           className="col-span-1 flex justify-center text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="flex justify-between items-center p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mt-4">
//                     <span className="text-[10px] font-black text-secondary uppercase tracking-widest">
//                       Total Estimated Recipe Cost:
//                     </span>
//                     <span className="text-lg font-black text-primary">
//                       ${totalIngredientsCost.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//                 {errors.ingredients && (
//                   <p className="text-xs text-red-500 mt-1 font-bold">
//                     {errors.ingredients}
//                   </p>
//                 )}
//               </div>

//               <div className="relative py-4">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t border-gray-200" />
//                 </div>
//                 <div className="relative flex justify-center text-[10px] font-black text-gray-400 uppercase tracking-[.3em]">
//                   <span className="bg-white px-6 rounded-full border border-gray-100 py-1">
//                     Direct Sync
//                   </span>
//                 </div>
//               </div>

//               {/* Excel Upload Area */}
//               <div className="space-y-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
//                 <div className="flex items-center justify-between">
//                   <label className="flex items-center gap-2 text-sm font-bold text-foreground">
//                     Excel Synchronization
//                   </label>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       const templateData = [
//                         {
//                           ID: "",
//                           "Recipe Name": "Beef Burger",
//                           "Avg Time": "30",
//                           "Selling Cost": "15.00",
//                           Instruction: "Grill meat, assemble with bun.",
//                           Description: "Gourmet beef burger with cheese.",
//                           "Outlet Type": "restaurant",
//                         },
//                       ];
//                       import("@/lib/excel").then((m) =>
//                         m.exportToExcel(
//                           templateData,
//                           "recipe_template.xlsx",
//                           "Template",
//                         ),
//                       );
//                     }}
//                     className="text-[10px] text-primary font-black bg-blue-50 px-3 py-2 rounded-xl border border-blue-100 uppercase tracking-widest hover:bg-blue-100 transition-colors cursor-pointer"
//                   >
//                     Download Template
//                   </button>
//                 </div>

//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   className="hidden"
//                   accept=".xlsx,.xls,.csv"
//                   onChange={handleFileUpload}
//                 />

//                 <div
//                   onClick={() => fileInputRef.current?.click()}
//                   className={cn(
//                     "border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group relative overflow-hidden shadow-inner",
//                     excelFileName
//                       ? "bg-blue-50/30 border-blue-400 animate-in fade-in duration-500"
//                       : "bg-blue-50/10 border-blue-200 hover:bg-blue-50/30 hover:border-blue-400",
//                   )}
//                 >
//                   <div
//                     className={cn(
//                       "p-4 rounded-2xl shadow-sm border transition-all relative z-10 bg-white",
//                       excelFileName
//                         ? "text-blue-500 border-blue-400 scale-110 shadow-blue-100"
//                         : "text-blue-500 border-blue-100 group-hover:scale-110 group-hover:bg-blue-50",
//                     )}
//                   >
//                     {excelFileName ? (
//                       <div className="relative">
//                         <Image
//                           src="/icons/excel.png"
//                           alt="Excel/CSV"
//                           width={32}
//                           height={32}
//                           onError={(e) => {
//                             (e.target as any).src =
//                               "https://cdn-icons-png.flaticon.com/512/732/732220.png";
//                           }}
//                         />
//                         <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
//                           <Check className="w-3 h-3" />
//                         </div>
//                       </div>
//                     ) : (
//                       <Image
//                         src="/icons/excel.png"
//                         alt="Excel/CSV"
//                         width={32}
//                         height={32}
//                         onError={(e) => {
//                           (e.target as any).src =
//                             "https://cdn-icons-png.flaticon.com/512/732/732220.png";
//                         }}
//                       />
//                     )}
//                   </div>
//                   <div className="text-center relative z-10">
//                     <p
//                       className={cn(
//                         "text-base font-black transition-colors",
//                         excelFileName ? "text-blue-700" : "text-foreground",
//                       )}
//                     >
//                       {excelFileName
//                         ? `Selected: ${excelFileName}`
//                         : "Upload technical sheet for sync"}
//                     </p>
//                     {excelFileName ? (
//                       <div className="flex flex-col items-center gap-2 mt-2">
//                         <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wider">
//                           {pendingCreateData.length + pendingUpdateData.length}{" "}
//                           Recipe(s) Staged
//                         </span>
//                         <p className="text-[10px] font-bold text-blue-600/60 uppercase tracking-tight">
//                           Click to change file
//                         </p>
//                       </div>
//                     ) : (
//                       <p className="text-xs font-bold text-secondary mt-2 opacity-60">
//                         XLSX, XLS, CSV format supported
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Sticky Footer */}
//           <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4 mt-auto">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-8 py-4 border-2 border-gray-200 rounded-2xl text-secondary font-black hover:bg-white hover:border-gray-300 transition-all cursor-pointer text-sm"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isCreating || isUpdating}
//               className="flex-1 px-8 py-4 bg-primary text-white rounded-2xl font-black hover:bg-blue-600 transition-all cursor-pointer shadow-xl hover:shadow-primary/30 transform active:scale-95 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {isCreating || isUpdating
//                 ? "Processing..."
//                 : pendingCreateData.length > 0 || pendingUpdateData.length > 0
//                   ? `Sync ${pendingCreateData.length + pendingUpdateData.length} Items`
//                   : mode === "add"
//                     ? "Create Recipe"
//                     : "Save Changes"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// ---------- Bellow original minial simple design -------
"use client";

import { useEffect, useState, useRef } from "react";
import { X, Trash2, Plus } from "lucide-react";
import {
  Recipe,
  CreateRecipePayload,
  UpdateRecipePayload,
} from "@/types/recipes.types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { readExcel } from "@/lib/excel";
import {
  useCreateRecipesMutation,
  useUpdateRecipesBulkMutation,
} from "@/redux/services/recipesApi";

interface RecipeFormData {
  name: string;
  description?: string;
  cookingTime: string;
  sellingPrice: string;
  instruction: string;
  outletType: string;
  ingredients: {
    id?: number;
    ingredient: string;
    quantity: string;
    unit: string;
    cost: string;
  }[];
  image: File | null;
}

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  recipe?: Recipe | null;
  mode: "add" | "edit";
}

export function RecipeModal({
  isOpen,
  onClose,
  onSuccess,
  recipe,
  mode,
}: RecipeModalProps) {
  const [formData, setFormData] = useState<RecipeFormData>({
    name: "",
    description: "",
    cookingTime: "",
    sellingPrice: "",
    instruction: "",
    outletType: "restaurant",
    ingredients: [{ ingredient: "", quantity: "", unit: "", cost: "" }],
    image: null,
  });

  const [createRecipes, { isLoading: isCreating }] = useCreateRecipesMutation();
  const [updateRecipes, { isLoading: isUpdating }] =
    useUpdateRecipesBulkMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [excelFileName, setExcelFileName] = useState<string>("");
  const [pendingCreateData, setPendingCreateData] = useState<
    CreateRecipePayload[]
  >([]);
  const [pendingUpdateData, setPendingUpdateData] = useState<
    UpdateRecipePayload[]
  >([]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof RecipeFormData | "ingredients", string>>
  >({});

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        description: recipe?.description || "",
        cookingTime: recipe.avg_time.toString(),
        sellingPrice: recipe.selling_cost,
        instruction: recipe.instruction,
        outletType: recipe.outlet_type || "restaurant",
        ingredients:
          recipe.ingredients.length > 0
            ? recipe.ingredients.map((i) => ({
                id: i.id,
                ingredient: i.ingredient,
                quantity: i.quantity.toString(),
                unit: i.unit,
                cost: i.cost.toString(),
              }))
            : [{ ingredient: "", quantity: "", unit: "", cost: "" }],
        image: null,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        cookingTime: "",
        sellingPrice: "",
        instruction: "",
        outletType: "restaurant",
        ingredients: [{ ingredient: "", quantity: "", unit: "", cost: "" }],
        image: null,
      });
      setExcelFileName("");
      setPendingCreateData([]);
      setPendingUpdateData([]);
    }
    setErrors({});
  }, [recipe, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFileName(file.name);
      toast.info(`Extracting data from ${file.name}...`);

      try {
        const data = await readExcel(file);

        if (data && data.length > 0) {
          const allRecipes: (CreateRecipePayload | UpdateRecipePayload)[] = [];
          let currentRecipe: any = null;

          const find = (r: any, ...keys: string[]) => {
            const k = Object.keys(r).find((k) =>
              keys.some((pk) => k.toLowerCase().includes(pk.toLowerCase())),
            );
            return k ? String(r[k]) : "";
          };

          data.forEach((row: any) => {
            const id = find(row, "id");
            const name = find(row, "recipe name", "name", "dish");
            const ingredientName = find(row, "ingredient name", "ingredient");

            if (id || name) {
              const avg_time = parseInt(
                find(row, "avg time", "cooking time", "time") || "0",
              );
              const instruction = find(row, "instruction", "method");
              const description = find(row, "description");
              const selling_cost = parseFloat(
                find(row, "selling cost", "selling price", "price") || "0",
              );
              const outlet_type =
                find(row, "outlet type", "outlet_type").toLowerCase() ||
                "restaurant";

              currentRecipe = {
                ...(id ? { id: parseInt(id) } : {}),
                name: name || "",
                avg_time: isNaN(avg_time) ? 0 : avg_time,
                instruction: instruction || "",
                description: description || "",
                selling_cost: isNaN(selling_cost) ? 0 : selling_cost,
                outlet_type: outlet_type || "restaurant",
                ingredients: [],
              };
              allRecipes.push(currentRecipe);
            }

            if (currentRecipe && ingredientName) {
              const qty = parseFloat(find(row, "quantity", "qty") || "0");
              const unit = find(row, "unit");
              const cost = parseFloat(find(row, "cost") || "0");

              currentRecipe.ingredients.push({
                ingredient: ingredientName,
                quantity: isNaN(qty) ? 0 : qty,
                unit: unit || "",
                cost: isNaN(cost) ? 0 : cost,
              });
            }
          });

          const createData = allRecipes.filter(
            (r) => !("id" in r),
          ) as CreateRecipePayload[];
          const updateData = allRecipes.filter(
            (r) => "id" in r,
          ) as UpdateRecipePayload[];

          if (allRecipes.length > 0) {
            setPendingCreateData(createData);
            setPendingUpdateData(updateData);

            const first = allRecipes[0];
            const firstIngredients = first.ingredients || [];

            setFormData({
              name: first.name || "",
              cookingTime: first.avg_time?.toString() || "",
              sellingPrice: first.selling_cost?.toString() || "",
              instruction: first.instruction || "",
              description: first.description || "",
              outletType: first.outlet_type || "restaurant",
              ingredients:
                firstIngredients.length > 0
                  ? firstIngredients.map((i) => ({
                      ingredient: i.ingredient || "",
                      quantity: i.quantity.toString() || "",
                      unit: i.unit || "",
                      cost: i.cost.toString() || "",
                    }))
                  : [{ ingredient: "", quantity: "", unit: "", cost: "" }],
              image: null,
            });

            toast.success(`Staged ${allRecipes.length} recipes from Excel!`);
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

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { ingredient: "", quantity: "", unit: "", cost: "" },
      ],
    }));
  };

  const updateIngredient = (
    index: number,
    field: "ingredient" | "quantity" | "unit" | "cost",
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
      (i) => i.ingredient && i.quantity && i.unit && i.cost,
    );
    if (!validIngredients)
      newErrors.ingredients = "All ingredient fields are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const executeBulkRequests = async (data: CreateRecipePayload[]) => {
    const CHUNK_SIZE = 500;
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      const chunk = data.slice(i, i + CHUNK_SIZE);
      await createRecipes(chunk).unwrap();
    }
  };

  const executeBulkUpdates = async (data: UpdateRecipePayload[]) => {
    const CHUNK_SIZE = 500;
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      const chunk = data.slice(i, i + CHUNK_SIZE);
      await updateRecipes(chunk).unwrap();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (pendingCreateData.length > 0 || pendingUpdateData.length > 0) {
        if (pendingCreateData.length > 0)
          await executeBulkRequests(pendingCreateData);
        if (pendingUpdateData.length > 0)
          await executeBulkUpdates(pendingUpdateData);
        toast.success("Excel synchronization complete!");
      } else {
        const payload = {
          name: formData.name,
          avg_time: parseInt(formData.cookingTime),
          selling_cost: parseFloat(formData.sellingPrice),
          instruction: formData.instruction,
          description: formData.description,
          outlet_type: formData.outletType,
          ingredients: formData.ingredients.map((i) => ({
            id: i.id,
            ingredient: i.ingredient,
            quantity: parseFloat(i.quantity),
            unit: i.unit,
            cost: parseFloat(i.cost),
          })),
        };

        if (mode === "add") {
          await createRecipes([payload]).unwrap();
          toast.success("Recipe added successfully!");
        } else if (recipe) {
          await updateRecipes([{ ...payload, id: recipe.id }]).unwrap();
          toast.success("Recipe updated successfully!");
        }
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save recipe.");
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
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto custom-scrollbar border-none">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-foreground">
            {pendingCreateData.length > 0 || pendingUpdateData.length > 0
              ? `Syncing ${pendingCreateData.length + pendingUpdateData.length} Recipes`
              : mode === "add"
                ? "Add New Recipe"
                : "Edit Recipe"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-bold text-foreground mb-1">
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
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Outlet Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.outletType}
                  onChange={(e) =>
                    setFormData({ ...formData, outletType: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium bg-white"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="bar">Bar</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Avg. Time (min) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.cookingTime}
                  onChange={(e) =>
                    setFormData({ ...formData, cookingTime: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium placeholder:text-gray-300",
                    errors.cookingTime ? "border-red-500" : "border-gray-200",
                  )}
                  placeholder="e.g. 20"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Selling Cost ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, sellingPrice: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium placeholder:text-gray-300",
                    errors.sellingPrice ? "border-red-500" : "border-gray-200",
                  )}
                  placeholder="e.g. 45"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-1">
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

            <div>
              <label className="block text-sm font-bold text-foreground mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className={cn(
                  "w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium placeholder:text-gray-300 resize-none",
                )}
                placeholder="Enter recipe description"
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
                  className="flex items-center gap-1 text-xs font-bold text-[#0EA5E9] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Row
                </button>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold text-secondary px-1 tracking-widest bg-gray-50 py-2 rounded-lg">
                  <div className="col-span-4 pl-2">Ingredient</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-3 text-center">Unit</div>
                  <div className="col-span-2 text-center">Cost</div>
                  <div className="col-span-1"></div>
                </div>

                <div className="max-h-[250px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                  {formData.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center p-2"
                    >
                      <input
                        type="text"
                        value={ing.ingredient}
                        placeholder="Tomato"
                        onChange={(e) =>
                          updateIngredient(idx, "ingredient", e.target.value)
                        }
                        className="col-span-4 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-primary outline-none font-medium"
                      />
                      <input
                        type="number"
                        min={0}
                        value={ing.quantity}
                        placeholder="100"
                        onChange={(e) =>
                          updateIngredient(idx, "quantity", e.target.value)
                        }
                        className="col-span-2 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-primary outline-none text-center font-medium"
                      />
                      <input
                        type="text"
                        value={ing.unit}
                        placeholder="gm"
                        onChange={(e) =>
                          updateIngredient(idx, "unit", e.target.value)
                        }
                        className="col-span-3 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-primary outline-none text-center font-medium"
                      />
                      <input
                        type="number"
                        min={0}
                        value={ing.cost}
                        placeholder="10"
                        onChange={(e) =>
                          updateIngredient(idx, "cost", e.target.value)
                        }
                        className="col-span-2 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-primary outline-none text-center font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => removeIngredient(idx)}
                        disabled={formData.ingredients.length === 1}
                        className="col-span-1 flex justify-center text-red-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end items-center pt-3 pr-24 gap-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                    Total Estimated Cost:
                  </span>
                  <span className="text-sm font-extrabold text-[#0EA5E9]">
                    ${totalIngredientsCost.toFixed(2)}
                  </span>
                </div>
              </div>
              {errors.ingredients && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.ingredients}
                </p>
              )}
            </div>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span className="bg-white px-4 italic">
                  Excel synchronization
                </span>
              </div>
            </div>

            {/* Excel Upload Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-foreground">
                  Bulk Manage / Sync
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const templateData = [
                      {
                        ID: "",
                        "Recipe Name": "Beef Burger",
                        "Avg Time": "30",
                        "Selling Cost": "15.00",
                        Instruction: "Grill meat, assemble with bun.",
                        Description: "Gourmet beef burger with cheese.",
                        "Outlet Type": "restaurant",
                      },
                    ];
                    import("@/lib/excel").then((m) =>
                      m.exportToExcel(
                        templateData,
                        "recipe_template.xlsx",
                        "Template",
                      ),
                    );
                  }}
                  className="text-[10px] text-primary font-bold bg-blue-50 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Download Template
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-blue-50/10 hover:bg-blue-50/30 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 bg-transparent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Image
                    src="/icons/excel.png"
                    alt="Excel/CSV"
                    width={32}
                    height={32}
                    onError={(e) => {
                      (e.target as any).src =
                        "https://cdn-icons-png.flaticon.com/512/732/732220.png";
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-bold text-foreground">
                    {excelFileName || "Upload technical sheet for sync"}
                  </p>
                  <p className="text-[10px] font-medium text-secondary mt-1 uppercase tracking-widest opacity-60">
                    XLSX, XLS, CSV format supported
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-3 border border-gray-200 rounded-full text-foreground font-bold hover:bg-gray-50 transition-colors cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex-1 px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-colors cursor-pointer shadow-md text-sm disabled:opacity-50"
            >
              {isCreating || isUpdating
                ? "Processing..."
                : pendingCreateData.length > 0 || pendingUpdateData.length > 0
                  ? `Sync ${pendingCreateData.length + pendingUpdateData.length} Items`
                  : mode === "add"
                    ? "Create Recipe"
                    : "Update Recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
