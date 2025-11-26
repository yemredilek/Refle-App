"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownLeft, ArrowUpRight, Calendar, Filter, SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function WalletHistoryPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchTx = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // İşlemleri Çek (Businesses tablosunu join ederek)
            const { data } = await supabase
                .from('transactions')
                .select(`
                *,
                businesses (name)
            `)
                .eq('referrer_id', user.id)
                .order('created_at', { ascending: false });

            setTransactions(data || []);
            setLoading(false);
        };
        fetchTx();
    }, []);

    // Filtreleme Mantığı
    const earnings = transactions; // Şimdilik hepsi kazanç (para çekme tablosu ayrı olacaksa burası değişir)
    // const withdrawals = transactions.filter(t => t.type === 'payout'); // İleride eklenecek

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
            {/* Header */}
            <div className="flex items-center gap-2 p-4 bg-white border-b border-zinc-100 sticky top-0 z-10 dark:bg-black dark:border-zinc-800">
                <Link href="/wallet">
                    <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
                </Link>
                <h1 className="text-lg font-semibold">Hesap Hareketleri</h1>
            </div>

            <div className="p-4">
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="w-full grid grid-cols-3 mb-6">
                        <TabsTrigger value="all">Hepsi</TabsTrigger>
                        <TabsTrigger value="earnings">Gelen</TabsTrigger>
                        <TabsTrigger value="withdrawals">Giden</TabsTrigger>
                    </TabsList>

                    {/* İÇERİK LİSTESİ */}
                    <TabsContent value="all" className="space-y-3">
                        <TransactionList items={transactions} loading={loading} />
                    </TabsContent>

                    <TabsContent value="earnings" className="space-y-3">
                        <TransactionList items={earnings} loading={loading} type="earning" />
                    </TabsContent>

                    <TabsContent value="withdrawals" className="space-y-3">
                        {/* Henüz veri yok, boş state gösterelim */}
                        <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                            <SearchX size={48} className="mb-2 opacity-20" />
                            <p className="text-sm">Henüz para çekimi yok.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// Liste Bileşeni (Papara Style)
function TransactionList({ items, loading, type = 'all' }: { items: any[], loading: boolean, type?: string }) {
    if (loading) return <div className="text-center py-10 text-sm text-zinc-500">Yükleniyor...</div>;

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                <Filter size={48} className="mb-2 opacity-20" />
                <p className="text-sm">Bu filtrede işlem bulunamadı.</p>
            </div>
        );
    }

    return (
        <>
            {items.map((tx) => (
                <div key={tx.id} className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm active:scale-[0.99] transition-transform dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                        {/* İkon */}
                        <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 dark:bg-green-900/20">
                            <ArrowDownLeft size={24} />
                        </div>

                        {/* Detay */}
                        <div>
                            <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1">
                                {tx.businesses?.name || "Referans Geliri"}
                            </p>
                            <div className="flex items-center text-xs text-zinc-500 gap-1 mt-0.5">
                                <span>{new Date(tx.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                                <span>{new Date(tx.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tutar */}
                    <div className="text-right">
                        <div className="font-bold text-green-600 text-base">+₺{tx.amount_reward}</div>
                        <div className="text-[10px] text-green-600/60 bg-green-50 px-1.5 py-0.5 rounded inline-block mt-1 dark:bg-green-900/20">
                            Başarılı
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}