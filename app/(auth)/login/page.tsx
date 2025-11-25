"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Building2, User, Lock, Phone } from "lucide-react";

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState<"user" | "business">("user");

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-black">

            {/* LOGO & BAŞLIK */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tighter text-blue-600 mb-2">refle.</h1>
                <p className="text-zinc-500 text-sm">Hesabınıza giriş yapın ve kazanmaya başlayın.</p>
            </div>

            {/* ANA KART */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">

                {/* SEKMELER (TABS) */}
                <div className="grid grid-cols-2 border-b border-zinc-100 dark:border-zinc-800">
                    <button
                        onClick={() => setActiveTab("user")}
                        className={`flex items-center justify-center gap-2 p-4 text-sm font-medium transition-all ${activeTab === "user"
                                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                            }`}
                    >
                        <User size={18} />
                        Bireysel
                    </button>
                    <button
                        onClick={() => setActiveTab("business")}
                        className={`flex items-center justify-center gap-2 p-4 text-sm font-medium transition-all ${activeTab === "business"
                                ? "bg-zinc-100 text-zinc-900 border-b-2 border-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                            }`}
                    >
                        <Building2 size={18} />
                        İşletme
                    </button>
                </div>

                {/* FORM ALANI */}
                <div className="p-6 space-y-4">

                    {activeTab === "user" ? (
                        // KULLANICI GİRİŞ FORMU
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-500 uppercase">Telefon Numarası</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
                                    <Input placeholder="5XX XXX XX XX" className="pl-10 h-12 bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-500 uppercase">Şifre</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
                                    <Input type="password" placeholder="••••••" className="pl-10 h-12 bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700" />
                                </div>
                            </div>
                            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20">
                                Giriş Yap <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        // İŞLETME GİRİŞ FORMU
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800 mb-4 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-200">
                                👋 Hoş geldiniz! İşletme panelinize erişmek için kurumsal bilgilerinizi girin.
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-500 uppercase">E-Posta Adresi</label>
                                <Input placeholder="ornek@sirket.com" className="h-12 bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-500 uppercase">Şifre</label>
                                <Input type="password" placeholder="••••••" className="h-12 bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700" />
                            </div>
                            <Button className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold">
                                Panel'e Git <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* ALT LİNKLER */}
                    <div className="pt-4 text-center space-y-2">
                        <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-600 hover:underline">
                            Şifremi Unuttum
                        </Link>
                        <div className="text-sm text-zinc-500">
                            Hesabın yok mu?{" "}
                            <Link href="/register" className="font-bold text-blue-600 hover:underline">
                                Kayıt Ol
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}