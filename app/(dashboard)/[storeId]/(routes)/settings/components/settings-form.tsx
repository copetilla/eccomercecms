'use client'

import React, { useState } from 'react'
import * as z from 'zod'
import { Store } from '@/types/page'
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
import BillboardSelect from './billboardSelect'

interface SettingsFormProps {
    store: Store
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
    nameSINPE: z.string().min(1),
    numberSINPE: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ store }) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: store
    });

    const onSubmit = async (data: SettingsFormValues) => {

        try {
            setLoading(true);

            const response = await fetch(`/api/stores/${params.storeId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error();
            }

            router.refresh()
            toast.success("Tienda actualizada con éxito")

        } catch (error) {
            toast.error('Algo salió mal')
        } finally {
            setLoading(false)
        }

    }

    const onDelete = async () => {
        try {
            setLoading(true)

            const response = await fetch(`/api/stores/${params.storeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error();
            }

            router.refresh()
            router.push('/')
            toast.success("Tienda eliminada")

        } catch (error) {
            toast.error("Asegurate que no tengas ninguna cateogira ni productos en la tienda")
        } finally {
            setLoading(false)
            setOpen(false)
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
                    title='Configuraciones'
                    description='Administrar preferencias de la tienda'
                />
                <Button
                    disabled={loading}
                    variant={'destructive'}
                    size={'sm'}
                    onClick={() => { setOpen(true) }}
                >
                    <Trash className='h-4 w-4' />
                </Button>
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
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Nombre de la tienda
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder='Nombre de la tienda'
                                            {...field}
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
                                <FormItem>
                                    <FormLabel>
                                        Cartelera
                                    </FormLabel>
                                    <FormControl>
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
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name='nameSINPE'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Nombre SINPE
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder='Nombre para el SINPE'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='numberSINPE'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Número SINPE
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder='Número para el SINPE'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                    </div>
                    <Button disabled={loading} type='submit'>
                        Guardar cambios
                    </Button>
                </form>
            </Form>

            <Separator />

            <ApiAlert title='NEXT_PUBLIC_API_URL' description={`${origin}/api/stores/${params.storeId}`} variant='public' />

        </>
    )
}

export default SettingsForm