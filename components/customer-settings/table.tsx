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
const [openDetails, setOpenDetails] = useState(false);
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
        <Table className="my-10">
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="w-[50px]">
                <Checkbox />
              </TableHead>
              <SortableHeader label="SL" />
              <SortableHeader label="Customer Name" />
              <SortableHeader label="Customer Info" />
              <TableHead className="text-center px-4 font-semibold">
                Total Order
              </TableHead>
              <SortableHeader label="Joining Date" />
              <SortableHeader label="Unblock/Block" />
              <TableHead className="text-center font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customersData.map((dm, i) => (
              <TableRow key={i} className="border-none h-[70px]">
                <TableCell>
                  <Checkbox defaultChecked />
                </TableCell>

                <TableCell className="px-4">{dm.sl}</TableCell>

                <TableCell className="px-4">{dm.deliveryManName}</TableCell>

                <TableCell className="px-4">
                  <div>
                    <p>{dm.phone}</p>
                    <p className="text-gray">{dm.email}</p>
                  </div>
                </TableCell>

                <TableCell className="px-4 text-center">{dm.orderLimit}</TableCell>

                <TableCell className="px-4">
                 {dm.joiningDate}
                </TableCell>

                <TableCell className=" text-center pr-14">
                  <Switch defaultChecked={dm.status} />
                </TableCell>

                <TableCell className="px-4">
                  <div className="flex items-center justify-center gap-2 text-gray">
                    <button className="p-2" onClick={() => setOpenDetails(true)}>
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
        {customersData.map((dm, i) => (
          <div
            key={i}
            className="bg-white rounded-[18px] p-4 shadow-sm border border-gray-200"
          >
            {/* Header: Name + Checkbox + Status */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Checkbox defaultChecked />
                <p className="font-medium">{dm.deliveryManName}</p>
              </div>
              <Switch defaultChecked={dm.status} />
            </div>

            {/* SL & Order Limit */}
            <div className="text-sm text-gray mb-1">
              <p>SL: {dm.sl}</p>
              <p>Assign Order Limit: {dm.orderLimit}</p>
            </div>

            {/* Contact Info */}
            <div className="text-sm text-gray mb-2">
              <p>Phone: {dm.phone}</p>
              <p>Email: {dm.email}</p>
            </div>

            {/* Branch Info */}
            <div className="text-xs text-gray mb-2">
              <p>Joining Date:</p>
              <p>Currently Assign: {dm.joiningDate}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 text-gray">
              <button className="p-2" onClick={() => setOpenDetails(true)}>
                <Eye size={18} />
              </button>
              <button className="p-2">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        ))}

        <CustomerDetailModal open={openDetails}
  onOpenChange={setOpenDetails} />
      </div>
    </>
  );

};

export default CustomerTable;
