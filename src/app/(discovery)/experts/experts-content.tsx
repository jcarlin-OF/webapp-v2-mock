'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Container } from '@/components/layout'
import { ExpertCard } from '@/components/experts'
import { NoSearchResults } from '@/components/empty-states'
import { filterExperts } from '@/mock/data/experts'
import { categories } from '@/mock/data/categories'
import { LANGUAGES } from '@/lib/constants'
import type { ExpertFilters, SortOption } from '@/types'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviews' },
  { value: 'availability', label: 'Soonest Available' },
]

const priceRanges = [
  { label: 'Any price', min: undefined, max: undefined },
  { label: 'Under $150', min: undefined, max: 15000 },
  { label: '$150 - $300', min: 15000, max: 30000 },
  { label: '$300 - $500', min: 30000, max: 50000 },
  { label: '$500+', min: 50000, max: undefined },
]

const ratingOptions = [
  { label: 'Any rating', value: undefined },
  { label: '4.5+ stars', value: 4.5 },
  { label: '4.7+ stars', value: 4.7 },
  { label: '4.9+ stars', value: 4.9 },
]

export function ExpertsContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || undefined

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<ExpertFilters>({
    category: initialCategory,
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    languages: [],
    availableNext7Days: false,
  })
  const [sortBy, setSortBy] = useState<SortOption>('relevance')

  // Filter and sort experts
  const filteredExperts = useMemo(() => {
    let result = filterExperts(filters)

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (expert) =>
          expert.name.toLowerCase().includes(query) ||
          expert.headline.toLowerCase().includes(query) ||
          expert.expertise.some((e) => e.toLowerCase().includes(query))
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        result.sort(
          (a, b) =>
            Math.min(...a.services.map((s) => s.price)) -
            Math.min(...b.services.map((s) => s.price))
        )
        break
      case 'price_desc':
        result.sort(
          (a, b) =>
            Math.min(...b.services.map((s) => s.price)) -
            Math.min(...a.services.map((s) => s.price))
        )
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'availability':
        result.sort((a, b) => {
          if (!a.availability.nextAvailable) return 1
          if (!b.availability.nextAvailable) return -1
          return (
            new Date(a.availability.nextAvailable).getTime() -
            new Date(b.availability.nextAvailable).getTime()
          )
        })
        break
      default:
        // relevance - combine rating and reviews
        result.sort(
          (a, b) => b.rating * Math.log(b.reviewCount + 1) - a.rating * Math.log(a.reviewCount + 1)
        )
    }

    return result
  }, [filters, searchQuery, sortBy])

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.languages && filters.languages.length > 0 ? 1 : 0) +
    (filters.availableNext7Days ? 1 : 0)

  const clearFilters = () => {
    setFilters({
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      languages: [],
      availableNext7Days: false,
    })
    setSearchQuery('')
  }

  const handlePriceChange = (value: string) => {
    const range = priceRanges.find((r) => r.label === value)
    if (range) {
      setFilters((prev) => ({
        ...prev,
        minPrice: range.min,
        maxPrice: range.max,
      }))
    }
  }

  const handleRatingChange = (value: string) => {
    const option = ratingOptions.find((r) => r.label === value)
    setFilters((prev) => ({
      ...prev,
      minRating: option?.value,
    }))
  }

  const getCurrentPriceLabel = () => {
    const range = priceRanges.find(
      (r) => r.min === filters.minPrice && r.max === filters.maxPrice
    )
    return range?.label || 'Any price'
  }

  const getCurrentRatingLabel = () => {
    const option = ratingOptions.find((r) => r.value === filters.minRating)
    return option?.label || 'Any rating'
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <Container className="py-6">
          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-gray-900">
              Find an Expert
            </h1>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search by name, expertise, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>

              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                className="sm:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="default" className="ml-2">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:w-64 shrink-0 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-xl border p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-gray-900">
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Select
                    value={filters.category || 'all'}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        category: value === 'all' ? undefined : value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <Select
                    value={getCurrentPriceLabel()}
                    onValueChange={handlePriceChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.label} value={range.label}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <Select
                    value={getCurrentRatingLabel()}
                    onValueChange={handleRatingChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ratingOptions.map((option) => (
                        <SelectItem key={option.label} value={option.label}>
                          <div className="flex items-center gap-1">
                            {option.value && (
                              <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                            )}
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability Toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.availableNext7Days}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          availableNext7Days: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">
                      Available in next 7 days
                    </span>
                  </label>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {LANGUAGES.map((lang) => (
                      <label
                        key={lang}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.languages?.includes(lang)}
                          onChange={(e) => {
                            setFilters((prev) => ({
                              ...prev,
                              languages: e.target.checked
                                ? [...(prev.languages || []), lang]
                                : prev.languages?.filter((l) => l !== lang),
                            }))
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">
                  {filteredExperts.length}
                </span>{' '}
                experts found
              </p>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortOption)}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.category && (
                  <Badge
                    variant="secondary"
                    className="gap-1 pr-1 cursor-pointer"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, category: undefined }))
                    }
                  >
                    {categories.find((c) => c.slug === filters.category)?.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <Badge
                    variant="secondary"
                    className="gap-1 pr-1 cursor-pointer"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: undefined,
                        maxPrice: undefined,
                      }))
                    }
                  >
                    {getCurrentPriceLabel()}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {filters.minRating && (
                  <Badge
                    variant="secondary"
                    className="gap-1 pr-1 cursor-pointer"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, minRating: undefined }))
                    }
                  >
                    {getCurrentRatingLabel()}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {filters.availableNext7Days && (
                  <Badge
                    variant="secondary"
                    className="gap-1 pr-1 cursor-pointer"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        availableNext7Days: false,
                      }))
                    }
                  >
                    Available soon
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
              </div>
            )}

            {/* Expert Grid */}
            {filteredExperts.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredExperts.map((expert) => (
                  <ExpertCard key={expert.id} expert={expert} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border">
                <NoSearchResults
                  query={searchQuery || undefined}
                  onClearFilters={clearFilters}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  )
}
