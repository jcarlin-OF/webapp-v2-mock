import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star, Shield } from 'lucide-react'
import { getExpertById, experts } from '@/mock/data/experts'
import { formatPrice } from '@/lib/utils'
import { Container } from '@/components/layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { BookingWizard } from '@/components/booking'

interface BookingPageProps {
  params: Promise<{ expertId: string }>
}

export async function generateStaticParams() {
  return experts.map((expert) => ({
    expertId: expert.id,
  }))
}

export async function generateMetadata({ params }: BookingPageProps) {
  const { expertId } = await params
  const expert = getExpertById(expertId)

  if (!expert) {
    return {
      title: 'Expert Not Found | OnFrontiers',
    }
  }

  return {
    title: `Book a Session with ${expert.name} | OnFrontiers`,
    description: `Schedule a consultation with ${expert.name}. ${expert.headline}`,
  }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { expertId } = await params
  const expert = getExpertById(expertId)

  if (!expert) {
    notFound()
  }

  const minPrice = Math.min(...expert.services.map((s) => s.price))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-4">
            <Link
              href={`/experts/${expert.slug}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to profile</span>
            </Link>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main booking form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-card p-6 lg:p-8">
                <BookingWizard expert={expert} />
              </div>
            </div>

            {/* Expert summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
                {/* Expert info */}
                <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={expert.avatar} alt={expert.name} />
                    <AvatarFallback>
                      {expert.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-gray-900">
                        {expert.name}
                      </h2>
                      {expert.verified && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary text-xs"
                        >
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                      {expert.headline}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-warning text-warning" />
                      <span className="font-semibold text-gray-900">
                        {expert.rating.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({expert.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Expertise */}
                <div className="py-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {expert.expertise.slice(0, 4).map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs font-normal"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {expert.expertise.length > 4 && (
                      <Badge
                        variant="outline"
                        className="text-xs font-normal text-gray-500"
                      >
                        +{expert.expertise.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Starting at</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatPrice(minPrice)}
                    </span>
                  </div>
                </div>

                {/* Trust badge */}
                <div className="pt-4">
                  <div className="flex items-center gap-3 p-3 bg-success/5 border border-success/10 rounded-lg">
                    <Shield className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Satisfaction Guaranteed
                      </p>
                      <p className="text-xs text-gray-500">
                        Full refund if you're not satisfied
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
