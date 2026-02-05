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
    <div className="overflow-x-auto w-full">
      <div className="inline-flex items-center gap-2.5 bg-[#F5F5F5] rounded-[12px] p-[2px] min-w-max">
        {tabs.map((tab) => {
          const isActive = active === tab.value;

          return (
            <Button
              key={tab.value}
              size="sm"
              variant={isActive ? "default" : "ghost"}
              onClick={() => onChange(tab.value)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-[10px] text-[14px] sm:text-[15px] font-semibold",
                isActive
                  ? "bg-primary text-white hover:bg-primary"
                  : "text-gray-500 hover:text-black hover:bg-transparent"
              )}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
