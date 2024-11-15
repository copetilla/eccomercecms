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

interface SettingsFormProps {
    store: Store
}

const formSchema = z.object({
    name: z.string().min(1)
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ store }) => {
    const params = useParams();
    const router = useRouter();

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
    return (
        <>
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
                                        Nombre
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


                    </div>
                    <Button disabled={loading} type='submit'>
                        Guardar cambios
                    </Button>
                </form>
            </Form>

        </>
    )
}

export default SettingsForm