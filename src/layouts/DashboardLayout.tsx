import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg p-3 transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "hover:bg-slate-700 text-slate-200"
    }`;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-10">
          EduDoc AI
        </h1>

        <nav className="space-y-3">
          <NavLink to="/dashboard" className={navClass}>
            Dashboard
          </NavLink>

          <NavLink to="/projects" className={navClass}>
            Projects
          </NavLink>

          <NavLink to="/documents" className={navClass}>
            Documents
          </NavLink>

          <NavLink to="/ai-assistant" className={navClass}>
            AI Assistant
          </NavLink>

          <NavLink to="/settings" className={navClass}>
            Settings
          </NavLink>
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