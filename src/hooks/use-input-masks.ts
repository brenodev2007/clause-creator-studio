// Funções de máscara para formatação de inputs

export const maskCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, "").slice(0, 11);
  return cleaned
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const maskCNPJ = (value: string): string => {
  const cleaned = value.replace(/\D/g, "").slice(0, 14);
  return cleaned
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

export const maskCPFOrCNPJ = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 11) {
    return maskCPF(value);
  }
  return maskCNPJ(value);
};

export const maskPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, "").slice(0, 11);
  if (cleaned.length <= 10) {
    return cleaned
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return cleaned
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
};

export const maskBankAgency = (value: string): string => {
  const cleaned = value.replace(/\D/g, "").slice(0, 5);
  if (cleaned.length <= 4) {
    return cleaned;
  }
  return cleaned.replace(/(\d{4})(\d{1})$/, "$1-$2");
};

export const maskBankAccount = (value: string): string => {
  const cleaned = value.replace(/\D/g, "").slice(0, 12);
  if (cleaned.length <= 1) {
    return cleaned;
  }
  return cleaned.replace(/(\d+)(\d{1})$/, "$1-$2");
};

export const maskCurrency = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (!cleaned) return "";
  
  const numValue = parseInt(cleaned, 10) / 100;
  return numValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const unmaskCurrency = (value: string): number => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned ? parseInt(cleaned, 10) / 100 : 0;
};
