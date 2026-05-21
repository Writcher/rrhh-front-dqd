import { NextResponse } from 'next/server'
import { auth } from './auth'

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userType = req.auth?.user?.tipoUsuario;

    const isStaticFile = nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|gif|css|js|woff|woff2|ttf|eot)$/);
    const isApiRoute = nextUrl.pathname.startsWith('/api');

    if (isStaticFile || isApiRoute) {
        return NextResponse.next();
    };

    const protectedRoutes = ['/administrativo', '/rrhh', '/administrador'];
    const isProtectedRoute = protectedRoutes.some(route => nextUrl.pathname.startsWith(route));

    if (nextUrl.pathname === '/') {
        if (isLoggedIn) {
            if (userType === 'Administrativo') {
                return NextResponse.redirect(new URL('/administrativo', nextUrl));
            } else if (userType === 'Recursos Humanos') {
                return NextResponse.redirect(new URL('/rrhh', nextUrl));
            } else if (userType === 'Administrador') {
                return NextResponse.redirect(new URL('/administrador', nextUrl));
            };
        } else {
            return NextResponse.redirect(new URL('/login', nextUrl));
        };
    };

    if (!isLoggedIn && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    };

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
};
