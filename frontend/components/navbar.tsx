"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { isAuthenticated, logout } from "@/lib/auth"
import { isAdminAuthenticated } from "@/lib/admin"
import { ShieldAlert, ListPlus, Search, LogIn, MessageSquare, LogOut, User, Home } from "lucide-react"

export default function Navbar() {
  const [authenticated, setAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setAuthenticated(isAuthenticated())
    setIsAdmin(isAdminAuthenticated())
  }, [pathname])

  const handleLogout = () => {
    logout()
    setAuthenticated(false)
    router.push("/login")
  }

  // Don't show navbar on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-200 bg-white shadow-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              FluxTrade
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 mx-6">
          <Link
            href="/listings"
            className={`text-sm font-medium transition-colors hover:text-blue-600 flex items-center ${
              pathname === "/listings" || pathname?.startsWith("/listings/") ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <Search className="h-4 w-4 mr-1" /> Browse Listings
          </Link>
          <Link
            href="/forum"
            className={`text-sm font-medium transition-colors hover:text-blue-600 flex items-center ${
              pathname === "/forum" || pathname?.startsWith("/forum/") ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <MessageSquare className="h-4 w-4 mr-1" /> Forum
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
            asChild
          >
            <Link href="/listings">
              <Search className="h-4 w-4 mr-2" /> Browse Listings
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            asChild
          >
            <Link href="/forum">
              <MessageSquare className="h-4 w-4 mr-2" /> Forum
            </Link>
          </Button>

          {authenticated ? (
            <>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50" asChild>
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" /> Profile
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                asChild
              >
                <Link href="/listings/create">
                  <ListPlus className="h-4 w-4 mr-2" /> Create Listing
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50" asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" /> Login
                </Link>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
                asChild
              >
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}

          {isAdmin ? (
            <Button
              variant="outline"
              size="sm"
              className="ml-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
              asChild
            >
              <Link href="/admin/dashboard">
                <ShieldAlert className="h-4 w-4 mr-2" /> Admin
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              asChild
            >
              <Link href="/admin/login">
                <LogIn className="h-4 w-4 mr-2" /> Admin Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
