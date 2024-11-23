'use client'

import React, { useState } from 'react'
import * as z from 'zod'
import { Billboard } from '@/types/page'
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
import { ImageUploader } from '@/components/upload_image'


interface BillboardFormProps {
    billboard: Billboard | null
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
});

type BillboardFormValues = z.infer<typeof formSchema>;

const ProductForm: React.FC<BillboardFormProps> = ({ billboard }) => {
    const params = useParams();
    const router = useRouter();

    const { storeId, billboardId } = params

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = billboard ? "Editar cartelera" : "Crear cartelera";
    const description = billboard ? "Editar una cartelera" : "Añadira una nueva cartelera";
    const action = billboard ? "Guardar cambios" : "Crear";

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: billboard || {
            label: '',
            imageUrl: ''
        }
    });

    const onSubmit = async (data: BillboardFormValues) => {
        setLoading(true)
        if (billboard) {

            try {

                const response = await fetch(`/api/${storeId}/billboards/${billboardId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ label: data.label, imageUrl: data.imageUrl })
                })

                if (!response.ok) {
                    toast.error('Error al actualizar la cartelera')
                    return
                }
                router.push(`/${storeId}/billboards`)
                router.refresh()
                toast.success('¡Cartelera actualizada con éxito!')
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }


        } else {
            try {

                const response = await fetch(`/api/${storeId}/billboards/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ label: data.label, imageUrl: data.imageUrl })
                })

                if (!response.ok) {
                    toast.error('Error al crear la cartelera')
                    return
                }
                router.push(`/${storeId}/billboards`)
                router.refresh()
                toast.success('¡Cartelera creada con éxito!')
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

            const response = await fetch(`/api/${storeId}/billboards/${billboardId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('No se pudo eliminar')

            }
            router.push(`/${storeId}/billboards`)
            router.refresh()
            toast.success('¡Cartelera eliminada con éxito!')

            return response

        } catch (error) {
            toast.error('Cartelera eliminada sin éxito')
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
                {billboard && (<Button
                    disabled={loading}
                    variant={'destructive'}
                    size={'sm'}
                    onClick={() => { setOpen(true) }}
                >
                    <Trash className='h-4 w-4' />
                </Button>)}
            </div>

            <Separator />

            <ImageUploader />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=' space-y-8 w-full'
                >
                    {/* <div className='grid grid-cols-3 gap-8'>

                        <FormField
                            control={form.control}
                            name='imageUrl'
                            render={({ field }) => (
                                <FormItem className=''>
                                    <FormLabel>
                                        Imagen
                                    </FormLabel>
                                    <FormControl className=''>
                                        <ImageUploader
                                            value={field.value}
                                            onchange={(imageUrl) => field.onChange(imageUrl)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                    </div> */}
                    <div className='grid grid-cols-3 gap-8'>

                        <FormField
                            control={form.control}
                            name='label'
                            render={({ field }) => (
                                <FormItem className=''>
                                    <FormLabel>
                                        Nombre
                                    </FormLabel>
                                    <FormControl className=''>
                                        <Input
                                            disabled={loading}
                                            placeholder='Etiqueta de la cartelera'
                                            {...field}
                                            className=''
                                        />
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

export default ProductForm