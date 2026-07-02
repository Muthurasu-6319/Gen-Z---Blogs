import { collection, getDocs, query, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://genzblogs.genzneuralx.com';
  
  let articles: any[] = [];
  try {
    // Fetching the latest 20 articles for the RSS feed
    const q = query(collection(db, 'articles'), limit(20));
    const querySnapshot = await getDocs(q);
    
    articles = querySnapshot.docs.map(doc => {
      const data = doc.data();
      let dateStr = new Date().toUTCString();
      if (data.createdAt) {
        if (data.createdAt instanceof Timestamp || data.createdAt.toDate) {
          dateStr = data.createdAt.toDate().toUTCString();
        } else {
          dateStr = new Date(data.createdAt).toUTCString();
        }
      }
      return {
        title: data.title || 'Untitled',
        slug: data.slug,
        description: data.metaDescription || '',
        date: dateStr,
        author: data.authorName || 'GenZBlog Team'
      };
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
  }

  const itemsXml = articles.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${SITE_URL}/blog/${article.slug}</link>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${article.date}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/blog/${article.slug}</guid>
      <author>${article.author}</author>
    </item>
  `).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GenZ Articles</title>
    <link>${SITE_URL}</link>
    <description>Modern Insights for the New Generation</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
