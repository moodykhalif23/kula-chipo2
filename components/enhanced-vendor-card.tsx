"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, Clock, Heart, ShoppingBag, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import BookingModal from "./booking-modal"

interface Vendor {
  id: number
  name: string
  type: string
  icon: any
  image: string
  rating: number
  reviews: number
  distance: string
  status: string
  statusColor: string
  description: string
  specialties: string[]
  address: string
  phone: string
  deliveryTime: string
  deliveryFee: number
  acceptsReservations: boolean
}

interface EnhancedVendorCardProps {
  vendor: Vendor
}

export default function EnhancedVendorCard({ vendor }: EnhancedVendorCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const IconComponent = vendor.icon

  // Only restaurants accept reservations
  const showReservationButton = vendor.type === "Restaurant" && vendor.acceptsReservations

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
        <Link href={`/vendors/${vendor.id}`}>
          <div className="relative h-48">
            <Image
              src={vendor.image || "/placeholder.svg"}
              alt={vendor.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <Badge
              className={`absolute top-4 left-4 ${
                vendor.statusColor === "green"
                  ? "bg-green-500"
                  : vendor.statusColor === "red"
                    ? "bg-red-500"
                    : "bg-yellow-500"
              }`}
            >
              <Clock className="w-3 h-3 mr-1" />
              {vendor.status}
            </Badge>
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsFavorited(!isFavorited)
              }}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
            </button>
          </div>
        </Link>

        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <IconComponent className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-500">{vendor.type}</span>
            <Badge variant="outline" className="text-xs">
              Fast Delivery
            </Badge>
          </div>

          <Link href={`/vendors/${vendor.id}`}>
            <h3 className="text-xl font-semibold mb-2 hover:text-orange-500 transition-colors">{vendor.name}</h3>
          </Link>

          <p className="text-gray-600 mb-3 line-clamp-2">{vendor.description}</p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1 mb-4">
            {vendor.specialties.slice(0, 2).map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{vendor.rating}</span>
              <span className="text-gray-500">({vendor.reviews} reviews)</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">{vendor.distance}</div>
              <div className="text-sm text-green-600 font-medium">{vendor.deliveryTime}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              className={`${showReservationButton ? "flex-1" : "w-full"} bg-orange-500 hover:bg-orange-600 h-10`}
              onClick={() => setIsBookingOpen(true)}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Order Now
            </Button>
            {showReservationButton && (
              <Button
                variant="outline"
                className="px-4 bg-transparent hover:bg-orange-50 hover:border-orange-500"
                onClick={() => setIsBookingOpen(true)}
              >
                <Calendar className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Delivery Info */}
          <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Delivery: ${vendor.deliveryFee.toFixed(2)}</span>
            </div>
            <div>Min order: $15</div>
          </div>
        </CardContent>
      </Card>

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
        showReservations={showReservationButton}
      />
    </>
  )
}
