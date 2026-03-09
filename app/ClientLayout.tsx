"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/sidebar";
import { Toaster } from "sonner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading } = useAuth();

  const hideLayout = ["/login", "/register", "/forgot-password"].includes(
    pathname
  );

  if (loading && !hideLayout) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <>
      {!hideLayout && <Navbar />}

      <Toaster position="top-right" richColors />

      <div className="flex">
        {!hideLayout && (
          <div className="hidden xl:block">
            <Sidebar />
          </div>
        )}

        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}