import { supabaseClient } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import ProductForm from './components/product-form'

const ProductPage = async ({ params }: { params: { productId: string } }) => {

    const { getToken } = await auth()
    if (!getToken) {
        console.log('no token')
    }
    const token = await getToken({ template: 'supabase' })
    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
        .from('Product')
        .select()
        .eq('id', params.productId)
        .single()

    console.log(error)

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ProductForm product={data} />

            </div>
        </div>
    )
}

export default ProductPage