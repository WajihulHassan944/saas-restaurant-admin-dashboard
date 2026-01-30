"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  label: string;
  placeholder: string;
}

export default function FormInput({ label, placeholder }: FormInputProps) {
  return (
    <div>
      <Label className="mb-2 text-[16px]">{label}</Label>
      <Input
        placeholder={placeholder}
        className="border-[#BBBBBB] placeholder-[#BBBBBB] focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
