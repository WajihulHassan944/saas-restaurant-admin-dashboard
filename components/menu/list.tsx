'use client';
import { useState } from "react";
import { menus } from "@/constants/menu";
import BranchCard from "../cards/BranchCard";
import EmptyState from "../shared/EmptyState";
import BranchDetailsModal from "./BranchDetails/BranchDetailsModal";

export default function MenuList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

  const openDialog = (branchId: number) => {
    setSelectedBranchId(branchId); // Set selected branch ID
    setIsModalOpen(true); // Open modal
  };
  const closeDialog = () => setIsModalOpen(false); // Close modal

  if (!menus || menus.length === 0) {
    return (
      <EmptyState
        
      />
    );
  }

  return (
    <div className="space-y-3 min-h-[40vh]">
      {menus.map((menu) => (
        <BranchCard
          key={menu.id}
          id={menu.id}
          name={menu.name}
          isDefault={menu.isDefault}
          itemsCount={menu.itemsCount}
          openDialog={openDialog} // Pass openDialog function to BranchCard
        />
      ))}

      {/* Branch Details Modal */}
      <BranchDetailsModal
        isOpen={isModalOpen}
        closeDialog={closeDialog}
        branchId={selectedBranchId} // Pass selected branch ID to modal
      />
    </div>
  );
}
