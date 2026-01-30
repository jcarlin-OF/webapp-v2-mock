'use client'

import { Container } from '@/components/layout'
import { ChatInterface } from '@/components/ai-match'

export function AIMatchContent() {
  return (
    <main className="flex-1 flex flex-col bg-gray-50">
      <Container size="wide" className="flex-1 flex flex-col py-0 px-0 sm:px-6 lg:px-8">
        <div className="flex-1 bg-white sm:rounded-xl sm:my-6 sm:shadow-card overflow-hidden flex flex-col min-h-[calc(100vh-140px)]">
          <ChatInterface />
        </div>
      </Container>
    </main>
  )
}
