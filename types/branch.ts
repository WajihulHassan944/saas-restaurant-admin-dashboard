export type BranchProps = {
  id: number;
  name: string;
  isDefault: boolean;
  itemsCount: number;
  openDialog: (branchId: number) => void; // Function to open dialog with branch ID
};
