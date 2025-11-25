"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, ScanQrCode, User, LayoutDashboard, PlusCircle, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
    const pathname = usePathname();

    // İşletme Modunda mıyız?
    const isBusinessMode = pathname?.startsWith("/business");

    // KULLANICI MENÜSÜ
    const userNavItems = [
        { name: "Ana Sayfa", href: "/", icon: Home },
        { name: "Cüzdan", href: "/wallet", icon: Wallet },
        { name: "Refle", href: "/scan", icon: ScanQrCode, isPrimary: true },
        { name: "Profil", href: "/profile", icon: User },
    ];

    // İŞLETME MENÜSÜ
    const businessNavItems = [
        { name: "Panel", href: "/business/dashboard", icon: LayoutDashboard },
        { name: "Oluştur", href: "/business/create", icon: PlusCircle },
        { name: "Kasa", href: "/business/scan", icon: QrCode, isPrimary: true }, // Kasiyer butonu
        { name: "Profil", href: "/business/profile", icon: User },
    ];

    const navItems = isBusinessMode ? businessNavItems : userNavItems;

    return (
        <div className="w-full border-t border-zinc-200 bg-white pb-safe dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex h-16 items-center justify-around px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    if (item.isPrimary) {
                        return (
                            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center -mt-6">
                                <div className={cn(
                                    "flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg hover:bg-opacity-90 transition-all active:scale-95",
                                    isBusinessMode ? "bg-zinc-900 dark:bg-zinc-50 dark:text-black" : "bg-blue-600"
                                )}>
                                    <Icon size={28} />
                                </div>
                                <span className="mt-1 text-xs font-medium text-zinc-500">{item.name}</span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 px-2 py-1 transition-colors",
                                isActive
                                    ? (isBusinessMode ? "text-zinc-900 dark:text-white" : "text-blue-600")
                                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            )}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}