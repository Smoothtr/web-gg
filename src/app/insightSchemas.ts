import { siteUrl } from '../brandContent'
import type { ServerInsightPost } from '../cms/serverRepository'

export function buildInsightsIndexSchema(posts: ServerInsightPost[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${siteUrl}/insights#blog`,
    name: 'Insights from The One - GG99',
    url: `${siteUrl}/insights`,
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${siteUrl}/insights/${post.slug}`,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
    })),
  }
}

export function buildInsightArticleSchema(post: ServerInsightPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${siteUrl}/insights/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.startsWith('http') ? post.coverImage : `${siteUrl}${post.coverImage}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      '@type': 'Organization',
      name: 'GG99',
      url: siteUrl,
    },
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    mainEntityOfPage: `${siteUrl}/insights/${post.slug}`,
  }
}

export function buildInsightBreadcrumbSchema(post: ServerInsightPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'The One - GG99',
        item: `${siteUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Insights',
        item: `${siteUrl}/insights`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${siteUrl}/insights/${post.slug}`,
      },
    ],
  }
}
