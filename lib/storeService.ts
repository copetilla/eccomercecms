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