"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { customersData } from "@/constants/customer-settings";
import SortableHeader from "@/components/shared/sortable-head";
import { Eye, MoreHorizontal } from "lucide-react";
import Pagination from "@/components/pagination";
import EmptyState from "../shared/EmptyState";
import { useState } from "react";
import CustomerDetailModal from "./CustomerDetailModal";

const CustomerTable = () => {
  const [open, setOpen] = useState(false);

  if (!customersData || customersData.length === 0) {
    return (
      <EmptyState
        title="Looks like there are no customers yet!"
        description="You haven’t added any customers yet. Start by creating a new one."
      />
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="w-[50px]">
                <Checkbox />
              </TableHead>
              <SortableHeader label="SL" />
              <SortableHeader label="Customer" />
              <SortableHeader label="Customer Details" />
              <SortableHeader label="Role" />
              <SortableHeader label="Branch" />
              <SortableHeader label="Status" />
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customersData.map((customer, i) => (
              <TableRow key={i} className="border-none h-[70px]">
                <TableCell>
                  <Checkbox defaultChecked />
                </TableCell>

                <TableCell>{customer.sl}</TableCell>

                <TableCell>{customer.customerName}</TableCell>

                <TableCell>
                  <div>
                    <p>{customer.phone}</p>
                    <p className="text-gray">{customer.email}</p>
                  </div>
                </TableCell>

                <TableCell>{customer.role}</TableCell>

                <TableCell>
                  <div className="flex items-start gap-2 text-xs">
                    <div>
                      <p>{customer.branch.currentlyAssign}</p>
                      <p>{customer.branch.outForDelivery}</p>
                      <p>{customer.branch.ongoingOrder}</p>
                    </div>
                    <div className="text-gray">
                      <p>Currently Assign</p>
                      <p>Out for Delivery</p>
                      <p>Ongoing Order</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Switch defaultChecked={customer.status} />
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-center gap-2 text-gray">
                    <button className="p-2" onClick={() => setOpen(true)}>
                      <Eye size={18} />
                    </button>
                    <button className="p-2">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination />
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-4 md:hidden">
        {customersData.map((customer, i) => (
          <div
            key={i}
            className="bg-white rounded-[18px] p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Checkbox defaultChecked />
                <p className="font-medium">{customer.customerName}</p>
              </div>
              <Switch defaultChecked={customer.status} />
            </div>

            <div className="text-sm text-gray mb-1">
              <p>SL: {customer.sl}</p>
              <p>Role: {customer.role}</p>
            </div>

            <div className="text-sm text-gray mb-2">
              <p>Phone: {customer.phone}</p>
              <p>Email: {customer.email}</p>
            </div>

            <div className="text-xs text-gray mb-2">
              <p>Branch:</p>
              <p>Currently Assign: {customer.branch.currentlyAssign}</p>
              <p>Out for Delivery: {customer.branch.outForDelivery}</p>
              <p>Ongoing Order: {customer.branch.ongoingOrder}</p>
            </div>

            <div className="flex justify-end gap-2 text-gray">
              <button
                className="p-2"
                onClick={() => setOpen(true)}
              >
                <Eye size={18} />
              </button>
              <button className="p-2">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <CustomerDetailModal open={open} onOpenChange={setOpen} />
    </>
  );
};

export default CustomerTable;
