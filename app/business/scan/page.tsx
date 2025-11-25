"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScanLine, CheckCircle2, RefreshCw } from "lucide-react";

export default function CashierScan() {
    const [step, setStep] = useState<"scan" | "result">("scan");

    // QR Okunmuş Gibi Davran (Simülasyon)
    const handleSimulateScan = () => {
        // Gerçek hayatta burada kamera açılır
        setTimeout(() => {
            setStep("result");
        }, 1000); // 1 saniye bekleme efekti
    };

    const reset = () => setStep("scan");

    return (
        <div className="h-[80vh] flex flex-col items-center justify-center px-4">

            {step === "scan" ? (
                // ADIM 1: TARAMA EKRANI
                <div className="flex flex-col items-center gap-8 animate-in fade-in">
                    <div className="relative w-64 h-64 bg-black rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl ring-4 ring-zinc-200 dark:ring-zinc-800">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/20 to-transparent animate-pulse z-10"></div>
                        <ScanLine size={64} className="text-white/50" />
                        <p className="absolute bottom-4 text-white/70 text-xs">QR Kodu çerçeveye hizalayın</p>
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-bold">Müşteri Kodu Tara</h2>
                        <p className="text-sm text-zinc-500 max-w-[200px] mx-auto">Müşterinin gösterdiği QR kodu okutun.</p>
                    </div>

                    {/* SİMÜLASYON BUTONU (Demo İçin) */}
                    <Button onClick={handleSimulateScan} variant="secondary" className="mt-4">
                        📸 Kamerayı Simüle Et (Tıkla)
                    </Button>
                </div>
            ) : (
                // ADIM 2: ÖDEME YÖNLENDİRME KARTI (MAGIC CARD)
                <div className="w-full max-w-sm animate-in zoom-in-95 duration-300">
                    <div className="bg-green-600 text-white p-6 rounded-t-2xl text-center">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
                        <h2 className="text-2xl font-bold">KOD DOĞRULANDI!</h2>
                        <p className="text-green-100 text-sm">İndirim Tanımlandı</p>
                    </div>

                    <div className="bg-white border border-t-0 border-zinc-200 rounded-b-2xl shadow-xl p-6 space-y-6 dark:bg-zinc-900 dark:border-zinc-800">

                        {/* Fiyat Detayı */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-zinc-500 text-sm">
                                <span>Hizmet Bedeli</span>
                                <span className="line-through">₺2.000</span>
                            </div>
                            <div className="flex justify-between text-green-600 font-bold text-lg">
                                <span>İndirim Tutarı</span>
                                <span>- ₺200</span>
                            </div>
                            <div className="h-px bg-zinc-200 my-2 dark:bg-zinc-800"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-zinc-900 font-bold text-lg dark:text-zinc-100">KASADAN ÇEKİLECEK:</span>
                                <span className="text-4xl font-black text-zinc-900 tracking-tighter dark:text-white">₺1.800</span>
                            </div>
                        </div>

                        {/* Kasiyer Talimatı */}
                        <div className="bg-zinc-100 p-4 rounded-lg text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                            ⚠️ <strong>Dikkat:</strong> POS cihazına veya kasaya <strong>1.800 TL</strong> yazarak işlemi tamamlayın.
                        </div>

                        <Button onClick={reset} size="lg" className="w-full font-bold text-lg h-14 bg-blue-600 hover:bg-blue-700">
                            Tahsilatı Yaptım
                        </Button>

                        <Button onClick={reset} variant="ghost" className="w-full text-zinc-400">
                            <RefreshCw size={14} className="mr-2" /> İşlemi İptal Et
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}