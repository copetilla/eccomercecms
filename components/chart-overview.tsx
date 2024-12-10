"use client";

import React, { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import { GraphDataType } from "@/actions/get-all-orders";



const chartConfig = {
    total: {
        label: "Ganancias: ",
        color: "#2563eb",
    },
} satisfies ChartConfig

interface ChartOverviewProps {
    data?: GraphDataType[]
}

const ChartOverview: React.FC<ChartOverviewProps> = ({ data }) => {

    return (

        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey='name'
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₡${value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />

                <Bar dataKey="total" fill="var(--color-desktop)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
};

export default ChartOverview;
