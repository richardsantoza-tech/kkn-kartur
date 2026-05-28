import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Next.js 16 Proxy (formerly Middleware). Refreshes the Supabase auth session
 * and guards the /admin area. Real authorization (role + active check) is also
 * enforced in the admin layout — this is the optimistic edge check.
 */
export async function proxy(request: NextRequest) {
  const { url, anonKey, configured } = getSupabaseEnv();
  const path = request.nextUrl.pathname;
  const isLogin = path === "/admin/login";

  // Without Supabase credentials there is no auth to enforce; let requests
  // through so the admin pages can render their "backend not configured" state.
  if (!configured) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLogin) {
    const redirectUrl = new URL("/admin/login", request.url);
    redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
