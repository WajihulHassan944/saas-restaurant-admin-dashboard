import OrdersGraph from "@/components/graphs/orders-graph";

const ApiLatencyChartSection = () => {
    return (
        <section className="space-y-[20px]">
            <OrdersGraph
                title="API Latency Over Time"
                description="Monitor real-time API reliability and response times"
            />
        </section>
    );
};

export default ApiLatencyChartSection;
