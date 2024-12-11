"use client";

import React, { useState } from "react";
import { OrderColumn } from "./columns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BadgeCent, CheckCheck, Copy, Edit, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Order } from "@/types/page";

interface CellActionProps {
    data: Order;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("ID copiada con éxito");
    };

    const onUpdate = async (newStatus: string) => {
        const response = await fetch(`/api/${params.storeId}/orders/${data.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application-json' },
            body: JSON.stringify({ status: newStatus })
        }
        )
        if (!response.ok) {
            toast.error('Error al cambiar el estado')
            return
        }
        toast.success('Estado actualizado')
        router.refresh()
    }

    return (
        <>
            {/* Modal de detalles */}
            <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalles de la Orden</DialogTitle>
                        <DialogDescription>
                            Información completa de la orden.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p><strong>ID:</strong> {data.id}</p>
                        <p><strong>Estado:</strong> {data.status}</p>
                        <p><strong>Teléfono:</strong> {data.phone}</p>
                        <p><strong>Nombre Completo:</strong> {data.fullName}</p>
                        <p><strong>Dirección:</strong> {data.address}</p>
                        <p><strong>Ciudad:</strong> {data.city}</p>
                        <p><strong>Provincia:</strong> {data.province}</p>
                        {data.postalCode && <p><strong>Código Postal:</strong> {data.postalCode}</p>}
                        <p><strong>País:</strong> {data.country}</p>
                        <p><strong>Método de Envío:</strong> {data.shippingMethod}</p>
                        <p><strong>Método de Pago:</strong> {data.payMethod}</p>
                        <p><strong>Monto Total:</strong> ₡{data.totalAmount}</p>
                        <p><strong>Creado el:</strong> {new Date(data.created_at).toLocaleString()}</p>                        <div>
                            <strong>Productos:</strong>
                            <ul className="list-disc pl-5">
                                {data.OrderItem.map((item, index) => (
                                    <li key={index}>
                                        {item.Product.name} (Cantidad: {item.quantity})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dropdown Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setDetailsModalOpen(true)}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Ver Detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onUpdate('paid')}
                    >
                        <BadgeCent className="mr-2 h-4 w-4" />
                        Marcar Como Pago
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onUpdate('completed')}                    >
                        <CheckCheck className="mr-2 h-4 w-4" />
                        Marcar Como Completado
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onCopy(data.id)}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar ID
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default CellAction;
