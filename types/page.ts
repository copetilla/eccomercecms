export interface Store {
    id: string;
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
    id: string,
    storeId: string,
    status: string,
    phone: string,
    address: string,
    total_amount: number,
    created_at: string,
    updated_at: string,
    OrderItems: OrderItems[]
}

export interface OrderItems {
    id: string,
    orderId: string,
    productId: string,
    quantity: number,
    unit_price: number,
    total_price: number,
    created_at: string,
    updated_at: string;
}