import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import BottomNav from "@/components/layout/bottom-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Refle | Kazan-Kazan",
  description: "Referans ol, kazan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50`}>

        {/* MASAÜSTÜ İÇİN ÜST MENÜ (Mobilde Gizlenir) */}
        <div className="hidden md:block sticky top-0 z-50">
          <Navbar />
        </div>

        {/* ANA İÇERİK ALANI */}
        <main className="min-h-screen w-full">
          {/* Mobilde üstten, masaüstünde navbardan pay bırakmak için padding ayarları */}
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 mb-20 md:mb-0">
            {children}
          </div>
        </main>

        {/* MOBİL İÇİN ALT MENÜ (Masaüstünde Gizlenir) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <BottomNav />
        </div>

      </body>
    </html>
  );
}