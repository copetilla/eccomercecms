import React from 'react';
import { format } from 'date-fns';
import CategoryClient from './components/category-client';
import { auth } from '@clerk/nextjs/server';
import { supabaseClient } from '@/lib/supabase';
import { Category, Billboard } from '@/types/page';

const formatCategoryData = (categories: Category[]): Category[] =>
    categories.map((category) => ({
        ...category,
        created_at: format(new Date(category.created_at), 'MMMM do, yyyy HH:mm'),
        updated_at: format(new Date(category.updated_at), 'MMMM do, yyyy HH:mm'),
    }));

const CategoryPage = async ({ params }: { params: { storeId: string } }) => {
    const { getToken } = await auth();
    const token = await getToken({ template: 'supabase' });
    const supabase = await supabaseClient(token);

    // Cargar categorías por storeId
    const { data, error } = await supabase
        .from('Category')
        .select('*')
        .eq('storeId', params.storeId);

    if (error) {
        console.log('ERROR LOADING CATEGORIES', error);
    }

    // Si tenemos los datos de las categorías
    let safeData: Category[] = [];

    if (data) {
        // Paso 1: Obtener los billboardIds
        const billboardIds = data.map((category) => category.billboardId);

        // Paso 2: Cargar los labels de los billboards
        const { data: billboardData, error: billboardError } = await supabase
            .from('billboards')  // Asegúrate de que la tabla 'Billboard' esté bien definida
            .select('id, label') // Seleccionar los campos necesarios
            .in('id', billboardIds);  // Filtrar por los ids de los billboards que tenemos en las categorías

        if (billboardError) {
            console.log('Error al obtener los labels de los billboards:', billboardError);
        }

        // Paso 3: Asociar los labels con las categorías
        if (billboardData) {
            safeData = data.map((category) => {
                const billboard = billboardData.find((b) => b.id === category.billboardId);
                return {
                    ...category,
                    label: billboard ? billboard.label : 'Label no encontrado', // Si no se encuentra el billboard, poner un texto por defecto
                    created_at: format(new Date(category.created_at), 'MMMM do, yyyy HH:mm'),
                    updated_at: format(new Date(category.updated_at), 'MMMM do, yyyy HH:mm'),
                };
            });

            console.log(safeData)
        }
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={safeData} />
            </div>
        </div>
    );
};

export default CategoryPage;
