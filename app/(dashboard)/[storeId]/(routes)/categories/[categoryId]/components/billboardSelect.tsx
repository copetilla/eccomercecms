'use client';

import React, { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Billboard } from '@/types/page';
import { useParams } from 'next/navigation';

interface BillboardSelectProps {
    value: string;
    onChange: (billboardId: string) => void
}

const BillboardSelect = ({ value, onChange }: BillboardSelectProps) => {
    const params = useParams();
    const { storeId } = params;

    const [carteleras, setCarteleras] = useState<Billboard[]>([]); // Estado inicial como arreglo vacío
    const [cartelera, setCartelera] = useState<Billboard | null>(null)
    const [loading, setLoading] = useState(false); // Estado de carga

    useEffect(() => {
        const fetchCarteleras = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/${storeId}/billboards`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error al obtener las categorías: ${response.statusText}`);
                }

                const { data } = await response.json();
                console.log('Datos obtenidos:', data); // Depura los datos aquí

                setCarteleras(data);
                if (value) {
                    const selectedCartelera = data.find((item: Billboard) => item.id === value)
                    setCartelera(selectedCartelera || null)
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                setCarteleras([]); // Estado seguro en caso de error
            } finally {
                setLoading(false);
            }
        };

        fetchCarteleras();
    }, [storeId]);

    return (
        <Select
            value={value || undefined} // Usa el valor pasado por parámetro o undefined si es una cadena vacía
            onValueChange={(selectedValue) => onChange(selectedValue)} // Llama a onChange cuando se seleccione un valor
        >
            <SelectTrigger>
                <SelectValue placeholder={
                    loading
                        ? 'Cargando...'
                        : cartelera ? `${cartelera?.label}`
                            : 'Escoger Cartelera'
                } />
            </SelectTrigger>
            <SelectContent>
                {carteleras.map((cartelera) => (
                    <SelectItem key={cartelera.id} value={cartelera.id} className=' cursor-pointer'>
                        {cartelera.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default BillboardSelect;
