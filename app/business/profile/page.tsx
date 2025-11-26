"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, CreditCard, Bell, ShieldCheck, Loader2, Save, MapPin } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { TURKEY_LOCATIONS } from "@/constants/locations";

export default function BusinessProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"general" | "payment" | "notifications">("general");

    const [data, setData] = useState({
        id: "",
        name: "",
        company_type: "",
        tax_id: "",
        description: "",
        city: "",
        district: "",
        address: "",
        credit_card_token: "",
    });

    // Kredi Kartı Formu (Sadece Client State)
    const [cardForm, setCardForm] = useState({
        holder: "",
        number: "",
        exp: "",
        cvv: ""
    });

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: business } = await supabase
                .from('businesses')
                .select('*')
                .eq('owner_id', user.id)
                .single();

            if (business) {
                setData({
                    id: business.id,
                    name: business.name || "",
                    company_type: business.company_type || "",
                    tax_id: business.tax_id || "",
                    description: business.description || "",
                    city: business.city || "",
                    district: business.district || "",
                    address: business.address || "",
                    credit_card_token: business.credit_card_token || "",
                });
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    // GENEL BİLGİLERİ GÜNCELLE
    const handleUpdateGeneral = async () => {
        setSaving(true);
        const { error } = await supabase
            .from('businesses')
            .update({
                description: data.description,
                city: data.city,
                district: data.district,
                address: data.address
            })
            .eq('id', data.id);

        if (error) toast.error("Güncelleme başarısız: " + error.message);
        else toast.success("Profil bilgileri güncellendi!");
        setSaving(false);
    };

    // KART FORMATLAMA YARDIMCILARI
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/g, "");
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.substring(i, i + 4));
        }
        return parts.length > 1 ? parts.join(" ") : value;
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/[^0-9]/g, "");
        if (v.length >= 2) {
            return v.substring(0, 2) + "/" + v.substring(2, 4);
        }
        return v;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        if (formatted.length <= 19) { // 16 hane + 3 boşluk
            setCardForm(prev => ({ ...prev, number: formatted }));
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiry(e.target.value);
        if (formatted.length <= 5) { // MM/YY
            setCardForm(prev => ({ ...prev, exp: formatted }));
        }
    };

    // KREDİ KARTI EKLEME (Simülasyon)
    const handleSaveCard = async () => {
        if (cardForm.number.length < 19 || !cardForm.cvv || !cardForm.exp) {
            toast.error("Lütfen kart bilgilerini eksiksiz giriniz.");
            return;
        }

        setSaving(true);
        // Gerçek hayatta burası Iyzico/Stripe'a gider, token döner.
        // Simülasyon: Son 4 haneyi saklayalım.
        const last4 = cardForm.number.replace(/\s/g, "").slice(-4);
        const mockToken = `visa_token_xx${last4}`;

        const { error } = await supabase
            .from('businesses')
            .update({ credit_card_token: mockToken })
            .eq('id', data.id);

        if (error) {
            toast.error("Kart eklenemedi.");
        } else {
            toast.success("Kart başarıyla eklendi!");
            setData(prev => ({ ...prev, credit_card_token: mockToken }));
            setCardForm({ holder: "", number: "", exp: "", cvv: "" }); // Formu temizle
        }
        setSaving(false);
    };

    // KARTI SİL
    const handleRemoveCard = async () => {
        if (!confirm("Kart silinecek. Onaylıyor musunuz?")) return;
        setSaving(true);
        await supabase.from('businesses').update({ credit_card_token: null }).eq('id', data.id);
        setData(prev => ({ ...prev, credit_card_token: "" }));
        toast.success("Kart kaldırıldı.");
        setSaving(false);
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="flex flex-col gap-6 pb-24">

            {/* Header */}
            <div className="bg-zinc-900 text-white p-6 pb-6 rounded-b-3xl dark:bg-zinc-800">
                <h1 className="text-xl font-bold mb-4">İşletme Ayarları</h1>
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center text-zinc-900 shadow-lg">
                        <Building2 size={28} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">{data.name}</h2>
                        <p className="text-white/60 text-xs">{data.company_type} • {data.city}</p>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex gap-1 bg-white/10 p-1 rounded-xl">
                    <button onClick={() => setActiveTab("general")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'general' ? 'bg-white text-black shadow' : 'text-white/70 hover:bg-white/5'}`}>Genel</button>
                    <button onClick={() => setActiveTab("payment")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'payment' ? 'bg-white text-black shadow' : 'text-white/70 hover:bg-white/5'}`}>Ödeme</button>
                    <button onClick={() => setActiveTab("notifications")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'notifications' ? 'bg-white text-black shadow' : 'text-white/70 hover:bg-white/5'}`}>Bildirim</button>
                </div>
            </div>

            {/* İçerik Alanı */}
            <div className="px-4">
                <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 dark:bg-zinc-900 dark:border-zinc-800">

                    {/* --- TAB 1: GENEL BİLGİLER --- */}
                    {activeTab === "general" && (
                        <div className="space-y-5 animate-in fade-in">

                            {/* KİLİTLİ ALANLAR */}
                            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-3 dark:bg-zinc-800/50 dark:border-zinc-700 mb-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase">
                                    🔒 Resmi Bilgiler
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs text-zinc-500">İşletme Adı</Label>
                                    <Input value={data.name} disabled className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 h-10 text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-1">
                                        <Label className="text-xs text-zinc-500">Vergi No</Label>
                                        <Input value={data.tax_id} disabled className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 h-10 text-sm" />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label className="text-xs text-zinc-500">Şirket Türü</Label>
                                        <Input value={data.company_type} disabled className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 h-10 text-sm" />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-zinc-100 dark:border-zinc-800" />

                            {/* DÜZENLENEBİLİR ALANLAR */}
                            <div className="space-y-2">
                                <Label>Vitrin Açıklaması</Label>
                                <Textarea
                                    className="min-h-[100px]"
                                    value={data.description}
                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                    placeholder="Müşterilerinize kendinizi tanıtın..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>İl</Label>
                                    <Select
                                        value={data.city}
                                        onValueChange={(val) => setData({ ...data, city: val, district: "" })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seçiniz" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(TURKEY_LOCATIONS).map(city => (
                                                <SelectItem key={city} value={city}>{city}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>İlçe</Label>
                                    <Select
                                        value={data.district}
                                        onValueChange={(val) => setData({ ...data, district: val })}
                                        disabled={!data.city}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seçiniz" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {data.city && TURKEY_LOCATIONS[data.city]?.map(dist => (
                                                <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Tam Adres</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-zinc-400 h-4 w-4" />
                                    <Textarea
                                        className="min-h-20 pl-10"
                                        value={data.address}
                                        onChange={(e) => setData({ ...data, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button onClick={handleUpdateGeneral} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                {saving ? <Loader2 className="animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Kaydet</>}
                            </Button>
                        </div>
                    )}

                    {/* --- TAB 2: ÖDEME AYARLARI --- */}
                    {activeTab === "payment" && (
                        <div className="space-y-6 animate-in fade-in">

                            {data.credit_card_token ? (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between dark:bg-green-900/20 dark:border-green-800">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600">
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-green-800 dark:text-green-300">•••• •••• •••• {data.credit_card_token.slice(-4)}</p>
                                            <p className="text-xs text-green-600 dark:text-green-400">Komisyon ödemeleri aktif</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={handleRemoveCard} className="text-red-500 hover:bg-red-100">Kaldır</Button>
                                </div>
                            ) : (
                                <div className="p-3 bg-orange-50 text-orange-800 text-sm rounded-lg border border-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">
                                    Komisyon tahsilatı için lütfen bir kart ekleyin. Kart bilgileriniz saklanmaz, ödeme altyapısı son teknoloji önlemler ile korunur.
                                </div>
                            )}

                            {!data.credit_card_token && (
                                <div className="space-y-4 border-t pt-4 border-zinc-100 dark:border-zinc-800">
                                    <div className="space-y-2">
                                        <Label>Kart Üzerindeki İsim</Label>
                                        <Input
                                            placeholder="Ad Soyad"
                                            value={cardForm.holder}
                                            onChange={e => setCardForm({ ...cardForm, holder: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Kart Numarası</Label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-3 text-zinc-400 h-4 w-4" />
                                            <Input
                                                placeholder="0000 0000 0000 0000"
                                                className="pl-10 font-mono"
                                                maxLength={19}
                                                value={cardForm.number}
                                                onChange={handleCardNumberChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>SKT (Ay/Yıl)</Label>
                                            <Input
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                value={cardForm.exp}
                                                onChange={handleExpiryChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>CVV</Label>
                                            <Input
                                                placeholder="123"
                                                maxLength={3}
                                                type="password"
                                                value={cardForm.cvv}
                                                onChange={e => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '') })}
                                            />
                                        </div>
                                    </div>
                                    <Button onClick={handleSaveCard} disabled={saving} className="w-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black">
                                        {saving ? <Loader2 className="animate-spin" /> : "Kartı Ekle"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- TAB 3: BİLDİRİMLER (MOCK) --- */}
                    {activeTab === "notifications" && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg dark:bg-zinc-800/50">
                                <div className="flex items-center gap-3">
                                    <Bell size={18} className="text-zinc-500" />
                                    <div className="text-sm">
                                        <p className="font-medium">Yeni Satış Bildirimi</p>
                                        <p className="text-xs text-zinc-500">Kod kullanıldığında haber ver</p>
                                    </div>
                                </div>
                                <input type="checkbox" className="accent-blue-600 w-5 h-5" defaultChecked />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg dark:bg-zinc-800/50">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={18} className="text-zinc-500" />
                                    <div className="text-sm">
                                        <p className="font-medium">Haftalık Rapor</p>
                                        <p className="text-xs text-zinc-500">E-posta ile özet gönder</p>
                                    </div>
                                </div>
                                <input type="checkbox" className="accent-blue-600 w-5 h-5" />
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}