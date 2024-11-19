import { supabaseClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // Autenticación de Clerk para obtener el userId y el token
    const { userId, getToken } = await auth();
    const token = await getToken({ template: 'supabase' });

    if (!userId || !token) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Inicializa Supabase con el token de autenticación
    const supabase = await supabaseClient(token);

    // Listar los archivos del bucket
    const { data, error } = await supabase
        .storage
        .from('billboards_background') // Nombre del bucket
        .list(`${userId}`, {
            limit: 5,  // Puedes ajustar este valor
            offset: 0  // Controla el número de archivos que se obtienen
        });

    // Manejo de errores si no se pueden listar los archivos
    if (error) {
        return NextResponse.json({ error: 'Error listing files from the bucket' }, { status: 400 });
    }



    // Generar URLs públicas para cada archivo
    const urls = data.map((file) => {
        const filePath = `${userId}/${file.name}`
        const { data: publicUrlData } = supabase.storage
            .from('billboards_background')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    });

    // Devolver las URLs generadas en formato JSON
    return NextResponse.json(urls);
}

export async function POST(req: NextRequest) {
    const formData = await req.formData(); // Procesar FormData
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    try {
        const newUuid = uuidv4();
        const { userId, getToken } = await auth()

        const token = await getToken({ template: 'supabase' })
        const supabase = await supabaseClient(token)

        const filePath = `${userId}/${newUuid}`;

        const { data, error } = await supabase
            .storage
            .from('billboards_background')
            .upload(filePath, file)

        if (error) {
            throw new Error('Error: ', error)
        }

        const { data: publicUrlData } = supabase
            .storage
            .from('billboards_background')
            .getPublicUrl(filePath);

        // Guardar el public URL en la tabla
        const imageUrl = publicUrlData.publicUrl;

        return NextResponse.json(imageUrl); // Responder con el nuevo ejemplo
    } catch (error) {
        return NextResponse.json(
            { error: 'Error procesando la solicitud' },
            { status: 400 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { userId, getToken } = await auth()

        const token = await getToken({ template: 'supabase' })
        const supabase = await supabaseClient(token)
        const { fileName } = await req.json()

        const { data, error } = await supabase
            .storage
            .from('billboards_background')
            .remove(fileName)

        if (error) {
            throw new Error('Error eliminando el archivo ', error)
        }

        return NextResponse.json({ message: 'Archivo eliminado', data })
    } catch (error) {
        console.error('Error al eliminar el archivo:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}