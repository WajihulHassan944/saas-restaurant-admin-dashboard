"use client";

import { Label } from "@/components/ui/label";
import Section from "../Promotions/Section";
import FormInput from "@/components/register/form/FormInput";

export default function EditBranchStepOne() {
  return (
    <div className="rounded-[14px]">
       <div className="mb-12 mt-8">
        <h2 className="text-md font-semibold text-gray-600">
          Basic Information
        </h2>
        <p className="text-sm text-gray-500">
          Select the type or types of access that you validate for this team
        </p>
      </div>

   <Section label="Setup Basic Info" padded={false} withMargin={true}>
        <FormInput label="Branch Name *" placeholder="eg. John Doe" />
        <FormInput label="Address Line 1 *" placeholder="eg. 10"/>
        <FormInput label="Address Line 2 *" placeholder="eg. 10"/>
          <button className="text-primary text-sm font-medium text-center w-full">
                + See More
              </button>
  </Section>

   <Section label="Contact Person Info" padded={false} withMargin={true}>
        <FormInput label="Contact Person Name *" placeholder="eg. John Doe" />
          <FormInput label="Designation" placeholder="eg. 10"/>
        <FormInput label="Contact Phone Number *" placeholder="eg. 10"/>
        <FormInput label="Email" placeholder="eg. 10"/>
  </Section>
<Section label="Add Branch Logo" padded={false} withMargin={true}>
            <div className="flex flex-col items-center text-center space-y-[12px]">
              <Label>Business Logo</Label>

              <div className="w-[180px] rounded-[12px] overflow-hidden border">
                <img
                  src="/branch_logo.jpg"
                  alt="Business Logo"
                  className="w-full h-[180px] object-cover"
                />
              </div>

              <p className="text-sm text-gray-500 max-w-[420px]">
                This is the business logo. It has been uploaded in the business
                setup
              </p>

            </div>
</Section>
   <Section label="Add Support Contact Info" padded={false} withMargin={true}>
             <div className="flex flex-col items-start space-y-[12px]">
              <Label className="mb-2 text-[16px]">Add Customer Support Contact Info</Label>
              <p className="text-sm text-gray-500 ">
                Turn on to set custom support contact info to show in website / POS
              </p>

            </div>
  </Section>



       </div>
  );
}
