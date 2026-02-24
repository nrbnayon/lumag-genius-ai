"use client";

import { useState, useMemo } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import {
  UtensilsCrossed,
  Percent,
  TrendingUp,
  Clock,
  Plus,
  Download,
  Search,
  PackageX,
} from "lucide-react";
import SearchBar from "@/components/Shared/SearchBar";
import { Pagination } from "@/components/Shared/Pagination";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { RecipeGridSkeleton } from "@/components/Skeleton/RecipeSkeleton";
import { toast } from "sonner";
import { recipesData } from "@/data/recipeData";
import { Recipe, RecipeFormData } from "@/types/recipe";
import { RecipeCard } from "./RecipeCard";
import { RecipeModal } from "./RecipeModal";
import { RecipeExportModal } from "./RecipeExportModal";

export default function RecipeClient() {
  const [recipes, setRecipes] = useState<Recipe[]>(recipesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Filtered data
  const filteredRecipes = useMemo(() => {
    return recipes.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [recipes, searchQuery]);

  // Paginated data
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecipes.slice(start, start + itemsPerPage);
  }, [filteredRecipes, currentPage]);

  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);

  // Handlers
  const handleAddClick = () => {
    setModalMode("add");
    setSelectedRecipe(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (recipe: Recipe) => {
    setModalMode("edit");
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDeleteModalOpen(true);
  };

  const handleExportClick = (recipe?: Recipe) => {
    if (recipe) {
      setSelectedRecipe(recipe);
    } else {
      setSelectedRecipe(null);
    }
    setIsExportModalOpen(true);
  };

  const handleConfirmModal = (formData: RecipeFormData) => {
    if (modalMode === "add") {
      const newRecipe: Recipe = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        cookingTime: formData.cookingTime,
        sellingPrice: formData.sellingPrice,
        instruction: formData.instruction,
        ingredients: formData.ingredients,
        ingredientsCount: formData.ingredients.length,
        cost: `$${formData.ingredients.reduce((acc, curr) => acc + parseFloat(curr.cost.replace(/[^0-9.-]+/g, "") || "0"), 0)}`,
        status: "Pending",
        image: formData.image ? URL.createObjectURL(formData.image) : undefined,
      };
      setRecipes([newRecipe, ...recipes]);
      toast.success("Recipe added and sent for approval");
    } else if (selectedRecipe) {
      setRecipes(
        recipes.map((r) =>
          r.id === selectedRecipe.id
            ? {
                ...r,
                name: formData.name,
                cookingTime: formData.cookingTime,
                sellingPrice: formData.sellingPrice,
                instruction: formData.instruction,
                ingredients: formData.ingredients,
                ingredientsCount: formData.ingredients.length,
                cost: `$${formData.ingredients.reduce((acc, curr) => acc + parseFloat(curr.cost.replace(/[^0-9.-]+/g, "") || "0"), 0)}`,
                image: formData.image
                  ? URL.createObjectURL(formData.image)
                  : r.image,
              }
            : r,
        ),
      );
      toast.success("Recipe updated successfully");
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedRecipe) {
      setRecipes(recipes.filter((r) => r.id !== selectedRecipe.id));
      toast.success("Recipe deleted successfully");
    }
    setIsDeleteModalOpen(false);
  };

  const handleConfirmExport = (data: Recipe | Recipe[]) => {
    const count = Array.isArray(data) ? data.length : 1;
    toast.success(`Exported ${count} recipe technical sheet(s) to Excel`);
    setIsExportModalOpen(false);
  };

  return (
    <div className="pb-10">
      <DashboardHeader
        title="Recipe Management"
        description="Manage recipes with AI-generated technical sheets and cost analysis"
      />

      <main className="p-4 md:p-8 space-y-8">
        {/* Top Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5 font-bold" />
            Add Recipes
          </button>
          <button
            onClick={() => handleExportClick()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-secondary border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Download className="w-5 h-5" />
            Export All
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Recipes"
            value={22}
            icon={UtensilsCrossed}
            iconColor="#EF4444"
            iconBgColor="#FEE2E2"
          />
          <StatsCard
            title="Avg Food Cost %"
            value="22.5"
            icon={Percent}
            iconColor="#3B82F6"
            iconBgColor="#DBEAFE"
          />
          <StatsCard
            title="High Margin items"
            value={5}
            icon={TrendingUp}
            iconColor="#10B981"
            iconBgColor="#D1FAE5"
          />
          <StatsCard
            title="Pending Approval"
            value={2}
            icon={Clock}
            iconColor="#F59E0B"
            iconBgColor="#FEF3C7"
          />
        </div>

        {/* Search & Grid */}
        <div className="space-y-6">
          <SearchBar
            placeholder="Search Recipes"
            className="max-w-2xl bg-white border border-gray-100 shadow-xs"
            onSearch={(val) => {
              setLoading(true);
              setSearchQuery(val);
              setTimeout(() => setLoading(false), 500);
            }}
          />

          {loading ? (
            <RecipeGridSkeleton />
          ) : filteredRecipes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-4 2xl:gap-6">
                {paginatedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onExport={handleExportClick}
                  />
                ))}
              </div>

              <div className="flex justify-center pt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredRecipes.length}
                  itemsPerPage={itemsPerPage}
                  currentItemsCount={paginatedRecipes.length}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                No recipes found
              </h3>
              <p className="text-secondary">
                Try adjusting your search to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmModal}
        recipe={selectedRecipe}
        mode={modalMode}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Recipe"
        description={`Are you sure you want to delete "${selectedRecipe?.name}"? This action cannot be undone.`}
      />

      <RecipeExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleConfirmExport}
        data={selectedRecipe || recipes}
      />
    </div>
  );
}
