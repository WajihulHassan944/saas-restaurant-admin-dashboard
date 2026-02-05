"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { couponsData } from "@/constants/coupons";
import SortableHeader from "@/components/shared/sortable-head";
import EmptyState from "@/components/shared/EmptyState";
import PromotionCreateLink from "../PromotionOverview/PromotionCreateLink";
import Pagination from "@/components/pagination";
import { Eye, MoreHorizontal } from "lucide-react";

const CouponsTable = () => {
  const hasData = couponsData && couponsData.length > 0;

  /* ================= EMPTY ================= */
  if (!hasData) {
    return (
      <>
        <EmptyState
          title="Looks like there are no Coupons yet!"
          description="You haven’t added any Coupons yet. Start by creating a new"
        />
        <PromotionCreateLink label="Create New Coupon" href="/promotion-management/coupons/add" />
      </>
    );
  }

  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="w-[40px]">
                <Checkbox />
              </TableHead>

              <SortableHeader label="SL" />
              <SortableHeader label="Coupon Code" />
              <SortableHeader label="Coupon Info" />
              <SortableHeader label="Branch" />
              <SortableHeader label="Total Usage" />
              <SortableHeader label="Coupon Status" />

              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {couponsData.map((coupon, i) => (
              <TableRow key={i} className="border-none h-[72px]">
                {/* Checkbox */}
                <TableCell>
                  <Checkbox defaultChecked />
                </TableCell>

                {/* SL */}
                <TableCell className="px-4">{coupon.sl}</TableCell>

                {/* Coupon Code */}
                <TableCell className="px-4">
                  <p className="font-medium">{coupon.title}</p>
                  <p className="text-gray-500 text-sm">code: {coupon.code}</p>
                </TableCell>

                {/* Coupon Info */}
                <TableCell className="px-4">
                  <div className="text-sm text-gray-600 leading-5">
                    <p>Per User Limit: {coupon.perUserLimit}</p>
                    <p>Amount: {coupon.amount}</p>
                    <p>Discount Type: {coupon.discountType}</p>
                  </div>
                </TableCell>

                {/* Branch */}
                <TableCell className="text-sm text-gray-600 px-4">{coupon.branch}</TableCell>

                {/* Total Usage */}
                <TableCell className="text-sm text-gray-600 px-4">{coupon.totalUsage}</TableCell>

                {/* Status */}
                <TableCell className="px-4">
                  <Switch defaultChecked={coupon.status} />
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <button className="p-2 hover:text-black">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 hover:text-black">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden flex flex-col gap-4">
        {couponsData.map((coupon, i) => (
          <div key={i} className="bg-white rounded-[14px] shadow-sm p-4 border border-[#EDEFF2] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">{coupon.title}</p>
              <Checkbox defaultChecked />
            </div>

            <p className="text-gray-500 text-sm">Code: {coupon.code}</p>

            <div className="text-gray-600 text-sm space-y-1">
              <p>Per User Limit: {coupon.perUserLimit}</p>
              <p>Amount: {coupon.amount}</p>
              <p>Discount Type: {coupon.discountType}</p>
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="text-gray-600 text-sm">
                <p>Branch: {coupon.branch}</p>
                <p>Total Usage: {coupon.totalUsage}</p>
              </div>

              <div className="flex items-center gap-2">
                <Switch defaultChecked={coupon.status} />
                <button className="p-2 hover:text-black"><Eye size={18} /></button>
                <button className="p-2 hover:text-black"><MoreHorizontal size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="mt-6">
        <Pagination />
      </div>
    </>
  );
};

export default CouponsTable;
