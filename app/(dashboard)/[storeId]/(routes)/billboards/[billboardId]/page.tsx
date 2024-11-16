import { supabaseClient } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import BillboardForm from './components/billboard-form'

const BillboardPage = async ({ params }: { params: { billboardId: string } }) => {

    console.log('aqui llego?')
    const { getToken } = await auth()
    // if (!getToken) {
    //     redirect('/sign-in')
    // }
    const token = await getToken({ template: 'supabase' })
    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
        .from('billboard')
        .select()
        .eq('id', params.billboardId)
        .single()

    console.log("aqui", error)

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                {/* <BillboardForm billboard={data} /> */}
                Aqui toy
            </div>
        </div>
    )
}

export default BillboardPage