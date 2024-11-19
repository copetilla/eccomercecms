import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { storeId: string } }) {
    try {
        const { getToken } = await auth()
        const token = await getToken({ template: 'supabase' })
        const supabase = await supabaseClient(token)

        const body = await req.json()
        const { label, imageUrl } = body

        const { data, error } = await supabase
            .from('billboards')
            .insert([{
                storeId: params.storeId,
                label: label,
                imageUrl: imageUrl
            }])

        if (error) {
            return new NextResponse("Error creating billboard", { status: 500 });
        }

        return NextResponse.json({ data })

    } catch (error) {
        console.log(error)
        return new NextResponse("[ERROR_BILLBOARD]", { status: 500 });
    }
}