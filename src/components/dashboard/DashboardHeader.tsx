'use client'

import Link from 'next/link'
import { ChevronRight, Menu, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface DashboardHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  backHref?: string
  backLabel?: string
  onMenuClick?: () => void
  showMenuButton?: boolean
  actions?: React.ReactNode
  className?: string
}

export function DashboardHeader({
  title,
  description,
  breadcrumbs,
  backHref,
  backLabel,
  onMenuClick,
  showMenuButton = true,
  actions,
  className,
}: DashboardHeaderProps) {
  return (
    <header className={cn('pb-6', className)}>
      {/* Back Link */}
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel || 'Back'}
        </Link>
      )}

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          {breadcrumbs.map((item, index) => (
            <span key={index} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-gray-700 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-heading font-semibold text-gray-900">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
