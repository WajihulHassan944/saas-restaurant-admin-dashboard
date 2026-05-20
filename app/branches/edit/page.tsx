"use client";

import Container from "@/components/container";
import Header from "@/components/branches/header";
import TabButton from "@/components/ui/TabButton";
import { useState, useEffect, JSX } from "react";

import EditBranchStepOne from "@/components/forms/EditBranchForm/edit-branch-step-1";
import EditBranchStepTwo from "@/components/forms/EditBranchForm/edit-branch-step-2";
import EditBranchStepThree from "@/components/forms/EditBranchForm/edit-branch-step-3";

import EditBranchSectionHeader from "@/components/forms/EditBranchForm/EditBranchSectionHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import useApi from "@/hooks/useApi";
import { toast } from "sonner";

type EditTab = "basicInfo" | "delivery" | "workingHours";

const DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const normalizeBreakTimesForApi = (breakTimes: any) => {
  if (!Array.isArray(breakTimes)) return [];

  return breakTimes
    .map((item) => ({
      startTime: String(item?.startTime || ""),
      endTime: String(item?.endTime || ""),
      note: String(item?.note || ""),
    }))
    .filter((item) => item.startTime && item.endTime);
};

const normalizeOpeningHoursForApi = (openingHours: any) => {
  const rawHours = Array.isArray(openingHours) ? openingHours : [];

  return DAYS.map((dayOfWeek) => {
    const existing = rawHours.find((item: any) => item?.dayOfWeek === dayOfWeek);

    return {
      dayOfWeek,
      isClosed: Boolean(existing?.isClosed ?? dayOfWeek === "SUNDAY"),
      openTime: existing?.openTime || "09:00",
      closeTime: existing?.closeTime || "18:00",
      breakTimes: normalizeBreakTimesForApi(existing?.breakTimes),
      note: String(existing?.note || ""),
    };
  });
};

const normalizeHolidayRangesForApi = (holidayRanges: any) => {
  if (!Array.isArray(holidayRanges)) return [];

  return holidayRanges
    .map((item) => ({
      fromDate: String(item?.fromDate || item?.startDate || item?.date || ""),
      toDate: String(item?.toDate || item?.endDate || item?.date || ""),
      isClosed: Boolean(item?.isClosed ?? true),
      openTime: item?.isClosed ? undefined : item?.openTime || "09:00",
      closeTime: item?.isClosed ? undefined : item?.closeTime || "18:00",
      note: String(item?.note || ""),
    }))
    .filter((item) => item.fromDate && item.toDate);
};

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

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      if (res?.data) {
        setBranchData(res.data);
      }
    };

    fetchBranch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  // ================= STEP BASED SAVE =================
  const handleSave = async () => {
    if (!branchId || !branchData) return;

    try {
      const normalizedOpeningHours = normalizeOpeningHoursForApi(
        branchData.settings?.openingHours
      );

      const normalizedHolidayRanges = normalizeHolidayRangesForApi(
        branchData.settings?.holidayRanges
      );

      // ================= BUILD FULL SETTINGS (CRITICAL FIX) =================
      const fullSettings = {
        allowedOrderTypes: branchData.settings?.allowedOrderTypes?.length
          ? branchData.settings.allowedOrderTypes
          : ["DELIVERY"],

        allowedPaymentMethods: branchData.settings?.allowedPaymentMethods?.length
          ? branchData.settings.allowedPaymentMethods
          : ["COD"],

        tableReservationsEnabled:
          branchData.settings?.tableReservationsEnabled ?? false,

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
          radiusKm: Number(branchData.settings?.deliveryConfig?.radiusKm || 0),
          deliveryFee: Number(branchData.settings?.deliveryConfig?.deliveryFee || 0),
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

        // Keep branch settings payload schema-safe.
        // openingHours must only be sent to /branches/:id/opening-hours,
        // not inside /branches/:id PATCH settings.
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

          description: branchData.description,

          settings: fullSettings,
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
          settings: fullSettings,
        });

        if (res?.error) {
          toast.error(res.error);
          return;
        }

        toast.success("Delivery config updated");
      }

      // ================= STEP 3 =================
      if (activeTab === "workingHours") {
        const deliveryTime =
          branchData.deliveryTime === "" ||
          branchData.deliveryTime === undefined ||
          branchData.deliveryTime === null
            ? null
            : Number(branchData.deliveryTime);

        // ✅ 1. Update opening hours API with break times and holiday ranges.
        const openingHoursRes = await api.put(
          `/v1/branches/${branchId}/opening-hours`,
          {
            openingHours: normalizedOpeningHours,
            settings: {
              holidayRanges: normalizedHolidayRanges,
            },
          }
        );

        if (openingHoursRes?.error) {
          toast.error(openingHoursRes.error);
          return;
        }

        // ✅ 2. Update deliveryTime through edit branch API.
        const branchRes = await api.patch(`/v1/branches/${branchId}`, {
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

          description: branchData.description,

          settings: {
            ...fullSettings,
            deliveryTime,
          },
        });

        if (branchRes?.error) {
          toast.error(branchRes.error);
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

  const steps: {
    key: EditTab;
    tabLabel: string;
    title: string;
    description: string;
    component: JSX.Element;
  }[] = [
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
      description:
        "Configure business hours, break times, and holiday date ranges from here",
      component: (
        <EditBranchStepThree data={branchData} setData={setBranchData} />
      ),
    },
  ];

  const currentStep = steps.find((s) => s.key === activeTab)!;

  return (
    <Container>
      <Header title="Default Branch" description="Branch Setup / Default Branch" />

      <div className="space-y-8 rounded-[14px] bg-white shadow-sm lg:p-8">
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
