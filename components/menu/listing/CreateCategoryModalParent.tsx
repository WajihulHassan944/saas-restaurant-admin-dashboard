"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2, PlusCircle } from "lucide-react";
import FormInput from "@/components/register/form/FormInput";
import { toast } from "sonner";
import {
  useCreateMenuCategory,
  useUpdateMenuCategory,
} from "@/hooks/useMenuCategories";
import VariationModal from "./VariationModal";
import ImageDropzoneUpload from "@/components/ui/ImageDropzoneUpload";

interface CreateMenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  onSuccess?: () => void;
}

type ModalStep = "form" | "created";

const SORT_ORDER_OPTIONS = [
  { label: "Top Priority", value: 0 },
  { label: "High Priority", value: 10 },
  { label: "Medium Priority", value: 50 },
  { label: "Low Priority", value: 100 },
];

const revokeBlobUrl = (url?: string | null) => {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

const getInitialForm = (restaurantId?: string, initialData?: any) => ({
  name: initialData?.name || "",
  slug: initialData?.slug || "",
  description: initialData?.description || "",
  imageUrl: initialData?.imageUrl || "",
  imagePreview: initialData?.imageUrl || "",
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

  const { mutate: createMenuCategory, isPending: isCreating } =
    useCreateMenuCategory();
  const { mutate: updateMenuCategory, isPending: isUpdating } =
    useUpdateMenuCategory();

  const isEditMode = !!initialData?.id;
  const isSubmitting = isCreating || isUpdating;

  const [form, setForm] = useState(getInitialForm(restaurantId, initialData));
  const [imageUploading, setImageUploading] = useState(false);
  const [step, setStep] = useState<ModalStep>("form");
  const [createdCategory, setCreatedCategory] = useState<any>(null);
  const [variationModalOpen, setVariationModalOpen] = useState(false);

  const imagePreviewRef = useRef<string | null>(form.imagePreview || null);

  const isBusy = isSubmitting || imageUploading;

  useEffect(() => {
    imagePreviewRef.current = form.imagePreview || null;
  }, [form.imagePreview]);

  useEffect(() => {
    return () => {
      revokeBlobUrl(imagePreviewRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    setForm((prev: any) => {
      revokeBlobUrl(prev.imagePreview);

      return getInitialForm(restaurantId, initialData);
    });

    setStep("form");
    setCreatedCategory(null);
    setVariationModalOpen(false);
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

  const handleImagePreviewChange = (previewUrl: string) => {
    setForm((prev: any) => {
      if (
        prev.imagePreview?.startsWith("blob:") &&
        prev.imagePreview !== previewUrl
      ) {
        URL.revokeObjectURL(prev.imagePreview);
      }

      return {
        ...prev,
        imagePreview: previewUrl,
      };
    });
  };

  const handleImageUrlChange = (fileUrl: string) => {
    setForm((prev: any) => ({
      ...prev,
      imageUrl: fileUrl,
    }));
  };

  const handleClearImage = () => {
    setForm((prev: any) => {
      revokeBlobUrl(prev.imagePreview);

      return {
        ...prev,
        imageUrl: "",
        imagePreview: "",
      };
    });
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
    setForm((prev: any) => {
      revokeBlobUrl(prev.imagePreview);

      return getInitialForm(restaurantId);
    });

    setCreatedCategory(null);
    setStep("form");
  };

  const getCreatedCategoryFromResponse = (res: any) => {
    return res?.data?.data || res?.data || res?.category || res;
  };

  const handleSubmit = () => {
    if (imageUploading) {
      toast.error("Please wait until image upload is complete");
      return;
    }

    if (!payload.name) {
      toast.error("Category name required");
      return;
    }

    if (!restaurantId && !isEditMode) {
      toast.error("Restaurant id is missing");
      return;
    }

    if (isEditMode) {
      const { restaurantId: _restaurantId, ...updatePayload } = payload;

      updateMenuCategory(
        {
          id: initialData.id,
          data: updatePayload,
        },
        {
          onSuccess: () => {
            onSuccess?.();
            onOpenChange(false);
            resetForm();
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
      onSuccess: (res: any) => {
        const category = getCreatedCategoryFromResponse(res);

        const normalizedCategory = {
          ...payload,
          ...category,
          id: category?.id,
          imageUrl: payload.imageUrl,
          previewUrl: form.imagePreview || payload.imageUrl,
        };

        setCreatedCategory(normalizedCategory);
        setStep("created");
        onSuccess?.();
        toast.success("Category created successfully");
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to create category"
        );
      },
    });
  };

  const handleClose = () => {
    if (isBusy) return;

    onOpenChange(false);
    resetForm();
  };

  const handleAddVariation = () => {
    if (!createdCategory?.id) {
      toast.error("Category id is missing");
      return;
    }

    setVariationModalOpen(true);
  };

  const handleSkipVariation = () => {
    handleClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!isBusy) {
            if (!value) {
              handleClose();
              return;
            }

            onOpenChange(value);
          }
        }}
      >
        <DialogContent className="max-h-[95vh] max-w-[420px] overflow-auto rounded-[20px] bg-[#F5F5F5] p-6">
          {step === "created" && !isEditMode ? (
            <>
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-2xl font-semibold">
                  Category Created
                </DialogTitle>

                <p className="text-sm text-gray-500">
                  Review the created category and choose the next step.
                </p>
              </DialogHeader>

              <div className="mt-5 space-y-4 rounded-[16px] bg-white p-5">
                {(createdCategory?.previewUrl || createdCategory?.imageUrl) && (
                  <div className="overflow-hidden rounded-[14px] border bg-gray-50">
                    <img
                      src={
                        createdCategory?.previewUrl || createdCategory?.imageUrl
                      }
                      alt={createdCategory?.name || "Category preview"}
                      className="h-[180px] w-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-400">
                      Category Name
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {createdCategory?.name || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-gray-400">
                      Slug
                    </p>
                    <p className="text-sm text-gray-700">
                      {createdCategory?.slug || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-gray-400">
                      Description
                    </p>
                    <p className="text-sm text-gray-700">
                      {createdCategory?.description || "No description"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-[12px] bg-[#F9FAFB] px-4 py-3">
                    <div>
                      <p className="text-xs font-medium uppercase text-gray-400">
                        Display Priority
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {SORT_ORDER_OPTIONS.find(
                          (option) =>
                            option.value === Number(createdCategory?.sortOrder)
                        )?.label ||
                          `Custom Order (${createdCategory?.sortOrder ?? 0})`}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        createdCategory?.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {createdCategory?.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="rounded-[14px] border border-primary/15 bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Would you like to add variations to this category?
                  </p>

                  <div className="mt-4 flex gap-3">
                    <Button
                      type="button"
                      onClick={handleAddVariation}
                      className="flex-1 rounded-[10px] bg-primary hover:bg-primary/90"
                    >
                      Yes
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSkipVariation}
                      className="flex-1 rounded-[10px]"
                    >
                      No
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
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

                <FormInput
                  label="Description"
                  placeholder="Short category description"
                  value={form.description}
                  onChange={(v) => updateForm("description", v)}
                />

                <ImageDropzoneUpload
                  label="Image"
                  value={form.imageUrl}
                  previewUrl={form.imagePreview}
                  onChange={handleImageUrlChange}
                  onPreviewChange={handleImagePreviewChange}
                  onClear={handleClearImage}
                  disabled={isSubmitting}
                  onUploadingChange={setImageUploading}
                  previewAlt="Category preview"
                  previewHeightClassName="h-[180px]"
                  emptyTitle="Drag & drop category image here"
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Display Priority
                  </label>

                  <div className="relative">
                    <select
                      value={String(form.sortOrder)}
                      onChange={(e) =>
                        updateForm("sortOrder", Number(e.target.value))
                      }
                      disabled={isBusy}
                      className="h-11 w-full appearance-none rounded-[10px] border border-[#BBBBBB] bg-white px-4 pr-12 text-sm text-gray-600 outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {SORT_ORDER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <div className="pointer-events-none absolute right-0 top-0 flex h-full w-10 items-center justify-center rounded-r-[10px] bg-primary">
                      <ChevronDown size={16} className="text-white" />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    Top priority categories appear first in the menu.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-[10px] px-6 py-2 text-[16px] text-gray-700"
                  onClick={handleClose}
                  disabled={isBusy}
                >
                  Close
                </Button>

                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="rounded-[10px] bg-primary px-6 py-2 text-[16px] hover:bg-primary/90"
                  disabled={isBusy}
                >
                  {isBusy ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={18} />
                      {imageUploading
                        ? "Uploading..."
                        : isEditMode
                        ? "Updating..."
                        : "Creating..."}
                    </>
                  ) : isEditMode ? (
                    <>
                      <PlusCircle size={18} />
                      Update
                    </>
                  ) : (
                    <>
                      <PlusCircle size={18} />
                      Create
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <VariationModal
        open={variationModalOpen}
        onOpenChange={(value) => {
          setVariationModalOpen(value);

          if (!value) {
            handleClose();
          }
        }}
        item={createdCategory}
        mode="create"
        onSuccess={onSuccess}
      />
    </>
  );
}