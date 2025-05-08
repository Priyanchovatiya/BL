'use client';

import Header from '../../components/Header';
import ExpenseList from '../../components/ExpenseList';

export default function ExpensesPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Expenses</h1>
        <ExpenseList />
      </main>
    </div>
  );
}
