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
      type: newType,
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
    if (newTransaction.type === 'income') {
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
        type: "expense", amount: "", category: expenseCategories[0],
        paymentType: "Cash", date: new Date().toISOString().split("T")[0], note: "",
      });

    } catch (error) {
      console.error(error);
      alert("Error saving transaction.");
    }
  };

  const categories = form.type === 'expense' ? expenseCategories : incomeCategories;

  return (
    // ... your JSX remains the same
    <div className="p-6 flex justify-center">
      <Card className="p-6 max-w-lg w-full shadow-lg">
        <h2 className="text-xl font-bold mb-6">Add New Transaction</h2>

        {/* Type toggle */}
        <div className="flex gap-4 mb-4">
          <button
            className={`flex-1 px-4 py-2 rounded ${form.type === "expense" ? "bg-gray-900 text-white" : "bg-gray-200"}`}
            onClick={() => handleTypeChange("expense")}
          >
            Expense
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded ${form.type === "income" ? "bg-gray-900 text-white" : "bg-gray-200"}`}
            onClick={() => handleTypeChange("income")}
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
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        {form.type === "expense" && (
          <select name="paymentType" value={form.paymentType} onChange={handleChange} className="w-full mb-3 border rounded p-2">
            <option>Cash</option>
            <option>Card</option>
            <option>UPI</option>
          </select>
        )}

        <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full mb-3 border rounded p-2" />

        <textarea name="note" value={form.note} onChange={handleChange} placeholder="Optional note" className="w-full mb-4 border rounded p-2"></textarea>

        <button onClick={handleSubmit} className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-900">
          Save Transaction
        </button>
      </Card>
    </div>
  );
}