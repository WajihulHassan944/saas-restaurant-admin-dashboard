"use client";
import useCategories from "@/hooks/useCategories"
import { useAuth } from "@/hooks/useAuth"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import FormInput from "@/components/register/form/FormInput";
import { API_BASE_URL } from "@/lib/constants";
import { toast } from "sonner";

interface CreateMenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export default function CreateCategoryModalParent({
  open,
  onOpenChange,
}: CreateMenuModalProps) {
const { categories, loading, refetch } = useCategories()

  const [creating, setCreating] = useState(false)
const { token, restaurantId } = useAuth()
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    sortOrder: 0,
    isActive: true,
  })


  /* ================= HANDLE INPUT ================= */

  const updateForm = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))

    /* auto generate slug */

    if (key === "name") {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")

      setForm((prev) => ({
        ...prev,
        name: value,
        slug,
      }))
    }
  }
useEffect(() => {
  if (open) {
    refetch()
  }
}, [open])
  /* ================= CREATE CATEGORY ================= */

  const handleCreate = async () => {

    if (!form.name) {
      toast.error("Category name required")
      return
    }

    try {

      setCreating(true)

      const payload = {
        ...form,
        restaurantId,
      }

      const res = await fetch(`${API_BASE_URL}/v1/menu/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to create category")
      }

      toast.success("Category created successfully")

      /* refresh list */

     refetch()
      /* reset form */

      setForm({
        name: "",
        slug: "",
        description: "",
        imageUrl: "",
        sortOrder: 0,
        isActive: true,
      })

    } catch (err: any) {
      toast.error(err.message || "Failed to create category")
    } finally {
      setCreating(false)
    }
  }

  /* ================= RESET ================= */

  const handleReset = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      sortOrder: 0,
      isActive: true,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="max-w-[420px] rounded-[20px] p-6 bg-[#F5F5F5] max-h-[95vh] overflow-auto">

        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-semibold">
            Manage Categories
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Create and manage restaurant categories
          </p>
        </DialogHeader>

        {/* ================= CREATE FORM ================= */}

        <div className="mt-5 rounded-[16px] bg-white p-5 space-y-4">

          <FormInput
            label="Category Name"
            placeholder="e.g Burgers"
            value={form.name}
            onChange={(v) => updateForm("name", v)}
            required
          />

          <FormInput
            label="Slug"
            placeholder="auto-generated"
            value={form.slug}
            onChange={(v) => updateForm("slug", v)}
          />

          <FormInput
            label="Description"
            placeholder="Short category description"
            value={form.description}
            onChange={(v) => updateForm("description", v)}
          />

          <FormInput
            label="Image URL"
            placeholder="https://example.com/image.jpg"
            value={form.imageUrl}
            onChange={(v) => updateForm("imageUrl", v)}
          />

          <FormInput
            label="Sort Order"
            placeholder="0"
            value={String(form.sortOrder)}
            onChange={(v) => updateForm("sortOrder", Number(v))}
          />

          {/* CREATE BUTTON */}

          <Button
            onClick={handleCreate}
            className="w-full rounded-[10px] mt-2 py-4"
            disabled={creating}
          >
            {creating ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Creating...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2" size={18} />
                Create Category
              </>
            )}
          </Button>

        </div>

        {/* ================= CATEGORY LIST ================= */}

        <div className="mt-5 rounded-[16px] bg-white p-5">

          <p className="font-medium mb-3">Existing Categories</p>

          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-gray-400">
              No categories created yet
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">

              {categories.map((cat) => (
                <span
                  key={cat.slug}
                  className="px-3 py-1 rounded-lg border text-sm"
                >
                  {cat.name}
                </span>
              ))}

            </div>
          )}

        </div>

        {/* ================= FOOTER ================= */}

        <div className="mt-5 flex items-center justify-center gap-4">

          <Button
            variant="ghost"
            className="text-gray-700 text-[17px]"
            onClick={handleReset}
          >
            Reset
          </Button>

          <Button
            onClick={() => onOpenChange(false)}
            className="px-8 py-2 rounded-[10px] bg-primary hover:bg-primary/90 text-[17px]"
          >
            Close
          </Button>

        </div>

      </DialogContent>

    </Dialog>
  )
}