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

