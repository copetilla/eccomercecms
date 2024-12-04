import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { storeId: string } }) {

    try {
        const { getToken } = await auth()
        const token = await getToken({ template: 'supabase' })
        const supabase = await supabaseClient(token)

        const body = await req.json()
        const { name, price, categoryId, isFeatured, isArchived, description } = body

        const { data, error } = await supabase
            .from('Product')
            .insert([{
                storeId: params.storeId,
                categoryId: categoryId,
                name: name,
                price: price,
                isFeatured: isFeatured,
                isArchived: isArchived,
                description: description
            }])
            .select()

        if (error) {
            console.log(error)
            return new NextResponse("Error creating product", { status: 500 });
        }

        console.log("Datos insertados:", data)

        return NextResponse.json({ data })

    } catch (error) {
        console.log(error)
        return new NextResponse("[ERROR_PRODUCT]", { status: 500 });
    }
}

