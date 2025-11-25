"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Building2, User, Lock, Phone, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { z } from "zod";

// --- ŞEMA ---
const loginSchema = z.object({
    phone: z.string().min(10, "Telefon numaranızı giriniz."),
    password: z.string().min(1, "Şifre boş bırakılamaz."),
});

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState<"user" | "business">("user");

    const [formData, setFormData] = useState({ phone: "", password: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState("");

    const router = useRouter();
    const supabase = createClient();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => { const n = { ...prev }; delete n[e.target.name]; return n; });
        }
        if (authError) setAuthError("");
    };

    const handleLogin = async () => {
        setLoading(true);
        setErrors({});
        setAuthError("");

        // 1. Validasyon
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((err: any) => {
                if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
            });
            setErrors(fieldErrors);
            setLoading(false);
            return;
        }

        // 2. Supabase Login (TELEFON İLE)
        const { error } = await supabase.auth.signInWithPassword({
            phone: `+90${formData.phone}`,
            password: formData.password,
        });

        if (error) {
            setAuthError("Telefon veya şifre hatalı.");
            setLoading(false);
            return;
        }

        if (activeTab === "business") {
            router.push("/business/dashboard");
        } else {
            router.push("/");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-black">

            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tighter text-blue-600 mb-2">refle.</h1>
                <p className="text-zinc-500 text-sm">Hesabınıza giriş yapın ve kazanmaya başlayın.</p>
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">

                <div className="grid grid-cols-2 border-b border-zinc-100 dark:border-zinc-800">
                    <button onClick={() => setActiveTab("user")} className={`flex items-center justify-center gap-2 p-4 text-sm font-medium transition-all ${activeTab === "user" ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"}`}>
                        <User size={18} /> Bireysel
                    </button>
                    <button onClick={() => setActiveTab("business")} className={`flex items-center justify-center gap-2 p-4 text-sm font-medium transition-all ${activeTab === "business" ? "bg-zinc-100 text-zinc-900 border-b-2 border-zinc-900 dark:bg-zinc-800 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"}`}>
                        <Building2 size={18} /> İşletme
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {authError && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 dark:bg-red-900/20 dark:text-red-400">
                            <AlertCircle size={16} /> {authError}
                        </div>
                    )}

                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-500 uppercase">Telefon Numarası</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
                                <Input
                                    name="phone"
                                    placeholder="5XX XXX XX XX"
                                    type="tel"
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

                        <Button onClick={handleLogin} disabled={loading} className={`w-full h-12 text-white rounded-xl font-bold ${activeTab === 'user' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-zinc-900 hover:bg-zinc-800'}`}>
                            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"} <ArrowRight className="ml-2 h-4 w-4" />
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