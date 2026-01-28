import type { Metadata } from 'next'
import './globals.css'
import { onest } from '@/lib/fonts'
import Navbar from '@/components/navbar/navbar'
import Sidebar from '@/components/sidebar'

export const metadata: Metadata = {
  title: 'Restaurant Admin',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${onest.className} bg-[#F5F5F5]`}>
        <Navbar />
        <div className="flex">
          <div className="hidden xl:block">
            <Sidebar />
          </div>
          {children}
        </div>

      </body>
    </html>
  )
}
