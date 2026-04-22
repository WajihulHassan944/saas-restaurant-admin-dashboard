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
import { Loader2, Pencil, Trash2 } from "lucide-react";
import FormInput from "@/components/register/form/FormInput";
import { Label } from "@/components/ui/label";
import AsyncSelect from "@/components/ui/AsyncSelect";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  mode?: "create" | "edit";
  initialData?: any;
  onSuccess?: () => void;
};

type ModifierOverride = {
  modifier: any | null;
  priceDelta: string;
};

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

  const [form, setForm] = useState(getEmptyForm(resolvedCategoryId));
  const [modifierOverrides, setModifierOverrides] = useState<
    ModifierOverride[]
  >([{ modifier: null, priceDelta: "" }]);

  const [variations, setVariations] = useState<any[]>([]);
  const [loadingVariations, setLoadingVariations] = useState(false);
  const [deletingVariationId, setDeletingVariationId] = useState<string | null>(
    null
  );
  const [editMode, setEditMode] = useState<"create" | "edit">(mode);
  const [editingVariation, setEditingVariation] = useState<any>(initialData);

  const attachedGroupIds = useMemo(() => {
    const rawGroups =
      item?.modifierGroups ||
      item?.attachedModifierGroups ||
      item?.modifier_groups ||
      item?.addons ||
      item?.modifierLinks?.map((link: any) => ({
        id: link?.modifierGroupId || link?.modifierGroup?.id,
        name: link?.modifierGroup?.name,
      })) ||
      [];

    if (!Array.isArray(rawGroups)) return [];

    return rawGroups
      .map((group: any) => String(group?.id || group?.modifierGroupId || ""))
      .filter(Boolean);
  }, [item]);

  const categoryValue = useMemo(() => {
    if (!form.categoryId) return null;

    if (item?.id && String(item.id) === String(form.categoryId)) {
      return item;
    }

    if (item?.category?.id && String(item.category.id) === String(form.categoryId)) {
      return item.category;
    }

    if (
      item?.menuCategory?.id &&
      String(item.menuCategory.id) === String(form.categoryId)
    ) {
      return item.menuCategory;
    }

    return {
      id: form.categoryId,
      name:
        item?.name ||
        initialData?.category?.name ||
        initialData?.menuCategory?.name ||
        "Selected Category",
    };
  }, [form.categoryId, item, initialData]);

  const resetForm = (categoryId = resolvedCategoryId) => {
    setForm(getEmptyForm(categoryId));
    setModifierOverrides([{ modifier: null, priceDelta: "" }]);
    setEditMode("create");
    setEditingVariation(null);
  };

  const populateFormForEdit = (variation: any) => {
    const existingOverrides = Array.isArray(variation?.modifierPriceOverrides)
      ? variation.modifierPriceOverrides
      : [];

    setForm({
      categoryId: resolvedCategoryId,
      name: variation?.name || "",
      description: variation?.description || "",
      price: String(variation?.price ?? ""),
      sortOrder: Number(variation?.sortOrder ?? 0),
      isDefault: !!variation?.isDefault,
      isActive: variation?.isActive === false ? false : true,
    });

    setModifierOverrides(
      existingOverrides.length
        ? existingOverrides.map((override: any) => ({
            modifier:
              override?.modifier || override?.modifierId
                ? {
                    id: override?.modifier?.id || override?.modifierId,
                    name:
                      override?.modifier?.modifierGroup?.name &&
                      override?.modifier?.name
                        ? `${override.modifier.modifierGroup.name} - ${override.modifier.name}`
                        : override?.modifier?.name || "Selected Modifier",
                  }
                : null,
            priceDelta: String(override?.priceDelta ?? ""),
          }))
        : [{ modifier: null, priceDelta: "" }]
    );

    setEditMode("edit");
    setEditingVariation(variation);
  };

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      populateFormForEdit(initialData);
    } else {
      resetForm(resolvedCategoryId);
    }
  }, [open, mode, initialData, resolvedCategoryId]);

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
    if (!open || !token || !resolvedCategoryId) return;
    fetchVariations();
  }, [open, token, resolvedCategoryId]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const fetchModifierOptions = async ({
    search,
    page,
  }: {
    search: string;
    page: number;
  }): Promise<{ data: any[]; meta?: any }> => {
    const query = new URLSearchParams({
      page: String(page),
      limit: "20",
    });

    if (search?.trim()) {
      query.set("search", search.trim());
    }

    const res = await get(`/v1/menu/modifiers?${query.toString()}`);

    if (!res || res.error) {
      return { data: [], meta: undefined };
    }

    const raw =
      (Array.isArray(res?.data) && res.data) ||
      (Array.isArray(res?.data?.data) && res.data.data) ||
      (Array.isArray(res?.data?.items) && res.data.items) ||
      [];

    const filtered = attachedGroupIds.length
      ? raw.filter((modifier: any) => {
          const groupId = String(
            modifier?.modifierGroupId || modifier?.modifierGroup?.id || ""
          );
          return groupId ? attachedGroupIds.includes(groupId) : true;
        })
      : raw;

    return {
      data: filtered,
      meta: res?.meta || res?.data?.meta || res?.data?.pagination,
    };
  };

  const addModifierOverride = () => {
    setModifierOverrides((prev) => [
      ...prev,
      { modifier: null, priceDelta: "" },
    ]);
  };

  const removeModifierOverride = (index: number) => {
    setModifierOverrides((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.length ? updated : [{ modifier: null, priceDelta: "" }];
    });
  };

  const updateModifierOverride = (
    index: number,
    key: keyof ModifierOverride,
    value: any
  ) => {
    setModifierOverrides((prev) =>
      prev.map((entry, i) =>
        i === index
          ? {
              ...entry,
              [key]: value,
            }
          : entry
      )
    );
  };

  const normalizedModifierPayload = modifierOverrides
    .filter((entry) => entry?.modifier?.id)
    .map((entry) => ({
      modifierId: entry.modifier.id,
      priceDelta: Number(entry.priceDelta || 0),
    }));

  const handleSubmit = async () => {
    if (!form.categoryId) {
      toast.error("Category is required");
      return;
    }

    if (!form.name.trim() || form.price === "") {
      toast.error("Name and price are required");
      return;
    }

    const duplicateModifierIds = normalizedModifierPayload.map((entry) =>
      String(entry.modifierId)
    );

    if (new Set(duplicateModifierIds).size !== duplicateModifierIds.length) {
      toast.error("Duplicate modifiers are not allowed");
      return;
    }

    const createPayload = {
      categoryId: form.categoryId,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      sortOrder: Number(form.sortOrder),
      isDefault: form.isDefault,
      isActive: form.isActive,
      modifierPriceOverrides: normalizedModifierPayload,
    };

    const updatePayload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      sortOrder: Number(form.sortOrder),
      isDefault: form.isDefault,
      isActive: form.isActive,
      modifierPriceOverrides: normalizedModifierPayload,
    };

    let res: any;

    if (editMode === "edit" && editingVariation?.id) {
      res = await patch(`/v1/menu/variations/${editingVariation.id}`, updatePayload);
    } else {
      res = await post("/v1/menu/variations", createPayload);
    }

    if (!res) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    if (res.error) {
      toast.error(
        res.error ||
          (editMode === "edit"
            ? "Failed to update variation"
            : "Failed to add variation")
      );
      return;
    }

    if (res.success === false) {
      toast.error(res.message || "Request failed");
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

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) resetForm(resolvedCategoryId);
      }}
    >
      <DialogContent className="max-h-[95vh] max-w-[920px] overflow-auto rounded-[20px] bg-[#F5F5F5] p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-semibold">
            {editMode === "edit" ? "Edit Variation" : "Add Variation"}
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Manage category variations, pricing, and modifier overrides
          </p>
        </DialogHeader>

        <div className="mt-5 grid gap-5 lg:grid-cols-[420px,1fr]">
          <div className="space-y-4 rounded-[16px] bg-white p-5">
            <div className="space-y-2">
              <Label>Category</Label>
              <AsyncSelect
                value={categoryValue}
                onChange={(val) => handleChange("categoryId", val?.id || "")}
                placeholder="Select category"
                fetchOptions={async () => ({
                  data: item?.id ? [item] : [],
                })}
                labelKey="name"
                valueKey="id"
              />
            </div>

            <FormInput
              label="Variation Name"
              placeholder="e.g Large, Medium"
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

            <FormInput
              label="Sort Order"
              placeholder="0"
              value={String(form.sortOrder)}
              onChange={(v) => handleChange("sortOrder", Number(v))}
              type="number"
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Modifier Price Overrides</Label>
                <button
                  type="button"
                  onClick={addModifierOverride}
                  className="text-sm font-medium text-primary"
                >
                  + Add Modifier
                </button>
              </div>

              {modifierOverrides.map((entry, index) => (
                <div
                  key={index}
                  className="space-y-3 rounded-[12px] border border-gray-200 p-3"
                >
                  <div className="space-y-2">
                    <Label>Modifier</Label>
                    <AsyncSelect
                      value={entry.modifier}
                      onChange={(val) =>
                        updateModifierOverride(index, "modifier", val)
                      }
                      placeholder="Select modifier"
                      fetchOptions={fetchModifierOptions}
                      labelKey="name"
                      valueKey="id"
                    />
                  </div>

                  <FormInput
                    label="Price Delta"
                    placeholder="0"
                    value={entry.priceDelta}
                    onChange={(v) =>
                      updateModifierOverride(index, "priceDelta", v)
                    }
                    type="number"
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeModifierOverride(index)}
                      className="text-sm text-red-500"
                      disabled={
                        modifierOverrides.length === 1 && !entry.modifier
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
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

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-2 w-full rounded-[10px] bg-primary py-4 hover:bg-primary/90"
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

              {editMode === "edit" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => resetForm(resolvedCategoryId)}
                  className="mt-2 rounded-[10px] py-4"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-[16px] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Category Variations
                </h3>
                <p className="text-sm text-gray-500">
                  View, edit, and delete variations for this category
                </p>
              </div>
            </div>

            {loadingVariations ? (
              <div className="flex min-h-[200px] items-center justify-center text-gray-500">
                <Loader2 className="animate-spin" size={20} />
              </div>
            ) : variations.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center text-sm text-gray-400">
                No variations found for this category
              </div>
            ) : (
              <div className="space-y-3">
                {variations.map((variation: any) => (
                  <div
                    key={variation.id}
                    className="rounded-[14px] border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {variation?.name || "-"}
                          </h4>

                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              variation?.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {variation?.isActive ? "Active" : "Inactive"}
                          </span>

                          {variation?.isDefault ? (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                              Default
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          {variation?.description || "No description"}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>Price: {variation?.price ?? 0}</span>
                          <span>Sort Order: {variation?.sortOrder ?? 0}</span>
                          <span>
                            Overrides:{" "}
                            {Array.isArray(variation?.modifierPriceOverrides)
                              ? variation.modifierPriceOverrides.length
                              : 0}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => populateFormForEdit(variation)}
                          className="rounded-md border p-2 text-gray-600 hover:text-primary"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteVariation(variation.id)}
                          disabled={deletingVariationId === variation.id}
                          className="rounded-md border p-2 text-gray-600 hover:text-red-500 disabled:opacity-50"
                        >
                          {deletingVariationId === variation.id ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}