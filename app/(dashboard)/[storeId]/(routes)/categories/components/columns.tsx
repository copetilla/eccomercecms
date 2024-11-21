"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"

export type CategoryColumn = {
    id: string
    name: string
    label: string
    created_at: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "label",
        header: "Cartelera",
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
