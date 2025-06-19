'use client';

import React, { useEffect, useState } from 'react'
import MainLayouts from '@/components/layouts/MainLayouts'

interface Attraction {
  name: string;
  image: string;
}

interface LuckyLandContent {
  title: string;
  headerImage: string;
  description: string;
  sectionTitle: string;
  attractions: Attraction[];
  websiteInfo: string;
  contactInfo: string;
  isActive: boolean;
}

const LuckyLand = () => {
    const [content, setContent] = useState<LuckyLandContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            console.log('Fetching lucky land content...');
            const response = await fetch('/api/lucky-content');
            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('API data received:', data);
                setContent(data.data.content);
            } else {
                console.error('API response not ok:', response.status);
                // Fallback to default values
                setContent({
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
                });
            }
        } catch (error) {
            console.error('Error fetching lucky land content:', error);
            // Fallback to default values
            setContent({
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

    const defaultAttractions = [
        { name: 'Wahana Permainan', image: '/lucky.png' },
        { name: 'Area Bermain', image: '/lucky.png' },
        { name: 'Spot Foto', image: '/spot.png' }
    ];

    return (
        <div>
            <MainLayouts>
                {/* Hero Section */}
                <div 
                    className='h-screen w-full bg-cover bg-no-repeat bg-center flex items-center justify-center px-4'
                    style={{ backgroundImage: `url(${content?.headerImage || '/lucky.png'})` }}
                >
                    <div className='text-center font-kameron'>
                        <h1 className='text-white text-5xl sm:text-6xl md:text-7xl lg:text-[128px] whitespace-pre-line'>
                            {content?.title || 'Lucky\nLand'}
                        </h1>
                    </div>
                </div>

                {/* Description */}
                <p className='font-kameron text-xl sm:text-2xl text-center mx-auto mt-10 sm:mt-20 px-4 w-full max-w-[667px]'>
                    {content?.description || 'Tempat wisata Lucky Land yang menawarkan berbagai wahana permainan seru dan menyenangkan untuk seluruh keluarga.'}
                </p>

                {/* Section Heading */}
                <h1 className='text-center mx-auto text-[#85A947] font-kameron text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-10 sm:mt-20 px-4 whitespace-pre-line'>
                    {content?.sectionTitle || 'Wahana di\nLucky Land'}
                </h1>

                {/* Attractions Cards */}
                <div className='flex flex-col sm:flex-row flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 mt-10 sm:mt-16 md:mt-24 px-4'>
                    {(content?.attractions || defaultAttractions).map((attraction, index) => (
                        <div
                            key={index}
                            className='aspect-square bg-white overflow-hidden relative w-full sm:w-[250px] md:w-[280px] lg:w-[300px] shadow-md mb-8 sm:mb-0'
                        >
                            {/* Full-sized image */}
                            <img
                                src={attraction.image}
                                alt={attraction.name}
                                className='w-full h-full object-cover'
                            />

                            {/* Centered text overlay with semi-transparent background */}
                            <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
                                <h3 className='font-kameron text-xl sm:text-2xl md:text-3xl text-white text-center'>
                                    {attraction.name.split(' ').map((word, i, arr) => (
                                        <React.Fragment key={i}>
                                            {word}
                                            {i !== arr.length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Info Section */}
                <p className='text-center mx-auto font-kameron text-xl sm:text-2xl mt-10 sm:mt-16 md:mt-24 px-4 mb-10'>
                    {content?.websiteInfo || 'Info Lebih Lanjut Hubungi :'} <br />
                    <span className="text-[#85A947] font-bold">
                        {content?.contactInfo || '0812-3456-7890'}
                    </span>
                </p>
            </MainLayouts>
        </div>
    )
}

export default LuckyLand;
