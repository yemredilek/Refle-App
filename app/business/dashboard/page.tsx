import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, CreditCard, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function BusinessDashboard() {
    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h1 className="text-2xl font-bold">Diş Hekimi Dr. Ece</h1>
                    <p className="text-sm text-zinc-500">İşletme Paneli</p>
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
                            <TrendingUp size={18} className="text-green-500 dark:text-green-600" />
                        </div>
                        <div>
                            <span className="text-xs opacity-70">Net Ciro (Bu Ay)</span>
                            <div className="text-2xl font-bold">₺45.200</div>
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
                                <div className="text-lg font-bold">142</div>
                                <div className="text-[10px] text-zinc-500">Yeni Müşteri</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="flex-1">
                        <CardContent className="p-3 flex items-center gap-3">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-full dark:bg-orange-900/30 dark:text-orange-400">
                                <CreditCard size={16} />
                            </div>
                            <div>
                                <div className="text-lg font-bold">₺4.500</div>
                                <div className="text-[10px] text-zinc-500">Dağıtılan Ödül</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 2. AKTİF KAMPANYALAR */}
            <div className="px-2">
                <h3 className="font-semibold text-lg mb-3">Aktif Kampanyalar</h3>
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-900/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-blue-900 dark:text-blue-100">Diş Taşı Temizliği</h4>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                Liste Fiyatı: ₺2.000 <span className="mx-1">•</span> Bütçe: ₺500
                            </p>
                        </div>
                        <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
                            AKTİF
                        </div>
                    </div>
                    <div className="mt-4 flex gap-4 text-xs text-zinc-600 dark:text-zinc-400">
                        <div>👥 <strong>24</strong> Yönlendirme</div>
                        <div>✅ <strong>8</strong> Satış</div>
                    </div>
                </div>
            </div>

            {/* 3. SON İŞLEMLER */}
            <div className="px-2">
                <h3 className="font-semibold text-lg mb-3">Son İşlemler</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 text-xs font-bold dark:bg-zinc-800">
                                    MK
                                </div>
                                <div>
                                    <div className="text-sm font-medium">Mehmet K. (Müşteri)</div>
                                    <div className="text-[10px] text-zinc-400">Ref: Ahmet Y.</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold">+₺1.800</div>
                                <div className="text-[10px] text-zinc-400">14:30</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}