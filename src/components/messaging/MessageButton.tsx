'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MessageButtonProps {
  expertId: string
  expertName: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function MessageButton({
  expertId,
  expertName,
  variant = 'outline',
  size = 'default',
  className,
}: MessageButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/experts/${expertId}`)
      return
    }

    // Only clients can message experts
    if (session?.user?.role !== 'client') {
      return
    }

    setIsLoading(true)

    try {
      // Start or get existing conversation
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertId, startNew: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to start conversation')
      }

      const data = await response.json()

      // Navigate to messages with this conversation
      router.push(`/dashboard/messages?conversation=${data.conversation.id}`)
    } catch (error) {
      console.error('Error starting conversation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={className}
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      {isLoading ? 'Starting chat...' : 'Message'}
    </Button>
  )
}
