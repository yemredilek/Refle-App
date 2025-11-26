import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Smartphone, Download } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

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
    <div className="flex flex-col gap-12 pb-12">

      {/* HERO SECTION: App Landing Havası */}
      <section className="relative py-16 md:py-24 overflow-hidden rounded-3xl bg-zinc-900 text-white shadow-2xl isolate">
        {/* Arka Plan Efekti */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600 blur-[120px] rounded-full mix-blend-screen"></div>
        </div>

        <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-blue-200 backdrop-blur-md mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            İstanbul'da {campaigns.length > 0 ? `${campaigns.length} Fırsat` : "Yayındayız"}
          </div>

          <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Referans Ol, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">Nakit Kazan.</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-10">
            Refle ile sevdiğin mekanları arkadaşlarına öner. Onlar indirim kazansın, sen harcadıkları tutardan nakit pay al.
          </p>

          {/* STORE BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="h-14 px-8 bg-white text-black hover:bg-zinc-200 rounded-xl gap-3 text-left flex items-center justify-start">
              <Download size={24} />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase font-bold opacity-60">Download on the</span>
                <span className="text-lg font-bold">App Store</span>
              </div>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 border-zinc-700 bg-black/50 hover:bg-black text-white rounded-xl gap-3 text-left flex items-center justify-start">
              <Smartphone size={24} />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase font-bold opacity-60">Get it on</span>
                <span className="text-lg font-bold">Google Play</span>
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* KAMPANYALAR LİSTESİ */}
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
                <div className="group relative h-full overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer dark:bg-zinc-900 dark:border-zinc-800 flex flex-col">
                  {/* Görsel Alanı */}
                  <div className="aspect-4/3 w-full bg-zinc-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className="bg-white/90 px-2.5 py-1 rounded-lg text-xs font-bold text-zinc-900 backdrop-blur-md shadow-sm">
                        %{((campaign.referrer_reward / campaign.budget) * 100).toFixed(0)} Pay
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-bold text-xl leading-snug mb-1 shadow-black drop-shadow-md">{campaign.businesses?.name}</h3>
                      <div className="flex items-center text-sm text-white/80">
                        <MapPin size={14} className="mr-1" />
                        {campaign.businesses?.district}, {campaign.businesses?.city}
                      </div>
                    </div>
                  </div>

                  {/* İçerik */}
                  <div className="p-5 flex flex-col flex-1 justify-between bg-white dark:bg-zinc-900">
                    <div className="mb-4">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {campaign.description || "Detaylar için tıklayın..."}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex-1 bg-green-50 rounded-lg p-2 text-center border border-green-100 dark:bg-green-900/20 dark:border-green-900/30">
                        <div className="text-[10px] uppercase font-bold text-green-600/70">Arkadaşına</div>
                        <div className="text-lg font-bold text-green-700 dark:text-green-400">₺{campaign.discount_amount}</div>
                        <div className="text-[10px] font-medium text-green-600">İndirim</div>
                      </div>
                      <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center border border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30">
                        <div className="text-[10px] uppercase font-bold text-blue-600/70">Sana</div>
                        <div className="text-lg font-bold text-blue-700 dark:text-blue-400">₺{campaign.referrer_reward}</div>
                        <div className="text-[10px] font-medium text-blue-600">Nakit</div>
                      </div>
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