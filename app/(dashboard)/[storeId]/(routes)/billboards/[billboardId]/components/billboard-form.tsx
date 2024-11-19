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
import ApiAlert from '@/components/ui/api-alert'
import { useOrigin } from '@/hooks/use-origin'
import { ImageUploader } from '@/components/upload_image'


interface BillboardFormProps {
    billboard: Billboard | null
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
});

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ billboard }) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [imageFile, setImageFile] = useState(null)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = billboard ? "Editar cartelera" : "Crear cartelera";
    const description = billboard ? "Editar una cartelera" : "Añadira una nueva cartelera";
    const toastMessage = billboard ? "Cartelera actualizada" : "Cartelera creada";
    const action = billboard ? "Guardar cambios" : "Crear";

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: billboard || {
            label: '',
            imageUrl: ''
        }
    });

    const onSubmit = async (data: BillboardFormValues) => {
        const formData = new FormData();

        if (imageFile) {
            formData.append('file', imageFile); // Agregar el archivo al FormData
        }
        formData.append('label', data.label); // Agregar el texto de la etiqueta

        // Realizar la solicitud POST al backend
        const response = await fetch('/api/stores/upload-image', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Imagen subida correctamente', result);
            router.push('/path-to-somewhere'); // Redirigir después de la carga
        } else {
            console.error('Error al cargar la imagen');
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => { setOpen(false) }}
                onConfirm={() => { }}
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

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=' space-y-8 w-full'
                >
                    <div className='grid grid-cols-3 gap-8'>

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
                                            setImageFile={setImageFile}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                    </div>
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

            <Separator />

        </>
    )
}

export default BillboardForm