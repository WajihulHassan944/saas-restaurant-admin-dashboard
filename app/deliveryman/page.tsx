import Container from "@/components/container";
import StatsSection from "@/components/deliveryman/stats-section";
import Table from "@/components/deliveryman/table";
import Header from "@/components/deliveryman/header";
import BranchFilters from "@/components/branches/BranchFilters";

const Deliveryman = () => {
    return (
        <Container>
            <Header
                title="Delivery Man List"
                description="View and manage all Delivery Man from here"
            />
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm space-y-6">
                <StatsSection />

                <BranchFilters />

                <Table />
            </div>

           
        </Container>
    );
};

export default Deliveryman;
