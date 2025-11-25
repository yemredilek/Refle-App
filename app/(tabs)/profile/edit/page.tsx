import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-black">
            {/* Üst Bar */}
            <div className="flex items-center gap-2 p-4 border-b border-zinc-100 dark:border-zinc-800">
                <Link href="/profile">
                    <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
                </Link>
                <h1 className="text-lg font-semibold">Kişisel Bilgiler</h1>
            </div>

            <div className="p-6 space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-3">
                    <div className="h-24 w-24 rounded-full bg-zinc-100 flex items-center justify-center text-2xl border-2 border-dashed border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 text-zinc-400">
                        OA
                    </div>
                    <Button variant="outline" size="sm" className="text-xs h-8 rounded-full">Fotoğraf Değiştir</Button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Ad</Label>
                        <Input defaultValue="Oğuzhan" className="bg-zinc-50 dark:bg-zinc-900" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Soyad</Label>
                        <Input defaultValue="A." className="bg-zinc-50 dark:bg-zinc-900" />
                    </div>
                    <div className="grid gap-2">
                        <Label>E-Posta</Label>
                        <Input defaultValue="oguzhan@example.com" disabled className="bg-zinc-100 text-zinc-500 dark:bg-zinc-800" />
                        <p className="text-[10px] text-zinc-400">E-posta adresi değiştirilemez.</p>
                    </div>
                    <div className="grid gap-2">
                        <Label>Telefon</Label>
                        <Input defaultValue="+90 555 123 45 67" className="bg-zinc-50 dark:bg-zinc-900" />
                    </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">Değişiklikleri Kaydet</Button>
            </div>
        </div>
    );
}