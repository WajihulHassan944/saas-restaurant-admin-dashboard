import { Button } from "@/components/ui/button";

type TabButtonProps = {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

export default function TabButton({ active, children, onClick }: TabButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={active ? "default" : "ghost"}
      className={
        active
          ? "rounded-[14px] px-4 py-2.5 bg-primary hover:bg-primary text-white text-sm font-medium w-fit"
          : "rounded-full px-4 py-2 text-gray-500 text-sm font-medium hover:text-black hover:bg-transparent w-fit"
      }
    >
      {children}
    </Button>
  );
}
