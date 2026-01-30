'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Calendar,
  Heart,
  DollarSign,
  Clock,
  Settings,
  MessageSquare,
  FileSearch,
  Briefcase,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface DashboardSidebarProps {
  items: NavItem[]
  className?: string
}

export function DashboardSidebar({ items, className }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('space-y-1', className)}>
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

// Pre-defined nav items for client and expert dashboards
export const clientNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Match', href: '/dashboard/ai-match', icon: Sparkles },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'Expert Requests', href: '/dashboard/requests', icon: FileSearch },
  { label: 'My Calls', href: '/dashboard/calls', icon: Calendar },
  { label: 'Saved Experts', href: '/dashboard/saved', icon: Heart },
]

export const expertNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/expert/dashboard', icon: LayoutDashboard },
  { label: 'Messages', href: '/expert/messages', icon: MessageSquare },
  { label: 'Opportunities', href: '/expert/opportunities', icon: Briefcase },
  { label: 'Requests', href: '/expert/requests', icon: Clock },
  { label: 'Schedule', href: '/expert/schedule', icon: Calendar },
  { label: 'Earnings', href: '/expert/earnings', icon: DollarSign },
]
