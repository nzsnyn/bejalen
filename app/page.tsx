'use client';

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MainLayouts from '@/components/layouts/MainLayouts'

interface HomepageData {
  content: {
    hero: {
      title: string;
      subtitle: string;
      backgroundImage: string;
    };
    about: {
      title: string;
      description: string;
    };
    rawaPening: {
      title: string;
      subtitle: string;
      description: string;
      image: string;
    };
    destinations: {
      title: string;
      subtitle: string;
    };
  };
  featuredPackages: any[];
  featuredGallery: any[];
  stats: any;
}

export default function Home() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setError(null);
        const response = await fetch('/api/homepage');
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setHomepageData(result.data);
          } else {
            setError(result.error || 'Failed to fetch homepage data');
          }
        } else {
          setError(`Server error: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        setError('Network error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  if (isLoading) {
    return (
      <MainLayouts>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </MainLayouts>
    );
  }

  if (error) {
    return (
      <MainLayouts>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 14.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600">Error loading homepage: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      </MainLayouts>
    );
  }

  const content = homepageData?.content || {
    hero: {
      title: "Desa Wisata, Desa Budaya, Desa Bejalen",
      subtitle: "Dukungan dan kedatangan Anda tidak hanya menciptakan pengalaman bermakna, tetapi juga memberdayakan ekonomi lokal",
      backgroundImage: "/header-home.png"
    },
    about: {
      title: "Desa Wisata Untuk Masa Berkelanjutan",
      description: "Desa Bejalen merupakan salah satu destinasi desa wisata yang terletak di Kecamatan Ambarawa, Kabupaten Semarang, Provinsi Jawa Tengah. Desa ini terletak tepat di pinggir Danau Rawa Pening yang dikelilingi oleh rangkaian pegunungan, yaitu Gunung Merbabu, Gunung Telomoyo, dan Gunung Ungaran."
    },
    rawaPening: {
      title: "Vast Expanse of Swamp Water",
      subtitle: "Desa Wisata Bejalen",
      description: "Menyegarkan pikiran di akhir pekan tidak memerlukan rencana wisata yang mewah. Rekreasi sederhana di Rawa Pening saja bisa jadi kegiatan yang menyenangkan.",
      image: "/header-home2.png"
    },
    destinations: {
      title: "Pada Desa Hepi Desa Bejalen",
      subtitle: "Destinasi"
    }
  };
  return (
    <MainLayouts>
      {/* Hero */}
      <div 
        className="h-screen w-full bg-cover bg-no-repeat bg-center flex items-center justify-center px-4"
        style={{ backgroundImage: `url(${content.hero.backgroundImage})` }}
      >
        <div className='text-center font-kameron'>
          <h1 className='text-white text-3xl sm:text-4xl md:text-5xl lg:text-[64px]'>
            {content.hero.title.split(', ').map((part, index, array) => (
              <React.Fragment key={index}>
                {part}
                {index < array.length - 1 && <br className='hidden sm:block' />}
                {index < array.length - 1 && ', '}
              </React.Fragment>
            ))}
          </h1>
          <p className='text-[#EFE3C2] text-sm sm:text-base md:text-lg mt-5 sm:mt-10 max-w-4xl'>
            {content.hero.subtitle}
          </p>
        </div>
      </div>

      {/* content */}
      <div className='flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 lg:gap-20 mt-12 md:mt-24 px-4'>
        <h1 className='font-kameron text-3xl sm:text-4xl md:text-5xl lg:text-[64px] text-center md:text-right'>
          Desa Wisata <br />Untuk Masa <br />Berkelanjutan
        </h1>
        <p className='font-kameron text-lg sm:text-xl md:text-2xl w-full md:w-[500px] lg:w-[667px]'>
          {content.about.description}
        </p>
      </div>

      <div className='mt-16 md:mt-24 relative px-4 mx-auto max-w-6xl'>
        <div>
          <h1 className='font-kameron text-xl sm:text-2xl md:text-3xl font-medium text-center md:text-right'>
            {content.rawaPening.subtitle}
          </h1>
          <h1 className='font-kameron text-3xl sm:text-4xl md:text-5xl text-center md:text-right text-[#85A947]'>
            {content.rawaPening.title}
          </h1>
        </div>

        <div className='relative mt-10'>
          {/* Card and Image Container */}
          <div className='flex flex-col md:flex-row md:justify-end'>
            {/* Rawa Pening Card */}
            <div className='w-full md:w-[350px] lg:w-[400px] bg-[#85A947] md:absolute md:-left-14 md:top-[25%] md:transform md:-translate-y-1/2 z-10 p-6 md:p-0'>
              <h1 className='text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:ml-11 md:mt-5 font-kameron'>
                Rawa <br />Pening
              </h1>
              <p className='text-white text-lg sm:text-xl md:text-2xl md:ml-11 mt-3 md:mt-5 font-kameron'>
                {content.rawaPening.description}
              </p>
              <Link href="/rawa-pening">
                <div className='flex justify-center items-center gap-2 mt-5 w-[120px] h-10 md:ml-11 bg-[#123524]'>
                    <p className='font-kameron text-sm font-bold text-white'>Selengkapnya</p>
                </div>
              </Link>
            </div>

            {/* Image */}
            <div className='hidden md:block md:w-[70%] lg:w-auto'>
              <Image
                src={content.rawaPening.image}
                alt="Rawa Pening"
                width={800}
                height={500}
                className='w-full'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Destinasi */}
      <div className='mt-16 md:mt-32 px-4'>
        <p className='font-kameron text-center text-2xl md:text-3xl'>{content.destinations.subtitle}</p>
        <h1 className='font-kameron text-center text-4xl sm:text-5xl md:text-6xl'>{content.destinations.title}</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto mt-8 md:mt-16'>
          {(homepageData?.featuredPackages && homepageData.featuredPackages.length > 0) ? (
            homepageData.featuredPackages.slice(0, 3).map((packageItem, index) => {
              // Map package names to routes
              const getRouteFromName = (name: string) => {
                if (name.toLowerCase().includes('perahu mesin')) return '/perahu-mesin';
                if (name.toLowerCase().includes('kampoeng')) return '/kampoeng-rawa';
                if (name.toLowerCase().includes('rawa pening')) return '/rawa-pening';
                return '#'; // fallback
              };

              return (
                <Link href={getRouteFromName(packageItem.name)} key={packageItem.id}>
                  <div className='aspect-square bg-white overflow-hidden relative shadow-md'>
                    {/* Full-sized image */}
                    <Image
                      src={packageItem.imageUrl || '/placeholder.png'}
                      alt={packageItem.name}
                      width={400}
                      height={400}
                      className='w-full h-full object-cover'
                    />

                    {/* Overlay text with gradient background for better readability */}
                    <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4'>
                      <h3 className='font-kameron text-xl sm:text-2xl md:text-3xl text-white'>
                        {packageItem.name.split(' ').map((word: string, i: number, arr: string[]) => (
                          <React.Fragment key={i}>
                            {word}
                            {i !== arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            // Fallback to static data if API data not available
            [
              { name: 'Perahu Mesin', image: '/perahu.png', link: '/perahu-mesin' },
              { name: 'Lucky Sky', image: '/lucky.png', link: '/lucky-land' },
              { name: 'Kampoeng Rawa', image: '/kampoeng.png', link: '/kampoeng-rawa' }
            ].map((destination, index) => (
              <Link href={destination.link} key={index}>
                <div className='aspect-square bg-white overflow-hidden relative shadow-md'>
                  {/* Full-sized image */}
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    width={400}
                    height={400}
                    className='w-full h-full object-cover'
                  />

                  {/* Overlay text with gradient background for better readability */}
                  <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4'>
                    <h3 className='font-kameron text-xl sm:text-2xl md:text-3xl text-white'>
                      {destination.name.split(' ').map((word: string, i: number, arr: string[]) => (
                        <React.Fragment key={i}>
                          {word}
                          {i !== arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </h3>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </MainLayouts>
  )
}