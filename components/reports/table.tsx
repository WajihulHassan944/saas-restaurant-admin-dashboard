import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ordersReport } from "@/constants/analytics";
import SortableHeader from "@/components/shared/sortable-head";
import { Eye, MoreHorizontal } from "lucide-react";
import Pagination from "@/components/pagination";
import EmptyState from "../shared/EmptyState";

const OrdersTable = () => {
  if (!ordersReport || ordersReport.length === 0) {
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
 <TableHead className="w-[50px] font-semibold">SL</TableHead>

            <SortableHeader label="Order ID" />
            <SortableHeader label="Total Order Amount" />
            <SortableHeader label="Total Discount Amount" />
            <SortableHeader label="Total Tax Amount" />
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {ordersReport.map((order, i) => (
            <TableRow key={i} className="border-none h-[70px]">
             
              {/* Checkbox */}
              <TableCell>
                <Checkbox checked />
              </TableCell>

 <TableCell className="px-4 text-gray-500">{i + 1}</TableCell>

              {/* Order ID */}
              <TableCell className="px-4 text-gray-500">
                {order.id}
              </TableCell>

              {/* Total Order Amount */}
              <TableCell className="px-4 font-medium text-green-600">
                {order.orderAmount}
              </TableCell>

              {/* Total Discount Amount */}
              <TableCell className="px-4 text-gray-500">
                {order.discountAmount}
              </TableCell>

              {/* Total Tax Amount */}
              <TableCell className="px-4 text-gray-500">
                {order.taxAmount}
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
