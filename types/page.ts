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
    label: string;
    created_at: string;
    updated_at: string;
}


