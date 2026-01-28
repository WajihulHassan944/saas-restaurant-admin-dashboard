"use client";

import { statsData } from "@/constants/customer-settings";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        const isDanger = stat.variant === "danger";
        const isUp = stat.trend.direction === "up";

        return (
          <div
            key={index}
            className="bg-white p-6 rounded-[14px] border border-[#EDEFF2] flex items-center gap-[24px]"
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
              <p className="text-[32px] font-semibold text-dark leading-none">
                {stat.value}
              </p>

              <p className="text-base text-gray">
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
