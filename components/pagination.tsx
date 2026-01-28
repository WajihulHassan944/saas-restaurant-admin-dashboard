import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationSection = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
            <p className="text-sm">Showing 10 from 160 data</p>
        </div>
        <div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    
                    {/* Your exact pill design */}
                    <div className="border border-[#E3E4EB] flex rounded-full">
                        <PaginationItem>
                            <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" >2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" >3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" >4</PaginationLink>
                        </PaginationItem>
                    </div>
                    
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    </div>
  );
};

export default PaginationSection;