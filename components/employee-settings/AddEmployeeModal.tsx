"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EmployeeInvitationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EmployeeInvitationModal({
  open,
  onOpenChange,
}: EmployeeInvitationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[20px] p-8">
        {/* Header */}
        <DialogHeader className="text-center space-y-1">
          <DialogTitle className="text-xl font-semibold text-dark text-center">
            Employee Invitation
          </DialogTitle>
        <center>  <DialogDescription className="text-sm text-gray-500 max-w-[80%] text-left">
            Send an invitation to your employee to complete their profile &
            join the team
          </DialogDescription></center>
        </DialogHeader>

        {/* Form */}
        <div className="mt-6 space-y-4">
          <FormField label="Email *" placeholder="eg. john doe" />
          <FormField label="Role *" placeholder="eg. john doe" />
          <FormField label="Branch *" placeholder="eg. john doe" />
        </div>

        {/* CTA */}
        <Button
          className="mt-6 w-full h-[48px] rounded-[14px] bg-primary text-white hover:bg-red-600"
        >
          Send Invitation
        </Button>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Small Helper ---------- */
function FormField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-dark">
        {label}
      </label>
      <Input
        placeholder={placeholder}
        className="h-[44px] rounded-[10px] border-[#BBBBBB] text-sm"
      />
    </div>
  );
}
