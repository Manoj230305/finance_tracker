"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ExpenseItem } from "@/hooks/use-expenses"

export function TypeBar({ items }: { items: ExpenseItem[] }) {
  const expenses = items.filter((i) => i.flow === "expense")
  const sum = (t: string) => expenses.filter((i) => i.paymentType === t).reduce((s, i) => s + i.amount, 0)
  const data = [
    { type: "Cash", value: Number(sum("Cash").toFixed(2)) },
    { type: "Card", value: Number(sum("Card").toFixed(2)) },
    { type: "UPI", value: Number(sum("UPI").toFixed(2)) },
  ]

  const colorMap: Record<string, string> = {
    Cash: "var(--chart-2)",
    Card: "var(--chart-3)",
    UPI: "var(--chart-4)",
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: 8, right: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent nameKey="type" />} />
        <Bar dataKey="value" radius={4}>
          {data.map((d, i) => (
            <Cell key={`cell-${i}`} fill={colorMap[d.type]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
