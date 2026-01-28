import { useAuth } from "../context/AuthContext";
import { useTokens } from "../hooks/use-tokens";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, CreditCard, User as UserIcon, Shield, Mail } from "lucide-react";
import PricingModal from "../components/PricingModal";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const { user, logout } = useAuth();
  const { plan, dailyLimit, showPricingModal, setShowPricingModal, tokens, upgradePlan } = useTokens();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const getPlanLabel = (p: string) => {
    switch (p) {
      case 'pro': return 'Pro';
      case 'unlimited': return 'Ilimitado';
      default: return 'Gratuito';
    }
  };

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8 pt-20 flex justify-center">
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in-50 duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-card rounded-3xl border border-border shadow-sm">
          <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left space-y-1 flex-1">
             <h1 className="text-3xl font-bold tracking-tight">{user?.name}</h1>
             <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
               <Mail className="w-4 h-4" />
               <span>{user?.email}</span>
             </div>
          </div>
          <Button variant="destructive" onClick={handleLogout} className="gap-2 rounded-xl">
            <LogOut className="w-4 h-4" />
            Sair da conta
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Plan Details */}
          <Card className="rounded-3xl border-border shadow-sm h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                   <CardTitle className="text-xl">Assinatura</CardTitle>
                   <CardDescription>Gerencie seu plano atual</CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 flex-1 flex flex-col">
               <div className="flex items-center justify-between mb-6">
                  <span className="text-muted-foreground font-medium">Plano Atual</span>
                  <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wide">
                    {getPlanLabel(plan)}
                  </span>
               </div>
               
               <div className="flex items-center justify-between mb-8">
                  <span className="text-muted-foreground font-medium">Tokens Diários</span>
                  <span className="font-mono font-bold text-lg">
                    {typeof dailyLimit === 'number' ? dailyLimit : '∞'}
                  </span>
               </div>

               <div className="mt-auto">
                 <Button onClick={() => setShowPricingModal(true)} className="w-full rounded-xl py-6 text-base shadow-primary/20 shadow-lg" size="lg">
                   {plan === 'free' ? 'Fazer Upgrade' : 'Alterar Plano'}
                 </Button>
               </div>
            </CardContent>
          </Card>

           {/* Account Details (Static for now) */}
           <Card className="rounded-3xl border-border shadow-sm h-full">
            <CardHeader className="pb-4">
               <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-muted rounded-xl">
                  <UserIcon className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                   <CardTitle className="text-xl">Dados da Conta</CardTitle>
                   <CardDescription>Suas informações pessoais</CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-1">
                 <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Nome Completo</label>
                 <div className="p-3 bg-secondary/50 rounded-xl border border-border/50 text-foreground font-medium">
                   {user?.name}
                 </div>
              </div>
              <div className="space-y-1">
                 <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Email de Acesso</label>
                 <div className="p-3 bg-secondary/50 rounded-xl border border-border/50 text-foreground font-medium flex items-center gap-2">
                   <Shield className="w-4 h-4 text-green-500" />
                   {user?.email}
                 </div>
              </div>
              <div className="pt-2 text-xs text-muted-foreground leading-relaxed">
                Para alterar seus dados ou senha, entre em contato com nosso suporte ou aguarde as próximas atualizações do sistema.
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <PricingModal
        open={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        onSelectPlan={(newPlan) => {
          upgradePlan(newPlan);
          setShowPricingModal(false);
        }}
        currentTokens={tokens} // Fixed: useTokens returns 'tokens', not 'currentTokens'
        currentPlan={plan}
      />
    </div>
  );
};

export default Profile;
