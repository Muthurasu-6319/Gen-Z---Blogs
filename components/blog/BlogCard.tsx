import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <article className={`group flex flex-col justify-between bg-white dark:bg-[#111] rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 ${featured ? 'md:flex-row' : ''}`}>
      <Link href={`/blog/${post.slug}`} className={`relative block overflow-hidden ${featured ? 'md:w-1/2' : 'w-full aspect-[4/3] sm:aspect-[16/10]'}`}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority={featured}
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider shadow-sm">
          {post.category}
        </div>
      </Link>
      
      <div className={`p-6 sm:p-8 flex flex-col justify-between ${featured ? 'md:w-1/2 md:p-12 md:justify-center' : ''}`}>
        <div>
          <div className="flex items-center space-x-4 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-4">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              {post.readingTime}
            </span>
          </div>
          
          <Link href={`/blog/${post.slug}`}>
            <h3 className={`font-extrabold text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 dark:group-hover:from-blue-400 dark:group-hover:to-indigo-400 transition-all duration-300 ${featured ? 'text-3xl md:text-4xl mb-4 leading-tight' : 'text-xl sm:text-2xl mb-3 leading-snug line-clamp-2'}`}>
              {post.title}
            </h3>
          </Link>
          
          <p className={`text-slate-600 dark:text-slate-400 ${featured ? 'text-lg mb-8 line-clamp-3' : 'mb-6 line-clamp-2 text-sm sm:text-base'}`}>
            {post.description}
          </p>
        </div>
        
        <Link 
          href={`/blog/${post.slug}`}
          className="inline-flex items-center font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-auto"
        >
          Read article 
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}
