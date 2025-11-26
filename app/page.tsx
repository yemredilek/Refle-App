import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Search, Share2, Wallet, Store, ArrowRight, TrendingUp, Clock } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

// ... (AppleLogo ve GooglePlayLogo buraya gelecek - Önceki koddan alabilirsin) ...
// Apple Logosu (Orijinal Dolgulu)
const AppleLogo = () => (
  <svg viewBox="0 0 384 512" fill="currentColor" height="24" width="24">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
  </svg>
);

// Google Play Logosu (Renkli Orijinal)
const GooglePlayLogo = () => (
  <svg viewBox="0 0 512 512" height="24" width="24">
    <path fill="#2196f3" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" />
    <path fill="#4caf50" d="M47 13C30.5 2.8 10 12 10 30.3v451.4c0 18.2 20.5 27.6 37 17.3l278.3-264.7-278.3-221.3z" />
    <path fill="#f44336" d="M47 499c104.9-100.4 278.3-264.7 278.3-264.7L385.4 294.4l-338.4 204.6z" />
    <path fill="#ffeb3b" d="M325.3 234.3l60.1 60.1 96.7-55.6c22.6-13 22.6-46.3 0-59.3l-96.7-55.6-60.1 110.4z" />
  </svg>
);

async function getCampaigns() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      businesses (
        name,
        city,
        district
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}

export default async function Home() {
  const campaigns = await getCampaigns();

  return (
    <div className="flex flex-col gap-16 pb-12">

      {/* HERO SECTION */}
      <section className="relative py-16 md:py-24 overflow-hidden rounded-3xl bg-zinc-950 text-white shadow-2xl isolate border border-zinc-800">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-blue-200 backdrop-blur-md mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            İstanbul'da {campaigns.length > 0 ? `${campaigns.length} Fırsat` : "Yayındayız"}
          </div>

          <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Referans Ol, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">Nakit Kazan.</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
            Sevdiğin mekanları arkadaşlarına öner. Onlar indirim kazansın, sen harcadıkları tutardan anında nakit pay al.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="h-16 px-8 bg-black text-white border border-zinc-800 hover:bg-zinc-800 rounded-xl gap-3 flex items-center justify-start transition-all active:scale-95">
              <AppleLogo />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-medium opacity-80">Download on the</span>
                <span className="text-xl font-bold tracking-wide">App Store</span>
              </div>
            </Button>

            <Button size="lg" className="h-16 px-8 bg-black text-white border border-zinc-800 hover:bg-zinc-800 rounded-xl gap-3 flex items-center justify-start transition-all active:scale-95">
              <GooglePlayLogo />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-medium opacity-80">GET IT ON</span>
                <span className="text-xl font-bold tracking-wide">Google Play</span>
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR? (STEPS) */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Nasıl Para Kazanırım?</h2>
          <p className="text-zinc-500 mt-2">Sadece 3 adımda kazanmaya başla.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <Card className="p-6 border-zinc-200 bg-linear-to-b from-white to-zinc-50/50 shadow-sm hover:shadow-md transition-all dark:from-zinc-900 dark:to-zinc-950 dark:border-zinc-800 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl dark:bg-blue-900/20"></div>
            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 relative z-10 dark:bg-blue-900/30 dark:text-blue-400">1</div>
            <h3 className="text-xl font-bold mb-2 relative z-10">Fırsatı Yakala</h3>
            <p className="text-zinc-500 text-sm leading-relaxed relative z-10">
              Listelenen kampanyalar arasından beğendiğin bir işletmeyi seç.
            </p>
          </Card>

          <Card className="p-6 border-zinc-200 bg-linear-to-b from-white to-zinc-50/50 shadow-sm hover:shadow-md transition-all dark:from-zinc-900 dark:to-zinc-950 dark:border-zinc-800 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full blur-2xl dark:bg-purple-900/20"></div>
            <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 relative z-10 dark:bg-purple-900/30 dark:text-purple-400">2</div>
            <h3 className="text-xl font-bold mb-2 relative z-10">Refle & Paylaş</h3>
            <p className="text-zinc-500 text-sm leading-relaxed relative z-10">
              Sana özel referans kodunu oluştur, WhatsApp'tan arkadaşına gönder.
            </p>
          </Card>

          <Card className="p-6 border-zinc-200 bg-linear-to-b from-white to-zinc-50/50 shadow-sm hover:shadow-md transition-all dark:from-zinc-900 dark:to-zinc-950 dark:border-zinc-800 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full blur-2xl dark:bg-green-900/20"></div>
            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 relative z-10 dark:bg-green-900/30 dark:text-green-400">3</div>
            <h3 className="text-xl font-bold mb-2 relative z-10">Nakit Kazan</h3>
            <p className="text-zinc-500 text-sm leading-relaxed relative z-10">
              Arkadaşın indirimli harcamasını yapsın, payın anında cüzdanına yatsın.
            </p>
          </Card>
        </div>
      </section>

      {/* KAMPANYALAR LİSTESİ (YENİ KART TASARIMI) */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-2xl font-bold tracking-tight">Popüler Fırsatlar 🔥</h2>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
            <p className="text-zinc-500 font-medium">Şu an aktif kampanya bulunmuyor.</p>
            <p className="text-sm text-zinc-400 mt-1">Birazdan tekrar kontrol et.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Link href={`/campaign/${campaign.id}`} key={campaign.id} className="block h-full">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer dark:bg-zinc-900 dark:border-zinc-800 flex flex-col">

                  {/* GÖRSEL ALANI (AKILLI PLACEHOLDER) */}
                  <div className="aspect-[16/9] w-full relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">

                    {/* Placeholder İkonu (Resim yoksa) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-700 opacity-50">
                      <Store size={48} strokeWidth={1} />
                    </div>

                    {/* Gradient Overlay (Yazı Okunurluğu İçin) */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-90" />

                    {/* BADGE: KAZANÇ TUTARI */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-blue-700 shadow-lg">
                        <TrendingUp size={12} />
                        ₺{campaign.referrer_reward} KAZAN
                      </span>
                    </div>

                    {/* BAŞLIK VE KONUM */}
                    <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                      <h3 className="font-bold text-xl leading-snug mb-1.5 line-clamp-1 shadow-black drop-shadow-md">{campaign.businesses?.name}</h3>
                      <div className="flex items-center text-xs text-zinc-300 font-medium">
                        <MapPin size={12} className="mr-1 text-blue-400" />
                        {campaign.businesses?.district}, {campaign.businesses?.city}
                      </div>
                    </div>
                  </div>

                  {/* İÇERİK KISMI */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg mb-2 dark:text-white line-clamp-1">{campaign.title}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4 h-8">
                        {campaign.description || "Kampanya detaylarını incelemek için tıklayın."}
                      </p>
                    </div>

                    {/* ALT BİLGİLER */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-zinc-400">İndirim</span>
                        <span className="text-lg font-bold text-green-600">₺{campaign.discount_amount}</span>
                      </div>

                      <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-4 group-hover:translate-x-1 transition-transform">
                        İncele <ArrowRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}