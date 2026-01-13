import { useState, useEffect, useCallback } from "react";
import { ContractData } from "@/types/contract";

export interface SavedContract {
  id: string;
  name: string;
  savedAt: string;
  data: ContractData;
}

const STORAGE_KEY = "contract_history";
const MAX_CONTRACTS = 20;

export function useContractHistory() {
  const [savedContracts, setSavedContracts] = useState<SavedContract[]>([]);

  // Load contracts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedContracts(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  }, []);

  // Save contract to history
  const saveContract = useCallback((data: ContractData, customName?: string) => {
    const name = customName || data.client.name || "Contrato sem nome";
    const newContract: SavedContract = {
      id: crypto.randomUUID(),
      name,
      savedAt: new Date().toISOString(),
      data,
    };

    setSavedContracts((prev) => {
      const updated = [newContract, ...prev].slice(0, MAX_CONTRACTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newContract;
  }, []);

  // Delete contract from history
  const deleteContract = useCallback((id: string) => {
    setSavedContracts((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedContracts([]);
  }, []);

  return {
    savedContracts,
    saveContract,
    deleteContract,
    clearHistory,
  };
}
