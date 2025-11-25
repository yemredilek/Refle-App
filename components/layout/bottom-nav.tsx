"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, ScanQrCode, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
    const pathname = usePathname();

    // Menü öğeleri
    const navItems = [
        {
            name: "Ana Sayfa",
            href: "/",
            icon: Home,
        },
        {
            name: "Cüzdan",
            href: "/wallet",
            icon: Wallet,
        },
        {
            name: "Refle",
            href: "/scan",
            icon: ScanQrCode,
            isPrimary: true,
        },
        {
            name: "Profil",
            href: "/profile",
            icon: User,
        },
    ];

    return (
        <div className="w-full border-t border-zinc-200 bg-white pb-safe dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex h-16 items-center justify-around px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    // Eğer ortadaki "Refle" butonuysa farklı tasarım
                    if (item.isPrimary) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center justify-center -mt-6"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all active:scale-95">
                                    <Icon size={28} />
                                </div>
                                <span className="mt-1 text-xs font-medium text-zinc-500">Refle</span>
                            </Link>
                        );
                    }

                    // Standart butonlar
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 px-2 py-1 transition-colors",
                                isActive
                                    ? "text-blue-600"
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