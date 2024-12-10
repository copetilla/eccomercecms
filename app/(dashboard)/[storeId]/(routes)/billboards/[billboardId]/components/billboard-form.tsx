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
import { ImageUploaderBillboard } from '@/components/upload_image_billboard'
import { auth } from '@clerk/nextjs/server'


interface BillboardFormProps {
    billboard: Billboard | null
}

const formSchema = z.object({
    label: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ billboard }) => {
    const params = useParams();
    const router = useRouter();

    const { storeId, billboardId } = params

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState<File | null>(null)

    const title = billboard ? "Editar cartelera" : "Crear cartelera";
    const description = billboard ? "Editar una cartelera" : "Añadira una nueva cartelera";
    const action = billboard ? "Guardar cambios" : "Crear";

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: billboard || {
            label: ''
        }
    });

    const onSubmit = async (data: BillboardFormValues) => {
        setLoading(true)
        if (billboard) {

            try {

                if (image) {
                    const responseStorage = await fetch(`/api/billboard_background`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: billboard?.idImage })
                    })

                    if (!responseStorage.ok) {
                        console.log('error deleting storage')
                        return
                    }

                    const formData = new FormData();
                    formData.append("file", image);

                    const responseImage = await fetch(`/api/billboard_background`, {
                        method: "POST",
                        body: formData,
                    });

                    if (!responseImage.ok) {
                        const errorData = await responseImage.json();
                        console.error("Error uploading files:", errorData.error);
                        toast.error("Error al subir las imágenes.");
                        return;
                    }

                    const imagen = await responseImage.json()

                    const response = await fetch(`/api/${storeId}/billboards/${billboardId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ label: data.label, imageUrl: imagen.imageUrl, idImage: imagen.id })
                    })

                    if (!response.ok) {
                        toast.error('Error al actualizar la cartelera')
                        return
                    }
                } else {

                    const response = await fetch(`/api/${storeId}/billboards/${billboardId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ label: data.label })
                    })

                    if (!response.ok) {
                        toast.error('Error al actualizar la cartelera')
                        return
                    }
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

                if (image) {

                    const formData = new FormData();
                    formData.append("file", image);

                    const responseImage = await fetch(`/api/billboard_background`, {
                        method: "POST",
                        body: formData,
                    });

                    if (!responseImage.ok) {
                        const errorData = await responseImage.json();
                        console.error("Error uploading files:", errorData.error);
                        toast.error("Error al subir las imágenes.");
                        return;
                    }

                    console.log(responseImage)
                    const imagen = await responseImage.json()

                    const response = await fetch(`/api/${storeId}/billboards/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ idImage: imagen.id, label: data.label, imageUrl: imagen.imageUrl })
                    })

                    if (!response.ok) {
                        toast.error('Error al crear la cartelera')
                        return
                    }
                } else {
                    toast.error('Error, mínimo 1 imagens')
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

            const responseStorage = await fetch(`/api/billboard_background`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: billboard?.idImage })
            })

            if (!responseStorage.ok) {
                console.log('error deleting storage')
                return
            }

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
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                <ImageUploaderBillboard
                    setImagesUpload={setImage}
                    billboard={billboard}
                />
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=' space-y-8 w-full'
                >

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

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
                    <Button onClick={(e) => {
                        e.preventDefault()
                        console.log(image)
                    }}>
                        ver
                    </Button>
                </form>
            </Form>

        </>
    )
}

export default BillboardForm