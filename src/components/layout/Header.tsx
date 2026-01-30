'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Heart, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Container } from './Container'
import { Logo } from './Logo'
import { NAV_ITEMS, CATEGORIES } from '@/lib/constants'
import { toast } from '@/hooks/use-toast'

interface HeaderProps {
  variant?: 'default' | 'transparent'
}

export function Header({ variant = 'default' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const isAuthenticated = status === 'authenticated'
  const user = session?.user
  const isExpert = user?.role === 'expert'

  // Get initials for avatar fallback
  const getInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSignOut = async () => {
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    })
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-colors',
        variant === 'transparent'
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100'
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo variant={variant === 'transparent' ? 'white' : 'default'} />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium transition-colors',
                    variant === 'transparent'
                      ? 'text-white/90 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  )}
                >
                  Browse Experts
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/experts" className="font-medium">
                    All Experts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {CATEGORIES.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link href={`/experts?category=${category.slug}`}>
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Main Nav Links */}
            {NAV_ITEMS.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  variant === 'transparent'
                    ? 'text-white/90 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[120px] truncate">{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {isExpert ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/expert/dashboard" className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Expert Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/expert/schedule" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Manage Schedule
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/saved" className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          Saved Experts
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-red-600 focus:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant={variant === 'transparent' ? 'ghost' : 'ghost'}
                  size="sm"
                  asChild
                  className={cn(
                    variant === 'transparent' && 'text-white hover:bg-white/10'
                  )}
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className={cn(
                    variant === 'transparent' &&
                      'bg-white text-primary hover:bg-white/90'
                  )}
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={cn(
              'lg:hidden p-2 -mr-2',
              variant === 'transparent' ? 'text-white' : 'text-gray-700'
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white py-4">
            <div className="space-y-1">
              <Link
                href="/experts"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Experts
              </Link>
              {NAV_ITEMS.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              {isAuthenticated && user ? (
                <>
                  <div className="px-3 py-2 flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {isExpert ? (
                    <>
                      <Link
                        href="/expert/dashboard"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Expert Dashboard
                      </Link>
                      <Link
                        href="/expert/schedule"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Manage Schedule
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/dashboard"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/saved"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Saved Experts
                      </Link>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleSignOut()
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
