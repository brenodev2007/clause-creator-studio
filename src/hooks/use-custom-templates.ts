import { useState, useEffect, useCallback } from "react";
import { ContractTemplate } from "@/data/contractTemplates";
import { ContractData } from "@/types/contract";

const STORAGE_KEY = "custom_templates";

export function useCustomTemplates() {
  const [customTemplates, setCustomTemplates] = useState<ContractTemplate[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCustomTemplates(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading custom templates:", error);
    }
  }, []);

  const saveTemplate = useCallback((data: ContractData, name: string, description: string = "Modelo personalizado") => {
    const newTemplate: ContractTemplate = {
      id: `custom-${crypto.randomUUID()}`,
      name,
      description,
      defaultServiceDescription: data.serviceDescription,
      clauses: data.additionalClauses,
    };

    setCustomTemplates((prev) => {
      const updated = [newTemplate, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newTemplate;
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setCustomTemplates((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    customTemplates,
    saveTemplate,
    deleteTemplate,
  };
}
