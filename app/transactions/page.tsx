// 📁 app/transactions/page.tsx (or wherever your form is)
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

// (Keep the category definitions as before)
const expenseCategories = ["Food", "Travel", "Shopping", "Utilities", "Other"];
const incomeCategories = ["Salary", "Freelance", "Gift", "Other"];

export default function TransactionsPage() {
  const [form, setForm] = useState({
    flow: "expense",
    amount: "",
    category: expenseCategories[0],
    payment_type: "Cash",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (newType: "expense" | "income") => {
    setForm({
      ...form,
      flow: newType,
      category: newType === 'expense' ? expenseCategories[0] : incomeCategories[0],
    });
  };
  
  // --- UPDATED handleSubmit FUNCTION ---
  const handleSubmit = async () => {
    if (!form.amount || parseFloat(form.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newTransaction = {
      ...form,
      amount: parseFloat(form.amount),
    };

    // Remove paymentType if it's an income transaction
    if (newTransaction.flow === 'income') {
      delete (newTransaction as any).paymentType;
    }
    
    try {
      // Use fetch to send data to your API endpoint
      const response = await fetch('https://w1gv1psp-8000.inc1.devtunnels.ms/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        throw new Error('Failed to save transaction');
      }

      alert("Transaction saved!");
      // Reset form after successful submission
      setForm({
        flow: "expense", amount: "", category: expenseCategories[0],
        payment_type: "Cash", date: new Date().toISOString().split("T")[0], notes: "",
      });

    } catch (error) {
      console.error(error);
      alert("Error saving transaction.");
    }
  };

  const categories = form.flow === 'expense' ? expenseCategories : incomeCategories;

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
        
        {form.flow === "expense" && (
          <select name="paymentType" value={form.payment_type} onChange={handleChange} className="w-full mb-3 border rounded p-2">
            <option>Cash</option>
            <option>Card</option>
            <option>UPI</option>
          </select>
        )}

        <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full mb-3 border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm" />

        <textarea name="note" value={form.note} onChange={handleChange} placeholder="Optional note" className="w-full mb-4 border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"></textarea>

        <button onClick={handleSubmit} className="w-full py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.01] active:scale-[0.99] transition-shadow shadow-md">
          Save Transaction
        </button>
      </Card>
    </div>
  );
}