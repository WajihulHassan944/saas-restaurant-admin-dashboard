"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  ChevronDown,
  Loader2,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";
import FormInput from "@/components/register/form/FormInput";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  mode?: "create" | "edit";
  initialData?: any;
  onSuccess?: () => void;
};

type ViewMode = "form" | "list";

const PREDEFINED_VARIATIONS = [
  {
    name: "Small",
    description: "Small size option",
    price: "",
  },
  {
    name: "Medium",
    description: "Medium size option",
    price: "",
  },
  {
    name: "Large",
    description: "Large size option",
    price: "",
  },
  {
    name: "Extra Large",
    description: "Extra large size option",
    price: "",
  },
  {
    name: "Regular",
    description: "Regular serving option",
    price: "",
  },
  {
    name: "Family",
    description: "Family size option",
    price: "",
  },
];

const SORT_ORDER_OPTIONS = [
  { label: "Top Priority", value: 0 },
  { label: "High Priority", value: 10 },
  { label: "Medium Priority", value: 50 },
  { label: "Low Priority", value: 100 },
];

const getEmptyForm = (categoryId = "") => ({
  categoryId,
  name: "",
  description: "",
  price: "",
  sortOrder: 0,
  isDefault: false,
  isActive: true,
});

export default function VariationModal({
  open,
  onOpenChange,
  item,
  mode = "create",
  initialData,
  onSuccess,
}: Props) {
  const { token } = useAuth();
  const { post, patch, get, del: deleteRequest, loading } = useApi(token);

  const resolvedCategoryId = useMemo(
    () =>
      String(
        item?.id ||
          item?.categoryId ||
          item?.category?.id ||
          item?.menuCategory?.id ||
          initialData?.categoryId ||
          initialData?.category?.id ||
          ""
      ),
    [item, initialData]
  );

  const categoryName = useMemo(
    () =>
      item?.name ||
      item?.category?.name ||
      item?.menuCategory?.name ||
      initialData?.category?.name ||
      initialData?.menuCategory?.name ||
      "this category",
    [item, initialData]
  );

  const categoryImage = useMemo(
  () =>
    item?.previewUrl ||
    item?.imageUrl ||
    item?.category?.imageUrl ||
    item?.menuCategory?.imageUrl ||
    initialData?.category?.imageUrl ||
    initialData?.menuCategory?.imageUrl ||
    "",
  [item, initialData]
);

  const [viewMode, setViewMode] = useState<ViewMode>("form");
  const [form, setForm] = useState(getEmptyForm(resolvedCategoryId));
  const [variations, setVariations] = useState<any[]>([]);
  const [loadingVariations, setLoadingVariations] = useState(false);
  const [deletingVariationId, setDeletingVariationId] = useState<string | null>(
    null
  );
  const [editMode, setEditMode] = useState<"create" | "edit">(mode);
  const [editingVariation, setEditingVariation] = useState<any>(initialData);

  const resetForm = (categoryId = resolvedCategoryId) => {
    setForm(getEmptyForm(categoryId));
    setEditMode("create");
    setEditingVariation(null);
  };

  const populateFormForEdit = (variation: any) => {
    setForm({
      categoryId: resolvedCategoryId,
      name: variation?.name || "",
      description: variation?.description || "",
      price: String(variation?.price ?? ""),
      sortOrder: Number(variation?.sortOrder ?? 0),
      isDefault: !!variation?.isDefault,
      isActive: variation?.isActive === false ? false : true,
    });

    setEditMode("edit");
    setEditingVariation(variation);
    setViewMode("form");
  };

  const applyPresetVariation = (preset: (typeof PREDEFINED_VARIATIONS)[number]) => {
    setForm((prev) => ({
      ...prev,
      name: preset.name,
      description: preset.description,
      price: preset.price,
    }));

    setEditMode("create");
    setEditingVariation(null);
    setViewMode("form");
  };

  const fetchVariations = async () => {
    if (!resolvedCategoryId || !open) return;

    setLoadingVariations(true);

    const query = new URLSearchParams({
      categoryId: resolvedCategoryId,
      sortOrder: "DESC",
    });

    const res = await get(`/v1/menu/variations?${query.toString()}`);

    setLoadingVariations(false);

    if (!res || res.error) {
      setVariations([]);
      return;
    }

    const raw =
      (Array.isArray(res?.data) && res.data) ||
      (Array.isArray(res?.data?.data) && res.data.data) ||
      (Array.isArray(res?.data?.items) && res.data.items) ||
      [];

    setVariations(raw);
  };

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      populateFormForEdit(initialData);
    } else {
      resetForm(resolvedCategoryId);
      setViewMode("form");
    }
  }, [open, mode, initialData, resolvedCategoryId]);

  useEffect(() => {
    if (!open || !token || !resolvedCategoryId) return;
    fetchVariations();
  }, [open, token, resolvedCategoryId]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.categoryId) {
      toast.error("Category is required");
      return;
    }

    if (!form.name.trim()) {
      toast.error("Variation name is required");
      return;
    }

    if (form.price === "") {
      toast.error("Price is required");
      return;
    }

    const price = Number(form.price);

    if (Number.isNaN(price)) {
      toast.error("Price must be a valid number");
      return;
    }

    const basePayload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      sortOrder: Number(form.sortOrder),
      isDefault: form.isDefault,
      isActive: form.isActive,
    };

    const createPayload = {
      categoryId: form.categoryId,
      ...basePayload,
    };

    let res: any;

    if (editMode === "edit" && editingVariation?.id) {
      res = await patch(`/v1/menu/variations/${editingVariation.id}`, basePayload);
    } else {
      res = await post("/v1/menu/variations", createPayload);
    }

    if (!res) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    if (res.error || res.success === false) {
      toast.error(
        res.error ||
          res.message ||
          (editMode === "edit"
            ? "Failed to update variation"
            : "Failed to add variation")
      );
      return;
    }

    toast.success(
      editMode === "edit"
        ? "Variation updated successfully"
        : "Variation added successfully"
    );

    await fetchVariations();
    onSuccess?.();

    if (mode === "edit") {
      onOpenChange(false);
      return;
    }

    resetForm(resolvedCategoryId);
    setViewMode("list");
  };

  const handleDeleteVariation = async (variationId: string) => {
    setDeletingVariationId(variationId);

    const res = await deleteRequest(`/v1/menu/variations/${variationId}`);

    setDeletingVariationId(null);

    if (!res) {
      toast.error("Failed to delete variation");
      return;
    }

    if (res.error || res.success === false) {
      toast.error(res.error || res.message || "Failed to delete variation");
      return;
    }

    toast.success("Variation deleted successfully");

    if (editingVariation?.id === variationId) {
      resetForm(resolvedCategoryId);
    }

    await fetchVariations();
    onSuccess?.();
  };

  const getSortOrderLabel = (value: any) => {
    const option = SORT_ORDER_OPTIONS.find(
      (entry) => entry.value === Number(value)
    );

    return option?.label || `Custom Order (${value ?? 0})`;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);

        if (!value) {
          resetForm(resolvedCategoryId);
          setViewMode("form");
        }
      }}
    >
      <DialogContent className="max-h-[95vh] max-w-[760px] overflow-auto rounded-[20px] bg-[#F5F5F5] p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-semibold">
            {viewMode === "list"
              ? "Category Variations"
              : editMode === "edit"
              ? "Edit Variation"
              : "Add Variation"}
          </DialogTitle>

          <p className="text-sm text-gray-500">
            {viewMode === "list"
              ? `View variations for ${categoryName}`
              : `Create and manage variations for ${categoryName}`}
          </p>
        </DialogHeader>

        {viewMode === "form" ? (
          <>
            {editMode === "create" && (
              <div className="mt-5 rounded-[16px] bg-white p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Quick Variation Templates
                    </h3>
                    <p className="text-sm text-gray-500">
                      Select a preset or enter a custom variation below.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setViewMode("list")}
                    className="rounded-[10px]"
                  >
                    View Variations
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_VARIATIONS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyPresetVariation(preset)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        form.name === preset.name
                          ? "border-primary bg-primary text-white"
                          : "border-gray-200 bg-[#F9FAFB] text-gray-700 hover:border-primary hover:text-primary"
                      }`}
                    >
                      Add {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 space-y-4 rounded-[16px] bg-white p-5">
             <div className="flex items-center gap-3 rounded-[12px] bg-[#F9FAFB] px-4 pl-0 py-3">
  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[12px] border bg-white">
    {categoryImage ? (
      <img
        src={categoryImage}
        alt={categoryName}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-400">
        IMG
      </div>
    )}
  </div>

  <div className="min-w-0">
    <p className="text-xs font-medium uppercase text-gray-400">
      Category
    </p>
    <p className="truncate text-sm font-semibold text-gray-900">
      {categoryName}
    </p>
  </div>
</div>

              <FormInput
                label="Variation Name"
                placeholder="e.g Small, Medium, Large"
                value={form.name}
                onChange={(v) => handleChange("name", v)}
                required
              />

              <FormInput
                label="Description"
                placeholder="Enter variation description"
                value={form.description}
                onChange={(v) => handleChange("description", v)}
              />

              <FormInput
                label="Price"
                placeholder="Enter price"
                value={form.price}
                onChange={(v) => handleChange("price", v)}
                type="number"
                required
              />

              <div className="space-y-2">
                <Label>Display Priority</Label>

                <div className="relative">
                  <select
                    value={String(form.sortOrder)}
                    onChange={(e) =>
                      handleChange("sortOrder", Number(e.target.value))
                    }
                    className="h-11 w-full appearance-none rounded-[10px] border border-[#BBBBBB] bg-white px-4 pr-12 text-sm text-gray-600 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
                  Top priority variations appear first for customers.
                </p>
              </div>

              <div className="flex items-center gap-6 pt-2 text-sm text-gray-600">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => handleChange("isDefault", e.target.checked)}
                    className="accent-primary"
                  />
                  Default
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                    className="accent-primary"
                  />
                  Active
                </label>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (editMode === "edit") {
                    resetForm(resolvedCategoryId);
                  }

                  setViewMode("list");
                }}
                className="rounded-[10px]"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-[10px] bg-primary px-6 hover:bg-primary/90"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    {editMode === "edit" ? "Updating..." : "Saving..."}
                  </span>
                ) : editMode === "edit" ? (
                  "Update Variation"
                ) : (
                  "Save Variation"
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-5 rounded-[16px] bg-white p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Variations for {categoryName}
                </h3>
                <p className="text-sm text-gray-500">
                  View, edit, and delete category variations.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => {
                  resetForm(resolvedCategoryId);
                  setViewMode("form");
                }}
                className="rounded-[10px] bg-primary hover:bg-primary/90"
              >
                <PlusCircle size={18} />
                Add Variation
              </Button>
            </div>

            {loadingVariations ? (
              <div className="flex min-h-[260px] items-center justify-center text-gray-500">
                <Loader2 className="animate-spin" size={22} />
              </div>
            ) : variations.length === 0 ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[16px] border border-dashed border-gray-200 bg-[#F9FAFB] p-6 text-center">
                <p className="text-base font-semibold text-gray-900">
                  No variations added yet
                </p>
                <p className="mt-1 max-w-[320px] text-sm text-gray-500">
                  Add size or serving options like Small, Medium, Large, or your
                  own custom variation.
                </p>

                <Button
                  type="button"
                  onClick={() => {
                    resetForm(resolvedCategoryId);
                    setViewMode("form");
                  }}
                  className="mt-4 rounded-[10px] bg-primary hover:bg-primary/90"
                >
                  <PlusCircle size={18} />
                  Add First Variation
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 ">
                {variations.map((variation: any) => (
                  <div
                    key={variation.id}
                    className="rounded-[16px] border border-gray-200 bg-white p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="truncate text-base font-semibold text-gray-900">
                            {variation?.name || "-"}
                          </h4>

                          {variation?.isDefault ? (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Default
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                          {variation?.description || "No description"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                          variation?.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {variation?.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-[12px] bg-[#F9FAFB] p-3">
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {variation?.price ?? 0}
                        </p>
                      </div>

                      <div className="rounded-[12px] bg-[#F9FAFB] p-3">
                        <p className="text-xs text-gray-400">Priority</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {getSortOrderLabel(variation?.sortOrder)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => populateFormForEdit(variation)}
                        className="inline-flex items-center gap-2 rounded-[10px] border px-3 py-2 text-sm text-gray-700 transition hover:border-primary hover:text-primary"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteVariation(variation.id)}
                        disabled={deletingVariationId === variation.id}
                        className="inline-flex items-center gap-2 rounded-[10px] border px-3 py-2 text-sm text-gray-700 transition hover:border-red-300 hover:text-red-500 disabled:opacity-50"
                      >
                        {deletingVariationId === variation.id ? (
                          <Loader2 className="animate-spin" size={15} />
                        ) : (
                          <Trash2 size={15} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}