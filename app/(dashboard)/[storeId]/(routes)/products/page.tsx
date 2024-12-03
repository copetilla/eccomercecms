import React from 'react'
import { format } from 'date-fns';
import ProductClient from './components/product-client'
import { auth } from '@clerk/nextjs/server';
import { supabaseClient } from '@/lib/supabase';
import { Product } from '@/types/page';

const formatProductsData = (Products: Product[]): Product[] =>
    Products.map((Product) => ({
        ...Product,
        created_at: format(new Date(Product.created_at), 'MMMM do, yyyy HH:mm'),
        updated_at: format(new Date(Product.updated_at), 'MMMM do, yyyy HH:mm'),
    }));

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {

    const { getToken } = await auth();
    const token = await getToken({ template: 'supabase' })
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('Product')
        .select('*')
        .eq('storeId', params.storeId)

    if (error) {
        console.log('ERROR LOADING PRODUCTS', error)
    }

    const safeData: Product[] = formatProductsData(data || []);

    return (
        <div className=' flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ProductClient data={safeData} />
            </div>
        </div>
    )
}

export default ProductsPage