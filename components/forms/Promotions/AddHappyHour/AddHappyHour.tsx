"use client";
import FormInput from "@/components/register/form/FormInput";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Radio } from "@/components/ui/radioBtn";
import { Input } from "@/components/ui/input";
import PageWrapper from "@/components/forms/Promotions/PageWrapper";
import Section from "@/components/forms/Promotions/Section";
import AdvanceSettings from "@/components/forms/Promotions/AdvanceSettings";

export default function AddHappyHour() {
  return (
    <PageWrapper title="Add Happy Hour">
      {/* Activate Happy Hour */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600">
          Do you want to activate the happy hour promotion?
        </p>
        <Switch defaultChecked />
      </div>

      {/* Basic Info */}
      <Section label="Setup Basic Info">
        <FormInput label="Happy Hour Title *" placeholder="eg. Evening Happy Hour" />
        <FormInput label="Offer Active Time" placeholder="eg. Buy one get one free" />

        {/* Setup Time */}
        <div className="space-y-3">
          <Label className="text-[15px] font-medium">Setup Time</Label>
          <div className="flex flex-wrap gap-6">
            <Radio label="Daily in a specific time" active />
            <Radio label="Specific day in a week" />
            <Radio label="Custom days" />
          </div>
        </div>

        {/* Start / End Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormInput label="Start Time *" placeholder="eg. 05:00 PM" />
          <FormInput label="End Time *" placeholder="eg. 07:00 PM" />
        </div>
      </Section>

      {/* Discount Setup */}
      <Section label="Discount Setup">
        <FormInput label="Discount Type *" placeholder="Discount On Purchase" />
        <div className="relative">
          <Input
            className="w-full px-4 pr-14 border border-[#BBBBBB] rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            placeholder="eg. 20"
          />
          <span className="absolute right-0 top-0 h-full w-12 bg-primary text-white flex items-center justify-center rounded-r-md">
            %
          </span>
        </div>
      </Section>

      {/* Advance Settings */}
      <Section label="Advance Setting">
        <AdvanceSettings />
      </Section>
    </PageWrapper>
  );
}
