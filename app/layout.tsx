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
      <body className={`${onest.className} bg-[#F5F5F5]`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}