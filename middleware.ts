import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api(.*)']);

export default clerkMiddleware(async (auth, request) => {
    // Establecer encabezados CORS
    const response = NextResponse.next();
    const origin = request.headers.get('origin') || '*';

    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Manejo de solicitudes OPTIONS para preflight
    if (request.method === 'OPTIONS') {
        response.headers.set('Content-Length', '0');
        return new Response(null, { status: 204, headers: response.headers });
    }

    // Proteger las rutas privadas usando Clerk
    if (!isPublicRoute(request)) {
        await auth.protect();
    }

    return response;
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ],
};
