"use client";

import Container from "@/components/container";
import Header from "@/components/branches/header";
import TabButton from "@/components/ui/TabButton";
import { useState, useEffect } from "react";

import EditBranchStepOne from "@/components/forms/EditBranchForm/edit-branch-step-1";
import EditBranchStepTwo from "@/components/forms/EditBranchForm/edit-branch-step-2";
import EditBranchStepThree from "@/components/forms/EditBranchForm/edit-branch-step-3";

import EditBranchSectionHeader from "@/components/forms/EditBranchForm/EditBranchSectionHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import useApi from "@/hooks/useApi";
import { toast } from "sonner";

type EditTab = "basicInfo" | "delivery" | "workingHours";

export default function BranchesEditPage() {
  const [activeTab, setActiveTab] = useState<EditTab>("basicInfo");
  const router = useRouter();
  const searchParams = useSearchParams();
  const branchId = searchParams.get("branchId");

  const { token } = useAuth();
  const api = useApi(token);

  const [branchData, setBranchData] = useState<any>(null);

  // ================= FETCH =================
  useEffect(() => {
    if (!branchId) return;

    const fetchBranch = async () => {
      const res = await api.get(`/v1/branches/${branchId}`);
      if (res?.data) {
        setBranchData(res.data);
      }
    };

    fetchBranch();
  }, [branchId]);

  // ================= STEP BASED SAVE =================
const handleSave = async () => {
  if (!branchId || !branchData) return;

  try {
    // ================= BUILD FULL SETTINGS (CRITICAL FIX) =================
    const fullSettings = {
      allowedOrderTypes:
        branchData.settings?.allowedOrderTypes?.length
          ? branchData.settings.allowedOrderTypes
          : ["DELIVERY"],

      allowedPaymentMethods:
        branchData.settings?.allowedPaymentMethods?.length
          ? branchData.settings.allowedPaymentMethods
          : ["COD"],

      automation: {
        autoAcceptOrders: Boolean(
          branchData.settings?.automation?.autoAcceptOrders ?? false
        ),
        estimatedPrepTime: Number(
          branchData.settings?.automation?.estimatedPrepTime || 0
        ),
      },

      taxation: {
        taxPercentage: Number(
          branchData.settings?.taxation?.taxPercentage || 0
        ),
      },

      contact: {
        phone: branchData.settings?.contact?.phone || "",
        whatsapp: branchData.settings?.contact?.whatsapp || "",
      },

      // ✅ IMPORTANT: INCLUDE DELIVERY ALWAYS
      deliveryConfig: {
        radiusKm: Number(
          branchData.settings?.deliveryConfig?.radiusKm || 0
        ),
        deliveryFee: Number(
          branchData.settings?.deliveryConfig?.deliveryFee || 0
        ),
        minOrderAmount: Number(
          branchData.settings?.deliveryConfig?.minOrderAmount || 0
        ),
        isFreeDelivery: Boolean(
          branchData.settings?.deliveryConfig?.isFreeDelivery || false
        ),
        freeDeliveryThreshold: Number(
          branchData.settings?.deliveryConfig?.freeDeliveryThreshold || 0
        ),
      },
    };

    // ================= STEP 1 =================
    if (activeTab === "basicInfo") {
      const res = await api.patch(`/v1/branches/${branchId}`, {
        restaurantId: branchData.restaurantId,
        name: branchData.name,
        isMain: branchData.isMain,
        branchAdmin: branchData.branchAdmin,

        street: branchData.address?.street,
        area: branchData.address?.area,
        city: branchData.address?.city,
        state: branchData.address?.state,
        country: branchData.address?.country,
        lat: branchData.address?.lat,
        lng: branchData.address?.lng,

        coverImage: branchData.coverImage,
        description: branchData.description,

        settings: fullSettings, // ✅ FIXED
      });

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Basic info updated");
    }

    // ================= STEP 2 =================
    if (activeTab === "delivery") {
      const res = await api.patch(`/v1/branches/${branchId}`, {
        settings: fullSettings, // ✅ FIXED (NO PARTIAL PAYLOAD)
      });

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Delivery config updated");
    }

    // ================= STEP 3 =================
    if (activeTab === "workingHours") {
      const res = await api.put(
        `/v1/branches/${branchId}/opening-hours`,
        {
          openingHours: branchData.settings?.openingHours || [],
        }
      );

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Working hours updated");
    }

    // ================= NAVIGATION =================
    if (activeTab === "workingHours") {
      router.push("/branches");
    } else if (activeTab === "basicInfo") {
      setActiveTab("delivery");
    } else {
      setActiveTab("workingHours");
    }
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Something went wrong");
  }
};

  const steps = [
    {
      key: "basicInfo",
      tabLabel: "Basic Information",
      title: "Setup Basic Information",
      description: "Manage your branch's basic information from here",
      component: (
        <EditBranchStepOne data={branchData} setData={setBranchData} />
      ),
    },
    {
      key: "delivery",
      tabLabel: "Delivery Area & Charges",
      title: "Zone & Delivery Area & Charges Setup",
      description: "Manage your branch delivery & charges information from here",
      component: (
        <EditBranchStepTwo data={branchData} setData={setBranchData} />
      ),
    },
    {
      key: "workingHours",
      tabLabel: "Working Hours",
      title: "Setup Working Hour",
      description: "Configure your standard business working hour from here",
      component: (
        <EditBranchStepThree data={branchData} setData={setBranchData} />
      ),
    },
  ];

  const currentStep = steps.find((s) => s.key === activeTab)!;

  return (
    <Container>
      <Header title="Default Branch" description="Branch Setup / Default Branch" />

      <div className="space-y-8 bg-white lg:p-8 rounded-[14px] shadow-sm">
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

        <EditBranchSectionHeader
          title={currentStep.title}
          description={currentStep.description}
          onPrimaryAction={handleSave}
        />

        {currentStep.component}
      </div>
    </Container>
  );
}