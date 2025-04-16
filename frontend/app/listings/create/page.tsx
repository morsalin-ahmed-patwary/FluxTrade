"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { isAuthenticated } from "@/lib/auth"
import CreateListingForm from "@/components/create-listing-form"

export default function CreateListingPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login?redirect=/listings/create")
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-3xl">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4 bg-gray-50">
      <div className="w-full max-w-3xl py-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Create New Listing</h1>
        <p className="text-center text-gray-600 mb-8">List your item for sale or trade on our platform</p>

        <Card>
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
            <CardDescription>
              Fill out the form below to create your listing. All listings require approval before they appear publicly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-800" />
              <AlertDescription>
                Your listing will be reviewed by our team before it appears on the platform.
              </AlertDescription>
            </Alert>

            <CreateListingForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
