"use client";

import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import { useAuthContext } from "@/context/AuthContext";

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
import SortableHeader from "@/components/shared/sortable-head";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Pagination from "@/components/pagination";
import EmptyState from "../shared/EmptyState";
import { toast } from "sonner";
import EmployeeInvitationModal from "./AddEmployeeModal";

const EmployeeTable = ({
  refreshFlag,
  onSuccess,
}: {
  refreshFlag?: boolean;
  onSuccess?: () => void;
}) => {
  const { token, user } = useAuthContext();
  const { get, patch, del } = useApi(token);

  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
const [openModal, setOpenModal] = useState(false);
const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  /* ---------- Fetch ---------- */
  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const res = await get(
        `/v1/staff-management`
      );

      if (res?.data) setEmployees(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchEmployees();
}, [token, refreshFlag]);

  /* ---------- Toggle Status ---------- */
  const toggleStatus = async (emp: any) => {
    try {
      await patch(`/v1/staff-management/${emp.id}`, {
        isActive: !emp.isActive,
      });

      toast.success("Status updated");
      fetchEmployees();
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ---------- Delete ---------- */
  const handleDelete = async (id: string) => {
    try {
      await del(`/v1/staff-management/${id}`);
      toast.success("Employee deleted");
      fetchEmployees();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------- Skeleton ---------- */
  if (loading) {
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead>SL</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i} className="border-none h-[70px]">
              {[...Array(8)].map((_, j) => (
                <TableCell key={j}>
                  <div className="h-7 w-full bg-gray-200 rounded animate-pulse" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

  if (!employees || employees.length === 0) {
    return (
      <EmptyState
        title="Looks like there are no Employee yet!"
        description="You haven’t added any employees yet."
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
              <SortableHeader label="Details" />
              <SortableHeader label="Role" />
              <SortableHeader label="Branch" />
              <SortableHeader label="Status" />
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employees.map((emp, i) => (
              <TableRow key={emp.id} className="border-none h-[70px]">
                <TableCell>
                  <Checkbox />
                </TableCell>

                <TableCell>{i + 1}</TableCell>

                <TableCell>
                  {emp.profile?.firstName} {emp.profile?.lastName}
                </TableCell>

                <TableCell>
                  <div>
                    <p>{emp.profile?.phone}</p>
                    <p className="text-gray">{emp.email}</p>
                  </div>
                </TableCell>

                <TableCell>{emp.staffRole?.name}</TableCell>

                <TableCell>{emp.branch?.name}</TableCell>

                <TableCell>
                  <Switch
                    checked={emp.isActive}
                    onCheckedChange={() => toggleStatus(emp)}
                  />
                </TableCell>

                <TableCell>
                  <div className="flex justify-center gap-2 text-gray">
                  <button
  className="p-2"
  onClick={() => {
    setSelectedEmployee(emp);
    setOpenModal(true);
  }}
>
  <Pencil size={18} />
</button>

                    <button
                      className="p-2 text-red-500"
                      onClick={() => handleDelete(emp.id)}
                    >
                      <Trash2 size={18} />
                    </button>

                    {/* <button className="p-2">
                      <MoreHorizontal size={18} />
                    </button> */}
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
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white rounded-[18px] p-4 shadow-sm border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Checkbox />
                <p className="font-medium">
                  {emp.profile?.firstName} {emp.profile?.lastName}
                </p>
              </div>

              <Switch
                checked={emp.isActive}
                onCheckedChange={() => toggleStatus(emp)}
              />
            </div>

            {/* Role */}
            <div className="text-sm text-gray mb-1">
              <p>Role: {emp.staffRole?.name}</p>
              <p>Branch: {emp.branch?.name}</p>
            </div>

            {/* Contact */}
            <div className="text-sm text-gray mb-2">
              <p>Phone: {emp.profile?.phone}</p>
              <p>Email: {emp.email}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 text-gray">
              <button className="p-2">
                <Eye size={18} />
              </button>

              <button
                className="p-2 text-red-500"
                onClick={() => handleDelete(emp.id)}
              >
                <Trash2 size={18} />
              </button>

              <button className="p-2">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        ))}

        <EmployeeInvitationModal
  open={openModal}
  onOpenChange={setOpenModal}
  initialData={selectedEmployee}
  onSuccess={onSuccess}
/>

      </div>
    </>
  );
};

export default EmployeeTable;