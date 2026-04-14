"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle, Trash2, Link2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import useApi from "@/hooks/useApi";

type VariationForm = {
  name: string;
  price: string;
  sku: string;
  sortOrder: number;
  isDefault: boolean;
  isActive: boolean;
};

type Props = {
  form: any;
  setForm: (value: any) => void;
  item?: any;
  menuItemId?: string;
};

const getInitialVariationForm = (): VariationForm => ({
  name: "",
  price: "",
  sku: "",
  sortOrder: 0,
  isDefault: false,
  isActive: true,
});

export default function StepThree({
  form,
  setForm,
  item,
  menuItemId,
}: Props) {
  const { token, user } = useAuth();
  const api = useApi(token);
console.log("item is", item);
  const resolvedItemId = menuItemId || item?.id || form?.id;

  const [variationForm, setVariationForm] = useState<VariationForm>(
    getInitialVariationForm()
  );
  const [addingVariation, setAddingVariation] = useState(false);

  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [modifierSortOrder, setModifierSortOrder] = useState(0);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [addingModifier, setAddingModifier] = useState(false);

  const [localVariations, setLocalVariations] = useState<any[]>([]);
  const [localModifierGroups, setLocalModifierGroups] = useState<any[]>([]);

  const attachedModifierIds = useMemo(() => {
    return new Set(
      (localModifierGroups || []).map((g: any) => String(g.id))
    );
  }, [localModifierGroups]);
useEffect(() => {
  const initialVariations =
    item?.variations ||
    item?.menuVariations ||
    item?.sizes ||
    [];

  const initialModifierGroups =
    item?.modifierGroups ||
    item?.attachedModifierGroups ||
    item?.modifier_groups ||
    item?.modifierLinks?.map((link: any) => ({
      ...(link?.modifierGroup || {}),
      linkId: link?.id,
      modifierGroupId: link?.modifierGroupId,
      sortOrder: link?.sortOrder ?? link?.modifierGroup?.sortOrder ?? 0,
      menuItemId: link?.menuItemId,
      isAttached: true,
    })) ||
    [];

  setLocalVariations(Array.isArray(initialVariations) ? initialVariations : []);
  setLocalModifierGroups(
    Array.isArray(initialModifierGroups) ? initialModifierGroups : []
  );
}, [item]);

  useEffect(() => {
    if (!user?.restaurantId || !token) return;
    fetchGroups();
  }, [user?.restaurantId, token]);

  const fetchGroups = async () => {
    if (!user?.restaurantId) return;

    setLoadingGroups(true);

    const res = await api.get(
      `/v1/menu/modifier-groups?restaurantId=${user.restaurantId}`
    );

    setLoadingGroups(false);

    if (!res) {
      toast.error("Failed to load modifier groups");
      return;
    }

    if (res.error) {
      toast.error(res.error || "Failed to load modifier groups");
      return;
    }

    const groupList = Array.isArray(res?.data) ? res.data : [];
    setGroups(groupList);
  };

  const handleVariationChange = (
    key: keyof VariationForm,
    value: string | number | boolean
  ) => {
    setVariationForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetVariationForm = () => {
    setVariationForm(getInitialVariationForm());
  };

  const handleAddVariation = async () => {
    if (!resolvedItemId) {
      toast.error("Please save the menu item first");
      return;
    }

    if (!variationForm.name.trim()) {
      toast.error("Variation name is required");
      return;
    }

    if (variationForm.price === "" || Number(variationForm.price) < 0) {
      toast.error("Valid variation price is required");
      return;
    }

    setAddingVariation(true);

    const payload = {
      menuItemId: resolvedItemId,
      name: variationForm.name.trim(),
      price: Number(variationForm.price),
      sku: variationForm.sku?.trim() || "",
      sortOrder: Number(variationForm.sortOrder || 0),
      isDefault: variationForm.isDefault,
      isActive: variationForm.isActive,
    };

    const res = await api.post("/v1/menu/variations", payload);

    setAddingVariation(false);

    if (!res) {
      toast.error("Something went wrong while adding variation");
      return;
    }

    if (res.error) {
      toast.error(res.error || "Failed to add variation");
      return;
    }

    const createdVariation =
      res?.data?.data ||
      res?.data ||
      payload;

    setLocalVariations((prev) => [createdVariation, ...prev]);

    setForm((prev: any) => ({
      ...prev,
      sizes: [createdVariation, ...(prev?.sizes || [])],
    }));

    toast.success("Variation added successfully");
    resetVariationForm();
  };

  const handleAttachModifierGroup = async () => {
    if (!resolvedItemId) {
      toast.error("Please save the menu item first");
      return;
    }

    if (!selectedGroup) {
      toast.error("Please select a modifier group");
      return;
    }

    if (attachedModifierIds.has(String(selectedGroup))) {
      toast.error("This modifier group is already attached");
      return;
    }

    setAddingModifier(true);

    const res = await api.post(
      `/v1/menu/items/${resolvedItemId}/modifier-groups/${selectedGroup}`,
      {
        sortOrder: Number(modifierSortOrder || 0),
      }
    );

    setAddingModifier(false);

    if (!res) {
      toast.error("Something went wrong while attaching modifier group");
      return;
    }

    if (res.error) {
      toast.error(res.error || "Failed to attach modifier group");
      return;
    }

    const selectedGroupData = groups.find(
      (g) => String(g.id) === String(selectedGroup)
    );

    if (selectedGroupData) {
      setLocalModifierGroups((prev) => [
        {
          ...selectedGroupData,
          sortOrder: Number(modifierSortOrder || 0),
        },
        ...prev,
      ]);

      setForm((prev: any) => ({
        ...prev,
        addons: [
          {
            ...selectedGroupData,
            sortOrder: Number(modifierSortOrder || 0),
          },
          ...(prev?.addons || []),
        ],
      }));
    }

    toast.success("Modifier group attached successfully");
    setSelectedGroup("");
    setModifierSortOrder(0);
  };

  const handleRemoveLocalVariation = (index: number) => {
    setLocalVariations((prev) => prev.filter((_, i) => i !== index));
    setForm((prev: any) => ({
      ...prev,
      sizes: (prev?.sizes || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const handleRemoveLocalModifier = (groupId: string | number) => {
    setLocalModifierGroups((prev) =>
      prev.filter((g) => String(g.id) !== String(groupId))
    );

    setForm((prev: any) => ({
      ...prev,
      addons: (prev?.addons || []).filter(
        (g: any) => String(g.id) !== String(groupId)
      ),
    }));
  };

  const availableGroups = useMemo(() => {
    return groups.filter(
      (g) => !attachedModifierIds.has(String(g.id))
    );
  }, [groups, attachedModifierIds]);

  return (
    <div className="mt-4 space-y-6">
      {!resolvedItemId && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Save the menu item in Step 2 first. After that, you can add variations
          and modifier groups here.
        </div>
      )}

      {/* ================= VARIATIONS ================= */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Add Variations
            </h3>
            <p className="text-sm text-gray-500">
              Create item-level pricing options like Small, Medium, Large.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Variation Name</Label>
            <Input
              placeholder="e.g. Small, Medium, Large"
              value={variationForm.name}
              onChange={(e) =>
                handleVariationChange("name", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              type="number"
              placeholder="Enter price"
              value={variationForm.price}
              onChange={(e) =>
                handleVariationChange("price", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>SKU (Optional)</Label>
            <Input
              placeholder="Unique SKU"
              value={variationForm.sku}
              onChange={(e) =>
                handleVariationChange("sku", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Input
              type="number"
              placeholder="0"
              value={String(variationForm.sortOrder)}
              onChange={(e) =>
                handleVariationChange("sortOrder", Number(e.target.value))
              }
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-gray-600">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={variationForm.isDefault}
              onChange={(e) =>
                handleVariationChange("isDefault", e.target.checked)
              }
              className="accent-primary"
            />
            Default
          </label>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={variationForm.isActive}
              onChange={(e) =>
                handleVariationChange("isActive", e.target.checked)
              }
              className="accent-primary"
            />
            Active
          </label>
        </div>

        <div className="mt-5">
          <Button
            type="button"
            onClick={handleAddVariation}
            disabled={addingVariation || !resolvedItemId}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 text-white hover:bg-primary/90"
          >
            {addingVariation ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Variation...
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                Add Variation
              </>
            )}
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          {localVariations.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-gray-500">
              No variations added yet.
            </div>
          ) : (
            localVariations.map((variation, index) => (
              <div
                key={variation?.id || `${variation?.name}-${index}`}
                className="flex items-center justify-between rounded-xl border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">
                    {variation?.name || "-"}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Price: {variation?.price ?? 0}</span>
                    {variation?.sku ? <span>SKU: {variation.sku}</span> : null}
                    <span>Sort: {variation?.sortOrder ?? 0}</span>
                    {variation?.isDefault ? <span>Default</span> : null}
                    {variation?.isActive === false ? <span>Inactive</span> : null}
                  </div>
                </div>

                {!variation?.id ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLocalVariation(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= MODIFIER GROUPS ================= */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Add Modifiers
            </h3>
            <p className="text-sm text-gray-500">
              Attach modifier groups like Extras, Sauces, Toppings, Add-ons.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Modifier Group</Label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              disabled={loadingGroups || !resolvedItemId}
              className="h-[40px] w-full rounded-[10px] border border-gray-300 bg-white px-3 outline-none focus:border-gray-400"
            >
              <option value="">
                {loadingGroups ? "Loading groups..." : "Select Group"}
              </option>

              {availableGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Input
              type="number"
              value={String(modifierSortOrder)}
              onChange={(e) => setModifierSortOrder(Number(e.target.value))}
              disabled={!resolvedItemId}
            />
          </div>
        </div>

        <div className="mt-5">
          <Button
            type="button"
            onClick={handleAttachModifierGroup}
            disabled={
              addingModifier || loadingGroups || !resolvedItemId || !selectedGroup
            }
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 text-white hover:bg-primary/90"
          >
            {addingModifier ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding Modifier...
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" />
                Add Modifier Group
              </>
            )}
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          {localModifierGroups.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-gray-500">
              No modifier groups attached yet.
            </div>
          ) : (
            localModifierGroups.map((group) => (
              <div
                key={group?.id}
                className="flex items-center justify-between rounded-xl border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">
                    {group?.name || "-"}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Sort: {group?.sortOrder ?? 0}</span>
                    {group?.isActive === false ? <span>Inactive</span> : null}
                  </div>
                </div>

                {/* {!group?.pivot?.id ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLocalModifier(group.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null} */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}