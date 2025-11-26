"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanLine, CheckCircle2, RefreshCw, Search, Loader2, AlertCircle, Camera, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// QR Okuyucuyu sadece client tarafında yükle (SSR hatasını önlemek için)
const QrScanner = dynamic(() => import("react-qr-scanner"), {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-black flex items-center justify-center text-white">Kamera Başlatılıyor...</div>
});

interface ScanResult {
    referral_id: string;
    campaign_title: string;
    discount_amount: number;
    final_price: number;
}

export default function CashierScan() {
    const [step, setStep] = useState<"input" | "result" | "success">("input");
    const [showCamera, setShowCamera] = useState(false); // Kamera modu
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);

    const supabase = createClient();

    // Kamera Hatası veya Tarama Sonucu
    const handleScan = (data: any) => {
        if (data) {
            // QR'dan gelen veriyi al (Genelde text formatındadır)
            const scannedText = data?.text || data;
            if (scannedText) {
                setCode(scannedText);
                setShowCamera(false); // Kamerayı kapat
                toast.success("QR Kod Okundu!");
                // İstersen otomatik sorgulamayı da burada tetikleyebilirsin:
                // verifyCode(scannedText);
            }
        }
    };

    const handleError = (err: any) => {
        console.error(err);
        // Kamera izni verilmediyse veya hata varsa kullanıcıya söyle
        // toast.error("Kamera hatası: İzin verdiğinizden emin olun.");
    };

    // 1. ADIM: KODU DOĞRULA (Ortak Fonksiyon)
    const verifyCode = async (codeToVerify: string) => {
        if (codeToVerify.length < 6) {
            toast.error("Lütfen geçerli bir kod giriniz.");
            return;
        }
        setLoading(true);

        const { data, error } = await supabase.rpc('verify_referral_code', {
            p_code: codeToVerify.toUpperCase()
        });

        setLoading(false);

        if (error || !data.success) {
            toast.error(data?.message || "Kod doğrulanamadı.");
            return;
        }

        setResult(data);
        setStep("result");
    };

    // Butona basınca tetiklenen versiyon
    const handleManualVerify = () => verifyCode(code);

    // 2. ADIM: İŞLEMİ TAMAMLA
    const handleComplete = async () => {
        if (!result) return;
        setLoading(true);

        const { data, error } = await supabase.rpc('complete_referral_transaction', {
            p_referral_id: result.referral_id
        });

        setLoading(false);

        if (error || !data.success) {
            toast.error("İşlem tamamlanamadı: " + error?.message);
            return;
        }

        toast.success("İşlem Başarılı! Para transfer edildi.");
        setStep("success");
    };

    const reset = () => {
        setStep("input");
        setCode("");
        setResult(null);
        setShowCamera(false);
    };

    return (
        <div className="h-[80vh] flex flex-col items-center justify-center px-4">

            {/* --- AŞAMA 1: KOD GİRİŞİ ve KAMERA --- */}
            {step === "input" && (
                <div className="w-full max-w-sm flex flex-col items-center gap-6 animate-in fade-in">

                    {!showCamera ? (
                        <>
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold">Kasa İşlemi</h2>
                                <p className="text-sm text-zinc-500">Müşteri QR kodunu okutun veya kodu girin.</p>
                            </div>

                            {/* KAMERA AÇMA BUTONU */}
                            <div
                                onClick={() => setShowCamera(true)}
                                className="w-full h-32 bg-zinc-100 border-2 border-dashed border-zinc-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-200 transition-colors dark:bg-zinc-900 dark:border-zinc-700"
                            >
                                <div className="h-12 w-12 bg-zinc-900 rounded-full flex items-center justify-center text-white mb-2 dark:bg-zinc-50 dark:text-black">
                                    <Camera size={24} />
                                </div>
                                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Kamerayı Aç</span>
                            </div>

                            <div className="relative w-full flex items-center gap-4">
                                <div className="h-px bg-zinc-200 flex-1"></div>
                                <span className="text-xs text-zinc-400 uppercase">veya kod gir</span>
                                <div className="h-px bg-zinc-200 flex-1"></div>
                            </div>

                            <div className="w-full relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <ScanLine className="h-5 w-5 text-zinc-400" />
                                </div>
                                <Input
                                    placeholder="KOD (Örn: A7X9K2)"
                                    className="pl-10 h-14 text-center text-xl font-mono uppercase tracking-widest bg-zinc-50 border-2 focus-visible:ring-0 focus-visible:border-blue-500 transition-all dark:bg-zinc-900"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    maxLength={6}
                                />
                            </div>

                            <Button
                                onClick={handleManualVerify}
                                disabled={loading || code.length < 6}
                                size="lg"
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Kodu Sorgula"}
                            </Button>
                        </>
                    ) : (
                        // KAMERA ARAYÜZÜ
                        <div className="w-full relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-4 right-4 z-20 text-white hover:bg-white/20"
                                onClick={() => setShowCamera(false)}
                            >
                                <X size={24} />
                            </Button>

                            <div className="relative aspect-square">
                                <QrScanner
                                    delay={300}
                                    onError={handleError}
                                    onScan={handleScan}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    constraints={{
                                        video: { facingMode: "environment" } // Arka kamera
                                    }}
                                />
                                {/* Tarama Çerçevesi Efekti */}
                                <div className="absolute inset-0 border-[30px] border-black/50 pointer-events-none flex items-center justify-center">
                                    <div className="w-48 h-48 border-2 border-white/50 rounded-lg relative">
                                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
                                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
                                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 text-center text-white text-sm bg-black">
                                QR Kodu çerçeveye hizalayın
                            </div>
                        </div>
                    )}

                </div>
            )}

            {/* ... (Aşama 2 ve 3 kodları AYNI kalacak) ... */}
            {step === "result" && result && (
                // ... (Eski kodun aynısı)
                <div className="w-full max-w-sm animate-in zoom-in-95 duration-300">
                    <div className="bg-green-600 text-white p-6 rounded-t-2xl text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-2 relative z-10" />
                        <h2 className="text-2xl font-bold relative z-10">KOD GEÇERLİ</h2>
                        <p className="text-green-100 text-sm relative z-10">{result.campaign_title}</p>
                    </div>

                    <div className="bg-white border border-t-0 border-zinc-200 rounded-b-2xl shadow-xl p-6 space-y-6 dark:bg-zinc-900 dark:border-zinc-800">

                        <div className="space-y-3">
                            <div className="flex justify-between text-zinc-500 text-sm">
                                <span>Liste Fiyatı</span>
                                <span className="line-through">₺{(result.final_price + result.discount_amount).toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between text-green-600 font-bold text-lg bg-green-50 p-2 rounded-lg dark:bg-green-900/20">
                                <span>İndirim</span>
                                <span>- ₺{result.discount_amount}</span>
                            </div>
                            <div className="h-px bg-zinc-200 my-1 dark:bg-zinc-800"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-zinc-900 font-bold text-lg dark:text-zinc-100">TAHSİL EDİLECEK:</span>
                                <span className="text-4xl font-black text-zinc-900 tracking-tighter dark:text-white">₺{result.final_price}</span>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-xs text-blue-800 leading-relaxed dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200">
                            ℹ️ Müşteriden <strong>{result.final_price} TL</strong> tahsil ettikten sonra aşağıdaki butona basınız. Sistem, referans ödemesini otomatik yapacaktır.
                        </div>

                        <Button onClick={handleComplete} disabled={loading} size="lg" className="w-full font-bold text-lg h-14 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-black">
                            {loading ? <Loader2 className="animate-spin" /> : "Tahsilatı Onayla"}
                        </Button>

                        <Button onClick={reset} variant="ghost" className="w-full text-zinc-400">
                            Vazgeç
                        </Button>
                    </div>
                </div>
            )}

            {step === "success" && (
                <div className="text-center animate-in fade-in space-y-6">
                    <div className="h-32 w-32 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-4">
                        <CheckCircle2 size={64} />
                    </div>
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">İşlem Tamamlandı!</h2>
                    <p className="text-zinc-500">Referans ödülü cüzdana gönderildi.</p>

                    <Button onClick={reset} size="lg" className="min-w-[200px] rounded-full">
                        Yeni İşlem
                    </Button>
                </div>
            )}

        </div>
    );
}