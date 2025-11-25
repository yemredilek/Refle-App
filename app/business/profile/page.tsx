import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Store, MapPin, Save, LogOut } from "lucide-react";

export default function BusinessProfilePage() {
    return (
        <div className="flex flex-col gap-6 pb-24">

            {/* Header */}
            <div className="bg-zinc-900 text-white p-6 pb-12 rounded-b-3xl dark:bg-zinc-800">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold">İşletme Ayarları</h1>
                    <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                        <LogOut size={20} />
                    </Button>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-20 w-20 bg-white rounded-2xl p-1 shadow-lg">
                        <div className="h-full w-full bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
                            <Store size={32} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Dr. Ece Klinik</h2>
                        <p className="text-white/60 text-sm">Sağlık & Güzellik</p>
                    </div>
                </div>
            </div>

            {/* Form Alanı */}
            <div className="px-4 -mt-6">
                <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 space-y-5 dark:bg-zinc-900 dark:border-zinc-800">

                    <div className="space-y-2">
                        <Label>İşletme Görünen Adı</Label>
                        <Input defaultValue="Diş Hekimi Dr. Ece" />
                    </div>

                    <div className="space-y-2">
                        <Label>Kısa Açıklama (Slogan)</Label>
                        <Input defaultValue="Gülüşünüzü değiştiriyoruz." />
                    </div>

                    <div className="space-y-2">
                        <Label>Detaylı Açıklama</Label>
                        <Textarea className="min-h-[100px]" defaultValue="20 yıldır Kadıköy'de hizmet veren kliniğimizde..." />
                    </div>

                    <div className="space-y-2">
                        <Label>Adres</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-zinc-400 h-4 w-4" />
                            <Textarea className="pl-10 min-h-20" defaultValue="Caferağa Mah. Moda Cad. No:12 Kadıköy/İstanbul" />
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base">
                            <Save className="mr-2 h-4 w-4" /> Kaydet
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}