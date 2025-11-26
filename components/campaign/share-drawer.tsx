"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
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
import { Copy, Share2, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface ShareDrawerProps {
    children: React.ReactNode;
    campaignId: string;
    campaignTitle: string;
    reward: string;
}

export function ShareDrawer({ children, campaignId, campaignTitle, reward }: ShareDrawerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [code, setCode] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [isCopied, setIsCopied] = React.useState(false);

    const supabase = createClient();

    // Drawer açıldığında kod oluştur
    React.useEffect(() => {
        if (isOpen && !code && !loading) {
            generateCode();
        }
    }, [isOpen]);

    const generateCode = async () => {
        setLoading(true);

        // Backend'e istek at
        const { data, error } = await supabase.rpc('create_referral', {
            p_campaign_id: campaignId
        });

        if (error) {
            console.error(error);
            toast.error("Kod oluşturulamadı. Giriş yaptınız mı?");
            setLoading(false);
            setIsOpen(false); // Hata varsa kapat
            return;
        }

        // Başarılı
        setCode(data.code); // "K9X2M4" gibi
        setLoading(false);
    };

    const shareUrl = code ? `https://refle.app/c/${code}` : "";

    const handleCopy = () => {
        if (!code) return;
        navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        toast.success("Link kopyalandı!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleWhatsApp = () => {
        if (!code) return;
        const text = `Selam! ${campaignTitle} için sana özel bir indirim kodu buldum. Bu linkten alabilirsin: ${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="text-center text-2xl">
                            {loading ? "Kod Oluşturuluyor..." : "Kodun Hazır! 🎉"}
                        </DrawerTitle>
                        <DrawerDescription className="text-center">
                            Arkadaşın bu kodu kullanırsa, sen <span className="font-bold text-blue-600">{reward}</span> kazanacaksın.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 pb-0 space-y-4">

                        {/* KOD KARTI */}
                        <div className="flex items-center justify-between p-4 bg-zinc-100 rounded-xl border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 min-h-20">
                            {loading ? (
                                <div className="w-full flex justify-center items-center text-zinc-400">
                                    <Loader2 className="animate-spin mr-2" /> Lütfen bekleyin...
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-zinc-500 uppercase font-medium">Referans Kodu</span>
                                        <span className="text-2xl font-mono font-bold tracking-widest text-zinc-900 dark:text-zinc-100">
                                            {code}
                                        </span>
                                    </div>
                                    <Button size="icon" variant="ghost" onClick={handleCopy}>
                                        {isCopied ? <CheckCircle2 className="text-green-600" /> : <Copy className="text-zinc-500" />}
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* PAYLAŞIM BUTONLARI */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button onClick={handleWhatsApp} disabled={loading} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                            </Button>
                            <Button variant="outline" disabled={loading} className="w-full" onClick={handleCopy}>
                                <Share2 className="mr-2 h-4 w-4" /> Kopyala
                            </Button>
                        </div>

                    </div>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="ghost">Kapat</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}