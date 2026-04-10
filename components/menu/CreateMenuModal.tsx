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
import { toast } from "sonner";

interface CreateMenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuId?: string;
}

interface MenuItem {
  id: string;
  name: string;
}

export default function CreateMenuModal({
  open,
  onOpenChange,
  menuId,
}: CreateMenuModalProps) {
  const [loadingItems, setLoadingItems] = useState(false);
  const [creating, setCreating] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [token, setToken] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  const [submitted, setSubmitted] = useState(false);
const isEdit = Boolean(menuId);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    sortOrder: "",
    menuItemsIds: [] as string[],
  });

  /* ================= LOAD AUTH ================= */

  useEffect(() => {
    const authRaw = localStorage.getItem("auth");

    if (!authRaw) return;

    try {
      const auth = JSON.parse(authRaw);

      setToken(auth?.accessToken || "");
      setRestaurantId(auth?.user?.restaurantId || "");
    } catch {
      console.error("Invalid auth");
    }
  }, []);

  
  const fetchMenuDetails = async () => {
  if (!menuId || !token) return;

  try {
    const res = await fetch(`${API_BASE_URL}/v1/menus/${menuId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    const menu = data.data;

    const prefilledItemIds =
      menu?.items?.map((item: any) => item.menuItemId).filter(Boolean) || [];

    setForm({
      name: menu?.name || "",
      slug: menu?.slug || "",
      description: menu?.description || "",
      sortOrder: String(menu?.sortOrder ?? ""),
      menuItemsIds: prefilledItemIds,
    });
  } catch (err: any) {
    toast.error(err.message || "Failed to load menu");
  }
};

  /* ================= FETCH MENU ITEMS ================= */

  const fetchMenuItems = async () => {
    if (!restaurantId) return;

    try {
      setLoadingItems(true);

      const res = await fetch(
        `${API_BASE_URL}/v1/menu/items?restaurantId=${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setMenuItems(data.data || []);
      }
    } catch {
      toast.error("Failed to load menu items");
    } finally {
      setLoadingItems(false);
    }
  };
console.log("menu items", menuItems);
 
useEffect(() => {
  if (!open || !token || !restaurantId) return;

  const init = async () => {
    await fetchMenuItems();

    if (menuId) {
      await fetchMenuDetails();
    } else {
      handleReset();
    }
  };

  init();
}, [open, token, restaurantId, menuId]);

  /* ================= FORM UPDATE ================= */

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

  /* ================= SELECT MENU ITEMS ================= */

  const toggleMenuItem = (id: string) => {
    setForm((prev) => {
      const exists = prev.menuItemsIds.includes(id);

      return {
        ...prev,
        menuItemsIds: exists
          ? prev.menuItemsIds.filter((i) => i !== id)
          : [...prev.menuItemsIds, id],
      };
    });
  };
  /* ================= CREATE MENU ================= */
 const handleSubmit = async () => {
  setSubmitted(true);

  if (!form.name) {
    toast.error("Menu name required");
    return;
  }

  try {
    setCreating(true);

     const payload: any = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      sortOrder: Number(form.sortOrder) || 0,
      itemIds: form.menuItemsIds,
      isActive: true,
    };

    // Only include restaurantId when creating
    if (!isEdit) {
      payload.restaurantId = restaurantId;
    }

    const url = isEdit
      ? `${API_BASE_URL}/v1/menus/${menuId}`
      : `${API_BASE_URL}/v1/menus`;

    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    toast.success(isEdit ? "Menu updated" : "Menu created");

    window.location.reload();

    handleReset();
    onOpenChange(false);
  } catch (err: any) {
    toast.error(err.message || "Request failed");
  } finally {
    setCreating(false);
  }
};

  /* ================= RESET ================= */

  const handleReset = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      sortOrder: "",
      menuItemsIds: [],
    });

    setSubmitted(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[20px] p-6 bg-[#F5F5F5] max-h-[95vh] overflow-auto">
        <DialogHeader>
         <DialogTitle className="text-2xl font-semibold">
  {isEdit ? "Edit Menu" : "Create Menu"}
</DialogTitle>
        </DialogHeader>

        <div className="mt-5 rounded-[16px] bg-white p-5 space-y-4">
          {/* NAME */}
          <FormInput
            label="Menu Name"
            placeholder="e.g Lunch Menu"
            value={form.name}
            onChange={(v) => updateForm("name", v)}
            required
            error={submitted && !form.name}
            errorText="Menu name required"
          />

          {/* SLUG */}
          <FormInput
            label="Slug"
            placeholder="auto-generated"
            value={form.slug}
            onChange={(v) => updateForm("slug", v)}
          />

          {/* DESCRIPTION */}
          <FormInput
            label="Description"
            placeholder="Menu description"
            value={form.description}
            onChange={(v) => updateForm("description", v)}
          />

          {/* SORT ORDER */}
          <FormInput
            label="Sort Order"
            placeholder="e.g 1"
            value={form.sortOrder}
            onChange={(v) => updateForm("sortOrder", v)}
          />

          {/* MENU ITEMS */}

        <div>
  <div className="flex items-center justify-between mb-2">
    <p className="text-[16px] font-medium">Menu Items</p>
    {!!form.menuItemsIds.length && (
      <span className="text-xs font-medium text-primary bg-red-50 px-2 py-1 rounded-full">
        {form.menuItemsIds.length} selected
      </span>
    )}
  </div>

  {loadingItems ? (
    <div className="border rounded-xl bg-white p-3 space-y-2">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-10 rounded-lg bg-gray-100 animate-pulse"
        />
      ))}
    </div>
  ) : menuItems.length === 0 ? (
    <div className="border rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
      No menu items available
    </div>
  ) : (
    <div className="max-h-[240px] overflow-auto border rounded-xl p-2 bg-white space-y-2">
      {menuItems.map((item) => {
        const selected = form.menuItemsIds.includes(item.id);

        return (
          <button
            type="button"
            key={item.id}
            onClick={() => toggleMenuItem(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm border transition ${
              selected
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span className="truncate text-left">{item.name}</span>
            <span
              className={`ml-3 text-xs font-semibold ${
                selected ? "text-white" : "text-gray-400"
              }`}
            >
              {selected ? "Selected" : "Select"}
            </span>
          </button>
        );
      })}
    </div>
  )}
</div>
        </div>

        {/* FOOTER */}

        <div className="mt-5 flex justify-center gap-4">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-gray-700 text-[17px]"
          >
            Reset
          </Button>

          <Button
           onClick={handleSubmit}
            disabled={creating}
            className="px-8 py-0 rounded-[10px] bg-primary hover:bg-primary/90 text-[17px] text-white"
          >
           {creating ? (
  <>
    <Loader2 className="animate-spin mr-2" size={16} />
    {isEdit ? "Updating..." : "Creating..."}
  </>
) : isEdit ? (
  "Update"
) : (
  "Create"
)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}