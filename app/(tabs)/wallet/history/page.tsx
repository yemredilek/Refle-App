import { createClient } from "@/utils/supabase/server";
import { Card } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

async function getTransactions() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('transactions')
        .select(`
      *,
      businesses (name)
    `)
        .eq('referrer_id', user.id) // Sadece kullanıcının işlemleri
        .order('created_at', { ascending: false });

    return data || [];
}

export default async function WalletHistoryPage() {
    const transactions = await getTransactions();

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
            <div className="flex items-center gap-2 p-4 bg-white border-b border-zinc-100 sticky top-0 z-10 dark:bg-zinc-900 dark:border-zinc-800">
                <Link href="/wallet">
                    <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
                </Link>
                <h1 className="text-lg font-semibold">İşlem Geçmişi</h1>
            </div>

            <div className="p-4 space-y-3">
                {transactions.length === 0 ? (
                    <div className="text-center py-12 text-zinc-400 text-sm">Henüz işlem yok.</div>
                ) : (
                    transactions.map((tx) => (
                        <Card key={tx.id} className="p-4 flex items-center justify-between border-zinc-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <ArrowDownLeft size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{tx.businesses?.name}</p>
                                    <div className="flex items-center text-xs text-zinc-500 gap-1">
                                        <Calendar size={10} />
                                        {new Date(tx.created_at).toLocaleDateString('tr-TR')} • {new Date(tx.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-green-600 text-base">+₺{tx.amount_reward}</div>
                                <div className="text-[10px] text-zinc-400">Referans Geliri</div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}