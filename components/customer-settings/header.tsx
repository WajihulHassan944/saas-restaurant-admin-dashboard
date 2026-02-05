"use client"

import { HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '../header'
import { useRouter } from 'next/navigation'

export default function EmployeeSettingsHeader({ title, description }: HeaderProps) {
    const router = useRouter()
    return (
        <>
        <div className="flex flex-col gap-4 md:gap-6 lg:flex-row lg:items-center lg:justify-between w-full">
            <Header
                title={title}
                description={description}
            />

            {/* 2. Buttons stack on tiny mobile, become row on sm (640px) */}
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-start">
          <Button
                    variant="outline"
          className="h-[38px] sm:h-[44px] rounded-[12px] px-3 sm:px-4 flex items-center gap-2 text-[#767676] border-[#E6E7EC] text-[13px] sm:text-[15px] font-[500]"
             onClick={()=>router.push("/customer-settings/trash")}
                >
                    <p>View Trash</p>
                    <HelpCircle size={18} className="text-[#767676]" />
                </Button>

                <Button
                    variant="primary"
                    
             className="h-[38px] sm:h-[44px] rounded-[12px] px-4 sm:px-5 flex items-center gap-2 bg-primary hover:bg-red-700 text-white text-[13px] sm:text-[15px] font-[500]"
         >
                    Add New Customer
                </Button>
            </div>
        </div>

         
      </>
    )
}