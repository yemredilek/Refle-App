import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShareDrawer } from "@/components/campaign/share-drawer";
import { MapPin, Star, ShieldCheck, ArrowLeft, Share2, Store } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

// Veri Çeken Fonksiyon
async function getCampaignDetail(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('campaigns')
        .select(`
      *,
      businesses (
        name,
        city,
        district,
        category
      )
    `)
        .eq('id', id)
        .single();

    if (error || !data) {
        return null;
    }
    return data;
}

export default async function CampaignDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const campaign = await getCampaignDetail(id);

    if (!campaign) {
        return notFound();
    }

    return (
        <div className="flex flex-col min-h-screen pb-24 bg-white dark:bg-black">

            {/* 1. GÖRSEL ALANI */}
            <div className="relative w-full h-72 bg-zinc-900">
                <Link href="/" className="absolute top-4 left-4 z-10 bg-white/50 backdrop-blur-md p-2 rounded-full hover:bg-white/80 transition-all">
                    <ArrowLeft size={20} className="text-black" />
                </Link>
                <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-linear-to-br from-zinc-800 to-zinc-900">
                    {/* Resim yoksa placeholder */}
                    <Store size={48} className="opacity-20" />
                </div>
            </div>

            {/* 2. İÇERİK */}
            <div className="px-6 py-6 space-y-6 -mt-6 rounded-t-3xl bg-white relative z-0 dark:bg-black dark:border-t dark:border-zinc-800">

                {/* Başlık */}
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
                            {campaign.businesses?.category || "Hizmet"}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm font-medium">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>5.0</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold leading-tight">{campaign.title}</h1>
                    <div className="flex items-center text-zinc-500 text-sm">
                        <MapPin size={16} className="mr-1" />
                        {campaign.businesses?.name} • {campaign.businesses?.district}
                    </div>
                </div>

                {/* Kazanç Kartları */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 dark:bg-green-900/10 dark:border-green-900/20">
                        <p className="text-xs text-green-600 font-medium uppercase">Arkadaşın</p>
                        <p className="text-xl font-bold text-green-700 dark:text-green-400">₺{campaign.discount_amount}</p>
                        <p className="text-[10px] text-green-600/70">İndirim Kazanır</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20">
                        <p className="text-xs text-blue-600 font-medium uppercase">Sen</p>
                        <p className="text-xl font-bold text-blue-700 dark:text-blue-400">₺{campaign.referrer_reward}</p>
                        <p className="text-[10px] text-blue-600/70">Nakit Kazanırsın</p>
                    </div>
                </div>

                {/* Açıklama */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Detaylar</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed dark:text-zinc-400">
                        {campaign.description || "Bu kampanya için detaylı açıklama girilmemiş."}
                    </p>
                </div>

                {/* Şartlar */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Nasıl Çalışır?</h3>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <ShieldCheck className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                            <span>Aşağıdaki butona basarak kodunu oluştur.</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <ShieldCheck className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                            <span>WhatsApp üzerinden arkadaşına gönder.</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <ShieldCheck className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                            <span>Arkadaşın kodu kasada göstersin, ikiniz de kazanın.</span>
                        </li>
                    </ul>
                </div>

            </div>

            {/* 3. SABİT ALT BAR (CTA) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-100 z-50 pb-safe dark:bg-black dark:border-zinc-800">
                <div className="max-w-md mx-auto flex gap-3 items-center"> {/* gap-3 ve items-center eklendi */}

                    {/* Sol Buton (Sabit Genişlik) */}
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12 shrink-0">
                        <Share2 size={20} />
                    </Button>

                    {/* Sağ Buton (Kalan Tüm Alanı Kapla: flex-1) */}
                    <ShareDrawer
                        campaignId={campaign.id}
                        campaignTitle={campaign.title}
                        reward={`₺${campaign.referrer_reward}`}
                    >
                        <Button className="flex-1 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold shadow-lg shadow-blue-200 dark:shadow-none truncate px-4">
                            Refle & Kazan (₺{campaign.referrer_reward})
                        </Button>
                    </ShareDrawer>
                </div>
            </div>

        </div>
    );
}