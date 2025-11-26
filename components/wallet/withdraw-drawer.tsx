"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "sonner";
import { Loader2, Landmark } from "lucide-react";

export function WithdrawDrawer({ children, balance }: { children: React.ReactNode, balance: number }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [amount, setAmount] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleWithdraw = async () => {
        const val = parseFloat(amount);
        if (!val || val <= 0) {
            toast.error("Geçerli bir tutar giriniz.");
            return;
        }
        if (val > balance) {
            toast.error("Yetersiz bakiye.");
            return;
        }
        if (val < 50) { // Örnek limit
            toast.error("Minimum çekim tutarı 50 TL'dir.");
            return;
        }

        setLoading(true);
        // BURADA BACKEND İSTEĞİ OLACAK (Şimdilik simülasyon)
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success("Çekim talebi alındı! 24 saat içinde hesabınıza geçecektir.");
        setLoading(false);
        setIsOpen(false);
        setAmount("");
    };

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="text-center text-xl">Para Çek</DrawerTitle>
                        <DrawerDescription className="text-center">
                            Çekilebilir Bakiye: <span className="font-bold text-zinc-900">₺{balance.toFixed(2)}</span>
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 space-y-6">
                        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex flex-col items-center">
                            <span className="text-xs text-zinc-400 uppercase font-bold mb-2">Çekmek İstediğin Tutar</span>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-zinc-300">₺</span>
                                <Input
                                    type="number"
                                    className="text-4xl font-bold text-center h-16 border-none bg-transparent focus-visible:ring-0 p-0 w-40 shadow-none"
                                    placeholder="0"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-zinc-500 p-3 bg-blue-50 rounded-lg border border-blue-100 text-blue-700">
                            <Landmark size={18} />
                            <span>Kayıtlı IBAN hesabınıza gönderilecektir.</span>
                        </div>

                        <Button onClick={handleWithdraw} disabled={loading} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                            {loading ? <Loader2 className="animate-spin" /> : "Talep Oluştur"}
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}