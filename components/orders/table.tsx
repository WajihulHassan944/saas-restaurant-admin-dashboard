
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Eye, MoreHorizontal } from "lucide-react";
import Pagination from "@/components/pagination";
import EmptyState from "../shared/EmptyState";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import SortableHeader from "../shared/sortable-head";

interface Order {
  id: string;
  orderType?: string;
  status?: string;
  totalAmount?: number;
  createdAt?: string;
}

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
}

const OrdersTable = ({ orders, loading }: OrdersTableProps) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className="text-sm text-gray-400 py-10 text-center">
        Loading orders...
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        title="Looks like there are no orders yet!"
        description="You haven’t received any orders yet."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* -------- Mobile Cards -------- */}
      <div className="lg:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded-lg shadow-sm border"
          >
            <div className="flex justify-between items-center">
              <div className="text-gray-500 font-medium">{order.id}</div>

              <div
                className={`text-sm font-medium ${
                  order.status === "DELIVERED"
                    ? "text-green-600"
                    : order.status === "CANCELLED" ||
                      order.status === "REFUNDED"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {order.status}
              </div>
            </div>

            <div className="mt-2 flex justify-between">
              <div className="text-gray-600">{order.orderType}</div>
              <div className="text-gray-500">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "-"}
              </div>
            </div>

            <div className="mt-2 flex justify-between">
              <div className="text-gray-500">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleTimeString()
                  : "-"}
              </div>
              <div className="font-medium text-green-600">
                ${order.totalAmount ?? 0}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2 text-gray-500">
              <button
                className="p-2 hover:text-primary"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <Eye size={18} />
              </button>

              <button className="p-2 hover:text-primary">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* -------- Desktop Table -------- */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="w-[50px]">
                <Checkbox />
              </TableHead>

              <SortableHeader label="Order ID" />
              <SortableHeader label="Date" />
              <SortableHeader label="Order Type" />
              <SortableHeader label="Amount" />
              <SortableHeader label="Status" />

              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="border-none h-[70px]">
                <TableCell>
                  <Checkbox />
                </TableCell>

                <TableCell className="px-4 text-gray-500">
                  {order.id}
                </TableCell>

                <TableCell className="px-4 text-gray-500">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>

                <TableCell className="px-4 text-gray-600">
                  {order.orderType ?? "-"}
                </TableCell>

                <TableCell className="px-4 font-medium text-green-600">
                  ${order.totalAmount ?? 0}
                </TableCell>

                <TableCell className="px-4">
                  <span
                    className={`text-sm font-medium ${
                      order.status === "DELIVERED"
                        ? "text-green-600"
                        : order.status === "CANCELLED" ||
                          order.status === "REFUNDED"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>

                <TableCell className="px-4">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <button
                      className="p-2 hover:text-primary"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
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
      </div>

      <Pagination />
    </div>
  );
};

export default OrdersTable;
