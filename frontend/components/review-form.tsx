"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createReview } from "@/lib/reviews"
import { Loader2, Star } from "lucide-react"
import type { Review } from "@/lib/reviews"

const reviewSchema = z.object({
  comment: z
    .string()
    .min(3, { message: "Comment must be at least 3 characters" })
    .max(500, { message: "Comment must be less than 500 characters" }),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  listingId: string
  onReviewAdded: (review: Review) => void
}

export default function ReviewForm({ listingId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      comment: "",
    },
  })

  const onSubmit = async (data: ReviewFormValues) => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting your review.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newReview = await createReview(listingId, rating, data.comment)

      toast({
        title: "Review Submitted",
        description: "Your review has been successfully submitted.",
      })

      // Reset form
      reset()
      setRating(0)

      // Notify parent component
      onReviewAdded(newReview)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit review. Please try again."

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Write a Review</h3>

      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-500">
          {rating > 0 ? `You rated this ${rating} star${rating !== 1 ? "s" : ""}` : "Select a rating"}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Textarea
            placeholder="Share your experience with this item..."
            {...register("comment")}
            disabled={isSubmitting}
            className="min-h-[100px]"
          />
          {errors.comment && <p className="mt-1 text-sm text-red-500">{errors.comment.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </div>
  )
}
