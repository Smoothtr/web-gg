// Follow-up to migrate-english-only.mjs: translate the fields that never had
// an English locale (packages disclaimer, one red-flag quote, closing FAQ,
// story testimonial quotes). One-time script.
// Usage: node --env-file=.env.local scripts/translate-remaining-vi.mjs
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
})
const db = getFirestore(app)

const homeRef = db.collection('sitePages').doc('homepage')
const home = (await homeRef.get()).data()

const packagesBlock = home.blocks.find((b) => b.id === 'packages')
if (packagesBlock) {
  packagesBlock.disclaimer =
    "* The One does not guarantee revenue. In terms of workflow, starting from the client's brief, The One conducts market research and customer research, then pitches a plan with specific target milestones, optimized case by case. 90% of results depend on the product, the founder and the company's internal strength. The One is not a representative of Meta, TikTok, Google or Shopee in the Vietnam market."
}

const redFlagsBlock = home.blocks.find((b) => b.id === 'red-flags')
if (redFlagsBlock?.items?.[1]) {
  redFlagsBlock.items[1].title = '"It\'ll definitely go viral, we\'ve done tons of cases."'
}

const closingBlock = home.blocks.find((b) => b.id === 'closing')
const faqTranslations = [
  ['We only have an idea, no brand yet - is The One a fit?', "Yes. Half of The One's clients started from zero."],
  [
    'What is the minimum contract? What if we stop midway?',
    'Quarterly commitment. To stop, give 30 days notice - clean handover, and the accounts and data are yours. The One keeps clients with results, not with contract terms.',
  ],
  [
    'What does 15M VND/month include - and NOT include?',
    'It includes a full operating team for the package you choose. It does not include ad budget: the ad spend is yours, running on your own accounts, and The One charges a management fee on actual spend.',
  ],
  [
    'What does the first month look like?',
    'Week 1: The One audits your channels, numbers and product. Week 2: plan and KPIs locked. Weeks 3-4: execution and the first report. You always know where you stand.',
  ],
  [
    'Our team is small with no content people - who does what?',
    'The One does the heavy lifting: strategy, production, publishing, optimization. You do what only you can: understand the product and make decisions. You need 1-2 hours a week with The One, no more.',
  ],
  [
    'How do we know it is working?',
    "Real numbers reported weekly on a shared dashboard: orders, revenue, costs. Bad numbers get reported too, along with an action plan. Once we're 'in love', honesty is the deal.",
  ],
]
if (closingBlock?.items) {
  closingBlock.items.forEach((item, index) => {
    const translation = faqTranslations[index]
    if (!translation) return
    item.title = translation[0]
    item.body = translation[1]
  })
}

await homeRef.set(home)
console.log('homepage updated')

const theOneRef = db.collection('sitePages').doc('the-one')
const theOne = (await theOneRef.get()).data()
const storiesBlock = theOne.blocks.find((b) => b.id === 'stories') ?? theOne.blocks[1]
const quoteTranslations = {
  PHINƠI: 'The One helped us see e-commerce as an operating system, not just a few scattered campaigns.',
  'cota.cuti': 'From a small eyewear idea, we now have a real sales system where we can see the numbers every day.',
  INKAHOLIC: 'The One operates like family - close enough to spot problems before they become a crisis.',
  'QANDA Books': 'The most valuable thing is that we know every day where our ad money is going and which SKUs actually drive revenue.',
  CURNON: 'The One helped us grow while keeping our brand discipline.',
  'ANNITA STUDIOS': "The One doesn't just run ads. They left our team an operating system we can keep using.",
}
storiesBlock.items.forEach((item) => {
  const translation = quoteTranslations[item.title]
  if (translation) item.testimonialQuote = translation
})

await theOneRef.set(theOne)
console.log('the-one updated')
