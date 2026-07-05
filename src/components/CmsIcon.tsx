import type { ComponentType } from 'react'
import {
  BadgeCheck,
  BarChart3,
  ClipboardCheck,
  Database,
  FileText,
  Globe2,
  Layers3,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  MousePointerClick,
  Palette,
  PanelsTopLeft,
  PenTool,
  Rocket,
  Route,
  Search,
  Settings2,
  ShoppingCart,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
  Gauge,
  Flag,
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
  { value: 'PanelsTopLeft', label: 'Landing page', Icon: PanelsTopLeft },
  { value: 'Route', label: 'Route', Icon: Route },
  { value: 'MousePointerClick', label: 'Click', Icon: MousePointerClick },
  { value: 'PenTool', label: 'Creative', Icon: PenTool },
  { value: 'Gauge', label: 'Speed', Icon: Gauge },
  { value: 'Flag', label: 'Milestone', Icon: Flag },
  { value: 'Mail', label: 'Email', Icon: Mail },
  { value: 'MessageCircle', label: 'Chat', Icon: MessageCircle },
  { value: 'MapPin', label: 'Location', Icon: MapPin },
  { value: '🚀', label: 'Emoji rocket' },
  { value: '🏪', label: 'Emoji store' },
  { value: '📈', label: 'Emoji chart' },
  { value: '🏢', label: 'Emoji office' },
  { value: '!', label: 'Alert mark' },
]

const iconByName = new Map<string, IconComponent>([
  ...cmsIconOptions.filter((item) => item.Icon).map((item) => [item.value, item.Icon as IconComponent] as const),
  ['Website', Globe2],
  ['CRM', Users],
  ['Email', Mail],
  ['Chat', MessageCircle],
  ['Office', MapPin],
])

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
