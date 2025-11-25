import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, CreditCard, Trash2 } from "lucide-react";
import Link from "next/link";

export default function PaymentMethodsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
            <div className="flex items-center gap-2 p-4 bg-white border-b border-zinc-100 dark:bg-black dark:border-zinc-800">
                <Link href="/profile">
                    <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
                </Link>
                <h1 className="text-lg font-semibold">Ödeme Yöntemleri</h1>
            </div>

            <div className="p-4 space-y-6">

                {/* Kayıtlı Hesaplar */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-500 uppercase">Kayıtlı IBAN'lar</h3>

                    <Card className="p-4 flex items-center justify-between bg-white border-blue-200 ring-1 ring-blue-100 dark:bg-zinc-900 dark:border-blue-900 dark:ring-blue-900/30">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 dark:bg-blue-900/20">
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Enpara - Şahsi</p>
                                <p className="text-xs text-zinc-500 font-mono">TR92 **** **** 0812</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500"><Trash2 size={16} /></Button>
                    </Card>
                </div>

                {/* Yeni Ekleme Formu */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Plus size={18} className="text-blue-600" /> Yeni IBAN Ekle
                    </h3>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Hesap Adı (Örn: İş Bankası)</Label>
                            <Input placeholder="Hesabım" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Ad Soyad (Hesap Sahibi)</Label>
                            <Input placeholder="Adınız Soyadınız" />
                        </div>
                        <div className="grid gap-2">
                            <Label>IBAN</Label>
                            <Input placeholder="TR__ ____ ____ ____" className="font-mono" />
                        </div>
                        <Button className="w-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black">Kaydet</Button>
                    </div>
                </div>

            </div>
        </div>
    );
}