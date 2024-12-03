import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
    try {
        const { userId, getToken } = await auth()
        const token = await getToken({ template: 'supabase' });
        const body = await req.json()
        const { name, billboardId } = body

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('name is required', { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse('Image is required', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is required', { status: 400 });
        }

        const supabase = await supabaseClient(token)

        const { data, error } = await supabase
            .from('Category')
            .update({ name: name, billboardId: billboardId })
            .eq('id', params.categoryId)
            .select()

        if (error) {
            return new NextResponse('Error');
        }

        return NextResponse.json(data)

    } catch (error) {
        console.log('[CATEGORY_PATCH]', error)
        return new NextResponse('Internal error', { status: 500 });

    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
    try {
        const { userId, getToken } = await auth()
        const token = await getToken({ template: 'supabase' });

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.categoryId) {
            return new NextResponse('Billboard Id is required', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is required', { status: 400 });
        }

        const supabase = await supabaseClient(token)

        const { error } = await supabase
            .from('Category')
            .delete()
            .eq('id', params.categoryId)
        if (error) {
            return new NextResponse('Error');
        }

        return new NextResponse('Category deleted successfully', { status: 200 });

    } catch (error) {
        console.log('[CATEGORY_DELETE]', error)
        return new NextResponse('Internal error', { status: 500 });

    }
}
