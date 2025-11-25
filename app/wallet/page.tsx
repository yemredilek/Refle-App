import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, History, Wallet, TrendingUp, ChevronRight } from "lucide-react";

export default function WalletPage() {
    return (
        <div className="flex flex-col gap-6 pb-20">
            <h1 className="text-2xl font-bold px-2">Cüzdanım</h1>

            {/* 1. BAKİYE KARTI (Gradient Tasarım) */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
                {/* Arka plan süslemesi */}
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-blue-100 mb-1">
                        <Wallet size={18} />
                        <span className="text-sm font-medium">Toplam Kazanç</span>
                    </div>
                    <div className="text-4xl font-bold tracking-tight mb-6">
                        ₺2.450<span className="text-lg text-blue-200">,00</span>
                    </div>

                    <div className="flex gap-3">
                        <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50 border-0 font-semibold rounded-full">
                            <ArrowUpRight size={16} className="mr-1" />
                            Para Çek
                        </Button>
                        <Button size="sm" variant="outline" className="bg-blue-600/20 text-white border-white/20 hover:bg-blue-600/30 rounded-full backdrop-blur-md">
                            <History size={16} className="mr-1" />
                            Geçmiş
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. BEKLEYEN BAKİYE (Özet Bilgi) */}
            <div className="grid grid-cols-2 gap-4 px-2">
                <Card className="bg-orange-50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-900/20">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">Onay Bekleyen</span>
                        <span className="text-xl font-bold text-orange-700 dark:text-orange-300">₺350</span>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/20">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Bu Ay</span>
                        <div className="flex items-center gap-1 text-green-700 dark:text-green-300">
                            <TrendingUp size={16} />
                            <span className="text-xl font-bold">₺1.200</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 3. SON HAREKETLER */}
            <div className="px-2">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Son Hareketler</h3>
                    <span className="text-xs text-zinc-500">Son 30 gün</span>
                </div>

                <div className="space-y-3">
                    {/* İşlem Listesi (Mock Data) */}
                    {[
                        { title: "Diş Hekimi Dr. Ece", date: "Bugün, 14:30", amount: "+500", status: "success" },
                        { title: "Kadıköy Kahvecisi", date: "Dün, 09:15", amount: "+25", status: "success" },
                        { title: "Oto Yıkama Plus", date: "23 Kas", amount: "+150", status: "pending" },
                        { title: "Para Çekme", date: "20 Kas", amount: "-1.000", status: "withdraw" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                        item.status === 'withdraw' ? 'bg-zinc-100 text-zinc-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                    {item.status === 'withdraw' ? <ArrowUpRight size={18} /> : <Wallet size={18} />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{item.title}</p>
                                    <p className="text-xs text-zinc-500">{item.date} • {item.status === 'pending' ? 'Onay Bekliyor' : 'Tamamlandı'}</p>
                                </div>
                            </div>
                            <div className={`font-bold ${item.status === 'withdraw' ? 'text-zinc-900 dark:text-zinc-100' : 'text-green-600'}`}>
                                {item.amount} ₺
                            </div>
                        </div>
                    ))}
                </div>

                <Button variant="ghost" className="w-full mt-4 text-zinc-500 hover:text-zinc-900">
                    Tümünü Gör <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    );
}