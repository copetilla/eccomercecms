'use client'

import React, { useState } from 'react'
import * as z from 'zod'
import { Category } from '@/types/page'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import AlertModal from '@/components/modals/alert-modal'
import BillboardSelect from './billboardSelect'

interface CategoryFormProps {
    category: Category | null
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
});

type CategoryFormValues = z.infer<typeof formSchema>;

const CategoryForm: React.FC<CategoryFormProps> = ({ category }) => {
    const params = useParams();
    const router = useRouter();

    const { storeId, categoryId } = params

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = category ? "Editar categoria" : "Crear categoria";
    const description = category ? "Editar una categoria" : "Añadira una nueva categoria";
    const action = category ? "Guardar cambios" : "Crear";

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: category || {
            name: '',
            billboardId: ''
        }
    });

    const onSubmit = async (data: CategoryFormValues) => {
        setLoading(true)
        console.log(data)
        if (category) {

            try {

                const response = await fetch(`/api/${storeId}/categories/${categoryId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: data.name, billboardId: data.billboardId })
                })

                if (!response.ok) {
                    toast.error('Error al actualizar la categoria')
                    return
                }
                router.push(`/${storeId}/categories`)
                router.refresh()
                toast.success('Categoria actualizada con éxito!')
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }


        } else {
            try {

                const response = await fetch(`/api/${storeId}/categories/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: data.name, billboardId: data.billboardId })
                })

                if (!response.ok) {
                    toast.error('Error al crear la categoria')
                    return
                }
                router.push(`/${storeId}/categories`)
                router.refresh()
                toast.success('Categoria creada con éxito!')
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
    }

    const onDelete = async () => {
        setLoading(true)
        try {

            const response = await fetch(`/api/${storeId}/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('No se pudo eliminar')

            }
            router.push(`/${storeId}/categories`)
            router.refresh()
            toast.success('¡Categoria eliminada con éxito!')

            return response

        } catch (error) {
            toast.error('Error al elminar la categoria')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => { setOpen(false) }}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className='flex items-center justify-between'>
                <Heading
                    title={title}
                    description={description}
                />
                {category && (<Button
                    disabled={loading}
                    variant={'destructive'}
                    size={'sm'}
                    onClick={() => { setOpen(true) }}
                >
                    <Trash className='h-4 w-4' />
                </Button>)}
            </div>

            <Separator />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=' space-y-8 w-full'
                >

                    <div className='grid md:grid-cols-2 gap-8'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className=''>
                                    <FormLabel>
                                        Nombre
                                    </FormLabel>
                                    <FormControl className=''>
                                        <Input
                                            disabled={loading}
                                            placeholder='Nombre de la categoria'
                                            {...field}
                                            className=''
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='billboardId'
                            render={({ field }) => (
                                <FormItem className=''>
                                    <FormLabel>
                                        Cartelera
                                    </FormLabel>
                                    <FormControl className=''>
                                        <BillboardSelect
                                            disabled={loading}
                                            value={field.value}
                                            onChange={(value) => {
                                                console.log("Valor seleccionado:", value); // Imprime el valor
                                                field.onChange(value); // Llama a la función original
                                            }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <Button disabled={loading} type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>

        </>
    )
}

export default CategoryForm