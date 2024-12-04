import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        const { userId, getToken } = await auth();
        const token = await getToken({ template: 'supabase' });

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.productId) {
            return new NextResponse('Product Id is required', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is required', { status: 400 });
        }

        const supabase = await supabaseClient(token);

        // Verificar la existencia de archivos en el folder del producto
        const { data: files, error: listError } = await supabase
            .storage
            .from('productImages')
            .list(`${params.productId}/`, { limit: 100 });

        console.log(files)

        if (listError) {
            console.error("Error al listar los archivos:", listError);
            return new NextResponse('Error listing files', { status: 500 });
        }

        // Si hay archivos, eliminarlos
        if (files && files.length > 0) {
            const filePaths = files.map(file => `${params.productId}/${file.name}`); // Obtener las rutas de los archivos

            const { error: removeError } = await supabase
                .storage
                .from('productImages')
                .remove(filePaths);  // Eliminar los archivos

            if (removeError) {
                console.error("Error al eliminar los archivos:", removeError);
                return new NextResponse('Error deleting images', { status: 500 });
            }

            console.log("Archivos eliminados correctamente");
        } else {
            console.log("No se encontraron archivos en el folder");
        }

        // Ahora eliminar el producto de la base de datos
        const { error: productError } = await supabase
            .from('Product')
            .delete()
            .eq('id', params.productId);

        if (productError) {
            console.error("Error al eliminar el producto:", productError);
            return new NextResponse('Error deleting product', { status: 500 });
        }

        return new NextResponse('Product deleted successfully', { status: 200 });

    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { productId: string } }) {
    try {
        const { userId, getToken } = await auth();
        const token = await getToken({ template: 'supabase' });

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.productId) {
            return new NextResponse('Product ID is required', { status: 400 });
        }

        const supabase = await supabaseClient(token);

        // Obtener datos del body
        const body = await req.json();
        const { name, price, isFeatured, isArchived, categoryId } = body;

        // Validaciones opcionales
        if (!name && !price && !price) {
            return new NextResponse('At least one field is required to update', { status: 400 });
        }

        // Construir el objeto de actualización
        const updateFields: any = {};
        updateFields.name = name;
        updateFields.price = price;
        updateFields.isFeatured = isFeatured;
        updateFields.isArchived = isArchived;
        updateFields.categoryId = categoryId;

        const { data, error } = await supabase
            .from('Product')
            .update(updateFields)
            .eq('id', params.productId);

        if (error) {
            console.error("Error updating product:", error);
            return new NextResponse('Error updating product', { status: 500 });
        }

        console.log("Product updated:", data);
        return NextResponse.json({ data });

    } catch (error) {
        console.log('[PRODUCT_UPDATE]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}