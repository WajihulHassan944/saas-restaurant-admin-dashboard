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
const restaurantId = user?.restaurantId;
const branchId = user?.branchId;
  const { post, get } = useApi(token);

  const [quantity, setQuantity] = useState(1);

  /* ================= CUSTOMER STATE ================= */
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  /* ================= FETCH CUSTOMERS ================= */
useEffect(() => {
  if (!restaurantId || !token) return;

  // ✅ prevent refetch when customer is already selected
  if (selectedCustomerId) return;

  const delay = setTimeout(() => {
    fetchCustomers(1, true);
  }, 400);

  return () => clearTimeout(delay);
}, [search, restaurantId, token, selectedCustomerId]);
  const fetchCustomers = async (pageNumber = 1, reset = false) => {
    try {
      setLoadingCustomers(true);

      let url = `/v1/admin/users/customers?restaurantId=${restaurantId}&page=${pageNumber}`;

      if (search) {
        url += `&search=${search}`;
      }

      const res = await get(url);
      if (!res) return;

      const data = res.data || [];
      const meta = res.meta || {};

      setCustomers((prev) =>
        reset ? data : [...prev, ...data]
      );

      setHasNext(meta.hasNext);
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const loadMore = () => {
    if (!hasNext) return;
    fetchCustomers(page + 1);
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
      if (!selectedCustomerId) {
        toast.error("Please select customer");
        return;
      }
      if (!branchId) {
  toast.error("Please select a branch");
  return;
}

      const payload: any = {
        menuItemId: item.id,
        quantity,
        branchId, // ✅ added
        note: "",
      };

      if (selectedOptionId !== "base") {
        payload.variationId = selectedOptionId;
      }

     const res = await post(`/v1/cart/items?customerId=${selectedCustomerId}`, payload);

if (!res || res.error) {
  toast.error(res?.error || "Failed to add to cart");
  return;
}

 toast.success("Added to cart");
window.location.reload();
// ✅ store selected customer for later cart fetch
if (selectedCustomerId) {
  localStorage.setItem("activeCustomerId", selectedCustomerId);
}

setQuantity(1);
setSelectedCustomerId(null);
setSearch("");

onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };
const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
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

        {/* ================= CUSTOMER SELECT ================= */}
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium">Select Customer</p>

          <Input
            placeholder="Search customer..."
            value={search}
            onChange={(e) => {
    setSelectedCustomerId(null); // reset selection if user types again
    setSearch(e.target.value);
  }}
          />

<div className="max-h-[150px] overflow-y-auto border rounded-lg">
  {loadingCustomers && customers.length === 0 ? (
    <p className="p-3 text-sm text-gray-400">Loading...</p>

  ) : customers.length === 0 && selectedCustomer ? (
    <div className="p-3 bg-gray-100">
      <p className="text-sm font-medium">
        {selectedCustomer.profile?.firstName} {selectedCustomer.profile?.lastName}
      </p>
      <p className="text-xs text-gray-500">{selectedCustomer.email}</p>
    </div>

  ) : customers.length === 0 ? (
    <p className="p-3 text-sm text-gray-400">
      No customers found
    </p>

  ) : (
    customers.map((c) => (
      <div
        key={c.id}
        onClick={() => {
          setSelectedCustomerId(c.id);
          setSearch(`${c.profile?.firstName || ""} ${c.profile?.lastName || ""}`);
        }}
        className={`p-3 cursor-pointer hover:bg-gray-100 ${
          selectedCustomerId === c.id ? "bg-gray-100" : ""
        }`}
      >
        <p className="text-sm font-medium">
          {c.profile?.firstName} {c.profile?.lastName}
        </p>
        <p className="text-xs text-gray-500">{c.email}</p>
      </div>
    ))
  )}
</div>

          {hasNext && (
            <Button
              variant="outline"
              size="sm"
              onClick={loadMore}
              disabled={loadingCustomers}
            >
              {loadingCustomers ? "Loading..." : "Load More"}
            </Button>
          )}
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