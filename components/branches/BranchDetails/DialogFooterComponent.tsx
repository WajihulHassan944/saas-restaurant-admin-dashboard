import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DialogFooterComponent({ closeDialog }: { closeDialog: () => void }) {
  return (
    <DialogFooter className="px-6 pb-6 flex gap-2 mt-5 mb-4">
      <Button variant="outline" className="w-auto flex-1" onClick={closeDialog}>
        Close
      </Button>
      <Button className="w-auto flex-1 bg-primary text-white">Edit Details</Button>
    </DialogFooter>
  );
}
