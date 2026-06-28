"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

export default function AdminCreateArticle() {
  const router = useRouter();
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
  const [isFeatured, setIsFeatured] = useState(false);

  // Auto-generate slug and meta title from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
      
      if (!metaTitle) {
        setMetaTitle(title);
      }
    } else {
      setSlug('');
    }
  }, [title]);

  const handlePublish = async () => {
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
        isFeatured,
        status: 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "articles"), articleData);
      
      // Trigger Newsletter Email
      try {
        fetch('/api/send-newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            slug,
            description: metaDescription
          })
        });
        // We don't await this because we want to return immediately and let it send in the background
      } catch (e) {
        console.error("Failed to trigger newsletter", e);
      }

      alert("Article published successfully!");
      router.push('/admin/articles');
    } catch (error) {
      console.error("Error publishing article: ", error);
      alert("Failed to publish article. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/articles" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Write New Article</h1>
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
              <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium transition-colors">
                Save as Draft
              </button>
              <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isPublishing ? 'Publishing...' : 'Publish Article'}
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
                      <option value="AI">AI</option>
                      <option value="Technology">Technology</option>
                      <option value="Lifestyle">Lifestyle</option>
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

              <div>
                <label className="flex items-center space-x-3 mt-4">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Mark as Featured Article</span>
                </label>
                <p className="text-xs text-slate-500 mt-1 ml-8">Featured articles will appear at the top of the Home Page.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
