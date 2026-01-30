"use client";

import type { Metadata } from "next";
import "./globals.css";
import { onest } from "@/lib/fonts";
import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/sidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // routes where layout should be hidden
  const hideLayout = ["/login", "/register"].includes(pathname);

  return (
    <html lang="en">
      <body className={`${onest.className} bg-[#F5F5F5]`}>
        {!hideLayout && <Navbar />}

        <div className="flex">
          {!hideLayout && (
            <div className="hidden xl:block">
              <Sidebar />
            </div>
          )}

          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
