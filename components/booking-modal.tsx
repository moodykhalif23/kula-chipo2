"use client"

import { useState } from "react"
import { Calendar, Clock, Users, MapPin, Star, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  vendor: {
    id: number
    name: string
    type: string
    rating: number
    reviews: number
    image: string
    address: string
    phone: string
    deliveryTime: string
    deliveryFee: number
  }
  showReservations?: boolean
}

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  popular?: boolean
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Fries",
    description: "Hand-cut golden fries with sea salt",
    price: 4.99,
    image: "/placeholder.svg?height=100&width=100",
    category: "fries",
    popular: true,
  },
  {
    id: 2,
    name: "Loaded Fries",
    description: "Fries topped with cheese, bacon, and green onions",
    price: 7.99,
    image: "/placeholder.svg?height=100&width=100",
    category: "fries",
    popular: true,
  },
  {
    id: 3,
    name: "Truffle Fries",
    description: "Premium fries with truffle oil and parmesan",
    price: 9.99,
    image: "/placeholder.svg?height=100&width=100",
    category: "fries",
  },
  {
    id: 4,
    name: "Spicy Cajun Fries",
    description: "Fries with our signature cajun seasoning",
    price: 5.99,
    image: "/placeholder.svg?height=100&width=100",
    category: "fries",
  },
  {
    id: 5,
    name: "Coca Cola",
    description: "Classic refreshing cola",
    price: 2.99,
    image: "/placeholder.svg?height=100&width=100",
    category: "drinks",
  },
  {
    id: 6,
    name: "Fresh Lemonade",
    description: "House-made fresh lemonade",
    price: 3.49,
    image: "/placeholder.svg?height=100&width=100",
    category: "drinks",
  },
]

export default function BookingModal({ isOpen, onClose, vendor, showReservations = false }: BookingModalProps) {
  const [activeTab, setActiveTab] = useState("order")
  const [cart, setCart] = useState<Record<number, number>>({})
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    guests: 2,
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  })

  const addToCart = (itemId: number) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }))
  }

  const removeFromCart = (itemId: number) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[itemId] > 1) {
        newCart[itemId]--
      } else {
        delete newCart[itemId]
      }
      return newCart
    })
  }

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find((item) => item.id === Number.parseInt(itemId))
      return total + (item?.price || 0) * quantity
    }, 0)
  }

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  }

  const handleReservationSubmit = () => {
    // Handle reservation submission
    console.log("Reservation submitted:", reservationData)
    onClose()
  }

  const handleOrderSubmit = () => {
    // Handle order submission
    console.log("Order submitted:", cart)
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 flex flex-col">
        {/* Sticky Header */}
        <DialogHeader className="p-6 pb-0 sticky top-0 z-10 bg-background shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">{vendor.name}</DialogTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{vendor.rating}</span>
                  <span>({vendor.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{vendor.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{vendor.deliveryTime}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {showReservations ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="mx-6 grid w-auto grid-cols-2 sticky top-0 z-10 bg-background">
                <TabsTrigger value="order" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Order Food
                </TabsTrigger>
                <TabsTrigger value="reservation" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Book Table
                </TabsTrigger>
              </TabsList>

              <TabsContent value="order" className="flex-1 overflow-hidden mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
                  {/* Menu Items */}
                  <div className="lg:col-span-2 p-6 overflow-y-auto">
                    <div className="space-y-6">
                      {/* Popular Items */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Popular Items</h3>
                        <div className="grid gap-4">
                          {menuItems
                            .filter((item) => item.popular)
                            .map((item) => (
                              <Card key={item.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                      <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        width={80}
                                        height={80}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h4 className="font-semibold">{item.name}</h4>
                                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                          <p className="text-lg font-bold text-orange-500 mt-2">${item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {cart[item.id] ? (
                                            <div className="flex items-center gap-2">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-8 h-8 p-0"
                                              >
                                                <Minus className="w-4 h-4" />
                                              </Button>
                                              <span className="w-8 text-center font-medium">{cart[item.id]}</span>
                                              <Button
                                                size="sm"
                                                onClick={() => addToCart(item.id)}
                                                className="w-8 h-8 p-0 bg-orange-500 hover:bg-orange-600"
                                              >
                                                <Plus className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          ) : (
                                            <Button
                                              size="sm"
                                              onClick={() => addToCart(item.id)}
                                              className="bg-orange-500 hover:bg-orange-600"
                                            >
                                              Add
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>

                      {/* All Fries */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">French Fries</h3>
                        <div className="grid gap-4">
                          {menuItems
                            .filter((item) => item.category === "fries")
                            .map((item) => (
                              <Card key={item.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                      <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        width={80}
                                        height={80}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h4 className="font-semibold flex items-center gap-2">
                                            {item.name}
                                            {item.popular && <Badge className="bg-orange-500 text-xs">Popular</Badge>}
                                          </h4>
                                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                          <p className="text-lg font-bold text-orange-500 mt-2">${item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {cart[item.id] ? (
                                            <div className="flex items-center gap-2">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-8 h-8 p-0"
                                              >
                                                <Minus className="w-4 h-4" />
                                              </Button>
                                              <span className="w-8 text-center font-medium">{cart[item.id]}</span>
                                              <Button
                                                size="sm"
                                                onClick={() => addToCart(item.id)}
                                                className="w-8 h-8 p-0 bg-orange-500 hover:bg-orange-600"
                                              >
                                                <Plus className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          ) : (
                                            <Button
                                              size="sm"
                                              onClick={() => addToCart(item.id)}
                                              className="bg-orange-500 hover:bg-orange-600"
                                            >
                                              Add
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>

                      {/* Drinks */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Drinks</h3>
                        <div className="grid gap-4">
                          {menuItems
                            .filter((item) => item.category === "drinks")
                            .map((item) => (
                              <Card key={item.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                      <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        width={80}
                                        height={80}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h4 className="font-semibold">{item.name}</h4>
                                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                          <p className="text-lg font-bold text-orange-500 mt-2">${item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {cart[item.id] ? (
                                            <div className="flex items-center gap-2">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-8 h-8 p-0"
                                              >
                                                <Minus className="w-4 h-4" />
                                              </Button>
                                              <span className="w-8 text-center font-medium">{cart[item.id]}</span>
                                              <Button
                                                size="sm"
                                                onClick={() => addToCart(item.id)}
                                                className="w-8 h-8 p-0 bg-orange-500 hover:bg-orange-600"
                                              >
                                                <Plus className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          ) : (
                                            <Button
                                              size="sm"
                                              onClick={() => addToCart(item.id)}
                                              className="bg-orange-500 hover:bg-orange-600"
                                            >
                                              Add
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cart Summary */}
                  <div className="border-l bg-gray-50 p-0 min-h-0 flex flex-col">
                    <div className="sticky top-0 z-20 p-6 max-h-[calc(90vh-48px)] overflow-y-auto">
                      <h3 className="text-lg font-semibold mb-4">Your Order</h3>

                      {getCartItemCount() === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-gray-400 mb-2">Your cart is empty</div>
                          <div className="text-sm text-gray-500">Add items to get started</div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {Object.entries(cart).map(([itemId, quantity]) => {
                            const item = menuItems.find((item) => item.id === Number.parseInt(itemId))
                            if (!item) return null

                            return (
                              <div key={itemId} className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-sm text-gray-600">${item.price} each</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeFromCart(item.id)}
                                    className="w-6 h-6 p-0"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-6 text-center text-sm">{quantity}</span>
                                  <Button
                                    size="sm"
                                    onClick={() => addToCart(item.id)}
                                    className="w-6 h-6 p-0 bg-orange-500 hover:bg-orange-600"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })}

                          <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>${getCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Delivery Fee</span>
                              <span>${vendor.deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                              <span>Total</span>
                              <span>${(getCartTotal() + vendor.deliveryFee).toFixed(2)}</span>
                            </div>
                          </div>

                          <Button className="w-full bg-orange-500 hover:bg-orange-600 mt-4" onClick={handleOrderSubmit}>
                            Place Order • ${(getCartTotal() + vendor.deliveryFee).toFixed(2)}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reservation" className="flex-1 overflow-hidden mt-0">
                <div className="p-6 max-w-2xl mx-auto">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Book a Table</h3>
                      <p className="text-gray-600">Reserve your spot at {vendor.name}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={reservationData.date}
                          onChange={(e) => setReservationData((prev) => ({ ...prev, date: e.target.value }))}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Select
                          value={reservationData.time}
                          onValueChange={(value) => setReservationData((prev) => ({ ...prev, time: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="11:30">11:30 AM</SelectItem>
                            <SelectItem value="12:00">12:00 PM</SelectItem>
                            <SelectItem value="12:30">12:30 PM</SelectItem>
                            <SelectItem value="13:00">1:00 PM</SelectItem>
                            <SelectItem value="13:30">1:30 PM</SelectItem>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="18:00">6:00 PM</SelectItem>
                            <SelectItem value="18:30">6:30 PM</SelectItem>
                            <SelectItem value="19:00">7:00 PM</SelectItem>
                            <SelectItem value="19:30">7:30 PM</SelectItem>
                            <SelectItem value="20:00">8:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="guests">Number of Guests</Label>
                        <Select
                          value={reservationData.guests.toString()}
                          onValueChange={(value) =>
                            setReservationData((prev) => ({ ...prev, guests: Number.parseInt(value) }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "Guest" : "Guests"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={reservationData.name}
                          onChange={(e) => setReservationData((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={reservationData.email}
                          onChange={(e) => setReservationData((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="(555) 123-4567"
                          value={reservationData.phone}
                          onChange={(e) => setReservationData((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="requests">Special Requests (Optional)</Label>
                      <Textarea
                        id="requests"
                        placeholder="Any special dietary requirements or seating preferences..."
                        rows={3}
                        value={reservationData.specialRequests}
                        onChange={(e) => setReservationData((prev) => ({ ...prev, specialRequests: e.target.value }))}
                      />
                    </div>

                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Reservation Summary</h4>
                        <div className="space-y-1 text-sm">
                          <div>📅 {reservationData.date || "Date not selected"}</div>
                          <div>🕐 {reservationData.time || "Time not selected"}</div>
                          <div>
                            👥 {reservationData.guests} {reservationData.guests === 1 ? "Guest" : "Guests"}
                          </div>
                          <div>📍 {vendor.name}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600 h-12"
                      onClick={handleReservationSubmit}
                      disabled={
                        !reservationData.date ||
                        !reservationData.time ||
                        !reservationData.name ||
                        !reservationData.email
                      }
                    >
                      Confirm Reservation
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            // Order-only modal for Food Trucks and Street Vendors
            <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
              {/* Menu Items */}
              <div className="lg:col-span-2 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Popular Items */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Popular Items</h3>
                    <div className="grid gap-4">
                      {menuItems
                        .filter((item) => item.popular)
                        .map((item) => (
                          <Card key={item.id} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    width={80}
                                    height={80}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-semibold">{item.name}</h4>
                                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                      <p className="text-lg font-bold text-orange-500 mt-2">${item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {cart[item.id] ? (
                                        <div className="flex items-center gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => removeFromCart(item.id)}
                                            className="w-8 h-8 p-0"
                                          >
                                            <Minus className="w-4 h-4" />
                                          </Button>
                                          <span className="w-8 text-center font-medium">{cart[item.id]}</span>
                                          <Button
                                            size="sm"
                                            onClick={() => addToCart(item.id)}
                                            className="w-8 h-8 p-0 bg-orange-500 hover:bg-orange-600"
                                          >
                                            <Plus className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <Button
                                          size="sm"
                                          onClick={() => addToCart(item.id)}
                                          className="bg-orange-500 hover:bg-orange-600"
                                        >
                                          Add
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* All Fries */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">French Fries</h3>
                    <div className="grid gap-4">
                      {menuItems
                        .filter((item) => item.category === "fries")
                        .map((item) => (
                          <Card key={item.id} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    width={80}
                                    height={80}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-semibold flex items-center gap-2">
                                        {item.name}
                                        {item.popular && <Badge className="bg-orange-500 text-xs">Popular</Badge>}
                                      </h4>
                                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                      <p className="text-lg font-bold text-orange-500 mt-2">${item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {cart[item.id] ? (
                                        <div className="flex items-center gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => removeFromCart(item.id)}
                                            className="w-8 h-8 p-0"
                                          >
                                            <Minus className="w-4 h-4" />
                                          </Button>
                                          <span className="w-8 text-center font-medium">{cart[item.id]}</span>
                                          <Button
                                            size="sm"
                                            onClick={() => addToCart(item.id)}
                                            className="w-8 h-8 p-0 bg-orange-500 hover:bg-orange-600"
                                          >
                                            <Plus className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <Button
                                          size="sm"
                                          onClick={() => addToCart(item.id)}
                                          className="bg-orange-500 hover:bg-orange-600"
                                        >
                                          Add
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Drinks */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Drinks</h3>
                    <div className="grid gap-4">
                      {menuItems
                        .filter((item) => item.category === "drinks")
                        .map((item) => (
                          <Card key={item.id} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    width={80}
                                    height={80}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-semibold">{item.name}</h4>
                                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                      <p className="text-lg font-bold text-orange-500 mt-2">${item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {cart[item.id] ? (
                                        <div className="flex items-center gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => removeFromCart(item.id)}
                                            className="w-8 h-8 p-0"
                                          >
                                            <Minus className="w-4 h-4" />
                                          </Button>
                                          <span className="w-8 text-center font-medium">{cart[item.id]}</span>
                                          <Button
                                            size="sm"
                                            onClick={() => addToCart(item.id)}
                                            className="w-8 h-8 p-0 bg-orange-500 hover:bg-orange-600"
                                          >
                                            <Plus className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <Button
                                          size="sm"
                                          onClick={() => addToCart(item.id)}
                                          className="bg-orange-500 hover:bg-orange-600"
                                        >
                                          Add
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-l bg-gray-50 p-0 min-h-0 flex flex-col">
                <div className="sticky top-0 z-20 p-6 max-h-[calc(90vh-48px)] overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-4">Your Order</h3>

                  {getCartItemCount() === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">Your cart is empty</div>
                      <div className="text-sm text-gray-500">Add items to get started</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(cart).map(([itemId, quantity]) => {
                        const item = menuItems.find((item) => item.id === Number.parseInt(itemId))
                        if (!item) return null

                        return (
                          <div key={itemId} className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600">${item.price} each</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromCart(item.id)}
                                className="w-6 h-6 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-6 text-center text-sm">{quantity}</span>
                              <Button
                                size="sm"
                                onClick={() => addToCart(item.id)}
                                className="w-6 h-6 p-0 bg-orange-500 hover:bg-orange-600"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}

                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery Fee</span>
                          <span>${vendor.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total</span>
                          <span>${(getCartTotal() + vendor.deliveryFee).toFixed(2)}</span>
                        </div>
                      </div>

                      <Button className="w-full bg-orange-500 hover:bg-orange-600 mt-4" onClick={handleOrderSubmit}>
                        Place Order • ${(getCartTotal() + vendor.deliveryFee).toFixed(2)}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
