"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import DialogHeaderComponent from "./DialogHeaderComponent";
import BranchInfoCard from "./BranchInfoCard";
import OrderTypesCard from "./OrderTypesCard";
import DialogFooterComponent from "./DialogFooterComponent";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function BranchDetailsModal({
  isOpen,
  closeDialog,
  branch,
}: {
  isOpen: boolean;
  closeDialog: () => void;
  branch: any | null;
}) {
  if (!branch) return null;

  // ================= FORMATTERS =================
  const formatDate = (date: string) =>
    new Date(date).toLocaleString();

  // ================= DATA =================
  const contactInfo = [
    { label: "Branch Name", value: branch?.name || "N/A" },
    { label: "Phone", value: branch?.settings?.contact?.phone || "N/A" },
    { label: "Whatsapp", value: branch?.settings?.contact?.whatsapp || "N/A" },
  ];

  const automationInfo = [
    {
      label: "Auto Accept",
      value: branch?.settings?.automation?.autoAcceptOrders ? "Yes" : "No",
    },
    {
      label: "Prep Time",
      value: branch?.settings?.automation?.estimatedPrepTime
        ? `${branch.settings.automation.estimatedPrepTime} min`
        : "N/A",
    },
  ];

  const deliveryInfo = [
    {
      label: "Radius",
      value: branch?.settings?.deliveryConfig?.radiusKm
        ? `${branch.settings.deliveryConfig.radiusKm} km`
        : "N/A",
    },
    {
      label: "Fee",
      value: branch?.settings?.deliveryConfig?.deliveryFee || "N/A",
    },
    {
      label: "Free Delivery",
      value: branch?.settings?.deliveryConfig?.isFreeDelivery ? "Yes" : "No",
    },
  ];

  const addressInfo = [
    { label: "Street", value: branch?.address?.street || "N/A" },
    { label: "Area", value: branch?.address?.area || "N/A" },
    { label: "City", value: branch?.address?.city || "N/A" },
    { label: "Country", value: branch?.address?.country || "N/A" },
  ];

  const statsInfo = [
    { label: "Users", value: String(branch?._count?.users || 0) },
    { label: "Orders", value: String(branch?._count?.orders || 0) },
    { label: "Deliverymen", value: String(branch?._count?.deliverymen || 0) },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-[18px] max-h-[95vh] overflow-auto">

        {/* ================= HERO ================= */}
        <div className="relative h-40 bg-gray-200">
          {branch.coverImage && (
            <Image
              src={branch.coverImage}
              alt="cover"
              fill
              className="object-cover"
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Availability */}
          {/* <div className="absolute top-4 right-4 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow">
            <span className="text-xs font-medium">Active</span>
            <Switch checked={branch.isActive} />
          </div> */}

          {/* Logo */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="size-20 rounded-full border-4 border-white overflow-hidden bg-white">
              {branch.logoUrl ? (
                <Image
                  src={branch.logoUrl}
                  alt="logo"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                  No Logo
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="px-6 pt-14 pb-6 space-y-5">

          <DialogHeaderComponent
            title={branch.name}
            badgeText={branch.isMain ? "Main Branch" : "Branch"}
            branchId={branch.id}
            createdAt={branch.createdAt}
          />

          <BranchInfoCard title="Contact Info" info={contactInfo} />

          <BranchInfoCard title="Automation" info={automationInfo} />

          <BranchInfoCard title="Delivery" info={deliveryInfo} />

          <OrderTypesCard
            types={branch?.settings?.allowedOrderTypes || []}
          />

          <OrderTypesCard
            title="Payment Methods"
            types={branch?.settings?.allowedPaymentMethods || []}
          />

          <BranchInfoCard title="Address" info={addressInfo} />

          <BranchInfoCard title="Stats" info={statsInfo} />

          {/* MAP */}
          <Card className="p-4 bg-[#F5F5F5] rounded-lg border-none">
            <h3 className="text-sm font-semibold text-center text-black">
              Location
            </h3>

            <div className="rounded-lg overflow-hidden mt-2">
              <iframe
                width="100%"
                height="150"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${branch?.address?.lat},${branch?.address?.lng}&z=15&output=embed`}
              />
            </div>
          </Card>
        </div>

        <DialogFooterComponent closeDialog={closeDialog} branchId={branch.id} />
      </DialogContent>
    </Dialog>
  );
}