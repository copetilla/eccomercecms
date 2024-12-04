'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { Order } from '@/types/page'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import ApiList from '@/components/ui/api-list'

interface OrderClientProps {
    data: Order[]
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={`Ordenes (${data.length})`} description='Administra las ordenes de tu tienda' />
            </div>

            <Separator />
            <DataTable columns={columns} data={data} searchKey='label' />
        </>
    )
}

export default OrderClient
