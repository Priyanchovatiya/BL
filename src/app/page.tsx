import Dashboard from '../components/Dashboard';
import Header from '../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>
        <Dashboard />
      </main>
    </div>
  );
}
