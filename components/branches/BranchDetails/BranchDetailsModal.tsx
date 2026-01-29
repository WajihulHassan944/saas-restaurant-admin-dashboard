import { Dialog, DialogContent } from "@/components/ui/dialog";
import DialogHeaderComponent from "./DialogHeaderComponent"; 
import BranchInfoCard from "./BranchInfoCard";
import OrderTypesCard from "./OrderTypesCard";
import DialogFooterComponent from "./DialogFooterComponent";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Store } from "lucide-react";

export default function BranchDetailsModal({
  isOpen,
  closeDialog,
  branchId,
}: {
  isOpen: boolean;
  closeDialog: () => void;
  branchId: number | null;
}) {
  const branchInfo = [
    { label: "Contact Person", value: "N/A" },
    { label: "Designation", value: "N/A" },
    { label: "Phone Number", value: "N/A" },
    { label: "Email", value: "N/A" }
  ];

  const supportInfo = [
    { label: "Number Type", value: "N/A" },
    { label: "Designation", value: "N/A" },
    { label: "Phone Number", value: "N/A" }
  ];

  const addressInfo = [
    { label: "Address", value: "N/A" },
    { label: "State", value: "N/A" },
    { label: "Zipcode", value: "N/A" },
    { label: "Country", value: "N/A" },
    { label: "City", value: "N/A" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-[18px] max-h-[95vh] overflow-auto">
        {/* TOP GREY HEADER */}
        <div className="relative bg-[#D8D8D8] h-36 rounded-t-lg flex justify-center items-end">
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white px-3 py-2 rounded-[10px] shadow">
            <span className="text-sm font-medium">Availability</span>
            <Switch defaultChecked />
          </div>

          {/* ICON */}
          <div className="bg-white p-7 rounded-full -mb-12">
            <Store className="w-11 h-11 text-muted-foreground" />
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-6 pt-10 pb-6 space-y-5">
          <DialogHeaderComponent title="Branch Details" badgeText="Default Branch" branchId={branchId!} />

          {/* Branch Contact Info Card */}
          <BranchInfoCard title="Branch Contact Info" info={branchInfo} />

          {/* Support Contact Info Card */}
          <BranchInfoCard title="Support Contact Info" info={supportInfo} />

          {/* Available Order Types Card */}
          <OrderTypesCard />

          {/* Branch Address Info Card */}
          <BranchInfoCard title="Branch Address Info" info={addressInfo} />

          {/* Map Image */}
          <Card className="p-4 bg-[#F5F5F5] rounded-lg border-none">
            <h3 className="text-sm font-semibold text-center text-black">Branch Location</h3>
            <div className="rounded-lg max-w-full max-h-[150px] overflow-hidden">
              <img src="/map.png" />
            </div>
          </Card>
        </div>

        <DialogFooterComponent closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
}
