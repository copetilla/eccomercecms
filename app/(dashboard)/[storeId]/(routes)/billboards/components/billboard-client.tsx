'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'

const BillboardClient = () => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title='Cartelera (0)' description='Administra la cartelera de tu tienda' />
                <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Añadir nueva
                </Button>
            </div>

            <Separator />

        </>
    )
}

export default BillboardClient
