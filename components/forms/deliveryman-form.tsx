"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Info } from "lucide-react"

interface Props {
  formData: any
  setFormData: (data: any) => void
}

const DeliveryManForm = ({ formData, setFormData }: Props) => {

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="bg-white rounded-[14px] p-[30px]">
      <div className="grid grid-cols-12 gap-[48px]">
        <div className="col-span-4 space-y-[64px]">
          <SectionTitle title="Setup Basic Info" />
        </div>

        <div className="col-span-8 space-y-[40px]">
          <section className="space-y-[24px]">

            <div className="grid grid-cols-2 gap-[24px]">
              <FormField
                label="First Name *"
                value={formData.firstName}
                onChange={(v) => handleChange("firstName", v)}
              />

              <FormField
                label="Last Name *"
                value={formData.lastName}
                onChange={(v) => handleChange("lastName", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-[24px]">
              <FormField
                label="Phone Number *"
                value={formData.phone}
                onChange={(v) => handleChange("phone", v)}
              />

              <FormField
                label="Email"
                value={formData.email}
                onChange={(v) => handleChange("email", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-[24px]">
              <FormField
                label="Vehicle Type"
                value={formData.vehicleType}
                onChange={(v) => handleChange("vehicleType", v)}
              />

              <FormField
                label="Vehicle Number"
                value={formData.vehicleNumber}
                onChange={(v) => handleChange("vehicleNumber", v)}
              />
            </div>

          </section>
        </div>

        {/* <div className="col-span-4 space-y-[64px]"> <SectionTitle title="Identity Information" /> </div> <div className="col-span-8 space-y-[40px]"> <section className="space-y-[24px]"> <div className="flex gap-[24px]"> <Radio label="Passport" /> <Radio label="National ID" /> <Radio label="Driving License" active /> </div> <FormField value="" label="Identity Number *" onChange={(e)=>console.log(e)} /> <div className="flex flex-col items-center text-center space-y-[12px]"> <Label>Business Logo</Label> <div className="w-[180px] rounded-[12px] overflow-hidden border"> <img src="/dummy-user.jpg" alt="Business Logo" className="w-full h-[180px] object-cover" /> </div> <p className="text-sm text-gray-500 max-w-[320px]"> This is the business logo. It has been uploaded in the business setup </p> <button className="text-primary text-sm font-medium"> + See More </button> </div> </section></div> */}
    
      </div>
    </div>
  )
}

export default DeliveryManForm


/* helpers */

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-[12px]">
      <Info size={18} className="text-gray-400" />
      <span className="text-base font-semibold text-[#646982]">{title}</span>
    </div>
  )
}

function FormField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-[6px]">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[44px] border-[#BBBBBB]"
      />
    </div>
  )
}