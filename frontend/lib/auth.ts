"use client"

const API_URL = "http://localhost:5000/api/users"

/**
 * Register a new user.
 * @param username User's username.
 * @param email User's email.
 * @param password User's password.
 * @param profilePicture URL to user's profile picture.
 * @param referralCode Optional referral code.
 * @returns Promise that resolves when registration is complete.
 */
export async function register(
  username: string,
  email: string,
  password: string,
  profilePicture: string,
  referralCode?: string
): Promise<any> {
  const response = await fetch('http://localhost:5000/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password,
      profilePicture,
      referralCode: referralCode || undefined,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
}

/**
 * Log in a user.
 * @param email User's email.
 * @param password User's password.
 * @returns Promise resolving with user data and JWT token.
 */
export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid credentials");
    }

    // Store token and user data in localStorage and cookie for SSR
    localStorage.setItem("auth-token", data.token);
    localStorage.setItem("user-data", JSON.stringify(data.user));
    document.cookie = `auth-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Get user profile using token.
 * @param token JWT token.
 * @returns User profile data.
 */
export async function getUserProfile(token: string) {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch profile");
    }

    return data;
  } catch (error) {
    console.error("Profile fetch error:", error);
    throw error;
  }
}

/**
 * Log out the current user.
 */
export function logout() {
  localStorage.removeItem("auth-token");
  localStorage.removeItem("user-data");
  document.cookie = "auth-token=; path=/; max-age=0";
}

/**
 * Check if user is authenticated.
 * @returns boolean.
 */
export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return !!localStorage.getItem("auth-token");
}

/**
 * Get stored user data from localStorage.
 * @returns user data as an object, or null.
 */
export function getStoredUserData() {
  if (typeof window === "undefined") {
    return null;
  }

  const userData = localStorage.getItem("user-data");
  return userData ? JSON.parse(userData) : null;
}

/**
 * Generate (or regenerate) referral code for the authenticated user.
 * @param token JWT token.
 * @returns Updated user profile with new referral code.
 */
export const generateReferralCode = async (token: string) => {
  const res = await fetch(`${API_URL}/generate-referral-code`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to generate referral code.");
  return await res.json();
};

/**
 * Get all referral records where the authenticated user is the referrer.
 * @param token JWT token.
 * @returns List of referral records.
 */
export async function getMyReferrals(token: string) {
  const res = await fetch("http://localhost:5000/api/referrals/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch referral data.");
  }
  
  return res.json();
}
