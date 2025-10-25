import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // 공개 경로 (로그인, 회원가입 등)
  const publicPaths = ["/signin", "/signup"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // 토큰이 없고 공개 경로가 아니면 로그인 페이지로 리다이렉트
  if (!token && !isPublicPath) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 토큰이 있고 로그인/회원가입 페이지에 접근하면 홈으로 리다이렉트
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
