"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Building2, Phone, Lock, ArrowRight, KeyRound, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";

const loginSchema = z.object({
    phone: z.string().min(10, "Telefon numaranızı giriniz."),
    password: z.string().min(1, "Şifre boş bırakılamaz."),
});

export default function LoginPage() {
    const [view, setView] = useState<"login" | "verify">("login"); // Akış yönetimi
    const [activeTab, setActiveTab] = useState<"user" | "business">("user");

    const [formData, setFormData] = useState({ phone: "", password: "" });
    const [otpCode, setOtpCode] = useState("");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
        }
    };

    // ADIM 1: Şifre Kontrolü ve SMS Gönderimi
    const handleLogin = async () => {
        setLoading(true);
        setErrors({});

        // Validasyon
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            (result.error as any).errors.forEach((err: any) => {
                if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
            });
            setErrors(fieldErrors);
            setLoading(false);
            return;
        }

        const cleanPhone = formData.phone.replace(/\s/g, ''); // Boşlukları temizle
        const formattedPhone = `+90${cleanPhone}`;

        // 1. Önce Şifre ile Giriş Yapmayı Dene (Kimlik Doğrulama)
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
            phone: formattedPhone,
            password: formData.password,
        });

        if (loginError) {
            toast.error("Giriş Başarısız: Telefon veya şifre hatalı.");
            setLoading(false);
            return;
        }

        // 2. Şifre Doğruysa -> SMS Gönder (OTP Başlat)
        const { error: otpError } = await supabase.auth.signInWithOtp({
            phone: formattedPhone,
            options: { shouldCreateUser: false } // Sadece var olan kullanıcı
        });

        if (otpError) {
            toast.error("SMS Gönderilemedi: " + otpError.message);
            setLoading(false);
            return;
        }

        // Başarılı -> Doğrulama Ekranına Geç
        toast.success("Doğrulama kodu gönderildi!");
        setLoading(false);
        setView("verify");
    };

    // ADIM 2: SMS Doğrulama
    const handleVerify = async () => {
        setLoading(true);
        const cleanPhone = formData.phone.replace(/\s/g, '');

        const { error } = await supabase.auth.verifyOtp({
            phone: `+90${cleanPhone}`,
            token: otpCode,
            type: 'sms',
        });

        if (error) {
            toast.error("Kod Hatalı veya Süresi Dolmuş.");
            setLoading(false);
            return;
        }

        toast.success("Giriş Başarılı!");

        // Yönlendirme
        if (activeTab === "business") {
            router.push("/business/dashboard");
        } else {
            router.push("/");
        }
    };

    // --- EKRAN 1: GİRİŞ FORMU ---
    if (view === "login") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-black">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter text-blue-600 mb-2">refle.</h1>
                    <p className="text-zinc-500 text-sm">Giriş yap ve kazanmaya başla.</p>
                </div>

                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">

                    {/* Sekmeler */}
                    <div className="grid grid-cols-2 border-b border-zinc-100 dark:border-zinc-800">
                        <button onClick={() => setActiveTab("user")} className={`flex items-center justify-center gap-2 p-4 text-sm font-medium transition-all ${activeTab === "user" ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"}`}>
                            <User size={18} /> Bireysel
                        </button>
                        <button onClick={() => setActiveTab("business")} className={`flex items-center justify-center gap-2 p-4 text-sm font-medium transition-all ${activeTab === "business" ? "bg-zinc-100 text-zinc-900 border-b-2 border-zinc-900 dark:bg-zinc-800 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"}`}>
                            <Building2 size={18} /> İşletme
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500 uppercase">Telefon Numarası</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
                                    <Input
                                        name="phone"
                                        placeholder="5XX XXX XX XX"
                                        className={`pl-10 h-12 ${errors.phone ? "border-red-500" : ""}`}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500 uppercase">Şifre</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
                                    <Input
                                        name="password"
                                        type="password"
                                        placeholder="••••••"
                                        className={`pl-10 h-12 ${errors.password ? "border-red-500" : ""}`}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            <Button onClick={handleLogin} disabled={loading} className={`w-full h-12 text-white rounded-xl font-bold ${activeTab === 'user' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-zinc-900 hover:bg-zinc-800'}`}>
                                {loading ? <Loader2 className="animate-spin" /> : "Giriş Yap"} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        <div className="pt-4 text-center space-y-2">
                            <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-600 hover:underline">Şifremi Unuttum</Link>
                            <div className="text-sm text-zinc-500">
                                Hesabın yok mu? <Link href="/register" className="font-bold text-blue-600 hover:underline">Kayıt Ol</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- EKRAN 2: SMS DOĞRULAMA ---
    if (view === "verify") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-black">
                <div className="w-full max-w-md text-center animate-in zoom-in-95 duration-300">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <KeyRound size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Güvenlik Doğrulaması</h1>
                    <p className="text-zinc-500 text-sm mb-8">
                        Güvenliğiniz için <span className="font-bold text-zinc-900 dark:text-white">+90 {formData.phone}</span> numarasına gönderilen kodu giriniz.
                    </p>

                    <div className="space-y-4">
                        <Input
                            className="h-14 text-center text-2xl tracking-[0.5em] font-bold"
                            placeholder="000000"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                        />

                        <Button onClick={handleVerify} disabled={loading} className="w-full h-12 font-bold bg-green-600 hover:bg-green-700 text-white">
                            {loading ? <Loader2 className="animate-spin" /> : "Doğrula ve Tamamla"}
                        </Button>

                        <button onClick={() => setView("login")} className="text-sm text-zinc-400 underline hover:text-zinc-600 mt-4">
                            Giriş ekranına dön
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}