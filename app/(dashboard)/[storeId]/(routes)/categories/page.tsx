import React from 'react'
import { format } from 'date-fns';
import CategoryClient from './components/category-client'
import { auth } from '@clerk/nextjs/server';
import { supabaseClient } from '@/lib/supabase';
import { Category } from '@/types/page';

const formatCategoryData = (categories: Category[]): Category[] =>
    categories.map((category) => ({
        ...category,
        created_at: format(new Date(category.created_at), 'MMMM do, yyyy HH:mm'),
        updated_at: format(new Date(category.updated_at), 'MMMM do, yyyy HH:mm'),
    }));

const CategoryPage = async ({ params }: { params: { storeId: string } }) => {

    const { getToken } = await auth();
    const token = await getToken({ template: 'supabase' })
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('Category')
        .select('*')
        .eq('storeId', params.storeId)

    if (error) {
        console.log('ERROR LOADING BILLBOARDS', error)
    }

    const safeData: Category[] = formatCategoryData(data || []);

    return (
        <div className=' flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <CategoryClient data={safeData} />
            </div>
        </div>
    )
}

export default CategoryPage