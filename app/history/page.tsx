"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card"; // Assuming you have a Card component from ShadCN UI or similar

// Define the shape of a single transaction object. 
// This should match the data structure from your API.
interface Transaction {
  id: string; // A unique ID from the database, usually a string
  date: string;
  category: string;
  amount: number;
  flow: "income" | "expense";
  payment_type?: string; // Optional for income transactions
  notes?: string;
}

export default function HistoryPage() {
  // State to hold the list of transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // State to manage the loading status while fetching data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to hold any potential error messages
  const [error, setError] = useState<string | null>(null);

  // An async function to fetch data from the API
  const fetchTransactions = async () => {
    try {
      // --- IMPORTANT: Replace '/api/transactions' with your actual API endpoint ---
      const response = await fetch('https://w1gv1psp-8000.inc1.devtunnels.ms/view/');

      if (!response.ok) {
        throw new Error('Network response was not ok. Failed to fetch data.');
      }

      const data: Transaction[] = await response.json();
      setTransactions(data); // Update state with fetched data
    } catch (err: any) {
      setError(err.message); // Store error message to display to the user
      console.error("Failed to fetch transactions:", err);
    } finally {
      setIsLoading(false); // Stop loading, whether successful or not
    }
  };

  // The useEffect hook runs this function once when the component first loads
  useEffect(() => {
    fetchTransactions();
  }, []); // The empty dependency array [] ensures it only runs once on mount

  // Function to handle the deletion of a transaction
  const handleDelete = async (id: string) => {
    // Ask for user confirmation before deleting
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      // Send a DELETE request to the API endpoint for the specific transaction
      const response = await fetch(`https://w1gv1psp-8000.inc1.devtunnels.ms/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction on the server.');
      }

      // After successful deletion, refresh the transaction list from the server
      // This ensures the UI is in sync with the database
      fetchTransactions();

    } catch (err: any) {
      setError(err.message);
      console.error("Failed to delete transaction:", err);
    }
  };

  // Display a loading message while data is being fetched
  if (isLoading) {
    return <div className="p-6 text-center">Loading history...</div>;
  }

  // Display an error message if the fetch failed
  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Transaction History</h1>

      <Card className="shadow-md rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Flow</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-3">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-6 py-3">{t.category}</td>
                    <td className={`px-6 py-3 font-semibold ${t.flow === "income" ? "text-green-600" : "text-red-600"}`}>
                      {t.flow === "income" ? "+" : "-"} ₹{t.amount}
                    </td>
                    <td className="px-6 py-3 capitalize">{t.flow}</td>
                    <td className="px-6 py-3">{t.payment_type || "N/A"}</td>
                    <td className="px-6 py-3">
                      <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No transactions have been recorded yet.
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