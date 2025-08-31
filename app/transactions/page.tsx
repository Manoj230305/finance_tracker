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
    <div className="p-6 flex justify-center">
      <Card className="p-6 max-w-lg w-full shadow-lg">
        <h2 className="text-xl font-bold mb-6">Add New Transaction</h2>

        {/* Type toggle */}
        <div className="flex gap-4 mb-4">
          <button
            className={`flex-1 px-4 py-2 rounded ${form.type === "expense" ? "bg-gray-900 text-white" : "bg-gray-200"}`}
            onClick={() => setForm({ ...form, type: "expense" })}
          >
            Expense
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded ${form.type === "income" ? "bg-gray-900 text-white" : "bg-gray-200"}`}
            onClick={() => setForm({ ...form, type: "income" })}
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
          className="w-full mb-3 border rounded p-2"
        />

        <select name="category" value={form.category} onChange={handleChange} className="w-full mb-3 border rounded p-2">
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Other</option>
        </select>

        <select name="paymentType" value={form.paymentType} onChange={handleChange} className="w-full mb-3 border rounded p-2">
          <option>Cash</option>
          <option>Card</option>
          <option>UPI</option>
        </select>

        <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full mb-3 border rounded p-2" />

        <textarea name="note" value={form.note} onChange={handleChange} placeholder="Optional note" className="w-full mb-4 border rounded p-2"></textarea>

        <button onClick={handleSubmit} className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-900">
          Save Transaction
        </button>
      </Card>
    </div>
  );
}
