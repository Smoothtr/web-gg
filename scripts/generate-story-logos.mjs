import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const OUTPUT_DIR = path.join(ROOT, 'public', 'story-logos')
const CANVAS_SIZE = 384
const SAFE_AREA = 28
const CONTENT_SIZE = CANVAS_SIZE - SAFE_AREA * 2
const AVATAR_CONTENT_SIZE = 352

const logos = {
  phinoi: 'logo-phinoi.png',
  cotacuti: 'logo-cotacuti.png',
  inkaholic: 'logo-inkaholic.png',
  qandabook: 'logo-qandabook.png',
  curnon: 'logo-curnon.png',
  annita: 'logo-annita.png',
  gg: 'logo-gg.png',
}

await mkdir(OUTPUT_DIR, { recursive: true })

for (const [name, sourceName] of Object.entries(logos)) {
  const source = path.join(ROOT, 'public', sourceName)
  const output = path.join(OUTPUT_DIR, `${name}.webp`)
  const trimmed = await sharp(source).trim().toBuffer()

  await sharp(trimmed)
    .resize(CONTENT_SIZE, CONTENT_SIZE, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .extend({
      top: SAFE_AREA,
      bottom: SAFE_AREA,
      left: SAFE_AREA,
      right: SAFE_AREA,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ lossless: true, effort: 6 })
    .toFile(output)
}

// A wordmark is not a profile picture. These two brands need a purpose-built
// square composition so the Instagram circle never crops through their names.
// QANDA preserves every element of its lockup in a compact two-tier layout;
// GG99 uses its 99 monogram only.
const qandaSource = path.join(ROOT, 'public', 'logo-qandabook.png')
const [qandaMark, qandaStudy, qandaUnderline, qandaBook] = await Promise.all([
  sharp(qandaSource).extract({ left: 140, top: 348, width: 100, height: 100 }).resize(150, 150, { fit: 'contain', kernel: sharp.kernel.lanczos3 }).png().toBuffer(),
  sharp(qandaSource).extract({ left: 245, top: 345, width: 190, height: 80 }).resize(190, 80, { fit: 'contain', kernel: sharp.kernel.lanczos3 }).png().toBuffer(),
  sharp(qandaSource).extract({ left: 245, top: 409, width: 190, height: 40 }).resize(190, 40, { fit: 'contain', kernel: sharp.kernel.lanczos3 }).png().toBuffer(),
  sharp(qandaSource).extract({ left: 435, top: 360, width: 210, height: 100 }).resize(190, 86, { fit: 'fill', kernel: sharp.kernel.lanczos3 }).png().toBuffer(),
])

await sharp({
  create: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([
    { input: qandaMark, left: 27, top: 118 },
    { input: qandaStudy, left: 166, top: 94 },
    { input: qandaUnderline, left: 166, top: 169 },
    { input: qandaBook, left: 160, top: 215 },
  ])
  .webp({ lossless: true, effort: 6 })
  .toFile(path.join(OUTPUT_DIR, 'qandabook-avatar.webp'))

const ggAvatar = await sharp(path.join(ROOT, 'public', 'logo-gg.png'))
  .extract({ left: 16, top: 100, width: 768, height: 530 })
  .resize(AVATAR_CONTENT_SIZE, AVATAR_CONTENT_SIZE, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    kernel: sharp.kernel.lanczos3,
  })
  .png()
  .toBuffer()

await sharp({
  create: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: ggAvatar, gravity: 'center' }])
  .webp({ lossless: true, effort: 6 })
  .toFile(path.join(OUTPUT_DIR, 'gg-avatar.webp'))

console.log(`Generated ${Object.keys(logos).length} normalized Story logos and 2 dedicated avatar compositions in ${OUTPUT_DIR}`)
