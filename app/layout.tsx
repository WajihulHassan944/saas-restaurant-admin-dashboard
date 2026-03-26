import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from "./ClientLayout";
import "./globals.css";
import { onest } from "@/lib/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <AuthProvider>
        <body className={`${onest.className} bg-[#F5F5F5]`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </AuthProvider>
    </html>
  );
}