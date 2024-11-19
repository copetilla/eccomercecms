import { getStore } from '@/app/api/stores/route';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import SettingsForm from './components/settings-form';

interface SettingsPageProps {
    params: {
        storeId: string;
    }
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
    const { userId } = await auth()

    if (!userId) {
        redirect('/sign-in')
    }

    const store = await getStore(userId, params.storeId)

    if (!store) {
        redirect('/')
    }

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <SettingsForm store={store} />
            </div>
        </div>
    )
}

export default SettingsPage