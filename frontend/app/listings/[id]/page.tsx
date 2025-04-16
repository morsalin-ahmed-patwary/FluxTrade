"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { getListingById } from "@/lib/listings"
import { getReviewsForListing } from "@/lib/reviews"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Tag, MapPin, Calendar, User, Mail, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ReviewForm from "@/components/review-form"
import ReviewsList from "@/components/reviews-list"
import { isAuthenticated } from "@/lib/auth"
import type { Listing } from "@/lib/listings"
import type { Review } from "@/lib/reviews"

export default function ListingDetailPage() {
  const { id } = useParams() as { id: string }
  const [listing, setListing] = useState<Listing | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch listing details
        const listingData = await getListingById(id)
        setListing(listingData)
        setActiveImage(listingData.images[0] || null)

        // Fetch reviews for this listing
        const reviewsData = await getReviewsForListing(id)
        setReviews(reviewsData)

        // Check if user is authenticated
        setIsUserAuthenticated(isAuthenticated())
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load listing details"
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleReviewAdded = async (newReview: Review) => {
    // Refresh reviews after a new one is added
    try {
      const updatedReviews = await getReviewsForListing(id)
      setReviews(updatedReviews)
    } catch (error) {
      console.error("Failed to refresh reviews:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-500">Loading listing details...</p>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error || "Listing not found"}</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  // Format price with commas for thousands
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(listing.price)

  // Format date
  const formattedDate = new Date(listing.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="aspect-video relative rounded-lg overflow-hidden border">
            {activeImage ? (
              <Image
                src={activeImage || "/placeholder.svg"}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {listing.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {listing.images.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square relative rounded-md overflow-hidden border cursor-pointer ${
                    activeImage === image ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setActiveImage(image)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${listing.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="flex items-center">
                <Tag className="h-3 w-3 mr-1" /> {listing.category}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" /> {listing.location}
              </Badge>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-4">{formattedPrice}</p>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-1" /> Listed on {formattedDate}
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Condition</h3>
              <p className="font-medium">{listing.condition}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Trade Preference</h3>
              <p className="font-medium">{listing.tradePreference}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-2">Seller Information</h2>
            <div className="flex items-center space-x-2 mb-1">
              <User className="h-4 w-4 text-gray-500" />
              <span>{listing.owner.username}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{listing.owner.email}</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button className="flex-1">Contact Seller</Button>
            <Button variant="outline" className="flex-1">
              Add to Favorites
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <Tabs defaultValue="reviews">
          <TabsList>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value="details">Additional Details</TabsTrigger>
          </TabsList>
          <TabsContent value="reviews" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>See what others are saying about this item</CardDescription>
              </CardHeader>
              <CardContent>
                {isUserAuthenticated ? (
                  <ReviewForm listingId={id} onReviewAdded={handleReviewAdded} />
                ) : (
                  <Alert className="mb-6">
                    <AlertDescription>
                      Please{" "}
                      <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/login")}>
                        log in
                      </Button>{" "}
                      to leave a review.
                    </AlertDescription>
                  </Alert>
                )}

                <Separator className="my-6" />

                <ReviewsList reviews={reviews} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="details" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
                <CardDescription>More information about this listing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Listing Details</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-gray-500">ID:</span>
                        <span className="font-mono">{listing._id}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span>{listing.isVerified ? "Verified" : "Pending"}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Listed:</span>
                        <span>{formattedDate}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Shipping & Returns</h3>
                    <p className="text-sm text-gray-700">
                      Contact the seller for information about shipping options and return policies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
