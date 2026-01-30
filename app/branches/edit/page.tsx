"use client";

import Container from "@/components/container";
import Header from "@/components/branches/header";
import TabButton from "@/components/ui/TabButton";
import { useState } from "react";
import EditBranchStepOne from "@/components/forms/EditBranchForm/edit-branch-step-1";

type editTab = "basicInfo" | "delivery" | "workingHours" | "inventory";

export default function BranchesEditPage() {
  const [activeTab, setActiveTab] = useState<editTab>("basicInfo");

  return (
    <Container>
      <Header
        title="Default Branch"
        description="Branch Setup / Default Branch"
      />

      <div className="space-y-[32px] bg-white lg:p-[30px] rounded-[14px] shadow-sm">
        <div className="flex items-center gap-3"> {/* Reduced gap from 6 to 3 */}
          <TabButton
            active={activeTab === "basicInfo"}
            onClick={() => setActiveTab("basicInfo")}
          >
            Basic Information
          </TabButton>

          <TabButton
            active={activeTab === "delivery"}
            onClick={() => setActiveTab("delivery")}
          >
            Delivery Area & Charges
          </TabButton>

          <TabButton
            active={activeTab === "workingHours"}
            onClick={() => setActiveTab("workingHours")}
          >
            Working Hours
          </TabButton>

          <TabButton
            active={activeTab === "inventory"}
            onClick={() => setActiveTab("inventory")}
          >
            Inventory
          </TabButton>
        </div>

<EditBranchStepOne />


      </div>
    </Container>
  );
}
