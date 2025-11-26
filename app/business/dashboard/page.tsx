import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, CreditCard, Plus, Tag } from "lucide-react";
import { createClient } from "@/utils/supabase/server"; // Server Component

// Veri Çekme Fonksiyonu
async function getBusinessStats() {
    const supabase = await createClient();

    // 1. Giriş yapan kullanıcının İşletme ID'sini bul
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: business } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('owner_id', user.id)
        .single();

    if (!business) return null;

    // 2. Kampanyaları Çek
    const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

    // 3. Toplam Referans Sayısını Çek (Basit bir count query)
    // Not: Gerçekte 'referrals' tablosunu joinleyip saymak daha doğru ama şimdilik basit tutalım.
    // Kampanya sayısı üzerinden gidelim.

    return {
        businessName: business.name,
        campaigns: campaigns || [],
        totalCampaigns: campaigns?.length || 0,
    };
}

export default async function BusinessDashboard() {
    const stats = await getBusinessStats();

    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h1 className="text-2xl font-bold">{stats?.businessName || "İşletme Paneli"}</h1>
                    <p className="text-sm text-zinc-500">Genel Bakış</p>
                </div>
                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-full">
                    <Link href="/business/create">
                        <Plus className="w-4 h-4 mr-1" /> Yeni Kampanya
                    </Link>
                </Button>
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
                            <div className="text-3xl font-bold">{stats?.totalCampaigns}</div>
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
                                <div className="text-lg font-bold">-</div>
                                <div className="text-[10px] text-zinc-500">Referanslar (Yakında)</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="flex-1">
                        <CardContent className="p-3 flex items-center gap-3">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-full dark:bg-orange-900/30 dark:text-orange-400">
                                <CreditCard size={16} />
                            </div>
                            <div>
                                <div className="text-lg font-bold">₺0</div>
                                <div className="text-[10px] text-zinc-500">Ödenen Ödül</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 2. KAMPANYA LİSTESİ (Dynamic Data) */}
            <div className="px-2">
                <h3 className="font-semibold text-lg mb-3">Kampanyalarım</h3>

                {stats?.campaigns.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-zinc-200 rounded-xl">
                        <p className="text-zinc-400 text-sm">Henüz kampanya oluşturmadınız.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {stats?.campaigns.map((camp) => (
                            <div key={camp.id} className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-900/10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-blue-900 dark:text-blue-100">{camp.title}</h4>
                                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                            Fiyat: ₺{camp.list_price} <span className="mx-1">•</span> Ödül: ₺{camp.referrer_reward}
                                        </p>
                                    </div>
                                    <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
                                        {camp.status.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}