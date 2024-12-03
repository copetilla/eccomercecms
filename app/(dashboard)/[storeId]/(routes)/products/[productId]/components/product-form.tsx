'use client'

import React, { useState } from 'react'
import * as z from 'zod'
import { Product } from '@/types/page'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import AlertModal from '@/components/modals/alert-modal'
import { ImageUploader } from '@/components/upload_image'
import { Checkbox } from '@/components/ui/checkbox'
import SelectCategory from './selectCategory'

interface BillboardFormProps {
    product: Product | null
}

const formSchema = z.object({
    name: z.string().min(1),
    categoryId: z.string().min(1),
    price: z.number().min(1),
    isFeatured: z.boolean().default(false),
    isArchived: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof formSchema>;

const ProductForm: React.FC<BillboardFormProps> = ({ product }) => {
    const params = useParams();
    const router = useRouter();

    const { storeId, productId } = params

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])
    const [newImages, setNewImages] = useState([])
    const [urlsDelete, setUrlsDelete] = useState([])

    const title = product ? "Editar producto" : "Crear producto";
    const description = product ? "Editar un producto" : "Añadira un nuevo producto";
    const action = product ? "Guardar cambios" : "Crear";

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: product || {
            name: '',
            categoryId: '',
            price: 0,
            isFeatured: false,
            isArchived: false
        }
    });

    const onSubmit = async (data: ProductFormValues) => {

        setLoading(true)
        if (product) {

            try {

                //     const response = await fetch(`/api/${storeId}/billboards/${billboardId}`, {
                //         method: 'PATCH',
                //         headers: {
                //             'Content-Type': 'application/json',
                //         },
                //         body: JSON.stringify({ label: data.label, imageUrl: data.imageUrl })
                //     })

                //     if (!response.ok) {
                //         toast.error('Error al actualizar la cartelera')
                //         return
                //     }
                //     router.push(`/${storeId}/billboards`)
                //     router.refresh()
                //     toast.success('¡Cartelera actualizada con éxito!')
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }


        } else {
            try {

                const response = await fetch(`/api/${storeId}/products/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        categoryId: data.categoryId,
                        name: data.name,
                        price: data.price,
                        isFeatured: data.isFeatured,
                        isArchived: data.isArchived
                    })
                })

                if (!response.ok) {
                    toast.error('Error al crear el producto')
                    return
                }
                const responseData = await response.json(); // Esperar la respuesta JSON
                const productId = responseData.data[0].id


                //UPLOAD IMAGES

                const formData = new FormData();
                images.forEach((file) => {
                    formData.append("files", file);
                });

                const responseImage = await fetch(`/api/${storeId}/products/${productId}/images`, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error uploading files:", errorData.error);
                    toast.error("Error al subir las imágenes.");
                    return;
                }

                const { uploadedFiles } = await responseImage.json(); // Verifica si el backend envía esto
                console.log("Uploaded files URLs:", uploadedFiles);

                const responseImageProduct = await fetch(`/api/${storeId}/products/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        urls: uploadedFiles
                    })
                })

                if (!response.ok) {
                    toast.error('Error al crear el producto')
                    return
                }

                router.push(`/${storeId}/products`)
                router.refresh()
                toast.success('Producto creado con éxito!')

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

            const response = await fetch(`/api/${storeId}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('No se pudo eliminar')

            }
            router.push(`/${storeId}/products`)
            router.refresh()
            toast.success('Producto eliminado con éxito!')

            return response

        } catch (error) {
            toast.error('Producto eliminado sin éxito')
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
                {product && (<Button
                    disabled={loading}
                    variant={'destructive'}
                    size={'sm'}
                    onClick={() => { setOpen(true) }}
                >
                    <Trash className='h-4 w-4' />
                </Button>)}
            </div>

            <Separator />

            <ImageUploader
                setImagesUpload={setImages}
                productId={product?.id}
                urlsDelete={setUrlsDelete}
                newImages={setNewImages}
            />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=' space-y-8 w-full'
                >
                    <div className='grid grid-cols-3 gap-8'>

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
                                            placeholder='Nombre del producto'
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
                            name='price'
                            render={({ field }) => (
                                <FormItem className=''>
                                    <FormLabel>
                                        Precio
                                    </FormLabel>
                                    <FormControl className=''>
                                        <Input
                                            disabled={loading}
                                            type='number'
                                            placeholder='Precio del producto'
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            className=''
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='categoryId'
                            render={({ field }) => (
                                <FormItem className=''>
                                    <FormLabel>
                                        Categoria
                                    </FormLabel>
                                    <FormControl className=''>
                                        <SelectCategory
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='isFeatured'
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                    <FormControl className=''>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className=' font-bold'>
                                            Destacar
                                        </FormLabel>
                                        <FormDescription>
                                            Este producto aparecerá en la pagina de Inicio
                                        </FormDescription>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='isArchived'
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                    <FormControl className=''>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className=' font-bold'>
                                            Archivar
                                        </FormLabel>
                                        <FormDescription>
                                            Este producto no aparece en ningún lugar de la tienda
                                        </FormDescription>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                    </div>
                    <Button disabled={loading} type='submit'>
                        {action}
                    </Button>
                    <Button disabled={loading} onClick={() => console.log(images)}>
                        ver imagenes
                    </Button>
                </form>
            </Form>


        </>
    )
}

export default ProductForm