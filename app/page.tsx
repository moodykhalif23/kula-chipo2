"use client"

import Link from "next/link"
import { Search, ChefHat, Truck, Store, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import EnhancedVendorCard from "@/components/enhanced-vendor-card"
import { UserMenu } from "@/components/auth/user-menu"

const featuredVendors = [
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
]

const stats = [
  { label: "Active Vendors", value: "500+" },
  { label: "Happy Customers", value: "50K+" },
  { label: "Cities Served", value: "25+" },
  { label: "Orders Delivered", value: "1M+" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
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
            <Link href="/vendors" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Find Vendors
            </Link>
            <Link href="/experiences" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Experiences
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-yellow-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover the Best
            <span className="text-orange-500 block">French Fries</span>
            in Your City
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            From crispy food trucks to gourmet restaurants, find and order from the most amazing fry vendors near you.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                placeholder="Enter your address to find nearby vendors..."
                className="pl-14 h-14 text-lg rounded-full border-2 border-orange-200 focus:border-orange-500"
              />
              <Button className="absolute right-2 top-2 h-10 px-6 bg-orange-500 hover:bg-orange-600 rounded-full">
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vendors">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 h-12 px-8 rounded-full">
                Start Exploring
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/business/signup">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
              >
                List Your Business
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vendors Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Vendors</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most popular french fry establishments in your area, handpicked for their quality and taste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredVendors.map((vendor) => (
              <EnhancedVendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/vendors">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
              >
                View All Vendors
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to get your favorite fries delivered</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Discover</h3>
              <p className="text-gray-600">Browse through hundreds of local fry vendors and restaurants in your area</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Order</h3>
              <p className="text-gray-600">Choose your favorite fries and place your order with just a few clicks</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Enjoy</h3>
              <p className="text-gray-600">Get your crispy fries delivered hot and fresh to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-orange-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-orange-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Fry Journey?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of fry lovers who have discovered their new favorite spots through Kula Chipo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vendors">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 h-12 px-8 rounded-full">
                Find Vendors Near You
              </Button>
            </Link>
            <Link href="/business/signup">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-full border-2 border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
              >
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Kula Chipo</span>
              </div>
              <p className="text-gray-600">Connecting fry lovers with the best vendors in their city.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">For Customers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/vendors" className="hover:text-orange-500">
                    Find Vendors
                  </Link>
                </li>
                <li>
                  <Link href="/experiences" className="hover:text-orange-500">
                    Experiences
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">For Vendors</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/business/signup" className="hover:text-orange-500">
                    Join as Vendor
                  </Link>
                </li>
                <li>
                  <Link href="/business/signin" className="hover:text-orange-500">
                    Vendor Login
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 Kula Chipo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
