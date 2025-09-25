// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("MIDDLEWARE RUN:", request.nextUrl.pathname);
  const { pathname } = request.nextUrl;

  // ✅ Just read the cookie (no JWT verify here!)
  const role = request.cookies.get("role")?.value;
  console.log("Role from cookie:", role);

  // 🔹 Redirect doctor from "/" → "/doctor/dashboard"
  if (pathname === "/" && role === "doctor") {
    return NextResponse.redirect(new URL("/doctor/dashboard", request.url));
  }

  if (pathname === "/" && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Protect doctor routes
  if (pathname.startsWith("/doctor")) {
    if (!role) {
      return NextResponse.redirect(new URL("/login/doctor", request.url));
    }
    if (role !== "doctor") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Protect patient routes
  if (pathname.startsWith("/patient")) {
    if (!role) {
      return NextResponse.redirect(new URL("/login/patient", request.url));
    }
    if (role !== "patient") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/","/doctor/:path*", "/patient/:path*", "/admin/:path*"],
};
