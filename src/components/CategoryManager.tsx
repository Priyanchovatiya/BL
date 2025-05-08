'use client';

import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Category } from '../types';

export default function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useExpenses();
  
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    color: '#808080'
  });
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      setError('Category name is required');
      return;
    }
    
    // Check if category name already exists
    if (categories.some(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
      setError('Category with this name already exists');
      return;
    }
    
    addCategory({
      id: crypto.randomUUID(),
      name: newCategory.name,
      color: newCategory.color
    });
    
    setNewCategory({
      name: '',
      color: '#808080'
    });
    
    setError('');
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCategory || !editingCategory.name.trim()) {
      setError('Category name is required');
      return;
    }
    
    // Check if category name already exists (excluding the current category)
    if (categories.some(cat => 
      cat.id !== editingCategory.id && 
      cat.name.toLowerCase() === editingCategory.name.toLowerCase()
    )) {
      setError('Category with this name already exists');
      return;
    }
    
    updateCategory(editingCategory);
    setEditingCategory(null);
    setError('');
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will not delete associated expenses, but they will show as "Unknown" category.')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Add New Category Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Add New Category</h2>
        
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter category name"
            />
          </div>
          
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color
            </label>
            <div className="flex items-center mt-1">
              <input
                type="color"
                id="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                className="h-10 w-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {newCategory.color}
              </span>
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Category
          </button>
        </form>
      </div>
      
      {/* Edit Category Form */}
      {editingCategory && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Edit Category</h2>
          
          <form onSubmit={handleUpdateCategory} className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category Name
              </label>
              <input
                type="text"
                id="edit-name"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter category name"
              />
            </div>
            
            <div>
              <label htmlFor="edit-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Color
              </label>
              <div className="flex items-center mt-1">
                <input
                  type="color"
                  id="edit-color"
                  value={editingCategory.color}
                  onChange={(e) => setEditingCategory(prev => prev ? { ...prev, color: e.target.value } : null)}
                  className="h-10 w-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {editingCategory.color}
                </span>
              </div>
            </div>
            
            {error && <p className="text-sm text-red-600">{error}</p>}
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update
              </button>
              
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Categories List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white p-6 pb-4">Categories</h2>
        
        {categories.length === 0 ? (
          <p className="px-6 pb-6 text-gray-500 dark:text-gray-400">No categories found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Color
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="w-6 h-6 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
