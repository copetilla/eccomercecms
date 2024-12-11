import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { storeId: string, orderId: string } }) {
    try {
        const { userId, getToken } = await auth()
        const token = await getToken({ template: 'supabase' });
        const body = await req.json()
        const { status } = body

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is required', { status: 400 });
        }

        const supabase = await supabaseClient(token)

        const { data, error } = await supabase
            .from('Order')
            .update({ status: status })
            .eq('id', params.orderId)

        if (error) {
            return new NextResponse('Error');
        }

        return NextResponse.json(data)

    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error)
        return new NextResponse('Internal error', { status: 500 });

    }
}