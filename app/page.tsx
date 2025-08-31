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

    const COLORS = [
      // fresh, modern palette
      "#6366F1", // indigo-500
      "#7C3AED", // purple-600
      "#06B6D4", // cyan-500
      "#10B981", // green-500
      "#F97316", // orange-500
      "#EF4444", // red-500
    ];

    // helpers for small trends & sparklines
    const getPercentChange = (type: string) => {
      const key = type.toLowerCase();
      const items = transactions
        .filter((t: any) => String(t.type).toLowerCase() === key)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      if (items.length < 2) return 0;
      const last = items.slice(-3).reduce((s: number, t: any) => s + t.amount, 0);
      const prev = items.slice(-6, -3).reduce((s: number, t: any) => s + t.amount, 0);
      if (prev === 0) return last === 0 ? 0 : 100;
      return Math.round(((last - prev) / prev) * 100);
    };

    const renderSparkline = (values: number[], stroke = "#6366F1") => {
      if (!values || values.length === 0) return null;
      const max = Math.max(...values, 1);
      const min = Math.min(...values, 0);
      const w = 120;
      const h = 28;
      const step = values.length > 1 ? (w / (values.length - 1)) : w;
      const points = values.map((v, i) => `${i * step},${h - ((v - min) / (max - min || 1)) * h}`).join(' ');
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mt-3">
          <polyline fill="none" stroke={stroke} strokeWidth={2} points={points} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    };

    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-xl">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Dashboard</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Overview of your finances — quick insights and trends.</p>
          </div>
        </div>
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Income */}
          <Card className="p-6 shadow-xl transform hover:-translate-y-1 transition border-t-4 border-emerald-500 bg-gradient-to-b from-emerald-600 to-slate-900 flex flex-col items-center justify-center rounded-xl">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-emerald-100">Income</p>
                <h2 className="text-2xl font-extrabold text-white">₹{totalIncome}</h2>
              </div>
              <ArrowUpCircle size={28} className="text-emerald-200 mt-2" />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white ${getPercentChange('income') >= 0 ? 'bg-emerald-400/90' : 'bg-rose-500/90'}`}>
                {getPercentChange('income')}%
              </span>
              {renderSparkline(transactions.filter(t => t.type === 'income').map(t => t.amount), '#A7F3D0')}
            </div>
          </Card>

          {/* Expenses */}
          <Card className="p-6 shadow-xl transform hover:-translate-y-1 transition border-t-4 border-rose-500 bg-gradient-to-b from-rose-600 to-slate-900 flex flex-col items-center justify-center rounded-xl">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-rose-100">Expenses</p>
                <h2 className="text-2xl font-extrabold text-white">₹{totalExpense}</h2>
              </div>
              <ArrowDownCircle size={28} className="text-rose-200 mt-2" />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white ${getPercentChange('expense') >= 0 ? 'bg-rose-400/90' : 'bg-emerald-400/90'}`}>
                {getPercentChange('expense')}%
              </span>
              {renderSparkline(transactions.filter(t => t.type === 'expense').map(t => t.amount), '#FDBA74')}
            </div>
          </Card>

          {/* Balance */}
          <Card className="p-6 shadow-xl transform hover:-translate-y-1 transition border-t-4 border-violet-500 bg-gradient-to-b from-violet-600 to-slate-900 flex flex-col items-center justify-center rounded-xl">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-violet-100">Balance</p>
                <h2 className="text-2xl font-extrabold text-white">₹{balance}</h2>
              </div>
              <Wallet size={28} className="text-violet-200 mt-2" />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white ${balance >= 0 ? 'bg-emerald-400/90' : 'bg-rose-400/90'}`}>
                {Math.round(((totalIncome - totalExpense) / (totalExpense || 1)) * 100)}%
              </span>
              {renderSparkline(transactions.filter(t => t.type === 'expense').map(t => t.amount), '#C4B5FD')}
            </div>
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
          <Card className="p-4 shadow-lg bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-950/80">
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

    <Card className="p-4 shadow-lg bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-950/80">
            <h3 className="font-semibold mb-2">By Payment Type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={paymentData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
      <Cell fill="#10B981" /> {/* Cash - Green */}
      <Cell fill="#3B82F6" /> {/* Card - Blue */}
      <Cell fill="#F59E0B" /> {/* UPI - Amber */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-4 shadow-lg bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-950/80">
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
