"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, CreditCard, Loader2, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface BankAccount {
    id: string;
    bank_name: string;
    account_holder: string;
    iban: string;
}

export default function PaymentMethodsPage() {
    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState<BankAccount[]>([]);

    // Yeni Ekleme State'leri
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ bankName: "", holder: "", iban: "" });
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    // Hesapları Çek
    const fetchAccounts = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('bank_accounts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (data) setAccounts(data);
        setLoading(false);
    };

    useEffect(() => { fetchAccounts(); }, []);

    // Formatlama Yardımcıları
    const formatIBAN = (val: string) => {
        let value = val.toUpperCase().replace(/[^A-Z0-9]/g, "");
        if (value.length > 26) value = value.slice(0, 26);
        if (!value.startsWith("TR") && value.length > 0) value = "TR" + value.replace("TR", "");
        return value.match(/.{1,4}/g)?.join(" ") || value;
    };

    const handleSave = async () => {
        const cleanIban = formData.iban.replace(/\s/g, "");
        if (cleanIban.length !== 26) {
            toast.error("Geçersiz IBAN.");
            return;
        }
        if (!formData.bankName || !formData.holder) {
            toast.error("Tüm alanları doldurunuz.");
            return;
        }

        if (accounts.some(acc => acc.iban === cleanIban)) {
            toast.error("Bu IBAN zaten kayıtlı.");
            return;
        }

        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from('bank_accounts').insert({
            user_id: user?.id,
            bank_name: formData.bankName,
            account_holder: formData.holder,
            iban: cleanIban
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Hesap eklendi.");
            setIsAdding(false);
            setFormData({ bankName: "", holder: "", iban: "" });
            fetchAccounts(); // Listeyi yenile
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('bank_accounts').delete().eq('id', id);
        if (!error) {
            toast.success("Hesap silindi.");
            setAccounts(prev => prev.filter(a => a.id !== id));
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
            <div className="flex items-center gap-2 p-4 bg-white border-b border-zinc-100 dark:bg-black dark:border-zinc-800">
                <Link href="/profile">
                    <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
                </Link>
                <h1 className="text-lg font-semibold">Ödeme Yöntemleri</h1>
            </div>

            <div className="p-4 space-y-6">

                {/* HESAP LİSTESİ */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-zinc-500 uppercase">Kayıtlı Hesaplar ({accounts.length})</h3>
                        {!isAdding && (
                            <Button size="sm" variant="outline" onClick={() => setIsAdding(true)}>
                                <Plus size={16} className="mr-1" /> Yeni Ekle
                            </Button>
                        )}
                    </div>

                    {accounts.length === 0 && !isAdding && (
                        <div className="p-8 text-center border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400">
                            Henüz hesap eklemediniz.
                        </div>
                    )}

                    {accounts.map((acc) => (
                        <Card key={acc.id} className="p-4 flex items-center justify-between bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 dark:bg-zinc-800">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{acc.bank_name}</p>
                                    <p className="text-xs text-zinc-500">{acc.account_holder}</p>
                                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                        {acc.iban.match(/.{1,4}/g)?.join(" ")}
                                    </p>
                                </div>
                            </div>

                            {/* MODERN ALERT DIALOG */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500">
                                        <Trash2 size={18} />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Hesabı silmek istiyor musunuz?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Bu işlem geri alınamaz. Bu hesaba artık ödeme alamazsınız.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(acc.id)} className="bg-red-600 hover:bg-red-700">
                                            Evet, Sil
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </Card>
                    ))}
                </div>

                {/* EKLEME FORMU (Animasyonlu Açılış) */}
                {isAdding && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 animate-in slide-in-from-bottom-4 dark:bg-zinc-900 dark:border-zinc-800">
                        <h3 className="font-semibold mb-4">Yeni IBAN Ekle</h3>
                        <div className="space-y-4">
                            <div>
                                <Label>Banka Adı</Label>
                                <Input placeholder="Örn: Enpara" value={formData.bankName} onChange={e => setFormData({ ...formData, bankName: e.target.value })} />
                            </div>
                            <div>
                                <Label>Hesap Sahibi</Label>
                                <Input placeholder="Ad Soyad" value={formData.holder} onChange={e => setFormData({ ...formData, holder: e.target.value })} />
                            </div>
                            <div>
                                <Label>IBAN</Label>
                                <Input
                                    placeholder="TR..."
                                    className="font-mono"
                                    maxLength={32}
                                    value={formData.iban}
                                    onChange={e => setFormData({ ...formData, iban: formatIBAN(e.target.value) })}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>iptal</Button>
                                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black">
                                    {saving ? <Loader2 className="animate-spin" /> : "Kaydet"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}