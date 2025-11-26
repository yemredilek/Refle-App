import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Users,  CreditCard, Plus, Tag, QrCode } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

// Tip Tanımları (TypeScript Hatası Almamak İçin)
interface Campaign {
    id: string;
    title: string;
    list_price: number;
    current_uses: number;
    status: string;
    created_at: string;
    referrer_reward: number; // Eklendi
}

async function getBusinessStats() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: business } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('owner_id', user.id)
        .single();

    if (!business) return null;

    // İstatistikleri Al
    const { data: stats } = await supabase.rpc('get_business_dashboard_stats');

    // Kampanyaları Al
    const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

    return {
        businessName: business.name,
        campaigns: (campaigns as Campaign[]) || [], // Tip zorlaması
        stats: stats || { campaigns: 0, referrals: 0, paid: 0 },
    };
}

export default async function BusinessDashboard() {
    const data = await getBusinessStats(); // Ana veriyi 'data' olarak alıyoruz
    const stats = data?.stats;             // İstatistik sayıları 'stats' içinde

    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h1 className="text-2xl font-bold">{data?.businessName || "İşletme Paneli"}</h1>
                    <p className="text-sm text-zinc-500">Hoş geldin, bol kazançlar.</p>
                </div>
            </div>

            {/* 0. HIZLI AKSİYONLAR */}
            <div className="grid grid-cols-2 gap-3 px-2">
                <Link href="/business/scan" className="w-full">
                    <div className="bg-blue-600 text-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-transform dark:shadow-none">
                        <QrCode size={28} />
                        <span className="font-bold text-sm">Kasa / QR</span>
                    </div>
                </Link>
                <Link href="/business/create" className="w-full">
                    <div className="bg-white border border-zinc-200 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform dark:bg-zinc-900 dark:border-zinc-800">
                        <Plus size={28} className="text-zinc-900 dark:text-white" />
                        <span className="font-bold text-sm text-zinc-900 dark:text-white">Kampanya Ekle</span>
                    </div>
                </Link>
            </div>

            {/* 1. ÖZET KARTLARI */}
            <div className="grid grid-cols-2 gap-4 px-2">
                <Card className="bg-zinc-900 text-zinc-50 border-zinc-800 dark:bg-zinc-50 dark:text-zinc-900">
                    <CardContent className="p-4 flex flex-col justify-between h-[120px]">
                        <div className="p-2 bg-zinc-800 rounded-full w-fit dark:bg-zinc-200">
                            <Tag size={18} className="text-white dark:text-black" />
                        </div>
                        <div>
                            <span className="text-xs opacity-70">Aktif Kampanya</span>
                            <div className="text-3xl font-bold">{stats?.campaigns || 0}</div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-4">
                    <Card className="flex-1">
                        <CardContent className="p-3 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                                <Users size={16} />
                            </div>
                            <div>
                                <div className="text-lg font-bold">{stats?.referrals || 0}</div>
                                <div className="text-[10px] text-zinc-500">Referanslar</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="flex-1">
                        <CardContent className="p-3 flex items-center gap-3">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-full dark:bg-orange-900/30 dark:text-orange-400">
                                <CreditCard size={16} />
                            </div>
                            <div>
                                <div className="text-lg font-bold">₺{stats?.paid || 0}</div>
                                <div className="text-[10px] text-zinc-500">Ödenen Ödül</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 2. KAMPANYA LİSTESİ */}
            <div className="px-2">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">Kampanyalarım</h3>
                    <Link href="/business/campaigns" className="text-xs text-blue-600 font-medium">Tümünü Gör</Link>
                </div>

                {data?.campaigns.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-zinc-200 rounded-xl">
                        <p className="text-zinc-400 text-sm">Henüz kampanya yok.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {data?.campaigns.slice(0, 3).map((camp) => (
                            <Link href={`/business/campaigns/${camp.id}`} key={camp.id}>
                                <div className="p-4 rounded-xl border border-zinc-100 bg-white shadow-sm flex justify-between items-center active:bg-zinc-50 transition-colors dark:bg-zinc-900 dark:border-zinc-800">
                                    <div>
                                        <h4 className="font-bold text-sm text-zinc-900 dark:text-blue-100 line-clamp-1">{camp.title}</h4>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            {camp.current_uses} Kullanım <span className="mx-1">•</span> ₺{camp.list_price}
                                        </p>
                                    </div>
                                    <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${camp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                        {camp.status === 'active' ? 'AKTİF' : 'PASİF'}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}