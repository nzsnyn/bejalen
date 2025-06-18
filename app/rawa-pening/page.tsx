import React from 'react'
import MainLayouts from '@/components/layouts/MainLayouts'

const RawaPening = () => {
    return (
        <div>
            <MainLayouts>
                {/* Hero Section */}
                <div className='bg-[url(/rawaPeningHeader.png)] h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center px-4'>
                    <div className='text-center font-kameron'>
                        <h1 className='text-white text-5xl sm:text-6xl md:text-7xl lg:text-[128px]'>Rawa<br />Pening</h1>
                    </div>
                </div>

                {/* Description */}
                <p className='font-kameron text-xl sm:text-2xl text-center mx-auto mt-10 sm:mt-20 px-4 w-full max-w-[667px]'>Rawa Pening adalah salah satu destinasi wisata saat kalian berkunjung ke Desa Bejalen. Disini kalian bisa melihat hamparan air yang terbentang luas dengan udara sejuk yang ada di Rawa Pening. Nikmatilah pemandangan alam Rawa Pening melalui Desa Wisata Bejalen</p>

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