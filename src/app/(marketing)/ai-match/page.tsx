import type { Metadata } from 'next'
import { AIMatchContent } from './ai-match-content'

export const metadata: Metadata = {
  title: 'AI Expert Matching | OnFrontiers',
  description:
    'Paste your RFP, SOW, or contract requirements and let our AI match you with the perfect government contracting experts.',
}

export default function AIMatchPage() {
  return <AIMatchContent />
}
