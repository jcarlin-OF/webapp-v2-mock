import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NoSearchResultsProps {
  query?: string
  onClearFilters?: () => void
}

export function NoSearchResults({
  query,
  onClearFilters,
}: NoSearchResultsProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">No experts found</h3>
      <p className="mt-2 text-gray-500 max-w-sm mx-auto">
        {query
          ? `We couldn't find any experts matching "${query}". Try adjusting your search or filters.`
          : 'Try adjusting your filters or search terms to find more experts.'}
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        {onClearFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
        <Button asChild>
          <a href="/experts">View All Experts</a>
        </Button>
      </div>
    </div>
  )
}
