"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import useApi from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { FaPen, FaTrash } from "react-icons/fa";
import ModifierGroupModal from "./ModifierGroupModal";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function ModifierGroupsTable() {
  const { token, user } = useAuth();
  const api = useApi(token);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
const [deleteId, setDeleteId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const restaurantId = user?.restaurantId;

  const fetchData = async () => {
    if (!restaurantId) return;

    setLoading(true);
    const res = await api.get(
      `/v1/menu/modifier-groups?restaurantId=${restaurantId}`
    );

    if (!res?.error) {
      setData(res.data || res || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [restaurantId]);

const handleDelete = async () => {
  if (!deleteId) return;

  const res = await api.del(`/v1/menu/modifier-groups/${deleteId}`);

  if (res?.error) {
    toast.error(res.error);
    return;
  }

  toast.success("Deleted successfully");
  setDeleteId(null);
  fetchData();
};

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-semibold text-gray-900">
          Modifier Groups
        </h2>

        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="bg-primary text-white rounded-[12px] h-[40px] px-4"
        >
          + Add Modifier Group
        </Button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-3">Name</th>
              <th>Description</th>
              <th className="text-center">Min</th>
              <th className="text-center">Max</th>
              <th className="text-center">Required</th>
              <th className="text-center">Sort</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  No modifier groups found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-4 font-medium text-gray-900">
                    {item.name}
                  </td>

                  <td className="text-gray-500 max-w-[220px] truncate">
                    {item.description || "-"}
                  </td>

                  <td className="text-center">{item.minSelect}</td>
                  <td className="text-center">{item.maxSelect}</td>

                  <td className="text-center">
                    {item.isRequired ? (
                      <span className="text-green-600 font-medium">
                        Yes
                      </span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>

                  <td className="text-center">{item.sortOrder}</td>

                  <td className="text-center">
                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => {
                          setSelected(item);
                          setOpen(true);
                        }}
                        className="text-gray-500 hover:text-primary"
                      >
                        <FaPen size={14} />
                      </button>

                   <button
  onClick={() => setDeleteId(item.id)}
  className="text-gray-500 hover:text-red-500"
>
  <FaTrash size={14} />
</button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      <ModifierGroupModal
        open={open}
        onOpenChange={setOpen}
        initialData={selected}
        refresh={fetchData}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Modifier Group?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete the modifier group.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-600"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  );
}