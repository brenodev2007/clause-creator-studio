import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, ArrowRight, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { TermsOfService } from "@/components/TermsOfService";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const redirectPath = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate terms acceptance
    if (!acceptedTerms) {
      toast({
        variant: "destructive",
        title: "Termos não aceitos",
        description: "Você precisa aceitar os Termos de Uso para criar uma conta.",
      });
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, acceptedTerms }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        toast({ title: "Conta criada!", description: "Bem-vindo ao sistema." });
        navigate(redirectPath);
      } else {
        toast({
          variant: "destructive",
          title: "Erro no Cadastro",
          description: data.msg || "Não foi possível criar conta.",
        });
      }
    } catch (error) {
      console.error("Register error", error);
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
    <div className="flex min-h-screen w-full bg-background overflow-hidden relative">
      
       {/* Left Side - Artistic Panel (Hidden on mobile) */}
       <div className="hidden lg:flex w-1/2 relative bg-slate-50 overflow-hidden items-center justify-center p-12 order-2">
         {/* Abstract Shapes */}
         <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl opacity-60 -translate-x-1/3 -translate-y-1/3" />
         <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50 translate-x-1/3 translate-y-1/3" />
         
         {/* Feature List Content */}
         <div className="relative z-10 max-w-lg space-y-8">
           <div className="mb-6">
             <img src="/logo.png" alt="Logo" className="h-16 w-auto object-contain" />
           </div>
           
           <h1 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">
             Segurança e eficiência em um só lugar.
           </h1>
           
           <div className="space-y-4">
             {[
               "Acesso ilimitado a modelos premium",
               "Geração de contratos com Inteligência Artificial",
               "Exportação em PDF profissional",
               "Armazenamento seguro em nuvem"
             ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:shadow-md transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
             ))}
           </div>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative order-1">
         <div className="lg:hidden absolute bottom-[-20%] left-[-20%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl opacity-30" />
         
         <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in slide-in-from-left-8 duration-700">
           <div className="text-center lg:text-left space-y-2">
             <div className="lg:hidden flex justify-center mb-6">
               <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
             </div>
             <h2 className="text-3xl font-bold tracking-tight">Criar uma conta</h2>
             <p className="text-muted-foreground">Experimente grátis. Não precisa de cartão de crédito.</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
               <label className="text-sm font-medium leading-none">Nome Completo</label>
               <div className="relative group">
                 <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                 <Input
                   type="text"
                   placeholder="Seu nome"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   required
                   className="pl-10 h-11 bg-background"
                 />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium leading-none">Email Profissional</label>
               <div className="relative group">
                 <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                 <Input
                   type="email"
                   placeholder="seu@empresa.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                   className="pl-10 h-11 bg-background"
                 />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium leading-none">Senha</label>
               <div className="relative group">
                 <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                 <Input
                   type="password"
                   placeholder="Mínimo 6 caracteres"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   className="pl-10 h-11 bg-background"
                 />
               </div>
             </div>

             {/* Terms of Service Acceptance */}
             <div className="flex items-start space-x-3 py-2">
               <Checkbox 
                 id="terms" 
                 checked={acceptedTerms}
                 onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                 className="mt-1"
               />
               <label 
                 htmlFor="terms" 
                 className="text-sm text-muted-foreground leading-relaxed cursor-pointer select-none"
               >
                 Eu li e aceito os{' '}
                 <button
                   type="button"
                   onClick={(e) => {
                     e.preventDefault();
                     setShowTerms(true);
                   }}
                   className="text-primary font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                 >
                   Termos de Uso e Serviço
                 </button>
               </label>
             </div>

             <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-blue-500/20" disabled={loading}>
               {loading ? "Criando..." : "Começar Agora"}
               {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
             </Button>
           </form>

           <div className="text-center text-sm">
             <span className="text-muted-foreground">Já tem cadastro? </span>
             <Link to={`/login${redirectPath !== '/' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`} className="text-primary font-bold hover:underline">
               Fazer Login
             </Link>
           </div>
         </div>
      </div>

      {/* Terms of Service Modal */}
      <TermsOfService open={showTerms} onOpenChange={setShowTerms} />

    </div>
  );
};

export default Register;
