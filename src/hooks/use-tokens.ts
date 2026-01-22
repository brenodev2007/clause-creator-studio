import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "contract-tokens-v2";

export type PlanType = "free" | "basic" | "pro" | "unlimited";

export interface TokenAction {
  id: string;
  name: string;
  cost: number;
}

export interface TokenStorage {
  tokens: number;
  lastResetDate: string;
  plan: PlanType;
}

export const TOKEN_ACTIONS: TokenAction[] = [
  { id: "save-contract", name: "Salvar contrato", cost: 0 },
  { id: "load-contract", name: "Carregar contrato", cost: 0 },
  { id: "apply-template", name: "Aplicar modelo", cost: 0 },
  { id: "export-pdf", name: "Exportar PDF", cost: 10 },
];

export const PLAN_LIMITS: Record<PlanType, number> = {
  free: 10,
  basic: 50,
  pro: 200,
  unlimited: 999999,
};

const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

const getStoredData = (): TokenStorage => {
  if (typeof window === "undefined") {
    return {
      tokens: PLAN_LIMITS.free,
      lastResetDate: getTodayDate(),
      plan: "free",
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      tokens: PLAN_LIMITS.free,
      lastResetDate: getTodayDate(),
      plan: "free",
    };
  }

  try {
    const data: TokenStorage = JSON.parse(stored);
    const today = getTodayDate();
    
    // Check if we need to reset tokens (new day)
    if (data.lastResetDate !== today) {
      return {
        tokens: PLAN_LIMITS[data.plan] || PLAN_LIMITS.free,
        lastResetDate: today,
        plan: data.plan,
      };
    }
    
    return data;
  } catch {
    return {
      tokens: PLAN_LIMITS.free,
      lastResetDate: getTodayDate(),
      plan: "free",
    };
  }
};

export const useTokens = () => {
  const [tokenData, setTokenData] = useState<TokenStorage>(getStoredData);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<TokenAction | null>(null);

  // Save to localStorage whenever tokenData changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokenData));
    }
  }, [tokenData]);

  // Check for daily reset on mount and periodically
  useEffect(() => {
    const checkReset = () => {
      const today = getTodayDate();
      if (tokenData.lastResetDate !== today) {
        setTokenData({
          tokens: PLAN_LIMITS[tokenData.plan],
          lastResetDate: today,
          plan: tokenData.plan,
        });
      }
    };

    // Check immediately
    checkReset();

    // Check every minute
    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, [tokenData.lastResetDate, tokenData.plan]);

  const canPerformAction = useCallback((actionId: string): boolean => {
    const action = TOKEN_ACTIONS.find((a) => a.id === actionId);
    if (!action) return true;
    return tokenData.tokens >= action.cost;
  }, [tokenData.tokens]);

  const consumeTokens = useCallback((actionId: string): boolean => {
    const action = TOKEN_ACTIONS.find((a) => a.id === actionId);
    if (!action) return true;

    if (tokenData.tokens >= action.cost) {
      setTokenData((prev) => ({
        ...prev,
        tokens: prev.tokens - action.cost,
      }));
      return true;
    } else {
      setPendingAction(action);
      setShowPricingModal(true);
      return false;
    }
  }, [tokenData.tokens]);

  const upgradePlan = useCallback((plan: PlanType) => {
    setTokenData({
      tokens: PLAN_LIMITS[plan],
      lastResetDate: getTodayDate(),
      plan: plan,
    });
  }, []);

  const getActionCost = useCallback((actionId: string): number => {
    const action = TOKEN_ACTIONS.find((a) => a.id === actionId);
    return action?.cost ?? 0;
  }, []);

  const closePricingModal = useCallback(() => {
    setShowPricingModal(false);
    setPendingAction(null);
  }, []);

  return {
    tokens: tokenData.tokens,
    plan: tokenData.plan,
    dailyLimit: PLAN_LIMITS[tokenData.plan],
    showPricingModal,
    pendingAction,
    canPerformAction,
    consumeTokens,
    upgradePlan,
    getActionCost,
    closePricingModal,
    setShowPricingModal,
  };
};
