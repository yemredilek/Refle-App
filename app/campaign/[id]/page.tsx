import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShareDrawer } from "@/components/campaign/share-drawer";
import { MapPin, Star, Clock, ShieldCheck, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";

// Mock Data (Gerçekte veritabanından gelecek)
const campaign = {
    id: 1,
    title: "Diş Taşı Temizliği & Beyazlatma",
    business: "Diş Hekimi Dr. Ece",
    rating: 4.9,
    reviews: 128,
    location: "Moda, Kadıköy",
    discount: "₺500 İndirim",
    reward: "₺250 Nakit",
    description: "Son teknoloji cihazlarla ağrısız diş taşı temizliği ve profesyonel beyazlatma işlemi. Gülüşünüzü 45 dakikada değiştiriyoruz.",
    terms: [
        "Randevu alırken kod belirtilmelidir.",
        "Hafta içi 10:00 - 17:00 arası geçerlidir.",
        "Son kullanım: 30 Aralık 2024"
    ]
};

export default function CampaignDetail({ params }: { params: { id: string } }) {
    return (
        <div className="flex flex-col min-h-screen pb-24 bg-white dark:bg-black">

            {/* 1. GÖRSEL ALANI (HERO) */}
            <div className="relative w-full h-72 bg-zinc-200">
                <Link href="/" className="absolute top-4 left-4 z-10 bg-white/50 backdrop-blur-md p-2 rounded-full hover:bg-white/80 transition-all">
                    <ArrowLeft size={20} className="text-black" />
                </Link>
                {/* Next/Image placeholder */}
                <div className="w-full h-full bg-linear-to-b from-zinc-300 to-zinc-100 flex items-center justify-center text-zinc-400">
                    [Kampanya Görseli]
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm text-zinc-800">
                    📸 5 Fotoğraf
                </div>
            </div>

            {/* 2. İÇERİK */}
            <div className="px-6 py-6 space-y-6 -mt-6 rounded-t-3xl bg-white relative z-0 dark:bg-black dark:border-t dark:border-zinc-800">

                {/* Başlık ve Puan */}
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
                            Diş Sağlığı
                        </Badge>
                        <div className="flex items-center gap-1 text-sm font-medium">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{campaign.rating}</span>
                            <span className="text-zinc-400">({campaign.reviews})</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold leading-tight">{campaign.title}</h1>
                    <div className="flex items-center text-zinc-500 text-sm">
                        <MapPin size={16} className="mr-1" />
                        {campaign.business} • {campaign.location}
                    </div>
                </div>

                {/* Kazanç Kartları */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 dark:bg-green-900/10 dark:border-green-900/20">
                        <p className="text-xs text-green-600 font-medium uppercase">Arkadaşın</p>
                        <p className="text-xl font-bold text-green-700 dark:text-green-400">{campaign.discount}</p>
                        <p className="text-[10px] text-green-600/70">Kazanır</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20">
                        <p className="text-xs text-blue-600 font-medium uppercase">Sen</p>
                        <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{campaign.reward}</p>
                        <p className="text-[10px] text-blue-600/70">Nakit Kazanırsın</p>
                    </div>
                </div>

                {/* Açıklama */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Detaylar</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed dark:text-zinc-400">
                        {campaign.description}
                    </p>
                </div>

                {/* Şartlar */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Kullanım Koşulları</h3>
                    <ul className="space-y-2">
                        {campaign.terms.map((term, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                <ShieldCheck className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                                <span>{term}</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            {/* 3. SABİT ALT BAR (CTA) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-100 z-50 pb-safe dark:bg-black dark:border-zinc-800">
                <div className="max-w-md mx-auto flex gap-4">
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12 shrink-0">
                        <Share2 size={20} />
                    </Button>

                    <ShareDrawer campaignTitle={campaign.title} reward={campaign.reward}>
                        <Button className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold shadow-lg shadow-blue-200 dark:shadow-none">
                            Refle & Kazan ({campaign.reward})
                        </Button>
                    </ShareDrawer>
                </div>
            </div>

        </div>
    );
}