"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface FormInputProps {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (val: string) => void;
  required?: boolean;
  error?: boolean;
  errorText?: string;
  showPasswordToggle?: boolean;
}

export default function FormInput({
  label,
  placeholder,
  value,
  onChange,
  required,
  error,
  errorText,
  showPasswordToggle
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <Label className="mb-2 text-[16px]">
        {label}
        {required && <span className="text-primary"> *</span>}
      </Label>

      <div className="relative">
  <Input
    type={showPasswordToggle ? (showPassword ? "text" : "password") : "text"}
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    placeholder={placeholder}
    className={`
      border-[#BBBBBB]
      placeholder-[#BBBBBB]
      focus:border-primary
      focus:ring-1
      focus:ring-primary
      pr-10
      ${error ? "border-primary bg-primary/5" : ""}
    `}
  />

  {showPasswordToggle && (
    <button
      type="button"
      onClick={() => setShowPassword((p) => !p)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  )}
</div>

      {error && errorText && (
        <p className="text-xs text-primary mt-1">{errorText}</p>
      )}
    </div>
  );
}
