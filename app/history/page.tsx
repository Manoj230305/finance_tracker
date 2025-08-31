"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Transaction {
  id: number;
  date: string;
  category: string;
  amount: number;
  type: "Income" | "Expense";
  paymentType: string;
}

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, date: "2025-08-30", category: "Food", amount: 500, type: "Expense", paymentType: "UPI" },
    { id: 2, date: "2025-08-29", category: "Salary", amount: 3000, type: "Income", paymentType: "Bank" },
  ]);

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Transaction History</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">All your recorded transactions. Use the action column to remove items.</p>
        </div>
      </div>

      <Card className="shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-950/80">
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition"
                  >
                    <td className="px-6 py-3 text-slate-700 dark:text-slate-300">{t.date}</td>
                    <td className="px-6 py-3 text-slate-700 dark:text-slate-300">{t.category}</td>
                    <td className={`px-6 py-3 font-semibold ${t.type === "Income" ? "text-green-600" : "text-red-600"}`}>
                      {t.type === "Income" ? "+" : "-"}₹{t.amount}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${t.type === "Income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-700 dark:text-slate-300">{t.paymentType}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDelete(t.id)}
                        aria-label={`Delete transaction ${t.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
