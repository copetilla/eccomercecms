import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { storeId: string } }) {
    try {
        // Inicializar Supabase y obtener parámetros
        const supabase = await supabaseClient();
        const storeId = params.storeId;

        const body = await req.json();
        console.log(body)
        const {
            status,
            phone,
            address,
            fullName,
            city,
            province,
            postalCode,
            country,
            shippingMethod,
            payMethod,
            totalAmount,
            orderItems,
            email,
            house,
        } = body;

        // Validación básica
        if (!storeId || !phone || !address || !orderItems || !orderItems.length) {
            return new NextResponse("Missing data", { status: 400 });
        }

        // Insertar datos en la tabla `Order`
        const { data: orderData, error: orderError } = await supabase
            .from("Order")
            .insert([{
                storeId,
                status,
                phone,
                address,
                fullName,
                city,
                province,
                postalCode,
                country,
                shippingMethod,
                payMethod,
                totalAmount,
                email,
                house,
            }])
            .select();

        if (orderError) {
            console.log(orderError)
            return new NextResponse(`Error creating order: ${orderError.message}`, { status: 500 });
        }

        console.log(orderItems)
        const orderId = orderData[0].id; // ID de la orden creada

        // Insertar `orderItems` relacionados
        const orderItemsData = orderItems.map((item: any) => ({
            orderId,
            productId: item.id,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity,
        }));

        const { data: itemsData, error: itemsError } = await supabase
            .from("OrderItem")
            .insert(orderItemsData);

        if (itemsError) {
            return new NextResponse(`Error creating order items: ${itemsError.message}`, { status: 500 });
        }

        // Responder con éxito
        return NextResponse.json({ message: "Order created successfully", orderId }, { status: 200 });

    } catch (error) {
        console.error("Unexpected error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
