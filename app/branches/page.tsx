import Container from "@/components/container";
import Header from "@/components/branches/header";
import Table from "@/components/branches/list";
import BranchFilters from "@/components/branches/BranchFilters";
import BranchesPagination from "@/components/branches/BranchesPagination";

export default function BranchesPage() {
    return (
        <Container>
            <Header
                title="Branch List"
                description="View and manage all branches from here"
            />

            <div className="space-y-[32px] bg-white lg:p-[30px] rounded-[14px] shadow-sm">
                <BranchFilters />

                
                <div className="px-2 lg:px-0">
                    <Table />
                    <BranchesPagination />
                </div>
            </div>
        </Container>
    );
}