import { supabaseClient } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'
import React from 'react'
import BillboardForm from './components/billboard-form'

const BillboardPage = async ({ params }: { params: { billboardId: string } }) => {

    const { getToken } = await auth()
    if (!getToken) {
        console.log('no token')
    }
    const token = await getToken({ template: 'supabase' })
    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
        .from('billboards')
        .select()
        .eq('id', params.billboardId)
        .single()

    console.log(error)

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <BillboardForm billboard={data} />

            </div>
        </div>
    )
}

export default BillboardPage