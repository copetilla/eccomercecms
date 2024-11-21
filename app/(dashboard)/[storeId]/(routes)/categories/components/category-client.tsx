'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { Category } from '@/types/page'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import ApiList from '@/components/ui/api-list'

interface BillboardClientProps {
    data: Category[]
}

const CategoryClient: React.FC<BillboardClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={`Categorias (${data.length})`} description='Administra las categorias de tu tienda' />
                <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Añadir nueva
                </Button>
            </div>

            <Separator />
            <DataTable columns={columns} data={data} searchKey='label' />
            <Heading title='API' description='Llamadas API para carteleras' />
            <ApiList entityName='billboards' entityIdName='billboardId' />
        </>
    )
}

export default CategoryClient
