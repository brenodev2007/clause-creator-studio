import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "contract-tokens";
const INITIAL_TOKENS = 10;

export interface TokenAction {
  id: string;
  name: string;
  cost: number;
}

export const TOKEN_ACTIONS: TokenAction[] = [
  { id: "save-contract", name: "Salvar contrato", cost: 1 },
  { id: "export-pdf", name: "Exportar PDF", cost: 3 },
  { id: "apply-template", name: "Aplicar modelo", cost: 1 },
  { id: "load-contract", name: "Carregar contrato", cost: 1 },
];

export const useTokens = () => {
  const [tokens, setTokens] = useState<number>(() => {
    if (typeof window === "undefined") return INITIAL_TOKENS;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : INITIAL_TOKENS;
  });
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<TokenAction | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, tokens.toString());
  }, [tokens]);

  const canPerformAction = useCallback((actionId: string): boolean => {
    const action = TOKEN_ACTIONS.find((a) => a.id === actionId);
    if (!action) return true;
    return tokens >= action.cost;
  }, [tokens]);

  const consumeTokens = useCallback((actionId: string): boolean => {
    const action = TOKEN_ACTIONS.find((a) => a.id === actionId);
    if (!action) return true;

    if (tokens >= action.cost) {
      setTokens((prev) => prev - action.cost);
      return true;
    } else {
      setPendingAction(action);
      setShowPricingModal(true);
      return false;
    }
  }, [tokens]);

  const addTokens = useCallback((amount: number) => {
    setTokens((prev) => prev + amount);
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
    tokens,
    showPricingModal,
    pendingAction,
    canPerformAction,
    consumeTokens,
    addTokens,
    getActionCost,
    closePricingModal,
    setShowPricingModal,
  };
};
