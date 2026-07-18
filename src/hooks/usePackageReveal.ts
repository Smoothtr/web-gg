import { useEffect } from 'react'
import { whenIntroGone } from './useIntroGate'

type PackageRevealDirection = 'down' | 'up'

type RevealRunItem = {
  element: HTMLElement
  due: number
}

type RevealGroupState = {
  group: HTMLElement
  items: RevealRunItem[]
  start: number
  cursor: number
  active: boolean
}

const DIRECTION_HYSTERESIS_PX = 10
const ENTRY_VIEWPORT_RATIO = 0.88
const EXIT_VIEWPORT_RATIO = 0.15

function numericData(value: string | undefined, fallback = 0) {
  const parsed = Number.parseFloat(value ?? '')
  return Number.isFinite(parsed) ? parsed : fallback
}

function ownedRevealItems(group: HTMLElement) {
  const candidates = [
    ...(group.matches('.rv-item') ? [group] : []),
    ...Array.from(group.querySelectorAll<HTMLElement>('.rv-item')),
  ]

  return candidates.filter((item, index) => (
    candidates.indexOf(item) === index
    && (item === group || item.closest<HTMLElement>('[data-rv-group]') === group)
  ))
}

function prepareRevealItems(group: HTMLElement) {
  const baseDelay = Math.max(0, numericData(group.dataset.rvBaseMs))
  const items = ownedRevealItems(group)
    .map((element, domIndex) => ({
      element,
      domIndex,
      order: Math.max(0, numericData(element.dataset.rvOrder, domIndex)),
      delay: Math.max(0, numericData(element.dataset.rvDelayMs)),
    }))
    .sort((left, right) => left.order - right.order || left.domIndex - right.domIndex)

  items.forEach(({ element, order, delay }) => {
    element.style.setProperty('--rv-i', String(Math.min(order, 7)))
    element.style.setProperty('--rv-delay', `${delay}ms`)
  })

  return items.map(({ element, delay }) => ({ element, due: baseDelay + delay }))
}

function groupIsInViewport(group: HTMLElement) {
  const rect = group.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

function groupIsInsideEntryBand(group: HTMLElement) {
  const rect = group.getBoundingClientRect()
  return rect.bottom > 0 && rect.top < window.innerHeight * ENTRY_VIEWPORT_RATIO
}

function groupHasFullyExited(group: HTMLElement, section?: HTMLElement) {
  const rect = group.getBoundingClientRect()
  const margin = window.innerHeight * EXIT_VIEWPORT_RATIO
  // Tablet card tabs hide two groups with `display: none`. Their own zero rect
  // cannot cross an exit boundary, so use the packages section as the replay
  // boundary while they are hidden. A tab switch alone must not reset them.
  if (rect.width === 0 && rect.height === 0 && section && section !== group) {
    return groupHasFullyExited(section)
  }
  return rect.bottom < -margin || rect.top > window.innerHeight + margin
}

function revealDistance(direction: PackageRevealDirection) {
  const distance = window.matchMedia?.('(max-width: 767px)').matches ? 16 : 24
  return `${direction === 'down' ? distance : -distance}px`
}

/**
 * Packages-only reveal choreography.
 *
 * The homepage has a separate scene engine for editorial sections. Packages
 * needs group-local ordering, direction-aware replay and interruptible stagger,
 * so it deliberately owns only `[data-rv-group]` descendants of `#packages`.
 */
export function usePackageReveal() {
  useEffect(() => {
    const section = document.getElementById('packages')
    if (!section) return

    let cancelled = false
    let observer: IntersectionObserver | null = null
    let mutationObserver: MutationObserver | null = null
    let schedulerFrame = 0
    let scrollFrame = 0
    let directionAnchorY = window.scrollY
    let direction: PackageRevealDirection = 'down'
    const states = new Map<HTMLElement, RevealGroupState>()
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    const setDirection = (group: HTMLElement, nextDirection: PackageRevealDirection) => {
      group.dataset.rvDirection = nextDirection
      group.style.setProperty('--rv-dir', revealDistance(nextDirection))
    }

    const freezeItemDirection = (item: HTMLElement, itemDirection: PackageRevealDirection) => {
      item.dataset.rvRevealDirection = itemDirection
      item.style.setProperty('--rv-item-dir', revealDistance(itemDirection))
    }

    const schedulerTick = (now: number) => {
      schedulerFrame = 0
      let hasPendingRuns = false

      states.forEach((state) => {
        if (!state.active || state.cursor >= state.items.length) return
        hasPendingRuns = true
        const elapsed = now - state.start

        while (state.cursor < state.items.length && state.items[state.cursor].due <= elapsed) {
          const item = state.items[state.cursor].element
          setDirection(state.group, direction)
          freezeItemDirection(item, direction)
          item.classList.add('rv-in')
          state.cursor += 1
        }

        if (state.cursor >= state.items.length) {
          state.group.dataset.rvState = 'complete'
        }
      })

      if (hasPendingRuns && Array.from(states.values()).some((state) => (
        state.active && state.cursor < state.items.length
      ))) {
        schedulerFrame = window.requestAnimationFrame(schedulerTick)
      }
    }

    const ensureScheduler = () => {
      if (!schedulerFrame) schedulerFrame = window.requestAnimationFrame(schedulerTick)
    }

    const revealStatic = (state: RevealGroupState) => {
      state.active = true
      state.cursor = state.items.length
      state.group.dataset.rvState = 'complete'
      state.group.classList.add('rv-static')
      setDirection(state.group, direction)
      state.items.forEach(({ element }) => {
        freezeItemDirection(element, direction)
        element.classList.add('rv-in')
      })
    }

    const startGroup = (state: RevealGroupState) => {
      if (state.active) return
      state.items = prepareRevealItems(state.group)
      state.cursor = 0
      state.active = true
      state.start = performance.now()
      state.group.dataset.rvState = 'running'
      state.group.classList.remove('rv-reset', 'rv-static')
      setDirection(state.group, direction)

      if (reduced) {
        state.items.forEach((item) => { item.due = 0 })
      }

      ensureScheduler()
    }

    const resetGroup = (state: RevealGroupState) => {
      if (!state.active) return
      state.active = false
      state.cursor = 0
      state.group.dataset.rvState = 'armed'
      state.group.classList.add('rv-reset')
      state.group.classList.remove('rv-static')
      state.items.forEach(({ element }) => {
        element.classList.remove('rv-in')
        delete element.dataset.rvRevealDirection
        element.style.removeProperty('--rv-item-dir')
      })
      window.requestAnimationFrame(() => {
        if (!cancelled && !state.active) state.group.classList.remove('rv-reset')
      })
    }

    const registerGroups = (bootstrapVisible: boolean) => {
      section.querySelectorAll<HTMLElement>('[data-rv-group]').forEach((group) => {
        if (states.has(group)) return
        const state: RevealGroupState = {
          group,
          items: prepareRevealItems(group),
          start: 0,
          cursor: 0,
          active: false,
        }
        states.set(group, state)
        group.dataset.rvState = 'armed'
        setDirection(group, direction)

        if (bootstrapVisible && groupIsInViewport(group)) revealStatic(state)
        observer?.observe(group)
      })
    }

    const updateScrollState = () => {
      scrollFrame = 0
      const currentY = window.scrollY
      const delta = currentY - directionAnchorY
      if (Math.abs(delta) >= DIRECTION_HYSTERESIS_PX) {
        direction = delta > 0 ? 'down' : 'up'
        directionAnchorY = currentY
        states.forEach((state) => {
          if (state.active && state.cursor < state.items.length) setDirection(state.group, direction)
        })
      }

      states.forEach((state) => {
        if (state.active) {
          if (groupHasFullyExited(state.group, section)) resetGroup(state)
          return
        }
        if (groupIsInsideEntryBand(state.group)) startGroup(state)
      })
    }

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollState)
    }

    const onResize = () => {
      states.forEach((state) => setDirection(state.group, state.group.dataset.rvDirection === 'up' ? 'up' : direction))
    }

    whenIntroGone(() => {
      if (cancelled) return

      observer = 'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return
                const state = states.get(entry.target as HTMLElement)
                if (state) startGroup(state)
              })
            },
            { threshold: 0, rootMargin: '0px 0px -12% 0px' },
          )
        : null

      registerGroups(true)
      section.dataset.rvReady = 'true'

      if (!observer) {
        states.forEach(revealStatic)
        return
      }

      mutationObserver = new MutationObserver(() => {
        registerGroups(false)
        updateScrollState()
      })
      mutationObserver.observe(section, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-mobile-active'],
      })
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize, { passive: true })
    })

    return () => {
      cancelled = true
      delete section.dataset.rvReady
      if (schedulerFrame) window.cancelAnimationFrame(schedulerFrame)
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      observer?.disconnect()
      mutationObserver?.disconnect()
      states.clear()
    }
  }, [])
}
