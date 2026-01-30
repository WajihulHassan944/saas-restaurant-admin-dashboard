"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormSelectProps {
  placeholder: string;
  options: string[];
}

export default function FormSelect({ placeholder, options }: FormSelectProps) {
  return (
    <Select>
      <SelectTrigger className="border-[#BBBBBB] placeholder-[#BBBBBB]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt.toLowerCase()}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
