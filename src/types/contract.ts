// Contract data types

export interface ClientInfo {
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
}

export interface ContractorInfo {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  bankName: string;
  bankAgency: string;
  bankAccount: string;
  pixKey: string;
}

export interface ContractData {
  client: ClientInfo;
  contractor: ContractorInfo;
  price: number;
  paymentMethod: string;
  deadline: string;
  startDate: string;
  serviceDescription: string;
  additionalClauses: string[];
  logo: string | null;
}
