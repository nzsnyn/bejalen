import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MainLayouts from '@/components/layouts/MainLayouts'

export default function Home() {
  return (
    <MainLayouts>
      {/* Hero */}

      <div className='bg-[url(/header-home.png)] h-screen w-full bg-cover bg-no-repeat bg-center flex items-center justify-center px-4'>
        <div className='text-center font-kameron'>
          <h1 className='text-white text-3xl sm:text-4xl md:text-5xl lg:text-[64px]'>Desa Wisata, Desa Budaya, <br className='hidden sm:block' />Desa Bejalen</h1>
          <p className='text-[#EFE3C2] text-sm sm:text-base md:text-lg mt-5 sm:mt-10 max-w-4xl'>Dukungan dan kedatangan Anda tidak hanya menciptakan pengalaman bermakna, <br className='hidden md:block' />tetapi juga memberdayakan ekonomi lokal</p>
        </div>
      </div>

      {/* content */}
      <div className='flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 lg:gap-20 mt-12 md:mt-24 px-4'>
        <h1 className='font-kameron text-3xl sm:text-4xl md:text-5xl lg:text-[64px] text-center md:text-right'>Desa Wisata <br />Untuk Masa <br />Berkelanjutan</h1>
        <p className='font-kameron text-lg sm:text-xl md:text-2xl w-full md:w-[500px] lg:w-[667px]'>Desa Bejalen merupakan salah satu destinasi desa wisata yang terletak di Kecamatan Ambarawa, Kabupaten Semarang, Provinsi Jawa Tengah. Desa ini terletak tepat di pinggir Danau Rawa Pening yang dikelilingi oleh rangkaian pegunungan, yaitu Gunung Merbabu, Gunung Telomoyo, dan Gunung Ungaran.</p>
      </div>

      <div className='mt-16 md:mt-24 relative px-4 mx-auto max-w-6xl'>
        <div>
          <h1 className='font-kameron text-xl sm:text-2xl md:text-3xl font-medium text-center md:text-right'>Desa Wisata Bejalen</h1>
          <h1 className='font-kameron text-3xl sm:text-4xl md:text-5xl text-center md:text-right text-[#85A947]'>Vast Expanse of Swamp Water</h1>
        </div>

        <div className='relative mt-10'>
          {/* Card and Image Container */}
          <div className='flex flex-col md:flex-row md:justify-end'>
            {/* Rawa Pening Card */}
            <div className='w-full md:w-[350px] lg:w-[400px] bg-[#85A947] md:absolute md:-left-14 md:top-[25%] md:transform md:-translate-y-1/2 z-10 p-6 md:p-0'>
              <h1 className='text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:ml-11 md:mt-5 font-kameron'>Rawa <br />Pening</h1>
              <p className='text-white text-lg sm:text-xl md:text-2xl md:ml-11 mt-3 md:mt-5 font-kameron'>Menyegarkan pikiran di akhir pekan tidak memerlukan rencana wisata yang mewah. Rekreasi sederhana di Rawa Pening saja bisa jadi kegiatan yang menyenangkan.</p>
              <Link href="/rawa-pening">
                <div className='flex justify-center items-center gap-2 mt-5 w-[120px] h-10 md:ml-11 bg-[#123524]'>
                    <p className='font-kameron text-sm font-bold text-white'>Selengkapnya</p>
                </div>
              </Link>
            </div>

            {/* Image */}
            <div className='hidden md:block md:w-[70%] lg:w-auto'>
              <Image
                src="/header-home2.png"
                alt="header"
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
        <p className='font-kameron text-center text-2xl md:text-3xl'>Destinasi</p>
        <h1 className='font-kameron text-center text-4xl sm:text-5xl md:text-6xl'>Pada Desa Hepi Desa Bejalen</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto mt-8 md:mt-16'>
          {[
            { name: 'Perahu Mesin', image: '/perahu.png', link: '/perahu-mesin' },
            { name: 'Lucky Sky', image: '/lucky.png', link: '/lucky-land' },
            { name: 'Kampoeng Rawa', image: '/kampoeng.png', link: '/kampoeng-rawa' }
          ].map((destination, index) => (
            <Link href={destination.link} key={index}>
              <div
                className='aspect-square bg-white overflow-hidden relative shadow-md'
              >
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
                    {destination.name.split(' ').map((word, i, arr) => (
                      <React.Fragment key={i}>
                        {word}
                        {i !== arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayouts>
  )
}