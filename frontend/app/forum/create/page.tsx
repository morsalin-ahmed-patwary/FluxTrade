"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { createForumPost } from "@/lib/forum"
import { isAuthenticated } from "@/lib/auth"
import { Loader2, ArrowLeft } from "lucide-react"

const forumPostSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  content: z
    .string()
    .min(20, { message: "Content must be at least 20 characters" })
    .max(5000, { message: "Content must be less than 5000 characters" }),
})

type ForumPostFormValues = z.infer<typeof forumPostSchema>

export default function CreateForumPostPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForumPostFormValues>({
    resolver: zodResolver(forumPostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login?redirect=/forum/create")
    } else {
      setIsLoading(false)
    }
  }, [router])

  const onSubmit = async (data: ForumPostFormValues) => {
    setIsSubmitting(true)

    try {
      await createForumPost(data.title, data.content)

      toast({
        title: "Post Created",
        description: "Your forum post has been successfully created.",
      })

      router.push("/forum")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create post. Please try again."

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-blue-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-blue-700">Loading...</p>
      </div>
    )
  }

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
          <CardTitle className="text-blue-700">Create Forum Post</CardTitle>
          <CardDescription className="text-blue-600">
            Share your thoughts, questions, or ideas with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="forum-post-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-blue-700">
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter a descriptive title for your post"
                {...register("title")}
                disabled={isSubmitting}
                className="border-blue-200 bg-blue-50 focus:border-blue-400 focus:ring-blue-300"
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium text-blue-700">
                Content
              </label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, questions, or ideas..."
                rows={10}
                {...register("content")}
                disabled={isSubmitting}
                className="border-blue-200 bg-blue-50 focus:border-blue-400 focus:ring-blue-300"
              />
              {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between bg-blue-50">
          <Button
            variant="outline"
            asChild
            disabled={isSubmitting}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <Link href="/forum">Cancel</Link>
          </Button>
          <Button
            type="submit"
            form="forum-post-form"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Post...
              </>
            ) : (
              "Create Post"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
