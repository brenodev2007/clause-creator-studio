import { Outlet, Link, useLocation } from "react-router-dom";
import { User, Bell, LayoutDashboard, Folder, FileText, Settings, FileBox, PanelLeftClose, PanelLeftOpen, Shield, LogOut } from "lucide-react"; // icons
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Novo modelo disponível", desc: "O modelo Trabalhista (CLT) foi atualizado.", unread: true },
    { id: 2, title: "Tokens recarregados", desc: "Seus tokens diários foram recarregados.", unread: true },
    { id: 3, title: "Contrato salvo", desc: "O rascunho de Prestação de Serviços foi salvo.", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const navLinks = [
    { name: "Dashboard", path: "/app", icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { name: "Meus Contratos", path: "/app/contratos", icon: <Folder className="w-5 h-5 shrink-0" /> },
    { name: "Modelos", path: "/app/modelos", icon: <FileText className="w-5 h-5 shrink-0" /> },
    { name: "Cláusulas", path: "/app/clausulas", icon: <FileBox className="w-5 h-5 shrink-0" /> },
    { name: "Configurações", path: "/app/configuracoes", icon: <Settings className="w-5 h-5 shrink-0" /> },
    ...(user?.is_admin ? [{ name: "Admin", path: "/app/admin", icon: <Shield className="w-5 h-5 shrink-0" /> }] : []),
  ];

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Left Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 288 }} // 288px = w-72, 80px = w-20
        className="bg-sidebar border-r border-border flex flex-col shrink-0 relative overflow-hidden group"
      >
        {/* Subtle background glow from login */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        <div className="h-20 flex items-center justify-center border-b border-border relative z-10 px-4">
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
                className="h-20 w-auto object-contain dark:invert" 
              />
            ) : (
              <motion.img
                key="logo-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                src="/favicon.ico"
                alt="Zelo"
                className="h-8 w-8 object-contain"
              />
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 relative z-10">
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
                  className={`flex items-center py-3.5 rounded-xl transition-all duration-300 relative group/link overflow-hidden ${
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
                  <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover/link:scale-110 group-hover/link:text-primary'}`}>
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

        {/* Bottom Collapse Toggle */}
        <div className="p-4 border-t border-border mt-auto relative z-10 flex justify-center">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className={`flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300 w-full ${isCollapsed ? '' : 'gap-3'}`}
            title={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            <div className="transition-transform duration-300">
              {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </div>
            {!isCollapsed && <span className="text-sm font-medium">Recolher</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-background/80 backdrop-blur-sm shrink-0 flex items-center justify-end px-8 border-b border-border z-10">
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors relative outline-none">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-in zoom-in" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-2 py-2">
                  <DropdownMenuLabel className="p-0">Notificações</DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">
                      Marcar todas como lidas
                    </button>
                  )}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map(notification => (
                    <DropdownMenuItem key={notification.id} className={`flex flex-col items-start p-3 gap-1 cursor-pointer ${notification.unread ? 'bg-primary/5' : ''}`}>
                      <div className="flex items-center w-full gap-2">
                        {notification.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                        <span className="font-semibold text-sm leading-none">{notification.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground line-clamp-2 ml-3.5">
                        {notification.desc}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 pl-6 border-l border-border cursor-pointer group outline-none">
                  <div className="text-right hidden md:block group-hover:opacity-80 transition-opacity">
                    <p className="text-sm font-bold text-foreground leading-tight">{user?.name || "Usuário"}</p>
                  
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary transition-all duration-300 shadow-sm relative overflow-hidden">
                    {user?.name ? (
                      <span className="text-sm font-bold text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 p-2 rounded-xl shadow-xl border-border animate-in fade-in slide-in-from-top-2 duration-200">
                <DropdownMenuLabel className="px-3 py-2">
                  <p className="text-sm font-bold text-foreground">Minha Conta</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 bg-border/50" />
                <DropdownMenuItem className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-accent focus:bg-accent transition-colors flex items-center gap-2" asChild>
                  <Link to="/app/configuracoes">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-accent focus:bg-accent transition-colors flex items-center gap-2" asChild>
                  <Link to="/app/configuracoes">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Ver Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-border/50" />
                <DropdownMenuItem 
                  className="rounded-lg px-3 py-2.5 cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 transition-colors flex items-center gap-2"
                  onClick={() => logout()}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-bold">Encerrar Sessão</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
