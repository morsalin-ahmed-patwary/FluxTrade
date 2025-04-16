"use client"

import ListingCard from "./listing-card"
import { AlertCircle } from "lucide-react"

interface Listing {
  _id: string
  title: string
  description: string
  images: string[]
  category: string
  condition: string
  location: string
  price: number
  tradePreference: string
  owner: {
    username: string
    email: string
  }
  createdAt: string
  isVerified: boolean
  verificationStatus: string
}

interface ListingsGridProps {
  listings: Listing[]
}

export default function ListingsGrid({ listings }: ListingsGridProps) {
  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Listings Found</h3>
        <p className="text-gray-500">
          We couldn't find any listings matching your criteria. Try adjusting your filters or check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {listings.map((listing) => (
        <ListingCard key={listing._id} listing={listing} />
      ))}
    </div>
  )
}
