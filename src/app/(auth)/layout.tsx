import { Logo } from '@/components/layout/Logo'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with logo */}
      <header className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <Logo />
        </div>
      </header>

      {/* Main content - centered */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Simple footer */}
      <footer className="py-6 px-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} OnFrontiers. All rights reserved.</p>
      </footer>
    </div>
  )
}
