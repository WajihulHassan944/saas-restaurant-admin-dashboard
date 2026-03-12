"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import FormInput from "../register/form/FormInput";
import FormSelect from "../register/form/FormSelect";
import { toast } from "sonner";

interface CreateMenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Category {
  id: string;
  name: string;
}

export default function CreateMenuModal({
  open,
  onOpenChange,
}: CreateMenuModalProps) {
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [creating, setCreating] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  const [token, setToken] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    slug: "",
    basePrice: "",
    description: "",
    imageUrl: "",
    sku: "",
    prepTimeMinutes: "",
    dietaryFlags: "",
    allergenFlags: "",
  });

  const [selectOpen, setSelectOpen] = useState(false);

  /* ================= LOAD AUTH ================= */

  useEffect(() => {
    const authRaw = localStorage.getItem("auth");

    if (!authRaw) return;

    try {
      const auth = JSON.parse(authRaw);

      setToken(auth?.accessToken || "");
      setRestaurantId(auth?.user?.restaurant?.id || "");
    } catch {
      console.error("Invalid auth");
    }
  }, []);

  /* ================= FETCH CATEGORIES ================= */

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const res = await fetch(`${API_BASE_URL}/v1/menu/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setCategories(data.data);
        setCategoryOptions(data.data.map((c: Category) => c.name));
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (open && token) fetchCategories();
  }, [open, token]);

  /* ================= INPUT HANDLER ================= */

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (key === "name") {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      setForm((prev) => ({
        ...prev,
        name: value,
        slug,
      }));
    }
  };

  /* ================= CATEGORY SELECT ================= */
const handleCategoryChange = (val: string) => {
  const cat = categories.find(
    (c) => c.name.toLowerCase() === val.toLowerCase()
  );

  if (cat) {
    setForm((prev) => ({
      ...prev,
      categoryId: cat.id,
    }));
  }
};
  /* ================= CREATE MENU ITEM ================= */

  const handleCreate = async () => {
    setSubmitted(true);
console.log(form);
    if (!form.name || !form.categoryId) {
      toast.error("Name and Category required");
      return;
    }

    try {
      setCreating(true);

      const payload = {
        categoryId: form.categoryId,
        name: form.name,
        slug: form.slug,
        basePrice: Number(form.basePrice),
        restaurantId,
        description: form.description,
        imageUrl: form.imageUrl,
        sku: form.sku,
        prepTimeMinutes: Number(form.prepTimeMinutes),
        dietaryFlags: form.dietaryFlags
          ? form.dietaryFlags.split(",").map((i) => i.trim())
          : [],
        allergenFlags: form.allergenFlags
          ? form.allergenFlags.split(",").map((i) => i.trim())
          : [],
        isActive: true,
      };

      const res = await fetch(`${API_BASE_URL}/v1/menu/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Menu item created");

      handleReset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create menu item");
    } finally {
      setCreating(false);
    }
  };

  /* ================= RESET ================= */

  const handleReset = () => {
    setForm({
      categoryId: "",
      name: "",
      slug: "",
      basePrice: "",
      description: "",
      imageUrl: "",
      sku: "",
      prepTimeMinutes: "",
      dietaryFlags: "",
      allergenFlags: "",
    });
    setSubmitted(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[20px] p-6 bg-[#F5F5F5] max-h-[95vh] overflow-auto">

        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Create Menu Item
          </DialogTitle>
        </DialogHeader>

        <div className="mt-5 rounded-[16px] bg-white p-5 space-y-4">

          {/* NAME */}
          <FormInput
            label="Menu Name"
            placeholder="e.g Chicken Burger"
            value={form.name}
            onChange={(v) => updateForm("name", v)}
            required
            error={submitted && !form.name}
            errorText="Menu name required"
          />

          {/* CATEGORY */}
          {loadingCategories ? (
            <div className="flex justify-center py-3">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : (
            <FormSelect
              label="Category"
              placeholder="Select category"
              options={categoryOptions}
              value={
  categories.find((c) => c.id === form.categoryId)?.name.toLowerCase() || ""
}
              open={selectOpen}
              onOpenChange={setSelectOpen}
              onChange={(val) => handleCategoryChange(val)}
            />
          )}

          {/* PRICE */}
          <FormInput
            label="Base Price"
            placeholder="e.g 12.99"
            value={form.basePrice}
            onChange={(v) => updateForm("basePrice", v)}
          />

          {/* PREP TIME */}
          <FormInput
            label="Prep Time (minutes)"
            placeholder="e.g 15"
            value={form.prepTimeMinutes}
            onChange={(v) => updateForm("prepTimeMinutes", v)}
          />

          {/* SKU */}
          <FormInput
            label="SKU"
            placeholder="e.g BRG-001"
            value={form.sku}
            onChange={(v) => updateForm("sku", v)}
          />

          {/* IMAGE */}
          <FormInput
            label="Image URL"
            placeholder="https://image.jpg"
            value={form.imageUrl}
            onChange={(v) => updateForm("imageUrl", v)}
          />

          {/* DESCRIPTION */}
          <FormInput
            label="Description"
            placeholder="Menu description"
            value={form.description}
            onChange={(v) => updateForm("description", v)}
          />

          {/* DIETARY */}
          <FormInput
            label="Dietary Flags"
            placeholder="vegan, halal"
            value={form.dietaryFlags}
            onChange={(v) => updateForm("dietaryFlags", v)}
          />

          {/* ALLERGEN */}
          <FormInput
            label="Allergen Flags"
            placeholder="nuts, dairy"
            value={form.allergenFlags}
            onChange={(v) => updateForm("allergenFlags", v)}
          />

        </div>

        {/* FOOTER */}

        <div className="mt-5 flex justify-center gap-4">

          <Button variant="ghost" onClick={handleReset} className="text-gray-700 text-[17px]">
            Reset
          </Button>

          <Button variant="ghost" onClick={handleCreate} disabled={creating} className="px-8 py-0 rounded-[10px] bg-primary hover:bg-primary/90 text-[17px] text-white">
            {creating ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}