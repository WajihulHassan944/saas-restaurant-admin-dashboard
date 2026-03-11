"use client";

import BranchFilters from "./BranchFilters";
import Table from "./list";
import BranchesPagination from "./BranchesPagination";

interface Props {
  branches: any[];
  meta: any;
  loading: boolean;
  fetchBranches?: () => void; // optional, if needed for refresh inside
}

export default function BranchesClient({
  branches,
  meta,
  loading,
  fetchBranches,
}: Props) {
  return (
    <>
      <BranchFilters branches={branches} />

      <div className="px-2 lg:px-0">
        <Table branches={branches} loading={loading} />
        <BranchesPagination meta={meta} />
      </div>
    </>
  );
}