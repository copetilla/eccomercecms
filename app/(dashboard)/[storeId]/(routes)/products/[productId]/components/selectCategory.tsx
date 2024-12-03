'use client'

import React, { useEffect, useState } from 'react'
import { Category } from '@/types/page'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useParams } from 'next/navigation'
import { Loader } from 'lucide-react'

interface SelectCategoryProps {
    value: string;
    onChange: (categoryId: string) => void
}

const SelectCategory: React.FC<SelectCategoryProps> = ({ value, onChange }) => {

    const params = useParams()
    const { storeId } = params

    const [categories, setCategories] = useState<Category[]>([]); // Estado inicial como arreglo vacío
    const [category, setCategory] = useState<Category | null>(null)
    const [loading, setLoading] = useState(false); // Estado de carga

    useEffect(() => {
        const fetchCarteleras = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/${storeId}/categories`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error al obtener las categorías: ${response.statusText}`);
                }

                const { data } = await response.json();

                setCategories(data);
                if (value) {
                    const selectedCartelera = data.find((item: Category) => item.id === value)
                    setCategory(selectedCartelera || null)
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                setCategories([]); // Estado seguro en caso de error
            } finally {
                setLoading(false);
            }
        };

        fetchCarteleras();
    }, [storeId]);

    return (
        <Select onValueChange={(value) => {
            onChange(value)
        }}>
            <SelectTrigger className="">
                <SelectValue placeholder={loading ? <Loader /> : value ? `${category?.name}` : 'Categorias'} />
            </SelectTrigger>
            <SelectContent>
                {categories.map((category) => (
                    <SelectItem key={category.name} className=' cursor-pointer' value={category.id}>{category.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default SelectCategory