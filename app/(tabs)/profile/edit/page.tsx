"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: ""
    });

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, phone')
                .eq('id', user.id)
                .single();

            setFormData({
                full_name: profile?.full_name || "",
                email: user.email || "", // Auth tablosundan
                phone: profile?.phone || "" // Read-only kalacak
            });
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleUpdate = async () => {
        setSaving(true);

        // 1. Profil Tablosunu Güncelle (İsim)
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ full_name: formData.full_name })
            .eq('id', (await supabase.auth.getUser()).data.user?.id);

        // 2. Auth Tablosunu Güncelle (Email) - Onay İstemeden
        // Not: Supabase varsayılan olarak email değişikliğinde onay maili atar.
        // Bunu aşmak için Supabase panelinden "Secure email change" kapatılmalıdır.
        // Şimdilik sadece fonksiyonu çağırıyoruz.
        const { error: authError } = await supabase.auth.updateUser({
            email: formData.email
        });

        if (profileError || authError) {
            toast.error("Hata: " + (profileError?.message || authError?.message));
        } else {
            toast.success("Profil başarıyla güncellendi!");
            router.refresh();
        }
        setSaving(false);
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-black">
            <div className="flex items-center gap-2 p-4 border-b border-zinc-100 dark:border-zinc-800">
                <Link href="/profile">
                    <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
                </Link>
                <h1 className="text-lg font-semibold">Kişisel Bilgiler</h1>
            </div>

            <div className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Ad Soyad</Label>
                        <Input
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="bg-zinc-50 dark:bg-zinc-900"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>E-Posta Adresi</Label>
                        <Input
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-zinc-50 dark:bg-zinc-900"
                        />
                        <p className="text-[10px] text-zinc-400">E-posta değişikliğinde doğrulama gerekebilir.</p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Telefon Numarası</Label>
                        <Input
                            value={formData.phone}
                            disabled
                            className="bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                        />
                        <p className="text-[10px] text-zinc-400">Telefon numarası güvenlik nedeniyle değiştirilemez.</p>
                    </div>
                </div>

                <Button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                >
                    {saving ? <Loader2 className="animate-spin" /> : "Değişiklikleri Kaydet"}
                </Button>
            </div>
        </div>
    );
}