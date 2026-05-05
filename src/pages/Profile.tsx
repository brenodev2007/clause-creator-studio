import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, Shield, Pencil, Check, X, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto w-full px-6 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais e preferências de conta.</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-5">
            <Avatar className="w-20 h-20 border-4 border-background shadow-xl">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user?.name || "Usuário"}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {user?.is_admin && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-xs font-semibold bg-red-500/10 text-red-500">
                  <Shield className="w-3 h-3" />
                  Administrador
                </span>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
          >
            <LogOut className="w-4 h-4" />
            Sair da Conta
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Dados Pessoais</h3>
              <p className="text-xs text-muted-foreground">Suas informações de identificação</p>
            </div>
          </div>
          <div className="p-6 space-y-5">
            {/* Name Field — Editable */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome Completo</label>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    className="h-10" 
                    autoFocus 
                    disabled={isSaving}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()} 
                  />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="shrink-0 text-green-500 hover:text-green-600 hover:bg-green-500/10" 
                    onClick={handleSaveName}
                    disabled={isSaving}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="shrink-0 text-muted-foreground hover:text-destructive" 
                    onClick={cancelEditName}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between group">
                  <span className="text-sm font-medium text-foreground">{user?.name || "—"}</span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary h-8 w-8" 
                    onClick={() => { setEditName(user?.name || ""); setIsEditingName(true); }}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Email Field — Read Only */}
            <div className="space-y-2 pt-4 border-t border-border/50">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">E-mail</label>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground truncate">{user?.email || "—"}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Segurança</h3>
              <p className="text-xs text-muted-foreground">Configurações de acesso e proteção</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Alterar Senha</p>
                <p className="text-xs text-muted-foreground mt-0.5">Recomendamos trocar sua senha periodicamente.</p>
              </div>
              <Button variant="outline" className="gap-2" onClick={() => toast.info("Funcionalidade em breve!")}>
                <KeyRound className="w-4 h-4" />
                Alterar
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
