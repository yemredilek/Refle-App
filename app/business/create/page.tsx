"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Sparkles, AlertCircle, Banknote, Percent, Calendar, Users, ShoppingBag } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateCampaign() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<string>("");

    // Bütçe Yönetimi
    const [budgetMode, setBudgetMode] = useState<"fixed" | "percentage">("fixed");
    const [budgetInput, setBudgetInput] = useState<string>("");
    const [calculatedBudget, setCalculatedBudget] = useState<number>(0);

    // Kısıtlamalar
    const [minSpend, setMinSpend] = useState<string>(""); // Min sepet
    const [maxUses, setMaxUses] = useState<string>(""); // Kişi limiti
    const [expiryDate, setExpiryDate] = useState<string>(""); // Bitiş tarihi

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const priceNum = parseFloat(price) || 0;
    const budgetInputNum = parseFloat(budgetInput) || 0;

    // Bütçe Hesaplama
    useEffect(() => {
        if (budgetMode === "fixed") {
            setCalculatedBudget(budgetInputNum);
        } else {
            if (priceNum > 0) {
                setCalculatedBudget((priceNum * budgetInputNum) / 100);
            } else {
                setCalculatedBudget(0);
            }
        }
    }, [budgetMode, budgetInput, priceNum]);

    const platformFee = calculatedBudget * 0.20;
    const customerDiscount = calculatedBudget * 0.40;
    const referrerReward = calculatedBudget * 0.40;
    const finalPrice = priceNum - customerDiscount;

    const isValid = priceNum > 0 && calculatedBudget > 0 && calculatedBudget < priceNum;
    const errorMessage = calculatedBudget >= priceNum ? "Bütçe fiyattan yüksek olamaz!" : null;

    const handleCreate = async () => {
        if (!isValid || !title) {
            toast.warning("Lütfen zorunlu alanları doldurun.");
            return;
        }

        setLoading(true);

        const { error } = await supabase.rpc('create_campaign', {
            p_title: title,
            p_description: description,
            p_list_price: priceNum,
            p_budget: calculatedBudget,
            // Yeni Parametreler
            p_min_spend: parseFloat(minSpend) || 0,
            p_max_uses: maxUses ? parseInt(maxUses) : null,
            p_expires_at: expiryDate ? new Date(expiryDate).toISOString() : null
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
                <p className="text-zinc-500 text-sm">Kampanya detaylarını ve limitlerini belirleyin.</p>
            </div>

            <div className="space-y-5">
                {/* TEMEL BİLGİLER */}
                <div className="bg-white p-4 rounded-xl border border-zinc-100 space-y-4 dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Kampanya Başlığı</label>
                        <Input placeholder="Örn: Diş Taşı Temizliği" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Liste Fiyatı (₺)</label>
                        <Input type="number" placeholder="1000" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                </div>

                {/* AÇIKLAMA ALANI */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Açıklama (İsteğe bağlı)</label>
                    <Textarea
                        placeholder="Kampanya detaylarını yazınız..."
                        className="min-h-20 resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* BÜTÇE */}
                <div className="bg-white p-4 rounded-xl border border-zinc-100 space-y-4 dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Pazarlama Bütçesi</label>
                        <div className="flex bg-zinc-100 rounded-lg p-1 dark:bg-zinc-800">
                            <button onClick={() => setBudgetMode("fixed")} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${budgetMode === "fixed" ? "bg-white shadow text-black" : "text-zinc-500"}`}>TL</button>
                            <button onClick={() => setBudgetMode("percentage")} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${budgetMode === "percentage" ? "bg-white shadow text-black" : "text-zinc-500"}`}>%</button>
                        </div>
                    </div>
                    <div className="relative">
                        <Input type="number" placeholder={budgetMode === "fixed" ? "200" : "20"} className={errorMessage ? "border-red-300" : "border-blue-200"} value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">{budgetMode === "fixed" ? "₺" : "%"}</div>
                    </div>
                    {errorMessage && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errorMessage}</p>}
                </div>

                {/* GELİŞMİŞ AYARLAR (LİMİTLER) */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase ml-1">Kısıtlamalar (Opsiyonel)</h3>
                    <div className="bg-white p-4 rounded-xl border border-zinc-100 space-y-4 dark:bg-zinc-900 dark:border-zinc-800">

                        {/* Min Sepet */}
                        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                            <ShoppingBag size={20} className="text-zinc-400" />
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Min. Harcama (₺)</label>
                                <Input type="number" placeholder="0 (Yok)" className="h-9 text-sm" value={minSpend} onChange={(e) => setMinSpend(e.target.value)} />
                            </div>
                        </div>

                        {/* Kişi Limiti */}
                        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                            <Users size={20} className="text-zinc-400" />
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Kişi Limiti</label>
                                <Input type="number" placeholder="Sınırsız" className="h-9 text-sm" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} />
                            </div>
                        </div>

                        {/* Tarih Limiti */}
                        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                            <Calendar size={20} className="text-zinc-400" />
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Son Geçerlilik Tarihi</label>
                                <Input type="date" className="h-9 text-sm" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ÖNİZLEME KARTI */}
            {isValid && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-zinc-50 border-zinc-200 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Müşteri İndirimi</span>
                                <span className="font-bold text-green-600">-₺{customerDiscount.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Referans Ödülü</span>
                                <span className="font-bold text-blue-600">+₺{referrerReward.toFixed(0)}</span>
                            </div>
                            <div className="border-t border-dashed border-zinc-200 pt-2 flex justify-between items-center">
                                <span className="font-bold text-zinc-900 dark:text-white">Kasa Tahsilatı</span>
                                <span className="font-black text-xl text-zinc-900 dark:text-white">₺{finalPrice.toFixed(0)}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <div className="flex-1"></div>

            <Button onClick={handleCreate} disabled={loading || !isValid} size="lg" className="w-full rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-lg font-bold dark:bg-zinc-50 dark:text-zinc-900">
                {loading ? "Oluşturuluyor..." : "Kampanyayı Başlat"} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
        </div>
    );
}