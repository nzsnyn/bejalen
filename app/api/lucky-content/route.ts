import { NextResponse } from 'next/server';

// In-memory storage for the session (will reset on server restart)
let currentLuckyLandContent = {
  title: 'Lucky\nLand',
  headerImage: '/lucky.png',
  description: 'Tempat wisata Lucky Land yang menawarkan berbagai wahana permainan seru dan menyenangkan untuk seluruh keluarga.',
  sectionTitle: 'Wahana di\nLucky Land',
  attractions: [
    { name: 'Wahana Permainan', image: '/lucky.png' },
    { name: 'Area Bermain', image: '/lucky.png' },
    { name: 'Spot Foto', image: '/spot.png' }
  ],
  websiteInfo: 'Info Lebih Lanjut Hubungi :',
  contactInfo: '0812-3456-7890',
  isActive: true
};

export async function GET() {
  try {
    console.log('Getting lucky land content:', JSON.stringify(currentLuckyLandContent, null, 2));
    
    return NextResponse.json({
      success: true,
      data: {
        content: currentLuckyLandContent,
        version: 1,
        updatedAt: new Date().toISOString(),
      },
      message: 'Lucky land content retrieved successfully'
    });
  } catch (error) {
    console.error('Get lucky land content error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    console.log('Received lucky land content update:', JSON.stringify(content, null, 2));

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Update the in-memory content
    currentLuckyLandContent = { ...currentLuckyLandContent, ...content };

    console.log('Updated lucky land content:', JSON.stringify(currentLuckyLandContent, null, 2));

    return NextResponse.json({
      success: true,
      data: {
        content: currentLuckyLandContent,
        version: 2,
        updatedAt: new Date().toISOString(),
      },
      message: 'Lucky land content updated successfully'
    });
  } catch (error) {
    console.error('Update lucky land content error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
