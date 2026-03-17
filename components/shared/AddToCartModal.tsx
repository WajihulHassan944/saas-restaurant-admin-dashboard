"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useState, useMemo } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Radio } from "../ui/radioBtn";
import { toast } from "sonner";

interface AddToCartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
}

export default function AddToCartModal({
  open,
  onOpenChange,
  item,
}: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);

  /* ✅ Build options (base + variations) */
  const options = useMemo(() => {
    const baseOption = {
      id: "base",
      name: "Base",
      price: Number(item?.basePrice || 0),
    };

    const variations =
      item?.variations?.map((v: any) => ({
        id: v.id,
        name: v.name,
        price: Number(v.price),
      })) || [];

    return [baseOption, ...variations];
  }, [item]);

  const [selectedOptionId, setSelectedOptionId] = useState(
    options[0]?.id
  );

  /* ✅ Selected option */
  const selectedOption = options.find(
    (opt) => opt.id === selectedOptionId
  );

  /* ✅ Price */
  const price = selectedOption?.price || 0;

  /* ✅ Total */
  const total = price * quantity;

  /* ✅ Image fallback */
  const image =
    item?.imageUrl && item.imageUrl.startsWith("http")
      ? item.imageUrl
      : "/burgerTwo.jpg";

  /* ✅ Handle Add To Cart */
  const handleAddToCart = () => {
    const payload = {
      itemId: item.id,
      name: item.name,
      quantity,
      selectedOption,
      total,
    };

    console.log("Add to cart:", payload);

    toast.success("Added to cart");

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-8">
        {/* Header */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-semibold text-[#101828]">
            {item?.name}
          </DialogTitle>
        </DialogHeader>

        {/* Image */}
        <div className="flex justify-center mt-4">
          <Image
            src={image}
            alt={item?.name}
            width={200}
            height={200}
            className="object-contain"
          />
        </div>

        {/* Price */}
        <p className="text-center text-primary font-semibold mt-2">
          ${price}
        </p>

        {/* Quantity */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm font-medium">Quantity</span>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setQuantity((q) => Math.max(1, q - 1))
              }
              className="text-xl text-gray-600"
            >
              –
            </button>

            <span className="min-w-[20px] text-center">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="size-7 rounded bg-primary text-white flex items-center justify-center"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Variations / Size */}
        <div className="mt-6">
          <p className="text-sm font-medium mb-3">
            {item?.variations?.length > 0
              ? "Choose Option"
              : "Price"}
          </p>

          <div className="space-y-4">
            {options.map((opt: any) => (
              <div
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className="cursor-pointer"
              >
                <Radio
                  label={`${opt.name} ($${opt.price})`}
                  active={selectedOptionId === opt.id}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm font-medium">Total</span>
          <span className="text-primary font-semibold">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart */}
        <Button
          className="w-full mt-6 h-11 rounded-xl bg-primary hover:bg-primary/90"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </DialogContent>
    </Dialog>
  );
}