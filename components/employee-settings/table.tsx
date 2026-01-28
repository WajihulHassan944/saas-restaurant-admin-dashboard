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

const CustomerTable = () => {
  if (!employeesData || employeesData.length === 0) {
    return <EmptyState
  title="Looks like there are no Employee yet!"
  description="You haven’t added any employees yet. Start by creating a new one."
/>
;
  }

  return (
    <>
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
          {employeesData.map((customer, i) => (
            <TableRow key={i} className="border-none h-[70px]">
              <TableCell>
                <Checkbox defaultChecked />
              </TableCell>

              <TableCell className="px-4">{customer.sl}</TableCell>

              <TableCell className="px-4">{customer.employeeName}</TableCell>

              <TableCell className="px-4">
                <div>
                  <p>{customer.phone}</p>
                  <p className="text-gray">{customer.email}</p>
                </div>
              </TableCell>

              <TableCell className="px-4">{customer.role}</TableCell>

              <TableCell className="px-4">
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

              <TableCell className="px-4">
                <Switch defaultChecked={customer.status} />
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
    </>
  );
};

export default CustomerTable;
