"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Radio } from "../ui/radioBtn";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useGetBranches } from "@/hooks/useBranches";
import AsyncSelect from "../ui/AsyncSelect";

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
  const { token, user } = useAuth();
const restaurantId = user?.restaurantId ?? undefined;
const branchId = user?.branchId;
  const { post, get } = useApi(token);

  const [quantity, setQuantity] = useState(1);

  /* ================= CUSTOMER STATE ================= */
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  // ================= FETCH BRANCHES =================
const { data: branchesData } = useGetBranches({
  restaurantId,
});

const fetchBranches = async ({ search }: any) => {
  if (!restaurantId) return { data: [] };

  const list = branchesData?.data || [];

  return {
    data: list.filter((b: any) =>
      b?.name?.toLowerCase().includes(search.toLowerCase())
    ),
  };
};

// ================= FETCH CUSTOMERS =================
const fetchCustomers = async ({ search, page }: any) => {
  if (!restaurantId) return { data: [], meta: {} };

  let url = `/v1/admin/users/customers?restaurantId=${restaurantId}&page=${page}`;

  if (search) url += `&search=${search}`;

  const res = await get(url);

  const raw = res?.data || [];

  // ✅ normalize (IMPORTANT)
  const normalized = raw.map((u: any) => ({
    ...u,
    fullName: `${u?.profile?.firstName || ""} ${u?.profile?.lastName || ""}`,
  }));

  return {
    data: normalized,
    meta: res?.meta,
  };
};

  /* ================= OPTIONS ================= */
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
const [selectedOptionId, setSelectedOptionId] = useState<string>("base");

useEffect(() => {
  if (options.length) {
    setSelectedOptionId(options[0].id);
  }
}, [options]);
  
  const selectedOption = options.find((opt) => opt.id === selectedOptionId);
  const price = selectedOption?.price || 0;
  const total = price * quantity;

  const image =
    item?.imageUrl && item.imageUrl.startsWith("http")
      ? item.imageUrl
      : "/burgerTwo.jpg";

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async () => {
    try {
   if (!selectedCustomer){
        toast.error("Please select customer");
        return;
      }
   if (!selectedBranch) {
  toast.error("Please select a branch");
  return;
}

      const payload: any = {
        menuItemId: item.id,
        quantity,
       branchId: selectedBranch?.id,
        note: "",
      };

      if (selectedOptionId !== "base") {
        payload.variationId = selectedOptionId;
      }

     const res = await post(`/v1/cart/items?customerId=${selectedCustomer?.id}`, payload);

if (!res || res.error) {
  toast.error(res?.error || "Failed to add to cart");
  return;
}

 toast.success("Added to cart");
window.location.reload();

if (selectedCustomer?.id) {
  localStorage.setItem("activeCustomerId", selectedCustomer.id);
}

setQuantity(1);
setSelectedCustomer(null);

onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-8 max-h-[100vh] overflow-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-semibold">
            {item?.name}
          </DialogTitle>
        </DialogHeader>

        {/* Image */}
        <div className="flex justify-center mt-4">
          <Image src={image} alt={item?.name} width={200} height={200} />
        </div>

        {/* Price */}
        <p className="text-center text-primary font-semibold mt-2">
          ${price}
        </p>
{/* ================= BRANCH SELECT ================= */}
<div className="mt-6">
  <p className="text-sm font-medium mb-2">Select Branch</p>

  <AsyncSelect
    value={selectedBranch}
    onChange={setSelectedBranch}
    fetchOptions={fetchBranches}
    labelKey="name"
    valueKey="id"
    placeholder="Select branch"
  />
</div>
        {/* ================= CUSTOMER SELECT ================= */}
      {/* ================= CUSTOMER SELECT ================= */}
<div className="mt-6">
  <p className="text-sm font-medium mb-2">Select Customer</p>

  <AsyncSelect
    value={selectedCustomer}
    onChange={setSelectedCustomer}
    fetchOptions={fetchCustomers}
    labelKey="fullName"
    valueKey="id"
    placeholder="Select customer"
  />
</div>

        {/* Quantity */}
        <div className="flex justify-between mt-6">
          <span>Quantity</span>
          <div className="flex gap-2">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Variations */}
        <div className="mt-6 space-y-3">
          {options.map((opt: any) => (
            <div key={opt.id} onClick={() => setSelectedOptionId(opt.id)}>
              <Radio
                label={`${opt.name} ($${opt.price})`}
                active={selectedOptionId === opt.id}
              />
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between mt-6">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Add */}
        <Button className="w-full mt-6 py-3" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </DialogContent>
    </Dialog>
  );
}