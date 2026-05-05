import { Outlet, Link, useLocation } from "react-router-dom";
import { User, Bell, LayoutDashboard, Folder, FileText, Settings, FileBox, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";

export function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navLinks = [
    { name: "Dashboard", path: "/app", icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { name: "Meus Contratos", path: "/app/contratos", icon: <Folder className="w-5 h-5 shrink-0" /> },
    { name: "Modelos", path: "/app/modelos", icon: <FileText className="w-5 h-5 shrink-0" /> },
    { name: "Cláusulas", path: "/app/clausulas", icon: <FileBox className="w-5 h-5 shrink-0" /> },
    { name: "Configurações", path: "/profile", icon: <Settings className="w-5 h-5 shrink-0" /> },
  ];

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Left Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 288 }} // 288px = w-72, 80px = w-20
        className="bg-sidebar border-r border-border flex flex-col shrink-0 relative overflow-hidden"
      >
        {/* Subtle background glow from login */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        
        <div className="h-24 flex items-center justify-center border-b border-border relative z-10 px-4">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.img 
                key="logo-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                src="/logo.png" 
                alt="Zelo" 
                className="h-16 w-auto object-contain dark:invert" 
              />
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-3xl font-bold text-primary italic"
              >
                Z
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-3 relative z-10">
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
                  title={isCollapsed ? link.name : undefined}
                  className={`flex items-center py-3.5 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                    isCollapsed ? "justify-center px-0" : "gap-4 px-4"
                  } ${
                    isActive 
                      ? "text-primary bg-primary/10 font-semibold shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
                  {!isCollapsed && (
                    <span className="truncate whitespace-nowrap">{link.name}</span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </motion.aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-background/80 backdrop-blur-sm shrink-0 flex items-center justify-between px-8 border-b border-border">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              title={isCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-border">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-foreground">{user?.name || "Usuário"}</p>
                <p className="text-xs text-muted-foreground">Plano Pro</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors border-2 border-background shadow-sm">
                {user?.name ? (
                  <span className="text-sm font-bold text-secondary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-5 h-5 text-secondary-foreground" />
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
