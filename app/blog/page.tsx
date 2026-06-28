"use client";

import { BlogCard } from '@/components/blog/BlogCard';
import { Search } from 'lucide-react';
import { AdSense } from '@/components/ads/AdSense';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function BlogListing() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedArticles: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Calculate reading time roughly based on content
          const wordCount = data.content ? data.content.split(' ').length : 0;
          const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

          // Format date safely
          let dateStr = new Date().toISOString();
          if (data.createdAt) {
            if (data.createdAt instanceof Timestamp || data.createdAt.toDate) {
              dateStr = data.createdAt.toDate().toISOString();
            } else {
              dateStr = new Date(data.createdAt).toISOString();
            }
          }

          fetchedArticles.push({ 
            id: doc.id, 
            title: data.title || '',
            slug: data.slug || '',
            category: data.category || 'General',
            image: data.imageUrl || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
            description: data.metaDescription || 'Read our latest insights and tutorials on the blog.',
            date: dateStr,
            readingTime: `${readingTimeMinutes} MIN READ`,
            ...data 
          });
        });
        setPosts(fetchedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const categories = ['All', 'AI', 'Technology', 'Programming', 'Tutorials', 'Online Earning'];

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
            Our Latest Insights
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Discover articles, tutorials, and insights designed to help you stay ahead of the curve.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Categories */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide space-x-2">
            {categories.map((cat) => (
              <Link 
                href={cat === 'All' ? '/blog' : `/category/${cat.toLowerCase().replace(' ', '-')}`}
                key={cat}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  cat === 'All' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-full leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
            />
          </div>
        </div>

        <AdSense slotId="blog_list_top" format="auto" className="mb-12" />

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full py-20 flex justify-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))
          )}
        </div>

        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No articles found.</p>
          </div>
        )}

        {/* Pagination (Static UI for demo) */}
        {!loading && filteredPosts.length > 0 && (
          <div className="mt-16 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-md text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50">
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium shadow-sm">
                1
              </button>
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900">
                2
              </button>
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900">
                Next
              </button>
            </nav>
          </div>
        )}

        <AdSense slotId="blog_list_bottom" format="auto" className="mt-16" />
      </div>
    </div>
  );
}
