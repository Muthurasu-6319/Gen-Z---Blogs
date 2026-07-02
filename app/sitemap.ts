import { MetadataRoute } from 'next';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://genzblogs.genzneuralx.com';
  
  // Static routes
  const routes = ['', '/blog', '/about', '/contact', '/privacy-policy', '/terms-conditions'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic blog routes from Firebase
  let blogRoutes: any[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, 'articles'));
    blogRoutes = querySnapshot.docs.map(doc => {
      const data = doc.data();
      let lastMod = new Date();
      if (data.updatedAt) {
        if (data.updatedAt instanceof Timestamp || data.updatedAt.toDate) {
          lastMod = data.updatedAt.toDate();
        } else {
          lastMod = new Date(data.updatedAt);
        }
      }
      return {
        url: `${baseUrl}/blog/${data.slug}`,
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });
  } catch (e) {
    console.error("Sitemap error:", e);
  }

  return [...routes, ...blogRoutes];
}
