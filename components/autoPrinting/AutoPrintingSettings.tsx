"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, ChevronDown } from "lucide-react";
import FormInput from "../register/form/FormInput";

export default function AutoPrintingSettings() {
  const [autoPrint, setAutoPrint] = useState(true);

  return (
    <div className="bg-white rounded-xl p-8 mt-6">
      {/* ================= PRINTER STATUS ================= */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <h3 className="text-2xl font-semibold">Printer Status</h3>
        </div>

        <div className="text-right">
          <p className="text-m font-medium text-green-600">Connected</p>
          <p className="text-xs text-gray-600">
            Last Print: 2 minutes ago
          </p>

          <Button
            size="sm"
            className="mt-5 bg-primary hover:bg-red-800 px-15 rounded-[12px] h-[40px]"
          >
            Test Print
          </Button>
        </div>
      </div>

      {/* ================= CONNECT PRINTER ================= */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6">Connect Printer</h3>

        {/* Printer Type (FULL ROW) */}
        <div className="mb-6">
          <label className="text-[16px] mb-2 block">Printer Type</label>

          <div className="relative">
            <select
              className="w-full h-11 px-4 pr-12 border border-[#BBBBBB] rounded-[10px]
              text-sm text-gray-500 appearance-none
              focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            >
              <option>eg. john doe</option>
              <option>Thermal Printer</option>
              <option>POS Printer</option>
            </select>

            {/* Custom Arrow */}
            <div className="absolute right-0 top-0 h-full w-10 bg-primary flex items-center justify-center rounded-r-[10px] pointer-events-none">
              <ChevronDown size={16} className="text-white" />
            </div>
          </div>
        </div>

        {/* API KEY (FULL ROW) */}
        <div className="mb-6">
          <FormInput label="API Key" placeholder="eg. john doe" />
        </div>

        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-red-800 px-16 rounded-[12px] py-1.5 h-[40px]">
            Connect
          </Button>
        </div>
      </div>

      {/* ================= PRINT SETTINGS ================= */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6">Print Settings</h3>

        <div className="space-y-6">
          {/* Paper Size */}
          <div>
            <label className="text-[16px] mb-2 block">Paper Size</label>

            <div className="relative">
              <select
                className="w-full h-11 px-4 pr-12 border border-[#BBBBBB] rounded-[10px]
                text-sm text-gray-500 appearance-none
                focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option>eg. 80mm</option>
                <option>58mm</option>
                <option>80mm</option>
              </select>

              <div className="absolute right-0 top-0 h-full w-10 bg-primary flex items-center justify-center rounded-r-[10px] pointer-events-none">
                <ChevronDown size={16} className="text-white" />
              </div>
            </div>
          </div>

          {/* Auto Printing */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Auto Printing</span>
            <Switch checked={autoPrint} onCheckedChange={setAutoPrint} />
          </div>

          {/* Duplicate Copies */}
          <div>
            <p className="text-sm font-medium mb-3">Print Duplicate Copy</p>

            <div className="flex gap-6">
              {["Kitchen", "Customer"].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <span className="w-4 h-4 rounded-[4px] bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* Language */}
          <FormInput label="Language" placeholder="eg. English" />
        </div>
      </div>

      {/* ================= ORDER PRINT RULES ================= */}
      <div>
        <h3 className="text-2xl font-semibold mb-6">Order Print Rules</h3>

        <div className="space-y-3">
          {[
            "Print New Orders Automatically",
            "Print Updated Orders",
            "Print Cancelled Orders",
          ].map((rule) => (
            <label
              key={rule}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <span className="w-4 h-4 rounded-[4px] bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </span>
              {rule}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
