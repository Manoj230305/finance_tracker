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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Transaction History</h1>

      <Card className="shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase">
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
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3">{t.date}</td>
                  <td className="px-6 py-3">{t.category}</td>
                  <td
                    className={`px-6 py-3 font-semibold ${
                      t.type === "Income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "Income" ? "+" : "-"}₹{t.amount}
                  </td>
                  <td className="px-6 py-3">{t.type}</td>
                  <td className="px-6 py-3">{t.paymentType}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No transactions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
