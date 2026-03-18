import { NextResponse } from 'next/server'
import { auth } from './auth'

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userType = req.auth?.user?.tipoUsuario;
   
    // Verificar si es archivo estático o ruta API primero
    const isStaticFile = nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|gif|css|js|woff|woff2|ttf|eot)$/);
    const isApiRoute = nextUrl.pathname.startsWith('/api');
    
    // Permitir archivos estáticos y rutas API sin verificación
    if (isStaticFile || isApiRoute) {
        return NextResponse.next();
    };
   
    const protectedRoutes = ['/administrativo', '/rrhh', '/administrador'];
    const isProtectedRoute = protectedRoutes.some(route => nextUrl.pathname.startsWith(route));
   
    // Manejar la ruta raíz
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
   
    // Verificar autenticación en rutas protegidas
    if (!isLoggedIn && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    };
   
    // Verificar permisos de usuario en rutas protegidas
    if (isLoggedIn) {
        if (nextUrl.pathname.startsWith('/administrativo') && userType !== 'Administrativo') {
            return NextResponse.redirect(new URL('/403', nextUrl));
        };      
        if (nextUrl.pathname.startsWith('/rrhh') && userType !== 'Recursos Humanos') {
            return NextResponse.redirect(new URL('/403', nextUrl));
        };
        if (nextUrl.pathname.startsWith('/administrador') && userType !== 'Administrador') {
            return NextResponse.redirect(new URL('/403', nextUrl));
        };
    };
   
    // Lista de rutas válidas
    const validRoutes = [
        '/login',
        '/administrativo',
        '/administrador',
        '/rrhh',
        '/403',
        '/404',
    ];
   
    const isValidRoute = validRoutes.some(route =>
        nextUrl.pathname === route ||
        nextUrl.pathname.startsWith(route + '/')
    );
   
    // Si no es una ruta válida, redirigir a 404
    if (!isValidRoute) {
        return NextResponse.redirect(new URL('/404', nextUrl));
    };
   
    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
};