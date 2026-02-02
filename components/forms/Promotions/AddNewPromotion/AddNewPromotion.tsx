"use client";
import FormInput from "@/components/register/form/FormInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PageWrapper from "@/components/forms/Promotions/PageWrapper";
import Section from "@/components/forms/Promotions/Section";
import AdvanceSettings from "@/components/forms/Promotions/AdvanceSettings";

export default function AddNewPromotion() {
  return (
    <PageWrapper title="Add New Promotion">
      {/* Basic Info */}
      <Section label="Setup Basic Info">
        <FormInput label="Offer Title *" placeholder="eg. Buy 1 Get 1 Free" />
        <FormInput label="Offer Type *" placeholder="Buy one get one free" />
        <FormInput label="Validation Date" placeholder="Dec 18, 2025 to Jan 31, 2026" />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <Checkbox />
          Assign this offer permanently
        </label>
      </Section>

      {/* If Customer Buy */}
      <Section label="If Customer Buy">
        <Label className="text-[16px]">Select Food *</Label>
        <p className="text-sm text-gray-500">
          Select food items to create a combo. Customers must purchase all selected foods in the specified quantities to qualify.
        </p>
        <Input
          placeholder="Search by name"
          className="w-full px-4 border border-[#BBBBBB] rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
      </Section>

      {/* If Customer Get */}
      <Section label="If Customer Get">
        <Label className="text-[16px]">Select Food *</Label>
        <p className="text-sm text-gray-500">
          Choose the food item(s) that will be given to the customer for free once the offer conditions are met.
        </p>
        <Input
          placeholder="Search by name"
          className="w-full px-4 border border-[#BBBBBB] rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
      </Section>

      {/* Advance Settings */}
      <Section label="Advance Setting">
        <AdvanceSettings />
      </Section>
    </PageWrapper>
  );
}
