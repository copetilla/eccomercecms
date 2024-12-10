import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export interface GraphDataType {
    name: string
    total: number
}

export const getAllOrders
    = async (storeId: string) => {
        try {
            const { getToken } = await auth()
            const tokens = await getToken({ template: 'supabase' })
            const supabase = await supabaseClient(tokens);

            const { data, error } = await supabase
                .from('Order')
                .select(`*,
                    OrderItem (*)
                    `)
                .eq('storeId', storeId)

            if (error) {
                console.log('error geting orders')
                return
            }

            console.log(data)

            const monthlyRevenue: { [key: number]: number } = {}

            for (const order of data) {
                // Parsear la fecha
                const month = new Date(order.created_at).getMonth(); // Obtener el mes (0 = Enero)

                let revenueForOrder = 0;

                console.log(order.OrderItem)

                // Iterar sobre los productos en la orden
                for (const item of order.OrderItem) {
                    // Sumar el precio del producto al total
                    revenueForOrder += item.total_price;
                }

                // Agregar al mes correspondiente
                monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
            }

            const graphData: GraphDataType[] = [
                { name: 'Ene', total: 0 },
                { name: 'Feb', total: 0 },
                { name: 'Mar', total: 0 },
                { name: 'Abr', total: 0 },
                { name: 'May', total: 0 },
                { name: 'Jun', total: 0 },
                { name: 'Jul', total: 0 },
                { name: 'Ago', total: 0 },
                { name: 'Sep', total: 0 },
                { name: 'Oct', total: 0 },
                { name: 'Nov', total: 0 },
                { name: 'Dic', total: 0 },
            ];

            for (const month in monthlyRevenue) {
                graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)]
            }
            console.log(graphData)
            return graphData

        } catch (error) {
            console.log('[ERROR_GET]')
            return
        }
    }