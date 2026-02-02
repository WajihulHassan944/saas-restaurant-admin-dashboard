"use client";

import { Label } from "@/components/ui/label";
import Section from "../Promotions/Section";
import FormInput from "@/components/register/form/FormInput";
import EmptySetupCard from "./common/EmptySetupCard";
import { MapPin } from "lucide-react";

export default function EditBranchStepTwo() {
  return (
    <div className="rounded-[14px] mt-10">

   <Section label="Delivery Charge Info" padded={false} withMargin={true}>
              <Label className="text-[16px]">Delivery Charge Type</Label>
  </Section>
   
   <Section label="Setup Order Value for this branch" padded={false} withMargin={true}>
              <Label className="mb-2 text-[16px]">Order Value</Label>
  </Section>

  <Section label="Set Delivery Charge Per kilometer" padded={false} withMargin={true}>
          <FormInput label="Charge ($) *" placeholder="eg. John Doe" />
    </Section>

      <Section label="Setup Delivery Coverage Area" padded={false} withMargin={true}>
          <FormInput label="Set Radius (km) *" placeholder="eg. John Doe" />
          <div className="w-full rounded-[12px] overflow-hidden border border-[#BBBBBB] mt-0">
                <img
                  src="/map.png"
                  alt="Business Logo"
                  className="w-full h-[280px] object-cover"
                />
              </div>
    </Section>
<EmptySetupCard
  title="Setup Area/Zip Code & Charges"
  description="Add Zip codes and its delivery charges from here"
  emptyMessage="You haven't set up area/zip code and delivery charges yet. Click below to add and start processing."
  actionLabel="+ Add New"
  onAction={() => console.log("Add new area")}
  icon={
    <div className=" flex items-center justify-center">
      <MapPin className="text-primary" size={42} />
    </div>
  }
/>

<EmptySetupCard
  title="Setup Delivery Zones & Charges"
  description="Setup zones where you want to deliver foods"
  emptyMessage="You haven't set up area/zip code and delivery charges yet. Click below to add and start processing."
  actionLabel="+ Add New"
  onAction={() => console.log("Add new area")}
  icon={
    <div className=" flex items-center justify-center">
      <MapPin className="text-primary" size={42} />
    </div>
  }
/>


       </div>
  );
}
