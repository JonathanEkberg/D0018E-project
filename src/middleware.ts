import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  return NextResponse.next({
    headers: { "cache-control": "max-age=2592000" },
  });
}

export const config = {
  matcher: "/:path*.(jpg|jpeg|png|gif|webp|avif)",
};
