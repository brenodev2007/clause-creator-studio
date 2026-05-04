import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Users, Shield, CheckCircle, XCircle } from 'lucide-react';

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
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !user.is_admin) {
      navigate('/app');
      return;
    }
    
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
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
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível carregar os usuários.' });
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
        toast({ title: 'Sucesso', description: 'Status do usuário atualizado.' });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível atualizar o status.' });
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
        toast({ title: 'Sucesso', description: 'Tokens atualizados.' });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível atualizar os tokens.' });
    }
  };

  if (!user?.is_admin) return null;

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <Button variant="ghost" onClick={() => navigate('/app')} className="px-2">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Painel de Administração</h1>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Carregando usuários...</div>
        ) : (
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Usuário</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Tokens Diários</th>
                    <th className="px-6 py-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 font-medium">#{u.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{u.name} {u.is_admin && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded ml-2">Admin</span>}</div>
                        <div className="text-muted-foreground text-xs">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${u.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {u.is_active ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {u.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-[120px]">
                          <Input 
                            type="number" 
                            defaultValue={u.daily_tokens} 
                            className="h-8 text-sm"
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
                        <Button 
                          variant={u.is_active ? "destructive" : "default"} 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => toggleUserStatus(u.id, u.is_active)}
                          disabled={u.id === user.id}
                        >
                          {u.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
