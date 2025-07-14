import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('GET /api/rawa-pening-content - Fetching content...')
    
    let content = await prisma.rawaPeningContent.findFirst()
    
    if (!content) {
      console.log('No content found, creating default content')
      content = await prisma.rawaPeningContent.create({
        data: {
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
        }
      })
    }
    
    console.log('Content fetched successfully:', content)
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error in GET /api/rawa-pening-content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/rawa-pening-content - Updating content...')
    
    const data = await request.json()
    console.log('Received data:', data)

    // Get existing content or create new one
    let content = await prisma.rawaPeningContent.findFirst()
    
    if (!content) {
      console.log('Creating new content')
      content = await prisma.rawaPeningContent.create({
        data: {
          title: data.title || 'Rawa Pening',
          description: data.description || '',
          heroImage: data.heroImage || '/rawaPeningHeader.png',
          content: data.content || '',
          features: data.features || []
        }
      })
    } else {
      console.log('Updating existing content with ID:', content.id)
      content = await prisma.rawaPeningContent.update({
        where: { id: content.id },
        data: {
          title: data.title,
          description: data.description,
          heroImage: data.heroImage,
          content: data.content,
          features: data.features || []
        }
      })
    }
    
    console.log('Content updated successfully:', content)
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error in PUT /api/rawa-pening-content:', error)
    return NextResponse.json(
      { error: 'Failed to update content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
