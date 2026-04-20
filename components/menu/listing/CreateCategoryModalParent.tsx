"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, X } from "lucide-react";
import FormInput from "@/components/register/form/FormInput";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";
import {
  useCreateMenuCategory,
  useUpdateMenuCategory,
} from "@/hooks/useMenuCategories";

interface CreateMenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  onSuccess?: () => void;
}

const getInitialForm = (restaurantId?: string, initialData?: any) => ({
  name: initialData?.name || "",
  slug: initialData?.slug || "",
  description: initialData?.description || "",
  imageUrl: initialData?.imageUrl || "",
  sortOrder:
    initialData?.sortOrder !== undefined && initialData?.sortOrder !== null
      ? Number(initialData.sortOrder)
      : 0,
  isActive:
    typeof initialData?.isActive === "boolean" ? initialData.isActive : true,
  parentCategoryId:
    initialData?.parentCategoryId || initialData?.parentCategory?.id || "",
  restaurantId: restaurantId || initialData?.restaurantId || "",
});

export default function CreateCategoryModalParent({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: CreateMenuModalProps) {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId ?? undefined;

  const { uploadFile, uploading } = useFileUpload();
  const { mutate: createMenuCategory, isPending: isCreating } =
    useCreateMenuCategory();
  const { mutate: updateMenuCategory, isPending: isUpdating } =
    useUpdateMenuCategory();
const [preview, setPreview] = useState<string | null>(null);
  const isEditMode = !!initialData?.id;
  const isSubmitting = isCreating || isUpdating;

  const [form, setForm] = useState(getInitialForm(restaurantId, initialData));

  useEffect(() => {
    if (!open) return;
    setForm(getInitialForm(restaurantId, initialData));
  }, [open, restaurantId, initialData]);

  const updateForm = (key: string, value: any) => {
    if (key === "name") {
      const slug = String(value || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      setForm((prev) => ({
        ...prev,
        name: value,
        slug:
          !initialData?.id || prev.slug === initialData?.slug || !prev.slug
            ? slug
            : prev.slug,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };


  const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // ✅ instant preview (fixes blank image issue)
  const localPreview = URL.createObjectURL(file);
  setPreview(localPreview);

  const result = await uploadFile(e);

  if (result?.fileUrl) {
    setForm((prev: any) => ({
      ...prev,
      imageUrl: result.fileUrl,
    }));

  }
};
const clearImage = () => {
  setPreview(null); // ✅ important
  updateForm("imageUrl", "");
};

  const payload = useMemo(
    () => ({
      restaurantId,
      parentCategoryId: form.parentCategoryId || undefined,
      name: form.name?.trim(),
      slug:
        form.slug?.trim() ||
        String(form.name || "")
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      description: form.description || "",
      imageUrl: form.imageUrl || "",
      sortOrder: Number(form.sortOrder || 0),
      isActive: form.isActive,
    }),
    [form, restaurantId]
  );

  const resetForm = () => {
    setForm(getInitialForm(restaurantId));
  };
const handleSubmit = () => {
  if (!payload.name) {
    toast.error("Category name required");
    return;
  }

  if (!restaurantId && !isEditMode) { // ✅ allow update without restaurantId
    toast.error("Restaurant id is missing");
    return;
  }

  if (isEditMode) {
    // ❌ remove restaurantId for update
    const { restaurantId, ...updatePayload } = payload;

    updateMenuCategory(
      {
        id: initialData.id,
        data: updatePayload,
      },        {
          onSuccess: () => {
            onSuccess?.();
            onOpenChange(false);
            setForm(getInitialForm(restaurantId));
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.message || "Failed to update category"
            );
          },
        }
      );
      return;
    }

    createMenuCategory(payload as any, {
      onSuccess: () => {
        onSuccess?.();
        onOpenChange(false);
        setForm(getInitialForm(restaurantId));
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to create category"
        );
      },
    });
  };

  const handleReset = () => {
    if (isEditMode) {
      setForm(getInitialForm(restaurantId, initialData));
      return;
    }
    resetForm();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isSubmitting && !uploading) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="max-h-[95vh] max-w-[420px] overflow-auto rounded-[20px] bg-[#F5F5F5] p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-semibold">
            {isEditMode ? "Update Category" : "Create Category"}
          </DialogTitle>

          <p className="text-sm text-gray-500">
            {isEditMode
              ? "Update restaurant category details"
              : "Create restaurant category"}
          </p>
        </DialogHeader>

        <div className="mt-5 space-y-4 rounded-[16px] bg-white p-5">
          <FormInput
            label="Category Name"
            placeholder="e.g Burgers"
            value={form.name}
            onChange={(v) => updateForm("name", v)}
            required
          />

          {/* <FormInput
            label="Slug"
            placeholder="auto-generated"
            value={form.slug}
            onChange={(v) => updateForm("slug", v)}
          /> */}

          <FormInput
            label="Description"
            placeholder="Short category description"
            value={form.description}
            onChange={(v) => updateForm("description", v)}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading || isSubmitting}
              className="w-full rounded-[10px] border border-gray-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white disabled:cursor-not-allowed disabled:opacity-60"
            />

            {uploading && (
              <p className="text-xs text-gray-500">Uploading image...</p>
            )}

            {form.imageUrl ? (
              <div className="relative mt-2 w-full overflow-hidden rounded-[14px] border bg-gray-50">
              <img
  src={preview || form.imageUrl}
  alt="Category preview"
  className="h-[180px] w-full object-cover"
/>

                <button
                  type="button"
                  onClick={clearImage}
                  disabled={uploading || isSubmitting}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X size={16} />
                </button>
              </div>
            ) : null}
          </div>

          <FormInput
            label="Sort Order"
            placeholder="0"
            value={String(form.sortOrder)}
            onChange={(v) => updateForm("sortOrder", Number(v))}
          />

          <Button
            onClick={handleSubmit}
            className="mt-2 w-full rounded-[10px] py-4"
            disabled={isSubmitting || uploading}
          >
            {isSubmitting || uploading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={18} />
                {uploading
                  ? "Uploading..."
                  : isEditMode
                  ? "Updating..."
                  : "Creating..."}
              </>
            ) : isEditMode ? (
              <>
                <PlusCircle className="mr-2" size={18} />
                Update Category
              </>
            ) : (
              <>
                <PlusCircle className="mr-2" size={18} />
                Create Category
              </>
            )}
          </Button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            className="text-[17px] text-gray-700"
            onClick={handleReset}
            disabled={isSubmitting || uploading}
          >
            Reset
          </Button>

          <Button
            onClick={() => onOpenChange(false)}
            className="rounded-[10px] bg-primary px-8 py-2 text-[17px] hover:bg-primary/90"
            disabled={isSubmitting || uploading}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}