import HealthStatCard from "@/components/cards/health-card";
import { Card } from "@/components/ui/card";
import { apiHealthStats } from "@/constants/monitoring";

const ApiHealthSection = () => {
    return (
        <section className="space-y-[20px]">
            <h3 className="text-lg font-semibold text-dark">API Health</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
                {apiHealthStats.map((stat, index) => (
                    <HealthStatCard key={index} {...stat} />
                ))}
                <Card
                    style={{ background: `linear-gradient(134.39deg, rgba(216, 0, 39, 0) 50.72%, rgba(216, 0, 39, 0.08) 107.74%), #FFFFFF` }}
                    className="p-[24px] border-none shadow-sm rounded-[14px] flex flex-col justify-center"
                >
                    <h4 className="text-base text-dark mb-1">Average Latency</h4>
                    <p className="text-xs text-gray mb-2">145ms</p>
                    <p className="text-base text-gray">1,284,567 total requests</p>
                </Card>
            </div>
        </section>
    );
};

export default ApiHealthSection;
