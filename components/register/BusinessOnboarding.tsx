"use client";

import { useState } from "react";

import BusinessInfoStep from "./BusinessInfoStep";
import OutletMenuStep from "./OutletMenuStep";
import PaymentDeliveryStep from "./PaymentDeliveryStep";
import OrdersPublishStep from "./OrdersPublishStep";
import StorePublished from "./StorePublished";

const steps = [
  { id: 1, label: "Account" },
  { id: 2, label: "Business Info" },
  { id: 3, label: "Outlet & Menu" },
  { id: 4, label: "Payment & Delivery" },
  { id: 5, label: "Orders & Publish" },
  { id: 6, label: "Published" },
];

export default function BusinessOnboarding() {
  const [activeStep, setActiveStep] = useState<number>(5);

  const activeIndex = steps.findIndex((s) => s.id === activeStep);

  const renderStepContent = () => {
    switch (activeStep) {
      case 2:
        return <BusinessInfoStep />;
      case 3:
        return <OutletMenuStep />;
      case 4:
        return <PaymentDeliveryStep />;
      case 5:
        return <OrdersPublishStep />;
      case 6:
        return <StorePublished />;
      default:
        return <BusinessInfoStep />;
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-10 py-10">
      {/* ================= HEADER ================= */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Business Onboarding
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Complete the steps below to set up your business
        </p>
      </div>

      {/* ================= STEPPER ================= */}
      <div className="max-w-5xl mx-auto mb-10 relative overflow-x-auto">
        <div className="flex items-center justify-between relative min-w-[500px] sm:min-w-full">
          {/* Background dashed line */}
          <div className="absolute top-5 left-0 w-full border-t border-dashed border-[#909090]" />

          {/* Active dashed line */}
          <div
            className="absolute top-5 left-0 border-t border-dashed border-primary z-0"
            style={{
              width: `${((activeIndex + 0.5) / steps.length) * 100}%`,
            }}
          />

          {steps.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isActive = step.id === activeStep;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className="relative z-10 flex flex-col items-center flex-1 min-w-[60px] focus:outline-none"
              >
                {/* Circle */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition
                    ${
                      isCompleted
                        ? "bg-primary text-white"
                        : isActive
                        ? "bg-primary text-white"
                        : "bg-white border border-[#909090] text-[#909090]"
                    }`}
                >
                  {isCompleted ? "✓" : step.id}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-[9px] sm:text-xs text-center transition ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-[#909090]"
                  }`}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= STEP CONTENT ================= */}
      <div className="mt-8">{renderStepContent()}</div>
    </div>
  );
}
