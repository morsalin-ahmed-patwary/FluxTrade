"use client"

const API_URL = "http://localhost:5000/api/reviews"

export interface Review {
  _id: string
  listing: string
  user: {
    username: string
  }
  rating: number
  comment: string
  createdAt: string
}

export async function createReview(listingId: string, rating: number, comment: string) {
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
      body: JSON.stringify({
        listing: listingId,
        rating,
        comment,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to create review")
    }

    return data
  } catch (error) {
    console.error("Create review error:", error)
    throw error
  }
}

export async function getReviewsForListing(listingId: string): Promise<Review[]> {
  try {
    const response = await fetch(`${API_URL}/${listingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch reviews")
    }

    return data
  } catch (error) {
    console.error("Fetch reviews error:", error)
    throw error
  }
}
