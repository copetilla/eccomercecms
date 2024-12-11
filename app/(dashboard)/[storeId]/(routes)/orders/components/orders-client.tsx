'use client'
import React from 'react'

import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Order } from '@/types/page'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'

interface OrderClientProps {
    data: Order[]
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={`Ordenes (${data.length})`} description='Administra las ordenes de tu tienda' />
            </div>

            <Separator />
            <DataTable columns={columns} data={data} searchKey='fullName' />
        </>
    )
}

export default OrderClient
