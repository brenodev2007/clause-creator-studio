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

// Validação de CPF usando algoritmo oficial
export const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, "");
  
  if (cleaned.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned[9])) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned[10])) return false;
  
  return true;
};

// Validação de CNPJ usando algoritmo oficial
export const validateCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/\D/g, "");
  
  if (cleaned.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleaned)) return false;
  
  // Validação do primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned[i]) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(cleaned[12])) return false;
  
  // Validação do segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned[i]) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(cleaned[13])) return false;
  
  return true;
};

// Valida CPF ou CNPJ baseado no tamanho
export const validateCPFOrCNPJ = (document: string): { valid: boolean; type: 'cpf' | 'cnpj' | 'incomplete' } => {
  const cleaned = document.replace(/\D/g, "");
  
  if (cleaned.length < 11) {
    return { valid: true, type: 'incomplete' }; // Ainda digitando
  }
  
  if (cleaned.length === 11) {
    return { valid: validateCPF(document), type: 'cpf' };
  }
  
  if (cleaned.length === 14) {
    return { valid: validateCNPJ(document), type: 'cnpj' };
  }
  
  return { valid: true, type: 'incomplete' }; // Entre 11 e 14 dígitos
};
