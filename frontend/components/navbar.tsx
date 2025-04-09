"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { isAuthenticated, logout } from "@/lib/auth"
import { isAdminAuthenticated } from "@/lib/admin"
import { ShieldAlert, ListPlus, Search, LogIn } from "lucide-react"

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-blue-600">FluxTrade</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/listings"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/listings" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Browse Listings
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="outline" size="sm" className="hidden md:flex" asChild>
            <Link href="/listings">
              <Search className="h-4 w-4 mr-2" /> Browse Listings
            </Link>
          </Button>

          {authenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/listings/create">
                  <ListPlus className="h-4 w-4 mr-2" /> Create Listing
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}

          {isAdmin ? (
            <Button variant="outline" size="sm" className="ml-2" asChild>
              <Link href="/admin/dashboard">
                <ShieldAlert className="h-4 w-4 mr-2" /> Admin
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="ml-2" asChild>
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
