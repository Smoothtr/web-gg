import type { CmsBlock, CmsBlockItem } from '../cms/types'
import { normalizePhinoiText, PHINOI_DISPLAY_NAME } from '../lib/brandNames'
import { caseStudies, type CaseStudy } from './caseStudies'

const caseStudiesById = new Map(caseStudies.map((story) => [story.id.toLowerCase(), story]))
const caseStudiesByBrandName = new Map(caseStudies.map((story) => [story.brandName.toLowerCase(), story]))
const phinoiFallback = caseStudiesById.get('phinoi')
if (phinoiFallback) {
  caseStudiesByBrandName.set('phinoi', phinoiFallback)
  caseStudiesByBrandName.set('phi noi', phinoiFallback)
}

export function storyFromCmsItem(item: CmsBlockItem) {
  const candidates = [item.href, item.id, item.title, item.label]
    .map((value) => normalizePhinoiText(String(value || '').trim()).toLowerCase())
    .filter(Boolean)

  for (const candidate of candidates) {
    const fallback = caseStudiesById.get(candidate) ?? caseStudiesByBrandName.get(candidate)
    if (fallback) {
      const isPhinoi = fallback.id === 'phinoi'
      const normalizeStoryText = (value: string) => (isPhinoi ? normalizePhinoiText(value) : value)
      const services = (item.services ?? []).map((service) => service.trim()).filter(Boolean)
      const hasCmsMetrics = Array.isArray(item.keyMetrics)
      const cmsMetrics = (item.keyMetrics ?? []).slice(0, 10).map((metric) => ({
        value: metric.value ?? '',
        label: metric.label ?? '',
        shortLabel: metric.shortLabel ?? '',
        featured: metric.featured,
        slide: metric.slide,
        display: metric.display,
        tileAnchor: metric.tileAnchor,
        from: metric.from,
        to: metric.to,
        benchmarkLabel: metric.benchmarkLabel,
        benchmarkValue: metric.benchmarkValue,
        percent: metric.percent,
        series: metric.series,
        chartCaption: metric.chartCaption,
      }))
      // Once the CMS supplies the metric collection it is authoritative, including
      // an intentionally empty collection. Do not resurrect deleted fallback KPIs.
      const keyMetrics = hasCmsMetrics
        ? cmsMetrics.filter((metric) => metric.value.trim() || metric.label.trim())
        : fallback.keyMetrics

      return {
        ...fallback,
        brandName: isPhinoi ? PHINOI_DISPLAY_NAME : item.title || fallback.brandName,
        accountName: item.accountName || fallback.accountName,
        displayName: isPhinoi
          ? PHINOI_DISPLAY_NAME
          : item.displayName || fallback.displayName || item.title || fallback.brandName,
        logoUrl: item.logoUrl || fallback.logoUrl,
        verified: item.verified ?? fallback.verified,
        category: item.label || fallback.category,
        period: item.period || fallback.period,
        headline: normalizeStoryText(item.body || fallback.headline),
        shortDescription: normalizeStoryText(item.shortDescription || fallback.shortDescription),
        caption: normalizeStoryText(item.caption || fallback.caption || ''),
        likesSeed: item.likesSeed || fallback.likesSeed,
        services: services.length ? services : fallback.services,
        keyMetrics,
        featuredStats: item.featuredStats?.length ? item.featuredStats : fallback.featuredStats,
        storyDetail: {
          challenge: normalizeStoryText(item.storyDetail?.challenge || fallback.storyDetail.challenge),
          solution: normalizeStoryText(item.storyDetail?.solution || fallback.storyDetail.solution),
          result: normalizeStoryText(item.storyDetail?.result || fallback.storyDetail.result),
        },
        videoUrl: item.videoUrl || fallback.videoUrl,
        embedUrl: item.embedUrl || fallback.embedUrl,
        thumbnailUrl: item.thumbnailUrl || fallback.thumbnailUrl,
        homepageBannerImageUrl: item.homepageBannerImageUrl || fallback.homepageBannerImageUrl,
        homepageBannerMobileUrl: item.homepageBannerMobileUrl || fallback.homepageBannerMobileUrl,
        homepageBannerPosition: item.homepageBannerPosition || fallback.homepageBannerPosition,
        homepageBannerMobilePosition: item.homepageBannerMobilePosition || fallback.homepageBannerMobilePosition,
        homepageGalleryImages: (item.homepageGalleryImages?.length ? item.homepageGalleryImages : fallback.homepageGalleryImages) ?? [],
        backgroundImageUrl: item.backgroundImageUrl || item.imageUrl || fallback.backgroundImageUrl,
        backgroundImages: (item.backgroundImages?.length ? item.backgroundImages : fallback.backgroundImages) ?? [],
        screenBackground: {
          imageUrl: item.screenBackground?.imageUrl || fallback.screenBackground?.imageUrl || '',
          gradient: item.screenBackground?.gradient || fallback.screenBackground?.gradient || '',
        },
        socialLinks: {
          instagram: item.socialLinks?.instagram || fallback.socialLinks?.instagram || '',
          facebook: item.socialLinks?.facebook || fallback.socialLinks?.facebook || '',
          tiktok: item.socialLinks?.tiktok || fallback.socialLinks?.tiktok || '',
          website: item.socialLinks?.website || fallback.socialLinks?.website || '',
        },
        showOnHomepage: item.showOnHomepage ?? fallback.showOnHomepage,
        homepageOrder: item.homepageOrder || fallback.homepageOrder,
        layoutVariant: item.layoutVariant || fallback.layoutVariant,
        testimonialQuote: normalizeStoryText(item.testimonialQuote || fallback.testimonialQuote || '') || undefined,
        testimonialAuthor: normalizeStoryText(item.testimonialAuthor || fallback.testimonialAuthor || '') || undefined,
        testimonialRole: item.testimonialRole || fallback.testimonialRole,
        testimonialAvatar: item.testimonialAvatar || fallback.testimonialAvatar,
        ctaText: item.ctaText || fallback.ctaText,
      }
    }
  }

  return undefined
}

export function getOrderedCaseStudies(storiesBlock: CmsBlock | undefined) {
  if (!storiesBlock?.items) return caseStudies

  const ordered = (storiesBlock?.items ?? []).map(storyFromCmsItem).filter(Boolean) as CaseStudy[]
  // The CMS order is also the CMS inclusion list. A removed story must stay removed.
  return ordered
}
