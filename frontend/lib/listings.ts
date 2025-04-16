"use client"

const API_URL = "http://localhost:5000/api/listings"

export interface Listing {
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

interface ListingData {
  title: string
  description: string
  images: string[]
  category: string
  condition: string
  location: string
  price: number
  tradePreference: string
}

export async function createListing(listingData: ListingData) {
  try {
    const token = localStorage.getItem("auth-token")

    if (!token) {
      throw new Error("Authentication required. Please log in.")
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listingData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to create listing")
    }

    return data
  } catch (error) {
    console.error("Create listing error:", error)
    throw error
  }
}

export async function getListings(filters?: {
  category?: string
  condition?: string
  location?: string
  showAll?: boolean
}): Promise<Listing[]> {
  try {
    let url = API_URL

    // Create query parameters
    const queryParams = new URLSearchParams()

    // Only show verified/approved listings by default
    if (!filters?.showAll) {
      queryParams.append("isVerified", "true")
    }

    if (filters?.category) queryParams.append("category", filters.category)
    if (filters?.condition) queryParams.append("condition", filters.condition)
    if (filters?.location) queryParams.append("location", filters.location)

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch listings")
    }

    return data
  } catch (error) {
    console.error("Fetch listings error:", error)
    throw error
  }
}

// Update the getListingById function to properly fetch a listing by ID
export async function getListingById(id: string): Promise<Listing> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch listing")
    }

    return data
  } catch (error) {
    console.error("Fetch listing error:", error)
    throw error
  }
}

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  try {
    const url = `${API_URL}?isVerified=true&limit=${limit}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch featured listings")
    }

    return data
  } catch (error) {
    console.error("Fetch featured listings error:", error)
    throw error
  }
}
