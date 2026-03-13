"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { API_BASE_URL } from "@/lib/constants";

interface CreateMenuItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateMenuItemModal({
  open,
  onOpenChange,
}: CreateMenuItemModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
const [token, setToken] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
const stepRef = useRef<any>(null);
  const [form, setForm] = useState<any>({
    name: "",
    categoryId: "",
    description: "",
    basePrice: "",
    imageUrl: "",
    slug: "",
    sizes: [],
    addons: [],
  });

  const nextStep = () => {
  if (stepRef.current?.validateStep) {
    const valid = stepRef.current.validateStep();

    if (!valid) return;
  }

  if (currentStep < 3) {
    setCurrentStep((p) => p + 1);
  }
};
  const prevStep = () => currentStep > 1 && setCurrentStep((p) => p - 1);

  useEffect(() => {
    const authRaw = localStorage.getItem("auth");

    if (!authRaw) return;

    try {
      const auth = JSON.parse(authRaw);

      setToken(auth?.accessToken || "");
      setRestaurantId(auth?.user?.restaurant?.id || "");
    } catch {
      console.error("Invalid auth");
    }
  }, []);


  /* ================= CREATE MENU ITEM ================= */

  const handleCreate = async () => {
    if (!form.name || !form.categoryId) {
      toast.error("Name and Category required");
      return;
    }

    try {
      const payload = {
        categoryId: form.categoryId,
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        basePrice: Number(form.basePrice),
        restaurantId,
        description: form.description,
        imageUrl: form.imageUrl,
       prepTimeMinutes: Number(form.prepTimeMinutes || 10),
sku: form.sku || "",
      dietaryFlags: form.dietaryFlags
  ? form.dietaryFlags.split(",").map((i: string) => i.trim())
  : [],

allergenFlags: form.allergenFlags
  ? form.allergenFlags.split(",").map((i: string) => i.trim())
  : [],
        isActive: true,
        // variations: form.sizes,
        // addons: form.addons,
      };

      const res = await fetch(`${API_BASE_URL}/v1/menu/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Menu item created");

      setForm({});
      setCurrentStep(1);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create menu item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] rounded-[24px] p-8 bg-[#F5F5F5] max-h-[95vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-[26px] font-semibold">
            Create Item
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Manage your menu data from here
          </p>

          <StepProgress currentStep={currentStep} />
        </DialogHeader>

        <div className="mt-6 bg-white rounded-[20px] p-6">
        {currentStep === 1 && (
  <StepOne ref={stepRef} form={form} setForm={setForm} token={token} />
)}

         {currentStep === 2 && (
  <StepTwo ref={stepRef} form={form} setForm={setForm} />
)}
          {currentStep === 3 && <StepThree form={form} setForm={setForm} />}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-gray-700 text-[16px]"
            onClick={() => onOpenChange(false)}
          >
            Reset
          </Button>

          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}

            <Button
              className="px-10 h-[44px] rounded-[12px] bg-primary hover:bg-primary/90 text-white"
              onClick={currentStep < 3 ? nextStep : handleCreate}
            >
              {currentStep < 3 ? "Next" : "Save"}
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
      ? 100 / (totalSteps - 0) / 2
      : ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="mt-6 w-full relative">
      <div className="absolute top-2 left-0 w-full h-[2px] bg-gray-300 z-0" />

      <div
        className="absolute top-2 left-0 h-[2px] bg-primary z-0 transition-all duration-300"
        style={{ width: `${activeWidth}%` }}
      />

      <div className="flex justify-between relative z-10 px-14">
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