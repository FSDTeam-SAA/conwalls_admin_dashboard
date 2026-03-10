import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import type { NextFetchEvent, NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth(
    function middleware(req: NextRequestWithAuth) {
        return intlMiddleware(req);
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        },
    }
);

export default function middleware(req: NextRequest, event: NextFetchEvent) {
    const publicPages = ["/login", "/forgot-password", "/reset-password", "/verify-email"];
    const { pathname } = req.nextUrl;

    const isPublicPage = publicPages.some(page =>
        pathname === page ||
        pathname.startsWith(`/en${page}`) ||
        pathname.startsWith(`/de${page}`) ||
        pathname === "/" ||
        pathname === "/en" ||
        pathname === "/de"
    );

    if (isPublicPage) {
        return intlMiddleware(req);
    }

    return authMiddleware(req as Parameters<typeof authMiddleware>[0], event);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ["/", "/(de|en)/:path*", "/((?!api|_next|_static|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/.*|.*\\..*).*)"],
};
