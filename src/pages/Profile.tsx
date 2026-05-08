import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, Shield, Pencil, Check, X, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { motion, Variants } from "framer-motion";
import { useTokens } from "../hooks/use-tokens";

const Profile = () => {
  const { user, token, logout, updateUser } = useAuth();
  const { tokens, dailyLimit } = useTokens();
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
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-full bg-background pb-20">
      <motion.div 
        className="max-w-3xl mx-auto w-full px-6 pt-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-12 border-b border-border pb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie suas informações de conta</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/5"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </motion.div>

        <div className="space-y-8">
          {/* Main Card */}
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <div className="flex items-start gap-8 flex-col md:flex-row">
              <Avatar className="w-24 h-24 border border-border">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`} />
                <AvatarFallback className="text-2xl font-bold bg-muted text-primary">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-6 w-full">
                {/* Name Edit Section */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome Completo</label>
                  {isEditingName ? (
                    <div className="flex items-center gap-2 max-w-md">
                      <Input 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)} 
                        className="h-9 focus-visible:ring-primary" 
                        autoFocus 
                        disabled={isSaving}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()} 
                      />
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-9 w-9 text-green-600" onClick={handleSaveName} disabled={isSaving}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground" onClick={cancelEditName} disabled={isSaving}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <span className="text-lg font-medium">{user?.name || "—"}</span>
                      <button onClick={() => { setEditName(user?.name || ""); setIsEditingName(true); }} className="text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Email Section */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">E-mail</label>
                  <p className="text-foreground">{user?.email}</p>
                </div>

                {/* Role Section */}
                {user?.is_admin && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Permissão</label>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-muted text-foreground text-[10px] font-bold uppercase tracking-wider">
                      <Shield className="w-3 h-3" />
                      Administrador
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Tokens Section */}
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-foreground">Uso de Créditos</h3>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {tokens} de {dailyLimit} disponíveis hoje
              </span>
            </div>
            
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(tokens / (dailyLimit || 20)) * 100}%` }}
                className="h-full bg-primary"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 uppercase tracking-wider font-medium">
              Créditos renovados diariamente às 00:00
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
