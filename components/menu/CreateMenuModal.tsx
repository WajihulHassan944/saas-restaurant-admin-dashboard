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
}

interface MenuItem {
  id: string;
  name: string;
}

export default function CreateMenuModal({
  open,
  onOpenChange,
}: CreateMenuModalProps) {
  const [loadingItems, setLoadingItems] = useState(false);
  const [creating, setCreating] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [token, setToken] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  const [submitted, setSubmitted] = useState(false);

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
    if (open && token && restaurantId) {
      fetchMenuItems();
    }
  }, [open, token, restaurantId]);

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

  const handleCreate = async () => {
    setSubmitted(true);

    if (!form.name) {
      toast.error("Menu name required");
      return;
    }

    try {
      setCreating(true);

      const payload = {
        name: form.name,
        slug: form.slug,
        restaurantId,
        description: form.description,
        sortOrder: Number(form.sortOrder) || 0,
        // menuItemsIds: form.menuItemsIds,
        isActive: true,
      };

      const res = await fetch(`${API_BASE_URL}/v1/menus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Menu created successfully");
window.location.reload();
      handleReset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create menu");
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
            Create Menu
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
            <p className="text-[16px] mb-2 font-medium">Menu Items</p>

            {loadingItems ? (
              <div className="flex justify-center py-3">
                <Loader2 className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="max-h-[200px] overflow-auto border rounded-lg p-2 space-y-2">
                {menuItems.map((item) => {
                  const selected = form.menuItemsIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleMenuItem(item.id)}
                      className={`cursor-pointer px-3 py-2 rounded-md text-sm ${
                        selected
                          ? "bg-primary text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {item.name}
                    </div>
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
            onClick={handleCreate}
            disabled={creating}
            className="px-8 py-0 rounded-[10px] bg-primary hover:bg-primary/90 text-[17px] text-white"
          >
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