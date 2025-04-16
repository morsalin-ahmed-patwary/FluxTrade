"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { verifyListing } from "@/lib/admin"
import { CheckCircle2, XCircle, Clock, Tag, MapPin, Info, User, Mail, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

interface PendingListingsProps {
  listings: Listing[]
  loading: boolean
  onListingUpdated: () => void
}

export default function PendingListings({ listings, loading, onListingUpdated }: PendingListingsProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleOpenDialog = (listing: Listing, actionType: "approve" | "reject") => {
    setSelectedListing(listing)
    setAction(actionType)
    setNotes("")
  }

  const handleCloseDialog = () => {
    setSelectedListing(null)
    setAction(null)
    setNotes("")
  }

  const handleSubmit = async () => {
    if (!selectedListing || !action) return

    setIsSubmitting(true)

    try {
      await verifyListing(selectedListing._id, action, notes)

      toast({
        title: action === "approve" ? "Listing Approved" : "Listing Rejected",
        description: `The listing "${selectedListing.title}" has been ${action === "approve" ? "approved" : "rejected"}.`,
        variant: action === "approve" ? "default" : "destructive",
      })

      handleCloseDialog()
      onListingUpdated()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to ${action} listing`

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video relative">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-medium">No Pending Listings</h3>
        <p className="text-muted-foreground">All listings have been reviewed. Check back later for new submissions.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <Card key={listing._id} className="overflow-hidden">
            <div className="aspect-video relative">
              {listing.images && listing.images.length > 0 ? (
                <Image
                  src={listing.images[0] || "/placeholder.svg"}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <Info className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <Badge className="absolute top-2 right-2 bg-yellow-500">
                <Clock className="h-3 w-3 mr-1" /> Pending
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{listing.title}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{listing.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="flex items-center">
                  <Tag className="h-3 w-3 mr-1" /> {listing.category}
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" /> {listing.location}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">${listing.price}</span>
                <span className="text-sm text-muted-foreground">{listing.tradePreference}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-[48%] text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => handleOpenDialog(listing, "reject")}
              >
                <XCircle className="h-4 w-4 mr-1" /> Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-[48%] text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => handleOpenDialog(listing, "approve")}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedListing} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{action === "approve" ? "Approve Listing" : "Reject Listing"}</DialogTitle>
            <DialogDescription>
              {action === "approve"
                ? "This listing will be visible to all users after approval."
                : "This listing will be rejected and the user will be notified."}
            </DialogDescription>
          </DialogHeader>

          {selectedListing && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-medium">{selectedListing.title}</h4>
                <div className="text-sm text-muted-foreground flex items-center">
                  <User className="h-3 w-3 mr-1" /> {selectedListing.owner.username}
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Mail className="h-3 w-3 mr-1" /> {selectedListing.owner.email}
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" /> {new Date(selectedListing.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  {action === "approve" ? "Approval Notes (Optional)" : "Rejection Reason"}
                </label>
                <Textarea
                  id="notes"
                  placeholder={
                    action === "approve"
                      ? "Add any notes about this approval..."
                      : "Please provide a reason for rejection..."
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required={action === "reject"}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (action === "reject" && !notes)}
              variant={action === "approve" ? "default" : "destructive"}
            >
              {isSubmitting ? "Processing..." : action === "approve" ? "Approve Listing" : "Reject Listing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
