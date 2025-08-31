"use client";

import { Card } from "@/components/ui/card";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  LineChart, Line, ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, Wallet, History } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const categoryData = Object.values(
    transactions.reduce((acc: any, t) => {
      if (t.type === "expense") {
        acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
        acc[t.category].value += t.amount;
      }
      return acc;
    }, {})
  );

  const paymentData = ["Cash", "Card", "UPI"].map(p => ({
    name: p,
    value: transactions.filter(t => t.paymentType === p).reduce((s, t) => s + t.amount, 0),
  }));

  const timeData = transactions
    .filter(t => t.type === "expense")
    .map(t => ({ date: t.date, amount: t.amount }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Income */}
        <Card className="p-6 shadow-md border-t-4 border-green-500 bg-white flex flex-col items-center justify-center rounded-xl">
          <p className="text-sm text-gray-500">Income</p>
          <h2 className="text-2xl font-bold text-gray-800">₹{totalIncome}</h2>
          <ArrowUpCircle size={28} className="text-green-500 mt-2" />
        </Card>

        {/* Expenses */}
        <Card className="p-6 shadow-md border-t-4 border-red-500 bg-white flex flex-col items-center justify-center rounded-xl">
          <p className="text-sm text-gray-500">Expenses</p>
          <h2 className="text-2xl font-bold text-gray-800">₹{totalExpense}</h2>
          <ArrowDownCircle size={28} className="text-red-500 mt-2" />
        </Card>

        {/* Balance */}
        <Card className="p-6 shadow-md border-t-4 border-indigo-500 bg-white flex flex-col items-center justify-center rounded-xl">
          <p className="text-sm text-gray-500">Balance</p>
          <h2 className="text-2xl font-bold text-gray-800">₹{balance}</h2>
          <Wallet size={28} className="text-indigo-500 mt-2" />
        </Card>
      </div>

      {/* Link to History Page */}
      <div className="flex justify-end">
        <Link
          href="/history"
          className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-600 transition"
        >
          <History size={18} className="mr-2" />
          View History
        </Link>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4 shadow-md">
          <h3 className="font-semibold mb-2">By Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={80}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 shadow-md">
          <h3 className="font-semibold mb-2">By Payment Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={paymentData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                <Cell fill="#34d399" /> {/* Cash - Green */}
                <Cell fill="#3b82f6" /> {/* Card - Blue */}
                <Cell fill="#f59e0b" /> {/* UPI - Amber */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-4 shadow-md">
        <h3 className="font-semibold mb-2">Spending Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
