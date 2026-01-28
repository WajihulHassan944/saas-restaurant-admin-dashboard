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
import SortableHead from "@/components/shared/sortable-head";

import { productData } from "@/constants/products";

export default function ProductsTable() {
  return (
    <div className="bg-white rounded-[14px] overflow-hidden p-2 lg:p-0">
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <SortableHead label="Product Name" />
            <SortableHead label="Product No#" />
            <SortableHead label="Restaurant Name" />
            <TableHead className="font-semibold text-dark text-base text-center">
              Status
            </TableHead>
            <SortableHead label="Price" />
            <SortableHead label="Unblock/Block" />
            <TableHead className="font-semibold text-dark text-base text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {productData.map((product, index) => (
            <TableRow
              key={index}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 h-[80px]"
            >
              <TableCell className="text-[#A3A3A3] text-base text-center">
                {product.name}
              </TableCell>

              <TableCell className="text-[#A3A3A3] text-base text-center">
                {product.no}
              </TableCell>

              <TableCell className="text-[#A3A3A3] text-base text-center">
                {product.restaurant}
              </TableCell>

              <TableCell className="text-center">
                <span
                  className={cn(
                    "font-semibold text-base",
                    product.status === "Active" ? "text-green" : "text-primary"
                  )}
                >
                  {product.status}
                </span>
              </TableCell>

              <TableCell className="text-green font-bold text-base text-center">
                {product.price}
              </TableCell>

              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Switch
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-[#E6E7EC]"
                    defaultChecked={product.blocked}
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

