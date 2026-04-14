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

const getInitialForm = (restaurantId?: string, initialData?: any) => ({
  name: initialData?.name || "",
  categoryId:
    initialData?.categoryId ||
    initialData?.category?.id ||
    "",
  description: initialData?.description || "",
  basePrice:
    String(
      initialData?.basePrice ??
        initialData?.price ??
        ""
    ) || "",
  imageUrl: initialData?.imageUrl || "",
  slug: initialData?.slug || "",
  sku: initialData?.sku || "",
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
  sizes: initialData?.sizes || [],
  addons: initialData?.addons || [],
  restaurantId: restaurantId || initialData?.restaurantId || "",
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
    setForm(getInitialForm(restaurantId, initialData));
  }, [open, restaurantId, initialData]);

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
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const resetAndClose = () => {
    setForm(getInitialForm(restaurantId));
    setCurrentStep(1);
    onOpenChange(false);
  };

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
      categoryId: form.categoryId || undefined,
      name: form.name?.trim(),
      slug: generatedSlug,
      // price:
      //   form.basePrice !== "" && form.basePrice !== undefined
      //     ? Number(form.basePrice)
      //     : undefined,
      basePrice:
        form.basePrice !== "" && form.basePrice !== undefined
          ? Number(form.basePrice)
          : undefined,
      restaurantId,
      description: form.description || "",
      imageUrl: form.imageUrl || "",
      prepTimeMinutes:
        form.prepTimeMinutes !== "" &&
        form.prepTimeMinutes !== null &&
        form.prepTimeMinutes !== undefined
          ? Number(form.prepTimeMinutes)
          : undefined,
      sku: form.sku || "",
      dietaryFlags: parsedDietaryFlags,
      allergenFlags: parsedAllergenFlags,
      isActive: true,
    };
  };

  const handleSubmit = () => {
  if (!form.name?.trim() || !form.categoryId) {
    toast.error("Name and Category are required");
    return;
  }

  const payload = buildPayload();

  if (isEditMode) {
    // ❌ remove restaurantId only for update
    const { restaurantId, ...updatePayload } = payload;

    updateMenuItem(
      {
        id: initialData.id,
        data: updatePayload,
      },
      {
      onSuccess: () => {
  onSuccess?.(); // 🔥 trigger parent refetch
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

  // ✅ still includes restaurantId for create
  createMenuItem(payload as any, {
   onSuccess: () => {
  onSuccess?.(); // 🔥 trigger parent refetch
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

          {currentStep === 3 && (
            <StepThree form={form} setForm={setForm} />
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
              onClick={currentStep < 3 ? nextStep : handleSubmit}
              disabled={isSubmitting}
            >
              {currentStep < 3
                ? "Next"
                : isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                ? "Update"
                : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Step Progress ---------- */

function StepProgress({ currentStep }: { currentStep: number }) {
  const steps = ["Step 1", "Step 2", "Step 3"];
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