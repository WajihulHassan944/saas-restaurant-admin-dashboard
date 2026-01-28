"use client";

import { Card } from "@/components/ui/card";
import OrdersGraph from "../graphs/orders-graph";

export default function OrdersTrendSection({ type = "home" }: { type: string }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px] w-full">
            <OrdersGraph type={type} />

            <div className="flex flex-col gap-[24px] pr-2 lg:pr-0">
                <MetricCard
                    title="Average Order Value"
                    value="$22.83"
                    subtitle="per order"
                />
                <MetricCard
                    title="Peak Day"
                    value="Saturday"
                    subtitle="2,450 orders | $58,900 revenue"
                />
                <MetricCard
                    title="Conversion Rate"
                    value="4.2%"
                    subtitle="from visits to orders"
                />
            </div>
        </div>
    );
}

function MetricCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
    return (
        <Card
            style={{
                background: `linear-gradient(134.39deg, rgba(216, 0, 39, 0) 50.72%, rgba(216, 0, 39, 0.12) 107.74%), #FFFFFF`,
            }}
            className="flex flex-col justify-center p-[24px] border-none shadow-none rounded-[10px] h-full"
        >
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-gray text-base">{title}</p>
                    <p className="text-gray text-base">{subtitle}</p>
                </div>
                <p className="text-green text-lg font-semibold">{value}</p>
            </div>
        </Card>
    );
}