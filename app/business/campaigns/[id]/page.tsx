"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation"; // useParams yerine useRouter kullanıyoruz çünkü client component
import { useParams } from "next/navigation"; // ID almak için
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

export default function EditCampaignPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        max_uses: "",
        expires_at: "",
        status: "active",
        // Read-only fields (Bilgi amaçlı)
        list_price: 0,
        budget: 0,
        current_uses: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('campaigns')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error || !data) {
                toast.error("Kampanya bulunamadı.");
                router.push("/business/campaigns");
                return;
            }

            // Tarih formatını input[type="date"] için ayarla (YYYY-MM-DD)
            const dateStr = data.expires_at ? new Date(data.expires_at).toISOString().split('T')[0] : "";

            setFormData({
                title: data.title,
                description: data.description || "",
                max_uses: data.max_uses ? data.max_uses.toString() : "",
                expires_at: dateStr,
                status: data.status,
                list_price: data.list_price,
                budget: data.budget,
                current_uses: data.current_uses
            });
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleUpdate = async () => {
        setSaving(true);

        const { error } = await supabase.rpc('update_campaign_details', {
            p_campaign_id: params.id,
            p_title: formData.title,
            p_description: formData.description,
            p_max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
            p_expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
            p_status: formData.status
        });

        if (error) {
            toast.error("Güncelleme hatası: " + error.message);
        } else {
            toast.success("Kampanya güncellendi!");
            router.refresh();
        }
        setSaving(false);
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black pb-24">

            {/* Header */}
            <div className="bg-white border-b border-zinc-200 p-4 flex items-center gap-2 sticky top-0 z-10 dark:bg-zinc-900 dark:border-zinc-800">
                <Link href="/business/campaigns">
                    <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
                </Link>
                <div>
                    <h1 className="font-bold text-lg">Kampanya Düzenle</h1>
                    <p className="text-xs text-zinc-500">ID: {params.id?.toString().slice(0, 8)}...</p>
                </div>
            </div>

            <div className="p-4 space-y-6">

                {/* DURUM KARTI */}
                <div className="bg-white p-4 rounded-xl border border-zinc-200 space-y-4 dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Kampanya Durumu</label>
                        <Select
                            value={formData.status}
                            onValueChange={(val) => setFormData({ ...formData, status: val })}
                        >
                            <SelectTrigger className="w-40 h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">🟢 Aktif</SelectItem>
                                <SelectItem value="paused">🟠 Duraklat</SelectItem>
                                <SelectItem value="ended">🔴 Sonlandır</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-800 flex gap-2 items-start dark:bg-blue-900/20 dark:text-blue-300">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <p>
                            <strong>Dikkat:</strong> "Sonlandır" seçeneğini seçerseniz, dağıtılan kodlar geçersiz olabilir. Geçici durumlarda "Duraklat" kullanın.
                        </p>
                    </div>
                </div>

                {/* DETAYLAR */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Başlık</label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Açıklama</label>
                        <Textarea
                            className="min-h-[100px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                {/* LİMİTLER */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Kişi Limiti</label>
                        <Input
                            type="number"
                            placeholder="Sınırsız"
                            value={formData.max_uses}
                            onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Son Tarih</label>
                        <Input
                            type="date"
                            value={formData.expires_at}
                            onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                        />
                    </div>
                </div>

                {/* FİNANSAL (READ-ONLY) */}
                <div className="p-4 bg-zinc-100 rounded-xl space-y-2 border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700">
                    <p className="text-xs font-bold text-zinc-400 uppercase">Finansal Bilgiler (Değiştirilemez)</p>
                    <div className="flex justify-between text-sm">
                        <span>Liste Fiyatı:</span>
                        <span className="font-mono">₺{formData.list_price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Toplam Bütçe:</span>
                        <span className="font-mono">₺{formData.budget}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-blue-600">
                        <span>Kullanım:</span>
                        <span>{formData.current_uses} Adet</span>
                    </div>
                </div>

                <Button onClick={handleUpdate} disabled={saving} className="w-full h-12 text-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-900">
                    {saving ? <Loader2 className="animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet</>}
                </Button>

            </div>
        </div>
    );
}