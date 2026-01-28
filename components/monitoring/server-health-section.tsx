import HealthCard from "@/components/cards/health-card";
import { serverHealthStats } from "@/constants/monitoring";

const ServerHealthSection = () => {
    return (
        <section className="space-y-[20px]">
            <h3 className="text-lg font-semibold text-dark">Server Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
                {serverHealthStats.map((stat, index) => (
                    <HealthCard key={index} {...stat} />
                ))}
            </div>
        </section>
    );
};

export default ServerHealthSection;
