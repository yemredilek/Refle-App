import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    return (
        <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* LOGO */}
                <div className="flex items-center">
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-blue-600">
                        refle.
                    </Link>
                </div>

                {/* ORTA MENÜ LİNKLERİ */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    <Link href="/campaigns" className="hover:text-blue-600 transition-colors">Kampanyalar</Link>
                    <Link href="/business" className="hover:text-blue-600 transition-colors">İşletmeler İçin</Link>
                    <Link href="/how-it-works" className="hover:text-blue-600 transition-colors">Nasıl Çalışır?</Link>
                </nav>

                {/* SAĞ TARAF (Giriş / Kayıt) */}
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:underline">
                        Giriş Yap
                    </Link>
                    <Button asChild>
                        <Link href="/register">Hemen Başla</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}