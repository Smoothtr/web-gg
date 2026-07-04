import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function scrollAfterNavigation(hash: string) {
  window.setTimeout(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, 0)
}

export function InternalLinkRouter() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return

      event.preventDefault()
      const nextPath = `${url.pathname}${url.search}${url.hash}`
      navigate(nextPath)
      scrollAfterNavigation(url.hash)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [navigate])

  return null
}
