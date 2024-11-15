import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId, getToken } = await auth()
        const token = await getToken({ template: 'supabase' });
        const body = await req.json()
        const { name } = body

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is required', { status: 400 });
        }

        const supabase = await supabaseClient(token)

        const { data, error } = await supabase
            .from('stores')
            .update({ name: name })
            .eq('id', params.storeId)
            .select()

        if (error) {
            return new NextResponse('Error');
        }

        return NextResponse.json(data)

    } catch (error) {
        console.log('[STORE_PATCH]', error)
        return new NextResponse('Internal error', { status: 500 });

    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId, getToken } = await auth()
        const token = await getToken({ template: 'supabase' });

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is required', { status: 400 });
        }

        const supabase = await supabaseClient(token)

        const { error } = await supabase
            .from('stores')
            .delete()
            .eq('id', params.storeId)
        if (error) {
            return new NextResponse('Error');
        }

        return new NextResponse('Store deleted successfully', { status: 200 });

    } catch (error) {
        console.log('[STORE_DELETE]', error)
        return new NextResponse('Internal error', { status: 500 });

    }
}