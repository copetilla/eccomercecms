'use client'

import React, { useState } from 'react'
import { BillboardColumn } from './columns'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '@/components/modals/alert-modal'

interface CellActionProps {
    data: BillboardColumn
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {

    const router = useRouter()
    const params = useParams()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("ID copiada con éxito")
    }

    const onDelete = async () => {
        setLoading(true)
        try {

            const response = await fetch(`/api/${params.storeId}/billboards/${data.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                toast.error('Error al eliminar la cartelera')
                setOpen(false)
                throw new Error('No se pudo eliminar')

            }
            router.refresh()
            toast.success('Cartelera eliminada')
            return response

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={'ghost'}
                        className='h-8 w-8 p-0'
                    >
                        <span className='sr-only'>
                            Abrir menu
                        </span>
                        <MoreHorizontal className='w-4 h-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>
                        Acciones
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                        className=' cursor-pointer'
                        onClick={() => {
                            router.push(`/${params.storeId}/billboards/${data.id}`)
                        }}

                    >
                        <Edit className='mr-2 h-4 w-4' />
                        Actualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className=' cursor-pointer'
                        onClick={() => onCopy(data.id)}
                    >
                        <Copy className='mr-2 h-4 w-4' />
                        Copiar ID
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className=' cursor-pointer'
                        onClick={() => setOpen(true)}
                    >
                        <Trash className='mr-2 h-4 w-4' />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default CellAction