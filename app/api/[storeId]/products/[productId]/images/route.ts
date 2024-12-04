import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest, { params }: { params: { productId: string } }) {
    const formData = await req.formData(); // Procesar FormData
    const files = formData.getAll('files'); // Obtener múltiples archivos
    console.log('Archivos recibidos:', files);

    if (!files || files.length === 0) {
        return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    try {
        const { getToken } = await auth();
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);

        const uploadedFiles = []; // Array para almacenar los URLs públicos de las imágenes

        for (const file of files) {
            const newUuid = uuidv4();
            const filePath = `${params.productId}/${newUuid}`;

            // Subir archivo al bucket de Supabase
            const { error } = await supabase
                .storage
                .from('productImages')
                .upload(filePath, file);

            if (error) {
                console.error(`Error uploading file ${file.toString()}:`, error.message);
                continue; // Saltar al siguiente archivo si hay error
            }

            // Obtener URL pública del archivo
            const { data: publicUrlData } = supabase
                .storage
                .from('productImages')
                .getPublicUrl(filePath);

            if (publicUrlData) {
                uploadedFiles.push({
                    id: newUuid, // UUID
                    url: publicUrlData.publicUrl, // URL pública
                    productId: params.productId, // Asociar el producto
                });
            }
        }

        if (uploadedFiles.length > 0) {
            const { error: insertError } = await supabase
                .from('ImageProduct')
                .insert(uploadedFiles);

            if (insertError) {
                console.error('Error al insertar nuevas imágenes en la base de datos:', insertError);
                return NextResponse.json({ error: 'Error al insertar nuevas imágenes' }, { status: 500 });
            }
        }


        return new NextResponse("Creacion de imagenes exitosa", { status: 200 });
    } catch (error) {
        console.error("Error processing files:", error);
        return NextResponse.json(
            { error: 'Error procesando la solicitud' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {

    try {
        const supabase = await supabaseClient();

        const { data, error } = await supabase
            .from('ImageProduct')
            .select('*')
            .eq('productId', params.productId)

        if (error) {
            console.error(`Error getting images`);
            return
        }

        return NextResponse.json({ data }); // Responder con los URLs de los archivos subidos

    } catch (error) {
        console.error("Catch error getting images", error);
        return NextResponse.json(
            { error: 'Error procesando la solicitud' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { productId: string } }) {
    try {
        const body = await req.json();
        const { urlsDelete } = body;

        const { getToken } = await auth();
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);

        if (urlsDelete && urlsDelete.length > 0) {
            const { data: imagesToDelete, error: selectError } = await supabase
                .from('ImageProduct')
                .select('id, url')
                .in('url', urlsDelete)
                .eq('productId', params.productId);

            if (selectError) {
                console.error('Error al obtener las imágenes a eliminar:', selectError);
                return NextResponse.json({ error: 'Error al obtener imágenes' }, { status: 500 });
            }
            console.log('Resultado de la consulta:', imagesToDelete);

            if (imagesToDelete.length > 0) {
                const filePaths = imagesToDelete.map(image => `${params.productId}/${image.id}`);

                // Eliminar archivos del bucket
                const { error: storageError } = await supabase
                    .storage
                    .from('productImages')
                    .remove(filePaths);

                if (storageError) {
                    console.error('Error al eliminar archivos del bucket:', storageError);
                    return NextResponse.json({ error: 'Error al eliminar archivos' }, { status: 500 });
                }

                // Eliminar registros de la tabla
                const { error: dbDeleteError } = await supabase
                    .from('ImageProduct')
                    .delete()
                    .in('id', imagesToDelete.map(img => img.id));

                if (dbDeleteError) {
                    console.error('Error al eliminar registros de la base de datos:', dbDeleteError);
                    return NextResponse.json({ error: 'Error al eliminar registros' }, { status: 500 });
                }
            }
        }
        return new NextResponse("Eliminacion exitosa de imagenes", { status: 200 });
    } catch (error) {
        return new NextResponse("AQUI ESTA EL ERROR DIO MIO", { status: 500 });
    }
}