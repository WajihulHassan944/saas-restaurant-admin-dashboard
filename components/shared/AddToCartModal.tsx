"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Radio } from "../ui/radioBtn";

interface AddToCartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddToCartModal({
  open,
  onOpenChange,
}: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState<"small" | "medium" | "large">("large");

  const price = 5.59;
  const total = (quantity || 1) * price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-8">
        {/* Header */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-semibold font-onest text-[#101828] text-center">
            Burger
          </DialogTitle>
        </DialogHeader>

        {/* Image */}
        <div className="flex justify-center mt-4">
          <Image
            src="/burgerTwo.jpg"
            alt="Burger"
            width={200}
            height={200}
            priority
          />
        </div>

        {/* Price */}
        <p className="text-center text-primary font-semibold mt-2">
          $5.59
        </p>

        {/* Quantity */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm font-medium">Quantity</span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(0, q - 1))}
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

        {/* Size */}
        <div className="mt-6">
          <p className="text-sm font-medium mb-3">Size</p>

          <div className="space-y-4">
            <div onClick={() => setSize("small")}>
              <Radio label="Small" active={size === "small"} />
            </div>

            <div onClick={() => setSize("medium")}>
              <Radio label="Medium" active={size === "medium"} />
            </div>

            <div onClick={() => setSize("large")}>
              <Radio label="Large" active={size === "large"} />
            </div>
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
        <Button className="w-full mt-6 h-11 rounded-xl bg-primary hover:bg-primary/90">
          Add to Cart
        </Button>
      </DialogContent>
    </Dialog>
  );
}
