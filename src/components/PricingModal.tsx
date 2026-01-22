import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { Check, Sparkles, Zap, Crown, Infinity } from "lucide-react";
import { TokenAction, PlanType, PLAN_LIMITS } from "@/hooks/use-tokens";
=======
import { Check, Coins, Sparkles, Zap, Crown, X } from "lucide-react";
import { TokenAction } from "@/hooks/use-tokens";
>>>>>>> d048d22816c60d85818cdef0ee952d07aed1831c

interface PricingPlan {
  id: PlanType;
  name: string;
  dailyTokens: number | string;
  price: number;
<<<<<<< HEAD
  priceLabel: string;
=======
  pricePerToken: string;
>>>>>>> d048d22816c60d85818cdef0ee952d07aed1831c
  icon: React.ReactNode;
  popular?: boolean;
  features: string[];
  gradient: string;
}

const pricingPlans: PricingPlan[] = [
  {
<<<<<<< HEAD
    id: "free",
    name: "Gratuito",
    dailyTokens: PLAN_LIMITS.free,
    price: 0,
    priceLabel: "Grátis",
    icon: <Sparkles className="w-5 h-5" />,
    features: [
      `${PLAN_LIMITS.free} tokens por dia`,
      "Reset diário às 00:00",
      "Todos os recursos básicos",
      "Suporte por email"
    ],
    gradient: "from-gray-500/10 to-gray-500/5",
  },
  {
    id: "basic",
    name: "Básico",
    dailyTokens: PLAN_LIMITS.basic,
    price: 19.90,
    priceLabel: "R$ 19,90/mês",
    icon: <Zap className="w-5 h-5" />,
    popular: true,
    features: [
      `${PLAN_LIMITS.basic} tokens por dia`,
      "Reset diário às 00:00",
      "Melhor custo-benefício",
      "Suporte prioritário"
    ],
    gradient: "from-blue-500/10 to-blue-500/5",
  },
  {
    id: "pro",
    name: "Pro",
    dailyTokens: PLAN_LIMITS.pro,
    price: 49.90,
    priceLabel: "R$ 49,90/mês",
    icon: <Crown className="w-5 h-5" />,
    features: [
      `${PLAN_LIMITS.pro} tokens por dia`,
      "Reset diário às 00:00",
      "Uso profissional",
      "Suporte prioritário 24/7"
    ],
    gradient: "from-purple-500/10 to-purple-500/5",
  },
  {
    id: "unlimited",
    name: "Ilimitado",
    dailyTokens: "∞",
    price: 99.90,
    priceLabel: "R$ 99,90/mês",
    icon: <Infinity className="w-5 h-5" />,
    features: [
      "Tokens ilimitados",
      "Sem restrições diárias",
      "Uso empresarial",
      "Suporte VIP 24/7"
    ],
    gradient: "from-amber-500/10 to-amber-500/5",
=======
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
>>>>>>> d048d22816c60d85818cdef0ee952d07aed1831c
  },
];

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  onSelectPlan: (plan: PlanType) => void;
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
<<<<<<< HEAD
    onSelectPlan(plan.id);
=======
    onSelectPlan(plan.tokens);
>>>>>>> d048d22816c60d85818cdef0ee952d07aed1831c
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
<<<<<<< HEAD
      <DialogContent className="sm:max-w-6xl w-[95vw] p-0 overflow-hidden border-none bg-transparent shadow-2xl">
        <div className="bg-background/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Header Section - Left Side */}
            <div className="w-full md:w-1/4 space-y-6">
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
            <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative group rounded-xl border p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col bg-card/50 hover:bg-card ${
                    plan.popular 
                      ? "border-primary/50 shadow-primary/5 ring-1 ring-primary/20" 
                      : "border-border/50 hover:border-primary/20"
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
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold">{typeof plan.dailyTokens === 'number' ? plan.dailyTokens : '∞'}</span>
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
                    <div className="text-sm font-semibold mb-3 text-center">{plan.priceLabel}</div>
                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      className="w-full h-9 text-xs font-semibold shadow-sm"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.price === 0 ? "Começar Grátis" : "Selecionar Plano"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
=======
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
>>>>>>> d048d22816c60d85818cdef0ee952d07aed1831c
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
