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
          <button className="p-2 rounded-full text-red-500 hover:bg-red-50 hover:scale-110 transition-all duration-200">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z" fill="#CE181B"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="#CE181B"/>
  </svg>
</button>

<button className="p-2 rounded-full text-green-500 hover:bg-green-50 hover:scale-110 transition-all duration-200">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="#00A63E"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12.0574 1.25H11.9426C9.63424 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63422 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V11.9426C22.75 9.63423 22.75 7.82519 22.5603 6.41371C22.366 4.96897 21.9607 3.82895 21.0659 2.93414C20.1711 2.03933 19.031 1.63399 17.5863 1.43975C16.1748 1.24998 14.3658 1.24999 12.0574 1.25ZM3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62177 2.75 12 2.75C14.3782 2.75 16.0864 2.75159 17.3864 2.92637C18.6648 3.09825 19.4355 3.42514 20.0052 3.9948C20.5749 4.56445 20.9018 5.33517 21.0736 6.61358C21.2484 7.91356 21.25 9.62177 21.25 12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62177 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62177 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948Z" fill="#00A63E"/>
  </svg>
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
