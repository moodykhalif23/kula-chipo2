"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Heart, MessageCircle, Share2, Star, MapPin, Clock, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const experiences = [
  {
    id: 1,
    user: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    vendor: {
      name: "Golden Crisp Truck",
      location: "Downtown",
    },
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    rating: 5,
    title: "Absolutely incredible truffle fries!",
    description:
      "Just tried the truffle fries from Golden Crisp Truck and I'm blown away! The perfect balance of crispy exterior and fluffy interior, with that amazing truffle aroma. The portion size was generous and the service was super friendly. Definitely coming back for more!",
    tags: ["Truffle Fries", "Food Truck", "Downtown"],
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: 2,
    user: {
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
    vendor: {
      name: "Street Corner Fries",
      location: "Midtown",
    },
    images: ["/placeholder.svg?height=400&width=600"],
    rating: 4,
    title: "Classic Belgian-style done right",
    description:
      "Street Corner Fries knows how to do Belgian-style fries properly. Thick cut, double-fried to perfection, and served with authentic mayo dips. The curry mayo was particularly delicious. Great value for money too!",
    tags: ["Belgian Style", "Mayo Dips", "Street Vendor"],
    timestamp: "5 hours ago",
    likes: 18,
    comments: 5,
    shares: 2,
  },
  {
    id: 3,
    user: {
      name: "Emma Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    vendor: {
      name: "Fry Paradise",
      location: "Uptown",
    },
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    rating: 5,
    title: "Gourmet fries experience at its finest",
    description:
      "Fry Paradise lives up to its name! The loaded fries with pulled pork, cheese sauce, and jalapeños were incredible. The atmosphere is cozy and the staff really knows their stuff. Perfect for a casual dinner with friends.",
    tags: ["Gourmet", "Loaded Fries", "Restaurant"],
    timestamp: "1 day ago",
    likes: 42,
    comments: 12,
    shares: 7,
  },
  {
    id: 4,
    user: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
    vendor: {
      name: "Crispy Corner",
      location: "East Side",
    },
    images: ["/placeholder.svg?height=400&width=600"],
    rating: 4,
    title: "Hidden gem with amazing seasoning",
    description:
      "Found this food truck by accident and so glad I did! Their signature seasoning blend is addictive. The fries were perfectly crispy and the portions are huge. Will definitely be tracking this truck down again!",
    tags: ["Seasoned", "Food Truck", "Hidden Gem"],
    timestamp: "2 days ago",
    likes: 31,
    comments: 9,
    shares: 4,
  },
]

export default function ExperiencesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [activeTab, setActiveTab] = useState("all")

  const filteredExperiences = experiences.filter((experience) => {
    const matchesSearch =
      experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesSearch
  })

  const sortedExperiences = [...filteredExperiences].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes
      case "rating":
        return b.rating - a.rating
      case "recent":
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
  })

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
            <Link href="/experiences" className="text-orange-500 font-medium">
              Experiences
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-700">
              Sign In
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">Share Experience</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">French Fry Experiences</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing french fry experiences shared by our community. Get inspired and find your next favorite
            spot!
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search experiences, vendors, or tags..."
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
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-orange-500 hover:bg-orange-600 h-12 px-8">Share Your Experience</Button>
          </div>

          {/* Filter Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="all">All Experiences</TabsTrigger>
              <TabsTrigger value="food-trucks">Food Trucks</TabsTrigger>
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
              <TabsTrigger value="street-vendors">Street Vendors</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{sortedExperiences.length} Experiences</h2>
          <div className="text-gray-600">Showing latest community posts</div>
        </div>

        {/* Experience Feed */}
        <div className="max-w-2xl mx-auto space-y-8">
          {sortedExperiences.map((experience) => (
            <Card key={experience.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* User Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={experience.user.avatar || "/placeholder.svg"} alt={experience.user.name} />
                        <AvatarFallback>{experience.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{experience.user.name}</span>
                          {experience.user.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {experience.vendor.name} • {experience.vendor.location}
                          </span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>{experience.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= experience.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-4">
                  <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
                  <p className="text-gray-700 mb-4">{experience.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {experience.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Images */}
                {experience.images.length > 0 && (
                  <div className="px-6 pb-4">
                    {experience.images.length === 1 ? (
                      <div className="relative h-80 rounded-lg overflow-hidden">
                        <Image
                          src={experience.images[0] || "/placeholder.svg"}
                          alt="Experience"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {experience.images.slice(0, 4).map((image, index) => (
                          <div key={index} className="relative h-40 rounded-lg overflow-hidden">
                            <Image src={image || "/placeholder.svg"} alt="Experience" fill className="object-cover" />
                            {index === 3 && experience.images.length > 4 && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-white font-semibold">+{experience.images.length - 4} more</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="px-6 py-4 border-t bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span>{experience.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{experience.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span>{experience.shares}</span>
                      </button>
                    </div>
                    <Link href={`/vendors/${experience.id}`}>
                      <Button variant="outline" size="sm">
                        Visit Vendor
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Experiences
          </Button>
        </div>
      </div>
    </div>
  )
}
