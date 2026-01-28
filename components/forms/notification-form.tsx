"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function NotificationForm() {
  return (
    <div className="space-y-[32px]">

      {/* Email Channel Section */}
      <div className="space-y-[32px]">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-dark">Email</h3>
          <Switch defaultChecked className="data-[state=checked]:bg-primary" />
        </div>
        <div className="space-y-[6px]">
          <Label>Email Address</Label>
          <Input placeholder="eg. jhondoe@Example.com" className="h-[52px] border-[#BBBBBB]" />
        </div>
      </div>

      {/* SMS Channel Section */}
      <div className="space-y-[32px]">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-dark">SMS</h3>
          <Switch defaultChecked className="data-[state=checked]:bg-primary" />
        </div>
        <div className="space-y-[6px]">
          <Label>Phone Number</Label>
          <Input placeholder="eg. jhon doe" className="h-[52px] border-[#BBBBBB]" />
        </div>
      </div>

      {/* Whatsapp Channel Section */}
      <div className="space-y-[32px]">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-dark">Whatsapp</h3>
          <Switch defaultChecked className="data-[state=checked]:bg-primary" />
        </div>
        <div className="space-y-[6px]">
          <Label>Whatsapp Number</Label>
          <Input placeholder="eg. jhon doe" className="h-[52px] border-[#BBBBBB]" />
        </div>
      </div>

      {/* Notification Types Matrix */}
      <div>
        <div className="grid grid-cols-12 mb-[32px]">
          <div className="col-span-6">
            <h3 className="text-2xl font-semibold text-dark">Notification Types</h3>
          </div>
          <div className="col-span-2 text-center text-dark font-medium">Email</div>
          <div className="col-span-2 text-center text-dark font-medium">SMS</div>
          <div className="col-span-2 text-center text-dark font-medium">Whatsapp</div>
        </div>

        <div className="space-y-[32px]">
          <NotificationRow label="New Order" email sms />
          <NotificationRow label="Order Cancelled" email whatsapp />
          <NotificationRow label="Printer Error" email whatsapp />
          <NotificationRow label="Daily Report" email sms />
          <NotificationRow label="Payout Update" email whatsapp />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col md:flex-row  justify-end gap-[24px]">
        <Button variant="outline" className="h-[52px] px-8 rounded-[10px] text-dark border-gray-200">
          Cancel
        </Button>
        <Button variant="primary" className="h-[52px] px-8 rounded-[10px]">
          Save & Activate
        </Button>
      </div>
    </div>
  );
}

// Helper Row Component for the Matrix
function NotificationRow({
  label,
  email = false,
  sms = false,
  whatsapp = false
}: {
  label: string;
  email?: boolean;
  sms?: boolean;
  whatsapp?: boolean;
}) {
  return (
    <div className="grid grid-cols-12 items-center">
      <div className="col-span-6 text-base font-medium text-dark">{label}</div>
      <div className="col-span-2 flex justify-center">
        <Checkbox
          defaultChecked={email}
          className="w-[20px] h-[20px] data-[state=checked]:bg-primary border-gray-300"
        />
      </div>
      <div className="col-span-2 flex justify-center">
        <Checkbox
          defaultChecked={sms}
          className="w-[20px] h-[20px] data-[state=checked]:bg-primary border-gray-300"
        />
      </div>
      <div className="col-span-2 flex justify-center">
        <Checkbox
          defaultChecked={whatsapp}
          className="w-[20px] h-[20px] data-[state=checked]:bg-primary border-gray-300"
        />
      </div>
    </div>
  );
}