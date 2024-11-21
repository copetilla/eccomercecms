"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"

export type BillboardColumn = {
    id: string
    label: string
    created_at: string
}

export const columns: ColumnDef<BillboardColumn>[] = [
    {
        accessorKey: "label",
        header: "Etiqueta",
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
