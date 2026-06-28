import { Metadata } from 'next';
import { getAllPosts } from '@/lib/markdown';
import { BlogCard } from '@/components/blog/BlogCard';

export const metadata: Metadata = {
  title: 'Search Results',
  description: 'Search for articles on GenZBlog.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q.toLowerCase() : '';
  const posts = getAllPosts();
  
  const searchResults = query 
    ? posts.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.description.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
      )
    : [];

  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0a] min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
          Search Results
        </h1>
        {query ? (
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">
            Showing results for <span className="font-bold text-slate-900 dark:text-white">"{query}"</span>
          </p>
        ) : (
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">
            Please enter a search term to find articles.
          </p>
        )}

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          query && (
            <div className="text-center py-20 bg-white dark:bg-[#111] rounded-3xl border border-slate-200/60 dark:border-slate-800/60">
              <p className="text-slate-500 dark:text-slate-400 text-lg">No articles found matching your query.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
