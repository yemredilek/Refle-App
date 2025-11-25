import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Settings, LogOut, HelpCircle, ChevronRight, ShieldCheck, CreditCard, Bell } from "lucide-react";

export default function ProfilePage() {
    // MOCK DATA: Şimdilik 'false' yaparak Misafir görünümünü test edelim.
    // Backend bağlayınca burası 'session'dan gelecek.
    const isLoggedIn = false;

    // --- DURUM 1: GİRİŞ YAPMAMIŞ KULLANICI (MİSAFİR) ---
    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center animate-in fade-in duration-500">

                {/* Büyük İkon */}
                <div className="h-28 w-28 bg-zinc-100 rounded-full flex items-center justify-center mb-6 shadow-inner dark:bg-zinc-800">
                    <User size={56} className="text-zinc-300 dark:text-zinc-600" />
                </div>

                {/* Mesaj */}
                <div className="space-y-2 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Hoş Geldiniz</h1>
                    <p className="text-zinc-500 text-base max-w-[280px] mx-auto dark:text-zinc-400">
                        Kampanyalardan yararlanmak ve anında nakit kazanmak için hesabına giriş yap.
                    </p>
                </div>

                {/* Aksiyon Butonları */}
                <div className="w-full max-w-xs space-y-4">
                    <Button asChild className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-semibold shadow-lg shadow-blue-200 dark:shadow-none">
                        <Link href="/login">Giriş Yap</Link>
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-zinc-50 px-2 text-zinc-400 dark:bg-zinc-950">veya</span>
                        </div>
                    </div>

                    <Button asChild variant="outline" className="w-full rounded-full border-zinc-300 h-14 text-lg font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
                        <Link href="/register">Hesap Oluştur</Link>
                    </Button>
                </div>

                <p className="mt-8 text-xs text-zinc-400">
                    İşletme sahibi misiniz? <Link href="/login" className="text-blue-600 underline">İşletme Girişi</Link>
                </p>
            </div>
        );
    }

    // --- DURUM 2: GİRİŞ YAPMIŞ KULLANICI (PROFİL) ---
    return (
        <div className="flex flex-col gap-6 pb-20">

            {/* Üst Kısım: Profil Özeti */}
            <div className="flex items-center gap-4 px-2 py-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold border-2 border-white shadow-sm dark:bg-blue-900 dark:text-blue-200 dark:border-zinc-800">
                    OA
                </div>
                <div>
                    <h2 className="text-xl font-bold">Oğuzhan A.</h2>
                    <p className="text-sm text-zinc-500">oguzhan@example.com</p>
                </div>
            </div>

            {/* Menü Listesi */}
            <div className="space-y-6 px-2">

                {/* Grup 1: Hesap */}
                <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase ml-2">Hesabım</h3>
                    <Card className="border-zinc-100 shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            <MenuItem icon={User} label="Kişisel Bilgiler" />
                            <MenuItem icon={CreditCard} label="IBAN / Ödeme Yöntemleri" />
                            <MenuItem icon={Bell} label="Bildirim Ayarları" />
                        </div>
                    </Card>
                </div>

                {/* Grup 2: Destek */}
                <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase ml-2">Destek</h3>
                    <Card className="border-zinc-100 shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            <MenuItem icon={HelpCircle} label="Yardım Merkezi" />
                            <MenuItem icon={ShieldCheck} label="Gizlilik ve Güvenlik" />
                        </div>
                    </Card>
                </div>

                {/* Çıkış Butonu */}
                <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut className="w-4 h-4 mr-2" /> Çıkış Yap
                </Button>

                <div className="text-center pt-4">
                    <p className="text-[10px] text-zinc-300">Refle v1.0.0 (Beta)</p>
                </div>

            </div>
        </div>
    );
}

// Yardımcı Bileşen: Menü Satırı
function MenuItem({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 transition-colors active:bg-zinc-100 dark:hover:bg-zinc-800/50">
            <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                <Icon size={18} />
                <span className="text-sm font-medium">{label}</span>
            </div>
            <ChevronRight size={16} className="text-zinc-300" />
        </div>
    )
}