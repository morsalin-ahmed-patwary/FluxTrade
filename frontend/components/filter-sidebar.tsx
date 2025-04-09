"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Filter, X } from "lucide-react"

// These should match the options in create-listing-form.tsx
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

// Common locations - in a real app, this might come from an API
const popularLocations = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
]

interface FilterSidebarProps {
  selectedCategory: string
  selectedCondition: string
  selectedLocation: string
  onFilterChange: (filterType: string, value: string) => void
  onClearFilters: () => void
}

export default function FilterSidebar({
  selectedCategory,
  selectedCondition,
  selectedLocation,
  onFilterChange,
  onClearFilters,
}: FilterSidebarProps) {
  const [locationInput, setLocationInput] = useState(selectedLocation)

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange("location", locationInput)
  }

  const hasActiveFilters = selectedCategory || selectedCondition || selectedLocation

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-4 w-4 mr-2" /> Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-8 px-2">
              <X className="h-4 w-4 mr-1" /> Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <Accordion type="single" collapsible defaultValue="category">
          <AccordionItem value="category">
            <AccordionTrigger className="text-sm font-medium">Category</AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={selectedCategory} onValueChange={(value) => onFilterChange("category", value)}>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <RadioGroupItem value={category} id={`category-${category}`} />
                      <Label htmlFor={`category-${category}`} className="cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Condition Filter */}
        <Accordion type="single" collapsible defaultValue="condition">
          <AccordionItem value="condition">
            <AccordionTrigger className="text-sm font-medium">Condition</AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={selectedCondition} onValueChange={(value) => onFilterChange("condition", value)}>
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <RadioGroupItem value={condition} id={`condition-${condition}`} />
                      <Label htmlFor={`condition-${condition}`} className="cursor-pointer">
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Location Filter */}
        <Accordion type="single" collapsible defaultValue="location">
          <AccordionItem value="location">
            <AccordionTrigger className="text-sm font-medium">Location</AccordionTrigger>
            <AccordionContent>
              <form onSubmit={handleLocationSubmit} className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter location"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="h-8"
                  />
                  <Button type="submit" size="sm" className="h-8">
                    Go
                  </Button>
                </div>
              </form>

              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">Popular locations:</p>
                <div className="flex flex-wrap gap-2">
                  {popularLocations.map((location) => (
                    <Button
                      key={location}
                      variant="outline"
                      size="sm"
                      className={`text-xs h-7 ${selectedLocation === location ? "bg-primary/10" : ""}`}
                      onClick={() => onFilterChange("location", location)}
                    >
                      {location}
                    </Button>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
