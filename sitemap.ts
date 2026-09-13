import { MetadataRoute } from 'next';
import { API_URL } from '@/lib/config';

// Next.js otomatis serve ini di /sitemap.xml
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://animein.example.com';
  const res = await fetch(`${API_URL}/anime?limit=1000`, { next: { revalidate: 3600 } });
  const data = res.ok ? await res.json() : { items: [] };

  const animeUrls = (data.items || []).map((a: any) => ({
    url: `${siteUrl}/anime/${a.slug}`,
    lastModified: new Date(a.updatedAt || Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/anime`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...animeUrls,
  ];
}
