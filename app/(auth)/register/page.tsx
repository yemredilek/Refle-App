"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
    const [role, setRole] = useState<"user" | "business" | null>(null);

    // 1. AŞAMA: ROL SEÇİMİ
    if (!role) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-zinc-50 dark:bg-black">
                <h1 className="text-2xl font-bold mb-2">Nasıl devam etmek istersin?</h1>
                <p className="text-zinc-500 mb-8 text-sm">Refle dünyasına hangi kimlikle katılacağını seç.</p>

                <div className="grid gap-4 w-full max-w-sm">
                    <button
                        onClick={() => setRole("user")}
                        className="group relative flex items-center p-4 bg-white border-2 border-zinc-100 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-blue-900/20 dark:hover:border-blue-600"
                    >
                        <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl mr-4 group-hover:scale-110 transition-transform">
                            👤
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900 dark:text-white">Bireysel Kullanıcı</h3>
                            <p className="text-xs text-zinc-500 group-hover:text-blue-600 dark:text-zinc-400">İndirim kazanmak ve referans olmak istiyorum.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setRole("business")}
                        className="group relative flex items-center p-4 bg-white border-2 border-zinc-100 rounded-2xl hover:border-zinc-900 hover:bg-zinc-50 transition-all text-left dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:border-zinc-500"
                    >
                        <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl mr-4 group-hover:scale-110 transition-transform">
                            🏢
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900 dark:text-white">İşletme / Marka</h3>
                            <p className="text-xs text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400">Müşteri çekmek ve kampanya oluşturmak istiyorum.</p>
                        </div>
                    </button>
                </div>

                <div className="mt-8 text-sm text-zinc-500">
                    Zaten hesabın var mı? <Link href="/login" className="font-bold text-blue-600 hover:underline">Giriş Yap</Link>
                </div>
            </div>
        );
    }

    // 2. AŞAMA: KAYIT FORMU
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-black">
            <div className="w-full max-w-md">
                <Button variant="ghost" onClick={() => setRole(null)} className="mb-6 text-zinc-500 pl-0 hover:bg-transparent hover:text-zinc-900">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
                </Button>

                <h1 className="text-2xl font-bold mb-1">
                    {role === "user" ? "Refle Hesabı Oluştur" : "İşletmeni Kaydet"}
                </h1>
                <p className="text-zinc-500 text-sm mb-6">
                    {role === "user" ? "Dakikalar içinde aramıza katıl." : "İşletmenizi büyütmeye bugün başlayın."}
                </p>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Ad" className="h-12" />
                        <Input placeholder="Soyad" className="h-12" />
                    </div>

                    {role === "business" && (
                        <Input placeholder="İşletme Adı (Tabela Adı)" className="h-12 border-orange-200 focus:ring-orange-500" />
                    )}

                    <Input placeholder="Telefon Numarası" className="h-12" />

                    {role === "business" && (
                        <Input placeholder="İş E-Postası" className="h-12" />
                    )}

                    <Input type="password" placeholder="Şifre Belirle" className="h-12" />

                    <div className="flex items-start gap-2 mt-4">
                        <div className="mt-1"><CheckCircle2 size={16} className="text-blue-600" /></div>
                        <p className="text-xs text-zinc-500">
                            Hesap oluşturarak <span className="text-zinc-900 font-medium cursor-pointer underline">Kullanım Koşulları</span>'nı ve <span className="text-zinc-900 font-medium cursor-pointer underline">Gizlilik Politikası</span>'nı kabul etmiş olursunuz.
                        </p>
                    </div>

                    <Button className={`w-full h-12 text-lg font-bold mt-4 ${role === 'business' ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-blue-600 hover:bg-blue-700'
                        }`}>
                        Kaydı Tamamla
                    </Button>
                </div>
            </div>
        </div>
    );
}