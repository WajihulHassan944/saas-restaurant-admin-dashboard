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
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateMenuItem,
  useUpdateMenuItem,
} from "@/hooks/useMenus";

interface CreateMenuItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  onSuccess?: () => void;
}

const normalizeVariationPriceOverrides = (initialData?: any) => {
  if (Array.isArray(initialData?.variationPriceOverrides)) {
    return initialData.variationPriceOverrides.map((item: any) => ({
      variationId: String(item.variationId || ""),
      pricingMode: item.pricingMode || "FIXED",
      price:
        item.price !== undefined && item.price !== null
          ? String(item.price)
          : "",
      adjustmentValue:
        item.adjustmentValue !== undefined && item.adjustmentValue !== null
          ? String(item.adjustmentValue)
          : "",
    }));
  }

  if (Array.isArray(initialData?.variations)) {
    return initialData.variations.map((variation: any) => ({
      variationId: String(variation.id || variation.variationId || ""),
      pricingMode: variation.pricingMode || "FIXED",
      price:
        variation.price !== undefined && variation.price !== null
          ? String(variation.price)
          : "",
      adjustmentValue:
        variation.adjustmentValue !== undefined &&
        variation.adjustmentValue !== null
          ? String(variation.adjustmentValue)
          : "",
    }));
  }

  return [];
};

const getInitialForm = (restaurantId?: string, initialData?: any) => ({
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
  modifierPriceOverrides: Array.isArray(initialData?.modifierPriceOverrides)
    ? initialData.modifierPriceOverrides
    : [],
  variationPriceOverrides: normalizeVariationPriceOverrides(initialData),
  supportsSplitPizza:
    typeof initialData?.supportsSplitPizza === "boolean"
      ? initialData.supportsSplitPizza
      : false,
  restaurantId: restaurantId || initialData?.restaurantId || "",
  isActive:
    typeof initialData?.isActive === "boolean" ? initialData.isActive : true,
});

export default function CreateMenuItemModal({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: CreateMenuItemModalProps) {
  const { user, token } = useAuth();
  const restaurantId = user?.restaurantId ?? undefined;

  const isEditMode = !!initialData?.id;
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
    setForm({
      ...getInitialForm(restaurantId, initialData),
      imagePreview: initialData?.imageUrl || "",
    });
  }, [open, restaurantId, initialData]);

  const parsedDietaryFlags = useMemo(() => {
    if (!form.dietaryFlags) return [];
    if (Array.isArray(form.dietaryFlags)) return form.dietaryFlags;
    return String(form.dietaryFlags)
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
  }, [form.dietaryFlags]);

  const parsedAllergenFlags = useMemo(() => {
    if (!form.allergenFlags) return [];
    if (Array.isArray(form.allergenFlags)) return form.allergenFlags;
    return String(form.allergenFlags)
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
  }, [form.allergenFlags]);

  const buildPayload = () => {
    const generatedSlug =
      form.slug ||
      String(form.name || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

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
      basePrice:
        form.basePrice !== "" &&
        form.basePrice !== undefined &&
        form.basePrice !== null
          ? Number(form.basePrice)
          : 0,
      deliveryPriceAdjustment:
        form.deliveryPriceAdjustment !== "" &&
        form.deliveryPriceAdjustment !== undefined &&
        form.deliveryPriceAdjustment !== null
          ? Number(form.deliveryPriceAdjustment)
          : 0,
      takeawayPriceAdjustment:
        form.takeawayPriceAdjustment !== "" &&
        form.takeawayPriceAdjustment !== undefined &&
        form.takeawayPriceAdjustment !== null
          ? Number(form.takeawayPriceAdjustment)
          : 0,
      prepTimeMinutes:
        form.prepTimeMinutes !== "" &&
        form.prepTimeMinutes !== undefined &&
        form.prepTimeMinutes !== null
          ? Number(form.prepTimeMinutes)
          : 0,
      dietaryFlags: parsedDietaryFlags,
      allergenFlags: parsedAllergenFlags,
      depositAmount:
        form.depositAmount !== "" &&
        form.depositAmount !== undefined &&
        form.depositAmount !== null
          ? Number(form.depositAmount)
          : 0,
      isActive:
        typeof form.isActive === "boolean" ? form.isActive : true,
      supportsSplitPizza:
        typeof form.supportsSplitPizza === "boolean"
          ? form.supportsSplitPizza
          : false,
      modifierPriceOverrides: Array.isArray(form.modifierPriceOverrides)
        ? form.modifierPriceOverrides
            .filter((item: any) => item?.modifierId)
            .map((item: any) => ({
              modifierId: String(item.modifierId),
              priceDelta: Number(item.priceDelta || 0),
            }))
        : [],
     variationPriceOverrides: Array.isArray(form.variationPriceOverrides)
  ? form.variationPriceOverrides
      .filter((item: any) => item?.variationId)
      .map((item: any) => ({
        variationId: String(item.variationId),
        price:
          item.price !== "" &&
          item.price !== undefined &&
          item.price !== null
            ? Number(item.price)
            : 0,
      }))
  : [], };
  };

  const nextStep = () => {
    if (stepRef.current?.validateStep) {
      const valid = stepRef.current.validateStep();
      if (!valid) return;
    }

    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const resetAndClose = () => {
    setForm(getInitialForm(restaurantId));
    setCurrentStep(1);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!form.name?.trim() || !form.categoryId) {
      toast.error("Name and Category are required");
      return;
    }

    const payload = buildPayload();

    if (isEditMode) {
      const { restaurantId, ...updatePayload } = payload;

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
      <DialogContent className="max-h-[95vh] max-w-[560px] overflow-auto rounded-[24px] bg-[#F5F5F5] p-8">
        <DialogHeader>
          <DialogTitle className="text-[26px] font-semibold">
            {isEditMode ? "Edit Item" : "Create Item"}
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Manage your menu data from here
          </p>

          <StepProgress currentStep={currentStep} />
        </DialogHeader>

        <div className="mt-6 rounded-[20px] bg-white p-6">
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
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-[16px] text-gray-700"
            onClick={resetAndClose}
            disabled={isSubmitting}
          >
            Reset
          </Button>

          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}

            <Button
              className="h-[44px] rounded-[12px] bg-primary px-10 text-white hover:bg-primary/90"
              onClick={currentStep < 2 ? nextStep : handleSubmit}
              disabled={isSubmitting}
            >
              {currentStep < 2
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
      </DialogContent>
    </Dialog>
  );
}

function StepProgress({ currentStep }: { currentStep: number }) {
  const steps = ["Step 1", "Step 2"];
  const totalSteps = steps.length;

  const activeWidth =
    currentStep === 1
      ? 100 / totalSteps / 2
      : ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="relative mt-6 w-full">
      <div className="absolute left-0 top-2 z-0 h-[2px] w-full bg-gray-300" />

      <div
        className="absolute left-0 top-2 z-0 h-[2px] bg-primary transition-all duration-300"
        style={{ width: `${activeWidth}%` }}
      />

      <div className="relative z-10 flex justify-between px-14">
        {steps.map((label, index) => {
          const step = index + 1;
          const isActive = currentStep >= step;

          return (
            <div key={label} className="flex flex-col items-center">
              <div
                className={`h-4 w-4 rounded-full ${
                  isActive ? "bg-primary" : "bg-gray-300"
                }`}
              />

              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep === step ? "text-primary" : "text-gray-400"
                }`}
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