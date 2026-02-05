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
import { deliveryManData } from "@/constants/deliveryman";
import SortableHeader from "@/components/shared/sortable-head";
import { Eye, MoreHorizontal } from "lucide-react";
import Pagination from "@/components/pagination";
import EmptyState from "../shared/EmptyState";

const DeliveryManTable = () => {
  if (!deliveryManData || deliveryManData.length === 0) {
    return (
      <EmptyState
        title="Looks like there are no Delivery Man yet!"
        description="You haven’t added any deliveryman yet. Start by creating a new."
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
              <SortableHeader label="Delivery Man" />
              <SortableHeader label="Delivery Man Info" />
              <TableHead className="text-center px-4 font-semibold">
                Assign Order Limit
              </TableHead>
              <SortableHeader label="Current Order Info" />
              <SortableHeader label="Status" />
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {deliveryManData.map((dm, i) => (
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
                  <div className="flex items-start gap-2 text-xs">
                    <div>
                      <p>{dm.branch.currentlyAssign}</p>
                      <p>{dm.branch.outForDelivery}</p>
                      <p>{dm.branch.ongoingOrder}</p>
                    </div>
                    <div className="text-gray">
                      <p>Currently Assign</p>
                      <p>Out for Delivery</p>
                      <p>Ongoing Order</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4">
                  <Switch defaultChecked={dm.status} />
                </TableCell>

                <TableCell className="px-4">
                  <div className="flex items-center justify-center gap-2 text-gray">
                    <button className="p-2">
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
        {deliveryManData.map((dm, i) => (
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
              <p>Branch:</p>
              <p>Currently Assign: {dm.branch.currentlyAssign}</p>
              <p>Out for Delivery: {dm.branch.outForDelivery}</p>
              <p>Ongoing Order: {dm.branch.ongoingOrder}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 text-gray">
              <button className="p-2">
                <Eye size={18} />
              </button>
              <button className="p-2">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DeliveryManTable;
