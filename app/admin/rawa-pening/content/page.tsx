"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ImageFile {
  name: string
  path: string
  type: 'image'
}

interface RawaPeningContentData {
  title: string
  description: string
  heroImage: string
  content: string
  features: string[]
}

const RawaPeningContentPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [availableImages, setAvailableImages] = useState<ImageFile[]>([])
  const [showImageModal, setShowImageModal] = useState(false)
  const [activeImageField, setActiveImageField] = useState<string>('')
  const [newFeature, setNewFeature] = useState('')
  
  const [formData, setFormData] = useState<RawaPeningContentData>({
    title: 'Rawa Pening',
    description: 'Destinasi wisata alam yang menawan dengan pemandangan danau yang indah.',
    heroImage: '/rawaPeningHeader.png',
    content: 'Rawa Pening merupakan danau alami yang terletak di Kabupaten Semarang, Jawa Tengah. Tempat ini menawarkan keindahan alam yang memukau dengan berbagai aktivitas wisata air yang menarik.',
    features: [
      'Pemandangan danau yang indah',
      'Wisata air dan perahu',
      'Spot foto yang instagramable',
      'Kuliner khas danau'
    ]
  })

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin-token')
      if (!token) {
        router.push('/admin/login')
        return
      }
    }
    checkAuth()
  }, [router])

  // Load available images
  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch('/api/gallery/scan-public')
        if (response.ok) {
          const images = await response.json()
          setAvailableImages(images)
        }
      } catch (error) {
        console.error('Error loading images:', error)
      }
    }
    loadImages()
  }, [])

  // Load content data
  useEffect(() => {
    const loadContent = async () => {
      try {
        console.log('Loading Rawa Pening content...')
        const response = await fetch('/api/rawa-pening-content')
        if (response.ok) {
          const data = await response.json()
          console.log('Loaded content:', data)
          
          setFormData({
            title: data.title || 'Rawa Pening',
            description: data.description || '',
            heroImage: data.heroImage || '/rawaPeningHeader.png',
            content: data.content || '',
            features: Array.isArray(data.features) ? data.features : 
                     (typeof data.features === 'string' ? JSON.parse(data.features) : [])
          })
        }
      } catch (error) {
        console.error('Error loading content:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadContent()
  }, [])

  const handleInputChange = (field: keyof RawaPeningContentData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageSelect = (imagePath: string) => {
    if (activeImageField) {
      handleInputChange(activeImageField as keyof RawaPeningContentData, imagePath)
      setShowImageModal(false)
      setActiveImageField('')
    }
  }

  const openImageModal = (fieldName: string) => {
    setActiveImageField(fieldName)
    setShowImageModal(true)
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      const updatedFeatures = [...formData.features, newFeature.trim()]
      handleInputChange('features', updatedFeatures)
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index)
    handleInputChange('features', updatedFeatures)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      console.log('Saving Rawa Pening content:', formData)
      
      const response = await fetch('/api/rawa-pening-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      console.log('Save response:', result)

      if (response.ok) {
        alert('Konten berhasil disimpan!')
      } else {
        throw new Error(result.error || 'Failed to save content')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Gagal menyimpan konten: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">Kelola Konten Rawa Pening</h1>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Kembali ke Dashboard
              </button>
            </div>
            <p className="text-gray-600">
              Kelola konten untuk halaman Rawa Pening
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Dasar</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan judul..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Image
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.heroImage}
                      onChange={(e) => handleInputChange('heroImage', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="/path/to/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => openImageModal('heroImage')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Pilih
                    </button>
                  </div>
                  {formData.heroImage && (
                    <div className="mt-2">
                      <img
                        src={formData.heroImage}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Singkat
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan deskripsi singkat..."
                />
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Konten Utama</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konten Deskripsi
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan konten deskripsi..."
                />
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Fitur & Keunggulan</h2>
              
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const updatedFeatures = [...formData.features]
                        updatedFeatures[index] = e.target.value
                        handleInputChange('features', updatedFeatures)
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tambah fitur baru..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Perubahan</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pilih Gambar</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableImages.map((image) => (
                <div
                  key={image.path}
                  className="border rounded-lg p-2 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleImageSelect(image.path)}
                >
                  <img
                    src={image.path}
                    alt={image.name}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <p className="text-xs text-gray-600 truncate">{image.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RawaPeningContentPage
