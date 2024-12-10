import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const getStockCount
    = async (storeId: string) => {
        try {
            const { getToken } = await auth()
            const tokens = await getToken({ template: 'supabase' })
            const supabase = await supabaseClient(tokens);

            const { data, error } = await supabase
                .from('Product')
                .select('*')
                .eq('storeId', storeId)
                .eq('isArchived', false)

            if (error) {
                console.log('error geting orders')
                return
            }

            return data.length


        } catch (error) {
            console.log('[ERROR_GET]')
            return
        }
    }