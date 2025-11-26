"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { z } from "zod";
import { toast } from "sonner";
import { TURKEY_LOCATIONS } from "@/constants/locations"; // Lokasyon verisi

// --- VALIDASYON ŞEMALARI ---
const userSchema = z.object({
    fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır."),
    phone: z.string().regex(/^[0-9]{10}$/, "Telefon numarası başında 0 olmadan 10 hane olmalıdır (5XX...)"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
});

const businessSchema = z.object({
    companyName: z.string().min(2, "Şirket ismi zorunludur."),
    phone: z.string().regex(/^[0-9]{10}$/, "Cep telefonu başında 0 olmadan 10 hane olmalıdır."),
    email: z.string().email("Geçerli bir e-posta adresi giriniz."),
    companyType: z.string().min(1, "Şirket türü seçiniz."),
    taxId: z.string().regex(/^[0-9]{10}$/, "Vergi Kimlik Numarası 10 haneli olmalıdır."),
    city: z.string().min(2, "İl seçiniz."),
    district: z.string().min(2, "İlçe seçiniz."),
    referralCode: z.string().optional(),
    consent: z.boolean().refine((val) => val === true, {
        message: "Aydınlatma metnini onaylamalısınız."
    }),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
});

export default function RegisterPage() {
    const [view, setView] = useState<"role_select" | "form" | "verify">("role_select");
    const [role, setRole] = useState<"user" | "business" | null>(null);

    const [formData, setFormData] = useState({
        password: "",
        phone: "",
        fullName: "",
        companyName: "",
        email: "",
        companyType: "",
        taxId: "",
        city: "",
        district: "",
        referralCode: "",
        consent: false
    });

    const [otpCode, setOtpCode] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    // Input Değişimi
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    };

    // Select Değişimi
    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => {
            if (name === "city") {
                return { ...prev, [name]: value, district: "" };
            }
            return { ...prev, [name]: value };
        });
        if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    };

    // Checkbox Değişimi
    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, consent: checked }));
        if (errors.consent) setErrors(prev => { const n = { ...prev }; delete n.consent; return n; });
    }

    // KAYIT İŞLEMİ
    const handleRegister = async () => {
        setLoading(true);
        setErrors({});

        // 1. Validasyon (Aynı kalacak)
        let result;
        if (role === "user") {
            result = userSchema.safeParse({
                fullName: formData.fullName,
                phone: formData.phone,
                password: formData.password
            });
        } else {
            result = businessSchema.safeParse({
                companyName: formData.companyName,
                phone: formData.phone,
                email: formData.email,
                companyType: formData.companyType,
                taxId: formData.taxId,
                city: formData.city,
                district: formData.district,
                referralCode: formData.referralCode,
                consent: formData.consent,
                password: formData.password
            });
        }

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            (result.error as any).errors.forEach((err: any) => {
                if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
            });
            setErrors(fieldErrors);
            setLoading(false);
            window.scrollTo(0, 0);
            return;
        }

        const formattedPhone = `+90${formData.phone}`;

        // --- YENİ EKLENEN KISIM: Kayıt Kontrolü ---
        // Supabase'e sormadan önce kendi veritabanımıza soruyoruz.
        const { data: userExists, error: checkError } = await supabase.rpc('check_user_exists', {
            p_phone: formattedPhone
        });

        if (checkError) {
            toast.error("Sistem kontrolü yapılamadı. Lütfen tekrar deneyin.");
            setLoading(false);
            return;
        }

        if (userExists) {
            toast.warning("Bu numara zaten kayıtlı! Giriş yap sayfasına yönlendiriliyorsunuz.");
            setTimeout(() => router.push("/login"), 2000);
            setLoading(false);
            return; // İşlemi burada kesiyoruz
        }
        // -------------------------------------------

        // 2. Veri Temizliği ve Metadata (Aynı kalacak)
        const metadata = role === 'user' ? {
            role: 'user',
            full_name: formData.fullName,
            phone: formData.phone,
        } : {
            role: 'business',
            company_name: formData.companyName,
            email: formData.email,
            phone: formData.phone,
            company_type: formData.companyType,
            tax_id: formData.taxId,
            city: formData.city,
            district: formData.district,
            referral_code: formData.referralCode,
        };

        // 3. Supabase Kayıt (Aynı kalacak)
        const { error } = await supabase.auth.signUp({
            phone: formattedPhone,
            password: formData.password,
            options: {
                data: metadata,
            },
        });

        if (error) {
            // Buradaki check artık "fallback" (yedek) olarak kalabilir
            toast.error("Kayıt Hatası: " + error.message);
            setLoading(false);
            return;
        }

        toast.success("Doğrulama kodu gönderildi!");
        setLoading(false);
        setView("verify");
    };

    // SMS DOĞRULAMA
    const handleVerifyOtp = async () => {
        setLoading(true);
        const { error } = await supabase.auth.verifyOtp({
            phone: `+90${formData.phone}`,
            token: otpCode,
            type: 'sms',
        });

        if (error) {
            toast.error("Kod Hatalı: " + error.message);
            setLoading(false);
            return;
        }

        toast.success("Hesap doğrulandı! Yönlendiriliyorsunuz...");

        // Yönlendirme
        if (role === "business") {
            router.push("/business/dashboard");
        } else {
            router.push("/");
        }
    };

    // --- EKRAN 1: ROL SEÇİMİ ---
    if (view === "role_select") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-zinc-50 dark:bg-black">
                <h1 className="text-2xl font-bold mb-2">Hesap Türü Seçin</h1>
                <p className="text-zinc-500 mb-8 text-sm">Refle dünyasına nasıl katılmak istersiniz?</p>
                <div className="grid gap-4 w-full max-w-sm">
                    <button onClick={() => { setRole("user"); setView("form"); }} className="group relative flex items-center p-4 bg-white border-2 border-zinc-100 rounded-2xl hover:border-blue-600 transition-all text-left dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl mr-4">👤</div>
                        <div>
                            <h3 className="font-bold text-zinc-900 dark:text-white">Bireysel Kullanıcı</h3>
                            <p className="text-xs text-zinc-500">İndirim kazanmak için.</p>
                        </div>
                    </button>
                    <button onClick={() => { setRole("business"); setView("form"); }} className="group relative flex items-center p-4 bg-white border-2 border-zinc-100 rounded-2xl hover:border-orange-500 transition-all text-left dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl mr-4">🏢</div>
                        <div>
                            <h3 className="font-bold text-zinc-900 dark:text-white">İşletme / Marka</h3>
                            <p className="text-xs text-zinc-500">Müşteri çekmek için.</p>
                        </div>
                    </button>
                </div>
                <div className="mt-8 text-sm text-zinc-500">
                    Zaten hesabın var mı? <Link href="/login" className="font-bold text-blue-600 hover:underline">Giriş Yap</Link>
                </div>
            </div>
        );
    }

    // --- EKRAN 2: FORM ---
    if (view === "form") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-black py-12">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Button variant="ghost" onClick={() => setView("role_select")} className="mb-6 text-zinc-500 pl-0 hover:bg-transparent hover:text-zinc-900">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
                    </Button>

                    <h1 className="text-2xl font-bold mb-1">
                        {role === "user" ? "Bireysel Kayıt" : "İşletme Kaydı"}
                    </h1>
                    <p className="text-zinc-500 text-sm mb-6">Bilgilerinizi eksiksiz giriniz.</p>

                    <div className="space-y-4">

                        {role === "user" && (
                            <div className="space-y-1">
                                <Input name="fullName" placeholder="Ad Soyad" className={`h-12 ${errors.fullName ? "border-red-500" : ""}`} value={formData.fullName} onChange={handleInputChange} />
                                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                            </div>
                        )}

                        {role === "business" && (
                            <>
                                <div className="space-y-1">
                                    <Input name="companyName" placeholder="Şirket İsmi" className={`h-12 ${errors.companyName ? "border-red-500" : "border-orange-200 focus-visible:ring-orange-500"}`} value={formData.companyName} onChange={handleInputChange} />
                                    {errors.companyName && <p className="text-xs text-red-500">{errors.companyName}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Input name="email" type="email" placeholder="E-posta Adresiniz" className={`h-12 ${errors.email ? "border-red-500" : ""}`} value={formData.email} onChange={handleInputChange} />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Select onValueChange={(val) => { setFormData(prev => ({ ...prev, companyType: val })); if (errors.companyType) setErrors(prev => { const n = { ...prev }; delete n.companyType; return n; }) }}>
                                        <SelectTrigger className={`w-full h-12 ${errors.companyType ? "border-red-500" : ""}`}>
                                            <SelectValue placeholder="Şirket Türü Seçiniz" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Anonim">Anonim Şirket</SelectItem>
                                            <SelectItem value="Limited">Limited Şirket</SelectItem>
                                            <SelectItem value="Sahis">Şahıs Şirketi</SelectItem>
                                            <SelectItem value="Diger">Diğer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.companyType && <p className="text-xs text-red-500">{errors.companyType}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Input name="taxId" placeholder="Vergi Kimlik No (10 hane)" maxLength={10} className={`h-12 ${errors.taxId ? "border-red-500" : ""}`} value={formData.taxId} onChange={handleInputChange} />
                                    {errors.taxId && <p className="text-xs text-red-500">{errors.taxId}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Select onValueChange={(val) => handleSelectChange("city", val)}>
                                            <SelectTrigger className={`w-full h-12 ${errors.city ? "border-red-500" : ""}`}>
                                                <SelectValue placeholder="İl" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.keys(TURKEY_LOCATIONS).map((city) => (
                                                    <SelectItem key={city} value={city}>{city}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Select disabled={!formData.city} onValueChange={(val) => handleSelectChange("district", val)} value={formData.district}>
                                            <SelectTrigger className={`w-full h-12 ${errors.district ? "border-red-500" : ""}`}>
                                                <SelectValue placeholder="İlçe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {formData.city && TURKEY_LOCATIONS[formData.city]?.map((dist) => (
                                                    <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.district && <p className="text-xs text-red-500">{errors.district}</p>}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Input name="referralCode" placeholder="Referans Kodu (Opsiyonel)" className="h-12" value={formData.referralCode} onChange={handleInputChange} />
                                </div>
                            </>
                        )}

                        <div className="space-y-1">
                            <Input name="phone" type="tel" placeholder="Cep Telefonunuz (5XX...)" maxLength={10} className={`h-12 ${errors.phone ? "border-red-500" : ""}`} value={formData.phone} onChange={handleInputChange} />
                            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                        </div>

                        <div className="space-y-1">
                            <Input name="password" type="password" placeholder="Şifre Belirle" className={`h-12 ${errors.password ? "border-red-500" : ""}`} value={formData.password} onChange={handleInputChange} />
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                        </div>

                        <div className="flex items-start gap-3 mt-4 p-3 bg-zinc-50 rounded-lg border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
                            <input type="checkbox" id="consent" className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={formData.consent} onChange={(e) => handleCheckboxChange(e.target.checked)} />
                            <label htmlFor="consent" className="text-xs text-zinc-500 cursor-pointer">
                                <span className="text-blue-600 underline font-medium">Aydınlatma Metni</span>'ni okudum ve anladım. Kişisel verilerimin işlenmesine rıza gösteriyorum.
                            </label>
                        </div>
                        {errors.consent && <p className="text-xs text-red-500 ml-1">{errors.consent}</p>}

                        <Button onClick={handleRegister} disabled={loading} className={`w-full h-12 text-lg font-bold mt-4 ${role === 'business' ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            {loading ? "İşleniyor..." : "Kaydı Tamamla"}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // --- EKRAN 3: SMS DOĞRULAMA ---
    if (view === "verify") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-black">
                <div className="w-full max-w-md text-center animate-in zoom-in-95 duration-300">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <KeyRound size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Doğrulama Kodu</h1>
                    <p className="text-zinc-500 text-sm mb-8"><span className="font-bold text-zinc-900 dark:text-white">+90 {formData.phone}</span> numarasına gönderilen kodu giriniz.</p>
                    <div className="space-y-4">
                        <Input className="h-14 text-center text-2xl tracking-[0.5em] font-bold" placeholder="000000" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
                        <Button onClick={handleVerifyOtp} disabled={loading} className="w-full h-12 font-bold bg-green-600 hover:bg-green-700 text-white">{loading ? "Doğrulanıyor..." : "Doğrula ve Başla"}</Button>
                        <button onClick={() => setView("form")} className="text-sm text-zinc-400 underline hover:text-zinc-600 mt-4">Numarayı Düzenle</button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}