import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">

      {/* HERO SECTION: Masaüstünde büyük, mobilde sade */}
      <section className="flex flex-col items-center text-center py-10 md:py-20 space-y-4">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
          🚀 İstanbul'da Yayındayız!
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Referans Ol, <span className="text-blue-600">Nakit Kazan.</span>
        </h1>
        <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
          Sevdiğin mekanları arkadaşlarına öner, onlar indirim alsın, sen anında nakit kazan. Kaybetmek yok, sadece kazanmak var.
        </p>
        <div className="flex gap-4 pt-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-full">
            Hemen Refle
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* KAMPANYALAR LİSTESİ (Grid Yapısı) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Popüler Kampanyalar 🔥</h2>
          <span className="text-sm text-blue-600 cursor-pointer hover:underline">Tümünü Gör</span>
        </div>

        {/* Responsive Grid: Mobilde 1 sütun, Tablette 2, Masaüstünde 3 sütun */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Örnek Kartlar */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Link href={`/campaign/${item}`} key={item}>
              <div key={item} className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all dark:bg-zinc-900 dark:border-zinc-800">
                {/* Görsel Alanı */}
                <div className="aspect-video w-full bg-zinc-200 relative">
                  {/* Next/Image buraya gelecek */}
                  <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-xs font-bold text-green-700 backdrop-blur-sm">
                    ₺500 Kazan
                  </div>
                </div>

                {/* İçerik */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">Diş Hekimi Dr. Ece</h3>
                    <div className="flex items-center text-yellow-500 text-xs">
                      <Star className="fill-current w-3 h-3 mr-1" />
                      4.9
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 line-clamp-2">
                    Diş taşı temizliği ve beyazlatma işlemlerinde %20 indirim.
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-zinc-400">Kadıköy, Moda</div>
                    <Button variant="outline" size="sm" className="rounded-full">
                      İncele
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}

        </div>
      </section>
    </div>
  );
}