import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, CheckCircle, XCircle, Users, Search, RefreshCw, Coins } from 'lucide-react';
import { toast } from "sonner";
import { motion } from "framer-motion";

interface UserData {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
  daily_tokens: number;
  created_at: string;
}

const AdminPanel = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user && !user.is_admin) {
      navigate('/app');
      return;
    }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error('Falha ao buscar usuários');
      }
    } catch (error) {
      toast.error('Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/active`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      if (response.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, is_active: !currentStatus } : u));
        toast.success(`Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso.`);
      }
    } catch (error) {
      toast.error('Não foi possível atualizar o status.');
    }
  };

  const updateTokens = async (id: number, tokens: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/tokens`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ daily_tokens: tokens })
      });
      if (response.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, daily_tokens: tokens } : u));
        toast.success('Tokens atualizados com sucesso.');
      }
    } catch (error) {
      toast.error('Não foi possível atualizar os tokens.');
    }
  };

  const resetUserTokens = async (userId: number) => {
    try {
      // Mocking backend reset call
      // In a real app, this would tell the backend to notify the user's client or clear their usage
      
      // Locally, if it's the current user, we can clear the localStorage directly
      const storageKey = `contract-tokens-v2${userId}`;
      localStorage.removeItem(storageKey);
      
      toast.success(`Saldo do usuário #${userId} resetado com sucesso.`);
      
      // If resetting own tokens, force reload of token data
      if (userId === user?.id) {
        window.location.reload();
      }
    } catch (error) {
      toast.error('Erro ao resetar tokens.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = users.filter(u => u.is_active).length;
  const adminCount = users.filter(u => u.is_admin).length;

  if (!user?.is_admin) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto w-full px-6 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Painel de Administração</h1>
        </div>
        <p className="text-muted-foreground">Gerencie os usuários do sistema, status de contas e limites de tokens.</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
            <p className="text-xs text-muted-foreground">Total de Usuários</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Contas Ativas</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{adminCount}</p>
            <p className="text-xs text-muted-foreground">Administradores</p>
          </div>
        </div>
      </motion.div>

      {/* Table Card */}
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Usuários Cadastrados</h3>
              <p className="text-xs text-muted-foreground">{filteredUsers.length} de {users.length} usuários</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input 
                placeholder="Buscar por nome ou e-mail..." 
                className="pl-9 h-10 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0 h-10 w-10" onClick={fetchUsers} title="Atualizar lista">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin mr-3" />
            Carregando usuários...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Nenhum usuário encontrado</p>
            <p className="text-xs mt-1">Tente ajustar os filtros de busca.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3.5 font-medium">Usuário</th>
                  <th className="px-6 py-3.5 font-medium">Status</th>
                  <th className="px-6 py-3.5 font-medium">Tipo</th>
                  <th className="px-6 py-3.5 font-medium">
                    <span className="flex items-center gap-1.5"><Coins className="w-3.5 h-3.5" /> Tokens/Dia</span>
                  </th>
                  <th className="px-6 py-3.5 font-medium">Cadastro</th>
                  <th className="px-6 py-3.5 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">{u.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{u.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.is_active 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}>
                        {u.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {u.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.is_admin ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Usuário</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24">
                        <Input 
                          type="number" 
                          defaultValue={u.daily_tokens} 
                          className="h-8 text-sm text-center font-mono bg-background"
                          min={0}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val !== u.daily_tokens) {
                              updateTokens(u.id, val);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = parseInt(e.currentTarget.value);
                              if (!isNaN(val) && val !== u.daily_tokens) {
                                updateTokens(u.id, val);
                              }
                              e.currentTarget.blur();
                            }
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-muted-foreground">
                        {new Date(u.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                        title="Resetar Saldo (Refilar)"
                        onClick={() => resetUserTokens(u.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant={u.is_active ? "outline" : "default"} 
                        size="sm" 
                        className={`h-8 text-xs font-medium ${
                          u.is_active 
                            ? 'text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                        onClick={() => toggleUserStatus(u.id, u.is_active)}
                        disabled={u.id === user!.id}
                      >
                        {u.is_active ? 'Desativar' : 'Ativar'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;
