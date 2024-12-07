import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { storeId: string } }) {
    try {
        const { getToken } = await auth()
        const token = await getToken({ template: 'supabase' })
        const supabase = await supabaseClient(token)

        const body = await req.json()
        const { name, billboardId } = body

        const { data, error } = await supabase
            .from('Category')
            .insert([{
                storeId: params.storeId,
                billboardId: billboardId,
                name: name,
            }])

        if (error) {
            return new NextResponse("Error creating category", { status: 500 });
        }

        return NextResponse.json({ data })

    } catch (error) {
        console.log(error)
        return new NextResponse("[ERROR_CATEGORY]", { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {

        const supabase = await supabaseClient();

        const { data, error } = await supabase
            .from('Category')
            .select('*')
            .eq('storeId', params.storeId)

        if (error) {
            console.error("Error al obtener categorías:", error.message);
            return NextResponse.json(
                { message: "Error getting categories", error: error.message },
                { status: 500 }
            );
        }

        if (!data || data.length === 0) {
            return NextResponse.json(
                { message: "No categories found", data: [] },
                { status: 404 }
            );
        }

        return NextResponse.json({ data }, { status: 200 });

    } catch (error) {
        return new NextResponse("[ERROR_CATEGORY]", { status: 500 });
    }
}