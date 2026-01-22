import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Coins, Sparkles, Zap, Crown, X } from "lucide-react";
import { TokenAction } from "@/hooks/use-tokens";

interface PricingPlan {
  id: string;
  name: string;
  tokens: number;
  price: number;
  pricePerToken: string;
  icon: React.ReactNode;
  popular?: boolean;
  features: string[];
  gradient: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Iniciante",
    tokens: 10,
    price: 9.90,
    pricePerToken: "R$0,99",
    icon: <Coins className="w-5 h-5" />,
    gradient: "from-amber-500 to-orange-500",
    features: ["10 tokens inclusos", "Válido por 30 dias", "Suporte por email"],
  },
  {
    id: "pro",
    name: "Profissional",
    tokens: 50,
    price: 29.90,
    pricePerToken: "R$0,60",
    icon: <Zap className="w-5 h-5" />,
    popular: true,
    gradient: "from-primary to-blue-600",
    features: ["50 tokens inclusos", "Melhor custo-benefício", "Suporte prioritário", "40% de economia"],
  },
  {
    id: "enterprise",
    name: "Empresarial",
    tokens: 200,
    price: 79.90,
    pricePerToken: "R$0,40",
    icon: <Crown className="w-5 h-5" />,
    gradient: "from-violet-500 to-purple-600",
    features: ["200 tokens inclusos", "Economia máxima", "Suporte 24/7", "60% de economia"],
  },
];

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  onSelectPlan: (tokens: number) => void;
  pendingAction?: TokenAction | null;
  currentTokens: number;
}

const PricingModal = ({ 
  open, 
  onClose, 
  onSelectPlan, 
  pendingAction,
  currentTokens 
}: PricingModalProps) => {
  const handleSelectPlan = (plan: PricingPlan) => {
    onSelectPlan(plan.tokens);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden border-border/50">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-8">
          <DialogHeader className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              {pendingAction 
                ? "Tokens insuficientes" 
                : "Adquirir mais tokens"}
            </DialogTitle>
            <DialogDescription className="text-base max-w-md mx-auto">
              {pendingAction ? (
                <>
                  Você precisa de <span className="font-semibold text-foreground">{pendingAction.cost} tokens</span> para {pendingAction.name.toLowerCase()}, 
                  mas só tem <span className="font-semibold text-foreground">{currentTokens}</span>. Escolha um plano abaixo.
                </>
              ) : (
                "Escolha o plano ideal para suas necessidades e continue criando contratos."
              )}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Plans Grid */}
        <div className="p-6 pt-0 -mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  plan.popular 
                    ? "border-primary bg-gradient-to-b from-primary/5 to-transparent shadow-lg shadow-primary/10" 
                    : "border-border/50 hover:border-primary/30 bg-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-primary/25">
                      Mais Popular
                    </span>
                  </div>
                )}

                {/* Icon and Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${plan.gradient} text-white shadow-lg`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.pricePerToken}/token</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-4xl font-bold tracking-tight">
                      {plan.price.toFixed(2).replace('.', ',').split(',')[0]}
                    </span>
                    <span className="text-lg text-muted-foreground">,{plan.price.toFixed(2).split('.')[1]}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">pagamento único</p>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2.5 text-sm">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center shrink-0`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full h-11 font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? "bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 shadow-lg shadow-primary/25" 
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Escolher Plano
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="bg-secondary/50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Garantia de satisfação</p>
                <p className="text-xs text-muted-foreground">Reembolso em até 7 dias</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
