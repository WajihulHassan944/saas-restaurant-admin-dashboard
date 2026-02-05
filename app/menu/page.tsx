import { Suspense } from "react";

import Container from "@/components/container";
import Header from "@/components/menu/header";
import Table from "@/components/menu/list";
import BranchFilters from "@/components/branches/BranchFilters";
import BranchesPagination from "@/components/branches/BranchesPagination";

export default function MenusPage() {
    return (
        <Container>
           <Suspense
                    fallback={
                        <div className="py-10 text-center text-sm text-muted-foreground">
                            Loading menus header...
                        </div>
                    }
                >
            <Header
                title="Menu List"
                description="View and manage all Menu from here"
            />
</Suspense>
            <div className="space-y-[32px] bg-white lg:p-[30px] rounded-[14px] shadow-sm">
                <Suspense
                    fallback={
                        <div className="py-10 text-center text-sm text-muted-foreground">
                            Loading menus...
                        </div>
                    }
                >
                    <BranchFilters />

                    <div className="px-2 lg:px-0">
                        <Table />
                        <BranchesPagination />
                    </div>
                </Suspense>
            </div>
        </Container>
    );
}
