import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Shield,
  Clock,
  Users,
  Star,
  CheckCircle,
  Laptop,
  TrendingUp,
  Megaphone,
  Scale,
  Target,
  Settings,
  Handshake,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout'
import { ExpertCard } from '@/components/experts'
import { getFeaturedExperts } from '@/mock/data/experts'
import { categories } from '@/mock/data/categories'

const iconMap: Record<string, React.ElementType> = {
  Laptop,
  TrendingUp,
  Megaphone,
  Scale,
  Target,
  Settings,
  Users,
  Handshake,
}

const pressLogos = [
  { name: 'Wall Street Journal', abbrev: 'WSJ' },
  { name: 'Forbes', abbrev: 'Forbes' },
  { name: 'TechCrunch', abbrev: 'TC' },
  { name: 'Bloomberg', abbrev: 'BBG' },
  { name: 'Financial Times', abbrev: 'FT' },
]

const valueProps = [
  {
    icon: Users,
    title: 'Unparalleled Access',
    description:
      'Connect with executives from Google, Goldman Sachs, McKinsey, and other industry-leading organizations.',
  },
  {
    icon: Clock,
    title: 'On Your Schedule',
    description:
      'Book sessions that fit your calendar. Get expert advice when you need it, not when it\'s convenient for them.',
  },
  {
    icon: Shield,
    title: 'Satisfaction Guaranteed',
    description:
      'If your session doesn\'t meet expectations, we\'ll refund your payment. No questions asked.',
  },
]

const howItWorks = [
  {
    step: 1,
    title: 'Find Your Expert',
    description:
      'Browse our curated network of industry leaders. Filter by expertise, availability, and budget.',
  },
  {
    step: 2,
    title: 'Book a Session',
    description:
      'Choose a time that works for you. Share your goals and questions ahead of the call.',
  },
  {
    step: 3,
    title: 'Get Actionable Insights',
    description:
      'Connect via video call and get personalized advice from someone who\'s been there before.',
  },
]

const testimonials = [
  {
    quote:
      'The advice I got in a single session saved us six months of trial and error. ROI was 100x.',
    author: 'Emily Chen',
    title: 'CEO, TechStartup',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    quote:
      'Finally, a way to get real advice from people who\'ve actually done it at scale.',
    author: 'Marcus Johnson',
    title: 'Founder, GrowthCo',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    quote:
      'Worth every penny. The insights on our fundraising strategy were incredibly valuable.',
    author: 'Sarah Kim',
    title: 'VP Product, Startup',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
]

export default function HomePage() {
  const featuredExperts = getFeaturedExperts(6)

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-dark via-primary to-primary-light overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <Container className="relative py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
                Get advice from the
                <span className="text-primary-light block">world&apos;s best</span>
              </h1>
              <p className="mt-6 text-lg text-white/80 max-w-lg">
                Book 1-on-1 consultations with executives from top companies.
                Get strategic advice from people who&apos;ve built and scaled
                successful businesses.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="xl" className="bg-white text-primary hover:bg-white/90" asChild>
                  <Link href="/experts">
                    Find an Expert
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/how-it-works">See How It Works</Link>
                </Button>
              </div>
              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-semibold">500+</div>
                  <div className="text-white/70 text-sm">Verified Experts</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold">10k+</div>
                  <div className="text-white/70 text-sm">Sessions Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold">4.9</div>
                  <div className="text-white/70 text-sm">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Card */}
            <div className="hidden lg:block relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary-light/20 rounded-full blur-3xl" />
              <div className="relative bg-white rounded-2xl shadow-elevated-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden relative">
                    <Image
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Expert"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold text-gray-900">
                        Sarah Chen
                      </h3>
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Former Google Product Director
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  <span className="font-medium">4.97</span>
                  <span className="text-gray-500">(156 reviews)</span>
                </div>
                <div className="border-t pt-4">
                  <div className="text-sm text-gray-500 mb-2">
                    Available next:
                  </div>
                  <div className="flex gap-2">
                    {['Today', 'Tomorrow', 'Wed'].map((day) => (
                      <div
                        key={day}
                        className="px-3 py-1.5 bg-primary/5 text-primary rounded-lg text-sm font-medium"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust Bar */}
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <span className="text-sm text-gray-500 font-medium">
              As featured in
            </span>
            <div className="flex items-center gap-8">
              {pressLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="text-gray-400 font-heading font-semibold text-lg"
                >
                  {logo.abbrev}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Value Props */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-gray-900">
              Expert advice, on demand
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Skip the networking, cold outreach, and scheduling headaches. Get
              direct access to the experts you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((prop) => (
              <div
                key={prop.title}
                className="text-center p-8 rounded-2xl bg-gray-50"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6">
                  <prop.icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3">
                  {prop.title}
                </h3>
                <p className="text-gray-600">{prop.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Experts */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-gray-900">
                Featured Experts
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                Top-rated advisors ready to help you succeed
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/experts">
                View All Experts
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExperts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/experts">View All Experts</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* AI Match CTA */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary-dark via-primary to-secondary relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary-light/10 rounded-full blur-3xl" />

        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold mb-4">
              AI-Powered Expert Matching
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Have a government RFP or SOW? Let our AI analyze your requirements
              and match you with the perfect consultants in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/ai-match">
                  Try AI Matching
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Instant analysis
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Smart matching
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                No signup required
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-gray-900">
              Browse by Category
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Find experts in the areas that matter most to your business
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || Target
              return (
                <Link
                  key={category.id}
                  href={`/experts?category=${category.slug}`}
                  className="group p-6 rounded-xl border border-gray-200 hover:border-primary hover:shadow-card transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/5 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-semibold text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.expertCount} experts
                  </p>
                </Link>
              )
            })}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-gray-900 text-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Get expert advice in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {howItWorks.map((step) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {step.step < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gray-700" />
                )}

                <div className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white text-2xl font-semibold mb-6">
                    {step.step}
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button size="xl" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
              <Link href="/experts">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-gray-900">
              Trusted by ambitious leaders
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              See what our clients say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="p-8 rounded-2xl bg-gray-50"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-warning fill-warning"
                    />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-primary">
        <Container className="text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of professionals who are accelerating their careers
            and businesses with expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link href="/experts">
                Find an Expert
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/become-expert">Become an Expert</Link>
            </Button>
          </div>
        </Container>
      </section>
    </main>
  )
}
