import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown, Infinity } from "lucide-react";
import { TokenAction, PlanType, PLAN_LIMITS } from "@/hooks/use-tokens";

interface PricingPlan {
  id: PlanType;
  name: string;
  dailyTokens: number | string;
  price: number;
  priceLabel: string;
  icon: React.ReactNode;
  popular?: boolean;
  features: string[];
  gradient: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Gratuito",
    dailyTokens: 10,
    price: 0,
    priceLabel: "Grátis",
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      "10 tokens por dia",
      "Reset diário às 00:00",
      "Recursos básicos",
      "Suporte por email"
    ],
    gradient: "from-zinc-500/20 to-gray-500/20",
  },
  {
    id: "pro",
    name: "Pro",
    dailyTokens: 50,
    price: 19.90,
    priceLabel: "R$ 19,90/mês",
    icon: <Crown className="w-6 h-6" />,
    popular: true,
    features: [
      "50 tokens por dia",
      "Reset diário às 00:00",
      "Uso profissional",
      "Suporte prioritário"
    ],
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "unlimited",
    name: "Ilimitado",
    dailyTokens: "∞",
    price: 39.90,
    priceLabel: "R$ 39,90/mês",
    icon: <Infinity className="w-6 h-6" />,
    features: [
      "Tokens ilimitados",
      "Sem restrições diárias",
      "Uso empresarial",
      "Suporte VIP 24/7"
    ],
    gradient: "from-amber-500/20 to-yellow-500/20",
  },
];

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  onSelectPlan: (plan: PlanType) => void;
  pendingAction?: TokenAction | null;
  currentTokens: number;
  currentPlan?: PlanType;
}

const PricingModal = ({ 
  open, 
  onClose, 
  onSelectPlan, 
  pendingAction,
  currentTokens,
  currentPlan = 'free'
}: PricingModalProps) => {
  const handleSelectPlan = async (plan: PricingPlan) => {
    // If free plan, just update locally
    if (plan.price === 0) {
      onSelectPlan(plan.id);
      onClose();
      return;
    }

    try {
      // Get user ID from localStorage token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Você precisa estar logado para fazer upgrade');
        return;
      }

      // Decode token to get user ID (simple decode, not validation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      // Create payment preference
      const response = await fetch('http://localhost:5000/api/payment/create_preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Plano ${plan.name} - ContrateMe`,
          quantity: 1,
          price: plan.price,
          userId: userId,
          plan: plan.id,
        }),
      });

      const data = await response.json();

      if (data.sandbox_init_point) {
        // Redirect to Mercado Pago checkout (sandbox for testing)
        window.location.href = data.sandbox_init_point;
      } else if (data.init_point) {
        // Production checkout
        window.location.href = data.init_point;
      } else {
        alert('Erro ao criar preferência de pagamento');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl w-[95vw] p-0 overflow-hidden border-none bg-transparent shadow-2xl">
        <div className="bg-background/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4 lg:gap-8 items-start">
            {/* Header Section - Left Side */}
            <div className="w-full md:w-1/4 space-y-6 shrink-0">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <DialogTitle className="text-3xl font-bold tracking-tight">
                  {pendingAction ? "Tokens insuficientes" : "Escolha seu plano"}
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                  {pendingAction ? (
                    <span>
                      Você precisa de <strong className="text-foreground">{pendingAction.cost} tokens</strong> para esta ação.
                    </span>
                  ) : (
                    "Potencialize sua criação de contratos com nossos planos flexíveis."
                  )}
                </DialogDescription>
              </div>

              {/* Token Costs - Compact */}
              <div className="bg-secondary/30 rounded-xl p-4 border border-border/50">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Custos de Tokens</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Criar e Editar</span>
                    <span className="font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs">Grátis</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Carregar Histórico</span>
                    <span className="font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs">Grátis</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Exportar PDF</span>
                    <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">10 tokens</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground pt-4 border-t border-border">
                💡 Tokens resetam diariamente às 00:00
              </div>
            </div>

            {/* Plans Grid - Right Side */}
            <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative group rounded-2xl border p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full justify-between ${
                    plan.popular 
                      ? "bg-card dark:bg-gradient-to-b dark:from-zinc-900 dark:via-zinc-900 dark:to-black border-primary shadow-lg ring-1 ring-primary/20 scale-105 z-10" 
                      : "bg-card/50 hover:bg-card border-border hover:border-primary/20"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 inset-x-0 flex justify-center">
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                        Melhor Escolha
                      </span>
                    </div>
                  )}

                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {plan.icon}
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-lg text-foreground">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-foreground">{typeof plan.dailyTokens === 'number' ? plan.dailyTokens : '∞'}</span>
                      <span className="text-xs text-muted-foreground font-medium">tokens/dia</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6 flex-grow">
                    {plan.features.slice(2).map((feature, index) => ( // Showing only distinct features
                      <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{feature}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>Reset diário 00:00</span>
                    </li>
                  </ul>

                  <div className="pt-4 mt-auto border-t border-border/50">
                    <div className="text-sm font-semibold mb-3 text-center text-muted-foreground">{plan.priceLabel}</div>
                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      className="w-full h-9 text-xs font-semibold shadow-sm"
                      variant={plan.popular ? "default" : "outline"}
                      disabled={currentPlan === plan.id}
                    >
                      {currentPlan === plan.id 
                        ? "Seu Plano Atual" 
                        : plan.price === 0 
                          ? "Voltar para Grátis" 
                          : "Assinar Agora"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
