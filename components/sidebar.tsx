"use client";

import { Home, Wallet, BarChart2, Settings } from "lucide-react";
import Link from "next/link";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Transactions", href: "/transactions", icon: Wallet },
  { name: "History", href: "/history", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
  <aside className="sidebar w-64 flex flex-col p-4">
      {/* Logo */}
      <div className="text-xl font-bold mb-10">
        💰 Finance Tracker
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
