import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, QrCode, Share2 } from "lucide-react";

export default function ScanPage() {
    return (
        <div className="flex flex-col h-[80vh] items-center justify-center text-center space-y-6 px-6">

            <div className="bg-blue-50 p-6 rounded-full dark:bg-blue-900/20">
                <QrCode size={48} className="text-blue-600 dark:text-blue-400" />
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-bold">Kimi Refleyeceksin?</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs mx-auto">
                    Arkadaşına göndermek için bir işletme seç ve indirim kodunu oluştur.
                </p>
            </div>

            {/* Arama Kutusu */}
            <div className="w-full max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
                <Input
                    placeholder="İşletme ara (Örn: Dişçi, Burger)..."
                    className="pl-10 h-12 rounded-xl bg-zinc-100 border-transparent focus:bg-white transition-all dark:bg-zinc-900"
                />
            </div>

            {/* Hızlı Öneriler */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                {["☕ Kahve", "🍔 Yemek", "✂️ Kuaför", "🦷 Sağlık"].map((tag) => (
                    <Button key={tag} variant="outline" className="h-10 rounded-xl text-zinc-600 dark:text-zinc-300">
                        {tag}
                    </Button>
                ))}
            </div>

            <div className="pt-8">
                <p className="text-xs text-zinc-400 mb-4">veya işletme yanındaysa</p>
                <Button size="lg" className="w-full max-w-sm rounded-xl gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
                    <Share2 size={18} />
                    Kodumu Göster (Manuel)
                </Button>
            </div>

        </div>
    );
}