import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, ArrowRight, Lock, Mail, Star } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const redirectPath = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        toast({ title: "Bem-vindo de volta!", description: "Login realizado com sucesso." });
        navigate(redirectPath);
      } else {
        toast({
          variant: "destructive",
          title: "Falha no Login",
          description: data.msg || "Credenciais inválidas.",
        });
      }
    } catch (error) {
      console.error("Login error", error);
      toast({
        variant: "destructive",
        title: "Erro de Conexão",
        description: "Não foi possível conectar ao servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden relative">
      
      {/* Left Side - Artistic Panel (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-50 overflow-hidden items-center justify-center p-12">
         {/* Abstract Shapes */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3" />
         
         {/* Glass Card Content */}
         <div className="relative z-10 max-w-lg">
           <div className="mb-8">
             <img src="/logo.png" alt="Logo" className="h-16 w-auto object-contain" />
           </div>
           <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
             Transforme a gestão dos seus contratos.
           </h1>
           <p className="text-lg text-slate-600 mb-10 leading-relaxed">
             Junte-se a milhares de profissionais que usam nossa IA para criar, validar e assinar documentos com segurança jurídica.
           </p>
           
           {/* Testimonial */}
           <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg shadow-slate-200/50">
             <div className="flex gap-1 mb-3 text-amber-500">
               {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
             </div>
             <p className="text-slate-700 italic mb-4">"A melhor plataforma de contratos que já usei. Simples, rápida e o suporte é incrível."</p>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs">RJ</div>
               <div>
                 <div className="text-sm font-semibold text-slate-900">Ricardo Junior</div>
                 <div className="text-xs text-slate-500">Advogado Associado</div>
               </div>
             </div>
           </div>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
         {/* Mobile Ambient Background */}
         <div className="lg:hidden absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl opacity-30" />
         
         <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in slide-in-from-right-8 duration-700">
           <div className="text-center lg:text-left space-y-2">
             <div className="lg:hidden flex justify-center mb-6">
               <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
             </div>
             <h2 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h2>
             <p className="text-muted-foreground">Digite seus dados para acessar sua conta.</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
             <div className="space-y-2">
               <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
               <div className="relative group">
                 <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                 <Input
                   type="email"
                   placeholder="seu@email.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                   className="pl-10 h-11 bg-background"
                 />
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between items-center">
                  <label className="text-sm font-medium leading-none">Senha</label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">Esqueceu?</Link>
               </div>
               <div className="relative group">
                 <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                 <Input
                   type="password"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   className="pl-10 h-11 bg-background"
                 />
               </div>
             </div>

             <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20" disabled={loading}>
               {loading ? "Entrando..." : "Acessar Plataforma"}
               {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
             </Button>
           </form>

           <div className="text-center text-sm">
             <span className="text-muted-foreground">Novo por aqui? </span>
             <Link to={`/register${redirectPath !== '/' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`} className="text-primary font-bold hover:underline">
               Criar conta gratuita
             </Link>
           </div>
         </div>
      </div>

    </div>
  );
};

export default Login;
