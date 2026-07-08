// Round 7 data pass: Threads-style red-flags content (A3) + packages feature
// rows with group/featured (A4) + merged packagesNote. Backup first!
// Usage: node --env-file=.env.local scripts/round7-cms-data.mjs
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

// --- A3: red-flags → Threads feed ---------------------------------------
const redFlags = home.blocks.find((b) => b.id === 'red-flags')
if (redFlags) {
  redFlags.postHandle = 'founders.theone'
  redFlags.postTopic = 'Agency life'
  redFlags.postText = 'Tell us the red flags you ran into with your last agency 👇'
  // heading ("Sounds familiar?") and body (punchline) stay as-is.
  redFlags.items = [
    {
      title: 'local.fashion.brand',
      handle: 'local.fashion.brand',
      roleLabel: 'local fashion brand owner',
      likes: '214',
      body: 'First month they cared for us like a new lover. Month three: no replies, left on seen — folks, we got ghosted by our own agency.',
      published: true,
    },
    {
      title: 'beauty.founder',
      handle: 'beauty.founder',
      roleLabel: 'cosmetics founder',
      likes: '198',
      body: 'The report was 40 pages of gorgeous colors. The orders? Four.',
      published: true,
    },
    {
      title: 'fnb.chain.owner',
      handle: 'fnb.chain.owner',
      roleLabel: 'F&B chain owner',
      likes: '156',
      body: 'Three account managers in a single quarter. Every time I retold our brand story from scratch, like another first date.',
      published: true,
    },
    {
      title: 'homegoods.shop',
      handle: 'homegoods.shop',
      roleLabel: 'home goods shop owner',
      likes: '187',
      body: "Ask for the numbers: 'still compiling'. Send an extra-fee invoice: replied within 5 minutes.",
      published: true,
    },
    {
      title: 'edtech.founder',
      handle: 'edtech.founder',
      roleLabel: 'edtech founder',
      likes: '121',
      body: "The pitch deck promised KPIs like poetry. End of quarter, the KPI became 'the market is tough for everyone'.",
      published: true,
    },
  ]
  console.log('red-flags: Threads post + 5 replies seeded (meme posters removed)')
}

// --- A4: packages feature rows + single note -----------------------------
const packages = home.blocks.find((b) => b.id === 'packages')
if (packages) {
  const featureSets = {
    'The One Start': [
      { text: '45 content units/month (minimum 15 reels/short-form videos)', group: 'Content engine' },
      { text: 'Content strategy, calendar, production, posting, optimization', group: 'Content engine', featured: true },
      { text: 'Basic booking website, up to 10 landing pages', group: 'Website system', featured: true },
      { text: 'Performance marketing (% of actual ad spend)', group: 'Performance media', featured: true },
    ],
    'The One System': [
      { text: '60 content units/month (minimum 20 reels/short-form videos)', group: 'Content engine' },
      { text: 'Content strategy, calendar, production, posting, optimization', group: 'Content engine', featured: true },
      { text: 'E-commerce management (Shopee, TikTok Shop, Lazada...)', group: 'Ecommerce ops', featured: true },
      { text: 'Booking/sales website, unlimited landing pages', group: 'Website system', featured: true },
      { text: 'Performance marketing (% of actual ad spend)', group: 'Performance media', featured: true },
    ],
    'The One Scale': [
      { text: 'Everything included in The One System', group: 'System base', featured: true },
      { text: 'On-site event planning and execution', group: 'Event ops', featured: true },
      { text: 'Campaign strategy, creative direction, media planning', group: 'Campaign growth', featured: true },
      { text: 'Might be cheaper than The One Start 😉', group: '', featured: true },
    ],
  }
  packages.items = (packages.items ?? []).map((item) => {
    const features = featureSets[item.title]
    return features ? { ...item, features } : item
  })
  const mergedNote = [packages.pricingNote, packages.disclaimer].map((v) => (v ?? '').trim()).filter(Boolean).join('\n')
  packages.packagesNote = mergedNote
  delete packages.pricingNote
  delete packages.disclaimer
  console.log('packages: feature rows seeded, packagesNote merged')
}

await homeRef.set(home)
console.log('homepage saved')
