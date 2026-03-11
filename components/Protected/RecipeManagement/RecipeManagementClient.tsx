"use client";

import { useState, useEffect } from "react";
import { Search, Download, Plus } from "lucide-react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import SearchBar from "@/components/Shared/SearchBar";
import { TablePagination } from "@/components/Shared/TablePagination";
import { StatsCard } from "@/components/Shared/StatsCard";
import { RecipeCard } from "./RecipeCard";
import { RecipeModal } from "./RecipeModal";
import { RecipeExportModal } from "./RecipeExportModal";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { Recipe } from "@/types/recipes.types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGetAllRecipesQuery, useDeleteRecipeMutation } from "@/redux/services/recipesApi";
import { RecipeGridSkeleton } from "@/components/Skeleton/RecipeSkeleton";
import { Package, Utensils, Wine, DollarSign } from "lucide-react";

const RecipeManagementClient = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [stagedItems, setStagedItems] = useState<Recipe[]>([]);

  // API Hooks
  const { data: recipesData, isLoading, isFetching } = useGetAllRecipesQuery({
    page: currentPage,
    page_size: pageSize,
    search_term: debouncedSearch,
    outlet_type: activeTab === "all" ? undefined : activeTab,
    approval_status: "approved",
  });

  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddRecipe = () => {
    setModalMode("add");
    setSelectedRecipe(null);
    setIsModalOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setModalMode("edit");
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (recipe: Recipe) => {
    setRecipeToDelete(recipe);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (recipeToDelete) {
      try {
        await deleteRecipe(recipeToDelete.id).unwrap();
        toast.success("Recipe deleted successfully");
        setIsDeleteModalOpen(false);
        setRecipeToDelete(null);
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete recipe");
      }
    }
  };

  const handleExportRecipe = (recipe: Recipe) => {
    setStagedItems((prev) => {
      const exists = prev.find((item) => item.id === recipe.id);
      if (exists) return prev;
      toast.success(`Staged ${recipe.name} for export`);
      return [...prev, recipe];
    });
  };

  const handleOpenExportModal = () => {
    if (stagedItems.length === 0 && recipesData?.data?.[0]) {
        // If nothing staged, but we have data, stage everything on current page
        setStagedItems(recipesData.data);
        setIsExportModalOpen(true);
        return;
    }
    if (stagedItems.length === 0) {
      toast.error("No items to export");
      return;
    }
    setIsExportModalOpen(true);
  };

  const totalPages = recipesData?.total_pages || 1;
  const recipes = recipesData?.data || [];
  const totalItems = recipesData?.count || 0;
  
  const stats = [
    {
      title: "Total Recipes",
      value: totalItems,
      icon: Package,
      iconColor: "#10B981",
      iconBgColor: "#D1FAE5",
    },
    {
      title: "Restaurant",
      value: recipes.filter(r => r.outlet_type === "restaurant").length,
      icon: Utensils,
      iconColor: "#3B82F6",
      iconBgColor: "#DBEAFE",
    },
    {
      title: "Bar & Drinks",
      value: recipes.filter(r => r.outlet_type === "bar").length,
      icon: Wine,
      iconColor: "#F59E0B",
      iconBgColor: "#FEF3C7",
    },
    {
      title: "Average Cost",
      value: "$14.50",
      icon: DollarSign,
      iconColor: "#EF4444",
      iconBgColor: "#FEE2E2",
    },
  ];

  return (
    <div className="pb-10">
      <DashboardHeader
        title="Recipe Library"
        description="Unified management for kitchen and bar collections."
      />

      <main className="p-4 md:p-8 space-y-8 flex-1 w-full max-w-[1700px] mx-auto overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={handleAddRecipe}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5 font-bold" />
            Add Recipes
          </button>
          <button
            onClick={handleOpenExportModal}
            className="flex items-center justify-center gap-2 px-6 py-2.5 border border-[#0EA5E9] bg-white text-[#0EA5E9] rounded-lg font-bold hover:bg-gray-50 transition-colors cursor-pointer relative"
          >
            <Download className="w-5 h-5 text-[#0EA5E9]" />
            Export All
            {stagedItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                {stagedItems.length}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <StatsCard key={idx} {...stat} />
          ))}
        </div>

        <div className="space-y-6 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <SearchBar
              placeholder="Search recipes, methods..."
              className="w-full max-w-2xl bg-white border border-gray-100 shadow-xs"
              onSearch={setSearchQuery}
            />
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              {["all", "restaurant", "bar"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "py-4 px-2 text-sm font-bold transition-all relative cursor-pointer capitalize",
                    activeTab === tab
                      ? "text-[#0EA5E9]"
                      : "text-secondary hover:text-foreground",
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0EA5E9]" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {isLoading || isFetching ? (
            <RecipeGridSkeleton />
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onEdit={() => handleEditRecipe(recipe)}
                  onDelete={() => handleDeleteClick(recipe)}
                  onExport={() => handleExportRecipe(recipe)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">
                No recipes found. Try adjusting your search or filters.
              </p>
            </div>
          )}

          {totalItems > 0 && (
            <div className="mt-8 bg-white rounded-2xl border border-gray-100">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[8, 12, 24, 48]}
                showPageSize={true}
              />
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <RecipeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            setCurrentPage(1);
          }}
          recipe={selectedRecipe}
          mode={modalMode}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRecipeToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Recipe"
        description={`Are you sure you want to delete "${recipeToDelete?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />

      <RecipeExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={() => setStagedItems([])}
        data={stagedItems}
      />
    </div>
  );
};

export default RecipeManagementClient;
