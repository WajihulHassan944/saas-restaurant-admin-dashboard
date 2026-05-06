"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

import { useAuth } from "@/hooks/useAuth";
import { useCreateMenuItem, useUpdateMenuItem } from "@/hooks/useMenus";

interface CreateMenuItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  onSuccess?: () => void;
}

type EntityType = "variation" | "modifier";

type ModifierPriceOverride = {
  modifierId: string;
  priceDelta: string;
};

type VariationPriceOverride = {
  variationId: string;
  price: string;
  pickupPrice: string;
  displayText: string;
  modifierPriceOverrides: ModifierPriceOverride[];
};

const buildSlug = (value: string) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const normalizeArray = (value: any): any[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [];
};

const normalizeIds = (sources: any[], type: EntityType): string[] => {
  const ids = new Set<string>();

  sources.forEach((source) => {
    normalizeArray(source).forEach((entry) => {
      if (entry === null || entry === undefined) return;

      if (typeof entry === "string" || typeof entry === "number") {
        ids.add(String(entry));
        return;
      }

      if (type === "variation") {
        const id =
          entry?.variationId ||
          entry?.variation?.id ||
          entry?.menuVariation?.id ||
          entry?.id;

        if (id) ids.add(String(id));
        return;
      }

      const id =
        entry?.modifierId ||
        entry?.modifier?.id ||
        entry?.menuModifier?.id ||
        entry?.id;

      if (id) ids.add(String(id));
    });
  });

  return Array.from(ids);
};

const toNumberOrZero = (value: any) => {
  if (value === "" || value === undefined || value === null) return 0;

  const numeric = Number(value);

  return Number.isNaN(numeric) ? 0 : numeric;
};

const normalizeModifierPriceOverrides = (raw: any[]): ModifierPriceOverride[] => {
  return normalizeArray(raw)
    .filter((entry) => {
      const modifierId =
        entry?.modifierId || entry?.modifier?.id || entry?.menuModifier?.id;

      const variationId =
        entry?.variationId || entry?.variation?.id || entry?.menuVariation?.id;

      return modifierId && !variationId;
    })
    .map((entry) => ({
      modifierId: String(
        entry?.modifierId || entry?.modifier?.id || entry?.menuModifier?.id
      ),
      priceDelta:
        entry?.priceDelta !== undefined && entry?.priceDelta !== null
          ? String(entry.priceDelta)
          : "0",
    }));
};

const normalizeNestedModifierPriceOverrides = (
  raw: any[]
): ModifierPriceOverride[] => {
  return normalizeArray(raw)
    .filter((entry) => {
      const modifierId =
        entry?.modifierId || entry?.modifier?.id || entry?.menuModifier?.id;

      return modifierId;
    })
    .map((entry) => ({
      modifierId: String(
        entry?.modifierId || entry?.modifier?.id || entry?.menuModifier?.id
      ),
      priceDelta:
        entry?.priceDelta !== undefined && entry?.priceDelta !== null
          ? String(entry.priceDelta)
          : "0",
    }));
};

const normalizeFlatVariationModifierOverrides = (
  raw: any[]
): Array<ModifierPriceOverride & { variationId: string }> => {
  return normalizeArray(raw)
    .filter((entry) => {
      const modifierId =
        entry?.modifierId || entry?.modifier?.id || entry?.menuModifier?.id;

      const variationId =
        entry?.variationId || entry?.variation?.id || entry?.menuVariation?.id;

      return modifierId && variationId;
    })
    .map((entry) => ({
      modifierId: String(
        entry?.modifierId || entry?.modifier?.id || entry?.menuModifier?.id
      ),
      variationId: String(
        entry?.variationId || entry?.variation?.id || entry?.menuVariation?.id
      ),
      priceDelta:
        entry?.priceDelta !== undefined && entry?.priceDelta !== null
          ? String(entry.priceDelta)
          : entry?.price !== undefined && entry?.price !== null
          ? String(entry.price)
          : "0",
    }));
};

const mergeModifierOverrides = (
  fallback: ModifierPriceOverride[],
  preferred: ModifierPriceOverride[]
) => {
  const map = new Map<string, ModifierPriceOverride>();

  fallback.forEach((entry) => {
    if (!entry?.modifierId) return;
    map.set(String(entry.modifierId), entry);
  });

  preferred.forEach((entry) => {
    if (!entry?.modifierId) return;
    map.set(String(entry.modifierId), entry);
  });

  return Array.from(map.values());
};

const normalizeVariationPriceOverrides = ({
  rawVariationOverrides,
  rawFlatModifierOverrides,
}: {
  rawVariationOverrides: any[];
  rawFlatModifierOverrides: any[];
}): VariationPriceOverride[] => {
  const map = new Map<string, VariationPriceOverride>();

  normalizeArray(rawVariationOverrides).forEach((entry) => {
    const variationId =
      entry?.variationId || entry?.variation?.id || entry?.menuVariation?.id || entry?.id;

    if (!variationId) return;

    const id = String(variationId);

    map.set(id, {
      variationId: id,
      price:
        entry?.price !== undefined && entry?.price !== null
          ? String(entry.price)
          : "",
      pickupPrice:
        entry?.pickupPrice !== undefined && entry?.pickupPrice !== null
          ? String(entry.pickupPrice)
          : "",
      displayText:
        entry?.displayText !== undefined && entry?.displayText !== null
          ? String(entry.displayText)
          : "",
      modifierPriceOverrides: normalizeNestedModifierPriceOverrides(
        entry?.modifierPriceOverrides
      ),
    });
  });

  const flatOverrides = normalizeFlatVariationModifierOverrides(
    rawFlatModifierOverrides
  );

  flatOverrides.forEach((entry) => {
    const existing = map.get(String(entry.variationId));

    const fallbackNested = [
      {
        modifierId: entry.modifierId,
        priceDelta: entry.priceDelta,
      },
    ];

    if (!existing) {
      map.set(String(entry.variationId), {
        variationId: String(entry.variationId),
        price: "",
        pickupPrice: "",
        displayText: "",
        modifierPriceOverrides: fallbackNested,
      });
      return;
    }

    map.set(String(entry.variationId), {
      ...existing,
      modifierPriceOverrides: mergeModifierOverrides(
        fallbackNested,
        existing.modifierPriceOverrides
      ),
    });
  });

  return Array.from(map.values());
};

const getRawVariationOverrideSource = (initialData?: any) => {
  if (Array.isArray(initialData?.variationPriceOverrides)) {
    return initialData.variationPriceOverrides;
  }

  if (Array.isArray(initialData?.variations)) {
    return initialData.variations;
  }

  if (Array.isArray(initialData?.itemVariations)) {
    return initialData.itemVariations;
  }

  if (Array.isArray(initialData?.variationLinks)) {
    return initialData.variationLinks;
  }

  return [];
};

const getNestedModifierOverridesFromVariations = (variationOverrides: any[]) => {
  return normalizeArray(variationOverrides).flatMap(
    (entry) => entry?.modifierPriceOverrides || []
  );
};

const getInitialForm = (restaurantId?: string, initialData?: any) => {
  const rawVariationOverrides = getRawVariationOverrideSource(initialData);
  const rawFlatModifierOverrides = normalizeArray(
    initialData?.modifierPriceOverrides
  );

  const normalizedVariationOverrides = normalizeVariationPriceOverrides({
    rawVariationOverrides,
    rawFlatModifierOverrides,
  });

  const nestedModifierOverrides = getNestedModifierOverridesFromVariations(
    normalizedVariationOverrides
  );

  return {
    name: initialData?.name || "",
    categoryId: initialData?.categoryId || initialData?.category?.id || "",
    description: initialData?.description || "",
    ingredients: initialData?.ingredients || "",
    nutritionalInformation: initialData?.nutritionalInformation || "",

    imageUrl: initialData?.imageUrl || "",
    imagePreview: initialData?.imageUrl || "",

    slug: initialData?.slug || "",
    sku: initialData?.sku || "",

    pricingMode: initialData?.pricingMode || "SINGLE",

    basePrice:
      initialData?.basePrice !== undefined && initialData?.basePrice !== null
        ? String(initialData.basePrice)
        : initialData?.price !== undefined && initialData?.price !== null
        ? String(initialData.price)
        : "",

    deliveryPriceAdjustment:
      initialData?.deliveryPriceAdjustment !== undefined &&
      initialData?.deliveryPriceAdjustment !== null
        ? String(initialData.deliveryPriceAdjustment)
        : "",

    takeawayPriceAdjustment:
      initialData?.takeawayPriceAdjustment !== undefined &&
      initialData?.takeawayPriceAdjustment !== null
        ? String(initialData.takeawayPriceAdjustment)
        : "",

    prepTimeMinutes:
      initialData?.prepTimeMinutes !== undefined &&
      initialData?.prepTimeMinutes !== null
        ? String(initialData.prepTimeMinutes)
        : "",

    dietaryFlags: Array.isArray(initialData?.dietaryFlags)
      ? initialData.dietaryFlags.join(", ")
      : initialData?.dietaryFlags || "",

    allergenFlags: Array.isArray(initialData?.allergenFlags)
      ? initialData.allergenFlags.join(", ")
      : initialData?.allergenFlags || "",

    depositAmount:
      initialData?.depositAmount !== undefined &&
      initialData?.depositAmount !== null
        ? String(initialData.depositAmount)
        : "",

    variationIds: normalizeIds(
      [
        initialData?.variationIds,
        initialData?.variations,
        initialData?.itemVariations,
        initialData?.variationLinks,
        normalizedVariationOverrides,
        rawFlatModifierOverrides,
      ],
      "variation"
    ),

    modifierIds: normalizeIds(
      [
        initialData?.modifierIds,
        initialData?.modifiers,
        initialData?.itemModifiers,
        initialData?.modifierLinks,
        normalizeModifierPriceOverrides(rawFlatModifierOverrides),
        nestedModifierOverrides,
      ],
      "modifier"
    ),

    modifierPriceOverrides: normalizeModifierPriceOverrides(
      rawFlatModifierOverrides
    ),

    variationPriceOverrides: normalizedVariationOverrides,

    supportsSplitPizza:
      typeof initialData?.supportsSplitPizza === "boolean"
        ? initialData.supportsSplitPizza
        : false,

    restaurantId: restaurantId || initialData?.restaurantId || "",

    isActive:
      typeof initialData?.isActive === "boolean" ? initialData.isActive : true,
  };
};

export default function CreateMenuItemModal({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: CreateMenuItemModalProps) {
  const { token, restaurantId: authRestaurantId } = useAuth();
  const restaurantId = authRestaurantId ?? undefined;

  const isEditMode = Boolean(initialData?.id);
  const stepRef = useRef<any>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<any>(
    getInitialForm(restaurantId, initialData)
  );

  const { mutate: createMenuItem, isPending: isCreating } =
    useCreateMenuItem();

  const { mutate: updateMenuItem, isPending: isUpdating } =
    useUpdateMenuItem();

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (!open) return;

    setCurrentStep(1);
    setForm(getInitialForm(restaurantId, initialData));
  }, [open, restaurantId, initialData]);

  const parsedDietaryFlags = useMemo(() => {
    if (!form.dietaryFlags) return [];
    if (Array.isArray(form.dietaryFlags)) return form.dietaryFlags;

    return String(form.dietaryFlags)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [form.dietaryFlags]);

  const parsedAllergenFlags = useMemo(() => {
    if (!form.allergenFlags) return [];
    if (Array.isArray(form.allergenFlags)) return form.allergenFlags;

    return String(form.allergenFlags)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [form.allergenFlags]);

  const selectedVariationIds = useMemo(
    () =>
      normalizeIds(
        [
          form?.variationIds,
          form?.variations,
          form?.itemVariations,
          form?.variationLinks,
          form?.variationPriceOverrides,
        ],
        "variation"
      ),
    [
      form?.variationIds,
      form?.variations,
      form?.itemVariations,
      form?.variationLinks,
      form?.variationPriceOverrides,
    ]
  );

  const selectedModifierIds = useMemo(() => {
    const nestedModifierOverrides = getNestedModifierOverridesFromVariations(
      form?.variationPriceOverrides
    );

    return normalizeIds(
      [
        form?.modifierIds,
        form?.modifiers,
        form?.itemModifiers,
        form?.modifierLinks,
        form?.modifierPriceOverrides,
        nestedModifierOverrides,
      ],
      "modifier"
    );
  }, [
    form?.modifierIds,
    form?.modifiers,
    form?.itemModifiers,
    form?.modifierLinks,
    form?.modifierPriceOverrides,
    form?.variationPriceOverrides,
  ]);

  const selectedModifierPriceOverrides = useMemo(
    () => normalizeModifierPriceOverrides(form?.modifierPriceOverrides),
    [form?.modifierPriceOverrides]
  );

  const selectedVariationPriceOverrides = useMemo(
    () =>
      normalizeVariationPriceOverrides({
        rawVariationOverrides: form?.variationPriceOverrides,
        rawFlatModifierOverrides: [],
      }),
    [form?.variationPriceOverrides]
  );

  const buildPayload = () => {
    const generatedSlug = form.slug?.trim() || buildSlug(form.name);

    const basePrice = toNumberOrZero(form.basePrice);

    const modifierPriceOverrideMap = new Map<string, ModifierPriceOverride>();

    selectedModifierPriceOverrides.forEach((item) => {
      modifierPriceOverrideMap.set(String(item.modifierId), item);
    });

    const finalModifierPriceOverrides = selectedModifierIds.map((modifierId) => {
      const existing = modifierPriceOverrideMap.get(String(modifierId));

      return {
        modifierId: String(modifierId),
        priceDelta: toNumberOrZero(existing?.priceDelta),
      };
    });

    const topLevelModifierMap = new Map<string, number>();

    finalModifierPriceOverrides.forEach((item) => {
      topLevelModifierMap.set(String(item.modifierId), item.priceDelta);
    });

    const variationOverrideMap = new Map<string, VariationPriceOverride>();

    selectedVariationPriceOverrides.forEach((item) => {
      variationOverrideMap.set(String(item.variationId), item);
    });

    const finalVariationPriceOverrides = selectedVariationIds.map(
      (variationId) => {
        const existing = variationOverrideMap.get(String(variationId));

        return {
          variationId: String(variationId),

          price:
            existing?.price !== undefined &&
            existing?.price !== null &&
            existing.price !== ""
              ? toNumberOrZero(existing.price)
              : basePrice,

          pickupPrice:
            existing?.pickupPrice !== undefined &&
            existing?.pickupPrice !== null &&
            existing.pickupPrice !== ""
              ? toNumberOrZero(existing.pickupPrice)
              : 0,

          displayText: existing?.displayText || "",

          modifierPriceOverrides: selectedModifierIds.map((modifierId) => {
            const nestedExisting = existing?.modifierPriceOverrides?.find(
              (entry) => String(entry.modifierId) === String(modifierId)
            );

            return {
              modifierId: String(modifierId),
              priceDelta:
                nestedExisting?.priceDelta !== undefined &&
                nestedExisting?.priceDelta !== null &&
                nestedExisting.priceDelta !== ""
                  ? toNumberOrZero(nestedExisting.priceDelta)
                  : topLevelModifierMap.get(String(modifierId)) ?? 0,
            };
          }),
        };
      }
    );

    return {
      restaurantId: restaurantId || form.restaurantId || undefined,
      categoryId: form.categoryId || undefined,

      name: form.name?.trim(),
      slug: generatedSlug,
      description: form.description || "",

      ingredients: form.ingredients || "",
      nutritionalInformation: form.nutritionalInformation || "",

      imageUrl: form.imageUrl || "",
      sku: form.sku || "",

      pricingMode: form.pricingMode || "SINGLE",

      basePrice,
      deliveryPriceAdjustment: toNumberOrZero(form.deliveryPriceAdjustment),
      takeawayPriceAdjustment: toNumberOrZero(form.takeawayPriceAdjustment),
      prepTimeMinutes: toNumberOrZero(form.prepTimeMinutes),

      dietaryFlags: parsedDietaryFlags,
      allergenFlags: parsedAllergenFlags,

      depositAmount: toNumberOrZero(form.depositAmount),

      isActive: typeof form.isActive === "boolean" ? form.isActive : true,

      supportsSplitPizza:
        typeof form.supportsSplitPizza === "boolean"
          ? form.supportsSplitPizza
          : false,

      modifierPriceOverrides: finalModifierPriceOverrides,

      variationPriceOverrides: finalVariationPriceOverrides,
    };
  };

  const nextStep = () => {
    if (stepRef.current?.validateStep) {
      const valid = stepRef.current.validateStep();

      if (!valid) return;
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const resetAndClose = () => {
    setForm(getInitialForm(restaurantId));
    setCurrentStep(1);
    onOpenChange(false);
  };

  const validateBeforeSubmit = () => {
    if (stepRef.current?.validateStep) {
      const valid = stepRef.current.validateStep();

      if (!valid) return false;
    }

    if (!form.name?.trim() || !form.categoryId) {
      toast.error("Name and Category are required");
      return false;
    }

    if (!restaurantId && !isEditMode) {
      toast.error("Restaurant id is missing");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateBeforeSubmit()) return;

    const payload = buildPayload();

    if (isEditMode) {
      const { restaurantId: _restaurantId, ...updatePayload } = payload;

      updateMenuItem(
        {
          id: initialData.id,
          data: updatePayload,
        },
        {
          onSuccess: () => {
            onSuccess?.();
            resetAndClose();
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.message || "Failed to update menu item"
            );
          },
        }
      );

      return;
    }

    createMenuItem(payload as any, {
      onSuccess: () => {
        onSuccess?.();
        resetAndClose();
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to create menu item"
        );
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isSubmitting) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="max-h-[95vh] w-[calc(100vw-24px)] max-w-[760px] overflow-hidden rounded-[24px] bg-[#F5F5F5] p-0">
        <div className="max-h-[95vh] overflow-y-auto overflow-x-hidden p-5 sm:p-8 [scrollbar-width:thin]">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-semibold sm:text-[26px]">
              {isEditMode ? "Edit Item" : "Create Item"}
            </DialogTitle>

            <p className="text-sm text-gray-500">
              Add item details, upload media, then assign reusable variations
              and modifiers.
            </p>

            <StepProgress currentStep={currentStep} />
          </DialogHeader>

          <div className="mt-6 min-w-0 overflow-hidden rounded-[20px] bg-white p-4 sm:p-6">
            {currentStep === 1 && (
              <StepOne
                ref={stepRef}
                form={form}
                setForm={setForm}
                token={token}
              />
            )}

            {currentStep === 2 && (
              <StepTwo ref={stepRef} form={form} setForm={setForm} />
            )}

            {currentStep === 3 && (
              <StepThree ref={stepRef} form={form} setForm={setForm} />
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="ghost"
              className="h-[44px] rounded-[12px] text-[16px] text-gray-700"
              onClick={resetAndClose}
              disabled={isSubmitting}
            >
              Reset
            </Button>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="h-[44px] rounded-[12px]"
                >
                  Previous
                </Button>
              )}

              <Button
                className="h-[44px] rounded-[12px] bg-primary px-10 text-white hover:bg-primary/90"
                onClick={currentStep < 3 ? nextStep : handleSubmit}
                disabled={isSubmitting}
              >
                {currentStep < 3
                  ? "Next"
                  : isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StepProgress({ currentStep }: { currentStep: number }) {
  const steps = ["Basic Details", "Media & Extra Info", "Assign Options"];
  const totalSteps = steps.length;

  const activeWidth =
    currentStep === 1 ? 0 : ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="relative mt-6 w-full overflow-hidden">
      <div className="absolute left-0 top-2 z-0 h-[2px] w-full bg-gray-300" />

      <div
        className="absolute left-0 top-2 z-0 h-[2px] bg-primary transition-all duration-300"
        style={{ width: `${activeWidth}%` }}
      />

      <div className="relative z-10 grid grid-cols-3 gap-2">
        {steps.map((label, index) => {
          const step = index + 1;
          const isActive = currentStep >= step;

          return (
            <div
              key={label}
              className="flex min-w-0 flex-col items-center text-center"
            >
              <div
                className={`h-4 w-4 rounded-full transition ${
                  isActive ? "bg-primary" : "bg-gray-300"
                }`}
              />

              <span
                className={`mt-2 max-w-full truncate text-xs font-medium sm:text-sm ${
                  currentStep === step ? "text-primary" : "text-gray-400"
                }`}
                title={label}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}