import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from "./ClientLayout";
import "./globals.css";
import { onest } from "@/lib/fonts";
import Providers from "@/components/providers/provider";
import ContextGate from "@/components/ContextGate";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <Providers>
    <AuthProvider>
        <body className={`${onest.className} bg-[#F5F5F5]`}>
       <ClientLayout>{children}</ClientLayout>
       <ContextGate />
      </body>
    </AuthProvider></Providers>
    </html>
  );
}