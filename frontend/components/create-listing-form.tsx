"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createListing } from "@/lib/listings"
import { Loader2, Plus, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const listingSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  condition: z.string().min(1, { message: "Please select a condition" }),
  location: z.string().min(2, { message: "Location must be at least 2 characters" }),
  price: z.coerce.number().positive({ message: "Price must be greater than 0" }),
  tradePreference: z.string().min(1, { message: "Please select a trade preference" }),
})

type ListingFormValues = z.infer<typeof listingSchema>

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports & Outdoors",
  "Toys & Games",
  "Vehicles",
  "Collectibles",
  "Books",
  "Jewelry",
  "Other",
]

const conditions = ["New", "Like New", "Good", "Fair", "Poor"]

// Updated tradePreferences to match the Listing model exactly.
const tradePreferences = ["Swap", "Sell", "Gift", "Swap or Sell"]

export default function CreateListingForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      condition: "",
      location: "",
      price: 0,
      tradePreference: "",
    },
  })

  const addImage = () => {
    console.log("Add image clicked. Image URL:", imageUrl)
    if (!imageUrl) return

    // You may need to adjust this regex if your URLs include query strings or other valid characters.
    const imageRegex = /^https?:\/\/.+\.(jpeg|jpg|png|gif|webp)$/i
    if (!imageUrl.match(imageRegex)) {
      console.error("Invalid image URL:", imageUrl)
      toast({
        title: "Invalid Image URL",
        description: "Please enter a valid image URL (http/https with image extension)",
        variant: "destructive",
      })
      return
    }

    // Update the images state and clear the input
    setImages((prevImages) => {
      const newImages = [...prevImages, imageUrl]
      console.log("Updated images array:", newImages)
      return newImages
    })
    setImageUrl("")
  }

  const removeImage = (index: number) => {
    setImages((prevImages) => {
      const newImages = [...prevImages]
      newImages.splice(index, 1)
      return newImages
    })
  }

  const onSubmit = async (data: ListingFormValues) => {
    if (images.length === 0) {
      toast({
        title: "Image Required",
        description: "Please add at least one image for your listing",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const listingData = {
        ...data,
        images,
      }

      await createListing(listingData)

      toast({
        title: "Listing Created",
        description: "Your listing has been submitted for review and will be visible once approved.",
      })

      router.push("/listings/success")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create listing. Please try again."
      setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter a descriptive title for your item"
          {...register("title")}
          disabled={isLoading}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Provide details about your item, including features, specifications, and condition"
          rows={5}
          {...register("description")}
          disabled={isLoading}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="button"
            onClick={addImage}
            disabled={isLoading || !imageUrl}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Add at least one image URL for your listing</p>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url || "/placeholder.svg"}
                  alt={`Listing image ${index + 1}`}
                  className="h-24 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            disabled={isLoading}
            onValueChange={(value) => setValue("category", value)}
            defaultValue={watch("category")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-white hover:bg-white">
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select
            disabled={isLoading}
            onValueChange={(value) => setValue("condition", value)}
            defaultValue={watch("condition")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent className="bg-white hover:bg-white">
              {conditions.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.condition && <p className="text-sm text-red-500">{errors.condition.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="City, State" {...register("location")} disabled={isLoading} />
          {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (৳)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("price")}
            disabled={isLoading}
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tradePreference">Trade Preference</Label>
        <Select
          disabled={isLoading}
          onValueChange={(value) => setValue("tradePreference", value)}
          defaultValue={watch("tradePreference")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select preference" />
          </SelectTrigger>
          <SelectContent className="bg-white hover:bg-white">
            {tradePreferences.map((preference) => (
              <SelectItem key={preference} value={preference}>
                {preference}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tradePreference && <p className="text-sm text-red-500">{errors.tradePreference.message}</p>}
      </div>

      <Button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-950 " disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Listing...
          </>
        ) : (
          "Create Listing"
        )}
      </Button>
    </form>
  )
}
