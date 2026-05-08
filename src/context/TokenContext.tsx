import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

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

interface TokenContextType {
  tokens: number;
  dailyLimit: number;
  showPricingModal: boolean;
  pendingAction: TokenAction | null;
  canPerformAction: (actionId: string) => boolean;
  consumeTokens: (actionId: string) => boolean;
  getActionCost: (actionId: string) => number;
  closePricingModal: () => void;
  setShowPricingModal: (show: boolean) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  useEffect(() => {
    setTokenData(getStoredData());
  }, [getStoredData]);

  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      localStorage.setItem(STORAGE_KEY + user.id, JSON.stringify(tokenData));
    }
  }, [tokenData, user]);

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

  const getActionCost = useCallback((actionId: string): number => {
    const action = TOKEN_ACTIONS.find((a) => a.id === actionId);
    return action?.cost ?? 0;
  }, []);

  const closePricingModal = useCallback(() => {
    setShowPricingModal(false);
    setPendingAction(null);
  }, []);

  return (
    <TokenContext.Provider
      value={{
        tokens: tokenData.tokens,
        dailyLimit: user?.daily_tokens ?? 20,
        showPricingModal,
        pendingAction,
        canPerformAction,
        consumeTokens,
        getActionCost,
        closePricingModal,
        setShowPricingModal,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokensContext = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useTokensContext must be used within a TokenProvider");
  }
  return context;
};
