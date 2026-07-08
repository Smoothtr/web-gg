// Round 8 data pass: heading "Sounds familiar?", 7 human replies with DiceBear
// avatars + natural like counts (A3.2), System package price fix (A4.6).
// Usage: node --env-file=.env.local scripts/round8-cms-data.mjs
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

const dicebear = (seed) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffdfeb,ffe8d9,fff1cc`

const homeRef = db.collection('sitePages').doc('homepage')
const home = (await homeRef.get()).data()

const redFlags = home.blocks.find((b) => b.id === 'red-flags')
if (redFlags) {
  redFlags.heading = 'Sounds familiar?'
  redFlags.items = [
    {
      title: 'mocha.went.broke',
      handle: 'mocha.went.broke',
      roleLabel: 'coffee shop owner',
      likes: '674',
      avatarUrl: dicebear('mocha.went.broke'),
      body: 'The old agency pampered us hard for the first two weeks. By month two, replies took three days. When I finally initiated the breakup, they… left me on seen.',
      published: true,
    },
    {
      title: 'linhh.decor',
      handle: 'linhh.decor',
      roleLabel: 'interior decor founder',
      likes: '231',
      avatarUrl: dicebear('linhh.decor'),
      body: 'A 40-page report, every single page gorgeous. Orders that month: 4.',
      published: true,
    },
    {
      title: 'beplus.fashion',
      handle: 'beplus.fashion',
      roleLabel: 'local fashion brand',
      likes: '189',
      avatarUrl: dicebear('beplus.fashion'),
      body: 'Three account managers in one quarter. Every time I retold our brand story from scratch. Forever first dates, never a wedding.',
      published: true,
    },
    {
      title: 'tuan.fnb',
      handle: 'tuan.fnb',
      roleLabel: 'F&B chain owner',
      likes: '402',
      avatarUrl: dicebear('tuan.fnb'),
      body: 'Ask for the numbers: "we\'re still compiling". Send the extra-fees invoice: replied in 5 minutes. Genuinely impressive speed.',
      published: true,
    },
    {
      title: 'skincare.by.ha',
      handle: 'skincare.by.ha',
      roleLabel: 'skincare founder',
      likes: '158',
      avatarUrl: dicebear('skincare.by.ha'),
      body: "The pitch deck promised KPIs like poetry. End of quarter: \"the market is tough for everyone\". Umm — it's MY market.",
      published: true,
    },
    {
      title: 'noithatmoc.vn',
      handle: 'noithatmoc.vn',
      roleLabel: 'home & living SME',
      likes: '96',
      avatarUrl: dicebear('noithatmoc.vn'),
      body: 'Ran ads for three months on an account owned by the agency. After we split, I walked away with zero data. Hurts worse than an actual breakup.',
      published: true,
    },
    {
      title: 'startup.chua.dat.ten',
      handle: 'startup.chua.dat.ten',
      roleLabel: 'about to launch',
      likes: '44',
      avatarUrl: dicebear('startup.chua.dat.ten'),
      body: "I haven't even opened my brand yet and this thread already scares me. Is there anyone out there who does this properly?",
      published: true,
    },
  ]
  console.log('red-flags: heading + 7 replies with avatars seeded')
}

const packages = home.blocks.find((b) => b.id === 'packages')
if (packages) {
  const system = packages.items?.find((item) => /system/i.test(item.title))
  if (system) {
    system.priceValue = 'From 30,000,000 VND/month'
    console.log('packages: System price set to 30M (was duplicated from Start)')
  }
}

await homeRef.set(home)
console.log('homepage saved')
