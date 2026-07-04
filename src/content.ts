export const company = {
  name: 'The One - GG99',
  tagline: 'Đối tác vận hành & tăng trưởng',
  description: 'The One - GG99 giúp doanh nghiệp vận hành gọn hơn, bán hàng hiệu quả hơn và quản trị bằng dữ liệu.',
  email: 'smooth@gg99.vn',
  zalo: 'https://zalo.me/0965650416',
  address: 'Hà Nội, Việt Nam',
}

export const seo = {
  title: 'The One - GG99 — Đối tác vận hành & tăng trưởng cho doanh nghiệp',
  description:
    'The One - GG99 giúp doanh nghiệp vận hành gọn hơn, bán hàng hiệu quả hơn và quản trị bằng dữ liệu.',
  ogTitle: 'The One - GG99 — Đối tác vận hành & tăng trưởng',
  ogDescription:
    'Ecommerce, marketing, nhân sự, chi phí và dashboard — kết nối trong một hệ thống vận hành gọn, rõ, đo được.',
}

export const nav = {
  links: [
    { label: 'Giải pháp', href: '#solutions' },
    { label: 'Cách làm việc', href: '#how' },
    { label: 'Vì sao chọn GG', href: '#whyus' },
    { label: 'Liên hệ', href: '#contact' },
  ],
  cta: 'Nhận tư vấn',
}

export const hero = {
  badge: 'Business Operation & Growth Partner',
  headline: 'Đối tác vận hành & tăng trưởng',
  headlineHighlight: 'cho doanh nghiệp',
  subtext:
    'GG Consulting giúp doanh nghiệp vận hành gọn hơn, bán hàng hiệu quả hơn và quản trị bằng dữ liệu.',
  ctaPrimary: 'Nhận tư vấn mô hình phù hợp →',
  ctaSecondary: 'Xem giải pháp',
  stats: [
    { value: '50+', label: 'Dự án triển khai' },
    { value: '30+', label: 'Doanh nghiệp' },
    { value: '6 lĩnh vực', label: 'Vận hành' },
  ],
}

// imgW/imgH: full canvas rendered size. imgL/imgT: offset so artwork centers in 160×56px slot.
// Compact logos (ratio<3.5) → 40px artwork height. Wide logos → 110px artwork width.
// slotW = artW + 64px (32px padding each side) → spacing always equal regardless of logo size
export const clients = [
  { name: 'Wefresh Market', logo: '/logo-wefresh.png',    slotW: 139, imgW: 125, imgH: 125, imgL: 5,  imgT: -27 },
  { name: 'Cota Cuti',      logo: '/logo-cotacuti.png',   slotW: 174, imgW: 173, imgH: 173, imgL: 1,  imgT: -54 },
  { name: 'Curnon',         logo: '/logo-curnon.png',     slotW: 130, imgW: 108, imgH: 108, imgL: 11, imgT: -26 },
  { name: 'Phi Noi',        logo: '/logo-phinoi.png',     slotW: 174, imgW: 183, imgH: 183, imgL: -4, imgT: -63 },
  { name: 'HIS',            logo: '/logo-his.png',        slotW: 119, imgW: 126, imgH: 126, imgL: -3, imgT: -33 },
  { name: 'Inkaholic',      logo: '/logo-inkaholic.png',  slotW: 174, imgW: 174, imgH: 174, imgL: 0,  imgT: -59 },
  { name: 'Qanda Book',     logo: '/logo-qandabook.png',  slotW: 174, imgW: 177, imgH: 177, imgL: -1, imgT: -59 },
  { name: 'DTX Asia',       logo: '/logo-dtxasia.png',    slotW: 141, imgW: 126, imgH: 126, imgL: 9,  imgT: -39 },
  { name: 'Annita',         logo: '/logo-annita.png',     slotW: 221, imgW: 240, imgH: 240, imgL: -9, imgT: -92 },
]

export const painPoints = {
  sectionLabel: 'Vấn đề thường gặp',
  headline: 'Doanh nghiệp đang lớn lên, nhưng hệ thống chưa theo kịp?',
  items: [
    'Nhiều việc nhưng khó kiểm soát',
    'Bán hàng online nhưng thiếu báo cáo rõ ràng',
    'Marketing, sales, nhân sự vận hành rời rạc',
    'Chi phí tăng nhưng chưa đo được hiệu quả',
    'Chủ doanh nghiệp phải tự xử lý quá nhiều việc',
  ],
}

export const solutions = {
  sectionLabel: 'Giải pháp',
  headline: 'Một đối tác cho nhiều đầu việc vận hành',
  pillars: [
    {
      num: '01',
      icon: '🛒',
      title: 'Ecommerce Operation',
      desc: 'Quản lý sàn, sản phẩm, khuyến mãi, vận hành đơn hàng, báo cáo.',
      tags: ['Shopee', 'TikTok Shop', 'Website', 'Đơn hàng', 'KPI'],
    },
    {
      num: '02',
      icon: '📱',
      title: 'Social & Growth',
      desc: 'TikTok, content, KOC/KOL, livestream, quảng cáo.',
      tags: ['TikTok', 'Content', 'KOC/KOL', 'Livestream', 'Ads'],
    },
    {
      num: '03',
      icon: '🏢',
      title: 'Business Operation',
      desc: 'Quy trình, nhân sự, chi phí, dashboard, hệ thống quản trị.',
      tags: ['Quy trình', 'Nhân sự', 'Chi phí', 'Dashboard', 'Data'],
    },
    {
      num: '04',
      icon: '💻',
      title: 'Website & Digital System',
      desc: 'Landing page, website doanh nghiệp, tracking, automation.',
      tags: ['Landing page', 'Website', 'Tracking', 'Automation'],
    },
  ],
}

export const howSection = {
  sectionLabel: 'Cách làm việc',
  headline: 'Bắt đầu từ hiện trạng, không từ gói có sẵn',
  body: '',
  ctaLabel: 'Nhận tư vấn mô hình phù hợp →',
  steps: [
    {
      icon: '🔍',
      title: 'Rà soát hiện trạng',
      desc: 'Hiểu rõ cách doanh nghiệp đang vận hành.',
    },
    {
      icon: '🎯',
      title: 'Xác định điểm nghẽn',
      desc: 'Tìm ra chỗ đang mất thời gian, tiền bạc và hiệu suất.',
    },
    {
      icon: '🔧',
      title: 'Đề xuất mô hình phù hợp',
      desc: 'Thiết kế hệ thống theo đúng giai đoạn của doanh nghiệp.',
    },
    {
      icon: '⚙️',
      title: 'Đồng hành triển khai & tối ưu',
      desc: 'Cùng vận hành, đo KPI và cải thiện liên tục.',
    },
  ],
}

export const whyUs = {
  sectionLabel: 'Vì sao chọn chúng tôi',
  headline: 'Vì sao chọn GG?',
  reasons: [
    {
      icon: '🧠',
      title: 'Hiểu vận hành thực tế',
      desc: 'Không chỉ tư vấn — chúng tôi cùng triển khai.',
      featured: false,
    },
    {
      icon: '🔗',
      title: 'Kết nối các mảng với nhau',
      desc: 'Ecommerce, marketing, nhân sự và chi phí được kết nối, không rời rạc.',
      featured: true,
    },
    {
      icon: '📊',
      title: 'Làm việc theo dữ liệu',
      desc: 'Mọi quyết định dựa trên KPI và số liệu thực tế.',
      featured: false,
    },
    {
      icon: '🔄',
      title: 'Linh hoạt theo từng giai đoạn',
      desc: 'Mô hình được điều chỉnh theo nhu cầu thực tế của doanh nghiệp.',
      featured: false,
    },
    {
      icon: '💰',
      title: 'Chi phí linh hoạt',
      desc: 'Đồng hành theo quy mô doanh nghiệp, chỉ từ 7 triệu/tháng.',
      featured: false,
    },
  ],
  stats: [
    { value: '50+', label: 'Dự án' },
    { value: '6 lĩnh vực', label: 'Vận hành' },
    { value: 'Theo tháng', label: 'Đồng hành' },
  ],
}

export const cta = {
  headline: 'Muốn vận hành doanh nghiệp rõ ràng hơn?',
  subtext:
    'Gửi cho chúng tôi tình trạng hiện tại. The One - GG99 sẽ tư vấn mô hình phù hợp với giai đoạn của bạn.',
  ctaLabel: 'Liên hệ tư vấn →',
}

export const footerSolutions = [
  { label: 'Ecommerce Operation',    href: '#solution-01' },
  { label: 'Social & Growth',        href: '#solution-02' },
  { label: 'Business Operation',     href: '#solution-03' },
  { label: 'Website & Digital System', href: '#solution-04' },
]
