"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import { OrderItems } from "@/types/page"

export type OrderColumn = {
    id: string
    OrderItems: OrderItems[]
    phone: string
    total_amount: number
    address: string
    status: string
}

export const columns: ColumnDef<OrderColumn>[] = [
    {
        accessorKey: "OrderItems",
        header: "Productos",
    },
    {
        accessorKey: "phone",
        header: "Teléfono",
    },
    {
        accessorKey: "address",
        header: "Dirección",
    },
    {
        accessorKey: "total_amount",
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
