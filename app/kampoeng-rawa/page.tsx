'use client';

import React, { useEffect, useState } from 'react'
import MainLayouts from '@/components/layouts/MainLayouts'

interface Attraction {
  name: string;
  image: string;
}

interface KampoengRawaContent {
  title: string;
  headerImage: string;
  description: string;
  sectionTitle: string;
  attractions: Attraction[];
  websiteInfo: string;
  websiteUrl: string;
  isActive: boolean;
}

const KampoengRawa = () => {
    const [content, setContent] = useState<KampoengRawaContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);    useEffect(() => {
        fetchContent();
    }, []);    const fetchContent = async () => {
        try {
            console.log('Fetching kampoeng content...');
            const response = await fetch('/api/kampoeng-content');
            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('API data received:', data);
                setContent(data.data.content);
            } else {
                console.error('API response not ok:', response.status);
                // Fallback to default values
                setContent({
                    title: 'Kampoeng\nRawa',
                    headerImage: '/kampoengRawa.png',
                    description: 'Objek wisata yang paling sering dikunjungi oleh wisatawan Kampoeng Rawa. Nikmati banyak hal-hal menarik yang bisa kalian temukan disini.',
                    sectionTitle: 'Yang Menarik di\nKampoeng Rawa',
                    attractions: [
                        { name: 'Kuliner', image: '/kuliner.png' },
                        { name: 'Joglo Apung', image: '/jogloApung.png' },
                        { name: 'Spot Foto', image: '/spot.png' }
                    ],
                    websiteInfo: 'Info Lebih Lanjut Kunjungi :',
                    websiteUrl: 'https://kampoengrawa.com/',
                    isActive: true
                });
            }
        } catch (error) {
            console.error('Error fetching kampoeng rawa content:', error);
            // Fallback to default values
            setContent({
                title: 'Kampoeng\nRawa',
                headerImage: '/kampoengRawa.png',
                description: 'Objek wisata yang paling sering dikunjungi oleh wisatawan Kampoeng Rawa. Nikmati banyak hal-hal menarik yang bisa kalian temukan disini.',
                sectionTitle: 'Yang Menarik di\nKampoeng Rawa',
                attractions: [
                    { name: 'Kuliner', image: '/kuliner.png' },
                    { name: 'Joglo Apung', image: '/jogloApung.png' },
                    { name: 'Spot Foto', image: '/spot.png' }
                ],
                websiteInfo: 'Info Lebih Lanjut Kunjungi :',
                websiteUrl: 'https://kampoengrawa.com/',
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
        { name: 'Kuliner', image: '/kuliner.png' },
        { name: 'Joglo Apung', image: '/jogloApung.png' },
        { name: 'Spot Foto', image: '/spot.png' }
    ];

    return (
        <div>
            <MainLayouts>
                {/* Hero Section */}
                <div 
                    className='h-screen w-full bg-cover bg-no-repeat bg-center flex items-center justify-center px-4'
                    style={{ backgroundImage: `url(${content?.headerImage || '/kampoengRawa.png'})` }}
                >
                    <div className='text-center font-kameron'>
                        <h1 className='text-white text-5xl sm:text-6xl md:text-7xl lg:text-[128px] whitespace-pre-line'>
                            {content?.title || 'Kampoeng\nRawa'}
                        </h1>
                    </div>
                </div>

                {/* Description */}
                <p className='font-kameron text-xl sm:text-2xl text-center mx-auto mt-10 sm:mt-20 px-4 w-full max-w-[667px]'>
                    {content?.description || 'Objek wisata yang paling sering dikunjungi oleh wisatawan Kampoeng Rawa. Nikmati banyak hal-hal menarik yang bisa kalian temukan disini.'}
                </p>

                {/* Section Heading */}
                <h1 className='text-center mx-auto text-[#85A947] font-kameron text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-10 sm:mt-20 px-4 whitespace-pre-line'>
                    {content?.sectionTitle || 'Yang Menarik di\nKampoeng Rawa'}
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

                {/* Info Section */}
                <p className='text-center mx-auto font-kameron text-xl sm:text-2xl mt-10 sm:mt-16 md:mt-24 px-4 mb-10'>
                    {content?.websiteInfo || 'Info Lebih Lanjut Kunjungi :'} <br />
                    <a href={content?.websiteUrl || 'https://kampoengrawa.com/'} className="text-[#85A947] hover:underline">
                        {content?.websiteUrl || 'https://kampoengrawa.com/'}
                    </a>
                </p>
            </MainLayouts>
        </div>
    )
}

export default KampoengRawa;