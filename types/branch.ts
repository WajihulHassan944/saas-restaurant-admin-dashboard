export type BranchProps = {
  id: number;
  name: string;
  isDefault: boolean;
  itemsCount?: number;
  openDialog?: (branchId: number) => void;      // Branch usage
  openMenuDetails?: (menuId: number) => void;  // Menu usage
};
