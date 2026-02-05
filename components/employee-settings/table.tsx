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
import { employeesData } from "@/constants/employee-settings";
import SortableHeader from "@/components/shared/sortable-head";
import { Eye, MoreHorizontal } from "lucide-react";
import Pagination from "@/components/pagination";
import EmptyState from "../shared/EmptyState";

const EmployeeTable = () => {
  if (!employeesData || employeesData.length === 0) {
    return (
      <EmptyState
        title="Looks like there are no Employee yet!"
        description="You haven’t added any employees yet. Start by creating a new one."
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
              <SortableHeader label="Employee" />
              <SortableHeader label="Employee Details" />
              <SortableHeader label="Role" />
              <SortableHeader label="Branch" />
              <SortableHeader label="Status" />
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employeesData.map((emp, i) => (
              <TableRow key={i} className="border-none h-[70px]">
                <TableCell>
                  <Checkbox defaultChecked />
                </TableCell>

                <TableCell className="px-4">{emp.sl}</TableCell>

                <TableCell className="px-4">{emp.employeeName}</TableCell>

                <TableCell className="px-4">
                  <div>
                    <p>{emp.phone}</p>
                    <p className="text-gray">{emp.email}</p>
                  </div>
                </TableCell>

                <TableCell className="px-4">{emp.role}</TableCell>

                <TableCell className="px-4">
                  <div className="flex items-start gap-2 text-xs">
                    <div>
                      <p>{emp.branch.currentlyAssign}</p>
                      <p>{emp.branch.outForDelivery}</p>
                      <p>{emp.branch.ongoingOrder}</p>
                    </div>
                    <div className="text-gray">
                      <p>Currently Assign</p>
                      <p>Out for Delivery</p>
                      <p>Ongoing Order</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4">
                  <Switch defaultChecked={emp.status} />
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
        {employeesData.map((emp, i) => (
          <div
            key={i}
            className="bg-white rounded-[18px] p-4 shadow-sm border border-gray-200"
          >
            {/* Header: Name + Checkbox + Status */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Checkbox defaultChecked />
                <p className="font-medium">{emp.employeeName}</p>
              </div>
              <Switch defaultChecked={emp.status} />
            </div>

            {/* SL & Role */}
            <div className="text-sm text-gray mb-1">
              <p>SL: {emp.sl}</p>
              <p>Role: {emp.role}</p>
            </div>

            {/* Contact Info */}
            <div className="text-sm text-gray mb-2">
              <p>Phone: {emp.phone}</p>
              <p>Email: {emp.email}</p>
            </div>

            {/* Branch Info */}
            <div className="text-xs text-gray mb-2">
              <p>Branch:</p>
              <p>Currently Assign: {emp.branch.currentlyAssign}</p>
              <p>Out for Delivery: {emp.branch.outForDelivery}</p>
              <p>Ongoing Order: {emp.branch.ongoingOrder}</p>
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

export default EmployeeTable;
