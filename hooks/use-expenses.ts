"use client"

import useSWR from "swr"

export type ExpenseItem = {
  id: string
  flow: "expense" | "income"
  amount: number
  category: string
  paymentType: "Cash" | "Card" | "UPI"
  date: string // ISO
  notes?: string
}

const KEY = "ft-expenses-v1"

const load = (): ExpenseItem[] => {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(KEY)
  try {
    return raw ? (JSON.parse(raw) as ExpenseItem[]) : []
  } catch {
    return []
  }
}

const persist = (items: ExpenseItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function useExpenses() {
  const { data, mutate } = useSWR<ExpenseItem[]>(KEY, async () => load(), { fallbackData: [] })

  const add = async (item: ExpenseItem) => {
    const next = [...(data ?? []), item]
    persist(next)
    await mutate(next, { revalidate: false })
  }

  const remove = async (id: string) => {
    const next = (data ?? []).filter((i) => i.id !== id)
    persist(next)
    await mutate(next, { revalidate: false })
  }

  const clear = async () => {
    persist([])
    await mutate([], { revalidate: false })
  }

  return { items: data ?? [], add, remove, clear }
}
