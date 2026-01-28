"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Eye, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import SortableHead from "../shared/sortable-head";

import { customerData } from "@/constants/customers";

export default function CustomersTable() {
  return (
    <div className="bg-white rounded-[14px] overflow-hidden px-2 lg:px-0">
      <Table>
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            <SortableHead label="Customer Name" />
            <SortableHead label="Customer Info" />
            <SortableHead label="Joining Date" />
            <TableHead className="text-center font-semibold">Status</TableHead>
            <SortableHead label="Restaurant Name" />
            <SortableHead label="Unblock/Block" />
            <TableHead className="text-center font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {customerData.map((customer, index) => (
            <TableRow
              key={index}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 h-[80px]"
            >
              <TableCell className="text-[#A3A3A3] text-sm text-center">
                {customer.name}
              </TableCell>

              <TableCell className="text-center">
                <div className="flex flex-col items-center">
                  <span className="text-[#A3A3A3] text-sm">{customer.email}</span>
                  <span className="text-[#A3A3A3] text-sm">{customer.phone}</span>
                </div>
              </TableCell>

              <TableCell className="text-[#A3A3A3] text-sm text-center">
                {customer.date}
              </TableCell>

              <TableCell className="text-center">
                <span
                  className={cn(
                    "font-semibold text-base",
                    customer.status === "Active" ? "text-green" : "text-primary"
                  )}
                >
                  {customer.status}
                </span>
              </TableCell>

              <TableCell className="text-[#A3A3A3] text-base text-center">
                {customer.restaurant}
              </TableCell>

              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Switch
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-[#E6E7EC]"
                    defaultChecked={customer.blocked}
                  />
                </div>
              </TableCell>

              <TableCell className="text-center">
                <div className="flex justify-center items-center gap-4 text-[#A3A3A3]">
                  <button className="hover:text-dark transition-colors">
                    <Eye size={20} />
                  </button>
                  <button className="hover:text-dark transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

