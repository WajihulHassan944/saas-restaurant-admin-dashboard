"use client";

import { Percent } from "lucide-react";

export default function HappyHourInfoCard() {
  return (
    <div className="bg-white border rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-[#F9F9F9] flex items-center justify-center flex-shrink-0">
        <Percent className="text-primary" size={18} />
      </div>

      {/* Content */}
      <div className="flex flex-col sm:flex-row sm:gap-0 w-full">
        {/* Main Info */}
        <div className="flex-1 min-w-[120px]">
          <p className="text-2xl font-semibold">
            20% Off{" "}
            <span className="text-xs font-normal text-gray-400 block sm:inline">
              (Daily Specific Time)
            </span>
          </p>

          <p className="text-sm text-gray-500 mt-1">
            02:12PM - 06:16PM
          </p>
        </div>

        {/* Additional Info */}
        <div className="flex-1 min-w-[100px] mt-2 sm:mt-0 text-sm text-gray-500">
          <p>Discount Type: Discount On Purchase</p>
          <p>Food Category: All</p>
        </div>
      </div>
    </div>
  );
}
