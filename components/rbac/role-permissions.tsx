"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Box, Menu, Bike, CircleDollarSign, BarChart3, Settings } from "lucide-react";

const permissions = [
  { module: "Orders", icon: Box, rights: ["View", "Create/Edit", "Cancel"], checked: ["View", "Create/Edit"] },
  { module: "Menus", icon: Menu, rights: ["View", "Add/Edit", "Delete"], checked: ["View", "Add/Edit"] },
  { module: "Drivers", icon: Bike, rights: ["View", "Assign", "Manage Status"], checked: ["View", "Assign"] },
  { module: "Finance", icon: CircleDollarSign, rights: ["View", "Manage Payout", "Access Invoice"], checked: ["View", "Manage Payout"] },
  { module: "Reports", icon: BarChart3, rights: ["View", "Export"], checked: ["View"] },
  { module: "Settings", icon: Settings, rights: ["View", "Manage"], checked: ["View"] },
];

export default function RolePermissions() {
  return (
    <Card className="p-4 lg:p-[30px] border-none gap-0 shadow-sm rounded-[14px] bg-white h-full">
      <div className="flex justify-between items-center mb-[6px]">
        <h2 className="text-lg font-semibold">
          Permission: <span className="text-primary">Manager</span>
        </h2>
        <button className="text-primary text-xs">Reset to default</button>
      </div>
      <p className="text-gray-400 text-sm mb-[24px]">Select which modules and actions are accessible for each role.</p>

      <div className="w-full">
        <div className="grid grid-cols-12 py-[6px] border-y border-[#BBBBBB] text-gray font-semibold text-lg">
          <div className="col-span-4">Module</div>
          <div className="col-span-8">Access Rights</div>
        </div>

        <div>
          {permissions.map((item) => (
            <div
              key={item.module}
              className="grid py-[24px] items-center"
              style={{ gridTemplateColumns: "minmax(0, 1fr) 1px minmax(0, 2fr)" }}
            >
              {/* Left - Module */}
              <div className="flex items-center gap-[12px] pr-4">
                <item.icon size={20} className="text-primary shrink-0" />
                <span className="text-gray font-semibold text-lg truncate">
                  {item.module}
                </span>
              </div>

              {/* Spacer */}
              <div />

              {/* Right - Checkboxes */}
              <div className="grid grid-cols-3 gap-x-[10px] gap-y-[24px]">
                {item.rights.map((right) => (
                  <div
                    key={right}
                    className="flex items-center gap-[12px] min-w-0"
                  >
                    <Checkbox
                      id={`${item.module}-${right}`}
                      checked={item.checked.includes(right)}
                      className="w-[20px] h-[20px] data-[state=checked]:bg-primary data-[state=checked]:border-primary shrink-0"
                    />
                    <label
                      htmlFor={`${item.module}-${right}`}
                      className="text-sm text-dark cursor-pointer truncate min-w-0"
                      title={right}
                    >
                      {right}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}