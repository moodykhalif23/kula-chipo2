"use client"

import { useState } from "react"
import { Calendar, Clock, Users, Phone, Mail, Edit, X, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Reservation {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  guests: number
  status: "confirmed" | "pending" | "cancelled"
  specialRequests?: string
  createdAt: string
}

interface ReservationManagementProps {
  vendorId: string
  vendorName: string
}

const mockReservations: Reservation[] = [
  {
    id: "RES001",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    customerPhone: "(555) 123-4567",
    date: "2024-01-20",
    time: "19:00",
    guests: 4,
    status: "confirmed",
    specialRequests: "Window table if possible",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "RES002",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    customerPhone: "(555) 234-5678",
    date: "2024-01-20",
    time: "20:00",
    guests: 2,
    status: "pending",
    createdAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "RES003",
    customerName: "Mike Davis",
    customerEmail: "mike@example.com",
    customerPhone: "(555) 345-6789",
    date: "2024-01-21",
    time: "18:30",
    guests: 6,
    status: "confirmed",
    specialRequests: "Birthday celebration - need high chair for toddler",
    createdAt: "2024-01-16T09:15:00Z",
  },
]

export default function ReservationManagement({}: ReservationManagementProps) {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const updateReservationStatus = (reservationId: string, newStatus: Reservation["status"]) => {
    setReservations((prev) => prev.map((res) => (res.id === reservationId ? { ...res, status: newStatus } : res)))
  }

  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reservations</h2>
          <p className="text-gray-600">Manage your restaurant bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500">
            {reservations.filter((r) => r.status === "confirmed").length} Confirmed
          </Badge>
          <Badge className="bg-yellow-500">{reservations.filter((r) => r.status === "pending").length} Pending</Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold">{reservation.customerName}</h3>
                    <Badge className={getStatusColor(reservation.status)}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{formatDate(reservation.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{formatTime(reservation.time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{reservation.guests} guests</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{reservation.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{reservation.customerPhone}</span>
                    </div>
                  </div>

                  {reservation.specialRequests && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>Special Requests:</strong> {reservation.specialRequests}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {reservation.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => updateReservationStatus(reservation.id, "confirmed")}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700 bg-transparent"
                        onClick={() => updateReservationStatus(reservation.id, "cancelled")}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedReservation(reservation)
                      setIsEditModalOpen(true)
                    }}
                    className="bg-transparent"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Reservation Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Reservation</DialogTitle>
          </DialogHeader>

          {selectedReservation && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-date">Date</Label>
                  <Input id="edit-date" type="date" defaultValue={selectedReservation.date} />
                </div>
                <div>
                  <Label htmlFor="edit-time">Time</Label>
                  <Input id="edit-time" type="time" defaultValue={selectedReservation.time} />
                </div>
                <div>
                  <Label htmlFor="edit-guests">Number of Guests</Label>
                  <Select defaultValue={selectedReservation.guests.toString()}>
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
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedReservation.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-requests">Special Requests</Label>
                <Textarea id="edit-requests" defaultValue={selectedReservation.specialRequests} rows={3} />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
