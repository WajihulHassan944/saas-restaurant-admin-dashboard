export interface BranchProps {
  id: string;
  name: string;
  isDefault?: boolean;
    isActive?: boolean;
  itemsCount?: number;
  openDialog?: (branchId: string) => void;
  openMenuDetails?: (branchId: string) => void;
   editMenu?: (id: string) => void;
    coverImage?: string
  logoUrl?: string
  availability?: {
  isActive?: boolean;
  isTemporarilyClosed?: boolean;
  isAvailable?: boolean;
  temporaryClosure?: {
    reason?: string;
    message?: string;
    closedAt?: string;
    isClosed?: boolean;
    closedUntil?: string;
  } | null;
};
}