"use client";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type CustomerDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CustomerDetailModal({
  open,
  onOpenChange,
}: CustomerDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-[420px]
           max-h-[85vh]
    overflow-y-auto
          rounded-[18px]
          p-6
        "
      >
        {/* Header */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold">
            Customer #10003
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            View the customer’s basic information and order history here
          </DialogDescription>
        </DialogHeader>

        {/* Avatar */}
        <div className="flex justify-center mt-4">
          <div className="relative">
            <Image
              src="/dialog-profile.jpg" // replace with real image
              alt="Customer"
              width={120}
              height={120}
              className="rounded-[16px] object-cover"
            />

            <button
              className="
                absolute bottom-2 right-2
                size-8 rounded-full
                bg-white
                shadow
                flex items-center justify-center
                text-red-500
              "
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Block / Unblock */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="text-sm text-gray-500">
            Block / Unblock
          </span>
          <Switch defaultChecked />
        </div>

        {/* Info */}
        <div className="mt-6 space-y-3 text-sm">
       <InfoRow label="Phone" value="+9212121212" showDots />
<InfoRow label="Email" value="example@gmail.com" showDots />
<InfoRow label="Joining Date" value="12/13/2025 07:00 PM" showDots />
          <InfoRow
            label="Address"
            value="View all Address"
            link
            showDots
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <StatCard value="12%" label="Completion Rate" />
          <StatCard value="3%" label="Ongoing Rate" />
          <StatCard value="2%" label="Cancellation Rate" />
          <StatCard value="14%" label="Refund Rate" />
          <StatCard value="34%" label="Failed Rate" full />
        </div>

        {/* Footer */}
        <Button
          className="
            mt-6
            w-full
            h-[44px]
            rounded-[12px]
            bg-primary
            text-white
            hover:bg-primary/90
          "
        >
          Edit
        </Button>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Helpers ---------- */
function InfoRow({
  label,
  value,
  link,
  showDots,
}: {
  label: string;
  value: string;
  link?: boolean;
  showDots?: boolean;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center">
      {/* Left: Label */}
      <span className="text-gray-400">{label}</span>

      {/* Center: Dots */}
      {showDots ? (
        <button className="p-1 rounded-full hover:bg-gray-200 justify-self-center">
         <TwoDotsVertical size={16} color="#6A7282" />
        </button>
      ) : (
        <span />
      )}

      {/* Right: Value */}
      {link ? (
        <button className="text-primary text-sm font-medium justify-self-end">
          {value}
        </button>
      ) : (
        <span className="text-gray-600 justify-self-end">
          {value}
        </span>
      )}
    </div>
  );
}
const TwoDotsVertical = ({ size = 16, color = "#6A7282" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
  >
    <circle cx="12" cy="8" r="1.5" />
    <circle cx="12" cy="16" r="1.5" />
  </svg>
);
function StatCard({
  value,
  label,
  full,
}: {
  value: string;
  label: string;
  full?: boolean;
}) {
  return (
    <div
      className={`
        border border-[#EDEFF2]
        rounded-[12px]
        p-4
        text-center
        ${full ? "col-span-2" : ""}
      `}
    >
      <p className="text-lg font-semibold text-dark">
        {value}
      </p>
      <p className="text-sm text-gray-500">
        {label}
      </p>
    </div>
  );
}
