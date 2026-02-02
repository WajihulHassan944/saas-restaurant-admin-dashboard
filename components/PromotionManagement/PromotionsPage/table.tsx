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
import { promotionsData } from "@/constants/promotions";
import SortableHeader from "@/components/shared/sortable-head";
import EmptyState from "@/components/shared/EmptyState";
import PromotionCreateLink from "../PromotionOverview/PromotionCreateLink";
import Pagination from "@/components/pagination";
import { MoreHorizontal } from "lucide-react";

const PromotionsTable = () => {
  const hasData = promotionsData && promotionsData.length > 0;

  /* ================= EMPTY ================= */
  if (!hasData) {
    return (
      <>
        <EmptyState
          title="Looks like there are no Promotions yet!"
          description="You haven’t added any Promotions yet. Start by creating a new"
        />
        <PromotionCreateLink label="Create New Promotion" href="/promotion-management/promotions/add" />
      </>
    );
  }

  /* ================= TABLE ================= */
  return (
    <>
     <Table >
        <TableHeader>
          <TableRow className="border-none">
            <TableHead className="w-[40px]">
              <Checkbox />
            </TableHead>

            <SortableHeader label="SL" />
            <SortableHeader label="Name & Type" />
            <SortableHeader label="Items Info" />
            <SortableHeader label="Branch" />
            <SortableHeader label="Total Usage" />
            <SortableHeader label="Coupon Status" />
            <TableHead className="text-center font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {promotionsData.map((promo, i) => (
            <TableRow key={i} className="border-none h-[72px]">
              {/* Checkbox */}
              <TableCell>
                <Checkbox defaultChecked />
              </TableCell>

              {/* SL */}
              <TableCell className="px-4">{promo.sl}</TableCell>

              {/* Name & Type */}
              <TableCell className="px-4">
                <p className="font-medium text-sm">{promo.title}</p>
                <p className="text-gray-500 text-sm">
                  code : {promo.code}
                </p>
              </TableCell>

              {/* Items Info */}
              <TableCell className="px-4">
                <div className="text-sm text-gray-500 leading-5">
                  <p>Buy : {promo.buyItem}</p>
                  <p>Get : {promo.getItem}</p>
                </div>
              </TableCell>

              {/* Branch */}
              <TableCell className="px-4 text-sm text-gray-500">
                {promo.branch}
              </TableCell>

              {/* Total Usage */}
              <TableCell className="px-4 text-sm text-gray-500">
                {promo.totalUsage}
              </TableCell>

              {/* Status */}
              <TableCell className="px-4">
                <Switch defaultChecked={promo.status} />
              </TableCell>

              {/* Actions */}
              <TableCell >
                <div className="flex items-center justify-center">
                  <button className="p-2 text-gray-400 hover:text-black">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ================= PAGINATION ================= */}
      <div className="mt-6">
        <Pagination />
      </div>
    </>
  );
};

export default PromotionsTable;
