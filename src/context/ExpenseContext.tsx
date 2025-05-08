'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Transaction, Category, ExpenseStats } from '../types';
import { 
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories, 
  saveCategories, 
  defaultCategories,
  initializeLocalStorage
} from '../utils/localStorage';

interface ExpenseContextType {
  transactions: Transaction[];
  expenses: Transaction[];
  incomes: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  getFinancialStats: () => ExpenseStats;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  // Derived state for expenses and incomes
  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes = transactions.filter(t => t.type === 'income');

  // Initialize local storage and load data
  useEffect(() => {
    initializeLocalStorage();
    setTransactions(getTransactions());
    
    // Ensure categories are always available
    const loadedCategories = getCategories();
    if (loadedCategories.length === 0) {
      saveCategories(defaultCategories);
      setCategories(defaultCategories);
    } else {
      setCategories(loadedCategories);
    }
  }, []);

  // Add a new transaction
  const addTransactionHandler = (transaction: Transaction) => {
    addTransaction(transaction);
    setTransactions(getTransactions());
  };

  // Update an existing transaction
  const updateTransactionHandler = (updatedTransaction: Transaction) => {
    updateTransaction(updatedTransaction);
    setTransactions(getTransactions());
  };

  // Delete a transaction
  const deleteTransactionHandler = (id: string) => {
    deleteTransaction(id);
    setTransactions(getTransactions());
  };

  // Add a new category
  const addCategory = (category: Category) => {
    const updatedCategories = [...categories, category];
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
  };

  // Update an existing category
  const updateCategory = (updatedCategory: Category) => {
    const updatedCategories = categories.map(category => 
      category.id === updatedCategory.id ? updatedCategory : category
    );
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
  };

  // Delete a category
  const deleteCategory = (id: string) => {
    const filteredCategories = categories.filter(category => category.id !== id);
    setCategories(filteredCategories);
    saveCategories(filteredCategories);
  };

  // Calculate financial statistics
  const getFinancialStats = (): ExpenseStats => {
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const balance = totalIncome - totalExpense;
    
    const byCategory = transactions.reduce((acc, transaction) => {
      const { category, amount, type } = transaction;
      // For expenses, store negative values
      const adjustedAmount = type === 'expense' ? -amount : amount;
      acc[category] = (acc[category] || 0) + adjustedAmount;
      return acc;
    }, {} as Record<string, number>);
    
    return { totalExpense, totalIncome, balance, byCategory };
  };

  return (
    <ExpenseContext.Provider value={{
      transactions,
      expenses,
      incomes,
      categories,
      addTransaction: addTransactionHandler,
      updateTransaction: updateTransactionHandler,
      deleteTransaction: deleteTransactionHandler,
      addCategory,
      updateCategory,
      deleteCategory,
      getFinancialStats
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
