export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'expense' | 'income';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: 'expense' | 'income' | 'both';
}

export interface ExpenseStats {
  totalExpense: number;
  totalIncome: number;
  balance: number;
  byCategory: Record<string, number>;
}
