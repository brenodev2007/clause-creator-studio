import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Coins, Sparkles, Zap, Crown } from "lucide-react";
import { TokenAction } from "@/hooks/use-tokens";

interface PricingPlan {
  id: string;
  name: string;
  tokens: number;
  price: number;
  icon: React.ReactNode;
  popular?: boolean;
  features: string[];
}

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Iniciante",
    tokens: 10,
    price: 9.90,
    icon: <Coins className="w-5 h-5" />,
    features: ["10 tokens", "Uso básico", "Suporte por email"],
  },
  {
    id: "pro",
    name: "Profissional",
    tokens: 50,
    price: 29.90,
    icon: <Zap className="w-5 h-5" />,
    popular: true,
    features: ["50 tokens", "Melhor custo-benefício", "Suporte prioritário"],
  },
  {
    id: "enterprise",
    name: "Empresarial",
    tokens: 200,
    price: 79.90,
    icon: <Crown className="w-5 h-5" />,
    features: ["200 tokens", "Uso ilimitado*", "Suporte 24/7"],
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
    // In a real app, this would integrate with a payment provider
    onSelectPlan(plan.tokens);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl">
            {pendingAction 
              ? "Tokens insuficientes" 
              : "Adquirir mais tokens"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {pendingAction ? (
              <>
                Você precisa de <strong>{pendingAction.cost} tokens</strong> para {pendingAction.name.toLowerCase()}, 
                mas só tem <strong>{currentTokens}</strong>. Escolha um plano para continuar.
              </>
            ) : (
              "Escolha um plano que se adapte às suas necessidades."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border-2 p-5 transition-all hover:shadow-lg ${
                plan.popular 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg ${plan.popular ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                  {plan.icon}
                </div>
                <h3 className="font-semibold text-lg">{plan.name}</h3>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold">
                  R${plan.price.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <ul className="space-y-2 mb-5">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full ${plan.popular ? "" : "variant-outline"}`}
                variant={plan.popular ? "default" : "outline"}
              >
                Selecionar
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            * Uso ilimitado sujeito a termos de uso razoável. Pagamento único.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
