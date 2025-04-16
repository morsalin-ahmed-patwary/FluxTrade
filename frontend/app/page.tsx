"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight, Search, Tag, ShieldCheck, RefreshCw, CheckCircle } from "lucide-react"

export default function HomePage() {

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className=" py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Buy, Sell, Trade with <span className="text-blue-800">FluxTrade</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            The secure marketplace for buying, selling, and trading items with verified listings and trusted users.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-gray-100">
              <Link href="/listings">
                <Search className="mr-2 h-5 w-5" /> Browse Listings
              </Link>
            </Button>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-gray-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join FluxTrade today and experience a secure marketplace for all your buying, selling, and trading needs.
          </p>
          <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-gray-100">
            <Link href="/register">Create an Account</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
