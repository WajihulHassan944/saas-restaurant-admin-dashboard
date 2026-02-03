import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  Image as ImageIcon,
  MoreVertical,
  Store,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BranchProps } from "@/types/branch";
import ActionDropdown from "../shared/ActionDropdown";

export default function BranchCard({
  id,
  name,
  isDefault,
  itemsCount,
  openDialog,
  openMenuDetails
}: BranchProps) {
  /* ---------- Dynamic Icon Logic ---------- */

  const iconMap = [
    { key: "menu", icon: List },
    { key: "branch", icon: Store },
  ];

  const Icon =
    iconMap.find(({ key }) =>
      name?.toLowerCase().includes(key)
    )?.icon || Store;


  return (
    <div
      key={id}
      className="flex items-center justify-between bg-white rounded-[14px] border border-gray-200 px-4 py-4"
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <Checkbox
          defaultChecked
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />

        {/* Dynamic Icon */}
        <div className="size-10 rounded-lg bg-[#F4F6FA] flex items-center justify-center">
          <Icon size={20} className="text-gray-500" />
        </div>

        {/* Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-dark">{name}</h4>

            {isDefault && (
              <>
                <span className="size-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-[2px] rounded-full">
                  {name}
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-gray-400">
            ID: #{id} | {itemsCount} Items
          </p>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center border border-gray-200 rounded-[10px] overflow-hidden h-full">
      {openDialog && (
  <>
    <ActionButton onClick={() => openDialog(id)}>
      <Eye size={18} />
    </ActionButton>

    <Divider />
  </>
)}
{openMenuDetails && (
  <>
    <ActionButton onClick={() => openMenuDetails(id)}>
     <Eye size={18} />
    </ActionButton>

    <Divider />
  </>
)}

        <Divider />

        <ActionButton>
          <ImageIcon size={18} />
        </ActionButton>

        <Divider />

     <ActionDropdown
  items={[
    openDialog
      ? {
          label: "Edit Branch",
          href: `/branches/edit`,
          icon: <Store size={16} className="text-gray-500" />,
        }
      : {
          label: "Edit Menu",
          href: `/menu`,
          icon: <List size={16} className="text-gray-500" />,
        },
  ]}
/>


      </div>
    </div>
  );
}


function ActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="ghost"
      className="h-[40px] w-[44px] flex items-center justify-center text-gray-500 hover:bg-gray-50"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function Divider() {
  return <div className="w-[1px] h-[38px] bg-gray-200" />;
}
