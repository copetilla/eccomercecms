'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { Product } from '@/types/page'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import ApiList from '@/components/ui/api-list'

interface ProductClientProps {
    data: Product[]
}

const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={`Productos (${data.length})`} description='Administra los productos de tu tienda' />
                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Añadir nuevo
                </Button>
            </div>

            <Separator />
            <DataTable columns={columns} data={data} searchKey='name' />
            <Heading title='API' description='Llamadas API para carteleras' />
            <ApiList entityName='products' entityIdName='productId' />
        </>
    )
}

export default ProductClient
