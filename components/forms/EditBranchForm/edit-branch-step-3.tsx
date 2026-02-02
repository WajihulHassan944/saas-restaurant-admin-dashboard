"use client";

import { Radio } from "@/components/ui/radioBtn";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp, Clock, Plus, X } from "lucide-react";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function EditBranchStepThree() {
  return (
    <div className="bg-white rounded-[14px]">
     
      <div className="mb-[32px] mt-8">
        <h2 className="text-md font-semibold text-gray-600">
          Setup Working Hour
        </h2>
        <p className="text-sm text-gray-500">
          Configure your standard business working hour from here
        </p>
      </div>

      {/* Default Working Hour */}
      <div className="mb-[32px] p-[30px]">
        <div className="mb-[16px]">
          <span className="text-sm font-medium border-b border-black pb-[4px]">
            Default Working Hour
          </span>
        </div>

        <div className="flex gap-[32px]">
          <Radio label="Always open" />
          <Radio label="Set Specific Time" active />
        </div>
      </div>

      {/* Day Rows */}
      <div className="space-y-[18px] p-[30px]">
        {DAYS.map((day, index) => (
          <WorkingDayRow
            key={day}
            day={day}
            active={index === 0} // Sunday active in mock
          />
        ))}
      </div>
    </div>
  );
}

function WorkingDayRow({
  day,
  active = false,
}: {
  day: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-[24px]">
      {/* Day */}
      <div className="w-[100px] text-sm text-dark">
        {day}
      </div>

      {/* Toggle */}
      <Switch checked={active} />

      {/* Time Range */}
      {active && (
        <div className="flex items-center gap-[16px]">
          <TimeInput />
          <span className="text-sm text-gray-500">to</span>
          <TimeInput />

          {/* Actions */}
          <button className="text-red-500">
            <X size={18} />
          </button>
          <button className="text-green-500">
            <Plus size={18} />
          </button>
        </div>
      )}
    </div>
  );
}


function TimeInput() {
  return (
    <div className="flex items-center gap-[8px] border rounded-[8px] px-[12px] py-[6px]">
      <Clock size={16} className="text-gray-400" />

      <span className="text-sm text-gray-600 min-w-[70px]">
        12:00 AM
      </span>

      <div className="flex flex-col">
        <ChevronUp size={14} className="text-gray-400" />
        <ChevronDown size={14} className="text-gray-400" />
      </div>
    </div>
  );
}
