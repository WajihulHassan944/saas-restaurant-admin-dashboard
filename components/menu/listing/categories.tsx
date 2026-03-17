"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import CreateCategoryModalParent from "./CreateCategoryModalParent";
import useCategories from "@/hooks/useCategories";

interface CategoriesProps {
  editing?: boolean;
  showAddNew?: boolean;
  selectedCategory: string | null;
  onSelectCategory: (id: string) => void;
}

export default function Categories({
  editing,
  showAddNew = true,
  selectedCategory,
  onSelectCategory,
}: CategoriesProps) {
  const { categories, loading, deleteCategory, refetch } = useCategories();
  const [createCategory, setCreateCategory] = useState(false);

const handleModalChange = (open: boolean) => {
  setCreateCategory(open);

  // when modal closes
  if (!open) {
    refetch();
  }
};
useEffect(()=>{
  refetch();
},[])
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px] font-semibold text-gray-900">
          Categories
        </h2>

        {showAddNew && (
          <div className="mt-4 text-center">
            <Button
              variant="link"
              size="sm"
              className="inline-flex items-center gap-2 text-primary underline hover:no-underline font-semibold text-[16px]"
              onClick={() => setCreateCategory(true)}
            >
              <PlusCircle className="w-4 h-4" />
              Add New Category
            </Button>
          </div>
        )}
      </div>

      {/* Category Pills */}

      {loading ? (
        <p className="text-sm text-gray-400">Loading categories...</p>
      ) : (
        <div className="flex flex-wrap gap-x-3 gap-y-5 max-w-[900px]">
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;

            return (
              <div key={category.id} className="relative">
                <Button
                  onClick={() => onSelectCategory(category.id)}
                  variant="outline"
                  className={`
                    rounded-[12px]
                    px-5
                    py-2
                    text-sm
                    font-medium
                    transition
                    ${
                      isActive
                        ? "bg-primary text-white border-primary hover:bg-red-600"
                        : "text-[#6A7282] border-[#6A7282] bg-transparent hover:bg-gray-100"
                    }
                  `}
                >
                  {category.name}
                </Button>

                {/* Delete button */}
                {editing && (
                  <button
                   onClick={() => deleteCategory(category.id)}
                    className="
                      absolute
                      -top-1
                      -right-1
                      bg-[#c6c6c6]
                      text-black
                      border border-black
                      rounded-full
                      p-0.5
                      shadow-md
                      hover:bg-red-600
                    "
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

     <CreateCategoryModalParent
  open={createCategory}
  onOpenChange={handleModalChange}
/>
    </div>
  );
}