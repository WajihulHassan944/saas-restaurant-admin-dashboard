"use client";

import { Button } from "@/components/ui/button";

type EditBranchSectionHeaderProps = {
  title: string;
  description?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onReset?: () => void;
  showReset?: boolean;
};

export default function EditBranchSectionHeader({
  title,
  description,
  primaryActionLabel = "Save",
  onPrimaryAction,
  onReset,
  showReset = true,
}: EditBranchSectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      {/* Left */}
      <div>
        <h1 className="text-xl font-semibold text-dark">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {showReset && (
          <Button
            variant="outline"
            className="h-10 px-6 rounded-[12px] text-gray-600 border-[#BBBBBB]"
            onClick={onReset}
          >
            Reset
          </Button>
        )}

        <Button
          className="h-10 px-6 rounded-[12px] bg-primary hover:bg-red-800"
          onClick={onPrimaryAction}
        >
          {primaryActionLabel}
        </Button>
      </div>
    </div>
  );
}
