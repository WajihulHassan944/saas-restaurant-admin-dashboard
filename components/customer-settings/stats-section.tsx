"use client";

import { statsData } from "@/constants/customer-settings";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const StatsSection = () => {
  return (
     <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-[16px] sm:gap-[10px] md:gap-[24px]",
       
      )}
    >
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        const isDanger = stat.variant === "danger";
        const isUp = stat.trend.direction === "up";

        return (
          <div
            key={index}
            className=" rounded-[18px] bg-white p-[16px] shadow-none sm:p-[20px] md:p-[24px] border border-[#EDEFF2] flex gap-3"
          >
            {/* Icon */}
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                isDanger
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-100 text-primary"
              )}
            >
              <Icon size={22} />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <p className="text-[24px] sm:text-[32px] font-semibold text-black leading-none">
                {stat.value}
              </p>

             <p className="mt-1 text-xs sm:text-[15px] text-gray-400">
                {stat.title}
              </p>

              {/* Trend */}
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  isUp
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {isUp ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                {stat.trend.percentage}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsSection;
