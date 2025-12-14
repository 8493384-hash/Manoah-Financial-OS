export interface Transaction {
  id: number;
  date: string;
  merchant: string;
  amount: number;
  currency: string;
  note?: string;
}

export interface Payment {
  id: number;
  date: string;
  amount: number;
  currency: string;
  type: string;
  note?: string;
}

export interface FinancialItem {
  id: number;
  amount: number;
  original_amount: number;
  currency: string;
  status: string;
  date: string;
  note?: string;
  payments: Payment[];
  
  // Receivable specific
  name?: string;

  // Liability specific
  creditor?: string;
  type?: string;
  charge_day?: number;
  bank_name?: string;
  loan_number?: string;
  card_digits?: string;
  monthly_payment?: number;
  installments_total?: number;
  installments_paid?: number;
  interest_type?: string;
  interest_rate?: number;
  loan_margin?: number;
  start_date?: string;
  transactions?: Transaction[];
}

export interface ChargeToReview {
  id: number;
  merchant: string;
  amount: number | string;
  currency: string;
  date: string;
  card: string;
  status: string;
  note: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface AiInsight {
  type: string;
  text: string;
  icon: any;
  color: string;
}