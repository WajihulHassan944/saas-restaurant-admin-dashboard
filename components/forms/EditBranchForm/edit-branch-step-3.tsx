"use client";

import { Input } from "@/components/ui/input";
import { Radio } from "@/components/ui/radioBtn";
import { Switch } from "@/components/ui/switch";
import { blockInvalidNumberKeys, blockNegativeNumberPaste, sanitizeNonNegativeNumber } from "@/utils/numberInput";
import { ChevronDown, ChevronUp, Clock, Clock3 } from "lucide-react";
import { useState, useEffect } from "react";

const DAYS = [
  { label: "Sunday", value: "SUNDAY" },
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
];

export default function EditBranchStepThree({ data, setData }: any) {
  if (!data) return null;

  const hours = data.settings?.openingHours || [];

  const [mode, setMode] = useState<"global" | "custom">("custom");
  const [globalTime, setGlobalTime] = useState({
    openTime: "09:00",
    closeTime: "18:00",
  });

  // ================= APPLY GLOBAL =================
  const applyGlobalToAll = (openTime: string, closeTime: string) => {
    const updated = DAYS.map(({ value }) => ({
      dayOfWeek: value,
      isClosed: false,
      openTime,
      closeTime,
      note: "Global timing",
    }));

    setData({
      ...data,
      settings: {
        ...data.settings,
        openingHours: updated,
      },
    });
  };

  useEffect(() => {
    if (mode === "global") {
      applyGlobalToAll(globalTime.openTime, globalTime.closeTime);
    }
  }, [globalTime, mode]);

  // ================= DAY UPDATE =================
  const updateDay = (day: string, key: string, value: any) => {
    let updated = [...hours];

    const index = updated.findIndex((d: any) => d.dayOfWeek === day);

    if (index === -1) {
      updated.push({
        dayOfWeek: day,
        isClosed: false,
        openTime: globalTime.openTime,
        closeTime: globalTime.closeTime,
        note: "",
      });
    }

    updated = updated.map((d: any) =>
      d.dayOfWeek === day ? { ...d, [key]: value } : d
    );

    setData({
      ...data,
      settings: {
        ...data.settings,
        openingHours: updated,
      },
    });
  };

  const getDay = (day: string) => {
    return hours.find((d: any) => d.dayOfWeek === day);
  };

  return (
    <div className="bg-white rounded-[14px]">


{/* ================= DELIVERY TIME ================= */}
<div className="mb-[24px] rounded-[16px] border border-gray-100 bg-white p-[24px] shadow-sm">
  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
    <div className="flex items-start gap-3">
      <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] bg-primary/10 text-primary">
        <Clock3 size={20} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900">
          Delivery Time
        </h3>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          Set the estimated delivery time customers will see for this branch.
        </p>
      </div>
    </div>

    <div className="flex w-full items-center gap-3 md:w-auto">
      <div className="relative w-full md:w-[180px]">
        <Input
          type="number"
          min={0}
          value={(data.deliveryTime)}
          onKeyDown={blockInvalidNumberKeys}
          onPaste={blockNegativeNumberPaste}
          onChange={(e) =>
            setData({
              ...data,
              deliveryTime:
                e.target.value === ""
                  ? null
                  : Number(sanitizeNonNegativeNumber(e.target.value)),
            })
          }
          placeholder="eg. 30"
          className="h-[42px] rounded-[10px] pr-[72px]"
        />

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
          min
        </span>
      </div>
    </div>
  </div>
</div>

      {/* ================= MODE ================= */}
      <div className="mb-[32px] p-[30px]">
        <div className="mb-[16px]">
          <span className="text-sm font-medium border-b border-black pb-[4px]">
            Default Working Hour
          </span>
        </div>

        <div className="flex gap-[32px]">
          <div onClick={() => setMode("global")}>
            <Radio label="Always open" active={mode === "global"} />
          </div>

          <div onClick={() => setMode("custom")}>
            <Radio label="Set Specific Time" active={mode === "custom"} />
          </div>
        </div>

        {/* ================= GLOBAL TIME INPUT ================= */}
        {mode === "global" && (
          <div className="flex items-center gap-[16px] mt-6">
            <TimeInput
              value={globalTime.openTime}
              onChange={(val: string) =>
                setGlobalTime((prev) => ({ ...prev, openTime: val }))
              }
            />

            <span className="text-sm text-gray-500">to</span>

            <TimeInput
              value={globalTime.closeTime}
              onChange={(val: string) =>
                setGlobalTime((prev) => ({ ...prev, closeTime: val }))
              }
            />
          </div>
        )}
      </div>

      {/* ================= DAY ROWS ================= */}
      <div className="space-y-[18px] p-[30px]">
        {DAYS.map(({ label, value }) => {
          const item = getDay(value);
          const isActive = item ? !item.isClosed : false;

          return (
            <WorkingDayRow
              key={value}
              day={label}
              active={isActive}
              openTime={item?.openTime}
              closeTime={item?.closeTime}
           onToggle={(val: boolean) => {
  // If user is closing a day → force custom mode
  if (!val && mode === "global") {
    setMode("custom");
  }

  updateDay(value, "isClosed", !val);
}}
              onTimeChange={(type: string, val: string) =>
                updateDay(value, type, val)
              }
            />
          );
        })}
      </div>
    </div>
  );
}

function WorkingDayRow({
  day,
  active,
  openTime,
  closeTime,
  onToggle,
  onTimeChange,
}: any) {
  return (
    <div className="flex items-center gap-[24px]">
      <div className="w-[100px] text-sm text-dark">{day}</div>

      <Switch checked={active} onCheckedChange={onToggle} />

      {active && (
        <div className="flex items-center gap-[16px]">
          <TimeInput
            value={openTime}
            onChange={(val: string) => onTimeChange("openTime", val)}
          />

          <span className="text-sm text-gray-500">to</span>

          <TimeInput
            value={closeTime}
            onChange={(val: string) => onTimeChange("closeTime", val)}
          />
        </div>
      )}
    </div>
  );
}

function TimeInput({ value, onChange }: any) {
  return (
    <div className="flex items-center gap-[8px] border rounded-[8px] px-[12px] py-[6px]">
      <Clock size={16} className="text-gray-400" />

      <input
        type="time"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm text-gray-600 outline-none bg-transparent"
      />

      <div className="flex flex-col">
        <ChevronUp size={14} className="text-gray-400" />
        <ChevronDown size={14} className="text-gray-400" />
      </div>
    </div>
  );
}