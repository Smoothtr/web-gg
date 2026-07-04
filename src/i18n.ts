export type Lang = 'vi' | 'en' | 'ko'

export interface DashboardMetric { label: string; val: string; change: string }

export interface ContentShape {
  seo: { title: string; description: string; lang: string }
  company: {
    name: string
    tagline: string
    email: string
    zalo: string
    address: string
    chat: { app: 'zalo' | 'whatsapp' | 'kakao'; url: string; label: string }
  }
  ui: {
    navCta: string
    heroCta1: string
    ctaBtn1: string
    contactViaZalo: string
    footerDesc: string
    footerColSolutions: string
    footerColNav: string
    footerColContact: string
    copyright: string
    privacy: string
    terms: string
    scrollTop: string
    dashboardMetrics: DashboardMetric[]
  }
  nav: { links: { label: string; href: string }[] }
  hero: {
    badge: string
    headline: string
    headlineHighlight: string
    subtext: string
    stats: { value: string; label: string }[]
  }
  whoIsThisFor: {
    badge: string
    headline: string
    cards: { icon: string; title: string; desc: string }[]
  }
  painPoints: {
    sectionLabel: string
    headline: string
    items: string[]
  }
  solutions: {
    sectionLabel: string
    headline: string
    pillars: { num: string; icon: string; title: string; desc: string; tags: string[] }[]
  }
  howSection: {
    sectionLabel: string
    headline: string
    ctaLabel: string
    steps: { icon: string; title: string; desc: string }[]
  }
  whyUs: {
    sectionLabel: string
    headline: string
    reasons: { icon: string; title: string; desc: string; featured: boolean }[]
    stats: { value: string; label: string }[]
  }
  cta: { headline: string; subtext: string }
  footerSolutions: { label: string; href: string }[]
}

export const i18n: Record<Lang, ContentShape> = {
  vi: {
    seo: {
      title: 'The One - GG99 — Đối tác vận hành & tăng trưởng cho Startups & SMEs',
      description:
        'Luôn luôn có 1 cách tốt hơn. Cắt giảm chi phí - tối giản vận hành - tối ưu lợi nhuận - bất cứ thứ gì bạn đang bán.',
      lang: 'vi',
    },
    company: {
      name: 'The One - GG99',
      tagline: 'One partner. One system. One growth direction.',
      email: 'smooth@gg99.vn',
      zalo: 'https://zalo.me/0965650416',
      address: 'Hà Nội, Việt Nam',
      chat: { app: 'zalo', url: 'https://zalo.me/0965650416', label: 'Zalo' },
    },
    ui: {
      navCta: 'Đặt lịch tư vấn',
      heroCta1: 'Đặt lịch tư vấn miễn phí →',
      ctaBtn1: 'Đặt lịch tư vấn miễn phí →',
      contactViaZalo: 'Zalo',
      footerDesc:
        'Business operation, marketing systems, CRM, e-commerce growth and AI-ready business infrastructure.',
      footerColSolutions: 'The One Packages',
      footerColNav: 'Điều hướng',
      footerColContact: 'Liên hệ',
      copyright: '© 2026 The One - GG99. Tất cả quyền được bảo lưu.',
      privacy: 'Chính sách bảo mật',
      terms: 'Điều khoản sử dụng',
      scrollTop: 'Lên đầu trang',
      dashboardMetrics: [
        { label: 'Doanh thu', val: '₫682M', change: '↑18%' },
        { label: 'Đơn hàng', val: '2,481', change: '↑24%' },
        { label: 'ROAS', val: '4.2x', change: '↑' },
        { label: 'Chi phí', val: '↓12%', change: '✓' },
      ],
    },
    nav: {
      links: [
        { label: 'Giải pháp', href: '#solutions' },
        { label: 'Cách làm việc', href: '#process' },
        { label: 'Vì sao chọn GG', href: '#why-us' },
        { label: 'Giới thiệu', href: '/gioi-thieu' },
        { label: 'Liên hệ', href: '#contact' },
      ],
    },
    hero: {
      badge: 'Business Operation & Growth Partner',
      headline: 'Đối tác vận hành & tăng trưởng',
      headlineHighlight: 'cho Startups & SMEs',
      subtext:
        'Luôn luôn có 1 cách tốt hơn.\nCắt giảm chi phí - tối giản vận hành - tối ưu lợi nhuận - bất cứ thứ gì bạn đang bán.',
      stats: [
        { value: '50+', label: 'Dự án triển khai' },
        { value: '30+', label: 'Doanh nghiệp' },
        { value: '6 lĩnh vực', label: 'Vận hành' },
      ],
    },
    whoIsThisFor: {
      badge: "Let's Grow Together",
      headline: 'Bạn là ai?',
      cards: [
        {
          icon: '🚀',
          title: 'Product Owner/ New Startups',
          desc: 'Hỗ trợ định hướng - xây dựng cấu trúc business/ MVP tối giản - hiệu quả nhất có thể.',
        },
        {
          icon: '🏪',
          title: 'Startups/ SMEs Truyền thống',
          desc: 'Mở rộng hệ thống phân phối - phát triển sản phẩm đa kênh/ đa điểm chạm với Khách hàng - Online/ Offline.',
        },
        {
          icon: '📈',
          title: 'Brands/ SMEs Looking for Growth',
          desc: 'Tối ưu nguồn lực vận hành - Tìm giải pháp nâng cao hiệu suất kinh doanh.',
        },
        {
          icon: '🏢',
          title: 'Corporate/ Global Brands',
          desc: 'Đơn giản, một đội ngũ outsource performance vận hành như một cỗ máy.',
        },
      ],
    },
    painPoints: {
      sectionLabel: 'Bạn đang tự hỏi?',
      headline: 'Cần câu trả lời cho những câu hỏi này?',
      items: [
        'Nên bắt đầu từ đâu?',
        'Cắt giảm, duy trì hay đầu tư?',
        'Làm thế nào để tăng được lợi nhuận?',
        'AI có thể support được gì cho business của mình?',
        'Tại sao "nó" làm như vậy được mà mình không làm được?',
      ],
    },
    solutions: {
      sectionLabel: 'Giải pháp',
      headline: 'Một đối tác cho nhiều đầu việc vận hành',
      pillars: [
        {
          num: '01', icon: '🛒', title: 'Ecommerce Operation',
          desc: 'Quản lý sàn, sản phẩm, khuyến mãi, vận hành đơn hàng, báo cáo.',
          tags: ['Shopee', 'TikTok Shop', 'Website', 'Đơn hàng', 'KPI'],
        },
        {
          num: '02', icon: '📱', title: 'Social & Growth',
          desc: 'TikTok, content, KOC/KOL, livestream, quảng cáo.',
          tags: ['TikTok', 'Content', 'KOC/KOL', 'Livestream', 'Ads'],
        },
        {
          num: '03', icon: '🏢', title: 'Business Operation',
          desc: 'Quy trình, nhân sự, chi phí, dashboard, hệ thống quản trị.',
          tags: ['Quy trình', 'Nhân sự', 'Chi phí', 'Dashboard', 'Data'],
        },
        {
          num: '04', icon: '💻', title: 'Website & Digital System',
          desc: 'Landing page, website doanh nghiệp, tracking, automation.',
          tags: ['Landing page', 'Website', 'Tracking', 'Automation'],
        },
      ],
    },
    howSection: {
      sectionLabel: 'Cách làm việc',
      headline: 'Bắt đầu từ hiện trạng, không từ gói có sẵn',
      ctaLabel: 'Nhận tư vấn mô hình phù hợp →',
      steps: [
        { icon: '🔍', title: 'Rà soát hiện trạng', desc: 'Hiểu rõ cách doanh nghiệp đang vận hành.' },
        { icon: '🎯', title: 'Xác định điểm nghẽn', desc: 'Tìm ra chỗ đang mất thời gian, tiền bạc và hiệu suất.' },
        { icon: '🔧', title: 'Đề xuất mô hình phù hợp', desc: 'Thiết kế hệ thống theo đúng giai đoạn của doanh nghiệp.' },
        { icon: '⚙️', title: 'Đồng hành triển khai & tối ưu', desc: 'Cùng vận hành, đo KPI và cải thiện liên tục.' },
      ],
    },
    whyUs: {
      sectionLabel: 'Vì sao chọn chúng tôi',
      headline: 'Vì sao chọn GG?',
      reasons: [
        { icon: '🧠', title: 'Hiểu vận hành thực tế', desc: 'Không chỉ tư vấn — chúng tôi cùng triển khai.', featured: false },
        { icon: '🔗', title: 'Kết nối các mảng với nhau', desc: 'Ecommerce, marketing, nhân sự và chi phí được kết nối, không rời rạc.', featured: true },
        { icon: '📊', title: 'Làm việc theo dữ liệu', desc: 'Mọi quyết định dựa trên KPI và số liệu thực tế.', featured: false },
        { icon: '🔄', title: 'Linh hoạt theo từng giai đoạn', desc: 'Mô hình được điều chỉnh theo nhu cầu thực tế của doanh nghiệp.', featured: false },
        { icon: '💰', title: 'Chi phí linh hoạt', desc: 'Đồng hành theo quy mô doanh nghiệp, chỉ từ 7 triệu/tháng.', featured: false },
      ],
      stats: [
        { value: '50+', label: 'Dự án' },
        { value: '6 lĩnh vực', label: 'Vận hành' },
        { value: 'Theo tháng', label: 'Đồng hành' },
      ],
    },
    cta: {
      headline: 'Muốn vận hành doanh nghiệp rõ ràng hơn?',
      subtext:
        'Gửi cho chúng tôi tình trạng hiện tại. The One - GG99 sẽ tư vấn mô hình phù hợp với giai đoạn của bạn.',
    },
    footerSolutions: [
      { label: 'The One Start', href: '/the-one-start' },
      { label: 'The One System', href: '/the-one-system' },
      { label: 'The One Scale', href: '/the-one-scale' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  en: {
    seo: {
      title: 'The One - GG99 — Operations & Growth Partner for Startups & SMEs',
      description:
        'GG helps you cut costs - streamline operations - optimise sales performance - whatever you are selling.',
      lang: 'en',
    },
    company: {
      name: 'The One - GG99',
      tagline: 'One partner. One system. One growth direction.',
      email: 'smooth@gg99.vn',
      zalo: 'https://zalo.me/0965650416',
      address: 'Hanoi, Vietnam',
      // TODO: thay số/link WhatsApp của "Smooth" nếu khác số Zalo
      chat: { app: 'whatsapp', url: 'https://wa.me/84965650416', label: 'WhatsApp' },
    },
    ui: {
      navCta: 'Call Your Shot',
      heroCta1: 'Call Your Shot',
      ctaBtn1: 'Call Your Shot',
      contactViaZalo: 'Zalo',
      footerDesc:
        'Business operation, marketing systems, CRM, e-commerce growth and AI-ready business infrastructure.',
      footerColSolutions: 'The One Packages',
      footerColNav: 'Navigation',
      footerColContact: 'Contact',
      copyright: '© 2026 The One - GG99. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      scrollTop: 'Back to top',
      dashboardMetrics: [
        { label: 'Revenue', val: '₫682M', change: '↑18%' },
        { label: 'Orders', val: '2,481', change: '↑24%' },
        { label: 'ROAS', val: '4.2x', change: '↑' },
        { label: 'Cost', val: '↓12%', change: '✓' },
      ],
    },
    nav: {
      links: [
        { label: 'Solutions', href: '#solutions' },
        { label: 'How We Work', href: '#process' },
        { label: 'Why GG', href: '#why-us' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    hero: {
      badge: 'Business Operation & Growth Partner',
      headline: 'Operations & growth partner',
      headlineHighlight: 'for Startups & SMEs',
      subtext:
        'Better ways, new ideas, new results.\nCutting costs - streamline operations - more profits - whatever you\'re selling.',
      stats: [
        { value: '50+', label: 'Projects delivered' },
        { value: '30+', label: 'Businesses' },
        { value: '6 Areas', label: 'Operations' },
      ],
    },
    whoIsThisFor: {
      badge: "Let's Grow Together",
      headline: 'Who are you?',
      cards: [
        {
          icon: '🚀',
          title: 'Product Owner / New Startups',
          desc: 'Guidance & direction — building a lean business structure / MVP that delivers maximum impact.',
        },
        {
          icon: '🏪',
          title: 'Traditional Startups / SMEs',
          desc: 'Expand distribution — develop multi-channel / multi-touchpoint products for customers — Online / Offline.',
        },
        {
          icon: '📈',
          title: 'Brands / SMEs Looking for Growth',
          desc: 'Optimise operational resources — find solutions to boost business performance.',
        },
        {
          icon: '🏢',
          title: 'Corporate / Global Brands',
          desc: 'One outsourced performance team — operating like a well-oiled machine.',
        },
      ],
    },
    painPoints: {
      sectionLabel: 'Asking yourself?',
      headline: 'Looking for answers to these questions?',
      items: [
        'Where do I even start?',
        'Should I cut costs, hold steady, or invest?',
        'How do I actually grow my profit margin?',
        'What can AI realistically do for my business?',
        'Why can they do it — and I still can\'t?',
      ],
    },
    solutions: {
      sectionLabel: 'Solutions',
      headline: 'One partner for every operational need',
      pillars: [
        {
          num: '01', icon: '🛒', title: 'Ecommerce Operation',
          desc: 'Marketplace management, product listings, promotions, order operations, and reporting.',
          tags: ['Shopee', 'TikTok Shop', 'Website', 'Orders', 'KPI'],
        },
        {
          num: '02', icon: '📱', title: 'Social & Growth',
          desc: 'TikTok, content strategy, KOC/KOL, livestreaming, and paid advertising.',
          tags: ['TikTok', 'Content', 'KOC/KOL', 'Livestream', 'Ads'],
        },
        {
          num: '03', icon: '🏢', title: 'Business Operation',
          desc: 'Processes, HR, cost management, dashboards, and management systems.',
          tags: ['Processes', 'HR', 'Cost', 'Dashboard', 'Data'],
        },
        {
          num: '04', icon: '💻', title: 'Website & Digital System',
          desc: 'Landing pages, business websites, conversion tracking, and automation.',
          tags: ['Landing Page', 'Website', 'Tracking', 'Automation'],
        },
      ],
    },
    howSection: {
      sectionLabel: 'How We Work',
      headline: 'We start from your reality, not off-the-shelf packages',
      ctaLabel: 'Call Your Shot',
      steps: [
        { icon: '🔍', title: 'Assess current state', desc: 'Understand how your business actually operates today.' },
        { icon: '🎯', title: 'Identify bottlenecks', desc: 'Pinpoint where time, money, and efficiency are being lost.' },
        { icon: '🔧', title: 'Design the right model', desc: 'Build a system tailored to your business stage and goals.' },
        { icon: '⚙️', title: 'Implement & optimize together', desc: 'Co-run operations, track KPIs, and continuously improve.' },
      ],
    },
    whyUs: {
      sectionLabel: 'Why Choose Us',
      headline: 'Why choose GG?',
      reasons: [
        { icon: '🧠', title: 'Real operational know-how', desc: 'Not just consulting — we build and run alongside you.', featured: false },
        { icon: '🔗', title: 'Everything connected', desc: 'Ecommerce, marketing, HR, and costs — linked, not siloed.', featured: true },
        { icon: '📊', title: 'Data-driven decisions', desc: 'Every decision backed by KPIs and real numbers.', featured: false },
        { icon: '🔄', title: 'Flexible at every stage', desc: 'Our model adapts to your real business needs as you grow.', featured: false },
        { icon: '💰', title: 'Flexible pricing', desc: 'Scales with your business — starting from 7M VND/month.', featured: false },
      ],
      stats: [
        { value: '50+', label: 'Projects' },
        { value: '6 Areas', label: 'Operations' },
        { value: 'Monthly', label: 'Partnership' },
      ],
    },
    cta: {
      headline: 'Ready to run your business with clarity?',
      subtext:
        'Tell us where you are today. The One - GG99 will design the right operating model for your stage.',
    },
    footerSolutions: [
      { label: 'The One Start', href: '/the-one-start' },
      { label: 'The One System', href: '/the-one-system' },
      { label: 'The One Scale', href: '/the-one-scale' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  ko: {
    seo: {
      title: 'The One - GG99 — 스타트업과 SMEs를 위한 운영 및 성장 파트너',
      description:
        '비용 절감, 운영 간소화, 수익 최적화까지. 무엇을 판매하든 더 나은 방법은 항상 있습니다.',
      lang: 'ko',
    },
    company: {
      name: 'The One - GG99',
      tagline: 'One partner. One system. One growth direction.',
      email: 'smooth@gg99.vn',
      zalo: 'https://zalo.me/0965650416',
      address: '하노이, 베트남',
      // TODO: thay link KakaoTalk của "Smooth" (open chat / channel) vào đây
      chat: { app: 'kakao', url: 'https://www.kakaocorp.com/page/service/service/KakaoTalk', label: '카카오톡' },
    },
    ui: {
      navCta: '상담 예약',
      heroCta1: '무료 상담 예약 →',
      ctaBtn1: '무료 상담 예약 →',
      contactViaZalo: 'Zalo',
      footerDesc:
        'Business operation, marketing systems, CRM, e-commerce growth and AI-ready business infrastructure.',
      footerColSolutions: 'The One Packages',
      footerColNav: '메뉴',
      footerColContact: '문의',
      copyright: '© 2026 The One - GG99. 모든 권리 보유.',
      privacy: '개인정보 처리방침',
      terms: '이용약관',
      scrollTop: '맨 위로',
      dashboardMetrics: [
        { label: '매출', val: '₫682M', change: '↑18%' },
        { label: '주문', val: '2,481', change: '↑24%' },
        { label: 'ROAS', val: '4.2x', change: '↑' },
        { label: '비용', val: '↓12%', change: '✓' },
      ],
    },
    nav: {
      links: [
        { label: '솔루션', href: '#solutions' },
        { label: '일하는 방식', href: '#process' },
        { label: 'GG를 선택하는 이유', href: '#why-us' },
        { label: '소개', href: '/about' },
        { label: '문의', href: '#contact' },
      ],
    },
    hero: {
      badge: 'Business Operation & Growth Partner',
      headline: '운영과 성장을 함께 만드는 파트너',
      headlineHighlight: '스타트업과 SMEs를 위해',
      subtext:
        '더 나은 방법은 항상 있습니다.\n비용 절감 - 운영 간소화 - 수익 최적화 - 무엇을 판매하든 함께 개선합니다.',
      stats: [
        { value: '50+', label: '진행 프로젝트' },
        { value: '30+', label: '협업 기업' },
        { value: '6개 영역', label: '운영 분야' },
      ],
    },
    whoIsThisFor: {
      badge: "Let's Grow Together",
      headline: '어떤 비즈니스를 위한 서비스인가요?',
      cards: [
        {
          icon: '🚀',
          title: 'Product Owner / 신규 스타트업',
          desc: '방향 설정부터 가볍고 효율적인 비즈니스 구조와 MVP 구축까지 지원합니다.',
        },
        {
          icon: '🏪',
          title: '전통형 스타트업 / SMEs',
          desc: '온·오프라인 유통 확장과 고객 접점을 늘리는 멀티채널 운영을 돕습니다.',
        },
        {
          icon: '📈',
          title: '성장을 원하는 브랜드 / SMEs',
          desc: '운영 리소스를 최적화하고 비즈니스 성과를 높이는 솔루션을 찾습니다.',
        },
        {
          icon: '🏢',
          title: '기업 / 글로벌 브랜드',
          desc: '하나의 아웃소싱 퍼포먼스 팀처럼 단순하고 효율적으로 운영합니다.',
        },
      ],
    },
    painPoints: {
      sectionLabel: '이런 고민이 있나요?',
      headline: '이 질문들에 대한 답이 필요하신가요?',
      items: [
        '어디서부터 시작해야 할까요?',
        '비용을 줄여야 할까요, 유지해야 할까요, 투자해야 할까요?',
        '수익성을 실제로 어떻게 높일 수 있을까요?',
        'AI가 우리 비즈니스에 어떤 도움을 줄 수 있을까요?',
        '왜 다른 곳은 되는데 우리는 안 될까요?',
      ],
    },
    solutions: {
      sectionLabel: '솔루션',
      headline: '여러 운영 과제를 하나의 파트너와 함께',
      pillars: [
        {
          num: '01', icon: '🛒', title: 'Ecommerce Operation',
          desc: '마켓플레이스 관리, 상품 운영, 프로모션, 주문 처리, 리포팅을 지원합니다.',
          tags: ['Shopee', 'TikTok Shop', 'Website', 'Orders', 'KPI'],
        },
        {
          num: '02', icon: '📱', title: 'Social & Growth',
          desc: 'TikTok, 콘텐츠 전략, KOC/KOL, 라이브커머스, 광고 운영을 함께합니다.',
          tags: ['TikTok', 'Content', 'KOC/KOL', 'Livestream', 'Ads'],
        },
        {
          num: '03', icon: '🏢', title: 'Business Operation',
          desc: '프로세스, 인사, 비용 관리, 대시보드, 운영 시스템을 정리합니다.',
          tags: ['Process', 'HR', 'Cost', 'Dashboard', 'Data'],
        },
        {
          num: '04', icon: '💻', title: 'Website & Digital System',
          desc: '랜딩페이지, 기업 웹사이트, 전환 추적, 자동화 시스템을 구축합니다.',
          tags: ['Landing Page', 'Website', 'Tracking', 'Automation'],
        },
      ],
    },
    howSection: {
      sectionLabel: '일하는 방식',
      headline: '정해진 패키지가 아니라 현재 상황에서 시작합니다',
      ctaLabel: '맞춤 운영 모델 상담하기 →',
      steps: [
        { icon: '🔍', title: '현재 상태 진단', desc: '비즈니스가 실제로 어떻게 운영되는지 파악합니다.' },
        { icon: '🎯', title: '병목 지점 파악', desc: '시간, 비용, 효율이 새는 지점을 정확히 찾습니다.' },
        { icon: '🔧', title: '맞춤 모델 설계', desc: '비즈니스 단계와 목표에 맞는 운영 시스템을 설계합니다.' },
        { icon: '⚙️', title: '실행 및 최적화 동행', desc: '운영을 함께 실행하고 KPI를 보며 지속적으로 개선합니다.' },
      ],
    },
    whyUs: {
      sectionLabel: '왜 GG인가요?',
      headline: 'The One - GG99을 선택하는 이유',
      reasons: [
        { icon: '🧠', title: '실전 운영 이해', desc: '단순 컨설팅이 아니라 함께 만들고 운영합니다.', featured: false },
        { icon: '🔗', title: '운영 전체를 연결', desc: '이커머스, 마케팅, 인사, 비용을 따로 보지 않고 연결합니다.', featured: true },
        { icon: '📊', title: '데이터 기반 의사결정', desc: '모든 결정은 KPI와 실제 숫자를 기반으로 합니다.', featured: false },
        { icon: '🔄', title: '단계별 유연한 모델', desc: '비즈니스의 실제 필요에 맞춰 모델을 조정합니다.', featured: false },
        { icon: '💰', title: '유연한 비용 구조', desc: '기업 규모에 맞춰 월 700만 동부터 함께할 수 있습니다.', featured: false },
      ],
      stats: [
        { value: '50+', label: '프로젝트' },
        { value: '6개 영역', label: '운영 분야' },
        { value: '월 단위', label: '협업' },
      ],
    },
    cta: {
      headline: '비즈니스를 더 명확하게 운영하고 싶으신가요?',
      subtext:
        '현재 상황을 알려주세요. The One - GG99이 지금 단계에 맞는 운영 모델을 제안합니다.',
    },
    footerSolutions: [
      { label: 'The One Start', href: '/the-one-start' },
      { label: 'The One System', href: '/the-one-system' },
      { label: 'The One Scale', href: '/the-one-scale' },
    ],
  },
}
