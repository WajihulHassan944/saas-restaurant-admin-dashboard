import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

export default function StepThree({ form, setForm }: any) {
  const addAddon = () => {
    setForm({
      ...form,
      addons: [...form.addons, { name: "", price: "", max: 1 }],
    });
  };

  const updateAddon = (index: number, field: string, value: any) => {
    const updated = [...form.addons];
    updated[index][field] = value;

    setForm({ ...form, addons: updated });
  };

  return (
    <div className="mt-4 space-y-4">
      {form.addons?.map((addon: any, index: number) => (
        <div key={index} className="space-y-2">
          <Label>Add On Name</Label>

          <Input
            value={addon.name}
            onChange={(e) =>
              updateAddon(index, "name", e.target.value)
            }
          />

          <Label>Max Quantity</Label>

          <Input
            type="number"
            value={addon.max}
            onChange={(e) =>
              updateAddon(index, "max", e.target.value)
            }
          />

          <Label>Price</Label>

          <Input
            type="number"
            value={addon.price}
            onChange={(e) =>
              updateAddon(index, "price", e.target.value)
            }
          />
        </div>
      ))}

      <div className="mt-4 text-center">
        <Button
          type="button"
          variant="link"
          onClick={addAddon}
          className="inline-flex items-center gap-2 text-primary"
        >
          <PlusCircle className="w-4 h-4" />
          Add Another Add On
        </Button>
      </div>
    </div>
  );
}