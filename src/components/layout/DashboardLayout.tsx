import { Outlet, Link, useLocation } from "react-router-dom";
import { User, Bell, LayoutDashboard, Folder, FileText, Settings, FileBox } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/app", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Meus Contratos", path: "/app/contratos", icon: <Folder className="w-5 h-5" /> },
    { name: "Modelos", path: "/app/modelos", icon: <FileText className="w-5 h-5" /> },
    { name: "Cláusulas", path: "/app/clausulas", icon: <FileBox className="w-5 h-5" /> },
    { name: "Configurações", path: "/profile", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 relative overflow-hidden">
        {/* Subtle background glow from login */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        
        <div className="h-24 flex items-center justify-center px-8 border-b border-slate-100 relative z-10">
          <img src="/logo.png" alt="Zelo" className="h-16 w-auto object-contain" />
        </div>

        <nav className="flex-1 py-8 px-6 space-y-3 relative z-10">
          {navLinks.map((link, i) => {
            const isActive = link.path === "/app" 
              ? location.pathname === "/app"
              : location.pathname.startsWith(link.path);

            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={link.name}
              >
                <Link
                  to={link.path}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                    isActive 
                      ? "text-primary bg-primary/5 font-semibold shadow-sm" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full" 
                    />
                  )}
                  <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-primary'}`}>
                    {link.icon}
                  </div>
                  {link.name}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white/50 backdrop-blur-sm shrink-0 flex items-center justify-end px-8 border-b border-slate-200">
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-700">{user?.name || "Usuário"}</p>
                <p className="text-xs text-slate-500">Plano Pro</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-300 transition-colors border-2 border-white shadow-sm">
                {user?.name ? (
                  <span className="text-sm font-bold text-slate-700">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-5 h-5 text-slate-600" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
