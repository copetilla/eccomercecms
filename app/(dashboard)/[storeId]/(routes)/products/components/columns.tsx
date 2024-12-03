"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"

export type ProductColumn = {
    id: string
    name: string
    isArchived: boolean
    isFeatured: boolean
    price: number
    created_at: string
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "isArchived",
        header: "Archivado",
    },
    {
        accessorKey: "isFeatured",
        header: "Destacado",
    },
    {
        accessorKey: "price",
        header: "Precio",
    },
    {
        accessorKey: "created_at",
        header: "Fecha de creación",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
]
