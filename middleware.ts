import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 1. Kullanıcıyı Al
    const { data: { user } } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname;

    // 2. KORUMALI ROTALAR (Giriş yapmamışsa Login'e at)
    // Cüzdan, Profil (düzenleme), İşletme Paneli, Kod Oluşturma
    const protectedRoutes = ['/wallet', '/profile/edit', '/profile/payment', '/business', '/scan'];

    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

    if (isProtectedRoute && !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. ROL KONTROLÜ (Bireysel kullanıcı İşletme Paneline giremez)
    const role = user?.user_metadata?.role;

    // SENARYO A: İşletme kullanıcısı, Bireysel profile girmeye çalışırsa -> İşletme profiline at
    if (role === 'business' && path === '/profile') {
        return NextResponse.redirect(new URL('/business/profile', request.url));
    }

    // SENARYO B: Bireysel kullanıcı, İşletme alanına girmeye çalışırsa -> Ana sayfaya at
    if (path.startsWith('/business')) {
        if (role !== 'business') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 4. GİRİŞ YAPMIŞSA Login/Register'a Giremesin
    if (user && (path === '/login' || path === '/register')) {
        // Rolüne göre doğru yere at
        const role = user.user_metadata.role;
        if (role === 'business') {
            return NextResponse.redirect(new URL('/business/dashboard', request.url));
        } else {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return response
}

// Hangi sayfalarda çalışacak?
export const config = {
    matcher: [
        /*
         * Aşağıdakiler HARİÇ tüm yollarda çalışır:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public klasörü
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}