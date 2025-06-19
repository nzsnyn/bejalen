'use client';

import React, { useEffect, useState } from 'react'
import MainLayouts from '@/components/layouts/MainLayouts'

interface PerahuMesinContent {
  title: string;
  headerImage: string;
  description: string;
  weekdayPrice: string;
  weekendPrice: string;
  capacity: string;
  duration: string;
  isActive: boolean;
}

const PerahuMesin = () => {
    const [content, setContent] = useState<PerahuMesinContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch('/api/perahu-mesin/content');
            if (response.ok) {
                const data = await response.json();
                setContent(data.data.content);
            }
        } catch (error) {
            console.error('Error fetching perahu mesin content:', error);
            // Fallback to default values
            setContent({
                title: 'Perahu\nMesin',
                headerImage: '/perahuMesinHeader.png',
                description: 'Arungi luasnya Rawa Pening dengan menaiki perahu mesin pada Desa Wisata Bejalen. Nikmati serunya menaiki perahu dengan keluarga, orang tersayang sambil menikmati pemandangan alam sekitar.',
                weekdayPrice: 'IDR. 120.000',
                weekendPrice: 'IDR. 150.000',
                capacity: '8',
                duration: '30 menit',
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
                {/* Hero Section */}
                <div 
                    className='h-screen w-full bg-cover bg-no-repeat bg-center flex items-center justify-center px-4'
                    style={{ backgroundImage: `url(${content?.headerImage || '/perahuMesinHeader.png'})` }}
                >
                    <div className='text-center font-kameron'>
                        <h1 className='text-white text-5xl sm:text-6xl md:text-7xl lg:text-[128px] whitespace-pre-line'>
                            {content?.title || 'Perahu\nMesin'}
                        </h1>
                    </div>
                </div>

                {/* Description Section */}
                <p className='font-kameron text-xl sm:text-2xl text-center mx-auto mt-10 sm:mt-20 px-4 w-full max-w-[667px]'>
                    {content?.description || 'Arungi luasnya Rawa Pening dengan menaiki perahu mesin pada Desa Wisata Bejalen. Nikmati serunya menaiki perahu dengan keluarga, orang tersayang sambil menikmati pemandangan alam sekitar.'}
                </p>

                {/* Pricing Section */}
                <div className='flex flex-col md:flex-row justify-center items-center mt-12 md:mt-24 px-4'>
                    {/* Pricing Header */}
                    <div className='w-full md:w-[404px] bg-[#85A947] py-12 md:h-[568px] flex items-center justify-center'>
                        <h1 className='text-center font-kameron text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white'>
                            Harga <br /> Sewa
                        </h1>
                    </div>
                    
                    {/* Pricing Details */}
                    <div className='flex flex-col sm:flex-row bg-[#EFE3C2] w-full md:w-[884px] py-12 md:h-[568px] justify-center items-center gap-8 sm:gap-20'>
                        {/* Weekday Pricing */}
                        <div className='px-4 mb-8 sm:mb-0'>
                            <h1 className='font-kameron text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center mb-4 sm:mb-8'>
                                Weekdays
                            </h1>
                            <p className='mx-auto font-kameron text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl'>
                                {content?.weekdayPrice || 'IDR. 120.000'} <br />
                                untuk kapasitas <br /> maksimal {content?.capacity || '8'} <br /> orang dan <br />
                                naik selama <br />{content?.duration || '30 menit'}
                            </p>
                        </div>
                        
                        {/* Weekend Pricing */}
                        <div className='px-4'>
                            <h1 className='font-kameron text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center mb-4 sm:mb-8'>
                                Weekend
                            </h1>
                            <p className='mx-auto font-kameron text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl'>
                                {content?.weekendPrice || 'IDR. 150.000'} <br />
                                untuk kapasitas <br /> maksimal {content?.capacity || '8'} <br /> orang dan <br />
                                naik selama <br />{content?.duration || '30 menit'}
                            </p>
                        </div>
                    </div>
                </div>
            </MainLayouts>
        </div>
    )
}

export default PerahuMesin
