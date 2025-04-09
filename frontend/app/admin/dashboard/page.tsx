"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { isAdminAuthenticated, adminLogout, getPendingListings } from "@/lib/admin"
import { AlertCircle, LogOut, ShieldAlert } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PendingListings from "@/components/pending-listings"

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingListings, setPendingListings] = useState([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAdminAuthenticated()) {
        router.push("/admin/login")
        return
      }

      try {
        const listings = await getPendingListings()
        setPendingListings(listings)
        setError(null)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load pending listings"
        setError(errorMessage)

        if (errorMessage.includes("authentication")) {
          toast({
            title: "Authentication Error",
            description: "Please login again as admin",
            variant: "destructive",
          })
          adminLogout()
          router.push("/admin/login")
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  const handleLogout = () => {
    adminLogout()
    router.push("/admin/login")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out of the admin panel.",
    })
  }

  const handleListingUpdated = async () => {
    setLoading(true)
    try {
      const listings = await getPendingListings()
      setPendingListings(listings)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to refresh listings"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <ShieldAlert className="h-6 w-6 mr-2 text-red-600" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Listings</CardTitle>
            <CardDescription>Review and approve or reject listings submitted by users</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <PendingListings listings={pendingListings} loading={loading} onListingUpdated={handleListingUpdated} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
