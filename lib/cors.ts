import { NextRequest, NextResponse } from 'next/server';

export function cors(req: NextRequest, res: NextResponse) {
    res.headers.set('Access-Control-Allow-Origin', req.headers.get('origin') || '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.headers.set('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return new NextResponse(null, { status: 204 });
    }
}