import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star,
  CheckCircle,
  MapPin,
  Clock,
  Globe,
  Building,
  GraduationCap,
  Award,
  ChevronRight,
  Shield,
  Calendar,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Container } from '@/components/layout'
import { MessageButton } from '@/components/messaging'
import {
  ExpertStatusBadge,
  ResponseTimeIndicator,
  ClearanceBadge,
} from '@/components/experts'
import { getExpertBySlug, experts } from '@/mock/data/experts'
import { getReviewsByExpertId } from '@/mock/data/reviews'
import type { Credential } from '@/types'

interface ExpertPageProps {
  params: Promise<{ slug: string }>
}

const credentialIcons: Record<Credential['type'], React.ElementType> = {
  experience: Building,
  education: GraduationCap,
  certification: Award,
}

export async function generateStaticParams() {
  return experts.map((expert) => ({
    slug: expert.slug,
  }))
}

export default async function ExpertPage({ params }: ExpertPageProps) {
  const { slug } = await params
  const expert = getExpertBySlug(slug)

  if (!expert) {
    notFound()
  }

  const reviews = getReviewsByExpertId(expert.id)
  const minPrice = Math.min(...expert.services.map((s) => s.price))
  const formattedMinPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(minPrice / 100)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <Container className="py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/experts" className="text-gray-500 hover:text-gray-700">
              Experts
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{expert.name}</span>
          </nav>
        </Container>
      </div>

      <Container className="py-8">
        <div className="lg:flex lg:gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Profile Header */}
            <section className="bg-white rounded-xl border p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
                    <Image
                      src={expert.avatar}
                      alt={expert.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {expert.verified && (
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
                      <CheckCircle className="h-6 w-6 text-primary fill-primary-light/30" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-gray-900">
                        {expert.name}
                      </h1>
                      <p className="text-gray-600 mt-1">{expert.headline}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-warning fill-warning" />
                      <span className="font-semibold">{expert.rating.toFixed(2)}</span>
                      <span className="text-gray-500">
                        ({expert.reviewCount} reviews)
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {expert.timezone.replace('America/', '').replace('_', ' ')}
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Globe className="h-4 w-4" />
                      <span>{expert.languages.join(', ')}</span>
                    </div>
                    {expert.completedConsultations > 0 && (
                      <>
                        <Separator orientation="vertical" className="h-5" />
                        <div className="text-gray-600">
                          <span className="font-medium">{expert.completedConsultations}</span>{' '}
                          consultations
                        </div>
                      </>
                    )}
                  </div>

                  {/* Response Time */}
                  {expert.responseTime && (
                    <div className="mt-3">
                      <ResponseTimeIndicator
                        responseTime={expert.responseTime}
                        lastActiveAt={expert.lastActiveAt}
                        variant="default"
                      />
                    </div>
                  )}

                  {/* Tags & Badges */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {/* Status badge for non-claimed profiles */}
                    {expert.profileStatus !== 'claimed' && (
                      <ExpertStatusBadge status={expert.profileStatus} size="md" />
                    )}
                    {/* Clearance badge if applicable */}
                    {expert.clearanceLevel && expert.clearanceLevel !== 'none' && (
                      <ClearanceBadge
                        level={expert.clearanceLevel}
                        verified={expert.clearanceVerified}
                        size="md"
                      />
                    )}
                    {expert.expertise.map((skill) => (
                      <Badge key={skill} variant="muted">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Tabs */}
            <Tabs defaultValue="about" className="space-y-6">
              <TabsList className="w-full justify-start bg-white border rounded-lg p-1 h-auto flex-wrap">
                <TabsTrigger value="about" className="px-4 py-2">
                  About
                </TabsTrigger>
                <TabsTrigger value="reviews" className="px-4 py-2">
                  Reviews ({expert.reviewCount})
                </TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-8">
                {/* Bio */}
                <section className="bg-white rounded-xl border p-6 lg:p-8">
                  <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4">
                    About
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    {expert.bio.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-gray-600 mb-4 last:mb-0 whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>

                {/* Credentials */}
                <section className="bg-white rounded-xl border p-6 lg:p-8">
                  <h2 className="font-heading text-xl font-semibold text-gray-900 mb-6">
                    Experience & Credentials
                  </h2>
                  <div className="space-y-6">
                    {expert.credentials.map((credential, i) => {
                      const Icon = credentialIcons[credential.type]
                      return (
                        <div key={i} className="flex gap-4">
                          <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {credential.title}
                            </h3>
                            <p className="text-gray-600">
                              {credential.organization}
                              {credential.year && ` • ${credential.year}`}
                            </p>
                            {credential.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {credential.description}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6">
                <section className="bg-white rounded-xl border p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-xl font-semibold text-gray-900">
                      Client Reviews
                    </h2>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-warning fill-warning" />
                      <span className="font-semibold text-lg">
                        {expert.rating.toFixed(2)}
                      </span>
                      <span className="text-gray-500">
                        ({expert.reviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  {reviews.length > 0 ? (
                    <div className="space-y-6 divide-y">
                      {reviews.map((review) => (
                        <div key={review.id} className="pt-6 first:pt-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="font-medium text-gray-600">
                                  {review.author.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {review.author.name}
                                </div>
                                {review.author.title && (
                                  <div className="text-sm text-gray-500">
                                    {review.author.title}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-warning fill-warning'
                                      : 'text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{review.content}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span>
                              {new Date(review.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            {review.helpful && (
                              <>
                                <span>•</span>
                                <span>{review.helpful} found this helpful</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No reviews yet</p>
                    </div>
                  )}
                </section>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <aside className="lg:w-96 shrink-0 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl border p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-semibold text-gray-900">
                  {formattedMinPrice}
                </div>
                <div className="text-gray-500">starting price</div>
              </div>

              {/* Services */}
              <div className="space-y-3 mb-6">
                {expert.services.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-primary cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {service.name}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                        }).format(service.price / 100)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{service.duration} minutes</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Availability */}
              {expert.availability.nextAvailable && (
                <div className="flex items-center gap-2 mb-6 text-sm">
                  <Calendar className="h-4 w-4 text-success" />
                  <span className="text-gray-600">
                    Next available:{' '}
                    <span className="font-medium text-gray-900">
                      {new Date(
                        expert.availability.nextAvailable
                      ).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </span>
                </div>
              )}

              <Button size="lg" className="w-full" asChild>
                <Link href={`/book/${expert.id}`}>Book a Session</Link>
              </Button>

              <MessageButton
                expertId={expert.id}
                expertName={expert.name}
                variant="outline"
                size="lg"
                className="w-full mt-3"
              />

              {/* Trust Badge */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-success" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Satisfaction Guaranteed
                    </div>
                    <div className="text-xs text-gray-500">
                      Full refund if you&apos;re not satisfied
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  )
}
