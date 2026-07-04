import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'light' | 'dark'
type ToggleLang = 'vi' | 'en'
const STORAGE_KEY = 'gg99-theme'

function getInitialTheme(): Theme {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return 'dark'
  }
  try {
    return (localStorage.getItem(STORAGE_KEY) as Theme) || 'light'
  } catch {
    return 'light'
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* localStorage có thể bị chặn — bỏ qua */
  }
}

/**
 * Nút bật/tắt Light ↔ Dark. Lưu lựa chọn vào localStorage.
 * Mặc định Light; .dark class được đặt trên <html>.
 */
export function ThemeToggle({ className = '', lang = 'vi' }: { className?: string; lang?: ToggleLang }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Đồng bộ nếu theme thay đổi (vd. từ tab khác)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setTheme(e.newValue)
        applyTheme(e.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
  }

  const isDark = theme === 'dark'
  const label = isDark
    ? lang === 'vi'
      ? 'Chuyển sang chế độ sáng'
      : 'Switch to light mode'
    : lang === 'vi'
      ? 'Chuyển sang chế độ tối'
      : 'Switch to dark mode'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={[
        'inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors',
        'text-on-surface-variant hover:text-primary',
        'hover:bg-primary/10 border border-outline-variant/40',
        className,
      ].join(' ')}
    >
      {isDark ? <Sun size={17} strokeWidth={2.2} /> : <Moon size={17} strokeWidth={2.2} />}
    </button>
  )
}

export default ThemeToggle
