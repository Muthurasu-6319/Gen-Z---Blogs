import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { markdownToHtml } from '@/lib/markdown';
import { formatDate } from '@/lib/utils';
import { AdSense } from '@/components/ads/AdSense';
import { Clock } from 'lucide-react';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { NewsletterForm } from '@/components/blog/NewsletterForm';
import { PostEngagement } from '@/components/blog/PostEngagement';
import { ViewCounter } from '@/components/blog/ViewCounter';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { collection, query, where, getDocs, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getRelatedArticles(category: string, currentSlug: string) {
  try {
    const q = query(collection(db, "articles"), where("category", "==", category), limit(4));
    const querySnapshot = await getDocs(q);
    const articles = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: data.slug,
        title: data.title,
        description: data.metaDescription || '',
        category: data.category,
      };
    }).filter(a => a.slug !== currentSlug).slice(0, 2);
    return articles;
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return [];
  }
}

async function getPostFromFirebase(slug: string) {
  try {
    const q = query(collection(db, "articles"), where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    const wordCount = data.content ? data.content.split(' ').length : 0;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    let dateStr = new Date().toISOString();
    if (data.createdAt) {
      if (data.createdAt instanceof Timestamp || data.createdAt.toDate) {
        dateStr = data.createdAt.toDate().toISOString();
      } else {
        dateStr = new Date(data.createdAt).toISOString();
      }
    }

    return {
      id: doc.id,
      title: data.title || '',
      description: data.metaDescription || '',
      content: data.content || '',
      image: data.imageUrl || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
      date: dateStr,
      category: data.category || 'General',
      readingTime: `${readingTimeMinutes} MIN READ`,
      metaKeywords: data.metaKeywords || '',
      authorName: data.authorName || 'Admin Team'
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostFromFirebase(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.metaKeywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['GenZBlog Team'],
      images: [
        {
          url: post.image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const resolvedParams = await params;
  const post = await getPostFromFirebase(resolvedParams.slug);

  if (!post) {
    notFound();
  }
  
  const relatedArticles = await getRelatedArticles(post.category, resolvedParams.slug);

  const contentHtml = await markdownToHtml(post.content);

  // Extract headings and inject IDs into the HTML
  let finalHtml = contentHtml;
  const headings: { text: string; id: string; level: number }[] = [];
  
  finalHtml = finalHtml.replace(/<h([2-3])[^>]*>(.*?)<\/h\1>/gi, (match, level, text) => {
    const rawText = text.replace(/<[^>]+>/g, '').trim();
    const id = rawText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ text: rawText, id, level: parseInt(level) });
    return `<h${level} id="${id}" class="scroll-mt-24 font-bold mt-8 mb-4">${text}</h${level}>`;
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://genzblogs.genzneuralx.com';
  const articleUrl = `${baseUrl}/blog/${resolvedParams.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${articleUrl}/#article`,
        "isPartOf": {
          "@id": `${baseUrl}/#website`
        },
        "headline": post.title,
        "description": post.description,
        "image": post.image,
        "datePublished": post.date,
        "dateModified": post.date, // Add updatedAt if available later
        "author": {
          "@type": "Person",
          "name": post.authorName,
          "url": baseUrl
        },
        "publisher": {
          "@id": `${baseUrl}/#organization`
        },
        "wordCount": post.content.split(' ').length,
        "keywords": post.metaKeywords || post.category,
        "articleSection": post.category,
        "inLanguage": "en-US"
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${articleUrl}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${baseUrl}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": articleUrl
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      {/* Header Section */}
      <div className="pt-20 pb-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-semibold tracking-wide uppercase">
            {post.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            {post.description}
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {post.readingTime}
            </span>
            <ViewCounter slug={resolvedParams.slug} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <article className="lg:w-2/3">
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            <AdSense slotId="in_article_top" format="auto" className="mb-10" />

            {/* Author Info */}
            <div className="flex items-center space-x-4 mb-8 p-6 bg-slate-50 dark:bg-[#111] rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl uppercase">
                {post.authorName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{post.authorName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">GenZBlog Content Creator</p>
              </div>
            </div>

            {/* Markdown Content */}
            <div 
              className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500"
              dangerouslySetInnerHTML={{ __html: finalHtml }}
            />

            <AdSense slotId="in_article_middle" format="auto" className="my-10" />

            {/* Social Share */}
            <ShareButtons title={post.title} slug={resolvedParams.slug} />

            <PostEngagement slug={resolvedParams.slug} />

            <NewsletterForm />

            <AdSense slotId="in_article_bottom" format="auto" className="my-10" />

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Related Articles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedArticles.map(article => (
                    <Link key={article.id} href={`/blog/${article.slug}`} className="p-6 bg-slate-50 dark:bg-[#111] rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group block">
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-bold mb-2 uppercase tracking-wider">{article.category}</p>
                      <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{article.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{article.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-12">
            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 sticky top-24">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">In this article</h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  {headings.map((heading, idx) => (
                    <li key={idx}>
                      <a 
                        href={`#${heading.id}`} 
                        className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${heading.level === 3 ? 'ml-4' : ''}`}
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <AdSense slotId="article_sidebar" format="rectangle" />
          </aside>
        </div>
      </div>
    </div>
  );
}
