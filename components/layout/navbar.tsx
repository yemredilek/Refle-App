"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User, LayoutDashboard, Wallet, LogOut, Settings, QrCode, Megaphone } from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setRole(user.user_metadata?.role || "user");
            } else {
                setUser(null);
                setRole(null);
            }
        };
        getUser();
    }, [pathname]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
        toast.success("Çıkış yapıldı");
        router.push("/login");
        router.refresh();
    };

    // Auth sayfalarında gizle
    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    return (
        <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* LOGO */}
                <div className="flex items-center">
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-blue-600">
                        refle.
                    </Link>
                </div>

                {/* ORTA MENÜ: Sadece MİSAFİR kullanıcılar görsün */}
                {!user && (
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Kampanyalar</Link>
                        <Link href="/business" className="hover:text-blue-600 transition-colors">İşletmeler İçin</Link>
                    </nav>
                )}

                {/* SAĞ TARAF (Duruma Göre Değişir) */}
                <div className="flex items-center gap-4">

                    {!user ? (
                        // --- MİSAFİR ---
                        <>
                            <Link href="/login" className="text-sm font-medium hover:underline">
                                Giriş Yap
                            </Link>
                            <Button asChild>
                                <Link href="/register">Hemen Başla</Link>
                            </Button>
                        </>
                    ) : role === 'business' ? (
                        // --- İŞLETME MODU ---
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild className="text-zinc-600 dark:text-zinc-300">
                                <Link href="/business/dashboard">
                                    <LayoutDashboard size={18} className="mr-2" /> Panel
                                </Link>
                            </Button>

                            <Button variant="ghost" asChild className="text-zinc-600 dark:text-zinc-300">
                                <Link href="/business/campaigns">
                                    <Megaphone size={18} className="mr-2" /> Kampanyalar {/* Megaphone ikonunu import et */}
                                </Link>
                            </Button>

                            {/* YENİ: KASA BUTONU */}
                            <Button variant="ghost" asChild className="text-zinc-600 dark:text-zinc-300">
                                <Link href="/business/scan">
                                    <QrCode size={18} className="mr-2" /> Kasa
                                </Link>
                            </Button>

                            <Button variant="ghost" asChild className="text-zinc-600 dark:text-zinc-300">
                                <Link href="/business/profile">
                                    <Settings size={18} className="mr-2" /> Ayarlar
                                </Link>
                            </Button>

                            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-2"></div>

                            <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                                <LogOut size={18} className="mr-2" /> Çıkış
                            </Button>
                        </div>
                    ) : (
                        // --- KULLANICI MODU ---
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild className="text-zinc-600 dark:text-zinc-300">
                                <Link href="/wallet">
                                    <Wallet size={18} className="mr-2" /> Cüzdan
                                </Link>
                            </Button>
                            <Button variant="ghost" asChild className="text-zinc-600 dark:text-zinc-300">
                                <Link href="/profile">
                                    <User size={18} className="mr-2" /> Hesabım
                                </Link>
                            </Button>

                            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-2"></div>

                            <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                                <LogOut size={18} className="mr-2" /> Çıkış
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </header>
    );
}