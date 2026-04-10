"use client";

import { Button } from "@/components/ui/button";
import { Star, Plus, Heart, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import AddToCartModal from "../shared/AddToCartModal";
import VariationModal from "../menu/listing/VariationModal";
import AddModifierToItem from "../forms/AddModifierToItem";
import { useAuth } from "@/hooks/useAuth";
import useApi from "@/hooks/useApi";
import { toast } from "sonner";
import DeleteDialog from "../dialogs/delete-dialog";

type Props = {
  item: any;
  editing?: boolean;
  onDelete?: () => void;
};

export default function MenuItemCard({ item, editing, onDelete }: Props) {
  const [open, setOpen] = useState(false);
const [openVariation, setOpenVariation] = useState(false);
const [openModifier, setOpenModifier] = useState(false);
const [openDelete, setOpenDelete] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
const { token } = useAuth();
const { del } = useApi(token);
  const image =
  item.imageUrl && item.imageUrl.startsWith("http")
    ? item.imageUrl
    : "/burgerTwo.jpg";

  const price =
    item.variations?.length > 0
      ? item.variations[0].price
      : item.basePrice;

      const handleDelete = async () => {
  try {
    setIsDeleting(true);

    const res = await del(`/v1/menu/items/${item.id}`);

    if (res?.error) return;

    toast.success(res?.message || "Item deleted successfully");
    setOpenDelete(false);
    onDelete?.();
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Failed to delete item");
  } finally {
    setIsDeleting(false);
  }
};
      return (
    <div className="relative w-full bg-white rounded-[22px] flex flex-col sm:max-w-[280px] mb-5">
      
      {/* Delete */}
      {editing && (
        <button
         onClick={() => setOpenDelete(true)}
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

 {/* Add Modifier */}
<button
  onClick={() => setOpenModifier(true)}
  className="bg-white rounded-full p-2 shadow hover:bg-gray-100"
>
  <Plus size={18} className="text-primary" />
</button>
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
<AddModifierToItem 
  open={openModifier}
  onOpenChange={setOpenModifier}
  item={item}
/>

<DeleteDialog
  open={openDelete}
  onOpenChange={setOpenDelete}
  onConfirm={handleDelete}
  isLoading={isDeleting}
  title="Delete Menu Item"
  description={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
/>
    </div>
  );
}