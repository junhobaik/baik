import { Article } from '@baik/types';
import { MetadataRoute } from 'next';

import api from '@/api';
import { variables } from '@/configs';

const fetchArticles = async (): Promise<Article[]> => {
  const res = await api.server.archive.getAllArticlesPublic();
  return res.data?.items ?? [];
};

const generateArticleEntry = (article: Article): MetadataRoute.Sitemap[number] | null => {
  if (article.type === 'clip') return null;

  const url = `${variables.SITE_URL_PRD}/${article.pathname}`;

  const entry: MetadataRoute.Sitemap[number] = {
    url: url,
    lastModified: new Date(article.updated_date).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7,
  };

  if (article.intl?.en) {
    entry.alternates = {
      languages: {
        ko: url,
        en: `${variables.SITE_URL_PRD}/en/${article.pathname}`,
      },
    };
  }

  return entry;
};

const generateStaticPages = (): MetadataRoute.Sitemap => [
  {
    url: variables.SITE_URL_PRD,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 1,
    alternates: {
      languages: {
        ko: variables.SITE_URL_PRD,
        en: `${variables.SITE_URL_PRD}/en`,
      },
    },
  },
];

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const articles = await fetchArticles();
  const articleEntries = articles.flatMap((article) => {
    const entry = generateArticleEntry(article);
    if (!entry) return [];

    if (article.intl?.en) {
      const enEntry: MetadataRoute.Sitemap[number] = {
        url: `${variables.SITE_URL_PRD}/en/${article.pathname}`,
        lastModified: entry.lastModified,
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
        alternates: entry.alternates,
      };
      return [entry, enEntry];
    }
    return [entry];
  });
  const staticPages = generateStaticPages();

  return [...staticPages, ...articleEntries];
};

export default sitemap;
