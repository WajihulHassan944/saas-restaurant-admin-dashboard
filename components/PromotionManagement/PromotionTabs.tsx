"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tab = {
  label: string;
  value: string;
};

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
};

export default function PromotionTabs({ tabs, active, onChange }: Props) {
  return (
    <div className="inline-flex items-center gap-2.5 bg-[#F5F5F5] rounded-[12px] w-fit p-0">
      {tabs.map((tab) => {
        const isActive = active === tab.value;

        return (
         <Button
  key={tab.value}
  size="sm"
  variant={isActive ? "default" : "ghost"}
  onClick={() => onChange(tab.value)}
  className={cn(
    "px-6 py-5 rounded-[10px]",
    isActive
      ? "bg-primary text-white hover:bg-primary"
      : "text-gray-500 font-semibold hover:text-black hover:bg-transparent text-[15px] py-6"
  )}
>

            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
