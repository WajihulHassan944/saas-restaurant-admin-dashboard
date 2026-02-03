"use client";

import Container from "@/components/container";
import Header from "@/components/branches/header";
import TabButton from "@/components/ui/TabButton";
import { useState } from "react";

import EditBranchStepOne from "@/components/forms/EditBranchForm/edit-branch-step-1";
import EditBranchStepTwo from "@/components/forms/EditBranchForm/edit-branch-step-2";
import EditBranchStepThree from "@/components/forms/EditBranchForm/edit-branch-step-3";
import EditBranchStepFour from "@/components/forms/EditBranchForm/edit-branch-step-4";
import EditBranchSectionHeader from "@/components/forms/EditBranchForm/EditBranchSectionHeader";
import { useRouter } from "next/navigation";

type EditTab = "basicInfo" | "delivery" | "workingHours" | "inventory";

export default function BranchesEditPage() {
  const [activeTab, setActiveTab] = useState<EditTab>("basicInfo");
const router = useRouter();
  const steps: {
    key: EditTab;
    tabLabel: string;
    title: string;
    description: string;
    component: React.ReactNode;
  }[] = [
    {
      key: "basicInfo",
      tabLabel: "Basic Information",
      title: "Setup Basic Information",
      description: "Manage your branch's basic information from here",
      component: <EditBranchStepOne />,
    },
    {
      key: "delivery",
      tabLabel: "Delivery Area & Charges",
      title: "Zone & Delivery Area & Charges Setup",
      description: "Manage your branch delivery & charges information from here",
      component: <EditBranchStepTwo />,
    },
    {
      key: "workingHours",
      tabLabel: "Working Hours",
      title: "Setup Working Hour",
      description: "Configure your standard business working hour from here",
      component: <EditBranchStepThree />,
    },
    {
      key: "inventory",
      tabLabel: "Inventory",
      title: "Inventory Settings",
      description: "Configure your standard inventory model for the business here.",
      component: <EditBranchStepFour />,
    },
  ];

  const currentIndex = steps.findIndex((s) => s.key === activeTab);
  const currentStep = steps[currentIndex];

  /* ---------------------------------- */
  /* Navigation helpers
  /* ---------------------------------- */

  const goNext = () => {
    if (currentIndex < steps.length - 1) {
      setActiveTab(steps[currentIndex + 1].key);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setActiveTab(steps[currentIndex - 1].key);
    }
  };

  /* ---------------------------------- */

  return (
    <Container>
      <Header
        title="Default Branch"
        description="Branch Setup / Default Branch"
      />

      <div className="space-y-8 bg-white lg:p-8 rounded-[14px] shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-3">
          {steps.map((step) => (
            <TabButton
              key={step.key}
              active={activeTab === step.key}
              onClick={() => setActiveTab(step.key)}
            >
              {step.tabLabel}
            </TabButton>
          ))}
        </div>

        {/* Section Header */}
        <EditBranchSectionHeader
          title={currentStep.title}
          description={currentStep.description}
          primaryActionLabel={
            currentIndex === steps.length - 1 ? "Save" : "Save & Continue"
          }
         onPrimaryAction={() => {
  if (currentIndex === steps.length - 1) {
    router.push("/branches");
  } else {
    goNext();
  }
}}

          // onBack={currentIndex > 0 ? goBack : undefined}
        />

        {/* Step Content */}
        {currentStep.component}
      </div>
    </Container>
  );
}
