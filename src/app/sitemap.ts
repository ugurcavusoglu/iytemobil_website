import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://iytemobil.com';
  const locales = ['tr', 'en'];

  const staticPages = ['', '/club-application', '/documents', '/privacy-policy'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.7,
        alternates: {
          languages: {
            tr: `${baseUrl}/tr${page}`,
            en: `${baseUrl}/en${page}`,
          },
        },
      });
    }
  }

  return entries;
}
