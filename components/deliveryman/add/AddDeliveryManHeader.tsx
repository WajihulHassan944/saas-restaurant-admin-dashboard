"use client"

import { Button } from '@/components/ui/button'
import Header from '../../header'
import { useRouter } from 'next/navigation'

export default function AddDeliveryManHeader({ title, description }: HeaderProps) {
    const router = useRouter()
 
    return (
        <>
        <div className="flex flex-col gap-4 md:gap-6 lg:flex-row lg:items-center lg:justify-between w-full">
            <Header
                title={title}
                description={description}
            />

            {/* 2. Buttons stack on tiny mobile, become row on sm (640px) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4">
             <Button
  variant="ghost"
  className="w-full sm:w-auto flex items-center gap-2 justify-between sm:justify-start
             bg-transparent border-none shadow-none
             text-black hover:bg-transparent hover:text-black text-sm mr-2 text-[15px]"
>
  Cancel
</Button>

                <Button
                    variant="primary"
                    className="w-full sm:w-auto whitespace-nowrap text-[15px]"
                >
                    Confirm
                </Button>
            </div>
        </div>

        
      </>
    )
}