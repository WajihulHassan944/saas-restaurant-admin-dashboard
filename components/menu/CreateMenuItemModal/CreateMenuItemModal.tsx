"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

interface CreateMenuItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateMenuItemModal({
  open,
  onOpenChange,
}: CreateMenuItemModalProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => currentStep < 3 && setCurrentStep((p) => p + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep((p) => p - 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] rounded-[24px] p-8 bg-[#F5F5F5] max-h-[95vh] overflow-auto">
        {/* ---------- HEADER ---------- */}
        <DialogHeader >
          <DialogTitle className="text-[26px] font-semibold">
            Create Item
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Manage your menu data from here
          </p>

          {/* Step Progress */}
          <StepProgress currentStep={currentStep} />
        </DialogHeader>

        {/* ---------- BODY ---------- */}
        <div className="mt-6 bg-white rounded-[20px] p-6">
          {currentStep === 1 && <StepOne />}
          {currentStep === 2 && <StepTwo />}
          {currentStep === 3 && <StepThree />}
        </div>

        {/* ---------- FOOTER ---------- */}
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
              onClick={currentStep < 3 ? nextStep : () => {}}
            >
              {currentStep < 3 ? "Next" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Step Progress Component ---------- */
function StepProgress({ currentStep }: { currentStep: number }) {
  const steps = ["Step 1", "Step 2", "Step 3"];

  const totalSteps = steps.length;

  // Active line width (always show first segment for step 1)
  const activeWidth =
    currentStep === 1
      ? 100 / (totalSteps - 0) / 2 // half the distance to next dot
      : ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="mt-6 w-full relative">
      {/* Full line background */}
      <div className="absolute top-2 left-0 w-full h-[2px] bg-gray-300 z-0" />

      {/* Active line */}
      <div
        className="absolute top-2 left-0 h-[2px] bg-primary z-0 transition-all duration-300"
        style={{ width: `${activeWidth}%` }}
      />

      {/* Dots */}
      <div className="flex justify-between relative z-10 px-14"> {/* add px-4 to push edges */}
        {steps.map((label, index) => {
          const step = index + 1;
          const isActive = currentStep >= step;

          return (
            <div key={label} className="flex flex-col items-center">
              {/* Dot */}
              <div
                className={`h-4 w-4 rounded-full transition-colors duration-300 ${
                  isActive ? "bg-primary" : "bg-gray-300"
                }`}
              />

              {/* Label */}
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
