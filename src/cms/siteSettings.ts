import { footerCopyByLang, navItemsByLang, type BrandLang } from '../brandContent'
import type { CmsLink, CmsLocalizedSiteSettings, CmsSiteSettings } from './types'

const defaultFooterNavLinks: CmsLink[] = [
  { label: 'The One Story', href: '/about' },
  { label: 'The One Stories', href: '/the-one' },
  { label: 'Insights', href: '/insights' },
]

function isTemporarilyHiddenHeaderLink(item: CmsLink) {
  const label = item.label.trim().toLowerCase()
  const href = item.href.trim().toLowerCase()
  return label === 'the one story' || href === '/about'
}

function cloneLinks(items: CmsLink[] | undefined, fallback: CmsLink[], options?: { hideTheOneStoryByDefault?: boolean }) {
  const source = items === undefined ? fallback : items
  return source.map((item) => ({
    label: item.label ?? '',
    href: item.href ?? '',
    visible:
      item.visible ??
      (options?.hideTheOneStoryByDefault && isTemporarilyHiddenHeaderLink(item) ? false : true),
  }))
}

function createDefaultLocale(lang: BrandLang): CmsLocalizedSiteSettings {
  const footerCopy = footerCopyByLang[lang]
  const isVi = lang === 'vi'
  const bookingNeeds = isVi
    ? [
      'Tư vấn tổng quát',
      'Ecommerce Operation (Shopee, TikTok Shop...)',
      'Social & Growth (TikTok, Content, KOC)',
      'Business Operation (Process, HR)',
      'Website & Digital System',
      'Data Management & Dashboard',
      'Other',
    ]
    : [
      'General consultation',
      'Ecommerce Operation (Shopee, TikTok Shop...)',
      'Social & Growth (TikTok, Content, KOC)',
      'Business Operation (Process, HR)',
      'Website & Digital System',
      'Data Management & Dashboard',
      'Other',
    ]

  return {
    header: {
      logoSrc: '/logo-gg.png',
      logoAlt: 'The One - GG99',
      brandName: 'The One',
      tagline: 'Golden Generation Company Ltd.',
      ctaLabel: 'Schedule Our Date',
      navLinks: cloneLinks(navItemsByLang[lang], navItemsByLang.en, { hideTheOneStoryByDefault: true }),
    },
    booking: {
      title: 'Congratulations - almost there darling!',
      subtitle: 'Schedule your first date with The One.',
      intro: isVi
        ? 'Chọn ngày và khung thời gian bạn mong muốn. The One - GG99 sẽ liên hệ để xác nhận lịch tư vấn phù hợp.'
        : 'Choose your preferred date and time. The One - GG99 will reach out to confirm a suitable consultation slot.',
      frameLabel: isVi ? 'Khung thời gian mong muốn' : 'Preferred time slot',
      continueLabel: isVi ? 'Tiếp tục đăng ký tư vấn ->' : 'Continue to register ->',
      continueDisabledLabel: isVi ? 'Chọn ngày và khung thời gian để tiếp tục' : 'Select a date and time slot to continue',
      submitLabel: isVi ? 'Gửi đăng ký ->' : 'Submit ->',
      successTitle: isVi ? 'Cảm ơn bạn!' : 'Thank you!',
      successMessage: isVi
        ? 'The One - GG99 đã nhận thông tin đăng ký tư vấn.'
        : 'The One - GG99 has received your consultation request.',
      successFollowup: isVi
        ? 'Đội ngũ của chúng tôi sẽ liên hệ lại để xác nhận lịch phù hợp.'
        : 'Our team will contact you to confirm a suitable time.',
      softCtaLabel: isVi ? 'Chưa sẵn sàng gọi? Nhắn Zalo làm quen trước đã ->' : 'Not ready to call yet? Say hi on Zalo first ->',
      softCtaHref: 'https://zalo.me/smoothgg',
      needs: bookingNeeds,
    },
    footer: {
      logoSrc: '/logo-gg.png',
      logoAlt: 'The One - GG99',
      brandName: footerCopy.brand,
      tagline: footerCopy.slogan,
      description: footerCopy.description,
      solutionsHeading: isVi ? 'Gi\u1ea3i ph\u00e1p' : 'Solutions',
      solutionLinks: cloneLinks(footerCopy.packages, footerCopyByLang.en.packages),
      navigationHeading: isVi ? '\u0110i\u1ec1u h\u01b0\u1edbng' : 'Navigation',
      navigationLinks: cloneLinks(defaultFooterNavLinks, defaultFooterNavLinks),
      contactHeading: isVi ? 'Li\u00ean h\u1ec7' : 'Contact',
      email: 'smooth@gg99.vn',
      chatUrl: 'https://zalo.me/smoothgg',
      chatLabel: 'Zalo',
      address: isVi ? 'H\u00e0 N\u1ed9i, Vi\u1ec7t Nam' : 'Hanoi, Vietnam',
      companyName: 'C\u00f4ng ty TNHH MTV Th\u1ebf H\u1ec7 V\u00e0ng Vi\u1ec7t Nam',
      taxCode: '0111274327',
      companyAddress: 'S\u1ed1 4/146 Ph\u1ea1m Ng\u1ecdc Th\u1ea1ch, \u0110\u1ed1ng \u0110a, H\u00e0 N\u1ed9i',
      copyright: isVi ? '\u00a9 2026 The One - GG99. \u0110\u00e3 \u0111\u0103ng k\u00fd b\u1ea3n quy\u1ec1n.' : '\u00a9 2026 The One - GG99. All rights reserved.',
      privacyLabel: isVi ? 'B\u1ea3o m\u1eadt' : 'Privacy',
      privacyHref: '/chinh-sach-bao-mat',
      termsLabel: isVi ? '\u0110i\u1ec1u kho\u1ea3n' : 'Terms',
      termsHref: '/dieu-khoan-dich-vu',
    },
  }
}

export function createDefaultCmsSiteSettings(): CmsSiteSettings {
  return {
    id: 'global',
    locales: {
      vi: createDefaultLocale('vi'),
      en: createDefaultLocale('en'),
    },
  }
}

export const defaultCmsSiteSettings = createDefaultCmsSiteSettings()

function mergeLocale(
  fallback: CmsLocalizedSiteSettings,
  current: Partial<CmsLocalizedSiteSettings> | undefined,
): CmsLocalizedSiteSettings {
  return {
    header: {
      ...fallback.header,
      ...current?.header,
      navLinks: cloneLinks(current?.header?.navLinks, fallback.header.navLinks, { hideTheOneStoryByDefault: true }),
    },
    booking: {
      ...fallback.booking,
      ...current?.booking,
      needs: current?.booking?.needs?.length ? current.booking.needs : fallback.booking.needs,
    },
    footer: {
      ...fallback.footer,
      ...current?.footer,
      solutionLinks: cloneLinks(current?.footer?.solutionLinks, fallback.footer.solutionLinks),
      navigationLinks: cloneLinks(current?.footer?.navigationLinks, fallback.footer.navigationLinks),
    },
  }
}

export function mergeCmsSiteSettings(settings?: Partial<CmsSiteSettings> | null): CmsSiteSettings {
  const fallback = createDefaultCmsSiteSettings()
  const current: Partial<CmsSiteSettings> = settings ?? {}

  return {
    ...fallback,
    ...current,
    id: 'global',
    locales: {
      vi: mergeLocale(fallback.locales.vi, current.locales?.vi),
      en: mergeLocale(fallback.locales.en, current.locales?.en),
    },
  }
}

export function getLocalizedSiteSettings(settings: CmsSiteSettings | null | undefined, lang: BrandLang) {
  return mergeCmsSiteSettings(settings).locales[lang]
}
