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
import { Copy, Share2, MessageCircle, CheckCircle2 } from "lucide-react";

export function ShareDrawer({ children, campaignTitle, reward }: { children: React.ReactNode, campaignTitle: string, reward: string }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isCopied, setIsCopied] = React.useState(false);

    // Mock Referans Kodu
    const refCode = "REF-88X2";
    const shareUrl = `https://refle.app/c/${refCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleWhatsApp = () => {
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
                        <DrawerTitle className="text-center text-2xl">Kodun Hazır! 🎉</DrawerTitle>
                        <DrawerDescription className="text-center">
                            Arkadaşın bu kodu kullanırsa, sen <span className="font-bold text-blue-600">{reward}</span> kazanacaksın.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 pb-0 space-y-4">

                        {/* KOD KARTI */}
                        <div className="flex items-center justify-between p-4 bg-zinc-100 rounded-xl border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
                            <div className="flex flex-col">
                                <span className="text-xs text-zinc-500 uppercase font-medium">Referans Kodu</span>
                                <span className="text-xl font-mono font-bold tracking-widest">{refCode}</span>
                            </div>
                            <Button size="icon" variant="ghost" onClick={handleCopy}>
                                {isCopied ? <CheckCircle2 className="text-green-600" /> : <Copy className="text-zinc-500" />}
                            </Button>
                        </div>

                        {/* PAYLAŞIM BUTONLARI */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button onClick={handleWhatsApp} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Share2 className="mr-2 h-4 w-4" /> Diğer
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