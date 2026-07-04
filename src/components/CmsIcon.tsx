import type { ComponentType } from 'react'
import {
  BadgeCheck,
  BarChart3,
  ClipboardCheck,
  Database,
  FileText,
  Globe2,
  Layers3,
  Megaphone,
  Palette,
  Rocket,
  Search,
  Settings2,
  ShoppingCart,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
} from 'lucide-react'

type IconComponent = ComponentType<{ size?: number; className?: string }>

export const cmsIconOptions: Array<{ value: string; label: string; Icon?: IconComponent }> = [
  { value: 'Rocket', label: 'Launch', Icon: Rocket },
  { value: 'Workflow', label: 'Workflow', Icon: Workflow },
  { value: 'TrendingUp', label: 'Growth', Icon: TrendingUp },
  { value: 'Palette', label: 'Brand', Icon: Palette },
  { value: 'Globe2', label: 'Website', Icon: Globe2 },
  { value: 'Users', label: 'CRM', Icon: Users },
  { value: 'Megaphone', label: 'Marketing', Icon: Megaphone },
  { value: 'Target', label: 'Target', Icon: Target },
  { value: 'Search', label: 'Audit', Icon: Search },
  { value: 'BarChart3', label: 'Data', Icon: BarChart3 },
  { value: 'Database', label: 'Database', Icon: Database },
  { value: 'Settings2', label: 'Setup', Icon: Settings2 },
  { value: 'ShoppingCart', label: 'Commerce', Icon: ShoppingCart },
  { value: 'ClipboardCheck', label: 'Checklist', Icon: ClipboardCheck },
  { value: 'BadgeCheck', label: 'Trust', Icon: BadgeCheck },
  { value: 'Layers3', label: 'System', Icon: Layers3 },
  { value: 'FileText', label: 'Content', Icon: FileText },
  { value: 'Sparkles', label: 'AI / Idea', Icon: Sparkles },
  { value: '🚀', label: 'Emoji rocket' },
  { value: '🏪', label: 'Emoji store' },
  { value: '📈', label: 'Emoji chart' },
  { value: '🏢', label: 'Emoji office' },
  { value: '!', label: 'Alert mark' },
]

const iconByName = new Map(cmsIconOptions.filter((item) => item.Icon).map((item) => [item.value, item.Icon as IconComponent]))

export function CmsIcon({
  name,
  fallback,
  size = 18,
  className = 'text-primary',
}: {
  name?: string
  fallback?: IconComponent
  size?: number
  className?: string
}) {
  const Icon = name ? iconByName.get(name) : undefined
  if (Icon) return <Icon size={size} className={className} />
  if (name) return <span className={className} aria-hidden="true">{name}</span>
  if (fallback) {
    const Fallback = fallback
    return <Fallback size={size} className={className} />
  }
  return null
}
