import { auth } from "@clerk/nextjs/server"
import { supabaseClient } from "@/lib/supabase"

export async function getStore(userId: string, storeId?: string) {
    try {
        const { getToken } = await auth();
        const token = await getToken({ template: 'supabase' });
        const supabase = await supabaseClient(token);

        let query = supabase
            .from('stores')
            .select('*')
            .eq('user_id', userId);

        if (storeId) {
            query = query.eq('id', storeId);
        }

        const { data, error } = storeId ? await query.single() : await query.limit(1).maybeSingle();

        if (error) {
            console.error('Error fetching store:', error.message);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error in getStore:', error);
        return null;
    }
}


export async function getAllStoresUser(userId: string) {
    const { getToken } = await auth()
    const token = await getToken({ template: 'supabase' })
    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', userId)

    if (error) {
        console.log(error)
        return null
    }

    return data;
}

export async function updateStore(name: string, storeId: string) {
    const { userId, getToken } = await auth()
    if (!userId) {
        return null
    }
    const token = await getToken({ template: 'supabase' })
    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
        .from('stores')
        .update({ 'name': name })
        .eq('id', storeId)
        .select()

    if (error) {
        console.log(error)
        return null
    }

    return data
}
