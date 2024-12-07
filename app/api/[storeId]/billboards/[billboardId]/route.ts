import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        const { userId, getToken } = await auth()
        const token = await getToken({ template: 'supabase' });
        const body = await req.json()
        const { label, imageUrl } = body

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!label) {
            return new NextResponse('Label is required', { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse('Image is required', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is required', { status: 400 });
        }

        const supabase = await supabaseClient(token)

        const { data, error } = await supabase
            .from('billboards')
            .update({ label: label, imageUrl: imageUrl })
            .eq('id', params.billboardId)
            .select()

        if (error) {
            return new NextResponse('Error');
        }

        return NextResponse.json(data)

    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error)
        return new NextResponse('Internal error', { status: 500 });

    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        const { userId, getToken } = await auth()
        const token = await getToken({ template: 'supabase' });

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.billboardId) {
            return new NextResponse('Billboard Id is required', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is required', { status: 400 });
        }

        const supabase = await supabaseClient(token)

        const { error } = await supabase
            .from('billboards')
            .delete()
            .eq('id', params.billboardId)
        if (error) {
            return new NextResponse('Error');
        }

        return new NextResponse('Billboard deleted successfully', { status: 200 });

    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error)
        return new NextResponse('Internal error', { status: 500 });

    }
}

export async function GET(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {

        const supabase = await supabaseClient();

        const { data, error } = await supabase
            .from('billboards')
            .select('*')
            .eq('id', params.billboardId)
            .single()

        if (error) {
            return new NextResponse("Error getting billboard", { status: 500 });
        }

        return NextResponse.json({ data })

    } catch (error) {
        return new NextResponse("[ERROR_BILLBOARD]", { status: 500 });
    }
}