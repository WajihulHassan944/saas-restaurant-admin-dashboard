"use client";

import BusinessInfoStep from "./BusinessInfoStep";
import OutletMenuStep from "./OutletMenuStep";
import PaymentDeliveryStep from "./PaymentDeliveryStep";

const steps = [
  { id: 1, label: "Account", status: "completed" },
  { id: 2, label: "Business Info", status: "completed" },
  { id: 3, label: "Outlet & Menu", status: "completed" },
  { id: 4, label: "Payment & Delivery", status: "active" },
  { id: 5, label: "Orders & Publish", status: "upcoming" },
];

export default function BusinessOnboarding() {
  const activeIndex = steps.findIndex((s) => s.status === "active");

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-10 py-10">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Business Onboarding
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Complete the steps below to set up your business
        </p>
      </div>

      {/* Stepper */}
      <div className="max-w-5xl mx-auto mb-10 relative overflow-x-auto">
        <div className="flex items-center justify-between relative min-w-[500px] sm:min-w-full">
          {/* Dashed background line */}
          <div className="absolute top-5 left-0 w-full border-t border-dashed border-[#909090]" />

          {/* Active dashed line */}
          <div
            className="absolute top-5 left-0 h-[2px] border-t border-dashed border-primary z-0"
            style={{
              width: `${((activeIndex + 0.5) / steps.length) * 100}%`,
            }}
          />

          {steps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";

            return (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center flex-1 min-w-[60px]"
              >
                {/* Circle */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold
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
                  className={`mt-2 text-[9px] sm:text-xs text-center ${
                    isActive ? "text-primary font-medium" : "text-[#909090]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      {/* <BusinessInfoStep /> */}
      {/* <OutletMenuStep /> */}
      <PaymentDeliveryStep />
    </div>
  );
}
