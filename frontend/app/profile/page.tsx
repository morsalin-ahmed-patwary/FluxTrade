"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserProfile, logout, generateReferralCode, getMyReferrals } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

interface UserProfile {
  _id: string
  username: string
  email: string
  age: number
  profilePicture: string
  createdAt: string
  isAdmin: boolean
  referralCode?: string
  referralReward?: number
}

interface Referral {
  _id: string
  referee: {
    username: string
    email: string
  }
  createdAt: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("auth-token")
        if (!token) {
          router.push("/login")
          return
        }

        const userData = await getUserProfile(token)
        setProfile(userData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile. Please login again.",
          variant: "destructive",
        })
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router, toast])

  // Fetch referrals once profile is loaded
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const token = localStorage.getItem("auth-token")
        if (!token) return
        const referralsData = await getMyReferrals(token)
        setReferrals(referralsData)
      } catch (error) {
        console.error("Failed to fetch referrals", error)
      }
    }

    if (profile) {
      fetchReferrals()
    }
  }, [profile])

  const handleLogout = () => {
    logout()
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const handleCopyReferral = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode)
      toast({
        title: "Referral Code Copied",
        description: `Referral code ${profile.referralCode} copied to clipboard.`,
      })
    }
  }

  const handleGenerateReferral = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      const newProfile = await generateReferralCode(token || "")
      setProfile(newProfile)

      toast({
        title: "Referral Code Generated",
        description: `Your new referral code is ${newProfile.referralCode}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate referral code.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-blue-600">Profile</CardTitle>
            <CardDescription className="text-blue-500">Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-blue-600">Profile</CardTitle>
          <CardDescription className="text-blue-500">Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.profilePicture} alt={profile.username} />
              <AvatarFallback>{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">{profile.username}</h2>
              <p className="text-sm text-gray-600">{profile.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Member since</span>
              <span className="text-sm text-gray-500">{new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Account type</span>
              <span className="text-sm text-gray-500">{profile.isAdmin ? "Administrator" : "User"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Referral Reward</span>
              <span className="text-sm text-gray-500">{profile.referralReward || 0} points</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Your Referral Code</span>
              <span className="text-sm font-mono text-gray-600">{profile.referralCode || "Not generated"}</span>
            </div>
            {profile.referralCode ? (
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  onClick={handleCopyReferral}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Copy Referral Code
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGenerateReferral}
                  className="w-full"
                >
                  Regenerate
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                onClick={handleGenerateReferral}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Generate Referral Code
              </Button>
            )}
          </div>

          {/* New section: Display referral list */}
          {referrals.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">Referred Users</h3>
              <ul className="mt-2 space-y-2">
                {referrals.map((ref) => (
                  <li key={ref._id} className="p-2 border rounded">
                    <p className="text-sm text-gray-700">Username: {ref.referee.username}</p>
                    <p className="text-sm text-gray-500">Email: {ref.referee.email}</p>
                    <p className="text-xs text-gray-400">
                      Registered on: {new Date(ref.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            variant="default"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
