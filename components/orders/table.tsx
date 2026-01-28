import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { orders } from "@/constants/orders";
import SortableHeader from "@/components/shared/sortable-head";
import { Eye, MoreHorizontal } from "lucide-react";
import Pagination from "@/components/pagination";
import EmptyState from "../shared/EmptyState";

const OrdersTable = () => {
  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        title="Looks like there are no orders yet!"
        description="You haven’t received any orders yet."
      />
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>

            <SortableHeader label="Order ID" />
            <SortableHeader label="Date" />
            <SortableHeader label="Customer Name" />
            <SortableHeader label="Location" />
            <SortableHeader label="Amount" />
            <SortableHeader label="Status" />

            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order, i) => (
            <TableRow key={i} className="border-none h-[70px]">
              {/* Checkbox */}
              <TableCell>
                <Checkbox />
              </TableCell>

              {/* Order ID */}
              <TableCell className="px-4 text-gray-500">
                {order.id}
              </TableCell>

              {/* Date */}
              <TableCell className="px-4 text-gray-500">
                {order.date}
              </TableCell>

              {/* Customer */}
              <TableCell className="px-4 text-gray-600">
                {order.customer}
              </TableCell>

              {/* Location */}
              <TableCell className="px-4 text-gray-500">
                {order.location}
              </TableCell>

              {/* Amount */}
              <TableCell className="px-4 font-medium text-green-600">
                {order.amount}
              </TableCell>

              {/* Status */}
              <TableCell className="px-4">
                <span
                  className={`text-sm font-medium ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Cancelled" ||
                        order.status === "Refunded"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </TableCell>

              {/* Actions */}
              <TableCell className="px-4">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <button className="p-2 hover:text-primary">
                    <Eye size={18} />
                  </button>
                  <button className="p-2 hover:text-primary">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination />
    </>
  );
};

export default OrdersTable;
