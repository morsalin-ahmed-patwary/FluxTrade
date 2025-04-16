import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ListPlus, Home } from "lucide-react"

export default function ListingSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-gray-800">Listing Submitted!</h1>

        <p className="text-gray-600 mb-8">
          Your listing has been submitted successfully and is now pending approval. Our team will review it shortly.
          You'll be notified once it's approved.
        </p>

        <div className="flex flex-col space-y-4">
          <Button asChild>
            <Link href="/listings/create">
              <ListPlus className="mr-2 h-4 w-4" /> Create Another Listing
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
