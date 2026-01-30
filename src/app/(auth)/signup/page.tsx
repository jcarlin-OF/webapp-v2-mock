'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, AlertCircle, User, Briefcase } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signupSchema, type SignupFormData } from '@/lib/validations/auth'
import { cn } from '@/lib/utils'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'client',
    },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Call signup API endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to create account. Please try again.')
        setIsLoading(false)
        return
      }

      // Auto-login after successful signup
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        // Account created but login failed - redirect to login
        router.push('/login')
        return
      }

      // Redirect based on role
      if (data.role === 'expert') {
        router.push('/expert/dashboard')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-heading">Create an account</CardTitle>
        <CardDescription>
          Join OnFrontiers to connect with world-class experts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-2">
            <Label>I want to...</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('role', 'client')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                  selectedRole === 'client'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <User className={cn(
                  'h-6 w-6',
                  selectedRole === 'client' ? 'text-primary' : 'text-gray-400'
                )} />
                <span className={cn(
                  'text-sm font-medium',
                  selectedRole === 'client' ? 'text-primary' : 'text-gray-600'
                )}>
                  Find Experts
                </span>
                <span className="text-xs text-gray-500">Book consultations</span>
              </button>
              <button
                type="button"
                onClick={() => setValue('role', 'expert')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                  selectedRole === 'expert'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <Briefcase className={cn(
                  'h-6 w-6',
                  selectedRole === 'expert' ? 'text-primary' : 'text-gray-400'
                )} />
                <span className={cn(
                  'text-sm font-medium',
                  selectedRole === 'expert' ? 'text-primary' : 'text-gray-600'
                )}>
                  Become an Expert
                </span>
                <span className="text-xs text-gray-500">Share your expertise</span>
              </button>
            </div>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Smith"
              autoComplete="name"
              disabled={isLoading}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isLoading}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">Already have an account? </span>
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Sign in
          </Link>
        </div>

        <p className="mt-4 text-xs text-center text-gray-500">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-700">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-gray-700">
            Privacy Policy
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  )
}
