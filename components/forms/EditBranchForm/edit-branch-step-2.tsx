"use client";

import Section from "../Promotions/Section";
import FormInput from "@/components/register/form/FormInput";
import { Checkbox } from "@/components/ui/checkbox";

const ORDER_TYPES = ["DELIVERY", "TAKEAWAY", "DINE_IN"];
const PAYMENT_METHODS = ["COD", "STRIPE", "EASYPAISA", "JAZZCASH", "BANK_TRANSFER"];

export default function EditBranchStepTwo({ data, setData }: any) {
  if (!data) return null;

  const settings = data.settings || {};
  const delivery = settings.deliveryConfig || {};

  const update = (path: string[], value: any) => {
    const newData = { ...data };
    let obj = newData;

    for (let i = 0; i < path.length - 1; i++) {
      obj[path[i]] = obj[path[i]] || {};
      obj = obj[path[i]];
    }

    obj[path[path.length - 1]] = value;
    setData(newData);
  };

  const toggleArrayValue = (key: string, value: string) => {
    const current = settings[key] || [];

    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];

    update(["settings", key], updated);
  };

  return (
    <div className="rounded-[14px] mt-10 space-y-8">

      {/* ================= ORDER TYPES ================= */}
      <Section label="Allowed Order Types">
        <div className="flex gap-4 flex-wrap">
          {ORDER_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2">
              <Checkbox
                checked={settings.allowedOrderTypes?.includes(type)}
                onCheckedChange={() =>
                  toggleArrayValue("allowedOrderTypes", type)
                }
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* ================= PAYMENT METHODS ================= */}
      <Section label="Allowed Payment Methods">
        <div className="flex gap-4 flex-wrap">
          {PAYMENT_METHODS.map((method) => (
            <label key={method} className="flex items-center gap-2">
              <Checkbox
                checked={settings.allowedPaymentMethods?.includes(method)}
                onCheckedChange={() =>
                  toggleArrayValue("allowedPaymentMethods", method)
                }
              />
              <span className="text-sm">{method}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* ================= DELIVERY CONFIG ================= */}
      <Section label="Delivery Configuration">

        <FormInput
          label="Delivery Fee"
          value={delivery.deliveryFee?.toString() || ""}
          onChange={(val) =>
            update(
              ["settings", "deliveryConfig", "deliveryFee"],
              val ? Number(val) : 0
            )
          }
        />

        <FormInput
          label="Radius (km)"
          value={delivery.radiusKm?.toString() || ""}
          onChange={(val) =>
            update(
              ["settings", "deliveryConfig", "radiusKm"],
              val ? Number(val) : 0
            )
          }
        />

        <FormInput
          label="Minimum Order Amount"
          value={delivery.minOrderAmount?.toString() || ""}
          onChange={(val) =>
            update(
              ["settings", "deliveryConfig", "minOrderAmount"],
              val ? Number(val) : 0
            )
          }
        />

        <FormInput
          label="Free Delivery Threshold"
          value={delivery.freeDeliveryThreshold?.toString() || ""}
          onChange={(val) =>
            update(
              ["settings", "deliveryConfig", "freeDeliveryThreshold"],
              val ? Number(val) : 0
            )
          }
        />

        {/* BOOLEAN */}
        <div className="flex items-center gap-3 mt-4">
          <Checkbox
            checked={delivery.isFreeDelivery || false}
            onCheckedChange={(val) =>
              update(
                ["settings", "deliveryConfig", "isFreeDelivery"],
                !!val
              )
            }
          />
          <span className="text-sm">Enable Free Delivery</span>
        </div>
      </Section>
    </div>
  );
}