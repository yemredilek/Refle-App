import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, History, Wallet, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

async function getWalletData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('balance, full_name')
        .eq('id', user.id)
        .single();

    return profile;
}

export default async function WalletPage() {
    const profile = await getWalletData();

    // Para formatı
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
    };

    const balance = profile?.balance || 0;

    return (
        <div className="flex flex-col gap-6 pb-20">
            <h1 className="text-2xl font-bold px-2">Cüzdanım</h1>

            {/* 1. BAKİYE KARTI */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-blue-100 mb-1">
                        <Wallet size={18} />
                        <span className="text-sm font-medium">Toplam Bakiye</span>
                    </div>
                    <div className="text-4xl font-bold tracking-tight mb-6">
                        {formatCurrency(balance)}
                    </div>

                    <div className="flex gap-3">
                        <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50 border-0 font-semibold rounded-full">
                            <ArrowUpRight size={16} className="mr-1" />
                            Para Çek
                        </Button>
                        <Button size="sm" variant="outline" className="bg-blue-600/20 text-white border-white/20 hover:bg-blue-600/30 rounded-full backdrop-blur-md">
                            <History size={16} className="mr-1" />
                            Geçmiş
                        </Button>
                    </div>
                </div>
            </div>

            {/* MOCK ÖZETLER (Gerçek Transaction tablosu gelince güncellenecek) */}
            <div className="grid grid-cols-2 gap-4 px-2">
                <Card className="bg-orange-50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-900/20">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">Onay Bekleyen</span>
                        <span className="text-xl font-bold text-orange-700 dark:text-orange-300">₺0</span>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/20">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Toplam Kazanç</span>
                        <div className="flex items-center gap-1 text-green-700 dark:text-green-300">
                            <TrendingUp size={16} />
                            <span className="text-xl font-bold">{formatCurrency(balance)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* MOCK İŞLEMLER */}
            <div className="px-2 text-center py-8">
                <p className="text-zinc-400 text-sm">Henüz işlem geçmişi yok.</p>
            </div>
        </div>
    );
}