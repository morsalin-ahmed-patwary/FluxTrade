"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getForumPostById } from "@/lib/forum"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft, Calendar, MessageSquarePlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { isAuthenticated } from "@/lib/auth"
import type { ForumPost } from "@/lib/forum"

export default function ForumPostPage() {
  const { id } = useParams() as { id: string }
  const [post, setPost] = useState<ForumPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getForumPostById(id)
        setPost(data)
        setIsUserAuthenticated(isAuthenticated())
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load forum post"
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-blue-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-blue-700">Loading forum post...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8 bg-blue-50">
        <Alert variant="destructive">
          <AlertDescription>{error || "Forum post not found"}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4 border-blue-300 text-blue-700 hover:bg-blue-100"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Button variant="outline" className="mb-6 border-blue-300 text-blue-700 hover:bg-blue-100" asChild>
        <Link href="/forum">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forum
        </Link>
      </Button>

      <Card className="border-blue-200 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl text-blue-700">{post.title}</CardTitle>
          <CardDescription className="flex items-center gap-4 text-blue-600">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2 bg-blue-600 text-white">
                <AvatarFallback>{post.author.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{post.author.username}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" /> {formattedDate}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none mt-4">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>

          <Separator className="my-8 bg-blue-200" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-700">Responses</h3>

            {/* This would be where responses/comments would go */}
            <div className="text-center py-6 bg-blue-50 rounded-lg">
              <p className="text-blue-600 mb-4">No responses yet. Be the first to respond!</p>

              {isUserAuthenticated ? (
                <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                  <MessageSquarePlus className="mr-2 h-4 w-4" /> Add Response
                </Button>
              ) : (
                <Button variant="outline" asChild className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  <Link href="/login?redirect=/forum">Log in to Respond</Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
