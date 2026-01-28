"use client";

import {
  Eye,
  Image as ImageIcon,
  MoreVertical,
  Store,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type Branch = {
  id: number;
  name: string;
  isDefault: boolean;
  itemsCount: number;
};

const branches: Branch[] = [
  {
    id: 10001,
    name: "Default Branch",
    isDefault: true,
    itemsCount: 1,
  },
];

export default function BranchesList() {
  return (
    <div className="space-y-3 min-h-[40vh]">
      {branches.map((branch) => (
        <div
          key={branch.id}
          className="
            flex items-center justify-between
            bg-white
            rounded-[14px]
            border border-gray-200
            px-4 py-4
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-4">
            {/* Checkbox (centered) */}
            <Checkbox
              defaultChecked
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />

            {/* Branch Icon (Lucide, centered) */}
            <div className="size-10 rounded-lg bg-[#F4F6FA] flex items-center justify-center">
              <Store size={20} className="text-gray-500" />
            </div>

            {/* Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-semibold text-dark">
                  {branch.name}
                </h4>

                {branch.isDefault && (
                  <>
                    <span className="size-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-[2px] rounded-full">
                      Default Branch
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-gray-400">
                ID: #{branch.id} | {branch.itemsCount} Items
              </p>
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center border border-gray-200 rounded-[10px] overflow-hidden">
            <ActionButton>
              <Eye size={18} />
            </ActionButton>

            <Divider />

            <ActionButton>
              <ImageIcon size={18} />
            </ActionButton>

            <Divider />

            <ActionButton>
              <MoreVertical size={18} />
            </ActionButton>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Helpers ---------- */

function ActionButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="
        h-[40px] w-[44px]
        flex items-center justify-center
        text-gray-500
        hover:bg-gray-50
      "
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-full bg-[#EDEFF2]" />;
}
