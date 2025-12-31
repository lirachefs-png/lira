import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const error_param = searchParams.get('error');
    const error_description = searchParams.get('error_description');
    const next = searchParams.get('next') ?? '/';

    console.log('🔐 Auth Callback received:', {
        hasCode: !!code,
        error: error_param,
        origin,
        next
    });

    // Handle OAuth errors from provider
    if (error_param) {
        console.error('❌ OAuth Error from provider:', error_param, error_description);
        return NextResponse.redirect(`${origin}/auth/signin?error=${encodeURIComponent(error_description || error_param)}`);
    }

    if (code) {
        // Create response first to properly set cookies
        let response = NextResponse.redirect(`${origin}${next}`);

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        // Set cookie on the response object
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        });
                    },
                    remove(name: string, options: CookieOptions) {
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        });
                    },
                },
            }
        );

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('❌ Session exchange error:', error.message);
            return NextResponse.redirect(`${origin}/auth/signin?error=${encodeURIComponent(error.message)}`);
        }

        console.log('✅ Login successful for user:', data.user?.email);
        return response;
    }

    // No code provided
    console.error('❌ No code in callback URL');
    return NextResponse.redirect(`${origin}/auth/signin?error=no_code`);
}
