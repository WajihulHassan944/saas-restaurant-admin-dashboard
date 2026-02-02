
"use client";
import FormInput from "@/components/register/form/FormInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PageWrapper from "@/components/forms/Promotions/PageWrapper";
import Section from "@/components/forms/Promotions/Section";
import AdvanceSettings from "@/components/forms/Promotions/AdvanceSettings";

export default function AddNewCoupon() {
  return (
    <PageWrapper title="Add New Coupon">
      <Section label="Setup Basic Info">
        <FormInput label="Coupon Title *" placeholder="eg. John Doe" />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[15px] font-medium">Coupon Code *</Label>
            <button className="text-sm text-primary underline m-0">Generate Code</button>
          </div>
          <input className="w-full h-10 px-4 border border-[#BBBBBB] rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" defaultValue="51KOH55"/>
        </div>
        <FormInput label="Maximum Times Coupon Can Be Applied *" placeholder="eg. 10"/>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <Checkbox />
          Unlimited Usage
        </label>
      </Section>

      <Section label="Discount Setup">
        <FormInput label="Discount Type *" placeholder="eg. 22%"/>
        <FormInput label="Validity *" placeholder="Dec 18, 2025 to Jan 31, 2026"/>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <Checkbox />
          Assign this offer permanently
        </label>
      </Section>

      <Section label="Advance Setting">
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
     <div className="flex-1">
       <FormInput label="Minimum Order Value" placeholder="eg. 22" />
     </div>
     <div className="mt-2 sm:mt-0 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 md:top-1 md:-translate-y-1">
       <Switch />
     </div>
   </div>
        <AdvanceSettings />
      </Section>
    </PageWrapper>
  );
}
