"use client";

import { Button } from "@/components/ui/button";
import { Star, Plus, Heart, X } from "lucide-react";
import { MenuItem } from "@/constants/menu";

type Props = {
  item: MenuItem;
  editing?: boolean;
};

export default function MenuItemCard({ item, editing }: Props) {
  return (
    <div className="relative w-full bg-white rounded-[22px]  flex flex-col">
      {/* ❌ Delete button (only in editing mode) */}
      {editing && (
        <button
          onClick={() => console.log("delete item:", item.id)}
          className="
            absolute
            top-0
            right-0
            z-20
          bg-[#c6c6c6]
                    text-black
                    border border-black
                    
            rounded-full
            p-1
            shadow-md
            hover:bg-red-600
          "
        >
          <X size={14} />
        </button>
      )}

      {/* Image */}
      <div className="relative flex-1 flex items-center justify-center pt-7 pb-3">
        {item.discount && (
          <span className="absolute top-6 left-0 bg-[#EB5757] text-white text-sm font-semibold px-3 py-1 rounded-r-lg">
            {item.discount}
          </span>
        )}

        <div className="absolute top-5 right-3 bg-white rounded-full p-2">
          <Heart className="text-red-500" size={18} fill="red" />
        </div>

        <img
          src={item.image}
          alt={item.name}
          className="w-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <span className="text-sm text-gray-400">ID {item.id}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-400 mb-3">
          <Star size={16} fill="currentColor" />
          <span className="text-sm font-medium text-gray-700">
            {item.rating}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            <span className="text-primary">$</span>
            {item.price}
          </span>

          <Button
            size="icon"
            className="h-11 w-11 rounded-[10px] bg-primary hover:bg-red-600"
          >
            <Plus className="text-white" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
