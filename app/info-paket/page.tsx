import MainLayouts from '@/components/layouts/MainLayouts'
import Image from 'next/image'
import React from 'react'

const page = () => {
    return (
        <div>
            <MainLayouts>
                <h1 className='text-center mx-auto text-[#85A947] font-kameron text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-10 sm:mt-20 px-4'>
                    Info Paket <br />Wisata
                </h1>
                <Image
                    src="/poster.png"
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