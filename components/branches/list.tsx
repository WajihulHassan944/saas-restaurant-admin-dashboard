'use client';
import { useState } from "react";
import { branches } from "@/constants/branches";
import BranchCard from "../cards/BranchCard";
import EmptyState from "../shared/EmptyState";
import BranchDetailsModal from "./BranchDetails/BranchDetailsModal";

export default function BranchesList() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null); // Track selected branch

  const openDialog = (branchId: number) => {
    setSelectedBranchId(branchId); // Set selected branch ID
    setIsModalOpen(true); // Open modal
  };
  const closeDialog = () => setIsModalOpen(false); // Close modal

  if (!branches || branches.length === 0) {
    return (
      <EmptyState
        title="Looks like there are no branches yet!"
        description="You haven’t added any branches yet. Start by creating a new one."
      />
    );
  }

  return (
    <div className="space-y-3 min-h-[40vh]">
      {branches.map((branch) => (
        <BranchCard
          key={branch.id}
          id={branch.id}
          name={branch.name}
          isDefault={branch.isDefault}
          itemsCount={branch.itemsCount}
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
