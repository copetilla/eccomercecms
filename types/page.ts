export interface Store {
    id: string;
    billboardId: string;
    name: string;
    user_id: string;
    created_at: string;
}

export interface Billboard {
    id: string;
    storeId: string;
    label: string;
    imageUrl: string;
    created_at: string;
    updated_at: string;
    idImage: string;
}

export interface Category {
    id: string;
    storeId: string;
    billboardId: string;
    name: string;
    label: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    storeId: string;
    categoryId: string;
    name: string;
    price: number;
    isFeatured: boolean;
    isArchived: boolean;
    created_at: string;
    updated_at: string;
    description: string;
}

export interface Product {
    id: string;
    storeId: string;
    categoryId: string;
    name: string;
    price: number;
    isFeatured: boolean;
    isArchived: boolean;
    created_at: string;
    updated_at: string;
    description: string;
}

export interface Order {
    id: string;
    storeId: string;
    status: string; // Estado del pedido (ej.: pending, completed)
    phone: string; // Teléfono de contacto del cliente
    address: string; // Dirección principal de envío
    fullName: string; // Nombre completo del destinatario
    city: string; // Ciudad del envío
    province: string; // Provincia del envío
    postalCode?: string; // Código postal (opcional si no aplica)
    country: string; // País del envío
    shippingMethod: string; // Método de envío seleccionado
    payMethod: string; // Método de pago (ej.: SINPE, tarjeta de crédito)
    totalAmount: number; // Monto total del pedido
    created_at: string;
    updated_at: string;
    OrderItem: OrderItem[]; // Detalle de los productos pedidos
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at: string;
    updated_at: string;
    Product: Product;
}