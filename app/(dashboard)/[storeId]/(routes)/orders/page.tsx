import React from 'react'
import { format } from 'date-fns';
import OrderClient from './components/orders-client'
import { auth } from '@clerk/nextjs/server';
import { supabaseClient } from '@/lib/supabase';
import { Order } from '@/types/page';

const formatOrdersData = (Orders: Order[]): Order[] =>
    Orders.map((order) => ({
        ...order,
        created_at: format(new Date(order.created_at), 'MMMM do, yyyy HH:mm'),
        updated_at: format(new Date(order.updated_at), 'MMMM do, yyyy HH:mm'),
    }));

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {

    const { getToken } = await auth();
    const token = await getToken({ template: 'supabase' })
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('Order')
        .select(`
            *,
            OrderItem (
                *,
                Product (*)
            )
        `)
        .eq('storeId', params.storeId)

    if (error) {
        console.log('ERROR LOADING Orders', error)
    }
    const safeData: Order[] = formatOrdersData(data || []);

    return (
        <div className=' flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <OrderClient data={safeData} />
            </div>
        </div>
    )
}

export default OrdersPage