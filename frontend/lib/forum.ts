"use client"

const API_URL = "http://localhost:5000/api/forum"

export interface ForumPost {
  _id: string
  title: string
  content: string
  author: {
    username: string
  }
  createdAt: string
}

export async function createForumPost(title: string, content: string) {
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
        title,
        content,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to create forum post")
    }

    return data
  } catch (error) {
    console.error("Create forum post error:", error)
    throw error
  }
}

export async function getAllForumPosts(): Promise<ForumPost[]> {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch forum posts")
    }

    return data
  } catch (error) {
    console.error("Fetch forum posts error:", error)
    throw error
  }
}

export async function getForumPostById(postId: string): Promise<ForumPost> {
  try {
    const response = await fetch(`${API_URL}/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch forum post")
    }

    return data
  } catch (error) {
    console.error("Fetch forum post error:", error)
    throw error
  }
}
