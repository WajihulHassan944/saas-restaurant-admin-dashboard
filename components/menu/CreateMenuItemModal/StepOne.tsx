"use client";

import {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AsyncSelect from "@/components/ui/AsyncSelect";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { useGetMenuVariations } from "@/hooks/useMenus";

const schema = z.object({
  name: z.string().min(1, "Item name is required"),
  categoryId: z.string().min(1, "Category is required"),
  basePrice: z.string().min(1, "Base price is required"),
});

type Field = keyof z.infer<typeof schema>;

const pricingModeOptions = [
  {
    value: "FIXED",
    label: "Fixed Price",
  },
  {
    value: "AMOUNT_ADJUSTMENT",
    label: "Amount Adjustment",
  },
  {
    value: "PERCENTAGE_ADJUSTMENT",
    label: "Percentage Adjustment",
  },
];

const toSafeString = (value: any) => {
  if (value === undefined || value === null) return "";
  return String(value);
};

const normalizeApiArray = (res: any) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  return [];
};

const StepOne = forwardRef(({ form, setForm }: any, ref: any) => {
  const { token, user } = useAuth();
  const { get } = useApi(token);

  const [errors, setErrors] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const restaurantId =
    user?.restaurantId ||
    (typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("auth") || "{}")?.user?.restaurantId
      : null);

  const {
    data: variationsResponse,
    isFetching: isFetchingVariations,
  } = useGetMenuVariations({
    categoryId: form?.categoryId || undefined,
    limit: 100,
  });

  const categoryVariations = useMemo(() => {
    const raw = normalizeApiArray(variationsResponse);

    const map = new Map<string, any>();

    raw.forEach((variation: any) => {
      if (!variation?.id) return;

      map.set(String(variation.id), {
        id: String(variation.id),
        name: variation.name || "",
        description: variation.description || "",
        price: variation.price,
        pricingMode: variation.pricingMode || "FIXED",
        adjustmentValue: variation.adjustmentValue,
        sortOrder: Number(variation.sortOrder || 0),
      });
    });

    return Array.from(map.values()).sort(
      (a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)
    );
  }, [variationsResponse]);

  useEffect(() => {
    if (!form?.categoryId) {
      setForm((prev: any) => ({
        ...prev,
        variationPriceOverrides: [],
      }));
      return;
    }

    if (!categoryVariations.length) return;

    setForm((prev: any) => {
      const existingOverrides = Array.isArray(prev.variationPriceOverrides)
        ? prev.variationPriceOverrides
        : [];

      const existingMap = new Map(
        existingOverrides
          .filter((item: any) => item?.variationId)
          .map((item: any) => [String(item.variationId), item])
      );

      const nextOverrides = categoryVariations.map((variation: any) => {
        const existing = existingMap.get(String(variation.id));

        return {
          variationId: String(variation.id),
          pricingMode:
            existing?.pricingMode ||
            variation.pricingMode ||
            "FIXED",
          price:
            existing?.price !== undefined && existing?.price !== null
              ? String(existing.price)
              : variation.price !== undefined && variation.price !== null
              ? String(variation.price)
              : "",
          adjustmentValue:
            existing?.adjustmentValue !== undefined &&
            existing?.adjustmentValue !== null
              ? String(existing.adjustmentValue)
              : variation.adjustmentValue !== undefined &&
                variation.adjustmentValue !== null
              ? String(variation.adjustmentValue)
              : "",
        };
      });

      return {
        ...prev,
        variationPriceOverrides: nextOverrides,
      };
    });
  }, [form?.categoryId, categoryVariations.length]);

  const variationPriceMap = useMemo(() => {
    const map = new Map<string, any>();

    if (Array.isArray(form?.variationPriceOverrides)) {
      form.variationPriceOverrides.forEach((item: any) => {
        if (!item?.variationId) return;
        map.set(String(item.variationId), item);
      });
    }

    return map;
  }, [form?.variationPriceOverrides]);

  const updateVariationOverride = (
    variationId: string,
    patch: Record<string, any>
  ) => {
    setForm((prev: any) => {
      const current = Array.isArray(prev.variationPriceOverrides)
        ? prev.variationPriceOverrides
        : [];

      const exists = current.some(
        (item: any) => String(item.variationId) === String(variationId)
      );

      const next = exists
        ? current.map((item: any) =>
            String(item.variationId) === String(variationId)
              ? {
                  ...item,
                  ...patch,
                }
              : item
          )
        : [
            ...current,
            {
              variationId,
              pricingMode: "FIXED",
              price: "",
              adjustmentValue: "",
              ...patch,
            },
          ];

      return {
        ...prev,
        variationPriceOverrides: next,
      };
    });
  };

  const validateField = (field: Field, value: any) => {
    try {
      schema.shape[field].parse(value);

      setErrors((prev: any) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    } catch (err: any) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: err.errors?.[0]?.message || "Invalid value",
      }));
    }
  };

  const validateVariationPrices = () => {
    if (!categoryVariations.length) return true;

    const variationErrors: Record<string, string> = {};

    for (const variation of categoryVariations) {
      const override = variationPriceMap.get(String(variation.id));
      const mode = override?.pricingMode || "FIXED";

      if (mode === "FIXED") {
        if (
          override?.price === "" ||
          override?.price === undefined ||
          override?.price === null ||
          Number.isNaN(Number(override.price))
        ) {
          variationErrors[String(variation.id)] = "Price is required";
        }
      } else {
        if (
          override?.adjustmentValue === "" ||
          override?.adjustmentValue === undefined ||
          override?.adjustmentValue === null ||
          Number.isNaN(Number(override.adjustmentValue))
        ) {
          variationErrors[String(variation.id)] = "Adjustment is required";
        }
      }
    }

    if (Object.keys(variationErrors).length) {
      setErrors((prev: any) => ({
        ...prev,
        variationPriceOverrides: variationErrors,
      }));
      return false;
    }

    setErrors((prev: any) => {
      const copy = { ...prev };
      delete copy.variationPriceOverrides;
      return copy;
    });

    return true;
  };

  const validateStep = () => {
    const result = schema.safeParse(form);

    if (!result.success) {
      const fieldErrors: any = {};

      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });

      setErrors(fieldErrors);
      return false;
    }

    const validVariationPrices = validateVariationPrices();

    if (!validVariationPrices) return false;

    setErrors({});
    return true;
  };

  useImperativeHandle(ref, () => ({
    validateStep,
  }));

  const fetchCategories = async ({
    search = "",
    page = 1,
  }: {
    search: string;
    page: number;
  }) => {
    if (!restaurantId) {
      return {
        data: [],
        meta: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }

    const params = new URLSearchParams({
      restaurantId: String(restaurantId),
      page: String(page),
      limit: "10",
    });

    if (search?.trim()) {
      params.set("search", search.trim());
    }

    const res = await get(`/v1/menu/categories?${params.toString()}`);

    const normalizedData = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res?.data?.items)
      ? res.data.items
      : [];

    return {
      data: normalizedData,
      meta: res?.meta || res?.data?.meta || res?.data?.pagination || {},
    };
  };

  useEffect(() => {
    if (!form?.categoryId) {
      setSelectedCategory(null);
      return;
    }

    if (
      selectedCategory?.id &&
      String(selectedCategory.id) === String(form.categoryId)
    ) {
      return;
    }

    const loadSelectedCategory = async () => {
      try {
        const res = await fetchCategories({
          search: "",
          page: 1,
        });

        const matched = res?.data?.find(
          (cat: any) => String(cat.id) === String(form.categoryId)
        );

        if (matched) {
          setSelectedCategory(matched);
        } else if (form?.categoryId) {
          setSelectedCategory({
            id: form.categoryId,
            name: form?.category?.name || "Selected Category",
          });
        }
      } catch (error) {
        console.error("Failed to load selected category", error);
      }
    };

    loadSelectedCategory();
  }, [form?.categoryId]);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Item Name</Label>

        <Input
          value={form.name}
          placeholder="eg. Greek Salad"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onBlur={(e) => validateField("name", e.target.value)}
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />

        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label>Select Category</Label>

        <AsyncSelect
          value={selectedCategory}
          onChange={(val) => {
            setSelectedCategory(val);

            setForm((prev: any) => ({
              ...prev,
              categoryId: String(val?.id || ""),
              variationPriceOverrides: [],
            }));

            validateField("categoryId", String(val?.id || ""));
          }}
          placeholder="Select category"
          fetchOptions={fetchCategories}
          labelKey="name"
          valueKey="id"
        />

        {errors.categoryId && (
          <p className="text-xs text-red-500">{errors.categoryId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Description</Label>

        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="h-[90px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label>Base Price</Label>

        <Input
          type="number"
          value={form.basePrice}
          onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
          onBlur={(e) => validateField("basePrice", e.target.value)}
          className="h-[44px] rounded-[12px] border-gray-300 focus:border-gray-400"
        />

        {errors.basePrice && (
          <p className="text-xs text-red-500">{errors.basePrice}</p>
        )}
      </div>

      <div className="space-y-3 rounded-[16px] border border-gray-200 bg-gray-50 p-4">
        <div>
          <Label>Variation Pricing</Label>
          <p className="mt-1 text-xs text-gray-500">
            Variations are selected from the category, but prices are saved per
            item.
          </p>
        </div>

        {!form?.categoryId ? (
          <p className="text-sm text-gray-500">
            Select a category to configure variation prices.
          </p>
        ) : isFetchingVariations ? (
          <p className="text-sm text-gray-500">Loading variations...</p>
        ) : categoryVariations.length === 0 ? (
          <p className="text-sm text-gray-500">
            No active variations found for this category.
          </p>
        ) : (
          <div className="space-y-3">
            {categoryVariations.map((variation: any) => {
              const override = variationPriceMap.get(String(variation.id)) || {
                pricingMode: "FIXED",
                price: "",
                adjustmentValue: "",
              };

              const mode = override.pricingMode || "FIXED";
              const variationError =
                errors?.variationPriceOverrides?.[String(variation.id)];

              return (
                <div
                  key={variation.id}
                  className="rounded-[14px] border border-gray-200 bg-white p-3"
                >
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {variation.name}
                    </p>
                    {variation.description ? (
                      <p className="text-xs text-gray-500">
                        {variation.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Pricing Mode</Label>

                      <select
                        value={mode}
                        onChange={(e) => {
                          updateVariationOverride(String(variation.id), {
                            pricingMode: e.target.value,
                            price:
                              e.target.value === "FIXED"
                                ? override.price
                                : "",
                            adjustmentValue:
                              e.target.value !== "FIXED"
                                ? override.adjustmentValue
                                : "",
                          });
                        }}
                        className="h-[40px] w-full rounded-[10px] border border-gray-300 bg-white px-3 text-sm outline-none"
                      >
                        {pricingModeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {mode === "FIXED" ? (
                      <div className="space-y-1">
                        <Label className="text-xs">Item Variation Price</Label>

                        <Input
                          type="number"
                          value={toSafeString(override.price)}
                          onChange={(e) =>
                            updateVariationOverride(String(variation.id), {
                              price: e.target.value,
                            })
                          }
                          placeholder="eg. 12"
                          className="h-[40px] rounded-[10px]"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Label className="text-xs">
                          {mode === "PERCENTAGE_ADJUSTMENT"
                            ? "Adjustment Percentage"
                            : "Adjustment Amount"}
                        </Label>

                        <Input
                          type="number"
                          value={toSafeString(override.adjustmentValue)}
                          onChange={(e) =>
                            updateVariationOverride(String(variation.id), {
                              adjustmentValue: e.target.value,
                            })
                          }
                          placeholder={
                            mode === "PERCENTAGE_ADJUSTMENT" ? "eg. 10" : "eg. 2"
                          }
                          className="h-[40px] rounded-[10px]"
                        />
                      </div>
                    )}
                  </div>

                  {variationError ? (
                    <p className="mt-2 text-xs text-red-500">
                      {variationError}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 rounded-[12px] border border-gray-200 bg-white p-3 text-sm">
        <input
          type="checkbox"
          checked={Boolean(form.supportsSplitPizza)}
          onChange={(e) =>
            setForm((prev: any) => ({
              ...prev,
              supportsSplitPizza: e.target.checked,
            }))
          }
          className="accent-[var(--primary)]"
        />
        <span>Supports Split Pizza</span>
      </label>
    </div>
  );
});

StepOne.displayName = "StepOne";

export default StepOne;