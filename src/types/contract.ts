// Contract data types

export interface ClientInfo {
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
}

export interface ContractData {
  client: ClientInfo;
  price: number;
  paymentMethod: string;
  deadline: string;
  startDate: string;
  serviceDescription: string;
  additionalClauses: string[];
  logo: string | null;
}
