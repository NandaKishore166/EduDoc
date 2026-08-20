import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-10">
          EduDoc AI
        </h1>

        <nav className="space-y-3">
          <button className="w-full text-left hover:bg-slate-700 rounded-lg p-3">
            Dashboard
          </button>

          <NavLink
  to="/ai"
  className="block rounded-lg p-3 hover:bg-slate-700"
>
  AI Assistant
</NavLink>

          <button className="w-full text-left hover:bg-slate-700 rounded-lg p-3">
            Documents
          </button>

          <button className="w-full text-left hover:bg-slate-700 rounded-lg p-3">
            AI Assistant
          </button>

          <button className="w-full text-left hover:bg-slate-700 rounded-lg p-3">
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1">
        <header className="bg-white shadow px-8 py-5">
          <h2 className="text-xl font-semibold">
            Dashboard
          </h2>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}