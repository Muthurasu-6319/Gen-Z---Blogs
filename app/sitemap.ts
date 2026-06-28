import { MetadataRoute } from 'next';
import { getPostSlugs } from '@/lib/markdown';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://genzblog.example.com';
  
  // Static routes
  const routes = ['', '/blog', '/about', '/contact', '/privacy-policy', '/terms-conditions'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic blog routes
  const slugs = getPostSlugs();
  const blogRoutes = slugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug.replace(/\.md$/, '')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...blogRoutes];
}
