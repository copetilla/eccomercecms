import React from 'react'
import { format } from 'date-fns';
import BillboardClient from './components/billboard-client'
import { auth } from '@clerk/nextjs/server';
import { supabaseClient } from '@/lib/supabase';
import { Billboard } from '@/types/page';

const formatBillboardsData = (billboards: Billboard[]): Billboard[] =>
    billboards.map((billboard) => ({
        ...billboard,
        created_at: format(new Date(billboard.created_at), 'MMMM do, yyyy HH:mm'),
        updated_at: format(new Date(billboard.updated_at), 'MMMM do, yyyy HH:mm'),
    }));

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {

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

    const safeData: Billboard[] = formatBillboardsData(data || []);

    return (
        <div className=' flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <BillboardClient data={safeData} />
            </div>
        </div>
    )
}

export default BillboardsPage