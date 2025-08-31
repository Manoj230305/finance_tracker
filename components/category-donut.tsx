"use client"

import { Pie, PieChart, Cell } from "recharts"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ExpenseItem } from "@/hooks/use-expenses"

export function CategoryDonut({ items }: { items: ExpenseItem[] }) {
  const expenses = items.filter((i) => i.flow === "expense")

  if (expenses.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No expense data yet</div>
    )
  }

  const totals = Object.entries(
    expenses.reduce(
      (acc, i) => {
        acc[i.category] = (acc[i.category] || 0) + i.amount
        return acc
      },
      {} as Record<string, number>,
    ),
  ).sort((a, b) => b[1] - a[1])

  const top = totals.slice(0, 4)
  const otherSum = totals.slice(4).reduce((s, [, v]) => s + v, 0)
  const data = [
    ...top.map(([name, value]) => ({ name, value })),
    ...(otherSum ? [{ name: "Other", value: otherSum }] : []),
  ]

  const palette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

  return (
    <PieChart>
      <ChartTooltip content={<ChartTooltipContent labelKey="name" />} />
      <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} strokeWidth={2}>
        {data.map((_, idx) => (
          <Cell key={idx} fill={palette[idx % palette.length]} />
        ))}
      </Pie>
    </PieChart>
  )
}
