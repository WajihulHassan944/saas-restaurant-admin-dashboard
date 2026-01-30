"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

export default function EditBranchStepOne() {
  return (
    <div className="bg-white rounded-[14px] p-[30px]">
      <div className="grid grid-cols-12 gap-[48px]">
        {/* Left Section Titles (OUT OF BOX) */}
        <div className="col-span-4 space-y-[64px]">
          <SectionTitle title="Setup Basic Info" />
        </div>

        {/* Form Content */}
        <div className="col-span-8 space-y-[40px]">
          {/* Setup Basic Info */}
          <section className="space-y-[24px]">
            <div className="grid grid-cols-2 gap-[24px]">
              <FormField label="First Name *" />
              <FormField label="Last Name *" />
            </div>

            <div className="grid grid-cols-2 gap-[24px]">
              <FormField label="Phone Number *" />
              <FormField label="Email" />
            </div>

            <FormField label="Maximum Assign Order*" />
            <FormField label="Branch*" />

            <button className="text-primary text-sm font-medium">
              + See More
            </button>
          </section>

</div>
 <div className="col-span-4 space-y-[64px]">
          <SectionTitle title="Identity Information" />
        </div>
        <div className="col-span-8 space-y-[40px]">
        
          <section className="space-y-[24px]">
            <div className="flex gap-[24px]">
              <Radio label="Passport" />
              <Radio label="National ID" />
              <Radio label="Driving License" active />
            </div>

            <FormField
              label="Identity Number *"
              placeholder="eg.22"
            />

            {/* Business Logo Preview (CENTERED) */}
            <div className="flex flex-col items-center text-center space-y-[12px]">
              <Label>Business Logo</Label>

              <div className="w-[180px] rounded-[12px] overflow-hidden border">
                <img
                  src="/dummy-user.jpg"
                  alt="Business Logo"
                  className="w-full h-[180px] object-cover"
                />
              </div>

              <p className="text-sm text-gray-500 max-w-[320px]">
                This is the business logo. It has been uploaded in the business
                setup
              </p>

              <button className="text-primary text-sm font-medium">
                + See More
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-[12px]">
      <Info size={18} className="text-gray-400" />
      <span className="text-base font-semibold text-[#646982]">
        {title}
      </span>
    </div>
  );
}

function FormField({
  label,
  placeholder = "eg. jhon doe",
}: {
  label: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-[6px]">
      <Label>{label}</Label>
      <Input
        placeholder={placeholder}
        className="h-[44px] border-[#BBBBBB]"
      />
    </div>
  );
}

function Radio({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <label className="flex items-center gap-[8px] cursor-pointer">
      <span
        className={`size-[18px] rounded-full border flex items-center justify-center
        ${active ? "border-red-500" : "border-gray-300"}`}
      >
        {active && (
          <span className="size-[10px] rounded-full bg-red-500" />
        )}
      </span>
      <span className="text-sm text-dark">{label}</span>
    </label>
  );
}
