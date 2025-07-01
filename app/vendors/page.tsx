"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChefHat, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import EnhancedVendorCard from "@/components/enhanced-vendor-card"
import { Truck, Store } from "lucide-react"

const vendors = [
  {
    id: 1,
    name: "Golden Crisp Truck",
    type: "Food Truck",
    icon: Truck,
    image: "/placeholder.svg?height=200&width=400",
    rating: 4.8,
    reviews: 324,
    distance: "0.5 mi",
    status: "Open Now",
    statusColor: "green",
    description: "Serving the crispiest hand-cut fries with 12 unique seasonings",
    specialties: ["Hand-cut", "Seasoned", "Crispy"],
    address: "123 Food Truck Lane, Downtown",
    phone: "(555) 123-4567",
    deliveryTime: "15-25 min",
    deliveryFee: 2.99,
    acceptsReservations: false,
  },
  {
    id: 2,
    name: "Street Corner Fries",
    type: "Street Vendor",
    icon: Store,
    image: "/placeholder.svg?height=200&width=400",
    rating: 4.6,
    reviews: 189,
    distance: "0.8 mi",
    status: "Busy",
    statusColor: "red",
    description: "Traditional Belgian-style fries with authentic mayo dips",
    specialties: ["Belgian-style", "Mayo dips", "Traditional"],
    address: "456 Street Corner, Midtown",
    phone: "(555) 234-5678",
    deliveryTime: "20-30 min",
    deliveryFee: 1.99,
    acceptsReservations: false,
  },
  {
    id: 3,
    name: "Fry Paradise",
    type: "Restaurant",
    icon: ChefHat,
    image: "/placeholder.svg?height=200&width=400",
    rating: 4.9,
    reviews: 567,
    distance: "1.2 mi",
    status: "Open Now",
    statusColor: "green",
    description: "Gourmet fries with truffle oil, parmesan, and premium toppings",
    specialties: ["Gourmet", "Truffle", "Premium"],
    address: "789 Restaurant Row, Uptown",
    phone: "(555) 345-6789",
    deliveryTime: "25-35 min",
    deliveryFee: 3.99,
    acceptsReservations: true,
  },
  {
    id: 4,
    name: "Crispy Corner",
    type: "Food Truck",
    icon: Truck,
    image: "/placeholder.svg?height=200&width=400",
    rating: 4.7,
    reviews: 256,
    distance: "1.5 mi",
    status: "Open Now",
    statusColor: "green",
    description: "Double-fried technique for extra crispiness with homemade sauces",
    specialties: ["Double-fried", "Homemade sauces", "Extra crispy"],
    address: "321 Mobile Street, Downtown",
    phone: "(555) 456-7890",
    deliveryTime: "18-28 min",
    deliveryFee: 2.49,
    acceptsReservations: false,
  },
  {
    id: 5,
    name: "The Fry Spot",
    type: "Restaurant",
    icon: ChefHat,
    image: "/placeholder.svg?height=200&width=400",
    rating: 4.5,
    reviews: 412,
    distance: "2.1 mi",
    status: "Closes Soon",
    statusColor: "yellow",
    description: "Local favorite serving thick-cut fries with signature spice blends",
    specialties: ["Thick-cut", "Spice blends", "Local favorite"],
    address: "654 Local Street, Neighborhood",
    phone: "(555) 567-8901",
    deliveryTime: "30-40 min",
    deliveryFee: 4.49,
    acceptsReservations: true,
  },
  {
    id: 6,
    name: "Mobile Munchies",
    type: "Street Vendor",
    icon: Store,
    image: "/placeholder.svg?height=200&width=400",
    rating: 4.4,
    reviews: 98,
    distance: "2.3 mi",
    status: "Open Now",
    statusColor: "green",
    description: "Quick service street cart with perfectly salted shoestring fries",
    specialties: ["Quick service", "Shoestring", "Perfectly salted"],
    address: "987 Mobile Avenue, City Center",
    phone: "(555) 678-9012",
    deliveryTime: "12-22 min",
    deliveryFee: 1.49,
    acceptsReservations: false,
  },
]

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("distance")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(vendor.type)
    return matchesSearch && matchesType
  })

  const sortedVendors = [...filteredVendors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "reviews":
        return b.reviews - a.reviews
      case "distance":
      default:
        return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
    }
  })

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, type])
    } else {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Kula Chipo</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/vendors" className="text-orange-500 font-medium">
              Find Vendors
            </Link>
            <Link href="/experiences" className="text-gray-700 hover:text-orange-500 font-medium">
              Experiences
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-700">
              Sign In
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">Join Now</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search vendors, specialties, or locations..."
                className="pl-12 h-12 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48 h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden h-12 bg-transparent">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Vendors</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Vendor Type</h3>
                  <div className="space-y-3">
                    {["Food Truck", "Street Vendor", "Restaurant"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={(checked) => handleTypeChange(type, checked as boolean)}
                        />
                        <label htmlFor={`mobile-${type}`} className="text-sm font-medium">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Filter by Vendor Type</h3>
              <div className="flex flex-wrap gap-6">
                {["Food Truck", "Street Vendor", "Restaurant"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={(checked) => handleTypeChange(type, checked as boolean)}
                    />
                    <label htmlFor={type} className="text-sm font-medium">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{sortedVendors.length} Vendors Found</h1>
          <div className="text-gray-600">Showing results for your area</div>
        </div>

        {/* Vendor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVendors.map((vendor) => (
            <EnhancedVendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Vendors
          </Button>
        </div>
      </div>
    </div>
  )
}
