import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Mail } from 'lucide-react';
import { getAllPosts } from '@/lib/markdown';
import { BlogCard } from '@/components/blog/BlogCard';
import { AdSense } from '@/components/ads/AdSense';
import { HomeNewsletterForm } from '@/components/home/HomeNewsletterForm';

export default function Home() {
  const posts = getAllPosts();
  const featuredPost = posts[0];
  const latestPosts = posts.slice(1, 7);

  const categories = [
    { name: 'AI', count: 12 },
    { name: 'Technology', count: 18 },
    { name: 'Programming', count: 24 },
    { name: 'Tutorials', count: 15 },
    { name: 'Online Earning', count: 8 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden flex items-center justify-center min-h-[60vh]">
        {/* Modern grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-30">
           <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[120px] mix-blend-screen" />
           <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[120px] mix-blend-screen" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium text-slate-800 dark:text-slate-200 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
            <span>Powered by Gen Z Neural X</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.1]">
            Insights for the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 drop-shadow-sm">
              Modern Generation
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-2xl text-slate-600 dark:text-slate-400 mb-12 font-medium">
            Explore world-class articles on technology, design, career, and the future. Built for forward-thinking individuals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              href="/blog" 
              className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-full font-bold transition-all duration-300 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center group w-full sm:w-auto justify-center text-lg"
            >
              Start Reading
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#newsletter" 
              className="px-8 py-4 bg-white/50 dark:bg-white/5 backdrop-blur-md text-slate-900 dark:text-white rounded-full font-bold border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 w-full sm:w-auto justify-center flex items-center text-lg"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </section>

      {/* Header Ad - Below Hero */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdSense slotId="home_below_hero" format="auto" />
      </div>

      {/* Featured Article */}
      {featuredPost && (
        <section className="py-12 bg-white dark:bg-[#0a0a0a]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Featured Article</h2>
            </div>
            <BlogCard post={featuredPost} featured />
          </div>
        </section>
      )}
      
      {/* Ad Between Featured and Latest */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdSense slotId="home_between_sections" format="auto" />
      </div>

      {/* Latest Articles & Sidebar */}
      <section className="py-16 bg-slate-50 dark:bg-[#111]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Latest Articles</h2>
                <Link href="/blog" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline hidden sm:block">
                  View all &rarr;
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {latestPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
              
              {latestPosts.length === 0 && (
                <p className="text-slate-500 dark:text-slate-400 text-center py-12">More articles coming soon!</p>
              )}
              
              <div className="mt-8 sm:hidden">
                 <Link href="/blog" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline block text-center">
                  View all articles &rarr;
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/3 space-y-12">
              {/* Categories */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Categories</h3>
                <ul className="space-y-4">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <Link 
                        href={`/blog?category=${category.name.toLowerCase()}`}
                        className="flex items-center justify-between group"
                      >
                        <span className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-medium">
                          {category.name}
                        </span>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 py-1 px-3 rounded-full text-xs font-semibold group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400 transition-colors">
                          {category.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Articles */}
              <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Popular Articles</h3>
                <div className="space-y-6">
                  {latestPosts.slice(0, 3).map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="flex gap-4 group">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={post.image} alt={post.title} fill sizes="80px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </h4>
                        <span className="text-xs text-slate-500 mt-2">{post.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar Ad */}
              <div className="sticky top-24">
                <AdSense slotId="home_sidebar" format="rectangle" className="h-[250px]" />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-3xl" />
            
            <Mail className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the loop</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Get the latest insights, trends, and career advice delivered straight to your inbox every week. No spam, just value.
            </p>
            
            <HomeNewsletterForm />
          </div>
        </div>
      </section>
      
      {/* Footer Ad */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <AdSense slotId="home_footer" format="auto" />
      </div>
    </div>
  );
}
