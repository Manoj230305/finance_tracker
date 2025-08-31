"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function TransactionsPage() {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Food",
    paymentType: "Cash",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    transactions.push({ ...form, amount: parseFloat(form.amount) });
    localStorage.setItem("transactions", JSON.stringify(transactions));
    alert("Transaction saved!");
    setForm({ ...form, amount: "", note: "" });
  };

  return (
    <div className="p-6 flex justify-center bg-gradient-to-br from-indigo-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-xl">
      <Card className="p-6 max-w-lg w-full shadow-lg bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-950/80 rounded-xl">
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Add New Transaction</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Quickly record an expense or income. Transactions are stored locally in your browser.</p>
        </div>

        {/* Type toggle */}
        <div className="flex gap-4 mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
          <button
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${form.type === "expense" ? "bg-red-600 text-white shadow" : "text-slate-700 dark:text-slate-200"}`}
            onClick={() => setForm({ ...form, type: "expense" })}
            aria-pressed={form.type === "expense"}
          >
            Expense
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${form.type === "income" ? "bg-green-600 text-white shadow" : "text-slate-700 dark:text-slate-200"}`}
            onClick={() => setForm({ ...form, type: "income" })}
            aria-pressed={form.type === "income"}
          >
            Income
          </button>
        </div>

        {/* Inputs */}
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount (₹)"
          className="w-full mb-3 border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <select name="category" value={form.category} onChange={handleChange} className="w-full mb-3 border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm">
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Other</option>
        </select>

        <select name="paymentType" value={form.paymentType} onChange={handleChange} className="w-full mb-3 border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm">
          <option>Cash</option>
          <option>Card</option>
          <option>UPI</option>
        </select>

        <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full mb-3 border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm" />

        <textarea name="note" value={form.note} onChange={handleChange} placeholder="Optional note" className="w-full mb-4 border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"></textarea>

        <button onClick={handleSubmit} className="w-full py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.01] active:scale-[0.99] transition-shadow shadow-md">
          Save Transaction
        </button>
      </Card>
    </div>
  );
}
