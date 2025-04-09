"use client"

const API_URL = "http://localhost:5000/api"

export async function adminLogin(username: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/admin/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Invalid admin credentials")
    }

    // Store admin token in localStorage
    localStorage.setItem("admin-token", data.token)

    // Also store in a cookie for SSR
    document.cookie = `admin-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days

    return data
  } catch (error) {
    console.error("Admin login error:", error)
    throw error
  }
}

export async function getPendingListings() {
  try {
    const token = localStorage.getItem("admin-token")

    if (!token) {
      throw new Error("Admin authentication required")
    }

    const response = await fetch(`${API_URL}/listings/pending`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch pending listings")
    }

    return data
  } catch (error) {
    console.error("Fetch pending listings error:", error)
    throw error
  }
}

export async function verifyListing(listingId: string, action: "approve" | "reject", notes: string) {
  try {
    const token = localStorage.getItem("admin-token")

    if (!token) {
      throw new Error("Admin authentication required")
    }

    const response = await fetch(`${API_URL}/listings/${listingId}/verify`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        action,
        notes,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `Failed to ${action} listing`)
    }

    return data
  } catch (error) {
    console.error(`${action} listing error:`, error)
    throw error
  }
}

export function isAdminAuthenticated() {
  if (typeof window === "undefined") {
    return false
  }

  return !!localStorage.getItem("admin-token")
}

export function adminLogout() {
  localStorage.removeItem("admin-token")
  document.cookie = "admin-token=; path=/; max-age=0"
}
