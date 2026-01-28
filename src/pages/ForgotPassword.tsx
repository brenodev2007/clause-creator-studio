import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Lock, Mail, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Senha Alterada",
          description: "Sua senha foi atualizada com sucesso.",
        });
        navigate('/login');
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: data.msg || "Não foi possível alterar a senha.",
        });
      }
    } catch (error) {
      console.error("Reset error", error);
      toast({
        variant: "destructive",
        title: "Erro de Conexão",
        description: "Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background overflow-hidden relative">
      
       {/* Ambient Background */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" />
       </div>

      <div className="w-full max-w-md p-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-card/50 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-8 space-y-8">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-2 ring-1 ring-primary/20">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Redefinir Senha</h2>
            <p className="text-muted-foreground text-sm">Digite seu email e a nova senha.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Email Cadastrado</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-11 bg-background/50 border-input/50 focus:bg-background transition-all rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Nova Senha</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="pl-10 h-11 bg-background/50 border-input/50 focus:bg-background transition-all rounded-xl"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? "Atualizando..." : "Salvar Nova Senha"}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </form>

          <div className="text-center text-sm">
            <Link to="/login" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
              Voltar para Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
