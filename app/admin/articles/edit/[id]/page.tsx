"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

export default function AdminEditArticle() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  
  // SEO fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  
  // Author, Image and Category
  const [authorName, setAuthorName] = useState('Admin Team');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>(['AI', 'Technology', 'Lifestyle']);

  // Fetch unique categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, 'articles'));
        const cats = new Set(snap.docs.map(d => d.data().category).filter(Boolean));
        if (cats.size > 0) {
          setAvailableCategories(Array.from(cats) as string[]);
        }
      } catch (e) {
        console.error('Failed to fetch categories', e);
      }
    };
    fetchCategories();
  }, []);

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;
      try {
        const docRef = doc(db, "articles", articleId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setContent(data.content || '');
          setMetaTitle(data.metaTitle || '');
          setMetaDescription(data.metaDescription || '');
          setMetaKeywords(data.metaKeywords || '');
          setAuthorName(data.authorName || 'Admin Team');
          setImageUrl(data.imageUrl || '');
          
          if (availableCategories.includes(data.category)) {
            setCategory(data.category);
          } else {
            // It might be a category that's not in the default list but we just fetched them
            // We can just set it as category since the dropdown will populate from availableCategories
            setCategory(data.category);
          }
        } else {
          alert("Article not found!");
          router.push('/admin/articles');
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, router]);

  // Auto-generate slug and meta title from title ONLY if slug is empty
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
      
      if (!metaTitle) {
        setMetaTitle(title);
      }
    }
  }, [title, slug, metaTitle]);

  const handleUpdate = async () => {
    if (!title || !content || !category) {
      alert("Please fill in Title, Content, and Category");
      return;
    }

    try {
      setIsPublishing(true);
      
      const articleData = {
        title,
        slug,
        content,
        authorName,
        metaTitle: metaTitle || title,
        metaDescription,
        metaKeywords,
        imageUrl,
        category,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(db, "articles", articleId), articleData);
      
      alert("Article updated successfully!");
      router.push('/admin/articles');
    } catch (error) {
      console.error("Error updating article: ", error);
      alert("Failed to update article. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/articles" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Article</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Article Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Enter title here..." 
                />
              </div>
              
              {/* SEO Section inside main editor */}
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white">SEO Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">URL Slug</label>
                  <input 
                    type="text" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="article-url-slug" 
                  />
                  <p className="text-xs text-slate-500 mt-1">Auto-generated from title, but you can edit it.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Meta Title</label>
                  <input 
                    type="text" 
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="SEO Title (50-60 characters)" 
                    maxLength={60}
                  />
                  <p className="text-xs text-slate-500 mt-1">{metaTitle.length}/60 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Meta Description</label>
                  <textarea 
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]" 
                    placeholder="Write a compelling description for search engines (150-160 characters)" 
                    maxLength={160}
                  />
                  <p className="text-xs text-slate-500 mt-1">{metaDescription.length}/160 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Meta Keywords</label>
                  <input 
                    type="text" 
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="tech, ai, future, genz (comma separated)" 
                  />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Content</label>
                <div data-color-mode={currentTheme === 'dark' ? 'dark' : 'light'}>
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || '')}
                    height={500}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Options */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Publish</h3>
            <div className="space-y-3">
              <button 
                onClick={handleUpdate}
                disabled={isPublishing}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isPublishing ? 'Updating...' : 'Update Article'}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Article Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                
                {!isCustomCategory ? (
                  <>
                    <select 
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setIsCustomCategory(true);
                          setCategory('');
                        } else {
                          setCategory(e.target.value);
                        }
                      }}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none mb-2"
                    >
                      <option value="">Select a category</option>
                      {availableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="custom">+ Create New Category</option>
                    </select>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="New Category Name" 
                    />
                    <button 
                      onClick={() => {
                        if (customCategory) {
                          setCategory(customCategory); 
                        }
                        setIsCustomCategory(false);
                      }}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                )}
                {category && !isCustomCategory && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Selected: {category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Author Name</label>
                <input 
                  type="text" 
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="e.g. Admin Team" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Featured Image URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    type="url" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>
                {imageUrl && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 aspect-video relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Featured preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
