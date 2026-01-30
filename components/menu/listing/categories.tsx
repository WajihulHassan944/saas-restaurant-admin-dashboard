"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";

const categories = [
  "Burger",
  "Pizza",
  "Noodles",
  "Sushi",
  "Cake",
  "Sandwiches",
  "Lasania",
  "Soft Drinks",
  "Pizza",
  "Noodles",
  "Sushi",
  "Cake",
  "Sandwiches",
  "Lasania",
  "Soft Drinks",
];

interface CategoriesProps {
  editing: boolean;
}

export default function Categories({ editing }: CategoriesProps) {
  const [active, setActive] = useState<string>("Burger");

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px] font-semibold text-gray-900">Categories</h2>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            size="sm"
            className="inline-flex items-center gap-2 text-primary no-underline hover:no-underline font-semibold text-[16px]"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Category
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-x-3 gap-y-5 max-w-[900px]">
        {categories.map((category) => {
          const isActive = active === category;

          return (
            <div key={category} className="relative">
              <Button
                onClick={() => setActive(category)}
                variant="outline"
                className={`
                  relative
                  rounded-[12px]
                  px-5
                  py-2
                  text-sm
                  font-medium
                  transition
                  ${isActive
                    ? "bg-primary text-white border-primary hover:bg-red-600"
                    : "text-[#6A7282] border-[#6A7282] bg-transparent hover:bg-gray-100"}
                `}
              >
                {category}
              </Button>

              {/* ❌ Delete button (only when editing) */}
              {editing && (
                <button
                  onClick={() => console.log("delete:", category)}
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
    </div>
  );
}
