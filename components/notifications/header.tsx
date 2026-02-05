"use client"

import { HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '../header'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NotificationsHeader({ title, description }: HeaderProps) {
    const router = useRouter()
   const [open, setOpen] = useState(false);
 
    return (
        <>
        <div className="flex flex-col gap-4 md:gap-6 lg:flex-row lg:items-center lg:justify-between w-full">
            <Header
                title={title}
                description={description}
            />

             

                <Button
                    variant="primary"
                    onClick={() => setOpen(true)}
              className="h-[44px] rounded-[12px] px-5 flex items-center gap-2 bg-primary hover:bg-red-800 text-white text-[15px] font-[500]"
            >
                    Marl all as read
                </Button>
            </div>
        
       
      </>
    )
}