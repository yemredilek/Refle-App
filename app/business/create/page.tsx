"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Info } from "lucide-react";

export default function CreateCampaign() {
    const [price, setPrice] = useState<string>("");
    const [budget, setBudget] = useState<string>("");

    // Basit Hesaplama Mantığı (Simülasyon)
    const priceNum = parseFloat(price) || 0;
    const budgetNum = parseFloat(budget) || 0;

    const platformFee = budgetNum * 0.20; // %20 Bizim
    const customerDiscount = budgetNum * 0.40; // %40 İndirim
    const referrerReward = budgetNum * 0.40; // %40 Referans Ödülü

    const finalPrice = priceNum - customerDiscount;

    return (
        <div className="flex flex-col h-full px-4 py-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold">Yeni Kampanya</h1>
                <p className="text-zinc-500 text-sm">Siz sadece bütçenizi belirleyin, gerisini Refle algoritması halletsin.</p>
            </div>

            {/* GİRİŞ ALANLARI */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Hizmet / Ürün Liste Fiyatı (₺)</label>
                    <Input
                        type="number"
                        placeholder="Örn: 1000"
                        className="text-lg h-12"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Ayırdığınız Bütçe (₺)</label>
                        <span className="text-xs text-blue-600 flex items-center gap-1"><Sparkles size={12} /> Önerilen: %20</span>
                    </div>
                    <Input
                        type="number"
                        placeholder="Örn: 200"
                        className="text-lg h-12 border-blue-200 focus:ring-blue-500 dark:border-blue-800"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                    />
                    <p className="text-[10px] text-zinc-400">Bu tutar, satış gerçekleşirse cirodan düşülecek toplam maliyettir.</p>
                </div>
            </div>

            {/* SİHİRLİ HESAPLAMA KARTI (Canlı Önizleme) */}
            {priceNum > 0 && budgetNum > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-zinc-50 border-zinc-200 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="bg-zinc-100 p-3 text-xs font-semibold text-zinc-500 text-center border-b border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
                            REFLE DAĞITIM ALGORİTMASI
                        </div>
                        <div className="p-4 space-y-4">

                            {/* Müşteri Tarafı */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-zinc-600 dark:text-zinc-400">Müşteriye İndirim</div>
                                <div className="font-bold text-green-600 text-lg">-₺{customerDiscount.toFixed(0)}</div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-700">
                                <div className="text-sm text-zinc-900 font-medium dark:text-zinc-100">Kasa Tahsilatı (Net)</div>
                                <div className="font-bold text-zinc-900 text-xl dark:text-zinc-50">₺{finalPrice.toFixed(0)}</div>
                            </div>

                            {/* Referans Tarafı */}
                            <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center mt-2 dark:bg-blue-900/20">
                                <div className="text-xs text-blue-700 dark:text-blue-300">Referansçı Kazanır</div>
                                <div className="font-bold text-blue-700 dark:text-blue-300">+₺{referrerReward.toFixed(0)}</div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <div className="flex-1"></div>

            <Button size="lg" className="w-full rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-900">
                Kampanyayı Başlat <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
        </div>
    );
}