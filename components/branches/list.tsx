"use client";

import { useState } from "react";
import BranchCard from "../cards/BranchCard";
import EmptyState from "../shared/EmptyState";
import BranchDetailsModal from "./BranchDetails/BranchDetailsModal";

interface Props {
  branches?: any[];
  loading?: boolean;
}

export default function BranchesList({ branches = [], loading }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
 const [selectedBranch, setSelectedBranch] = useState<any | null>(null);

const openDialog = (branchId: string) => {
  const branch = branches.find((b) => b.id === branchId);
  setSelectedBranch(branch || null);
  setIsModalOpen(true);
};

  const closeDialog = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-gray-400">
        Loading branches...
      </div>
    );
  }

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
          isActive={branch.isActive}
          
          isDefault={branch.isMain}
          itemsCount={0} 
          openDialog={openDialog}
        />
      ))}

     <BranchDetailsModal
  isOpen={isModalOpen}
  closeDialog={closeDialog}
  branch={selectedBranch}
/>
    </div>
  );
}