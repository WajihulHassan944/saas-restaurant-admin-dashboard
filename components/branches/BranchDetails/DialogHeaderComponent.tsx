import { DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function DialogHeaderComponent({ title, badgeText, branchId }: { title: string, badgeText: string, branchId: number }) {
  return (
    <DialogHeader className="space-y-2 text-center">
      <h2 className="text-xl font-semibold text-center mt-3">{title}</h2>
      <div className="flex justify-center">
        <Badge className=" bg-green-100 text-green-700">{badgeText}</Badge>
      </div>
      <p className="text-sm text-center text-muted-foreground">
        ID: #{branchId}
      </p>
         <p className="text-sm text-center text-muted-foreground">
              Created at Dec 11 2025, 01:08 PM
            </p>
    </DialogHeader>
  );
}
