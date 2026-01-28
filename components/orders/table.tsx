"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, MoreHorizontal } from "lucide-react";
import SortableHead from "../shared/sortable-head";

import { orders } from "@/constants/orders";

export default function OrdersTable() {
  return (
    <div className="bg-white rounded-[14px] overflow-hidden px-2 lg:px-0">
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <SortableHead label="Order ID" />
            <SortableHead label="Date" />
            <SortableHead label="Customer Name" />
            <SortableHead label="Restaurant Name" />
            <SortableHead label="Order Status" />
            <SortableHead label="Amount" />
            <TableHead className="text-center font-semibold text-dark">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order, index) => (
            <TableRow
              key={index}
              className="border-b text-center border-gray-50 last:border-0 h-[64px] hover:bg-gray-50/50"
            >
              <TableCell className="text-[#A3A3A3] text-sm">
                {order.id}
              </TableCell>

              <TableCell className="text-[#A3A3A3] text-sm">
                {order.date}
              </TableCell>

              <TableCell className="text-[#A3A3A3] text-sm">
                {order.customer}
              </TableCell>

              <TableCell className="text-[#A3A3A3] text-sm">
                {order.restaurant}
              </TableCell>

              <TableCell className="text-[#A3A3A3] text-sm">
                {order.status}
              </TableCell>

              <TableCell className="text-green font-semibold text-sm">
                {order.amount}
              </TableCell>

              <TableCell className="text-center">
                <div className="flex justify-center items-center gap-4 text-[#A3A3A3]">
                  <button className="hover:text-dark transition-colors">
                    <Eye size={18} />
                  </button>
                  <button className="hover:text-dark transition-colors">
                    <MoreHorizontal size={18} />
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

