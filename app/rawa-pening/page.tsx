"use client"

import React, { useState, useEffect } from 'react'
import MainLayouts from '@/components/layouts/MainLayouts'

interface RawaPeningContentData {
  title: string
  description: string
  heroImage: string
  content: string
  features: string[]
}

const RawaPening = () => {
  const [contentData, setContentData] = useState<RawaPeningContentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/rawa-pening-content')
        if (response.ok) {
          const data = await response.json()
          setContentData({
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
        // Set default content if API fails
        setContentData({
          title: 'Rawa Pening',
          description: 'Destinasi wisata alam yang menawan dengan pemandangan danau yang indah.',
          heroImage: '/rawaPeningHeader.png',
          content: 'Rawa Pening adalah salah satu destinasi wisata saat kalian berkunjung ke Desa Bejalen. Disini kalian bisa melihat hamparan air yang terbentang luas dengan udara sejuk yang ada di Rawa Pening. Nikmatilah pemandangan alam Rawa Pening melalui Desa Wisata Bejalen',
          features: ['Pemandangan danau yang indah', 'Wisata air dan perahu', 'Spot foto yang instagramable', 'Kuliner khas danau']
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [])

  if (isLoading) {
    return (
      <MainLayouts>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </MainLayouts>
    )
  }

  if (!contentData) {
    return (
      <MainLayouts>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Content not available</p>
        </div>
      </MainLayouts>
    )
  }

  return (
    <div>
      <MainLayouts>
        {/* Hero Section */}
        <div 
          className='h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center px-4'
          style={{ backgroundImage: `url(${contentData.heroImage})` }}
        >
          <div className='text-center font-kameron'>
            <h1 className='text-white text-5xl sm:text-6xl md:text-7xl lg:text-[128px] whitespace-pre-line'>
              {contentData.title}
            </h1>
          </div>
        </div>

        {/* Description */}
        <p className='font-kameron text-xl sm:text-2xl text-center mx-auto mt-10 sm:mt-20 px-4 w-full max-w-[667px]'>
          {contentData.content}
        </p>

        {/* Features Section */}
        {contentData.features && contentData.features.length > 0 && (
          <div className='mt-12 md:mt-20 px-4'>
            <h2 className='font-kameron text-3xl sm:text-4xl md:text-5xl text-center mb-8'>
              Yang Menarik di Rawa Pening
            </h2>
            <div className='max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6'>
              {contentData.features.map((feature, index) => (
                <div key={index} className='bg-white p-6 rounded-lg shadow-md text-center'>
                  <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-white font-bold text-lg'>{index + 1}</span>
                  </div>
                  <p className='font-kameron text-lg'>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Section */}
        <div className='flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 lg:gap-20 mt-12 md:mt-24 px-4'>
          <h1 className='font-kameron text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center md:text-left'>Beautiful <br />Rawa <br />Pening </h1>
          
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 mt-8 md:mt-0'>
            {[1, 2, 3].map((num) => (
              <img
                key={num}
                src={`/rawa${num}.png`}
                alt={`rawa pening view ${num}`}
                className='w-full h-auto object-cover rounded-md shadow-md'
              />
            ))}
          </div>
        </div>
      </MainLayouts>
    </div>
  )
}

export default RawaPening