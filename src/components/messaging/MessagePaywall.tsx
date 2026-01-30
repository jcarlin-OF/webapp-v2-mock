'use client'

import Link from 'next/link'
import { Lock, Zap, MessageSquare, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SUBSCRIPTION_TIERS } from '@/lib/messaging/constants'

interface MessagePaywallProps {
  expertName: string
  onBookCall?: () => void
}

export function MessagePaywall({ expertName, onBookCall }: MessagePaywallProps) {
  const proPrice = SUBSCRIPTION_TIERS.pro.price / 100

  return (
    <div className="border-t bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-md mx-auto text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="h-6 w-6 text-primary" />
        </div>

        <h3 className="font-semibold text-gray-900 mb-2">
          Upgrade to Continue Chatting
        </h3>

        <p className="text-sm text-gray-600 mb-6">
          You&apos;ve used your 3 free messages with {expertName}. Upgrade to Pro
          to continue the conversation.
        </p>

        <div className="bg-white border rounded-xl p-4 mb-6 text-left">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-medium text-gray-900">Pro Members Get:</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              Unlimited messages with all experts
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              See expert response time metrics
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-gray-400" />5 introduction requests per
              month
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/pricing">Upgrade to Pro - ${proPrice}/mo</Link>
          </Button>

          {onBookCall && (
            <Button variant="outline" className="w-full" onClick={onBookCall}>
              Book a Call Instead
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
