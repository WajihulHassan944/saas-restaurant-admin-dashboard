"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Image as ImageIcon } from "lucide-react";

export default function RestaurantForm() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-[48px] p-[30px] bg-white rounded-[14px] min-h-screen">
      <div className="lg:col-span-4 space-y-8 relative">
        <div className={`flex items-center gap-[12px] cursor-pointer`}>
          <Info size={18} className="text-gray" />
          <span className={`text-base font-semibold text-[#646982] group-hover:text-primary transition-colors`}>Setup Basic Info</span>
        </div>
        <div className={`flex items-center gap-[12px] cursor-pointer absolute bottom-147`}>
          <Info size={18} className="text-gray" />
          <span className={`text-base font-semibold text-[#646982] group-hover:text-primary transition-colors`}>Domain & Visibility</span>
        </div>
        <div className={`flex items-center gap-[12px] cursor-pointer absolute bottom-120`}>
          <Info size={18} className="text-gray" />
          <span className={`text-base font-semibold text-[#646982] group-hover:text-primary transition-colors`}>Business Model</span>
        </div>
        <div className={`flex items-center gap-[12px] cursor-pointer absolute bottom-64`}>
          <Info size={18} className="text-gray" />
          <span className={`text-base font-semibold text-[#646982] group-hover:text-primary transition-colors`}>Branding (Quick Setup)</span>
        </div>
        <div className={`flex items-center gap-[12px] cursor-pointer absolute bottom-21`}>
          <Info size={18} className="text-gray" />
          <span className={`text-base font-semibold text-[#646982] group-hover:text-primary transition-colors`}>Status & Actions</span>
        </div>
      </div>


      {/* Form Content */}
      <div className="lg:col-span-8 space-y-[32px]">
        <section className="space-y-[24px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            <FormGroup label="First Name *" placeholder="eg. jhon doe" />
            <FormGroup label="Last Name *" placeholder="eg. jhon doe" />
          </div>
          <FormGroup label="Email Address *" placeholder="eg. jhon doe" />
          <FormGroup label="Contact Number *" placeholder="eg. jhon doe" />
          <FormGroup label="Restaurant Name *" placeholder="eg. jhon doe" />

          <div className="space-y-[6px]">
            <Label>Logo Upload</Label>
            <UploadBox />
          </div>

          <div className="space-y-[6px]">
            <Label>Upload Favicon</Label>
            <UploadBox />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            <FormGroup label="Default Language" type="select" placeholder="English" />
            <FormGroup label="Time Zone" type="select" placeholder="(GMT+0)" />
          </div>
          <FormGroup label="Currency" placeholder="Dec 18, 2025 to Jan 31, 2026" />
        </section>

        {/* Section: Domain */}
        <section>
          <div className="space-y-[6px]">
            <Label>Subdomain *</Label>
            <div className="relative">
              <Input placeholder="Search by name" className="pr-[140px] border-gray-200" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark">.restaurantos.com</span>
            </div>
          </div>
        </section>

        {/* Section: Business Model */}
        <section className="space-y-[24px]">
          <Label>Select Business Model</Label>
          <div className="grid grid-cols-4 gap-[6px] overflow-hidden">
            <ModelBtn label="Commission" active />
            <ModelBtn label="Subscription" />
            <ModelBtn label="Hybrid" />
            <ModelBtn label="Flat Fee" />
          </div>
          <FormGroup label="Commission Percentage *" placeholder="$ Add Amount" />
        </section>

        {/* Section: Branding */}
        <section className="space-y-[24px]">
          <div className="grid grid-cols-2 gap-[24px]">
            <div className="space-y-[6px]">
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <div className="size-[52px] rounded-md bg-primary shrink-0" />
                <Input placeholder="# Add Color Code" className="border-gray-200" />
              </div>
            </div>
            <div className="space-y-[6px]">
              <Label>Secondary Color</Label>
              <div className="flex gap-2">
                <div className="size-[52px] rounded-md bg-black shrink-0" />
                <Input placeholder="# Add Color Code" className="border-gray-200" />
              </div>
            </div>
          </div>
          <FormGroup label="Font Selection (Optional)" type="select" placeholder="Select font" />
        </section>

        {/* Footer Actions */}
        <section className="flex flex-col gap-[32px]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-base text-dark">Restaurant Status</span>
            <div className="flex items-center gap-[24px]">
              <span className="text-base font-semibold text-green">Active</span>
              <Switch defaultChecked className="data-[state=checked]:bg-primary" />
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" className="h-[52px] rounded-[12px]">Cancel</Button>
            <Button variant="outline" className="h-[52px] rounded-[12px]">Save as Drafts</Button>
            <Button variant="primary" className="h-[52px]">Save & Activate</Button>
          </div>
        </section>
      </div>
    </div>
  );
}

// Helper Components for clean code
function FormGroup({ label, placeholder, type = "text" }: { label: string, placeholder: string, type?: string }) {
  return (
    <div className="space-y-[6px]">
      <Label>{label}</Label>
      {type === "select" ? (
        <Select>
          <SelectTrigger className="h-[52px] border-[#BBBBBB] focus:border-primary">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="val">{placeholder}</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Input placeholder={placeholder} className="border-[#BBBBBB] focus:border-primary" />
      )}
    </div>
  );
}

function UploadBox() {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-[12px] p-10 flex flex-col items-center justify-center bg-gray-50/30 hover:bg-gray-50 transition-colors cursor-pointer">
      <ImageIcon size={40} className="text-gray-300 mb-[21.5px]" />
      <p className="text-lg font-semibold text-gray mb-[3px]">
        <span className="text-primary">Click to upload</span> or drag and drop
      </p>
      <p className="text-[16.5px] text-gray">JPG, JPEG, PNG less than 1MB</p>
    </div>
  );
}


function ModelBtn({ label, active = false }: { label: string, active?: boolean }) {
  return (
    <button className={`h-[52px] text-base text-gray border ${active ? "border-primary text-primary" : "border-gray"} rounded-[10px]`}>
      {label}
    </button>
  );
}