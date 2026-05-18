import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Global stylesheet reference

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Employee Admin System",
  description: "Built with Next.js and MongoDB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}