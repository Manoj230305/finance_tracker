"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ExpenseItem } from "@/hooks/use-expenses"

export function SpendingLine({ items }: { items: ExpenseItem[] }) {
  const expenses = items.filter((i) => i.flow === "expense")
  const byDay = expenses.reduce(
    (acc, i) => {
      const d = new Date(i.date)
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString()
      acc[key] = (acc[key] || 0) + i.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.entries(byDay)
    .map(([date, value]) => ({ date: new Date(date).toLocaleDateString(), spend: Number(value.toFixed(2)) }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: 8, right: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="spend" stroke="var(--chart-5)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
