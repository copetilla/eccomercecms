import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseClient } from "@/lib/supabase"

export async function POST(req: Request) {
    try {
        const { userId, getToken } = await auth()
        const token = await getToken({ template: 'supabase' })
        const body = await req.json()

        const { name } = body

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        // Crear la tienda en Supabase
        const supabase = await supabaseClient(token)
        const { data, error } = await supabase
            .from('stores')
            .insert([
                {
                    name,
                    user_id: userId,
                }
            ]);

        if (error) {
            console.error('[STORES_POST_ERROR]', error);
            return new NextResponse("Error creating store", { status: 500 });
        }

        return NextResponse.json({ data });

    } catch (error) {
        console.log('[STORES_POST]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        // Obtener el userId del usuario autenticado
        const { userId, getToken } = await auth();
        const token = await getToken({ template: 'supabase' })

        console.log("userId:", userId);  // Verificar el valor de userId

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Obtener las tiendas del usuario desde Supabase
        const supabase = await supabaseClient(token)
        let { data: stores, error } = await supabase
            .from('stores')
            .select('*')

        if (error) {
            console.error('[STORES_GET_ERROR]', error);
            return new NextResponse("Error retrieving stores", { status: 500 });
        }

        return NextResponse.json({ stores });

    } catch (error) {
        console.log('[STORES_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

