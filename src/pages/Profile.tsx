import { useAuth } from "../context/AuthContext";
import { useTokens } from "../hooks/use-tokens";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, CreditCard, User as UserIcon, ArrowLeft } from "lucide-react";
import PricingModal from "../components/PricingModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const { plan, dailyLimit, showPricingModal, setShowPricingModal, tokens, upgradePlan } = useTokens();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getPlanLabel = (p: string) => {
    switch (p) {
      case 'pro': return 'Pro';
      case 'unlimited': return 'Ilimitado';
      default: return 'Gratuito';
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Top Navigation */}
      <div className="border-b border-border/40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <h2 className="text-sm font-medium text-muted-foreground">Perfil</h2>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* User Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`} />
              <AvatarFallback className="bg-muted text-foreground font-medium">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{user?.name}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subscription */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-base">Assinatura</CardTitle>
                  <CardDescription className="text-xs">Seu plano atual</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Plano</span>
                <span className="text-sm font-medium">{getPlanLabel(plan)}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-t border-border/40">
                <span className="text-sm text-muted-foreground">Tokens diários</span>
                <span className="text-sm font-mono font-medium">
                  {typeof dailyLimit === 'number' ? dailyLimit : '∞'}
                </span>
              </div>

              <Button 
                onClick={() => setShowPricingModal(true)} 
                className="w-full mt-2" 
                variant={plan === 'free' ? 'default' : 'outline'}
              >
                {plan === 'free' ? 'Fazer Upgrade' : 'Alterar Plano'}
              </Button>
            </CardContent>
          </Card>

          {/* Account */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-base">Dados da Conta</CardTitle>
                  <CardDescription className="text-xs">Informações pessoais</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Nome</label>
                <div className="text-sm font-medium">{user?.name}</div>
              </div>
              
              <div className="space-y-1 pt-2 border-t border-border/40">
                <label className="text-xs text-muted-foreground">Email</label>
                <div className="text-sm font-medium truncate">{user?.email}</div>
              </div>

              <p className="text-xs text-muted-foreground pt-2">
                Entre em contato com o suporte para alterar seus dados.
              </p>
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
        currentTokens={tokens}
        currentPlan={plan}
      />
    </div>
  );
};

export default Profile;
