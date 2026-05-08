import { useTokensContext } from "../context/TokenContext";

export { TOKEN_ACTIONS, PLAN_LIMITS } from "../context/TokenContext";
export type { PlanType, TokenAction, TokenStorage } from "../context/TokenContext";

export const useTokens = () => {
  const context = useTokensContext();
  
  return {
    ...context,
    plan: "free" as const, // Legacy field, kept for compatibility
    upgradePlan: () => {}, // Legacy field, kept for compatibility
  };
};
