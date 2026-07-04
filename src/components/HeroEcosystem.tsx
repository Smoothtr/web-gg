import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'
import { Users, Megaphone, Target, Globe, TrendingUp, Building2 } from 'lucide-react'
import { whenIntroGone } from '../hooks/useIntroGate'

type TagDef = {
  Icon: typeof Users
  label: string
  color: string
  pos: string
  /** offset ban đầu (hướng về tâm) + độ sâu z khi nghỉ (parallax 3D) */
  from: { x: number; y: number; rotate: number; restZ: number }
}

const TAGS: TagDef[] = [
  { Icon: Users,      label: 'CRM',       color: 'text-indigo-400',  pos: 'top-[7%] left-0',        from: { x: 104, y: 74, rotate: -8, restZ: 42 } },
  { Icon: Megaphone,  label: 'Marketing', color: 'text-primary',     pos: 'top-[44%] left-[3%]',    from: { x: 138, y: 14, rotate: -6, restZ: 60 } },
  { Icon: Target,     label: 'Ads',       color: 'text-rose-400',    pos: 'bottom-[7%] left-[3%]',  from: { x: 106, y: -72, rotate: 8, restZ: 28 } },
  { Icon: Globe,      label: 'Website',   color: 'text-sky-400',     pos: 'top-[7%] right-0',       from: { x: -104, y: 74, rotate: 8, restZ: 36 } },
  { Icon: TrendingUp, label: 'Growth',    color: 'text-emerald-400', pos: 'top-[44%] right-[3%]',   from: { x: -138, y: 14, rotate: 6, restZ: 56 } },
  { Icon: Building2,  label: 'Operation', color: 'text-amber-400',   pos: 'bottom-[7%] right-[3%]', from: { x: -106, y: -72, rotate: -8, restZ: 22 } },
]

const TAG_CLASS =
  'hero-tag pointer-events-auto absolute inline-flex items-center gap-2 px-3 md:px-3.5 py-1.5 md:py-2 rounded-xl bg-surface-container dark:bg-surface-container-high border border-outline-variant/40 text-[11px] md:text-[13px] font-semibold text-on-surface'
const LOGO_CLASS =
  'hero-eco-logo absolute left-1/2 top-1/2 w-44 sm:w-56 md:w-64 h-44 sm:h-56 md:h-64 object-contain pointer-events-none drop-shadow-[0_0_20px_rgba(255,150,60,0.28)] dark:drop-shadow-[0_0_40px_rgba(255,140,40,0.55)]'

const clamp = (v: number) => Math.max(-1, Math.min(1, v))

/** Glow + holo ring + dashed orbit + connectors */
function EcoBackdrop({ asMotion }: { asMotion?: boolean }) {
  const rings = (
    <>
      <span className="hero-orbit-ring hero-orbit-ring--lg" />
      <span className="hero-orbit-ring hero-orbit-ring--sm" />
      <svg className="hero-connectors" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="50" y1="50" x2="11" y2="12" />
        <line x1="50" y1="50" x2="9" y2="47" />
        <line x1="50" y1="50" x2="13" y2="88" />
        <line x1="50" y1="50" x2="89" y2="12" />
        <line x1="50" y1="50" x2="91" y2="47" />
        <line x1="50" y1="50" x2="87" y2="88" />
      </svg>
    </>
  )
  if (asMotion) {
    return (
      <motion.div
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.9, delay: 0.2 } } }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {rings}
      </motion.div>
    )
  }
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {rings}
    </div>
  )
}

function EcosystemAnimated() {
  const ref = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const reduce = useReducedMotion()
  const [introDone, setIntroDone] = useState(false)
  useEffect(() => {
    whenIntroGone(() => setIntroDone(true))
  }, [])
  const show = inView && introDone

  // 3D tilt theo chuột — rAF CHỈ chạy khi đang nghiêng, dừng hẳn khi nghỉ (không repaint liên tục).
  useEffect(() => {
    const el = tiltRef.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canHover = window.matchMedia('(hover: hover)').matches
    if (reduced || !canHover) return
    let raf = 0
    let tX = 0, tY = 0, cX = 0, cY = 0
    const loop = () => {
      cX += (tX - cX) * 0.09
      cY += (tY - cY) * 0.09
      if (Math.abs(tX - cX) > 0.03 || Math.abs(tY - cY) > 0.03) {
        el.style.transform = `rotateX(${cX.toFixed(2)}deg) rotateY(${cY.toFixed(2)}deg)`
        raf = requestAnimationFrame(loop)
      } else {
        // đã settle: snap về target rồi dừng rAF
        if (tX === 0 && tY === 0) el.style.transform = ''
        else el.style.transform = `rotateX(${tX.toFixed(2)}deg) rotateY(${tY.toFixed(2)}deg)`
        cX = tX; cY = tY; raf = 0
      }
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop) }
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
      const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
      tX = clamp(py) * -7
      tY = clamp(px) * 9
      kick()
    }
    const onLeave = () => { tX = 0; tY = 0; kick() }
    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave, { passive: true })
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const logoV: Variants = reduce
    ? { hidden: { opacity: 0, x: '-50%', y: '-50%' }, visible: { opacity: 1, x: '-50%', y: '-50%', transition: { duration: 0.4 } } }
    : {
        hidden: { opacity: 0, scale: 0.85, x: '-50%', y: '-50%', z: 0 },
        visible: { opacity: 1, scale: 1, x: '-50%', y: '-50%', z: 50, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 } },
      }
  const tagsWrapV: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: reduce ? 0 : 0.7, staggerChildren: reduce ? 0 : 0.12 } },
  }
  const tagV: Variants = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }
    : {
        hidden: (c: TagDef['from']) => ({ opacity: 0, scale: 0.5, x: c.x, y: c.y, z: c.restZ - 150, rotate: c.rotate }),
        visible: (c: TagDef['from']) => ({
          opacity: 1, scale: 1, x: 0, y: 0, z: c.restZ, rotate: 0,
          transition: { type: 'spring', stiffness: 120, damping: 15, mass: 0.7 },
        }),
      }

  return (
    <div className="eco-perspective">
      <div ref={tiltRef} className="eco-3d">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={show ? 'visible' : 'hidden'}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative min-h-[300px] sm:min-h-[360px] md:min-h-[400px]"
        >
          <div className="hero-eco-glow" aria-hidden="true" />
          <EcoBackdrop asMotion />
          <motion.img variants={logoV} src="/logo-gg.png" alt="The One - GG99" draggable={false} className={LOGO_CLASS} />
          <motion.div variants={tagsWrapV} style={{ transformStyle: 'preserve-3d' }} className="absolute inset-0 pointer-events-none">
            {TAGS.map((t) => (
              <motion.div
                key={t.label}
                custom={t.from}
                variants={tagV}
                whileHover={reduce ? undefined : { y: -5, scale: 1.04, z: t.from.restZ + 28, transition: { type: 'spring', stiffness: 350, damping: 22 } }}
                className={`${TAG_CLASS} ${t.pos}`}
              >
                <t.Icon size={15} strokeWidth={2.2} className={`tag-icon ${t.color}`} />
                {t.label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

/** Bản tĩnh (fallback an toàn nếu framer lỗi runtime) */
function EcosystemStatic() {
  return (
    <div className="relative min-h-[300px] sm:min-h-[360px] md:min-h-[400px]">
      <div className="hero-eco-glow" aria-hidden="true" />
      <EcoBackdrop />
      <img src="/logo-gg.png" alt="The One - GG99" draggable={false} className={`${LOGO_CLASS} -translate-x-1/2 -translate-y-1/2`} />
      <div className="absolute inset-0 pointer-events-none">
        {TAGS.map((t) => (
          <div key={t.label} className={`${TAG_CLASS} ${t.pos}`}>
            <t.Icon size={15} strokeWidth={2.2} className={`tag-icon ${t.color}`} />
            {t.label}
          </div>
        ))}
      </div>
    </div>
  )
}

class EcosystemBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) return <EcosystemStatic />
    return this.props.children
  }
}

export function HeroEcosystem() {
  return (
    <div className="mx-auto w-full max-w-[480px]">
      <EcosystemBoundary>
        <EcosystemAnimated />
      </EcosystemBoundary>
    </div>
  )
}

export default HeroEcosystem
