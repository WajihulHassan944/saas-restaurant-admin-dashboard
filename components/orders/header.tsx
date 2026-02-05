"use client"

import { Download, HelpCircle, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '../header'
import { useRouter } from 'next/navigation'

export default function OrdersHeader({ title, description }: HeaderProps) {
    const router = useRouter()
   
    return (
        <>
        <div className="flex  gap-4 md:gap-6 lg:flex-row lg:items-center justify-between w-full">
            <Header
                title={title}
                description={description}
            />

            {/* 2. Buttons stack on tiny mobile, become row on sm (640px) */}
            <div className="flex sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4">
                <Button
                    variant="outline"
                    className="w-fit sm:w-auto justify-between sm:justify-start flex items-center gap-2"
                >
                    <Download size={18} className="text-gray-600" />
                    <p className='pt-1'>Export</p>
                </Button>
            </div>
        </div>

       
      </>
    )
}