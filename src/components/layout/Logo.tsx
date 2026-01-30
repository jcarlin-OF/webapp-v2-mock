import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'default' | 'white'
  asLink?: boolean
}

export function Logo({ className, variant = 'default', asLink = true }: LogoProps) {
  const content = (
    <>
      {/* Logo mark */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect
          width="32"
          height="32"
          rx="8"
          className={cn(
            variant === 'white' ? 'fill-white' : 'fill-primary'
          )}
        />
        <path
          d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24C20.4183 24 24 20.4183 24 16C24 11.5817 20.4183 8 16 8ZM16 22C12.6863 22 10 19.3137 10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16C22 19.3137 19.3137 22 16 22Z"
          className={cn(
            variant === 'white' ? 'fill-primary' : 'fill-white'
          )}
        />
        <circle
          cx="16"
          cy="16"
          r="3"
          className={cn(
            variant === 'white' ? 'fill-primary' : 'fill-white'
          )}
        />
      </svg>
      {/* Wordmark */}
      <span
        className={cn(
          'font-heading text-xl font-semibold tracking-tight',
          variant === 'white' ? 'text-white' : 'text-gray-900'
        )}
      >
        OnFrontiers
      </span>
    </>
  )

  if (asLink) {
    return (
      <Link href="/" className={cn('flex items-center gap-2', className)}>
        {content}
      </Link>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {content}
    </div>
  )
}
