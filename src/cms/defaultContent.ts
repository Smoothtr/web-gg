import {
  aboutMetaByLang,
  compactAboutByLang,
  compactHomeByLang,
  compactPackageByLang,
  compactTheOneByLang,
  contactMeta,
  homeMetaByLang,
  insightPosts,
  packagesMetaByLang,
  servicesMeta,
  theOnePackagesByLang,
} from '../brandContent'
import { caseStudies } from '../data/caseStudies'
import type { CmsBlockItem, CmsInsightContent, CmsPageContent } from './types'
export { defaultCmsSiteSettings } from './siteSettings'

const theOnePackageItems: CmsBlockItem[] = [
  {
    title: 'The One Start',
    icon: 'Rocket',
    href: '/packages#the-one-start',
    caseStudyLink: '/the-one#cota-cuti',
    imageUrl: '',
    body: [
      'Mới quen - xây nền digital tử tế, đều tay mỗi tuần.',
      '45 content units/month (tối thiểu 15 reels/short-form videos)',
      'Content strategy, content calendar, production, posting and optimization.',
      'Basic booking website, tối đa 10 landing pages.',
      'Performance marketing (% trên ad spend thực tế)',
      'Price: 15,000,000 VND/month',
    ].join('\n'),
    subtitle: 'Mới quen - xây nền digital tử tế, đều tay mỗi tuần.',
    features: [
      { label: 'CONTENT ENGINE', text: '45 content units/month, tối thiểu 15 reels/short-form videos.' },
      { label: 'WEBSITE SYSTEM', text: 'Basic booking website, tối đa 10 landing pages.' },
      { label: 'PERFORMANCE MEDIA', text: 'Performance marketing theo % trên ad spend thực tế.' },
    ],
    priceLabel: 'MONTHLY SETUP',
    priceValue: '15,000,000 VND/month',
    leftBackgroundUrl: '',
    rightBackgroundUrl: '',
    ctaText: 'Chọn gói này',
    caseStudyLabel: 'Xem chuyện tình tụi mình',
    locales: {
      en: {
        subtitle: 'For brands starting to build a consistent digital presence.',
        features: [
          { label: 'CONTENT ENGINE', text: '45 content units/month, minimum 15 reels/short-form videos.' },
          { label: 'WEBSITE SYSTEM', text: 'Basic booking website, up to 10 landing pages.' },
          { label: 'PERFORMANCE MEDIA', text: 'Performance marketing based on actual ad spend.' },
        ],
        priceLabel: 'MONTHLY SETUP',
        priceValue: '15,000,000 VND/month',
        body: [
          'For brands starting to build a consistent digital presence.',
          '45 content units/month (minimum 15 reels/short-form videos)',
          'Content strategy, content calendar, production, posting and optimization.',
          'Basic booking website, up to 10 landing pages.',
          'Performance marketing (% of actual ad spend)',
          'Price: 15,000,000 VND/month',
        ].join('\n'),
        ctaText: 'Choose this package',
        caseStudyLabel: 'See case studies',
      },
    },
  },
  {
    title: 'The One System',
    label: 'Được chọn nhiều nhất',
    icon: 'Workflow',
    href: '/packages#the-one-system',
    caseStudyLink: '/the-one#curnon',
    imageUrl: '',
    body: [
      'Về chung nhà - content, web và ads chạy như một hệ thống.',
      '60 content units/month (tối thiểu 20 reels/short-form videos)',
      'Content strategy, content calendar, production, posting and optimization.',
      'Booking/sales website, unlimited landing pages.',
      'Performance marketing (% trên ad spend thực tế)',
      'Price: 30,000,000 VND/month',
    ].join('\n'),
    subtitle: 'Về chung nhà - content, web và ads chạy như một hệ thống.',
    features: [
      { label: 'CONTENT ENGINE', text: '60 content units/month, tối thiểu 20 reels/short-form videos.' },
      { label: 'WEBSITE SYSTEM', text: 'Booking/sales website, unlimited landing pages.' },
      { label: 'PERFORMANCE MEDIA', text: 'Performance marketing theo % trên ad spend thực tế.' },
    ],
    priceLabel: 'MONTHLY SETUP',
    priceValue: '30,000,000 VND/month',
    leftBackgroundUrl: '',
    rightBackgroundUrl: '',
    ctaText: 'Chọn gói này',
    caseStudyLabel: 'Xem chuyện tình tụi mình',
    locales: {
      en: {
        label: 'Most Popular',
        subtitle: 'For brands that need content, website and paid media running as one stable system.',
        features: [
          { label: 'CONTENT ENGINE', text: '60 content units/month, minimum 20 reels/short-form videos.' },
          { label: 'WEBSITE SYSTEM', text: 'Booking/sales website, unlimited landing pages.' },
          { label: 'PERFORMANCE MEDIA', text: 'Performance marketing based on actual ad spend.' },
        ],
        priceLabel: 'MONTHLY SETUP',
        priceValue: '30,000,000 VND/month',
        body: [
          'For brands that need content, website and paid media running as one stable system.',
          '60 content units/month (minimum 20 reels/short-form videos)',
          'Content strategy, content calendar, production, posting and optimization.',
          'Booking/sales website, unlimited landing pages.',
          'Performance marketing (% of actual ad spend)',
          'Price: 30,000,000 VND/month',
        ].join('\n'),
        ctaText: 'Choose this package',
        caseStudyLabel: 'See case studies',
      },
    },
  },
  {
    title: 'The One Scale',
    icon: 'Megaphone',
    href: '/packages#the-one-scale',
    caseStudyLink: '/the-one#inkaholic',
    imageUrl: '',
    body: [
      'Tính chuyện lâu dài - chiến dịch lớn, mục tiêu doanh thu cụ thể.',
      'Everything included in The One System.',
      'Support planning and running on-site events.',
      'Campaign strategy, creative direction, media planning and performance optimization.',
      'Performance marketing (% trên ad spend thực tế)',
      'Price: Custom package — based on project scope.',
    ].join('\n'),
    subtitle: 'Tính chuyện lâu dài - chiến dịch lớn, mục tiêu doanh thu cụ thể.',
    features: [
      { label: 'SYSTEM BASE', text: 'Everything included in The One System.' },
      { label: 'EVENT OPS', text: 'Support planning and running on-site events.' },
      { label: 'PERFORMANCE MEDIA', text: 'Campaign strategy, creative direction, media planning and performance optimization.' },
    ],
    priceLabel: 'MONTHLY SETUP',
    priceValue: 'Custom package — based on project scope.',
    leftBackgroundUrl: '',
    rightBackgroundUrl: '',
    ctaText: 'Chọn gói này',
    caseStudyLabel: 'Xem chuyện tình tụi mình',
    locales: {
      en: {
        subtitle: 'For brands ready for strong growth: large campaigns, event execution, branch expansion or specific revenue targets.',
        features: [
          { label: 'SYSTEM BASE', text: 'Everything included in The One System.' },
          { label: 'EVENT OPS', text: 'Support planning and running on-site events.' },
          { label: 'PERFORMANCE MEDIA', text: 'Campaign strategy, creative direction, media planning and performance optimization.' },
        ],
        priceLabel: 'MONTHLY SETUP',
        priceValue: 'Custom package — based on project scope.',
        body: [
          'For brands ready for strong growth: large campaigns, event execution, branch expansion or specific revenue targets.',
          'Everything included in The One System.',
          'Support planning and running on-site events.',
          'Campaign strategy, creative direction, media planning and performance optimization.',
          'Performance marketing (% of actual ad spend)',
          'Price: Custom package — based on project scope.',
        ].join('\n'),
        ctaText: 'Choose this package',
        caseStudyLabel: 'See case studies',
      },
    },
  },
]

const theOnePeopleItems: CmsBlockItem[] = [
  {
    title: 'Smooth',
    label: 'Founder / Growth Architect / CRM / Commerce',
    body: 'Trung thành là đường hai chiều. Mình đòi hỏi nó từ bạn, thì bạn cũng nhận được nó từ mình.',
    proofPoint: '5 năm cùng INKAHOLIC, 0 -> 326K+ đơn hàng.',
    imageUrl: '/logo-gg.png',
    funPhotoUrl: '/logo-gg.png',
    bannerImageUrl: '/logo-gg.png',
    thumbnailUrl: '/logo-gg.png',
    avatarImages: ['/logo-gg.png', '/logo-gg.png', '/logo-gg.png', '/logo-gg.png'],
    locales: {
      en: {
        label: 'Founder / Growth Architect',
        body: 'Loyalty is a two-way street. If I ask it from you, you get it back from me.',
        proofPoint: '5 years with INKAHOLIC, 0 -> 326K+ orders.',
      },
    },
  },
  {
    title: 'Creative One',
    label: 'Content / Scripts / Visuals / Social rhythm',
    body: 'Content không phải đăng cho có. Content phải khiến người xem nhớ, hỏi, rồi mua.',
    proofPoint: 'Vận hành nội dung ngắn hạn cho nhiều brand Gen Z.',
    imageUrl: '/logo-gg.png',
    funPhotoUrl: '/logo-gg.png',
    bannerImageUrl: '/logo-gg.png',
    thumbnailUrl: '/logo-gg.png',
    avatarImages: ['/logo-gg.png', '/logo-gg.png', '/logo-gg.png', '/logo-gg.png'],
    locales: {
      en: {
        label: 'Content Lead',
        body: 'Content is not posting for the sake of posting. It should make people remember, ask, then buy.',
        proofPoint: 'Short-form content rhythm across Gen Z brands.',
      },
    },
  },
  {
    title: 'Performance One',
    label: 'Paid media / Reporting / Experiments / Revenue',
    body: 'Số xấu vẫn phải đưa. Vì số xấu giấu đi thì tiền của bạn mới là thứ biến mất.',
    proofPoint: 'Theo dõi ads, ROAS, CPA và dashboard hằng tuần.',
    imageUrl: '/logo-gg.png',
    funPhotoUrl: '/logo-gg.png',
    bannerImageUrl: '/logo-gg.png',
    thumbnailUrl: '/logo-gg.png',
    avatarImages: ['/logo-gg.png', '/logo-gg.png', '/logo-gg.png', '/logo-gg.png'],
    locales: {
      en: {
        label: 'Media Lead',
        body: 'Bad numbers still need to be shown. If they are hidden, your money is what disappears.',
        proofPoint: 'Weekly ads, ROAS, CPA and dashboard operation.',
      },
    },
  },
  {
    title: 'System One',
    label: 'Website / CRM / Funnel / Automation',
    body: 'Một landing page tốt không chỉ đẹp. Nó biết khách đang sợ gì và trả lời đúng lúc.',
    proofPoint: 'Xây web, funnel và CRM flow cho các đội lean.',
    imageUrl: '/logo-gg.png',
    funPhotoUrl: '/logo-gg.png',
    bannerImageUrl: '/logo-gg.png',
    thumbnailUrl: '/logo-gg.png',
    avatarImages: ['/logo-gg.png', '/logo-gg.png', '/logo-gg.png', '/logo-gg.png'],
    locales: {
      en: {
        label: 'Website / CRM',
        body: 'A good landing page is not only pretty. It knows what customers fear and answers at the right moment.',
        proofPoint: 'Web, funnel and CRM flows for lean teams.',
      },
    },
  },
  {
    title: 'Commerce One',
    label: 'Marketplace / Launches / Bundles / Campaign mechanics',
    body: 'Sàn không tự lớn. Mỗi bundle, mỗi live, mỗi mã giảm giá đều phải có lý do.',
    proofPoint: 'Vận hành Shopee, TikTok Shop, bundles và launch calendar.',
    imageUrl: '/logo-gg.png',
    funPhotoUrl: '/logo-gg.png',
    bannerImageUrl: '/logo-gg.png',
    thumbnailUrl: '/logo-gg.png',
    avatarImages: ['/logo-gg.png', '/logo-gg.png', '/logo-gg.png', '/logo-gg.png'],
    locales: {
      en: {
        label: 'Marketplace Ops',
        body: 'Marketplaces do not grow by themselves. Every bundle, live and discount needs a reason.',
        proofPoint: 'Shopee, TikTok Shop, bundles and launch calendar operation.',
      },
    },
  },
  {
    title: 'Data One',
    label: 'Dashboard / Insight / KPI / Decision system',
    body: 'Data phải nói được chuyện kinh doanh. Nếu chỉ đẹp trong sheet, nó chưa giúp ai quyết định.',
    proofPoint: 'Biến tín hiệu rời rạc thành dashboard dùng được mỗi tuần.',
    imageUrl: '/logo-gg.png',
    funPhotoUrl: '/logo-gg.png',
    bannerImageUrl: '/logo-gg.png',
    thumbnailUrl: '/logo-gg.png',
    avatarImages: ['/logo-gg.png', '/logo-gg.png', '/logo-gg.png', '/logo-gg.png'],
    locales: {
      en: {
        label: 'Dashboard / Insight',
        body: 'Data should speak business. If it only looks good in a sheet, it has not helped anyone decide.',
        proofPoint: 'Turns scattered signals into weekly operating dashboards.',
      },
    },
  },
]

const contactItems: CmsBlockItem[] = [
  { title: 'Email', body: 'smooth@gg99.vn', href: 'mailto:smooth@gg99.vn', icon: 'Mail' },
  { title: 'Chat', body: 'Zalo', href: 'https://zalo.me/smoothgg', icon: 'MessageCircle' },
  { title: 'Office', body: 'Hanoi, Vietnam', icon: 'Target' },
]

const servicesMetaVi = {
  ...servicesMeta,
  title: 'Services | The One - GG99',
  description:
    'Các dịch vụ của The One - GG99: brand, website, CRM, marketing automation và performance marketing trong một hệ tăng trưởng kết nối.',
  path: '/services',
  ogDescription:
    'Brand, website, CRM, automation và performance marketing trong một hệ tăng trưởng kết nối.',
}

const contactMetaVi = {
  ...contactMeta,
  title: 'Contact | The One - GG99',
  description:
    'Liên hệ The One - GG99 để xây thương hiệu, website, CRM, automation và performance marketing trong một hệ sinh thái.',
  path: '/contact',
  ogDescription: 'Liên hệ GG99 để bắt đầu buổi hẹn đầu tiên với The One.',
}

const packageDetailDefinitions = [
  { id: 'the-one-start', key: 'consultant' },
  { id: 'the-one-system', key: 'agency' },
  { id: 'the-one-scale', key: 'partner' },
] as const

const packageDetailPages: CmsPageContent[] = packageDetailDefinitions.map(({ id, key }) => {
  const page = compactPackageByLang.vi[key]
  const pageEn = compactPackageByLang.en[key]
  return {
    id,
    title: page.h1,
    status: 'published',
    meta: { ...page.meta, path: `/${id}` },
    metaLocales: {
      en: pageEn.meta,
    },
    blocks: [
      {
        id: 'hero',
        heading: page.h1,
        body: `${page.hero}\n\n${page.intro}`,
        imageUrl: '/logo-gg.png',
        imageAlt: page.h1,
        locales: {
          en: {
            heading: pageEn.h1,
            body: `${pageEn.hero}\n\n${pageEn.intro}`,
          },
        },
      },
      {
        id: 'cards',
        heading: 'Bạn nhận được gì',
        body: '',
        items: page.cards.map((card, index) => ({
          title: card.title,
          body: card.text,
          icon: ['ClipboardCheck', 'Megaphone', 'Users', 'ShoppingCart', 'Target', 'Route'][index] ?? 'BadgeCheck',
          locales: {
            en: {
              title: pageEn.cards[index]?.title ?? card.title,
              body: pageEn.cards[index]?.text ?? card.text,
            },
          },
        })),
        locales: {
          en: {
            heading: 'What you get',
          },
        },
      },
      {
        id: 'process',
        heading: 'Quy trình',
        body: '',
        items: page.process.map((step, index) => ({
          title: step.title,
          body: step.text,
          icon: String(index + 1).padStart(2, '0'),
          locales: {
            en: {
              title: pageEn.process[index]?.title ?? step.title,
              body: pageEn.process[index]?.text ?? step.text,
            },
          },
        })),
        locales: {
          en: {
            heading: 'Process',
          },
        },
      },
    ],
  }
})

const storyVietnameseCopy: Record<string, Partial<CmsBlockItem>> = {
  phinoi: {
    label: 'Văn hóa cà phê Việt / Tăng trưởng e-commerce',
    body: 'Biến một startup phin ngách thành cỗ máy đa kênh',
    shortDescription:
      'PHINƠI cần giáo dục thị trường cho sản phẩm phin cao cấp và giảm phụ thuộc marketplace. The One vận hành P&L online qua website, Shopee, social/B2B, ads, KOL và livestream.',
    caption: 'Từ văn hóa cà phê ngách thành một growth engine owned-commerce cân bằng.',
    featuredStats: [
      { value: '0 -> 36%', label: 'doanh thu từ website' },
      { value: '+84%', label: 'doanh thu tháng gần nhất' },
    ],
    keyMetrics: [
      { value: 'x3', label: 'doanh thu FY2026 dự phóng' },
      { value: '+84%', label: 'doanh thu tháng gần nhất' },
    ],
    storyDetail: {
      challenge:
        'Một sản phẩm phin cao cấp, ngách và cần giáo dục thị trường phải xây owned channel mạnh hơn cùng một lớp vận hành online đầy đủ cho team startup tinh gọn.',
      solution:
        'The One vận hành website, Shopee, TikTok Shop, Meta/TikTok/Shopee Ads, 200+ micro KOL, livestream commerce, bundle theo mùa và các push social/B2B gifting.',
      result:
        'Channel mix chuyển từ khoảng 70% Shopee sang Web 36%, Shopee 32% và Social/B2B 32%, doanh thu tháng gần nhất tăng 84%, marketing ROI tháng 06/2026 đạt 2.68 và FY2026 dự phóng x3.',
    },
    testimonialQuote: 'The One giúp tụi mình nhìn e-commerce như một hệ vận hành, không chỉ là vài campaign rời rạc.',
    testimonialAuthor: 'PHINƠI team',
    testimonialRole: 'Founder office',
  },
  'cota-cuti': {
    label: 'Kính Gen Z / Brand & commerce launch',
    body: 'Nuôi một brand kính Gen Z từ con số 0',
    shortDescription:
      'Ngay từ launch, The One giúp cota.cuti định hình commerce, content, pricing và creator operations, biến một ý tưởng thời trang trẻ thành hệ tăng trưởng local brand có đo lường.',
    caption: 'Một brand kính Gen Z được xây từ số 0 với commerce, content và creator ops chạy cùng nhau.',
    featuredStats: [
      { value: 'x35', label: 'doanh thu đỉnh' },
      { value: '20,668', label: 'sản phẩm đã bán' },
    ],
    keyMetrics: [
      { value: '4.42B VND', label: 'doanh thu lũy kế' },
      { value: '20,668', label: 'sản phẩm đã bán' },
    ],
    storyDetail: {
      challenge:
        'Brand bắt đầu với không kênh bán, không cộng đồng, không dữ liệu vận hành và thị trường kính cạnh tranh dày đặc người bán giá thấp trên marketplace.',
      solution:
        'The One xây và vận hành TikTok Shop, Shopee, website D2C, TikTok/Meta/Shopee Ads, content Gen Z, pricing architecture, P&L tracking, cashflow control và 100+ booking KOL/KOC.',
      result:
        'Trong 20 tháng, cota.cuti đạt 4.42B VND doanh thu lũy kế, 20,668 sản phẩm bán ra, 37.2K follower TikTok và gross margin ổn định khoảng 70%.',
    },
    testimonialQuote: 'Từ một ý tưởng kính nhỏ, tụi mình có một hệ bán hàng thật sự nhìn được số mỗi ngày.',
    testimonialAuthor: 'cota.cuti team',
    testimonialRole: 'Founder office',
  },
  inkaholic: {
    label: 'Temporary tattoos / Full-stack e-commerce growth',
    body: 'Scale thương hiệu tattoo dán đầu tiên tại Việt Nam từ end to end',
    shortDescription:
      'The One vận hành e-commerce, ads, KOL/KOC, content và product strategy cho INKAHOLIC suốt 5 năm platform thay đổi. Cú pivot TikTok Shop đúng lúc biến social attention thành revenue engine chính.',
    caption: '5 năm platform shifts, creator operations và performance discipline.',
    featuredStats: [
      { value: '326K+', label: 'đơn hàng' },
      { value: '~29.8B VND', label: 'net online revenue' },
    ],
    keyMetrics: [
      { value: '~29.8B VND', label: 'net online revenue' },
      { value: '326K+', label: 'đơn qua các kênh' },
    ],
    storyDetail: {
      challenge:
        'INKAHOLIC cần một lớp vận hành online full-stack cho sản phẩm Gen Z theo trend, đồng thời giữ kênh, creator, campaign và product launch chạy cùng một nhịp.',
      solution:
        'The One quản lý website, Shopee, TikTok Shop, Lazada, ngân sách performance hằng ngày, 1,000+ booking KOL/KOC và affiliate, format viral, collection strategy, bundles và campaign spikes.',
      result:
        'Hệ thống ghi nhận khoảng 29.8B VND net online revenue, 326K+ đơn và 886K+ sản phẩm bán ra, trong khi TikTok Shop tăng từ 0 lên 6.41B VND doanh thu năm 2024.',
    },
    testimonialQuote: 'The One vận hành như người trong nhà, đủ gần để thấy vấn đề trước khi nó thành khủng hoảng.',
    testimonialAuthor: 'INKAHOLIC team',
    testimonialRole: 'Founder office',
  },
  'qanda-books': {
    label: 'Sách EdTech / TikTok Commerce',
    body: 'Làm TikTok Commerce hiệu quả cho ngành sách mùa vụ',
    shortDescription:
      'QANDA Books có bài toán exam-commerce AOV thấp, mùa vụ mạnh và CPA sai một chút là đau ngay. The One xây hệ TikTok content, ads, Live Shopping, GMV Max và reporting hằng ngày quanh nhu cầu mùa thi.',
    caption: 'Nhu cầu mùa thi được biến thành nhịp TikTok commerce hằng ngày.',
    featuredStats: [
      { value: '25.04B VND', label: 'GMV từ ads' },
      { value: '4.56', label: 'blended ROAS' },
    ],
    keyMetrics: [
      { value: '25.04B VND', label: 'GMV từ ads' },
      { value: '4.56', label: 'blended ROAS' },
    ],
    storyDetail: {
      challenge:
        'Sách và combo khóa học có AOV 170K-345K VND, biên sai số CPA mỏng, nhu cầu mùa thi mạnh và yêu cầu báo cáo hằng ngày nghiêm ngặt.',
      solution:
        'The One xây hệ TikTok ba lớp: content inhouse theo môn, KOC/KOL review, Video Shopping, Live Shopping, GMV Max, pixel/UTM measurement và reporting SKU-level hằng ngày.',
      result:
        'Trong 16 tháng, TikTok ads tạo 25.04B VND GMV, 4.56 blended ROAS, 101,301 đơn và 203M impressions; Live Shopping ROAS giữ 5.8-9.3 trong 2026.',
    },
    testimonialQuote: 'Điều đáng giá nhất là tụi mình biết mỗi ngày tiền ads đang đi đâu và SKU nào đang thật sự kéo doanh thu.',
    testimonialAuthor: 'QANDA Books team',
    testimonialRole: 'Commerce team',
  },
  curnon: {
    label: 'Đồng hồ & trang sức / Online-offline growth',
    body: 'Tăng trưởng có hệ thống cho một local watch brand cao cấp',
    shortDescription:
      'CURNON cần tăng trưởng online-offline có kỷ luật mà không làm mòn brand value. The One nối promotion, pricing, marketplace, ads và real-order reporting thành một hệ vận hành.',
    caption: 'Premium local watch growth với promotion, marketplace và reporting kết nối.',
    featuredStats: [
      { value: '2.48B VND', label: 'doanh thu campaign đỉnh' },
      { value: '19.7', label: 'Shopee Ads ROAS' },
    ],
    keyMetrics: [
      { value: '2.48B VND', label: 'doanh thu campaign đỉnh' },
      { value: '~16%', label: 'ads cost / revenue' },
    ],
    storyDetail: {
      challenge:
        'Một brand đồng hồ và trang sức cao cấp cần phối hợp online-offline, seasonal promotion, marketplace operations và nhiều ad platform mà không phá perception về giá.',
      solution:
        'The One xây ma trận promotion 5 kênh, full-funnel Meta/TikTok/Shopee/CPAS/Google Ads planning, marketplace operation và dashboard so sánh data nền tảng với đơn thật từ nhanh.vn.',
      result:
        'Trong campaign Tết 26 ngày, hệ thống ghi nhận 2.48B VND doanh thu với khoảng 16% ads cost/revenue, Shopee Ads ROAS 19.7 và TikTok Ads ROAS khoảng 3.0.',
    },
    testimonialQuote: 'The One giúp tụi mình tăng trưởng mà vẫn giữ được kỷ luật thương hiệu.',
    testimonialAuthor: 'CURNON team',
    testimonialRole: 'Growth team',
  },
  'annita-studios': {
    label: 'Designer eveningwear / Social commerce operating system',
    body: 'Xây online business cho một brand eveningwear tại Lào',
    shortDescription:
      'ANNITA STUDIOS khởi đầu là local fashion startup tại Vientiane, chưa có hệ bán online, chưa có data vận hành và chưa có playbook e-commerce. The One xây strategy, reporting rhythm, Meta Ads engine, livestream workflow và hệ bàn giao để team local tiếp tục tự chạy.',
    caption:
      'Từ launch đến hệ social commerce tự vận hành: ROAS x12, CIR giảm 92%, peak revenue x11 và 50K+ followers trên ba kênh.',
    featuredStats: [
      { value: 'x12', label: 'ROAS lift' },
      { value: '-92%', label: 'CIR reduction' },
    ],
    keyMetrics: [
      { value: 'x12', label: 'monthly ROAS lift từ 1.5x lên 18.3x peak', featured: true },
      { value: '-92%', label: 'CIR giảm từ khoảng 68% xuống 5.5%', featured: true },
      { value: '6.4x', label: 'blended ROAS trong 12 tháng đầu' },
      { value: '11x+', label: 'ROAS giữ qua mùa cao điểm Q4' },
      { value: 'x12', label: 'message-to-order CVR từ 1.6% lên 19.2%' },
      { value: 'x11', label: 'doanh thu tháng đỉnh so với tháng ads đầu' },
    ],
    storyDetail: {
      challenge:
        'Brand bắt đầu từ số 0 trong thị trường Lào khá ngách: không fanpage data, không customer base, không quy trình chốt online và ngân sách startup cần accountability cao.',
      solution:
        'The One xây operating system quanh pricing, promotions, SKU planning, Meta Engagement và Message campaigns, livestream reporting, sales logs, customer database, KOL/KOC tracking và dashboard monthly full-funnel.',
      result:
        'Trong 12 tháng đầu, monthly ROAS tăng từ 1.5x lên peak 18.3x, CIR giảm từ khoảng 68% xuống 5.5%, message-to-order CVR đạt 19.2% và doanh thu tháng đỉnh tăng 11x. Sau bàn giao, team local tiếp tục vận hành bằng tiếng Lào.',
    },
    testimonialQuote: 'The One không chỉ chạy ads. Họ để lại cho team mình một hệ vận hành có thể tiếp tục dùng.',
    testimonialAuthor: 'ANNITA STUDIOS team',
    testimonialRole: 'Founder office',
  },
}

function getHomepageStats(story: (typeof caseStudies)[number], copy?: Partial<CmsBlockItem>) {
  const copyStats = copy?.featuredStats?.filter((item) => item.value || item.label)
  if (copyStats?.length) return copyStats.slice(0, 2)
  const featured = story.keyMetrics.filter((metric) => metric.featured).slice(0, 2)
  return (featured.length ? featured : story.keyMetrics.slice(0, 2)).map((metric) => ({
    value: metric.value,
    label: metric.label,
    featured: metric.featured,
  }))
}

const theOneStoryItems: CmsBlockItem[] = caseStudies.map((story) => ({
  id: story.id,
  title: story.brandName,
  accountName: story.accountName,
  displayName: story.displayName,
  logoUrl: story.logoUrl,
  verified: story.verified,
  body: storyVietnameseCopy[story.id]?.body || story.headline,
  href: story.id,
  label: storyVietnameseCopy[story.id]?.label || story.category,
  period: storyVietnameseCopy[story.id]?.period || story.period,
  shortDescription: storyVietnameseCopy[story.id]?.shortDescription || story.shortDescription,
  caption: storyVietnameseCopy[story.id]?.caption || story.caption,
  likesSeed: story.likesSeed,
  services: storyVietnameseCopy[story.id]?.services || story.services,
  keyMetrics: storyVietnameseCopy[story.id]?.keyMetrics || story.keyMetrics,
  featuredStats: getHomepageStats(story, storyVietnameseCopy[story.id]),
  storyDetail: storyVietnameseCopy[story.id]?.storyDetail || story.storyDetail,
  videoUrl: '',
  embedUrl: '',
  thumbnailUrl: story.thumbnailUrl,
  homepageGalleryImages: story.homepageGalleryImages,
  backgroundImageUrl: story.backgroundImageUrl ?? '',
  backgroundImages: story.backgroundImages,
  screenBackground: story.screenBackground,
  socialLinks: {
    instagram: story.socialLinks?.instagram ?? '',
    facebook: story.socialLinks?.facebook ?? '',
    tiktok: story.socialLinks?.tiktok ?? '',
    website: story.socialLinks?.website ?? '',
  },
  showOnHomepage: story.showOnHomepage ?? true,
  homepageOrder: story.homepageOrder ?? '',
  testimonialQuote: storyVietnameseCopy[story.id]?.testimonialQuote,
  testimonialAuthor: storyVietnameseCopy[story.id]?.testimonialAuthor,
  testimonialRole: storyVietnameseCopy[story.id]?.testimonialRole,
  ctaText: 'About this story',
  locales: {
    en: {
      body: story.headline,
      label: story.category,
      period: story.period,
      shortDescription: story.shortDescription,
      caption: story.caption,
      services: story.services,
      keyMetrics: story.keyMetrics,
      featuredStats: getHomepageStats(story),
      storyDetail: story.storyDetail,
      testimonialQuote: story.testimonialQuote,
      testimonialAuthor: story.testimonialAuthor,
      testimonialRole: story.testimonialRole,
      ctaText: story.ctaText,
    },
  },
}))

export const defaultCmsPages: CmsPageContent[] = [
  {
    id: 'homepage',
    title: 'Homepage',
    status: 'published',
    meta: { ...homeMetaByLang.vi, path: '/' },
    metaLocales: {
      en: homeMetaByLang.en,
    },
    blocks: [
      {
        id: 'hero',
        heading: 'Hẹn hò bao nhiêu agency rồi - vẫn chưa gặp The One?',
        body: 'Người làm được mọi thứ bạn cần: content, web, CRM, ads. Người hiểu bạn muốn đi đâu. Và quan trọng nhất: người ở lại đủ lâu để cùng bạn thấy kết quả.',
        subtitle: 'Người làm được mọi thứ bạn cần: content, web, CRM, ads. Người hiểu bạn muốn đi đâu. Và quan trọng nhất: người ở lại đủ lâu để cùng bạn thấy kết quả.',
        imageUrl: '',
        imageAlt: 'The One - GG99',
        backgroundImageUrl: '',
        backgroundGradient: 'linear-gradient(180deg,#FF7AA8 0%,#FF4D7D 45%,#FFB199 100%)',
        backgroundOverlayOpacity: '0',
        textColor: 'light',
        dividerShow: true,
        ctaLabel: 'Schedule Our Date',
        ctaSubtext: '30 phút cà phê online với founder - miễn phí, không ràng buộc, không sales gọi dai.',
        showCtaSubtext: false,
        showStatChips: false,
        statChips: [
          { value: '5', label: 'mối tình đang bền' },
          { value: 'x35', label: 'tăng trưởng đỉnh' },
          { value: '350K+', label: 'đơn đã chốt' },
        ],
        ctaHref: '',
        items: [],
        locales: {
          en: {
            heading: 'All-in-one Marketing Agency for Startups & SMEs',
            body: 'The One delivers full-service marketing solutions with exceptional speed, efficiency, and cost-effectiveness.',
            subtitle: 'The One delivers full-service marketing solutions with exceptional speed, efficiency, and cost-effectiveness.',
            ctaLabel: 'Schedule Our Date',
            ctaSubtext: 'Free 30-min call - no commitment - talk directly with a founder.',
            statChips: [
              { value: '5', label: 'brands partnered' },
              { value: 'x35', label: 'peak growth' },
              { value: '350K+', label: 'orders operated' },
            ],
          },
        },
      },
      {
        id: 'what-is',
        heading: compactHomeByLang.en.whatIs.title,
        body: compactHomeByLang.en.whatIs.body,
        items: [
          { title: 'The One knows about failure.', body: 'Premium local watch growth with connected promotions, marketplaces and reporting.', icon: 'Search', href: 'curnon', imageUrl: '/logo-curnon.png', showOnHomepage: true, homepageOrder: '0' },
          { title: 'The One Performance Marketing Agency', body: 'Tut - tricks and real performance.', icon: 'Megaphone', href: 'phinoi', imageUrl: '/logo-phinoi.png', showOnHomepage: true, homepageOrder: '1' },
          { title: 'The One Production House', body: 'Ideas, Contents, and Productions.', icon: 'Sparkles', href: 'cota-cuti', imageUrl: '/logo-cotacuti.png', showOnHomepage: true, homepageOrder: '2' },
          { title: 'The One Consultant', body: 'KPIs, Targets, Optimization & Growth Strategies.', icon: 'Target', href: 'inkaholic', imageUrl: '/logo-inkaholic.png', showOnHomepage: true, homepageOrder: '3' },
          { title: 'The Cheating One', body: 'faster, better and cheaper', icon: 'Rocket', href: 'qanda-books', imageUrl: '/logo-qandabook.png', showOnHomepage: true, homepageOrder: '4' },
        ],
      },
      {
        id: 'packages',
        heading: 'The One Packages',
        body: 'Mối quan hệ nào cũng cần đúng nhịp. Chọn nhịp của bạn - mình không vội.',
        layout: 'horizontal',
        pricingNote: 'Giá thật. Không phí ẩn. Cam kết theo quý - hợp thì đi tiếp, không hợp thì chia tay văn minh, dữ liệu và tài khoản là của bạn.',
        disclaimer: '* The One không cam kết doanh thu. Về workflow, tài khoản quảng cáo và nền tảng, The One là đơn vị vận hành/đối tác triển khai, không phải đại diện của Meta, TikTok, Google hoặc Shopee.',
        items: theOnePackageItems,
        locales: {
          en: {
            body: 'Choose the growth system that fits your stage.',
            pricingNote: 'Transparent pricing. No hidden fees. Quarterly commitment - if it works, we continue; if not, we part cleanly and your data stays yours.',
            disclaimer: '* The One does not guarantee revenue. For workflows, ad accounts and platforms, The One operates as an implementation partner, not as a representative of Meta, TikTok, Google or Shopee.',
          },
        },
      },
      {
        id: 'red-flags',
        heading: 'Nghe quen không?',
        body: 'Bạn không cần thêm một agency. Bạn cần The One.',
        items: [
          { title: '"Bên em cam kết KPI, anh yên tâm" - rồi biến mất sau tháng thứ 2.', thumbnailUrl: '/logo-gg.png' },
          { title: 'Báo cáo 40 trang màu mè. Đơn hàng thì không thấy đâu.', thumbnailUrl: '/logo-gg.png' },
          { title: 'Đổi người phụ trách 3 lần một quý. Lần nào cũng kể lại từ đầu.', thumbnailUrl: '/logo-gg.png' },
          { title: 'Phí phát sinh nhiều hơn kết quả.', thumbnailUrl: '/logo-gg.png' },
        ],
        locales: {
          en: {
            heading: 'Sound familiar?',
            body: "You don't need another agency. You need The One.",
          },
        },
      },
      {
        id: 'people',
        heading: 'The One People',
        body: 'Những người đã bỏ việc 9-5 để làm "người ấy" của bạn: chiến lược, content, media, thương mại, CRM và data chạy về một hướng.',
        autoSlideSeconds: '5',
        closingLine1: 'Tụi mình đã nghỉ việc 9-5 và tự mở công ty.',
        closingLine2: "Isn't it your turn now?",
        items: theOnePeopleItems,
        locales: {
          en: {
            body: 'The people behind the system: strategy, creative, media, commerce, CRM and data moving in one direction.',
            closingLine1: 'We quit our 9-5 and started our own business.',
          },
        },
      },
      {
        id: 'closing',
        heading: 'Những điều bạn ngại hỏi trong buổi hẹn đầu',
        subtitle: 'Buổi hẹn đầu không mất gì - ngoài 30 phút, và có thể là khởi đầu của một mối quan hệ lâu dài.',
        body: '',
        backgroundImageUrl: '',
        backgroundGradient: 'linear-gradient(135deg,#db2777 0%,#ef4444 48%,#f59e0b 100%)',
        backgroundOverlayOpacity: '0.62',
        ctaLabel: 'Schedule Our Date',
        items: [
          {
            title: 'Mình mới có ý tưởng, chưa có brand - The One có nhận không?',
            body: 'Có. Một nửa khách của mình bắt đầu từ con số 0. Buổi hẹn đầu chính là để xem ý tưởng của bạn cần gì trước.',
          },
          {
            title: 'Hợp đồng tối thiểu bao lâu? Dừng giữa chừng thế nào?',
            body: 'Cam kết theo quý. Muốn dừng, báo trước 30 ngày - bàn giao sạch sẽ, tài khoản và dữ liệu là của bạn. Mình giữ người bằng kết quả, không bằng điều khoản.',
          },
          {
            title: '15 triệu/tháng gồm gì - và KHÔNG gồm gì?',
            body: 'Gồm đội vận hành đủ vai trò theo gói bạn chọn. Không gồm ngân sách ads: tiền ads là của bạn, chạy trên tài khoản của bạn, mình thu phần quản lý trên chi tiêu thực.',
          },
          {
            title: 'Tháng đầu tiên diễn ra thế nào?',
            body: 'Tuần 1: mình khám toàn bộ kênh, số, sản phẩm. Tuần 2: chốt kế hoạch và KPI. Tuần 3-4: chạy và ra báo cáo đầu tiên. Bạn luôn biết mình đang ở đâu.',
          },
          {
            title: 'Team mình nhỏ, chưa có ai làm content - ai làm gì?',
            body: 'Mình làm phần nặng: chiến lược, sản xuất, đăng tải, tối ưu. Bạn làm phần chỉ bạn làm được: hiểu sản phẩm và quyết định. Mỗi tuần bạn cần 1-2 giờ với mình, không hơn.',
          },
          {
            title: 'Làm sao mình biết có hiệu quả?',
            body: 'Report số thật hằng tuần trên dashboard chung: đơn hàng, doanh thu, chi phí. Số xấu mình cũng đưa, kèm phương án. Yêu nhau thì không giấu số.',
          },
        ],
        locales: {
          en: {
            heading: 'Frequently Asked Questions',
            subtitle: 'The first date costs nothing except 30 minutes - and it might be the beginning of a long-term growth relationship.',
          },
        },
      },
    ],
  },
  {
    id: 'the-one',
    title: 'The One Stories',
    status: 'published',
    meta: {
      ...compactTheOneByLang.vi.meta,
      path: '/the-one',
      title: 'The One Stories | Case Studies - GG99',
      description:
        'Khách thật, số thật và những mối quan hệ tăng trưởng của The One - GG99 với các brand startup và SME.',
      ogTitle: 'The One Stories | GG99',
      ogDescription: 'Khách thật, số thật - client stories từ The One - GG99.',
    },
    metaLocales: {
      en: {
        ...compactTheOneByLang.en.meta,
        path: '/en/the-one',
        title: 'The One Stories | Client Case Studies - GG99',
        description:
          'Real brands, real growth. See how startups and SMEs partner with The One - GG99 on brand, website, CRM, automation and performance marketing.',
        ogTitle: 'The One Stories | GG99',
        ogDescription: 'Real brands, real growth - client stories from The One - GG99.',
      },
    },
    blocks: [
      {
        id: 'hero',
        heading: 'The One Stories',
        body: 'Khách thật. Số thật. Và những mối quan hệ chưa ai ghost ai.',
        imageUrl: '/logo-gg.png',
        imageAlt: 'The One - GG99',
        locales: {
          en: {
            body: "Real brands we've partnered with. Every story below is a client on The One growth system.",
          },
        },
      },
      {
        id: 'stories',
        heading: 'Story order',
        body: 'Sắp xếp case study ở đây để quyết định brand nào xuất hiện trước trên The One Stories và homepage showcase. Href phải trùng story id.',
        items: theOneStoryItems,
        locales: {
          en: {
            body: 'Reorder the items below to control which brand appears first on The One Stories page and homepage showcase. Keep each Href equal to the story id.',
          },
        },
      },
    ],
  },
  {
    id: 'packages',
    title: 'Packages',
    status: 'published',
    meta: { ...packagesMetaByLang.vi, path: '/packages' },
    metaLocales: {
      en: packagesMetaByLang.en,
    },
    blocks: [
      {
        id: 'intro',
        heading: theOnePackagesByLang.vi.h1,
        body: `${theOnePackagesByLang.vi.subtitle}\n\n${theOnePackagesByLang.vi.intro}`,
        imageUrl: '/logo-gg.png',
        imageAlt: 'The One Packages — GG99',
        locales: {
          en: {
            heading: theOnePackagesByLang.en.h1,
            body: `${theOnePackagesByLang.en.subtitle}\n\n${theOnePackagesByLang.en.intro}`,
          },
        },
      },
      {
        id: 'packages',
        heading: 'The One Packages',
        body: 'Mối quan hệ nào cũng cần đúng nhịp. Chọn nhịp của bạn - mình không vội.',
        pricingNote: 'Giá thật. Không phí ẩn. Cam kết theo quý - hợp thì đi tiếp, không hợp thì chia tay văn minh, dữ liệu và tài khoản là của bạn.',
        items: theOnePackageItems,
        locales: {
          en: {
            body: 'Choose the growth system that fits your stage.',
            pricingNote: 'Transparent pricing. No hidden fees. Quarterly commitment - if it works, we continue; if not, we part cleanly and your data stays yours.',
          },
        },
      },
    ],
  },
  ...packageDetailPages,
  {
    id: 'about',
    title: 'About',
    status: 'published',
    meta: { ...aboutMetaByLang.vi, path: '/about' },
    metaLocales: {
      en: aboutMetaByLang.en,
    },
    blocks: [
      {
        id: 'hero',
        heading: compactAboutByLang.vi.hero.h1,
        body: compactAboutByLang.vi.hero.intro,
        imageUrl: '/logo-gg.png',
        imageAlt: 'The One - GG99',
        locales: {
          en: {
            heading: compactAboutByLang.en.hero.h1,
            body: compactAboutByLang.en.hero.intro,
          },
        },
      },
      {
        id: 'cards',
        heading: 'GG99 xây gì',
        body: compactAboutByLang.vi.cards.map((card) => `${card.title}: ${card.text}`).join('\n'),
        items: compactAboutByLang.vi.cards.map((card, index) => ({
          title: card.title,
          body: card.text,
          icon: ['Search', 'BarChart3', 'BadgeCheck', 'Settings2'][index],
          locales: {
            en: {
              title: compactAboutByLang.en.cards[index]?.title ?? card.title,
              body: compactAboutByLang.en.cards[index]?.text ?? card.text,
            },
          },
        })),
        locales: {
          en: {
            heading: 'About cards',
            body: compactAboutByLang.en.cards.map((card) => `${card.title}: ${card.text}`).join('\n'),
          },
        },
      },
    ],
  },
  {
    id: 'services',
    title: 'Services',
    status: 'published',
    meta: servicesMetaVi,
    metaLocales: {
      en: servicesMeta,
    },
    blocks: [
      {
        id: 'intro',
        heading: 'Services',
        body: servicesMetaVi.description,
        items: [
          { title: 'Brand', body: 'Định vị, nhận diện và campaign direction.', icon: 'BadgeCheck', locales: { en: { body: 'Identity, positioning and campaign direction.' } } },
          { title: 'Website development', body: 'Landing page, booking flow và web system sẵn sàng bán.', icon: 'Globe2', locales: { en: { body: 'Landing pages, booking flows and sales-ready web systems.' } } },
          { title: 'CRM', body: 'Customer data, form và lifecycle workflow.', icon: 'Users', locales: { en: { body: 'Customer data, forms and lifecycle workflows.' } } },
          { title: 'Marketing automation', body: 'Journey, reminder và workflow vận hành được kết nối.', icon: 'Workflow', locales: { en: { body: 'Connected journeys, reminders and operating workflows.' } } },
          { title: 'Performance marketing', body: 'Paid media planning, reporting và optimization.', icon: 'Megaphone', locales: { en: { body: 'Paid media planning, reporting and optimization.' } } },
        ],
        locales: {
          en: {
            body: servicesMeta.description,
          },
        },
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    status: 'published',
    meta: contactMetaVi,
    metaLocales: {
      en: contactMeta,
    },
    blocks: [
      {
        id: 'intro',
        heading: 'Contact The One',
        body: contactMetaVi.description,
        items: contactItems.map((item) => ({
          ...item,
          body: item.title === 'Office' ? 'Hà Nội, Việt Nam' : item.body,
          locales: {
            en: {
              body: item.body,
            },
          },
        })),
        locales: {
          en: {
            heading: 'Contact GG99',
            body: contactMeta.description,
          },
        },
      },
    ],
  },
]

export const defaultCmsInsights: CmsInsightContent[] = insightPosts.map((post) => ({
  slug: post.slug,
  title: post.title,
  status: 'published',
  meta: post.meta,
  excerpt: post.excerpt,
  category: post.category,
  coverImage: post.coverImage,
  coverImageUrl: post.coverImage,
  coverAlt: post.coverAlt,
  datePublished: post.datePublished,
  dateModified: post.dateModified,
  sections: post.sections,
  ctaHref: post.ctaHref,
  ctaLabel: post.ctaLabel,
}))
