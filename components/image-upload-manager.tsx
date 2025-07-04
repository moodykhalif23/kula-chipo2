"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Camera, Upload, Edit, Trash2, Star, Eye, X, AlertCircle, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Photo {
  id: number
  url: string
  caption: string
  category: string
  featured: boolean
  uploadDate: string
  views: number
  likes: number
  file?: File
  uploading?: boolean
  uploadProgress?: number
  error?: string
}

interface UploadingFile {
  file: File
  id: string
  progress: number
  error?: string
}

const mockPhotos: Photo[] = [
  {
    id: 1,
    url: "/placeholder.svg?height=300&width=400",
    caption: "Our signature truffle fries with parmesan cheese",
    category: "menu-items",
    featured: true,
    uploadDate: "2024-01-15",
    views: 1250,
    likes: 89,
  },
  {
    id: 2,
    url: "/placeholder.svg?height=300&width=400",
    caption: "Classic golden fries, perfectly crispy",
    category: "menu-items",
    featured: false,
    uploadDate: "2024-01-14",
    views: 890,
    likes: 67,
  },
  {
    id: 3,
    url: "/placeholder.svg?height=300&width=400",
    caption: "Loaded fries with bacon and cheese",
    category: "menu-items",
    featured: false,
    uploadDate: "2024-01-13",
    views: 1100,
    likes: 78,
  },
]

export default function ImageUploadManager() {
  const [photos, setPhotos] = useState<Photo[]>(mockPhotos)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploads: UploadingFile[] = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
    }))

    setUploadingFiles((prev) => [...prev, ...newUploads])

    // Simulate upload process for each file
    newUploads.forEach((upload) => {
      simulateUpload(upload)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
  })

  const simulateUpload = async (upload: UploadingFile) => {
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setUploadingFiles((prev) => prev.map((u) => (u.id === upload.id ? { ...u, progress } : u)))
      }

      // Create new photo object
      const newPhoto: Photo = {
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(upload.file),
        caption: `New photo - ${upload.file.name}`,
        category: "menu-items",
        featured: false,
        uploadDate: new Date().toISOString().split("T")[0],
        views: 0,
        likes: 0,
      }

      setPhotos((prev) => [newPhoto, ...prev])

      // Remove from uploading files
      setUploadingFiles((prev) => prev.filter((u) => u.id !== upload.id))
    } catch {
      setUploadingFiles((prev) => prev.map((u) => (u.id === upload.id ? { ...u, error: "Upload failed" } : u)))
    }
  }

  const filteredPhotos = photos.filter((photo) => selectedCategory === "all" || photo.category === selectedCategory)

  const handleDeletePhoto = (photoId: number) => {
    setPhotos(photos.filter((photo) => photo.id !== photoId))
  }

  const handleToggleFeatured = (photoId: number) => {
    setPhotos(photos.map((photo) => (photo.id === photoId ? { ...photo, featured: !photo.featured } : photo)))
  }

  const handleUpdatePhoto = (updatedPhoto: Photo) => {
    setPhotos(photos.map((photo) => (photo.id === updatedPhoto.id ? updatedPhoto : photo)))
    setEditingPhoto(null)
  }

  const removeUploadingFile = (uploadId: string) => {
    setUploadingFiles((prev) => prev.filter((u) => u.id !== uploadId))
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New Photos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              {isDragActive ? (
                <>
                  <Upload className="w-12 h-12 text-orange-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-orange-700">Drop your photos here</h3>
                  <p className="text-orange-600">Release to upload your delicious fry photos</p>
                </>
              ) : (
                <>
                  <Camera className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Drag & drop photos here</h3>
                  <p className="text-gray-600 mb-4">or click to browse your files</p>
                  <Button className="bg-orange-500 hover:bg-orange-600 mb-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-500 space-y-1">
              <p>• Supported formats: JPG, PNG, WebP</p>
              <p>• Maximum file size: 5MB per photo</p>
              <p>• Recommended dimensions: 1200x800px</p>
              <p>• Upload multiple photos at once</p>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadingFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold">Uploading Photos</h4>
              {uploadingFiles.map((upload) => (
                <div key={upload.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">{upload.file.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeUploadingFile(upload.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {upload.error ? (
                      <div className="flex items-center gap-1 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{upload.error}</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Progress value={upload.progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{upload.progress}% uploaded</span>
                          <span>{(upload.file.size / 1024 / 1024).toFixed(1)} MB</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Tips */}
      <Alert>
        <Camera className="h-4 w-4" />
        <AlertDescription>
          <strong>Pro Tips:</strong> Take photos in good lighting, show different angles of your fries, and include
          close-ups of textures and toppings. High-quality photos increase customer engagement by 40%!
        </AlertDescription>
      </Alert>

      {/* Gallery Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Photo Gallery ({filteredPhotos.length} photos)</CardTitle>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Photos</SelectItem>
                <SelectItem value="menu-items">Menu Items</SelectItem>
                <SelectItem value="venue">Venue</SelectItem>
                <SelectItem value="process">Cooking Process</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <Card className="overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <Image src={photo.url || "/placeholder.svg"} alt={photo.caption} fill className="object-cover" />
                    {photo.featured && (
                      <Badge className="absolute top-2 left-2 bg-orange-500">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="secondary" onClick={() => setEditingPhoto(photo)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Photo</DialogTitle>
                            </DialogHeader>
                            {editingPhoto && (
                              <div className="space-y-4">
                                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                                  <Image
                                    src={editingPhoto.url || "/placeholder.svg"}
                                    alt={editingPhoto.caption}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="caption">Caption</Label>
                                    <Textarea
                                      id="caption"
                                      value={editingPhoto.caption}
                                      onChange={(e) =>
                                        setEditingPhoto({
                                          ...editingPhoto,
                                          caption: e.target.value,
                                        })
                                      }
                                      rows={3}
                                      placeholder="Describe your delicious fries..."
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                      value={editingPhoto.category}
                                      onValueChange={(value) =>
                                        setEditingPhoto({
                                          ...editingPhoto,
                                          category: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="menu-items">Menu Items</SelectItem>
                                        <SelectItem value="venue">Venue</SelectItem>
                                        <SelectItem value="process">Cooking Process</SelectItem>
                                        <SelectItem value="team">Team</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setEditingPhoto({
                                          ...editingPhoto,
                                          featured: !editingPhoto.featured,
                                        })
                                      }
                                    >
                                      <Star className="w-4 h-4 mr-2" />
                                      {editingPhoto.featured ? "Remove from Featured" : "Set as Featured"}
                                    </Button>
                                    <div className="flex gap-2">
                                      <Button variant="outline" onClick={() => setEditingPhoto(null)}>
                                        Cancel
                                      </Button>
                                      <Button
                                        className="bg-orange-500 hover:bg-orange-600"
                                        onClick={() => handleUpdatePhoto(editingPhoto)}
                                      >
                                        Save Changes
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="secondary" onClick={() => handleToggleFeatured(photo.id)}>
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeletePhoto(photo.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium line-clamp-2 mb-2">{photo.caption}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {photo.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {photo.likes}
                        </span>
                      </div>
                      <span>{new Date(photo.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="text-center py-12">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No photos in this category</h3>
              <p className="text-gray-600">Upload some photos to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{photos.length}</div>
            <div className="text-sm text-gray-600">Total Photos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {photos.reduce((sum, photo) => sum + photo.views, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {photos.reduce((sum, photo) => sum + photo.likes, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{photos.filter((photo) => photo.featured).length}</div>
            <div className="text-sm text-gray-600">Featured Photos</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
