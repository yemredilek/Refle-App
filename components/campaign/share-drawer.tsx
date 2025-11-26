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
import QRCode from "react-qr-code";

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
            toast.error("Kod oluşturulamadı: " + error.message);
            setLoading(false);
            setIsOpen(false);
            return;
        }

        setCode(data.code);
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
                            {loading ? "Kod Oluşturuluyor..." : "Kasa İçin QR Kod"}
                        </DrawerTitle>
                        <DrawerDescription className="text-center">
                            Bu kodu kasadaki görevliye göster.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 pb-0 space-y-6 flex flex-col items-center">

                        {/* QR KOD ALANI */}
                        <div className="bg-white p-4 rounded-xl border-4 border-zinc-900 shadow-xl">
                            {loading ? (
                                <div className="h-48 w-48 flex items-center justify-center text-zinc-400">
                                    <Loader2 className="animate-spin" size={48} />
                                </div>
                            ) : code ? (
                                <QRCode value={code} size={180} />
                            ) : null}
                        </div>

                        {/* KOD KARTI */}
                        {code && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-lg border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
                                <span className="text-2xl font-mono font-bold tracking-[0.2em] text-zinc-900 dark:text-zinc-100">
                                    {code}
                                </span>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopy}>
                                    {isCopied ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} className="text-zinc-500" />}
                                </Button>
                            </div>
                        )}

                        {/* PAYLAŞIM BUTONU */}
                        <Button onClick={handleWhatsApp} disabled={loading} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                            <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp ile Link Gönder
                        </Button>

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