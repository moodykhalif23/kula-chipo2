"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Phone,
  Globe,
  Share2,
  Heart,
  ChefHat,
  Truck,
  Store,
  ShoppingBag,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import BookingModal from "@/components/booking-modal"

// Mock data for the vendor
const vendor = {
  id: 1,
  name: "Golden Crisp Truck",
  type: "Food Truck",
  image: "/placeholder.svg?height=400&width=800",
  rating: 4.8,
  reviews: 324,
  distance: "0.5 mi",
  status: "Open Now",
  statusColor: "green",
  description:
    "Serving the crispiest hand-cut fries with 12 unique seasonings since 2018. Our secret is double-frying at the perfect temperature and using only the finest potatoes.",
  specialties: ["Hand-cut", "Seasoned", "Crispy", "Double-fried"],
  address: "123 Food Truck Lane, Downtown",
  phone: "(555) 123-4567",
  website: "goldencrisp.com",
  deliveryTime: "15-25 min",
  deliveryFee: 2.99,
  acceptsReservations: false,
  hours: {
    monday: "11:00 AM - 9:00 PM",
    tuesday: "11:00 AM - 9:00 PM",
    wednesday: "11:00 AM - 9:00 PM",
    thursday: "11:00 AM - 10:00 PM",
    friday: "11:00 AM - 11:00 PM",
    saturday: "10:00 AM - 11:00 PM",
    sunday: "12:00 PM - 8:00 PM",
  },
  menu: [
    { name: "Classic Fries", price: "$4.99", description: "Hand-cut golden fries with sea salt" },
    { name: "Loaded Fries", price: "$7.99", description: "Fries topped with cheese, bacon, and green onions" },
    { name: "Truffle Fries", price: "$9.99", description: "Premium fries with truffle oil and parmesan" },
    { name: "Spicy Cajun Fries", price: "$5.99", description: "Fries with our signature cajun seasoning" },
  ],
}

const reviews = [
  {
    id: 1,
    user: "Sarah M.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2 days ago",
    comment:
      "Absolutely amazing! The truffle fries are to die for. Crispy on the outside, fluffy on the inside. Will definitely be back!",
    helpful: 12,
  },
  {
    id: 2,
    user: "Mike R.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    date: "1 week ago",
    comment:
      "Great fries and friendly service. The loaded fries were generous with toppings. Only wish they had more sauce options.",
    helpful: 8,
  },
  {
    id: 3,
    user: "Emma L.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Best fries in the city! The double-frying technique really makes a difference. Perfect crispiness every time.",
    helpful: 15,
  },
]

export default function VendorDetailPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  // Determine vendor icon based on type
  const getVendorIcon = (type: string) => {
    switch (type) {
      case "Food Truck":
        return Truck
      case "Street Vendor":
        return Store
      case "Restaurant":
        return ChefHat
      default:
        return ChefHat
    }
  }

  const VendorIcon = getVendorIcon(vendor.type)
  const showReservations = vendor.type === "Restaurant" && vendor.acceptsReservations

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
            <Link href="/vendors" className="text-gray-700 hover:text-orange-500 font-medium">
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

      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Link href="/vendors" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Vendors
        </Link>

        {/* Vendor Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <Image src={vendor.image || "/placeholder.svg"} alt={vendor.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-2">
                <VendorIcon className="w-5 h-5 text-white" />
                <span className="text-white font-medium">{vendor.type}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{vendor.name}</h1>
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{vendor.rating}</span>
                  <span>({vendor.reviews} reviews)</span>
                </div>
                <Badge className="bg-green-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {vendor.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-gray-600 mb-4">{vendor.description}</p>
                <div className="flex flex-wrap gap-2">
                  {vendor.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setIsFavorited(!isFavorited)}>
                  <Heart className={`w-4 h-4 ${isFavorited ? "text-red-500 fill-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsBookingOpen(true)}>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Order Now
                </Button>
                {showReservations && (
                  <Button
                    variant="outline"
                    className="bg-transparent hover:bg-orange-50 hover:border-orange-500"
                    onClick={() => setIsBookingOpen(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Table
                  </Button>
                )}
                <Button className="bg-blue-500 hover:bg-blue-600">Write Review</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Menu</h2>
                <div className="grid gap-4">
                  {vendor.menu.map((item, index) => (
                    <div key={index} className="flex justify-between items-start p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <div className="text-lg font-bold text-orange-500 ml-4">{item.price}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Reviews</h2>
                  <Button className="bg-orange-500 hover:bg-orange-600">Write a Review</Button>
                </div>

                {/* Review Summary */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl font-bold">{vendor.rating}</div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${star <= Math.floor(vendor.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <div className="text-gray-600">{vendor.reviews} reviews</div>
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.user} />
                          <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{review.user}</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-gray-500 text-sm">{review.date}</span>
                          </div>
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          <div className="text-sm text-gray-500">{review.helpful} people found this helpful</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Information</h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Contact</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span>{vendor.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span>{vendor.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <span>{vendor.website}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-4">Hours</h3>
                    <div className="space-y-2">
                      {Object.entries(vendor.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize font-medium">{day}</span>
                          <span className="text-gray-600">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Photo Gallery</h2>
                  <div className="text-gray-600">24 photos</div>
                </div>

                {/* Featured Photo */}
                <div className="mb-6">
                  <div className="relative h-80 rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=400&width=800"
                      alt="Featured photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Our signature truffle fries with parmesan</p>
                </div>

                {/* Photo Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((photo) => (
                    <div key={photo} className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group">
                      <Image
                        src={`/placeholder.svg?height=200&width=200`}
                        alt={`Gallery photo ${photo}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                    </div>
                  ))}
                </div>

                {/* Load More Photos */}
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg">
                    View All Photos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        vendor={{
          id: vendor.id,
          name: vendor.name,
          type: vendor.type,
          rating: vendor.rating,
          reviews: vendor.reviews,
          image: vendor.image,
          address: vendor.address,
          phone: vendor.phone,
          deliveryTime: vendor.deliveryTime,
          deliveryFee: vendor.deliveryFee,
        }}
        showReservations={showReservations}
      />
    </div>
  )
}
