import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "contract-tokens-v2";

export type PlanType = "free" | "pro" | "unlimited";

export interface TokenAction {
  id: string;
  name: string;
  cost: number;
}

export interface TokenStorage {
  tokens: number;
  lastResetDate: string;
}

export const TOKEN_ACTIONS: TokenAction[] = [
  { id: "save-contract", name: "Salvar contrato", cost: 0 },
  { id: "load-contract", name: "Carregar contrato", cost: 0 },
  { id: "apply-template", name: "Aplicar modelo", cost: 0 },
  { id: "export-pdf", name: "Exportar PDF", cost: 10 },
];

export const PLAN_LIMITS: Record<PlanType, number> = {
  free: 10,
  pro: 50,
  unlimited: 999999,
};

const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const useTokens = () => {
  const { user } = useAuth();
  
  const getStoredData = useCallback((): TokenStorage => {
    const defaultTokens = user?.daily_tokens ?? 20;
    
    if (typeof window === "undefined") {
      return { tokens: defaultTokens, lastResetDate: getTodayDate() };
    }

    const stored = localStorage.getItem(STORAGE_KEY + (user?.id || ''));
    if (!stored) {
      return { tokens: defaultTokens, lastResetDate: getTodayDate() };
    }

    try {
      const data: TokenStorage = JSON.parse(stored);
      const today = getTodayDate();
      
      // Check if we need to reset tokens (new day)
      if (data.lastResetDate !== today) {
        return { tokens: defaultTokens, lastResetDate: today };
      }
      return data;
    } catch {
      return { tokens: defaultTokens, lastResetDate: getTodayDate() };
    }
  }, [user]);

  const [tokenData, setTokenData] = useState<TokenStorage>(getStoredData());
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<TokenAction | null>(null);

  // Sync tokenData when user daily_tokens changes or on mount
  useEffect(() => {
    setTokenData(getStoredData());
  }, [getStoredData]);

  // Save to localStorage whenever tokenData changes
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      localStorage.setItem(STORAGE_KEY + user.id, JSON.stringify(tokenData));
    }
  }, [tokenData, user]);

  // Check for daily reset periodically
  useEffect(() => {
    const checkReset = () => {
      const today = getTodayDate();
      if (tokenData.lastResetDate !== today) {
        setTokenData({
          tokens: user?.daily_tokens ?? 20,
          lastResetDate: today,
        });
      }
    };

    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, [tokenData.lastResetDate, user]);

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
    // Legacy function, kept to not break anything if used elsewhere
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
    plan: "free" as PlanType,
    dailyLimit: user?.daily_tokens ?? 20,
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
