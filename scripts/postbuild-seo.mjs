import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import * as esbuild from 'esbuild'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(rootDir, 'dist')
const indexPath = path.join(distDir, 'index.html')
const compiledContentPath = path.join(distDir, 'brandContent.static.mjs')

await esbuild.build({
  entryPoints: [path.join(rootDir, 'src', 'brandContent.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: compiledContentPath,
  logLevel: 'silent',
})

const content = await import(pathToFileURL(compiledContentPath).href)
await rm(compiledContentPath, { force: true })

const baseHtml = await readFile(indexPath, 'utf8')

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function upsertHeadTag(html, regex, tag) {
  if (regex.test(html)) return html.replace(regex, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function applyHead(html, meta, schemas, lang) {
  const canonical = content.absoluteUrl(meta.path)
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  const ogTitle = escapeHtml(meta.ogTitle ?? meta.title)
  const ogDescription = escapeHtml(meta.ogDescription ?? meta.description)
  const ogImage = meta.ogImage ? content.absoluteUrl(meta.ogImage) : content.logoUrl

  let next = html.replace(/<html[^>]*>/, `<html lang="${lang}">`)
  next = next.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
  next = upsertHeadTag(next, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
  next = upsertHeadTag(next, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
  next = upsertHeadTag(next, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${ogTitle}" />`)
  next = upsertHeadTag(next, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${ogDescription}" />`)
  next = upsertHeadTag(next, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${ogImage}" />`)
  next = upsertHeadTag(next, /<meta property="og:type" content="[^"]*" \/>/, '<meta property="og:type" content="website" />')
  next = upsertHeadTag(next, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
  next = upsertHeadTag(next, /<meta name="twitter:card" content="[^"]*" \/>/, '<meta name="twitter:card" content="summary_large_image" />')
  next = upsertHeadTag(next, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${ogTitle}" />`)
  next = upsertHeadTag(next, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${ogDescription}" />`)
  next = next.replace(/\s*<script type="application\/ld\+json" data-gg99-schema="true">[\s\S]*?<\/script>/g, '')

  const schemaTags = schemas
    .map((schema) => `    <script type="application/ld+json" data-gg99-schema="true">${JSON.stringify(schema)}</script>`)
    .join('\n')
  return next.replace('</head>', `${schemaTags}\n  </head>`)
}

function staticShell(body) {
  return `
      <div class="seo-static" data-static-seo="true">
        ${body}
      </div>`
}

function hrefFor(lang, href) {
  if (href.startsWith('/en')) return href
  return content.localizedPath(lang, href)
}

const clientNames = ['Wefresh Market', 'Cota Cuti', 'Curnon', 'PHINƠI', 'HIS', 'Inkaholic', 'Qanda Book', 'DTX Asia', 'Annita']

const audienceByLang = {
  vi: {
    badge: 'Cùng tăng trưởng',
    headline: 'Bạn là ai?',
    cards: [
      ['Chủ sản phẩm / Startup mới', 'Hỗ trợ định hướng, xây cấu trúc kinh doanh và MVP tối giản, hiệu quả nhất có thể.'],
      ['Startup / SME truyền thống', 'Mở rộng hệ thống phân phối và phát triển sản phẩm đa kênh, đa điểm chạm với khách hàng.'],
      ['Thương hiệu / SME cần tăng trưởng', 'Tối ưu nguồn lực vận hành và tìm giải pháp nâng cao hiệu suất kinh doanh.'],
      ['Tập đoàn / thương hiệu toàn cầu', 'Một đội ngũ vận hành hiệu suất cao, làm việc gọn và đồng bộ như một cỗ máy.'],
    ],
    painBadge: 'Bạn đang tự hỏi?',
    painHeadline: 'Cần câu trả lời cho những câu hỏi này?',
    questions: [
      'Nên bắt đầu từ đâu?',
      'Cắt giảm, duy trì hay đầu tư?',
      'Làm thế nào để tăng được lợi nhuận?',
      'AI có thể hỗ trợ gì cho doanh nghiệp của mình?',
      'Tại sao họ làm được mà mình chưa làm được?',
    ],
  },
  en: {
    badge: "Let's Grow Together",
    headline: 'Who are you?',
    cards: [
      ['Product Owner / New Startups', 'Clarify direction, build a lean business structure and shape an MVP with focused execution.'],
      ['Traditional Startups / SMEs', 'Expand distribution and develop multi-channel customer touchpoints across online and offline.'],
      ['Brands / SMEs Looking for Growth', 'Optimize operating resources and find better ways to improve business performance.'],
      ['Corporate / Global Brands', 'One outsourced performance team operating with structure, rhythm and accountability.'],
    ],
    painBadge: 'Asking yourself?',
    painHeadline: 'Looking for answers to these questions?',
    questions: [
      'Where should we start?',
      'Cut costs, hold steady or invest?',
      'How do we grow profit?',
      'What can AI realistically support?',
      "Why can others do it and we still can't?",
    ],
  },
}

function renderHome(lang) {
  const c = content.compactHomeByLang[lang]
  const audience = audienceByLang[lang]
  return staticShell(`
        <main>
          <section>
            <h1>${escapeHtml(c.hero.title)}</h1>
            ${c.hero.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('\n')}
            ${c.hero.statement ? `<p>${escapeHtml(c.hero.statement).replace(/\n/g, '<br />')}</p>` : ''}
            <p>${escapeHtml(c.hero.description)}</p>
            <a href="${hrefFor(lang, '/the-one')}">${lang === 'vi' ? 'Tìm hiểu The One' : 'Explore The One'}</a>
            <a href="/#packages">${lang === 'vi' ? 'Xem gói dịch vụ' : 'View Packages'}</a>
          </section>
          <section>
            <h2>Clients</h2>
            <ul>${clientNames.map((name) => `<li>${escapeHtml(name)}</li>`).join('')}</ul>
          </section>
          <section>
            <p>${escapeHtml(audience.badge)}</p>
            <h2>${escapeHtml(audience.headline)}</h2>
            ${audience.cards.map(([title, text]) => `<article><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join('\n')}
          </section>
          <section>
            <p>${escapeHtml(audience.painBadge)}</p>
            <h2>${escapeHtml(audience.painHeadline)}</h2>
            <ul>${audience.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join('')}</ul>
          </section>
          <section>
            <h2>${escapeHtml(c.whatIs.title)}</h2>
            <p>${escapeHtml(c.whatIs.body)}</p>
            <ul>${c.whatIs.labels.map((label) => `<li>${escapeHtml(label)}</li>`).join('')}</ul>
          </section>
          <section>
            <h2>The One Packages</h2>
            <p>${lang === 'vi' ? 'Chọn hệ tăng trưởng phù hợp với giai đoạn của bạn.' : 'Choose the growth system that fits your stage.'}</p>
            ${c.packages.map((item) => `<article><h3><a href="${hrefFor(lang, item.href)}">${escapeHtml(item.name)}</a></h3><p>${escapeHtml(item.title)}</p><p>${escapeHtml(item.text)}</p></article>`).join('\n')}
          </section>
          <section>
            <h2>${lang === 'vi' ? 'Quy trình' : 'Process'}</h2>
            ${c.process.map((item) => `<article><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join('\n')}
          </section>
          <section>
            <h2>${escapeHtml(c.cta)}</h2>
            <a href="${hrefFor(lang, '/the-one')}">${lang === 'vi' ? 'Đặt lịch tư vấn' : 'Book a Consultation'}</a>
          </section>
        </main>`)
}

function renderTheOne(lang) {
  const c = content.compactTheOneByLang[lang]
  return staticShell(`
        <main>
          <article>
            <h1>${escapeHtml(c.hero.h1)}</h1>
            ${c.hero.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('\n')}
            <p>${escapeHtml(c.hero.intro)}</p>
            ${c.sections.map((section) => `<section><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.text)}</p></section>`).join('\n')}
            <section>
              <h2>The One Packages</h2>
              <p>${lang === 'vi' ? 'Chọn hệ tăng trưởng phù hợp với giai đoạn của bạn.' : 'Choose the growth system that fits your stage.'}</p>
              ${c.packages.map((item) => `<article><h3><a href="${hrefFor(lang, item.href)}">${escapeHtml(item.name)}</a></h3><p>${escapeHtml(item.title)}</p><p>${escapeHtml(item.text)}</p></article>`).join('\n')}
            </section>
            <section>
              <h2>${lang === 'vi' ? 'Câu hỏi thường gặp' : 'FAQ'}</h2>
              ${c.faq.map((item) => `<article><h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p></article>`).join('\n')}
            </section>
            <nav>
              <a href="${hrefFor(lang, '/')}">${lang === 'vi' ? 'Trang chủ' : 'Homepage'}</a>
              <a href="${hrefFor(lang, '/about')}">${lang === 'vi' ? 'Giới thiệu' : 'About'}</a>
            </nav>
          </article>
        </main>`)
}

function renderServices() {
  return staticShell(`
        <main>
          <article>
            <h1>Dịch vụ</h1>
            <p>GG99 cung cấp nhận diện thương hiệu, phát triển website, CRM, tự động hóa và marketing hiệu suất thông qua hệ tăng trưởng The One.</p>
            <section>
              <h2>GG99 cung cấp gì</h2>
              ${['Thương hiệu', 'Phát triển website', 'CRM', 'Tự động hóa marketing', 'Marketing hiệu suất'].map((item) => `<article><h3>${item}</h3></article>`).join('\n')}
            </section>
          </article>
        </main>`)
}

function renderContact() {
  return staticShell(`
        <main>
          <article>
            <h1>Liên hệ GG99</h1>
            <p>Liên hệ GG99, còn được biết đến là The One, để xây thương hiệu, website, CRM, tự động hóa và marketing hiệu suất trong một hệ sinh thái.</p>
            <a href="mailto:smooth@gg99.vn">smooth@gg99.vn</a>
          </article>
        </main>`)
}

function renderPackage(lang, key) {
  const page = content.compactPackageByLang[lang][key]
  return staticShell(`
        <main>
          <article>
            <h1>${escapeHtml(page.h1)}</h1>
            <p>${escapeHtml(page.hero)}</p>
            <p>${escapeHtml(page.intro)}</p>
            <section>
              <h2>${lang === 'vi' ? 'Bạn nhận được gì' : 'What you get'}</h2>
              ${page.cards.map((card) => `<article><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.text)}</p></article>`).join('\n')}
            </section>
            <section>
              <h2>${lang === 'vi' ? 'Quy trình' : 'Process'}</h2>
              ${page.process.map((step) => `<article><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.text)}</p></article>`).join('\n')}
            </section>
            <nav>
              <a href="${hrefFor(lang, '/the-one')}">The One</a>
              <a href="${hrefFor(lang, '/about')}">${lang === 'vi' ? 'Giới thiệu' : 'About'}</a>
              <a href="${hrefFor(lang, '/')}">${lang === 'vi' ? 'Trang chủ' : 'Homepage'}</a>
            </nav>
          </article>
        </main>`)
}

function renderAbout(lang) {
  const c = content.compactAboutByLang[lang]
  return staticShell(`
        <main>
          <article>
            <h1>${escapeHtml(c.hero.h1)}</h1>
            <p>${escapeHtml(c.hero.intro)}</p>
            <section>
              <h2>${lang === 'vi' ? 'GG99 xây gì' : 'What GG99 Builds'}</h2>
              ${c.cards.map((card) => `<article><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.text)}</p></article>`).join('\n')}
            </section>
            <section>
              <h2>${lang === 'vi' ? 'Quy trình' : 'Process'}</h2>
              ${c.process.map((step) => `<article><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.text)}</p></article>`).join('\n')}
            </section>
            <section>
              <h2>The One Packages</h2>
              ${content.theOnePackagesByLang[lang].packages.map((item) => `<a href="${hrefFor(lang, item.href)}">${escapeHtml(item.name)}</a>`).join('\n')}
            </section>
            <section>
              <h2>${lang === 'vi' ? 'Câu hỏi thường gặp' : 'FAQ'}</h2>
              ${c.faq.map((item) => `<article><h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p></article>`).join('\n')}
            </section>
            <nav>
              <a href="${hrefFor(lang, '/')}">${lang === 'vi' ? 'Trang chủ' : 'Homepage'}</a>
              <a href="${hrefFor(lang, '/the-one')}">The One</a>
            </nav>
          </article>
        </main>`)
}

function renderInsightsIndex() {
  const [featuredPost, ...otherPosts] = content.insightPosts
  return staticShell(`
        <main>
          <article>
            <section>
              <h1>Insights from The One — GG99</h1>
              <p>Ideas on brand, website, CRM, automation and growth systems for startups and SMEs.</p>
            </section>
            <section>
              <h2>Featured article</h2>
              <article>
                <img src="${escapeHtml(featuredPost.coverImage)}" width="1200" height="630" alt="${escapeHtml(featuredPost.coverAlt)}" />
                <h3><a href="${escapeHtml(featuredPost.path)}">${escapeHtml(featuredPost.title)}</a></h3>
                <p>${escapeHtml(featuredPost.excerpt)}</p>
              </article>
            </section>
            <section>
              <h2>Latest insights</h2>
              ${otherPosts.map((post) => `
                <article>
                  <img src="${escapeHtml(post.coverImage)}" width="1200" height="630" alt="${escapeHtml(post.coverAlt)}" />
                  <h3><a href="${escapeHtml(post.path)}">${escapeHtml(post.title)}</a></h3>
                  <p>${escapeHtml(post.excerpt)}</p>
                </article>`).join('\n')}
            </section>
            <section>
              <h2>Explore The One Packages</h2>
              <a href="/#packages">Explore The One Packages</a>
            </section>
          </article>
        </main>`)
}

function renderInsightArticle(post) {
  const relatedPosts = content.getRelatedInsightPosts(post.slug)
  return staticShell(`
        <main>
          <article>
            <nav aria-label="Breadcrumb">
              <a href="/">The One — GG99</a>
              <a href="/insights">Insights</a>
              <span>${escapeHtml(post.title)}</span>
            </nav>
            <header>
              <p>${escapeHtml(post.category)}</p>
              <h1>${escapeHtml(post.title)}</h1>
              <p>${escapeHtml(post.excerpt)}</p>
              <p>Author: GG99</p>
              <time datetime="${escapeHtml(post.datePublished)}">${escapeHtml(post.datePublished)}</time>
              <time datetime="${escapeHtml(post.dateModified)}">Modified: ${escapeHtml(post.dateModified)}</time>
              <img src="${escapeHtml(post.coverImage)}" width="1200" height="630" alt="${escapeHtml(post.coverAlt)}" />
            </header>
            ${post.sections.map((section) => `
              <section>
                <h2>${escapeHtml(section.heading)}</h2>
                ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n')}
              </section>`).join('\n')}
            <nav>
              ${content.insightInternalLinks.map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join('\n')}
            </nav>
            <section>
              <h2>Related posts</h2>
              ${relatedPosts.map((item) => `<article><h3><a href="${escapeHtml(item.path)}">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.excerpt)}</p></article>`).join('\n')}
            </section>
            <section>
              <h2>Next step</h2>
              <a href="${escapeHtml(post.ctaHref)}">${escapeHtml(post.ctaLabel)}</a>
            </section>
          </article>
        </main>`)
}

const packageKeys = ['consultant', 'agency', 'partner']
const serviceByPackage = {
  consultant: content.serviceSchemas[0],
  agency: content.serviceSchemas[1],
  partner: content.serviceSchemas[2],
}

const routes = [
  {
    path: '/',
    lang: 'vi',
    meta: content.homeMetaByLang.vi,
    body: renderHome('vi'),
    schemas: [content.organizationSchema, content.websiteSchema, content.homeWebPageSchema],
  },
  {
    path: '/en',
    lang: 'en',
    meta: content.homeMetaByLang.en,
    body: renderHome('en'),
    schemas: [content.organizationSchema, content.websiteSchema, content.homeWebPageSchema],
  },
  {
    path: '/the-one',
    lang: 'vi',
    meta: content.compactTheOneByLang.vi.meta,
    body: renderTheOne('vi'),
    schemas: [content.organizationSchema, content.websiteSchema, content.theOneFaqSchemaByLang.vi],
  },
  {
    path: '/en/the-one',
    lang: 'en',
    meta: content.compactTheOneByLang.en.meta,
    body: renderTheOne('en'),
    schemas: [content.organizationSchema, content.websiteSchema, content.theOneFaqSchemaByLang.en],
  },
  {
    path: '/insights',
    lang: 'vi',
    meta: content.insightsIndexMeta,
    body: renderInsightsIndex(),
    schemas: [content.organizationSchema, content.websiteSchema, content.insightsIndexSchema],
  },
  ...content.insightPosts.map((post) => ({
    path: post.path,
    lang: 'vi',
    meta: post.meta,
    body: renderInsightArticle(post),
    schemas: [
      content.organizationSchema,
      content.websiteSchema,
      content.insightArticleSchemas[post.slug],
      content.insightBreadcrumbSchemas[post.slug],
    ],
  })),
  ...packageKeys.flatMap((key) => [
    {
      path: `/the-one-${key}`,
      lang: 'vi',
      meta: content.compactPackageByLang.vi[key].meta,
      body: renderPackage('vi', key),
      schemas: [content.organizationSchema, serviceByPackage[key]],
    },
    {
      path: `/en/the-one-${key}`,
      lang: 'en',
      meta: content.compactPackageByLang.en[key].meta,
      body: renderPackage('en', key),
      schemas: [content.organizationSchema, serviceByPackage[key]],
    },
  ]),
  {
    path: '/about',
    lang: 'vi',
    meta: content.aboutMetaByLang.vi,
    body: renderAbout('vi'),
    schemas: [content.organizationSchema, content.websiteSchema],
  },
  {
    path: '/en/about',
    lang: 'en',
    meta: content.aboutMetaByLang.en,
    body: renderAbout('en'),
    schemas: [content.organizationSchema, content.websiteSchema],
  },
  {
    path: '/services',
    lang: 'vi',
    meta: content.servicesMeta,
    body: renderServices(),
    schemas: [content.organizationSchema, content.websiteSchema],
  },
  {
    path: '/contact',
    lang: 'vi',
    meta: content.contactMeta,
    body: renderContact(),
    schemas: [content.organizationSchema, content.websiteSchema],
  },
]

for (const route of routes) {
  const html = applyHead(baseHtml, route.meta, route.schemas, route.lang).replace(
    /<div id="root"><\/div>/,
    `<div id="root">${route.body}\n    </div>`,
  )

  const target =
    route.path === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, route.path.replace(/^\//, ''), 'index.html')
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, html, 'utf8')
}

console.log(`SEO static HTML generated for ${routes.length} routes.`)
