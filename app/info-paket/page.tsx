'use client';

import MainLayouts from '@/components/layouts/MainLayouts'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface InfoPaketContent {
  title: string;
  promoImage: string;
  isActive: boolean;
}

const page = () => {
    const [content, setContent] = useState<InfoPaketContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch('/api/info-paket/content');
            if (response.ok) {
                const data = await response.json();
                setContent(data.data.content);
            }
        } catch (error) {
            console.error('Error fetching info paket content:', error);
            // Fallback to default values
            setContent({
                title: 'Info Paket\nWisata',
                promoImage: '/poster.png',
                isActive: true
            });
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div>
                <MainLayouts>
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-lg">Loading...</div>
                    </div>
                </MainLayouts>
            </div>
        );
    }

    return (
        <div>
            <MainLayouts>
                <h1 className='text-center mx-auto text-[#85A947] font-kameron text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-10 sm:mt-20 px-4 whitespace-pre-line'>
                    {content?.title || 'Info Paket\nWisata'}
                </h1>
                <Image
                    src={content?.promoImage || '/poster.png'}
                    alt='Poster Info Paket Wisata'
                    width={1280}
                    height={904}
                    className='w-full max-w-[1280px] mx-auto mt-10 sm:mt-20 px-4'
                />
            </MainLayouts>
        </div>
    )
}

export default page