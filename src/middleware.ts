import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/forgot-password/otp",
  "/forgot-password/reset-password",
  "/favicon.ico",
  "/api",
  "/_next/static",
  "/_next/image",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // console.log("token +++++++++++++++++=", token);
  // console.log( "role------------------", token?.role);

  if (!token || (token?.role !== "PARTICIPANT" && token?.role !== "TRAINER")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!favicon.ico|api|_next/static|_next/image).*)"],
};






// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   // Public routes (everyone can access)
//   const publicRoutes = [
//     "/login",
//     "/forgot-password",
//     "/forgot-password/otp",
//     "/forgot-password/otp/reset-password",
//   ];

//   // If the path is public → allow
//   if (publicRoutes.includes(pathname)) {
//     return NextResponse.next();
//   }

//   if (!token) {
//     // Redirect if no token
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// // Middleware matcher
// export const config = {
//   matcher: [
//       "/((?!api/auth|_next/static|_next/image|favicon.ico|assets|images|uploads|fonts).*)",
//   ],
// };
