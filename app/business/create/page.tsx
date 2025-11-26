"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, AlertCircle, Banknote, Percent } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateCampaign() {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState<string>("");

    // Bütçe Yönetimi
    const [budgetMode, setBudgetMode] = useState<"fixed" | "percentage">("fixed");
    const [budgetInput, setBudgetInput] = useState<string>(""); // Kullanıcının yazdığı (200 veya 20)
    const [calculatedBudget, setCalculatedBudget] = useState<number>(0); // Sisteme gidecek net TL (200)

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Sayıları parse et
    const priceNum = parseFloat(price) || 0;
    const budgetInputNum = parseFloat(budgetInput) || 0;

    // Bütçeyi Hesapla (Her input değiştiğinde çalışır)
    useEffect(() => {
        if (budgetMode === "fixed") {
            setCalculatedBudget(budgetInputNum);
        } else {
            // Yüzde Modu: Fiyatın %X'i
            if (priceNum > 0) {
                setCalculatedBudget((priceNum * budgetInputNum) / 100);
            } else {
                setCalculatedBudget(0);
            }
        }
    }, [budgetMode, budgetInput, priceNum]);

    // Refle Dağıtımı
    const platformFee = calculatedBudget * 0.20;
    const customerDiscount = calculatedBudget * 0.40;
    const referrerReward = calculatedBudget * 0.40;
    const finalPrice = priceNum - customerDiscount;

    // Validasyon Kontrolü
    const isValid = priceNum > 0 && calculatedBudget > 0 && calculatedBudget < priceNum;
    const errorMessage = calculatedBudget >= priceNum ? "Bütçe fiyattan yüksek olamaz!" : null;

    const handleCreate = async () => {
        if (!isValid || !title) {
            toast.error("Lütfen tüm alanları doğru şekilde doldurun.");
            return;
        }

        setLoading(true);

        // Backend her zaman NET TL tutarı (calculatedBudget) bekler.
        const { error } = await supabase.rpc('create_campaign', {
            p_title: title,
            p_description: "Standart Kampanya",
            p_list_price: priceNum,
            p_budget: calculatedBudget // Hesaplanan TL değeri gider
        });

        if (error) {
            toast.error("Hata: " + error.message);
            setLoading(false);
            return;
        }

        toast.success("Kampanya başarıyla oluşturuldu! 🎉");
        router.push("/business/dashboard");
    };

    return (
        <div className="flex flex-col h-full px-4 py-6 space-y-6 pb-24 bg-zinc-50 dark:bg-black min-h-screen">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">Yeni Kampanya</h1>
                <p className="text-zinc-500 text-sm">Bütçenizi belirleyin, gerisini algoritmaya bırakın.</p>
            </div>

            <div className="space-y-5">
                {/* BAŞLIK */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Kampanya Başlığı</label>
                    <Input
                        placeholder="Örn: Diş Taşı Temizliği"
                        className="h-12 bg-white dark:bg-zinc-900"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* FİYAT */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Liste Fiyatı (₺)</label>
                    <Input
                        type="number"
                        placeholder="Örn: 1000"
                        className="text-lg h-12 bg-white dark:bg-zinc-900"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                {/* BÜTÇE SEÇİM ALANI */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Toplam Pazarlama Bütçesi</label>

                        {/* TOGGLE SWITCH */}
                        <div className="flex bg-zinc-200 rounded-lg p-1 dark:bg-zinc-800">
                            <button
                                onClick={() => setBudgetMode("fixed")}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${budgetMode === "fixed" ? "bg-white shadow text-black" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"}`}
                            >
                                <Banknote size={14} /> TL
                            </button>
                            <button
                                onClick={() => setBudgetMode("percentage")}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${budgetMode === "percentage" ? "bg-white shadow text-black" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"}`}
                            >
                                <Percent size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <Input
                            type="number"
                            placeholder={budgetMode === "fixed" ? "Örn: 200" : "Örn: 20"}
                            className={`text-lg h-12 border-2 bg-white dark:bg-zinc-900 ${errorMessage ? "border-red-300 focus-visible:ring-red-500" : "border-blue-100 focus-visible:ring-blue-500 dark:border-blue-900/50"}`}
                            value={budgetInput}
                            onChange={(e) => setBudgetInput(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">
                            {budgetMode === "fixed" ? "₺" : "%"}
                        </div>
                    </div>

                    {/* Bilgilendirme veya Hata */}
                    {errorMessage ? (
                        <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errorMessage}</p>
                    ) : (
                        <p className="text-xs text-zinc-500">
                            {budgetMode === "percentage"
                                ? `Satış fiyatının %${budgetInputNum || 0}'si bütçe olarak ayrılacak.`
                                : "Bu tutar, her başarılı satışta cirodan düşülecektir."
                            }
                        </p>
                    )}
                </div>
            </div>

            {/* CANLI ÖNİZLEME KARTI */}
            {isValid && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-white border-zinc-200 overflow-hidden shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="bg-zinc-50 p-2 text-[10px] font-bold text-zinc-400 text-center uppercase tracking-wider border-b border-zinc-100 dark:bg-zinc-800 dark:border-zinc-700">
                            Dağıtım Algoritması
                        </div>
                        <div className="p-4 space-y-4">

                            {/* Müşteri Satırı */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Müşteri İndirimi</div>
                                    <div className="text-[10px] text-zinc-400">%40 Pay</div>
                                </div>
                                <div className="font-bold text-green-600 text-lg">-₺{customerDiscount.toFixed(0)}</div>
                            </div>

                            {/* Referans Satırı */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Referansçı Ödülü</div>
                                    <div className="text-[10px] text-zinc-400">%40 Pay</div>
                                </div>
                                <div className="font-bold text-blue-600 text-lg">+₺{referrerReward.toFixed(0)}</div>
                            </div>

                            <div className="border-t border-dashed border-zinc-200 my-2 dark:border-zinc-700"></div>

                            {/* Net Kasa Satırı */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Kasanıza Giren (Net)</div>
                                <div className="font-black text-zinc-900 text-2xl dark:text-white">₺{finalPrice.toFixed(0)}</div>
                            </div>

                            {budgetMode === "percentage" && (
                                <div className="text-center text-xs text-zinc-400 mt-2 bg-zinc-50 py-1 rounded dark:bg-zinc-800">
                                    Toplam Bütçe: ₺{calculatedBudget.toFixed(0)}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            <div className="flex-1"></div>

            <Button
                onClick={handleCreate}
                disabled={loading || !isValid}
                size="lg"
                className="w-full rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-lg font-bold dark:bg-zinc-50 dark:text-zinc-900"
            >
                {loading ? "Oluşturuluyor..." : "Kampanyayı Başlat"} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
        </div>
    );
}