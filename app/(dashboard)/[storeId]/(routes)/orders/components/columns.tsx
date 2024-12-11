"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import { Order, OrderItem } from "@/types/page"

export type OrderColumn = {
    id: string
    OrderItem: OrderItem[]
    phone: string
    totalAmount: number
    address: string
    status: string
}

export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: "OrderItem",
        header: "Productos",
        cell: ({ row }) => row.original.OrderItem.length,
    },
    {
        accessorKey: "fullName",
        header: "Nombre",
    },
    {
        accessorKey: "phone",
        header: "Teléfono",
    },
    {
        accessorKey: "email",
        header: "Correo",
    },
    {
        accessorKey: "city",
        header: "Ciudad",
    },
    {
        accessorKey: "totalAmount",
        header: "Total",
    },
    {
        accessorKey: "status",
        header: "Estado",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
]
