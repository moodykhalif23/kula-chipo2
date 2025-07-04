"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import {
  ChefHat,
  BarChart3,
  Star,
  MessageSquare,
  Eye,
  TrendingUp,
  Clock,
  Camera,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { pricingPlans } from "@/components/pricing-manager"
import MainHeader from "@/components/main-header"

interface PricingPlanProps {
  name: string
  price: number
  originalPrice: number
  features: string[]
}

function PricingCard({ plan }: { plan: PricingPlanProps }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{plan.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-4xl font-bold">${plan.price}</span>
          {plan.originalPrice && <span className="text-gray-500 line-through ml-2">${plan.originalPrice}</span>}
          <p className="text-sm text-gray-600">per month</p>
        </div>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-green-500"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-2.716a.75.75 0 00-1.229 1.02l2.914 4.172a.75.75 0 001.134-.082l3.876-5.333z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Link href={`/subscribe/${plan.name.toLowerCase()}`} passHref legacyBehavior>
          <Button className="w-full bg-orange-500 hover:bg-orange-600">Choose Plan</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function PricingManager({
  isBusinessUser,
  hasActivePlan,
  currentPlan,
}: { isBusinessUser: boolean; hasActivePlan: boolean; currentPlan: string }) {
  // pricingPlans is in scope here
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Plans</CardTitle>
        <CardContent>
          {isBusinessUser ? (
            hasActivePlan ? (
              <p>You are currently on the {currentPlan} plan.</p>
            ) : (
              <p>Choose a pricing plan to unlock more features.</p>
            )
          ) : (
            <p>Sign up as a business to view pricing plans.</p>
          )}
        </CardContent>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PricingCard plan={pricingPlans.basic} />
        <PricingCard plan={pricingPlans.premium} />
        <PricingCard plan={pricingPlans.enterprise} />
      </CardContent>
    </Card>
  )
}

export default function VendorDashboard() {
  const [vendorData, setVendorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVendor() {
      setLoading(true)
      try {
        const res = await fetch("/api/vendor/listing")
        if (!res.ok) throw new Error("Failed to fetch vendor data")
        const data = await res.json()
        setVendorData(data.vendor)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchVendor()
  }, [])

  if (loading) return <div>Loading vendor data...</div>
  if (error) return <div>Error: {error}</div>
  if (!vendorData) return <div>No vendor data found.</div>

  const recentReviews = [
    {
      id: 1,
      user: "Sarah M.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 days ago",
      comment: "Absolutely amazing! The truffle fries are to die for. Crispy on the outside, fluffy on the inside.",
      replied: false,
    },
    {
      id: 2,
      user: "Mike R.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "1 week ago",
      comment: "Great fries and friendly service. The loaded fries were generous with toppings.",
      replied: true,
    },
    {
      id: 3,
      user: "Emma L.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 weeks ago",
      comment: "Best fries in the city! The double-frying technique really makes a difference.",
      replied: true,
    },
  ]

  const analyticsData = {
    viewsThisMonth: 456,
    viewsLastMonth: 389,
    reviewsThisMonth: 12,
    reviewsLastMonth: 8,
    averageRating: 4.8,
    totalCustomers: 2847,
  }

  // Mock business user detection (in real app, this would come from auth/user context)
  const isBusinessUser = true
  const hasActivePlan = false

  const [activeTab, setActiveTab] = useState("overview")
  const [showAddMenuModal, setShowAddMenuModal] = useState(false)
  const [newMenuItem, setNewMenuItem] = useState({ name: "", price: "", description: "", available: true })

  // Refs for scrolling
  const addMenuItemRef = useRef<HTMLButtonElement>(null)
  const updateHoursRef = useRef<HTMLDivElement>(null)

  // Scroll helpers
  const scrollToAddMenuItem = () => {
    setTimeout(() => {
      addMenuItemRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      addMenuItemRef.current?.focus()
      setShowAddMenuModal(true)
    }, 100) // Wait for tab content to render
  }
  const scrollToUpdateHours = () => {
    setTimeout(() => {
      updateHoursRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 100)
  }

  const handleToggleStatus = () => {
    setVendorData((prev: any) => ({ ...prev, isOpen: !prev.isOpen }))
  }

  const handleMenuItemToggle = (itemId: number) => {
    setVendorData((prev: any) => ({
      ...prev,
      menu: prev.menu.map((item: any) => (item.id === itemId ? { ...item, available: !item.available } : item)),
    }))
  }

  const handleAddMenuItem = () => {
    setShowAddMenuModal(true)
  }

  const handleSaveMenuItem = () => {
    setVendorData((prev: any) => ({
      ...prev,
      menu: [
        ...prev.menu,
        {
          id: prev.menu.length + 1,
          name: newMenuItem.name,
          price: parseFloat(newMenuItem.price),
          description: newMenuItem.description,
          available: newMenuItem.available,
        },
      ],
    }))
    setShowAddMenuModal(false)
    setNewMenuItem({ name: "", price: "", description: "", available: true })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {vendorData.name}!</h1>
              <p className="text-gray-600">Manage your profile and track your performance</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${vendorData.isOpen ? "bg-green-500" : "bg-red-500"}`} />
                <span className="font-medium">{vendorData.isOpen ? "Open" : "Closed"}</span>
                <Switch checked={vendorData.isOpen} onCheckedChange={handleToggleStatus} />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold">{vendorData.totalViews.toLocaleString()}</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">+17% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold">{vendorData.rating}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-gray-500">{vendorData.totalReviews} total reviews</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Views</p>
                    <p className="text-2xl font-bold">{analyticsData.viewsThisMonth}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">
                    +{analyticsData.viewsThisMonth - analyticsData.viewsLastMonth} from last month
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Reviews</p>
                    <p className="text-2xl font-bold">{analyticsData.reviewsThisMonth}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-green-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-gray-500">This month</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.user} />
                          <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{review.user}</span>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                          {!review.replied && (
                            <Button size="sm" variant="outline" className="mt-2 text-xs bg-transparent">
                              Reply
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Reviews
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      className="h-20 flex flex-col items-center gap-2 bg-orange-500 hover:bg-orange-600"
                      onClick={() => setActiveTab("profile")}
                    >
                      <Edit className="w-6 h-6" />
                      <span>Update Profile</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center gap-2 bg-transparent"
                      onClick={() => {
                        setActiveTab("menu")
                        scrollToAddMenuItem()
                      }}
                    >
                      <Plus className="w-6 h-6" />
                      <span>Add Menu Item</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center gap-2 bg-transparent"
                      onClick={() => setActiveTab("photos")}
                    >
                      <Camera className="w-6 h-6" />
                      <span>Upload Photos</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center gap-2 bg-transparent"
                      onClick={() => {
                        setActiveTab("profile")
                        scrollToUpdateHours()
                      }}
                    >
                      <Clock className="w-6 h-6" />
                      <span>Update Hours</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Business Name</Label>
                      <Input id="name" defaultValue={vendorData.name} />
                    </div>
                    <div>
                      <Label htmlFor="type">Business Type</Label>
                      <Select defaultValue={vendorData.type}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food Truck">Food Truck</SelectItem>
                          <SelectItem value="Street Vendor">Street Vendor</SelectItem>
                          <SelectItem value="Restaurant">Restaurant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue={vendorData.phone} />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue={vendorData.website} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" defaultValue={vendorData.address} />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" defaultValue={vendorData.description} rows={4} />
                    </div>
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <Label>Cover Image</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="relative h-32 mb-4">
                      <Image
                        src={vendorData.image || "/placeholder.svg"}
                        alt="Cover"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <Button variant="outline">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Cover Image
                    </Button>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <Label>Specialties</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {vendorData.specialties.map((specialty: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {specialty}
                        <button className="ml-1 hover:text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    <Button size="sm" variant="outline">
                      <Plus className="w-3 h-3 mr-1" />
                      Add Specialty
                    </Button>
                  </div>
                </div>

                {/* Operating Hours */}
                <div ref={updateHoursRef}>
                  <Label>Operating Hours</Label>
                  <div className="mt-2 space-y-3">
                    {Object.entries(vendorData.hours).map(([day, hours]: [string, any]) => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-20 capitalize font-medium">{day}</div>
                        <Switch checked={!hours.closed} />
                        {!hours.closed ? (
                          <div className="flex items-center gap-2">
                            <Input type="time" defaultValue={hours.open} className="w-32" />
                            <span>to</span>
                            <Input type="time" defaultValue={hours.close} className="w-32" />
                          </div>
                        ) : (
                          <span className="text-gray-500">Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Menu Management</CardTitle>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    ref={addMenuItemRef}
                    onClick={handleAddMenuItem}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Menu Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorData.menu.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{item.name}</h3>
                          <Badge variant={item.available ? "default" : "secondary"}>
                            {item.available ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                        <p className="text-lg font-bold text-orange-500 mt-2">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={item.available} onCheckedChange={() => handleMenuItemToggle(item.id)} />
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 bg-transparent">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <ImageUploadManager />
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Customer Reviews</span>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{vendorData.rating}</span>
                    <span className="text-gray-500">({vendorData.totalReviews} reviews)</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentReviews.map((review) => (
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
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          {review.replied ? (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm font-medium mb-1">Your Reply:</p>
                              <p className="text-sm text-gray-700">
                                Thank you for your feedback! We&apos;re glad you enjoyed our fries.
                              </p>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                Reply
                              </Button>
                              <Button size="sm" variant="outline">
                                Report
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Profile Views</p>
                        <p className="text-2xl font-bold text-blue-600">{analyticsData.viewsThisMonth}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">vs last month</p>
                        <p className="text-green-600 font-medium">
                          +{analyticsData.viewsThisMonth - analyticsData.viewsLastMonth}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">New Reviews</p>
                        <p className="text-2xl font-bold text-green-600">{analyticsData.reviewsThisMonth}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">vs last month</p>
                        <p className="text-green-600 font-medium">
                          +{analyticsData.reviewsThisMonth - analyticsData.reviewsLastMonth}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium">Average Rating</p>
                        <p className="text-2xl font-bold text-yellow-600">{analyticsData.averageRating}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total reviews</p>
                        <p className="text-gray-600 font-medium">{vendorData.totalReviews}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-2">Most Popular Items</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Classic Fries</span>
                          <span className="font-medium">45%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Loaded Fries</span>
                          <span className="font-medium">32%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Truffle Fries</span>
                          <span className="font-medium">23%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-2">Peak Hours</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>12:00 PM - 2:00 PM</span>
                          <span className="font-medium">Lunch Rush</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>6:00 PM - 8:00 PM</span>
                          <span className="font-medium">Dinner Peak</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing">
            <PricingManager isBusinessUser={isBusinessUser} hasActivePlan={hasActivePlan} currentPlan="basic" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Menu Item Modal */}
      <Dialog open={showAddMenuModal} onOpenChange={setShowAddMenuModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="menu-name">Name</Label>
              <Input id="menu-name" value={newMenuItem.name} onChange={e => setNewMenuItem({ ...newMenuItem, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="menu-price">Price</Label>
              <Input id="menu-price" type="number" min="0" step="0.01" value={newMenuItem.price} onChange={e => setNewMenuItem({ ...newMenuItem, price: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="menu-description">Description</Label>
              <Textarea id="menu-description" value={newMenuItem.description} onChange={e => setNewMenuItem({ ...newMenuItem, description: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={newMenuItem.available} onCheckedChange={v => setNewMenuItem({ ...newMenuItem, available: v })} />
              <span>Available</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMenuModal(false)}>Cancel</Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSaveMenuItem}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ImageUploadManager() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.map((file: File) => {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setUploadedImages((prevState: string[]) => [...prevState, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Photo Gallery</CardTitle>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Upload Photos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Upload Area */}
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8">
          <input {...getInputProps()} />
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload Your French Fry Photos</h3>
          <p className="text-gray-600 mb-4">
            Show off your delicious fries! Upload high-quality photos to attract more customers.
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600">Choose Photos</Button>
          <p className="text-sm text-gray-500 mt-2">Supported formats: JPG, PNG, WebP. Max size: 5MB per photo.</p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image src={photo || "/placeholder.svg"} alt={`Gallery photo ${index}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                    <Button size="sm" variant="secondary">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <Input
                  placeholder="Add caption..."
                  className="text-sm"
                  defaultValue={`Delicious fries photo ${index}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Photo Management Tools */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">Photo Management Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Upload high-quality, well-lit photos of your fries</li>
            <li>• Show different angles and menu items</li>
            <li>• Add descriptive captions to help customers</li>
            <li>• Keep your gallery updated with fresh content</li>
            <li>• Remove blurry or low-quality images</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
