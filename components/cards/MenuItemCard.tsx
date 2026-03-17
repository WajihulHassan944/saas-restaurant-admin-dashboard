"use client";

import { Button } from "@/components/ui/button";
import { Star, Plus, Heart, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import AddToCartModal from "../shared/AddToCartModal";
import VariationModal from "../menu/listing/VariationModal";

type Props = {
  item: any;
  editing?: boolean;
};

export default function MenuItemCard({ item, editing }: Props) {
  const [open, setOpen] = useState(false);
const [openVariation, setOpenVariation] = useState(false);
  const image =
  item.imageUrl && item.imageUrl.startsWith("http")
    ? item.imageUrl
    : "/burgerTwo.jpg";

  const price =
    item.variations?.length > 0
      ? item.variations[0].price
      : item.basePrice;

  return (
    <div className="relative w-full bg-white rounded-[22px] flex flex-col sm:max-w-[280px] mb-5">
      
      {/* Delete */}
      {editing && (
        <button
          onClick={() => console.log("delete item:", item.id)}
          className="absolute top-0 right-0 z-20 bg-[#c6c6c6] text-black border border-black rounded-full p-1 shadow-md hover:bg-red-600"
        >
          <X size={14} />
        </button>
      )}

      {/* Image */}
      <div className="relative flex-1 flex items-center justify-center pt-7 pb-3">
      <div className="absolute top-5 right-3 flex items-center gap-2">
  {/* Variation Icon */}
  <button
    onClick={() => setOpenVariation(true)}
    className="bg-white rounded-full p-2 shadow hover:bg-gray-100"
  >
    <SlidersHorizontal size={16} />
  </button>

  {/* Heart */}
  <div className="bg-white rounded-full p-2">
    <Heart className="text-red-500" size={18} fill="red" />
  </div>
</div>

        <img
          src={image}
          alt={item.name}
          className="w-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {item.name}
          </h3>
          <span className="text-sm text-gray-400">
            {item.category?.name}
          </span>
        </div>

        {/* Fake rating */}
        <div className="flex items-center gap-1 text-yellow-400 mb-3">
          <Star size={16} fill="currentColor" />
          <span className="text-sm font-medium text-gray-700">
            4.5
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            <span className="text-primary">$</span>
            {price}
          </span>

          <Button
            size="icon"
            className="h-11 w-11 rounded-[10px] bg-primary hover:bg-red-600"
            onClick={() => setOpen(true)}
          >
            <Plus className="text-white" size={20} />
          </Button>
        </div>
      </div>

      <AddToCartModal open={open} onOpenChange={setOpen}  item={item} />
      <VariationModal
  open={openVariation}
  onOpenChange={setOpenVariation}
  item={item}
/>
    </div>
  );
}