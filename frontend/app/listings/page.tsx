"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getListings } from "@/lib/listings"
import ListingsGrid from "@/components/listings-grid"
import FilterSidebar from "@/components/filter-sidebar"
import { Button } from "@/components/ui/button"
import { Loader2, Filter, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ListingsPage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get filter values from URL
  const category = searchParams.get("category") || ""
  const condition = searchParams.get("condition") || ""
  const location = searchParams.get("location") || ""

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      setError(null)

      try {
        // Create filter object based on URL params
        const filters: Record<string, string | boolean> = {}
        if (category) filters.category = category
        if (condition) filters.condition = condition
        if (location) filters.location = location

        // Note: We're not passing showAll=true, so only verified listings will be returned
        const data = await getListings(filters)
        setListings(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load listings"
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [category, condition, location])

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(filterType, value)
    } else {
      params.delete(filterType)
    }

    router.push(`/listings?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/listings")
  }

  const hasActiveFilters = category || condition || location

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Verified Listings</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              {showFilters ? (
                <>
                  <X className="h-4 w-4 mr-2" /> Hide Filters
                </>
              ) : (
                <>
                  <Filter className="h-4 w-4 mr-2" /> Show Filters
                </>
              )}
            </Button>
          </div>

          {/* Filter sidebar - hidden on mobile unless toggled */}
          <div className={`${showFilters ? "block" : "hidden"} md:block md:w-1/4 lg:w-1/5`}>
            <FilterSidebar
              selectedCategory={category}
              selectedCondition={condition}
              selectedLocation={location}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="hidden md:flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Verified Listings</h1>

              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="flex items-center">
                  <X className="h-4 w-4 mr-2" /> Clear Filters
                </Button>
              )}
            </div>

            {/* Active filters display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {category && (
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                    Category: {category}
                    <button
                      onClick={() => handleFilterChange("category", "")}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {condition && (
                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                    Condition: {condition}
                    <button
                      onClick={() => handleFilterChange("condition", "")}
                      className="ml-2 text-green-500 hover:text-green-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {location && (
                  <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center">
                    Location: {location}
                    <button
                      onClick={() => handleFilterChange("location", "")}
                      className="ml-2 text-purple-500 hover:text-purple-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Error message */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading state */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading listings...</span>
              </div>
            ) : (
              <ListingsGrid listings={listings} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
