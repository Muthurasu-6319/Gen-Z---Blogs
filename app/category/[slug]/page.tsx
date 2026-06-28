"use client";

import { useEffect, useState, use } from 'react';
import { BlogCard } from '@/components/blog/BlogCard';
import { Search } from 'lucide-react';
import { AdSense } from '@/components/ads/AdSense';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: Props) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug.toLowerCase();
  // Decode URL encoded characters (e.g. %20 to space)
  const categoryName = decodeURIComponent(slug).charAt(0).toUpperCase() + decodeURIComponent(slug).slice(1);

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = ['All', 'AI', 'Technology', 'Programming', 'Tutorials', 'Online Earning'];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedArticles: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Check category match
          const dbCategory = (data.category || '').toLowerCase();
          const targetCategory = decodeURIComponent(slug).toLowerCase();
          
          if (dbCategory === targetCategory) {
            // Calculate reading time
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
          }
        });
        setPosts(fetchedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [slug]);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0a] min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
            {categoryName}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Explore all our insightful articles related to {categoryName}.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Categories */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide space-x-2">
            {categories.map((cat) => {
              const isActive = cat.toLowerCase() === categoryName.toLowerCase();
              return (
                <Link 
                  href={cat === 'All' ? '/blog' : `/category/${cat.toLowerCase().replace(' ', '-')}`}
                  key={cat}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
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
              placeholder={`Search in ${categoryName}...`}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-full leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
            />
          </div>
        </div>

        <AdSense slotId="category_top" format="auto" className="mb-12" />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">No articles found matching your search.</p>
            <Link href="/blog" className="text-blue-600 hover:underline">Return to all blogs</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <AdSense slotId="category_bottom" format="auto" className="mt-16" />
      </div>
    </div>
  );
}
