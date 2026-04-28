"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import useApi from "@/hooks/useApi";
import { toast } from "sonner";
import { useCreateModifier, useUpdateMenuVariation, useUpdateModifier } from "@/hooks/useMenus";
import AsyncSelect from "@/components/ui/AsyncSelect";
import { useGetModifierGroupCategories } from "@/hooks/useMenuCategories";

type VariationPriceOverride = {
  variationId: string;
  priceDelta: number | "";
};

interface ModifierForm {
  modifierGroupIds: string[];
  name: string;
  priceDelta: number;
  sortOrder: number;
  variationPriceOverrides: VariationPriceOverride[];
}

const SORT_ORDER_OPTIONS = [
  { label: "Top Priority", value: 0 },
  { label: "High Priority", value: 10 },
  { label: "Medium Priority", value: 50 },
  { label: "Low Priority", value: 100 },
];

const getEmptyForm = (): ModifierForm => ({
  modifierGroupIds: [],
  name: "",
  priceDelta: 0,
  sortOrder: 0,
  variationPriceOverrides: [],
});

export default function ModifierModal({
  open,
  onOpenChange,
  initialData,
  refresh,
}: any) {
  const { token, restaurantId } = useAuth();
  const api = useApi(token);

  const { mutateAsync: createModifier, isPending: isCreating } =
    useCreateModifier();

  const { mutateAsync: updateModifier, isPending: isUpdating } =
    useUpdateModifier();

  const { mutateAsync: updateMenuVariation, isPending: isUpdatingVariation } =
    useUpdateMenuVariation();

  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const selectedGroupId = selectedGroup?.id ? String(selectedGroup.id) : "";

  const { data: modifierGroupCategoriesRes, isLoading: loadingCategories } =
    useGetModifierGroupCategories(selectedGroupId);

  const [variations, setVariations] = useState<any[]>([]);
  const [loadingVariations, setLoadingVariations] = useState(false);
  const [form, setForm] = useState<ModifierForm>(getEmptyForm());

  const isSubmitting = isCreating || isUpdating || isUpdatingVariation;

  const linkedCategories = useMemo(() => {
    const raw = Array.isArray(modifierGroupCategoriesRes?.data)
      ? modifierGroupCategoriesRes.data
      : Array.isArray(modifierGroupCategoriesRes)
      ? modifierGroupCategoriesRes
      : [];

    return raw
      .map((entry: any) => entry?.category || entry)
      .filter((category: any) => category?.id);
  }, [modifierGroupCategoriesRes]);

  const normalizeExistingVariationOverrides = (
    modifier: any,
    groupVariations: any[]
  ): VariationPriceOverride[] => {
    const modifierId = String(modifier?.id || "");

    return groupVariations.map((variation: any) => {
      const existingOverrides = Array.isArray(variation?.modifierPriceOverrides)
        ? variation.modifierPriceOverrides
        : [];

      const existing = existingOverrides.find(
        (override: any) => String(override?.modifierId) === modifierId
      );

      return {
        variationId: String(variation?.id),
        priceDelta:
          existing?.priceDelta !== undefined && existing?.priceDelta !== null
            ? Number(existing.priceDelta)
            : "",
      };
    });
  };

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      const resolvedGroup =
        initialData?.modifierGroup ||
        initialData?.modifierGroups?.[0] ||
        (initialData?.modifierGroupId
          ? {
              id: initialData.modifierGroupId,
              name: initialData.modifierGroupName || "Selected Group",
            }
          : null);

      setSelectedGroup(
        resolvedGroup
          ? {
              id: String(resolvedGroup?.id || ""),
              name: resolvedGroup?.name || "Selected Group",
            }
          : null
      );

      setForm({
        modifierGroupIds: resolvedGroup?.id ? [String(resolvedGroup.id)] : [],
        name: initialData.name || "",
        priceDelta: Number(initialData.priceDelta || 0),
        sortOrder: Number(initialData.sortOrder || 0),
        variationPriceOverrides: [],
      });
    } else {
      setSelectedGroup(null);
      setForm(getEmptyForm());
      setVariations([]);
    }
  }, [initialData, open]);

  useEffect(() => {
    if (!open || !selectedGroupId) {
      setVariations([]);
      return;
    }

    if (!linkedCategories.length) {
      setVariations([]);
      return;
    }

    const fetchVariationsForLinkedCategories = async () => {
      setLoadingVariations(true);

      try {
        const variationResponses = await Promise.all(
          linkedCategories.map(async (category: any) => {
            const query = new URLSearchParams({
              categoryId: String(category.id),
              sortOrder: "DESC",
            });

            const res = await api.get(
              `/v1/menu/variations?${query.toString()}`
            );

            const normalizedData = Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res?.data?.data)
              ? res.data.data
              : Array.isArray(res?.data?.items)
              ? res.data.items
              : [];

            return normalizedData.map((variation: any) => ({
              ...variation,
              categoryId: category.id,
              categoryName: category.name,
            }));
          })
        );

        const mergedVariations = variationResponses.flat();

        const uniqueVariations = Array.from(
          new Map(
            mergedVariations.map((variation: any) => [
              String(variation.id),
              variation,
            ])
          ).values()
        );

        setVariations(uniqueVariations);
      } catch {
        setVariations([]);
        toast.error("Failed to load category variations");
      } finally {
        setLoadingVariations(false);
      }
    };

    fetchVariationsForLinkedCategories();
  }, [open, selectedGroupId, linkedCategories, token]);

  useEffect(() => {
    if (!open) return;

    setForm((prev): ModifierForm => ({
      ...prev,
      variationPriceOverrides:
        initialData?.id && variations.length
          ? normalizeExistingVariationOverrides(initialData, variations)
          : variations.map(
              (variation: any): VariationPriceOverride => ({
                variationId: String(variation?.id),
                priceDelta: "",
              })
            ),
    }));
  }, [variations, initialData, open]);

  const fetchModifierGroups = async ({
    search = "",
    page = 1,
  }: {
    search: string;
    page: number;
  }) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: "10",
    });

    if (search?.trim()) {
      params.set("search", search.trim());
    }

    if (restaurantId) {
      params.set("restaurantId", String(restaurantId));
    }

    const res = await api.get(`/v1/menu/modifier-groups?${params.toString()}`);

    const normalizedData = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res?.data?.items)
      ? res.data.items
      : Array.isArray(res?.data?.modifierGroups)
      ? res.data.modifierGroups
      : [];

    return {
      data: normalizedData,
      meta: res?.meta || res?.data?.meta || res?.data?.pagination || {},
    };
  };

  const handleChange = (key: keyof ModifierForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleVariationOverrideChange = (
    variationId: string,
    priceDelta: string
  ) => {
    setForm((prev): ModifierForm => {
      const normalizedValue: number | "" =
        priceDelta === "" ? "" : Number(priceDelta);

      const exists = prev.variationPriceOverrides.some(
        (override) => String(override.variationId) === String(variationId)
      );

      if (exists) {
        return {
          ...prev,
          variationPriceOverrides: prev.variationPriceOverrides.map(
            (override) =>
              String(override.variationId) === String(variationId)
                ? {
                    ...override,
                    priceDelta: normalizedValue,
                  }
                : override
          ),
        };
      }

      return {
        ...prev,
        variationPriceOverrides: [
          ...prev.variationPriceOverrides,
          {
            variationId,
            priceDelta: normalizedValue,
          },
        ],
      };
    });
  };

  const canSubmit = useMemo(() => {
    return !!form.name?.trim() && form.modifierGroupIds.length > 0;
  }, [form.name, form.modifierGroupIds]);

  const normalizedVariationOverrides = useMemo(
    () =>
      form.variationPriceOverrides
        .filter(
          (override) =>
            override.variationId &&
            override.priceDelta !== "" &&
            !Number.isNaN(Number(override.priceDelta))
        )
        .map((override) => ({
          variationId: override.variationId,
          priceDelta: Number(override.priceDelta),
        })),
    [form.variationPriceOverrides]
  );

  const patchVariationModifierOverrides = async (modifierId: string) => {
  if (!modifierId || normalizedVariationOverrides.length === 0) return;

  await Promise.all(
    normalizedVariationOverrides.map(async (override) => {
      const variation = variations.find(
        (entry) => String(entry.id) === String(override.variationId)
      );

      if (!variation?.id) return;

      const existingOverrides = Array.isArray(variation?.modifierPriceOverrides)
        ? variation.modifierPriceOverrides
        : [];

      const nextOverrides = [
        ...existingOverrides
          .filter(
            (entry: any) => String(entry?.modifierId) !== String(modifierId)
          )
          .map((entry: any) => ({
            modifierId: String(entry.modifierId),
            priceDelta: Number(entry.priceDelta),
          })),
        {
          modifierId: String(modifierId),
          priceDelta: Number(override.priceDelta),
        },
      ];

      await updateMenuVariation({
        id: String(variation.id),
        data: {
          modifierPriceOverrides: nextOverrides,
        },
      });
    })
  );
};

  const getModifierIdFromResponse = (res: any) => {
    return (
      res?.data?.id ||
      res?.data?.data?.id ||
      res?.modifier?.id ||
      res?.id ||
      initialData?.id ||
      ""
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Required fields missing");
      return;
    }

    try {
      const modifierPayload = {
        name: form.name.trim(),
        priceDelta: Number(form.priceDelta),
        sortOrder: Number(form.sortOrder),
        modifierGroupIds: form.modifierGroupIds,
      };

      let modifierRes: any;

      if (initialData?.id) {
        modifierRes = await updateModifier({
          id: initialData.id,
          data: modifierPayload,
        });

        const modifierId = getModifierIdFromResponse(modifierRes);
        await patchVariationModifierOverrides(modifierId);

      } else {
        modifierRes = await createModifier(modifierPayload);

        const modifierId = getModifierIdFromResponse(modifierRes);
        await patchVariationModifierOverrides(modifierId);

      }

      refresh?.();
      onOpenChange(false);
    } catch {
      toast.error("Failed to save modifier");
    }
  };

  const getVariationOverrideValue = (variationId: string) => {
    const override = form.variationPriceOverrides.find(
      (entry) => String(entry.variationId) === String(variationId)
    );

    return override?.priceDelta ?? "";
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isSubmitting) onOpenChange(value);
      }}
    >
      <DialogContent className="max-h-[95vh] max-w-[520px] overflow-auto rounded-[20px] bg-[#F5F5F5] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {initialData ? "Edit" : "Add"} Modifier
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Configure modifier details and variation-specific prices
          </p>
        </DialogHeader>

        <div className="mt-5 space-y-4 rounded-[16px] bg-white p-5">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Modifier Group</p>

            <AsyncSelect
              value={selectedGroup}
              onChange={(group) => {
                setSelectedGroup(group);

                handleChange(
                  "modifierGroupIds",
                  group?.id ? [String(group.id)] : []
                );

                setVariations([]);
                handleChange("variationPriceOverrides", []);
              }}
              placeholder="Select Group"
              fetchOptions={fetchModifierGroups}
              labelKey="name"
              valueKey="id"
            />
          </div>

          <InputField
            label="Modifier Name"
            value={form.name}
            onChange={(v: string) => handleChange("name", v)}
          />

          <InputField
            label="Default Price Delta"
            type="number"
            value={form.priceDelta}
            onChange={(v: string) => handleChange("priceDelta", Number(v))}
          />

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Display Priority</p>

            <div className="relative">
              <select
                value={String(form.sortOrder)}
                onChange={(e) =>
                  handleChange("sortOrder", Number(e.target.value))
                }
                className="h-[40px] w-full appearance-none rounded-[10px] border border-gray-300 bg-white px-3 pr-10 text-sm outline-none focus:border-gray-400"
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
              Top priority modifiers appear first inside their group.
            </p>
          </div>

          <div className="rounded-[14px] border border-gray-200 bg-[#F9FAFB] p-4">
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-900">
                Variation Price Overrides
              </p>
              <p className="text-xs text-gray-500">
                Select a modifier group to load variations from its linked
                categories. Leave empty to use the default price delta.
              </p>
            </div>

            {loadingCategories || loadingVariations ? (
              <div className="flex min-h-[90px] items-center justify-center text-gray-500">
                <Loader2 className="animate-spin" size={20} />
              </div>
            ) : !selectedGroupId ? (
              <div className="rounded-[12px] border border-dashed border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
                Select a modifier group first.
              </div>
            ) : linkedCategories.length === 0 ? (
              <div className="rounded-[12px] border border-dashed border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
                No categories linked with this modifier group.
              </div>
            ) : variations.length === 0 ? (
              <div className="rounded-[12px] border border-dashed border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
                No variations found for linked categories.
              </div>
            ) : (
              <div className="space-y-3">
                {variations.map((variation: any) => (
                  <div
                    key={variation.id}
                    className="grid gap-2 rounded-[12px] bg-white p-3 sm:grid-cols-[1fr,140px]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {variation?.name || "Unnamed Variation"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {variation?.categoryName
                          ? `${variation.categoryName} • `
                          : ""}
                        Base price: {variation?.price ?? 0}
                      </p>
                    </div>

                    <input
                      type="number"
                      value={getVariationOverrideValue(String(variation.id))}
                      onChange={(e) =>
                        handleVariationOverrideChange(
                          String(variation.id),
                          e.target.value
                        )
                      }
                      placeholder="Override"
                      className="h-[38px] w-full rounded-[10px] border border-gray-300 px-3 text-sm outline-none focus:border-gray-400"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-2 w-full rounded-[10px] bg-primary py-4"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Saving...
              </span>
            ) : initialData ? (
              "Update Modifier"
            ) : (
              "Create Modifier"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-600">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[40px] w-full rounded-[10px] border border-gray-300 px-3 outline-none focus:border-gray-400"
      />
    </div>
  );
}