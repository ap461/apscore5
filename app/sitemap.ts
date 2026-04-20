import { MetadataRoute } from 'next';
import { createClient } from '@/prismicio';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://apscore5.com';

  // Static pages - always included
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/ap-biology`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/ap-human-geography`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/ap-computer-science-principles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/practice`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic pages from Prismic
  try {
    const client = createClient();

    // Fetch all published documents from Prismic
    const [unitPages, topicPages] = await Promise.all([
      client.getAllByType('unit_page').catch(() => []),
      client.getAllByType('topic_blog').catch(() => []),
    ]);

    const unitSitemapEntries: MetadataRoute.Sitemap = unitPages.map((doc) => ({
      url: `${baseUrl}/${doc.uid}`,
      lastModified: new Date(doc.last_publication_date),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const topicSitemapEntries: MetadataRoute.Sitemap = topicPages.map((doc) => ({
      url: `${baseUrl}/${doc.uid}`,
      lastModified: new Date(doc.last_publication_date),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...unitSitemapEntries, ...topicSitemapEntries];
  } catch {
    // If Prismic is unavailable, return static pages only
    return staticPages;
  }
}