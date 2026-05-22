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

type DeliveryMode = "RADIUS" | "ZONE" | "POSTAL_CODE";

type DeliveryPolygonPoint = {
  lat: number;
  lng: number;
};

type DeliveryZone = {
  id?: string;
  name: string;
  deliveryFee: number;
  polygon: DeliveryPolygonPoint[];
};

type PostalCodeRule = {
  id?: string;
  postalCode: string;
  deliveryFee: number;
};

type DeliveryConfig = {
  mode: DeliveryMode;
  radiusKm: number;
  minOrderAmount: number;
  deliveryFee: number;
  isFreeDelivery: boolean;
  freeDeliveryThreshold: number;
  zones: DeliveryZone[];
  postalCodeRules: PostalCodeRule[];
};

const DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const DELIVERY_MODES: DeliveryMode[] = ["RADIUS", "ZONE", "POSTAL_CODE"];

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

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

const normalizeDeliveryMode = (mode: any): DeliveryMode => {
  const normalized = String(mode || "").toUpperCase();

  return DELIVERY_MODES.includes(normalized as DeliveryMode)
    ? (normalized as DeliveryMode)
    : "RADIUS";
};

const normalizePolygonPoint = (point: any): DeliveryPolygonPoint | null => {
  const lat = toNumber(point?.lat, Number.NaN);
  const lng = toNumber(point?.lng, Number.NaN);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return { lat, lng };
};

const normalizeDeliveryZonesForApi = (zones: any): DeliveryZone[] => {
  if (!Array.isArray(zones)) return [];

  return zones.map((zone) => ({
    ...(zone?.id ? { id: String(zone.id) } : {}),
    name: String(zone?.name || "").trim(),
    deliveryFee: toNumber(zone?.deliveryFee, 0),
    polygon: Array.isArray(zone?.polygon)
      ? zone.polygon
          .map((point: any) => normalizePolygonPoint(point))
          .filter((point: DeliveryPolygonPoint | null): point is DeliveryPolygonPoint =>
            Boolean(point)
          )
      : [],
  }));
};

const normalizePostalCodeRulesForApi = (rules: any): PostalCodeRule[] => {
  if (!Array.isArray(rules)) return [];

  return rules.map((rule) => ({
    ...(rule?.id ? { id: String(rule.id) } : {}),
    postalCode: String(rule?.postalCode || "").trim(),
    deliveryFee: toNumber(rule?.deliveryFee, 0),
  }));
};

const normalizeDeliveryConfigForApi = (deliveryConfig: any): DeliveryConfig => {
  return {
    mode: normalizeDeliveryMode(deliveryConfig?.mode),
    radiusKm: toNumber(deliveryConfig?.radiusKm, 0),
    minOrderAmount: toNumber(deliveryConfig?.minOrderAmount, 0),
    deliveryFee: toNumber(deliveryConfig?.deliveryFee, 0),
    isFreeDelivery: Boolean(deliveryConfig?.isFreeDelivery ?? false),
    freeDeliveryThreshold: toNumber(deliveryConfig?.freeDeliveryThreshold, 0),
    zones: normalizeDeliveryZonesForApi(deliveryConfig?.zones),
    postalCodeRules: normalizePostalCodeRulesForApi(
      deliveryConfig?.postalCodeRules
    ),
  };
};

const isValidCoordinate = (point: DeliveryPolygonPoint) => {
  return (
    Number.isFinite(point.lat) &&
    Number.isFinite(point.lng) &&
    point.lat >= -90 &&
    point.lat <= 90 &&
    point.lng >= -180 &&
    point.lng <= 180
  );
};

const validateDeliveryConfig = (deliveryConfig: DeliveryConfig) => {
  if (deliveryConfig.radiusKm < 0) {
    toast.error("Radius cannot be negative");
    return false;
  }

  if (deliveryConfig.deliveryFee < 0) {
    toast.error("Delivery fee cannot be negative");
    return false;
  }

  if (deliveryConfig.minOrderAmount < 0) {
    toast.error("Minimum order amount cannot be negative");
    return false;
  }

  if (deliveryConfig.freeDeliveryThreshold < 0) {
    toast.error("Free delivery threshold cannot be negative");
    return false;
  }

  if (deliveryConfig.mode === "RADIUS" && deliveryConfig.radiusKm <= 0) {
    toast.error("Radius must be greater than 0 for radius delivery mode");
    return false;
  }

  if (deliveryConfig.mode === "ZONE") {
    if (!deliveryConfig.zones.length) {
      toast.error("Please add at least one delivery zone");
      return false;
    }

    for (const [index, zone] of deliveryConfig.zones.entries()) {
      const label = zone.name || `Zone ${index + 1}`;

      if (!zone.name) {
        toast.error(`Zone ${index + 1} name is required`);
        return false;
      }

      if (zone.deliveryFee < 0) {
        toast.error(`${label} delivery fee cannot be negative`);
        return false;
      }

      if (!Array.isArray(zone.polygon) || zone.polygon.length < 3) {
        toast.error(`${label} must have at least 3 polygon points`);
        return false;
      }

      const invalidPoint = zone.polygon.find((point) => !isValidCoordinate(point));

      if (invalidPoint) {
        toast.error(`${label} has an invalid latitude/longitude point`);
        return false;
      }
    }
  }

  if (deliveryConfig.mode === "POSTAL_CODE") {
    if (!deliveryConfig.postalCodeRules.length) {
      toast.error("Please add at least one postal code delivery rule");
      return false;
    }

    for (const [index, rule] of deliveryConfig.postalCodeRules.entries()) {
      if (!rule.postalCode) {
        toast.error(`Postal code rule ${index + 1} requires a postal code`);
        return false;
      }

      if (rule.deliveryFee < 0) {
        toast.error(
          `Postal code rule ${index + 1} delivery fee cannot be negative`
        );
        return false;
      }
    }
  }

  return true;
};

const buildBranchPatchPayload = (branchData: any, settings: any) => ({
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

  settings,
});

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
    if (!branchId || !token) return;

    const fetchBranch = async () => {
      const res = await api.get(`/v1/branches/${branchId}`);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      const nextBranchData = res?.data?.data || res?.data;

      if (nextBranchData) {
        setBranchData(nextBranchData);
      }
    };

    fetchBranch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, token]);

  // ================= STEP BASED SAVE =================
  const handleSave = async () => {
    if (!branchId || !branchData) return;

    try {
      const settings = branchData.settings || {};
      const deliveryConfig = normalizeDeliveryConfigForApi(
        settings.deliveryConfig
      );

      if (activeTab === "delivery" && !validateDeliveryConfig(deliveryConfig)) {
        return;
      }

      const normalizedOpeningHours = normalizeOpeningHoursForApi(
        settings.openingHours
      );

      const normalizedHolidayRanges = normalizeHolidayRangesForApi(
        settings.holidayRanges
      );

      /*
       * Keep settings payload schema-safe:
       * - openingHours are saved through /branches/:id/opening-hours
       * - holidayRanges are sent inside the opening-hours endpoint settings
       */
     const safeSettings = { ...settings };

// These are not allowed inside PATCH /branches/:id settings payload.
// They may come back from GET /branches/:id, but must not be sent back.
delete safeSettings.openingHours;
delete safeSettings.holidayRanges;
delete safeSettings.temporaryClosure;
delete safeSettings.currentTemporaryClosure;
delete safeSettings.temporaryClosures;
delete safeSettings.closure;
delete safeSettings.closures;
delete safeSettings.holidayOpeningHours;
delete safeSettings.reservationDateRanges;
delete safeSettings.tableReservationDateRanges;
delete safeSettings.reservationBlackoutRanges;

      // ================= BUILD FULL SETTINGS =================
      const fullSettings = {
        ...safeSettings,

        allowedOrderTypes: Array.isArray(settings.allowedOrderTypes)
          ? settings.allowedOrderTypes
          : ["DELIVERY"],

        allowedPaymentMethods: Array.isArray(settings.allowedPaymentMethods)
          ? settings.allowedPaymentMethods
          : ["COD"],

        tableReservationsEnabled:
          settings.tableReservationsEnabled ?? false,

        automation: {
          ...(settings.automation || {}),
          autoAcceptOrders: Boolean(
            settings.automation?.autoAcceptOrders ?? false
          ),
          estimatedPrepTime: toNumber(settings.automation?.estimatedPrepTime, 30),
        },

        taxation: {
          ...(settings.taxation || {}),
          taxPercentage: toNumber(settings.taxation?.taxPercentage, 0),
        },

        contact: {
          ...(settings.contact || {}),
          phone: settings.contact?.phone || "",
          whatsapp: settings.contact?.whatsapp || "",
        },

        deliveryConfig,
      };

      // ================= STEP 1 =================
      if (activeTab === "basicInfo") {
        const res = await api.patch(
          `/v1/branches/${branchId}`,
          buildBranchPatchPayload(branchData, fullSettings)
        );

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
        const branchRes = await api.patch(
          `/v1/branches/${branchId}`,
          buildBranchPatchPayload(branchData, {
            ...fullSettings,
            deliveryTime,
          })
        );

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
      description:
        "Configure delivery by radius, delivery zones, or postal code rules",
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
        <div className="flex flex-wrap items-center gap-3">
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
