import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, MapPin } from "lucide-react";
import { createClient } from "@/utils/supabase/server"; // Server Client kullanıyoruz

// Veri Çeken Fonksiyon
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
    .eq('status', 'active') // Sadece aktif kampanyalar
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Veri çekme hatası:", error);
    return [];
  }
  return data;
}

export default async function Home() {
  const campaigns = await getCampaigns();

  return (
    <div className="flex flex-col gap-8">

      {/* HERO SECTION (Aynı kalıyor, sadece dinamik veri sayısına göre güncellenebilir) */}
      <section className="flex flex-col items-center text-center py-10 md:py-20 space-y-4">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
          🚀 İstanbul'da {campaigns.length > 0 ? `${campaigns.length} Fırsat` : "Yayındayız!"}
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Referans Ol, <span className="text-blue-600">Nakit Kazan.</span>
        </h1>
        <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
          Sevdiğin mekanları arkadaşlarına öner, onlar indirim alsın, sen anında nakit kazan.
        </p>
      </section>

      {/* KAMPANYALAR LİSTESİ */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Popüler Kampanyalar 🔥</h2>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
            <p className="text-zinc-500">Henüz aktif kampanya yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Link href={`/campaign/${campaign.id}`} key={campaign.id}>
                <div className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all cursor-pointer dark:bg-zinc-900 dark:border-zinc-800 h-full flex flex-col">
                  {/* Görsel Alanı */}
                  <div className="aspect-video w-full bg-zinc-200 relative overflow-hidden">
                    {/* İleride buraya campaign.image_url gelecek */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-xs font-bold text-green-700 backdrop-blur-sm">
                      ₺{campaign.referrer_reward} Kazan
                    </div>
                    <div className="absolute bottom-3 left-3 text-white font-bold text-lg">
                      {campaign.title}
                    </div>
                  </div>

                  {/* İçerik */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-base line-clamp-1">{campaign.businesses?.name}</h3>
                        <div className="flex items-center text-yellow-500 text-xs shrink-0 bg-yellow-50 px-1.5 py-0.5 rounded-md dark:bg-yellow-900/20">
                          <Star className="fill-current w-3 h-3 mr-1" />
                          5.0
                        </div>
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
                        {campaign.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-2">
                      <div className="text-xs text-zinc-400 flex items-center">
                        <MapPin size={12} className="mr-1" />
                        {campaign.businesses?.district}, {campaign.businesses?.city}
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-300">
                        ₺{campaign.discount_amount} İndirim
                      </span>
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