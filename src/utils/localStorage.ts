import { Transaction, Category } from '../types';

// Default categories
export const defaultCategories: Category[] = [
  // Expense categories
  { id: '1', name: 'Food', color: '#FF5733', type: 'expense' },
  { id: '2', name: 'Transportation', color: '#33A8FF', type: 'expense' },
  { id: '3', name: 'Entertainment', color: '#B033FF', type: 'expense' },
  { id: '4', name: 'Housing', color: '#4FD1C5', type: 'expense' },
  { id: '5', name: 'Utilities', color: '#FFD433', type: 'expense' },
  { id: '6', name: 'Healthcare', color: '#FF33A8', type: 'expense' },
  { id: '7', name: 'Shopping', color: '#33FFF5', type: 'expense' },
  { id: '8', name: 'Other Expense', color: '#808080', type: 'expense' },
  
  // Income categories
  { id: '9', name: 'Salary', color: '#319795', type: 'income' },
  { id: '10', name: 'Freelance', color: '#38B2AC', type: 'income' },
  { id: '11', name: 'Investments', color: '#2C7A7B', type: 'income' },
  { id: '12', name: 'Gifts', color: '#285E61', type: 'income' },
  { id: '13', name: 'Other Income', color: '#234E52', type: 'income' },
];

// Local storage keys
const TRANSACTIONS_KEY = 'transactions';
const CATEGORIES_KEY = 'categories';

// Function to get transactions from local storage
export const getTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return [];
  
  const storedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
  return storedTransactions ? JSON.parse(storedTransactions) : [];
};

// Function to save transactions to local storage
export const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

// Function to add a new transaction
export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  saveTransactions([...transactions, transaction]);
};

// Function to update a transaction
export const updateTransaction = (updatedTransaction: Transaction): void => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.map(transaction => 
    transaction.id === updatedTransaction.id ? updatedTransaction : transaction
  );
  saveTransactions(updatedTransactions);
};

// Function to delete a transaction
export const deleteTransaction = (id: string): void => {
  const transactions = getTransactions();
  const filteredTransactions = transactions.filter(transaction => transaction.id !== id);
  saveTransactions(filteredTransactions);
};

// Helper functions to get expenses and incomes
export const getExpenses = (): Transaction[] => {
  return getTransactions().filter(transaction => transaction.type === 'expense');
};

export const getIncomes = (): Transaction[] => {
  return getTransactions().filter(transaction => transaction.type === 'income');
};

// Function to get categories from local storage
export const getCategories = (): Category[] => {
  if (typeof window === 'undefined') return defaultCategories;
  
  const storedCategories = localStorage.getItem(CATEGORIES_KEY);
  return storedCategories ? JSON.parse(storedCategories) : defaultCategories;
};

// Function to save categories to local storage
export const saveCategories = (categories: Category[]): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

// Function to add a new category
export const addCategory = (category: Category): void => {
  const categories = getCategories();
  saveCategories([...categories, category]);
};

// Function to update a category
export const updateCategory = (updatedCategory: Category): void => {
  const categories = getCategories();
  const updatedCategories = categories.map(category => 
    category.id === updatedCategory.id ? updatedCategory : category
  );
  saveCategories(updatedCategories);
};

// Function to delete a category
export const deleteCategory = (id: string): void => {
  const categories = getCategories();
  const filteredCategories = categories.filter(category => category.id !== id);
  saveCategories(filteredCategories);
};

// Initialize local storage with default data
export const initializeLocalStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    saveCategories(defaultCategories);
  }
  
  if (!localStorage.getItem(TRANSACTIONS_KEY)) {
    saveTransactions([]);
  }
};
