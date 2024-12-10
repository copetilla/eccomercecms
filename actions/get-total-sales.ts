import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const getSalesCount
    = async (storeId: string) => {
        try {
            const { getToken } = await auth()
            const tokens = await getToken({ template: 'supabase' })
            const supabase = await supabaseClient(tokens);

            const { data, error } = await supabase
                .from('Order')
                .select('*')
                .eq('storeId', storeId)
                .or('status.eq.completed,status.eq.paid');

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