"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import Link from "next/link"
import Image from "next/image"
import { ChefHat, ArrowRight, ArrowLeft, Camera, Upload, X, Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BusinessListing {
  businessName: string
  businessType: string
  description: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  website: string
  specialties: string[]
  hours: Record<string, { open: string; close: string; closed: boolean }>
  images: string[]
}

const businessTypes = [
  { value: "food-truck", label: "Food Truck" },
  { value: "street-vendor", label: "Street Vendor" },
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Cafe" },
  { value: "fast-food", label: "Fast Food" },
]

const popularSpecialties = [
  "Hand-cut",
  "Seasoned",
  "Crispy",
  "Double-fried",
  "Belgian-style",
  "Truffle",
  "Loaded",
  "Gourmet",
  "Organic",
  "Gluten-free",
]

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export default function BusinessListingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const [formData, setFormData] = useState<BusinessListing>({
    businessName: "",
    businessType: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    website: "",
    specialties: [],
    hours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "10:00", close: "16:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: true },
    },
    images: [],
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImages((prev) => [...prev, e.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }))
  }

  const handleHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: value,
        },
      },
    }))
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store listing data
      const listingData = {
        ...formData,
        images: uploadedImages,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: "pending_review",
      }

      localStorage.setItem("businessListing", JSON.stringify(listingData))

      // Redirect to vendor dashboard
      router.push("/vendor-dashboard")
    } catch (error) {
      console.error("Error submitting listing:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const getStepProgress = () => (currentStep / 4) * 100

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

          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Need help?</span>
            <Button variant="outline" className="bg-transparent">
              Contact Support
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Business</h1>
            <p className="text-gray-600">Complete your business profile to start attracting customers</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 4</span>
              <span className="text-sm text-gray-500">{Math.round(getStepProgress())}% Complete</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between mb-8">
            {[
              { step: 1, title: "Basic Info" },
              { step: 2, title: "Location & Hours" },
              { step: 3, title: "Photos & Specialties" },
              { step: 4, title: "Review & Submit" },
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= item.step ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > item.step ? <Check className="w-4 h-4" /> : item.step}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-2xl">Basic Information</CardTitle>
                  </CardHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        placeholder="Golden Crisp Fries"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) => handleInputChange("businessType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="description">Business Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell customers about your delicious fries and what makes them special..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input
                        id="website"
                        placeholder="Website URL"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location & Hours */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-2xl">Location & Operating Hours</CardTitle>
                  </CardHeader>

                  {/* Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Business Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          placeholder="123 Main Street"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          placeholder="10001"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Operating Hours</h3>
                    <div className="space-y-3">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="flex items-center gap-4">
                          <div className="w-24 capitalize font-medium">{day}</div>
                          <Switch
                            checked={!formData.hours[day].closed}
                            onCheckedChange={(checked) => handleHoursChange(day, "closed", !checked)}
                          />
                          {!formData.hours[day].closed ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={formData.hours[day].open}
                                onChange={(e) => handleHoursChange(day, "open", e.target.value)}
                                className="w-32"
                              />
                              <span>to</span>
                              <Input
                                type="time"
                                value={formData.hours[day].close}
                                onChange={(e) => handleHoursChange(day, "close", e.target.value)}
                                className="w-32"
                              />
                            </div>
                          ) : (
                            <span className="text-gray-500">Closed</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Photos & Specialties */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-2xl">Photos & Specialties</CardTitle>
                  </CardHeader>

                  {/* Photo Upload */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Upload Photos</h3>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {isDragActive ? "Drop your photos here" : "Upload photos of your fries"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Show off your delicious fries! Upload high-quality photos to attract customers.
                      </p>
                      <Button type="button" className="bg-orange-500 hover:bg-orange-600">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Photos
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">Supported: JPG, PNG, WebP • Max 5MB per photo</p>
                    </div>

                    {/* Uploaded Images */}
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="relative aspect-square rounded-lg overflow-hidden">
                              <Image
                                src={image || "/placeholder.svg"}
                                alt={`Upload ${index}`}
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Specialties */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Specialties</h3>
                    <p className="text-gray-600">Select what makes your fries special</p>
                    <div className="flex flex-wrap gap-2">
                      {popularSpecialties.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant={formData.specialties.includes(specialty) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            formData.specialties.includes(specialty)
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => handleSpecialtyToggle(specialty)}
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-2xl">Review Your Listing</CardTitle>
                  </CardHeader>

                  <Alert>
                    <Star className="h-4 w-4" />
                    <AlertDescription>
                      Please review all information carefully. Your listing will be reviewed by our team and published
                      within 24 hours.
                    </AlertDescription>
                  </Alert>

                  {/* Review Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Business Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <strong>Name:</strong> {formData.businessName}
                        </div>
                        <div>
                          <strong>Type:</strong> {businessTypes.find((t) => t.value === formData.businessType)?.label}
                        </div>
                        <div>
                          <strong>Phone:</strong> {formData.phone}
                        </div>
                        {formData.website && (
                          <div>
                            <strong>Website:</strong> {formData.website}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Location</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>{formData.address}</div>
                        <div>
                          {formData.city}, {formData.state} {formData.zipCode}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Specialties</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {formData.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Photos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-600">{uploadedImages.length} photos uploaded</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-8 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button type="button" onClick={nextStep} className="bg-orange-500 hover:bg-orange-600">
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {isLoading ? "Submitting..." : "Submit Listing"}
                    <Check className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
