import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, BarChart3, Calendar, Users } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

async function getMyCampaigns() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // İşletme ID'sini bul
    const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

    if (!business) return [];

    // Kampanyaları çek
    const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

    return data || [];
}

export default async function CampaignsListPage() {
    const campaigns = await getMyCampaigns();

    return (
        <div className="flex flex-col gap-6 pb-24 px-4 pt-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Kampanyalarım</h1>
                    <p className="text-sm text-zinc-500">Aktif ve geçmiş kampanyalarınızı yönetin.</p>
                </div>
                <Button asChild size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/business/create">
                        <Plus className="w-5 h-5" />
                    </Link>
                </Button>
            </div>

            <div className="space-y-4">
                {campaigns.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800">
                        <BarChart3 className="w-12 h-12 text-zinc-300 mb-2" />
                        <p className="text-zinc-500 font-medium">Henüz kampanya yok</p>
                        <p className="text-xs text-zinc-400 mb-4">İlk kampanyanı oluşturarak müşteri kazanmaya başla.</p>
                        <Button asChild variant="outline">
                            <Link href="/business/create">Kampanya Oluştur</Link>
                        </Button>
                    </div>
                ) : (
                    campaigns.map((camp) => (
                        <Link href={`/business/campaigns/${camp.id}`} key={camp.id}>
                            <Card className="hover:border-blue-300 transition-colors cursor-pointer dark:hover:border-blue-700">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{camp.title}</h3>
                                        <StatusBadge status={camp.status} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                        <div>
                                            <p className="text-zinc-500 text-xs">Kullanım</p>
                                            <div className="flex items-center gap-1 font-medium">
                                                <Users size={14} className="text-blue-500" />
                                                {camp.current_uses} / {camp.max_uses ? camp.max_uses : "∞"}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-zinc-500 text-xs">Son Tarih</p>
                                            <div className="flex items-center gap-1 font-medium">
                                                <Calendar size={14} className="text-orange-500" />
                                                {camp.expires_at ? new Date(camp.expires_at).toLocaleDateString('tr-TR') : "Süresiz"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center dark:border-zinc-800">
                                        <span className="text-xs text-zinc-400">Oluşturuldu: {new Date(camp.created_at).toLocaleDateString('tr-TR')}</span>
                                        <div className="text-blue-600 text-xs font-bold flex items-center gap-1">
                                            <Edit size={12} /> Düzenle
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        paused: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        ended: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
    };
    const labels = {
        active: "Aktif",
        paused: "Durduruldu",
        ended: "Sona Erdi"
    };
    return (
        <Badge variant="secondary" className={styles[status as keyof typeof styles]}>
            {labels[status as keyof typeof labels] || status}
        </Badge>
    );
}