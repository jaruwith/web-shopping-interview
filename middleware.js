import { NextResponse } from 'next/server';

export function middleware(request) {
    const url = new URL(request.url);
    const cookie = request.cookies.get('isLoggedIn'); 

    // ตรวจสอบเส้นทางที่ขึ้นต้นด้วย /Login
    if (url.pathname.startsWith('/Login')) {
        // ถ้าไม่มีคุกกี้ isLoggedIn หรือค่าของคุกกี้ไม่ใช่ true ะจเด้งกลับหน้าหลัก
        if (!cookie && cookie !== 'true') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/Login/:path*',
};