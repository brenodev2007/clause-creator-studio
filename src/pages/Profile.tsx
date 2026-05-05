import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, Shield, Pencil, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { motion, Variants } from "framer-motion";

const Profile = () => {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSaveName = async () => {
    if (!editName.trim()) {
      toast.error("O nome não pode ficar vazio.");
      return;
    }

    if (editName.trim() === user?.name) {
      setIsEditingName(false);
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser({ name: updatedUser.name });
        toast.success("Nome atualizado com sucesso!");
        setIsEditingName(false);
      } else {
        const err = await response.json();
        toast.error(err.msg || "Erro ao atualizar o nome.");
      }
    } catch (error) {
      toast.error("Erro de conexão ao atualizar o nome.");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEditName = () => {
    setIsEditingName(false);
    setEditName(user?.name || "");
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto w-full px-6 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground mt-2">Gerencie suas informações e preferências de conta</p>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl shadow-xl shadow-primary/5 overflow-hidden relative">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Header section with Avatar */}
        <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center relative z-10 border-b border-border/50">
          <div className="relative group mb-4">
            <Avatar className="w-28 h-28 border-4 border-background shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`} />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-background rounded-full shadow-sm" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">{user?.name || "Usuário"}</h2>
          <p className="text-muted-foreground font-medium">{user?.email}</p>
          
          {user?.is_admin && (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mt-3 rounded-full text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary border border-primary/20">
              <Shield className="w-3.5 h-3.5" />
              Administrador do Sistema
            </span>
          )}
        </div>

        {/* Content section */}
        <div className="p-8 space-y-8 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-foreground">Informações da Conta</h3>
            </div>

            {/* Name Field */}
            <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-border/50 transition-colors hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nome Completo</label>
                {!isEditingName && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 px-2 text-xs font-bold text-primary hover:text-primary hover:bg-primary/10 rounded-md"
                    onClick={() => { setEditName(user?.name || ""); setIsEditingName(true); }}
                  >
                    Editar
                  </Button>
                )}
              </div>
              
              {isEditingName ? (
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    className="h-10 bg-background border-primary/30 focus-visible:ring-primary shadow-sm" 
                    autoFocus 
                    disabled={isSaving}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()} 
                  />
                  <div className="flex gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-10 w-10 text-green-500 hover:text-green-600 hover:bg-green-500/10 rounded-xl" 
                      onClick={handleSaveName}
                      disabled={isSaving}
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl" 
                      onClick={cancelEditName}
                      disabled={isSaving}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-semibold text-foreground py-1">{user?.name || "—"}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-border/50 transition-colors hover:bg-muted/50 opacity-80">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">E-mail Cadastrado</label>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm font-semibold text-foreground truncate">{user?.email || "—"}</p>
                <span className="text-[10px] font-bold text-muted-foreground bg-muted border border-border/50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Não editável</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <p className="text-xs font-bold text-foreground">Sair da Sessão</p>
              <p className="text-[10px] text-muted-foreground">Desconectar deste dispositivo com segurança</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 font-bold px-6 h-11 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              Encerrar Sessão
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
