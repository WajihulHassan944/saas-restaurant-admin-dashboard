export interface BranchProps {
  id: string;
  name: string;
  isDefault?: boolean;
    isActive?: boolean;
  itemsCount?: number;
  openDialog?: (branchId: string) => void;
  openMenuDetails?: (branchId: string) => void;
   editMenu?: (id: string) => void;
}