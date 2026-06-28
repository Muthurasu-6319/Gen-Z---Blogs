"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, writeBatch, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Edit2, Trash2, X, Check, Tags } from 'lucide-react';

interface CategoryData {
  name: string;
  count: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'articles'));
      const categoryCounts: Record<string, number> = {};
      
      snap.docs.forEach(document => {
        const cat = document.data().category;
        if (cat) {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
      });

      const catsArray = Object.keys(categoryCounts).map(name => ({
        name,
        count: categoryCounts[name]
      })).sort((a, b) => b.count - a.count);

      setCategories(catsArray);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditStart = (categoryName: string) => {
    setEditingCategory(categoryName);
    setNewCategoryName(categoryName);
  };

  const handleEditCancel = () => {
    setEditingCategory(null);
    setNewCategoryName('');
  };

  const handleEditSave = async (oldName: string) => {
    if (!newCategoryName || newCategoryName === oldName) {
      handleEditCancel();
      return;
    }

    if (confirm(`Are you sure you want to rename "${oldName}" to "${newCategoryName}"? This will update all associated articles.`)) {
      try {
        const batch = writeBatch(db);
        const q = query(collection(db, 'articles'), where("category", "==", oldName));
        const snap = await getDocs(q);
        
        snap.forEach(document => {
          batch.update(doc(db, 'articles', document.id), {
            category: newCategoryName
          });
        });

        await batch.commit();
        alert(`Successfully renamed category to ${newCategoryName}`);
        handleEditCancel();
        fetchCategories();
      } catch (error) {
        console.error("Error updating category:", error);
        alert("Failed to update category.");
      }
    }
  };

  const handleDelete = async (categoryName: string) => {
    if (confirm(`Are you sure you want to delete the category "${categoryName}"? All articles in this category will be marked as "Uncategorized".`)) {
      try {
        const batch = writeBatch(db);
        const q = query(collection(db, 'articles'), where("category", "==", categoryName));
        const snap = await getDocs(q);
        
        snap.forEach(document => {
          batch.update(doc(db, 'articles', document.id), {
            category: "Uncategorized"
          });
        });

        await batch.commit();
        alert(`Successfully deleted category "${categoryName}"`);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Categories</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View, edit, and delete existing categories</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <Tags className="w-5 h-5 mr-2 text-purple-500" />
            All Categories
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No categories found. Start creating articles!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Category Name</th>
                  <th className="px-6 py-4 font-medium">Articles Count</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {categories.map((cat) => (
                  <tr key={cat.name} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                      {editingCategory === cat.name ? (
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-sm w-full max-w-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-purple-500 mr-3"></span>
                          {cat.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold">
                        {cat.count} {cat.count === 1 ? 'Article' : 'Articles'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingCategory === cat.name ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditSave(cat.name)}
                            className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Save"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditStart(cat.name)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.name)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
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
